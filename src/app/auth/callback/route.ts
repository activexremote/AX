import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { PHONE_OTP_ENABLED } from "@/lib/auth/phone";

/**
 * Aterrizaje del enlace mágico (y del acceso con Google): se canjea el código
 * por sesión y se sigue al destino.
 *
 * Con la verificación por SMS encendida, una cuenta recién creada trae un
 * teléfono que no ha confirmado nadie y se manda al SMS antes que al campus.
 * El proxy vigila lo mismo en cada navegación, así que esto no es la
 * cerradura, sino el ahorro de un salto. Apagada —como está hoy— se va
 * directo al destino.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    // Una sesión vieja en el navegador (alguien que ya había entrado y le
    // caducó) se va antes de canjear. Si no, el cliente intenta renovarla al
    // arrancar, no puede, y al darla por perdida borra también la cookie
    // `-code-verifier` del acceso con Google: el canje falla y sale «Este
    // enlace ya no sirve» por mucho que se repita. La sesión nueva la
    // sustituye igualmente.
    const jar = await cookies();
    for (const c of jar.getAll()) if (/-auth-token(\.\d+)?$/.test(c.name)) jar.delete(c.name);

    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const user = data.user;
      if (PHONE_OTP_ENABLED && user?.user_metadata?.phone && !user.phone_confirmed_at) {
        const verify = new URL("/verificar-telefono", origin);
        verify.searchParams.set("next", next);
        return NextResponse.redirect(verify);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Sin código (o con uno que ya no vale) queda una posibilidad: que los
  // tokens vengan en el FRAGMENTO de la URL, que el servidor no puede ver
  // —no se envía nunca—. Sólo el navegador puede recogerlo, así que se manda
  // a la página que lo hace. El fragmento sobrevive a la redirección.
  const recoger = new URL("/auth/sesion", origin);
  recoger.searchParams.set("next", next);
  if (code) recoger.searchParams.set("error_description", "El enlace ya se había usado o se abrió en otro navegador.");
  return NextResponse.redirect(recoger);
}
