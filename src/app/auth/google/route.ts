import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { borrarSesion, COOKIE_REINTENTO, destinoSeguro, urlDeVuelta } from "@/lib/auth/google";
import { createClient } from "@/lib/supabase/server";

// GET /auth/google?next=<destino>
//
// Vuelve a empezar el acceso con Google en ESTE navegador. Lo usa
// /auth/callback cuando el canje falla porque el acceso se empezó en otro:
// el enlace del correo abierto en el navegador de una app (Gmail, Outlook,
// Slack…), que luego pasa Google al navegador de verdad sin la cookie
// `-code-verifier`. Como ya ha entrado en Google aquí, es elegir la cuenta y
// listo. Deja la cookie del reintento para que no se repita en bucle.

export async function GET(request: NextRequest) {
  const { origin } = request.nextUrl;
  const next = destinoSeguro(request.nextUrl.searchParams.get("next"));

  // Una sesión caducada haría que el cliente, al no poder renovarla, se
  // llevara por delante el verificador nuevo (ver /auth/callback).
  const jar = await cookies();
  borrarSesion(jar);

  const supabase = await createClient({ sinSesion: true });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: urlDeVuelta(origin, next), queryParams: { prompt: "select_account" } },
  });
  if (error || !data?.url) return NextResponse.redirect(new URL("/login", origin));

  jar.set(COOKIE_REINTENTO, "1", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
  return NextResponse.redirect(data.url);
}
