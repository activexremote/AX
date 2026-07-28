"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";

export async function signInWithPassword(formData: FormData) {
  const { t } = await getI18n();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/");

  if (!email || !password) {
    return { error: t.login.errMissingFields };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message, t) };
  }

  redirect(redirectTo || "/");
}

export async function signUpWithPassword(formData: FormData) {
  const { t } = await getI18n();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!email || !password) {
    return { error: t.login.errMissingSignup };
  }
  if (password.length < 6) {
    return { error: t.login.errPasswordShort };
  }
  if (!email.includes("@")) {
    return { error: t.login.errInvalidEmail };
  }

  const redirectTo = String(formData.get("redirect") ?? "/");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName || email.split("@")[0] },
      emailRedirectTo: `${await getOrigin()}/auth/callback`,
    },
  });

  if (error) {
    return { error: translateAuthError(error.message, t) };
  }

  // Supabase oculta el email ya registrado devolviendo un usuario sin
  // identidades y sin sesión (anti-enumeración): lo tratamos como "ya existe".
  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return { error: t.login.errAlreadyRegistered };
  }

  // Si la confirmación por email está desactivada, signUp ya devuelve sesión:
  // entramos directos al campus. Si no, mostramos el aviso de "revisa tu correo".
  if (data.session) {
    redirect(redirectTo || "/");
  }

  return { ok: true, message: t.login.signupOk };
}

export async function signInWithGoogle(formData: FormData) {
  const { t } = await getI18n();
  const redirectTo = String(formData.get("redirect") ?? "/");
  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error || !data?.url) {
    return { error: t.login.oauthFailed };
  }

  redirect(data.url);
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
  if (msg.includes("Invalid login credentials")) return t.login.errBadCredentials;
  if (msg.includes("User already registered")) return t.login.errAlreadyRegistered;
  return msg;
}
