import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { SITE_URL } from "@/lib/seo";
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

/**
 * ══════════════════════════════════════════════════════════
 *  Un solo dominio en producción
 * ══════════════════════════════════════════════════════════
 *
 * Vercel sirve cada despliegue también en su propia URL (ax-red.vercel.app y
 * las de cada build). Entrar por ahí funciona, pero parte la casa en dos:
 *
 *  · La sesión se guarda en la cookie de ESE dominio, así que quien entra por
 *    la URL de Vercel no está identificado en activexremote.com y al revés.
 *  · El enlace de acceso del correo se construye con el dominio desde el que
 *    se pidió, así que un login empezado ahí te deja dentro de ahí para
 *    siempre.
 *  · Y esas URL pueden acabar indexadas: el mismo sitio en dos direcciones.
 *
 * Por eso, en producción, cualquier *.vercel.app se manda al dominio bueno.
 * Los despliegues de vista previa NO se tocan (VERCEL_ENV vale "preview"):
 * ahí la URL de Vercel es justamente lo que se quiere probar.
 */
// `SITE_URL` de respaldo: si mañana falta la variable de entorno, el dominio
// bueno sigue siendo el mismo y no conviene que el redirector se apague solo.
const CANONICAL_HOST = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL)
  .replace(/^https?:\/\//, "")
  .replace(/\/+$/, "");

function canonicalizar(request: NextRequest): NextResponse | null {
  if (process.env.VERCEL_ENV !== "production" || !CANONICAL_HOST) return null;
  const host = request.headers.get("host") ?? "";
  if (!host.endsWith(".vercel.app")) return null;

  const url = request.nextUrl.clone();
  url.protocol = "https:";
  url.host = CANONICAL_HOST;
  url.port = "";
  return NextResponse.redirect(url, 308);
}

/**
 * ══════════════════════════════════════════════════════════
 *  El enlace del correo que aterriza donde no debe
 * ══════════════════════════════════════════════════════════
 *
 * El enlace de acceso tiene que llegar a /auth/callback, que es quien canjea
 * el código por sesión. Pero Supabase sólo respeta la URL de retorno que le
 * pedimos si está en su lista de URL permitidas; si no lo está, manda a la
 * "Site URL" del proyecto —la raíz— con el código colgando:
 *
 *     https://www.activexremote.com/?code=9d946b43-…
 *
 * Ahí no hay nadie escuchando, así que la persona ve la portada y cree que el
 * acceso ha fallado. Esto lo recoge: venga el código donde venga, se lleva a
 * /auth/callback con el destino puesto.
 *
 * Es una red, no la solución: lo correcto es tener en Supabase
 * (Authentication → URL Configuration → Redirect URLs) el dominio con y sin
 * www. Pero la red se queda, porque esa lista se toca a mano y un despiste
 * ahí deja a todo el mundo fuera del campus.
 */
function rescatarCodigo(request: NextRequest): NextResponse | null {
  if (request.method !== "GET") return null;

  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/auth/callback") return null;

  const code = searchParams.get("code");
  if (!code) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/auth/callback";
  // El destino es donde aterrizó: si el enlace traía "next", ése manda.
  const next = searchParams.get("next") || (pathname === "/" ? "/" : pathname);
  url.search = "";
  url.searchParams.set("code", code);
  url.searchParams.set("next", next);
  return NextResponse.redirect(url, 302);
}

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
  // Lo primero: si esto es la URL de Vercel en producción, se sale de aquí
  // antes de tocar idioma o sesión.
  const canonica = canonicalizar(request);
  if (canonica) return canonica;

  // Y si llega un código de acceso suelto, al canjeador antes que a nada.
  const rescate = rescatarCodigo(request);
  if (rescate) return rescate;

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
  // ⚠︎ Los vídeos también quedan fuera. Un mp4 se sirve por rangos (el
  // navegador pide trozos con `Range` para poder buscar dentro del vídeo) y
  // hacer pasar cada uno de esos trozos por la negociación de idioma y por
  // `updateSession` es trabajo tirado en cada segundo de reproducción.
  //
  // ⚠︎ "api/" queda fuera a propósito. Antes no lo estaba, y como /api no
  // figura entre las rutas públicas, updateSession redirigía cada llamada al
  // login: los tres crons de Vercel (recordatorios y los dos resúmenes)
  // recibían un 307 y no llegaban a ejecutarse nunca, y el webhook de Stripe
  // habría corrido la misma suerte. Cada endpoint de /api se autentica solo:
  // los crons con CRON_SECRET y Stripe con la firma del webhook.
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|mp4|webm|m4v)$).*)",
  ],
};
