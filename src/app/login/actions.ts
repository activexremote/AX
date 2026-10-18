"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";

/**
 * ══════════════════════════════════════════════════════════
 *  Acceso sólo con Google
 * ══════════════════════════════════════════════════════════
 *
 * Entrar y registrarse son la misma llamada: si la cuenta no existe, Supabase
 * la crea y el trigger `handle_new_user` copia al perfil el nombre y la foto
 * que manda Google. Las cuentas que ya existían por correo (las del webhook de
 * Stripe, las invitadas desde el panel) se enlazan solas a Google en cuanto
 * esa persona entra con la misma dirección.
 *
 * Tener cuenta no es tener acceso: el contenido lo abre la matrícula, que se
 * concede al pagar o a mano desde /admin/usuarios.
 *
 * ⚠︎ Quitar el formulario de correo no basta para cerrar esa puerta: el enlace
 * mágico se puede pedir directamente a Supabase con la clave pública. Lo que
 * la cierra de verdad es apagar el proveedor «Email» en Supabase
 * (Authentication → Providers).
 */
export async function signInWithGoogle(formData: FormData) {
  const { t } = await getI18n();
  const redirectTo = String(formData.get("redirect") ?? "/");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: await callbackUrl(redirectTo),
      // Que Google pregunte siempre con qué cuenta: con varias abiertas en el
      // navegador, si no, entra con la primera sin avisar.
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data?.url) {
    return { error: t.login.oauthFailed };
  }

  redirect(data.url);
}

/** Destino de vuelta de Google: siempre el callback, con el destino final. */
async function callbackUrl(next: string) {
  const origin = await getOrigin();
  return `${origin}/auth/callback?next=${encodeURIComponent(next || "/")}`;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
