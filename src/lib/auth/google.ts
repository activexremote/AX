// ══════════════════════════════════════════════════════════
//  Las piezas del acceso con Google que comparten la acción del login,
//  /auth/google y /auth/callback
// ══════════════════════════════════════════════════════════

/** Marca la vuelta de Google en /auth/callback (los enlaces mágicos no la llevan). */
export const VIA_GOOGLE = "google";

/** Cookie del único reintento: si el segundo canje también falla, se enseña el error. */
export const COOKIE_REINTENTO = "axr_google_reintento";

/** Sesión guardada de Supabase (`sb-<ref>-auth-token`, en trozos `.0`, `.1`…), no el `-code-verifier`. */
export const COOKIE_SESION = /-auth-token(\.\d+)?$/;

/** Sólo destinos de este sitio: «/algo», nunca «//otro.com». */
export const destinoSeguro = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/");

/** Adonde vuelve Google: el canjeador, con el destino final y la marca. */
export function urlDeVuelta(origin: string, next: string) {
  const u = new URL("/auth/callback", origin);
  u.searchParams.set("next", next || "/");
  u.searchParams.set("via", VIA_GOOGLE);
  return u.toString();
}
