import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { COOKIE_SESION } from "@/lib/auth/google";

/**
 * `sinSesion`: el cliente no ve la sesión guardada. Para empezar o canjear un
 * acceso: con una sesión vieja que no se puede renovar, el cliente la da por
 * perdida al arrancar y se lleva con ella la cookie `-code-verifier`.
 */
export async function createClient({ sinSesion = false }: { sinSesion?: boolean } = {}) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const todas = cookieStore.getAll();
          return sinSesion ? todas.filter((c) => !COOKIE_SESION.test(c.name)) : todas;
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — ignored, refresh handled in middleware
          }
        },
      },
    },
  );
}
