"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/server";
import { notify } from "@/lib/slack/notify";

export const COURSE_KEYS = ["remote-professional", "remote-founder"] as const;
export type CourseKey = (typeof COURSE_KEYS)[number];

const COURSE_LABELS: Record<CourseKey, string> = {
  "remote-professional": "Remote Professional",
  "remote-founder": "Remote Founder",
};

export type LeadResult = { ok: true } | { error: string };

// El formulario es público: se inserta con la service role (no hay política de
// insert para anon), así la tabla no queda expuesta a la REST API.
export async function submitLead(formData: FormData): Promise<LeadResult> {
  // Honeypot: los bots rellenan todos los campos, las personas no ven este.
  if (String(formData.get("company") ?? "").trim()) return { ok: true };

  const courses = formData
    .getAll("courses")
    .map(String)
    .filter((c): c is CourseKey => (COURSE_KEYS as readonly string[]).includes(c));

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  // El curso es opcional: quien todavía no lo tiene claro es justo el lead
  // que hay que capturar. Si no marca ninguno, se guarda vacío y lo resuelve
  // la llamada comercial.
  if (!firstName || !lastName || !email || !phone || !city) return { error: "missing_fields" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return { error: "bad_email" };

  const locale = await getLocale();
  const admin = createAdminClient();

  const { error } = await admin.from("leads").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    city,
    courses,
    locale,
  });
  if (error) return { error: "db" };

  // El aviso de Slack no debe tumbar el envío: el lead ya está guardado.
  try {
    await notify({
      event: "lead_created",
      title: "Nueva solicitud de información",
      lines: [
        `*Nombre:* ${firstName} ${lastName}`,
        `*Email:* ${email}`,
        `*Teléfono:* ${phone}`,
        `*Ciudad:* ${city}`,
        `*Curso(s):* ${courses.length ? courses.map((c) => COURSE_LABELS[c]).join(" + ") : "sin especificar"}`,
      ],
    });
  } catch {
    // ignorado a propósito
  }

  return { ok: true };
}
