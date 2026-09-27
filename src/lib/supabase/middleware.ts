import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

import { PHONE_OTP_ENABLED } from "@/lib/auth/phone";

const PUBLIC_PATHS = [
  "/bienvenida",
  "/cursos",
  // Los textos legales tienen que ser accesibles sin sesión: el aviso de
  // cookies enlaza a ellos y la LSSI exige acceso permanente y directo.
  "/legal",
  "/glosario",
  "/blog",
  // La landing de campaña. Sin esto el candado del campus mandaba al login a
  // todo el tráfico de anuncios: la ruta es pública, como /bienvenida.
  "/trabajo-remoto",
  // El checkout se hace sin cuenta: la cuenta se crea al confirmarse el pago.
  "/matricula",
  "/login",
  "/auth/callback",
  // Recoge la sesión que llega en el fragmento de la URL. Tiene que ser
  // pública: quien aterriza aquí todavía no tiene sesión, justo por eso viene.
  "/auth/sesion",
  "/auth/sign-out",
];

/** Segundo paso del registro: el SMS que confirma el teléfono. */
const VERIFY_PATH = "/verificar-telefono";

/**
 * Registro a medias: hay cuenta y sesión, hay un teléfono declarado en el
 * alta, y nadie ha contestado todavía al código.
 *
 * Se mira `user_metadata.phone` y no el perfil a propósito: el usuario ya
 * viene resuelto de `getUser()`, así que la comprobación no cuesta ni una
 * consulta más en cada navegación. Y sólo afecta a quien se registró por el
 * formulario: las cuentas que crea el webhook de Stripe al cobrar una
 * matrícula no traen teléfono en los metadatos y entran como siempre.
 *
 * Mientras el SMS esté apagado esto no se cumple nunca y el candado no
 * existe: se entra con el enlace del correo y punto.
 */
function faltaVerificarTelefono(user: User): boolean {
  if (!PHONE_OTP_ENABLED) return false;
  return Boolean(user.user_metadata?.phone) && !user.phone_confirmed_at;
}

/** Cookie de sesión que Supabase quiere escribir en la respuesta. */
type SessionCookie = { name: string; value: string; options: Record<string, unknown> };

export type SessionResult = {
  /** Respuesta final (login o campus). Si viene, no hay nada más que hacer. */
  redirect?: NextResponse;
  /** Cookies refrescadas, que quien construya la respuesta tiene que copiar. */
  cookies: SessionCookie[];
  /** Si hay sesión. Lo usa el proxy para no redirigir por idioma a quien ya
   *  está dentro del campus: ahí el idioma lo lleva su cookie. */
  hasUser: boolean;
};

/**
 * Refresca la sesión y decide si la ruta se puede ver sin ella.
 *
 * Devuelve las cookies en vez de la respuesta porque el proxy tiene que
 * construir la suya (una reescritura, cuando la URL lleva idioma) y no puede
 * usar la que se armase aquí. Perder esas cookies es perder la sesión en cada
 * navegación, así que quien llama está obligado a copiarlas.
 *
 * `path` es la ruta SIN prefijo de idioma: /en/blog y /blog son la misma
 * página a efectos de permisos.
 */
export async function updateSession(
  request: NextRequest,
  path: string,
): Promise<SessionResult> {
  const cookies: SessionCookie[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            cookies.push({ name, value, options: options as Record<string, unknown> });
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La raíz "/" es pública: sirve la landing a invitados y el campus a
  // usuarios con sesión (el reparto lo hace (campus)/layout.tsx).
  // Ficheros que los rastreadores piden sin sesión: si el proxy los manda al
  // login, el sitio queda invisible para los buscadores.
  const isCrawlerFile =
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/llms.txt" ||
    path === "/favicon.ico" ||
    path === "/opengraph-image" ||
    path === "/manifest.webmanifest";

  const isPublic =
    path === "/" ||
    isCrawlerFile ||
    PUBLIC_PATHS.some((p) => path.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Se vuelve a la URL que la persona veía, con su prefijo de idioma.
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return { redirect: NextResponse.redirect(url), cookies, hasUser: false };
  }

  // El campus se queda cerrado hasta que el teléfono esté confirmado. Las
  // páginas públicas siguen abiertas —quien esté a medias puede seguir
  // leyendo el blog— pero "/" no cuenta como pública aquí: para quien tiene
  // sesión, "/" ES el campus.
  if (user && faltaVerificarTelefono(user) && path !== VERIFY_PATH && (path === "/" || !isPublic)) {
    const url = request.nextUrl.clone();
    url.pathname = VERIFY_PATH;
    url.search = "";
    url.searchParams.set("next", request.nextUrl.pathname);
    return { redirect: NextResponse.redirect(url), cookies, hasUser: true };
  }

  // Y al revés: quien no tiene nada pendiente no se queda encallado en la
  // pantalla del SMS si vuelve a ella con el botón de atrás.
  if (user && !faltaVerificarTelefono(user) && path === VERIFY_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return { redirect: NextResponse.redirect(url), cookies, hasUser: true };
  }

  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return { redirect: NextResponse.redirect(url), cookies, hasUser: true };
  }

  return { cookies, hasUser: Boolean(user) };
}
