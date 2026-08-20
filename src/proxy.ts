import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n/config";
import { isBot, negotiateLocale } from "@/lib/i18n/negotiate";
import {
  LOCALE_HEADER,
  LOCALIZED_ROOTS,
  translatePath,
  untranslatePath,
} from "@/lib/i18n/routing";

// El proxy corre antes que cualquier página y decide las tres cosas que se
// resuelven mirando sólo la petición: en qué idioma se sirve, con qué ruta
// interna y si hace falta sesión.

/** Portada de cada idioma. El campus vive en "/" y no se traduce por URL. */
const HOME = "/bienvenida";

/** Un año: la preferencia de idioma no cambia de un día para otro. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * ══════════════════════════════════════════════════════════
 *  Detección de idioma
 * ══════════════════════════════════════════════════════════
 *
 * Sólo se detecta cuando la persona NO ha dicho nada todavía: sin cookie de
 * idioma. En cuanto hay señal —la cookie, o el selector— se respeta y no se
 * vuelve a decidir por ella. Sin ese recuerdo, alguien con el navegador en
 * inglés no podría leer la web en español ni queriendo: cada clic lo
 * devolvería a /en.
 *
 * ⚠︎ A los rastreadores NUNCA se les redirige. Googlebot rastrea casi siempre
 * con `Accept-Language: en`; si se le tratara como a una persona, jamás
 * llegaría a la versión española y dejaría de indexarla, y con ella se caería
 * medio hreflang. Un buscador recibe exactamente la URL que pidió.
 *
 * La redirección es 302, no 308: el destino bueno depende de quién pregunta,
 * así que no puede quedarse cacheada como permanente.
 */
function detectar(request: NextRequest): Locale | null {
  if (isBot(request.headers.get("user-agent"))) return null;
  if (isLocale(request.cookies.get(LOCALE_COOKIE)?.value)) return null;
  return negotiateLocale(request.headers.get("accept-language"));
}

/** Recuerda el idioma para que la detección ocurra una vez, no en cada visita. */
function recordar(res: NextResponse, locale: Locale): NextResponse {
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return res;
}

/**
 * Marca que la respuesta depende del idioma del navegador y de la cookie.
 *
 * Se aplica sólo a las REDIRECCIONES, que es donde importa y donde además
 * funciona: una redirección por idioma cacheada en un CDN mandaría a todo el
 * mundo al idioma del primero que pasó por ahí. En las páginas renderizadas
 * este encabezado lo gestiona Next —lo necesita para la navegación RSC— y
 * pisarlo rompería más de lo que arregla; da igual, porque salen con
 * `Cache-Control: private, no-store` y no hay caché compartida que envenenar.
 */
function vary(res: NextResponse): NextResponse {
  res.headers.set("Vary", "Accept-Language, Cookie");
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const [, first, ...rest] = pathname.split("/");

  // ── Override explícito: ?lang=es|en ──
  // Fija el idioma y limpia el parámetro. Sirve para compartir un enlace en un
  // idioma concreto y para probar la detección sin cambiar el navegador.
  const pedido = searchParams.get("lang");
  if (isLocale(pedido)) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const interno = first === "en" ? untranslatePath(`/${rest.join("/")}`) : pathname;
    url.pathname = pedido === "en" ? `/en${translatePath("en", interno)}` : interno;
    return recordar(NextResponse.redirect(url, 302), pedido);
  }

  if (first === "es") {
    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join("/")}` || "/";
    return NextResponse.redirect(url, 308);
  }

  const prefixed = first === "en";

  if (prefixed && rest.filter(Boolean).length === 0) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${translatePath("en", HOME)}`;
    return NextResponse.redirect(url, 308);
  }

  const path = prefixed ? untranslatePath(`/${rest.join("/")}`) : pathname;
  const root = path.split("/")[1] ?? "";

  // Las URL inglesas escritas en español (/en/bienvenida) pueden estar
  // enlazadas o indexadas: se mandan a la buena en vez de servir lo mismo en
  // dos direcciones.
  if (prefixed) {
    const canonical = `/en${translatePath("en", path)}`;
    if (canonical !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = canonical;
      return NextResponse.redirect(url, 308);
    }
  }

  // /en/mis-tareas no es una página en inglés: el campus no se traduce por
  // URL. Cae en el 404 normal en vez de reescribirse a una ruta privada.
  if (prefixed && !(LOCALIZED_ROOTS as readonly string[]).includes(root)) {
    return NextResponse.next();
  }

  const publica = (LOCALIZED_ROOTS as readonly string[]).includes(root);
  const detectado = detectar(request);

  // Una URL española pedida por alguien cuyo navegador va en inglés y que no
  // ha elegido nada todavía: se le lleva a su versión, una sola vez.
  if (!prefixed && publica && detectado === "en") {
    const url = request.nextUrl.clone();
    url.pathname = `/en${translatePath("en", path)}`;
    return vary(recordar(NextResponse.redirect(url, 302), "en"));
  }

  const session = await updateSession(request, path);
  if (session.redirect) return session.redirect;

  // La raíz sirve la portada a invitados y el campus a quien tiene sesión.
  // Sólo se redirige al invitado: dentro del campus el idioma lo lleva la
  // cookie, y sacar a alguien de su panel por su navegador sería absurdo.
  if (pathname === "/" && !session.hasUser && detectado === "en") {
    const url = request.nextUrl.clone();
    url.pathname = `/en${translatePath("en", HOME)}`;
    return vary(recordar(NextResponse.redirect(url, 302), "en"));
  }

  const headers = new Headers(request.headers);
  // La cabecera de idioma SÓLO se pone en las páginas que llevan idioma en la
  // URL. En las privadas —login, campus, panel— no hay URL que mande, así que
  // fijarla aquí a "es" bloqueaba a `getLocale()`: ni la cookie ni el idioma
  // del navegador llegaban a mirarse, y el login salía en español siempre.
  if (publica) headers.set(LOCALE_HEADER, prefixed ? "en" : "es");

  let response: NextResponse;
  if (prefixed) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    response = NextResponse.rewrite(url, { request: { headers } });
  } else {
    response = NextResponse.next({ request: { headers } });
  }

  // Quien entra directo a una URL con prefijo, o a una española con el
  // navegador en español, también deja fijada su preferencia: a partir de ahí
  // el campus y el resto de la navegación ya no dependen de la cabecera.
  if (detectado) recordar(response, prefixed ? "en" : detectado);

  for (const c of session.cookies) response.cookies.set(c.name, c.value, c.options);
  return response;
}

export const config = {
  // ⚠︎ "api/" queda fuera a propósito. Antes no lo estaba, y como /api no
  // figura entre las rutas públicas, updateSession redirigía cada llamada al
  // login: los tres crons de Vercel (recordatorios y los dos resúmenes)
  // recibían un 307 y no llegaban a ejecutarse nunca, y el webhook de Stripe
  // habría corrido la misma suerte. Cada endpoint de /api se autentica solo:
  // los crons con CRON_SECRET y Stripe con la firma del webhook.
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav)$).*)",
  ],
};
