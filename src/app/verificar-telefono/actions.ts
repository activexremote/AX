"use server";

import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { normalizePhone, PHONE_OTP_ENABLED } from "@/lib/auth/phone";

/**
 * ══════════════════════════════════════════════════════════
 *  Segundo paso del registro: el teléfono
 * ══════════════════════════════════════════════════════════
 *
 * Cuando se llega aquí ya hay sesión (el enlace del correo la creó), pero el
 * número que se dio en el formulario sigue siendo una promesa: está en los
 * metadatos y no lo ha confirmado nadie.
 *
 * `updateUser({ phone })` no cambia el teléfono de la cuenta: lo deja
 * pendiente y manda un SMS con el código. El cambio se consuma al verificar
 * ese código con `type: "phone_change"`, y es entonces cuando Supabase pone
 * `phone_confirmed_at`, que es justo lo que mira el proxy para dejar entrar.
 */

/** Manda (o reenvía) el código al número pendiente, o a uno corregido. */
export async function sendPhoneCode(formData: FormData) {
  const { t } = await getI18n();
  // Cinturón: las Server Actions se pueden llamar por POST directo, así que
  // el interruptor también se comprueba aquí y no sólo en la pantalla.
  if (!PHONE_OTP_ENABLED) return { error: t.verify.errDisabled };
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.verify.errNoSession };

  const typed = String(formData.get("phone") ?? "").trim();
  const phone = normalizePhone(typed || String(user.user_metadata?.phone ?? ""));
  if (!phone) return { error: t.login.errInvalidPhone };

  const { data, error } = await supabase.auth.updateUser({
    phone,
    // Se corrige también el metadato: si alguien se equivocó de número al
    // registrarse y lo arregla aquí, el bueno tiene que ser el que quede
    // guardado, no el del formulario original.
    data: { phone },
  });

  if (error) return { error: translateOtpError(error.message, t) };

  // Si el proyecto de Supabase no exige confirmación en los cambios de
  // teléfono, el número queda puesto y confirmado sin SMS. No hay código que
  // pedir: se cierra el paso aquí mismo.
  if (data.user?.phone_confirmed_at) {
    await saveProfilePhone(supabase, user.id, phone);
    return { ok: true, verified: true, phone };
  }

  return { ok: true, phone };
}

/** Confirma el código de 6 dígitos y da el teléfono por verificado. */
export async function verifyPhoneCode(formData: FormData) {
  const { t } = await getI18n();
  if (!PHONE_OTP_ENABLED) return { error: t.verify.errDisabled };
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: t.verify.errNoSession };

  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const token = String(formData.get("token") ?? "").replace(/\D/g, "");
  const next = String(formData.get("next") ?? "/") || "/";

  if (!phone) return { error: t.login.errInvalidPhone };
  if (token.length < 6) return { error: t.verify.errInvalidCode };

  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "phone_change" });
  if (error) return { error: translateOtpError(error.message, t) };

  await saveProfilePhone(supabase, user.id, phone);

  // Navegación dura desde el cliente: la sesión acaba de cambiar de estado y
  // el proxy tiene que volver a mirarla para dejar pasar al campus.
  return { ok: true, redirect: next };
}

/** Copia el número al perfil, que es de donde lo lee el campus. */
async function saveProfilePhone(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  phone: string,
) {
  const { error } = await supabase
    .from("profiles")
    .update({ phone, phone_verified_at: new Date().toISOString() })
    .eq("id", userId);

  // No se corta el registro por esto: el teléfono ya está confirmado en la
  // cuenta y la persona puede entrar. Pero se deja constancia, porque si
  // falla suele ser que la migración 0012 no se ha aplicado todavía.
  if (error) {
    console.error(`[registro] no se pudo guardar el teléfono en el perfil ${userId}: ${error.message}`);
  }
}

function translateOtpError(
  msg: string,
  t: Awaited<ReturnType<typeof getI18n>>["t"],
) {
  const lower = msg.toLowerCase();
  // Primero el fallo de configuración: "Unsupported phone provider" lleva
  // dentro la palabra "provider" pero también encajaría en el filtro de
  // código inválido, y decirle a alguien que su código está mal cuando lo
  // que pasa es que no hay proveedor de SMS manda a buscar donde no es.
  if (lower.includes("phone provider") || lower.includes("error sending"))
    return t.verify.errSms;
  if (lower.includes("already been registered") || lower.includes("already exists"))
    return t.verify.errPhoneTaken;
  if (msg.includes("For security purposes") || lower.includes("rate limit"))
    return t.login.errRateLimit;
  if (lower.includes("expired") || lower.includes("invalid") || lower.includes("token"))
    return t.verify.errInvalidCode;
  return msg;
}
