"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/server";
import { notify } from "@/lib/slack/notify";
import { upsertZohoLead } from "@/lib/zoho/crm";

// ⚠︎ SIN `export`. Un archivo con "use server" sólo puede exportar funciones
// async: cualquier otra cosa hace que Next tire el módulo entero en tiempo de
// ejecución con «A "use server" file can only export async functions, found
// object», y el formulario reventaba la página al enviarlo.
//
// No lo importa nadie de fuera —sólo se usa aquí para validar—, así que
// dejarlo local no rompe nada. El tipo sí puede exportarse: se borra al
// compilar y no llega a existir en tiempo de ejecución.
const COURSE_KEYS = ["remote-professional", "remote-founder"] as const;
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

  const { data: fila, error } = await admin
    .from("leads")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      city,
      courses,
      locale,
    })
    .select("id")
    .single();
  if (error) return { error: "db" };

  // ── Zoho ──
  // Ni el CRM ni Slack pueden tumbar el envío: el lead ya está guardado en
  // Supabase, que es la fuente de la verdad. Si Zoho está caído o mal
  // configurado, queda el aviso en el log y la persona ve su "gracias".
  try {
    const zohoId = await upsertZohoLead({
      firstName,
      lastName,
      email,
      phone,
      city,
      courses: courses.map((c) => COURSE_LABELS[c]),
      locale,
    });
    // El id se guarda para saber qué lead nuestro es cuál en el CRM, y para
    // no tener que buscar por email cuando haya que cruzarlos.
    if (zohoId && fila?.id) {
      await admin.from("leads").update({ zoho_lead_id: zohoId }).eq("id", fila.id);
    }
  } catch (e) {
    console.error(`[zoho] fallo guardando el lead ${email}: ${(e as Error).message}`);
  }

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
