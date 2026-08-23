"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { normalizePhone } from "@/lib/auth/phone";

/**
 * ══════════════════════════════════════════════════════════
 *  Acceso sin contraseña
 * ══════════════════════════════════════════════════════════
 *
 * Entrar y registrarse son la misma llamada de Supabase (`signInWithOtp`) con
 * una diferencia: si la cuenta puede crearse o no.
 *
 *  · Entrar    → shouldCreateUser: false. Quien no tenga cuenta no entra por
 *                aquí: el registro pide nombre y teléfono, y crear la cuenta
 *                desde el formulario de acceso los saltaría.
 *  · Registro  → shouldCreateUser: true, con el nombre y el teléfono metidos
 *                en los metadatos del enlace. La cuenta no existe hasta que
 *                se abre el correo, así que esos datos viajan con el enlace y
 *                el trigger `handle_new_user` los copia al perfil.
 *
 * El enlace lleva a /auth/callback, que canjea el código por sesión. El
 * teléfono todavía no está verificado ahí: eso lo hace /verificar-telefono
 * con un código por SMS.
 */

export async function sendSignInLink(formData: FormData) {
  const { t } = await getI18n();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const redirectTo = String(formData.get("redirect") ?? "/");

  if (!email) return { error: t.login.errMissingFields };
  if (!email.includes("@")) return { error: t.login.errInvalidEmail };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: await callbackUrl(redirectTo),
    },
  });

  if (error) return { error: translateAuthError(error.message, t) };

  return { ok: true, sent: email };
}

export async function sendSignUpLink(formData: FormData) {
  const { t } = await getI18n();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const rawPhone = String(formData.get("phone") ?? "").trim();
  const redirectTo = String(formData.get("redirect") ?? "/");

  // Los tres son obligatorios: el nombre para dirigirse a la persona, el
  // correo para entrar y el teléfono porque es lo que se verifica después.
  if (!fullName || !email || !rawPhone) return { error: t.login.errMissingSignup };
  if (!email.includes("@")) return { error: t.login.errInvalidEmail };

  const phone = normalizePhone(rawPhone);
  if (!phone) return { error: t.login.errInvalidPhone };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // Sólo se aplican si la cuenta se crea. Si el correo ya existe,
      // Supabase manda un enlace de acceso normal y no toca los metadatos:
      // es su forma de no revelar quién está registrado y quién no, y aquí
      // viene bien, porque el registro de alguien que ya tiene cuenta acaba
      // simplemente en que entra.
      data: { full_name: fullName, phone },
      emailRedirectTo: await callbackUrl(redirectTo),
    },
  });

  if (error) return { error: translateAuthError(error.message, t) };

  return { ok: true, sent: email };
}

export async function signInWithGoogle(formData: FormData) {
  const { t } = await getI18n();
  const redirectTo = String(formData.get("redirect") ?? "/");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: await callbackUrl(redirectTo) },
  });

  if (error || !data?.url) {
    return { error: t.login.oauthFailed };
  }

  redirect(data.url);
}

/** Destino del enlace del correo: siempre el callback, con el destino final. */
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

function translateAuthError(
  msg: string,
  t: Awaited<ReturnType<typeof getI18n>>["t"],
) {
  // Es lo que responde Supabase cuando se pide un enlace para un correo que
  // no tiene cuenta y no se le deja crearla.
  if (msg.includes("Signups not allowed")) return t.login.errNoAccount;
  if (msg.includes("User already registered")) return t.login.errAlreadyRegistered;
  // "For security purposes, you can only request this after N seconds".
  if (msg.includes("For security purposes") || msg.toLowerCase().includes("rate limit")) {
    return t.login.errRateLimit;
  }
  return msg;
}
