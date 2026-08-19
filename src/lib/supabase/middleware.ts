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
  "/login",
  "/auth/callback",
  "/auth/sign-out",
];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // La raíz "/" es pública: sirve la landing a invitados y el campus a
  // usuarios con sesión (el reparto lo hace (campus)/layout.tsx).
  // Ficheros que los rastreadores piden sin sesión: si el middleware los
  // manda al login, el sitio queda invisible para los buscadores.
  const isCrawlerFile =
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.webmanifest";

  const isPublic =
    pathname === "/" ||
    isCrawlerFile ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}
