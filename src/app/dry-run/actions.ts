"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { signInWithGoogle } from "@/app/login/actions";
import { COOKIE_RESERVA, type CookieReserva } from "@/lib/dry-run/reserva";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const UTM = ["source", "medium", "campaign", "content", "term"] as const;
const corto = (v: FormDataEntryValue | null, max = 120) => String(v ?? "").trim().slice(0, max);

/**
 * El botón «Reservar mi plaza».
 *
 * El enlace con el que llegó (ref, invitación personal, utm) se guarda en una
 * cookie de una hora y no en la URL de vuelta: Google y Supabase sólo
 * respetan las direcciones de vuelta que estén en su lista, y con parámetros
 * cambiantes no lo estarían. Si ya tiene sesión, se confirma directamente.
 */
export async function reservar(formData: FormData) {
  const slug = corto(formData.get("slug"), 80);
  if (!SLUG.test(slug)) redirect("/");

  const utm: CookieReserva["utm"] = {};
  for (const k of UTM) {
    const v = corto(formData.get(`utm_${k}`));
    if (v) utm[k] = v;
  }
  const jar = await cookies();
  jar.set(
    COOKIE_RESERVA,
    JSON.stringify({ slug, ref: corto(formData.get("ref"), 40) || null, inv: corto(formData.get("inv"), 40) || null, utm }),
    { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 3600, path: "/" },
  );

  const destino = `/dry-run/${slug}/confirmar`;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(destino);

  const fd = new FormData();
  fd.set("redirect", destino);
  // Si va bien, redirige a Google y no vuelve.
  await signInWithGoogle(fd);
  redirect(`/dry-run/${slug}?estado=google`);
}

/**
 * Dejar de recibir los correos de un dry run. No quita la plaza ni el acceso
 * al módulo: sólo los correos. Se hace con un botón y no al abrir el enlace,
 * porque los antivirus de correo abren los enlaces para revisarlos y darían
 * de baja a todo el mundo.
 */
export async function darseDeBaja(formData: FormData) {
  const token = corto(formData.get("t"), 40);
  if (!/^[a-f0-9]{32}$/.test(token)) redirect("/dry-run/baja");

  const admin = createAdminClient();
  const { data: guest } = await admin
    .from("dry_run_guests")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("token", token)
    .select("id")
    .maybeSingle();
  if (guest) {
    await admin
      .from("dry_run_emails")
      .update({ status: "cancelado", error: "se dio de baja" })
      .eq("guest_id", guest.id)
      .eq("status", "pendiente");
  }
  redirect(`/dry-run/baja?t=${token}&hecho=1`);
}
