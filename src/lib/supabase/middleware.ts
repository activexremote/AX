import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = [
  "/bienvenida",
  "/cursos",
  // Los textos legales tienen que ser accesibles sin sesión: el aviso de
  // cookies enlaza a ellos y la LSSI exige acceso permanente y directo.
  "/legal",
  "/glosario",
  "/blog",
  // El checkout se hace sin cuenta: la cuenta se crea al confirmarse el pago.
  "/matricula",
  "/login",
  "/auth/callback",
  "/auth/sign-out",
];

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

  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return { redirect: NextResponse.redirect(url), cookies, hasUser: true };
  }

  return { cookies, hasUser: Boolean(user) };
}
