"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/server";
import { notify } from "@/lib/slack/notify";
import { validateLead } from "@/lib/leads/validate";
import { upsertZohoLead, type LeadOrigin } from "@/lib/zoho/crm";
import { submitZohoWebForm } from "@/lib/zoho/webform";

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

/** Campos de atribución que acepta el formulario. Nada fuera de esta lista
 *  llega al CRM: es un campo oculto y viene del navegador. */
const ORIGIN_FIELDS = [
  "page",
  "source",
  "medium",
  "campaign",
  "term",
  "content",
  "clickId",
  "referrer",
] as const satisfies readonly (keyof LeadOrigin)[];

const COURSE_LABELS: Record<CourseKey, string> = {
  "remote-professional": "Remote Professional",
  "remote-founder": "Remote Founder",
};

export type LeadResult = { ok: true } | { error: string };

/**
 * Ventana en la que dos envíos del mismo correo son EL MISMO envío.
 *
 * Quien pulsa dos veces, o corrige una errata y reenvía, no es un lead nuevo:
 * es el mismo con mejores datos. Dentro de la ventana se actualiza la ficha
 * en vez de crear otra fila, que es lo que llenaba la tabla de parejas.
 */
const VENTANA_REENVIO_MIN = 30;

/** Más de esto desde el mismo correo en un día es un bot, no una persona. */
const MAX_POR_DIA = 5;

// El formulario es público: se inserta con la service role (no hay política de
// insert para anon), así la tabla no queda expuesta a la REST API.
export async function submitLead(formData: FormData): Promise<LeadResult> {
  const courses = formData
    .getAll("courses")
    .map(String)
    .filter((c): c is CourseKey => (COURSE_KEYS as readonly string[]).includes(c));

  // ── De dónde viene ──
  // Lo rellena <LeadForm/> con los `utm_*` y el identificador de clic de la
  // URL (ver la cabecera de ese archivo). Se limpia aquí y no allí porque son
  // datos que llegan del navegador: cualquiera puede mandar lo que quiera en
  // un campo oculto, y de aquí salen hacia el CRM y hacia Slack.
  const origin: LeadOrigin = {};
  for (const campo of ORIGIN_FIELDS) {
    const valor = String(formData.get(`o_${campo}`) ?? "")
      // Fuera saltos de línea y caracteres de control: la ficha de Zoho es un
      // campo de texto y Slack interpreta el suyo como marcado.
      .replace(/[\u0000-\u001f\u007f]/g, " ")
      .trim()
      .slice(0, 120);
    if (valor) origin[campo] = valor;
  }

  // El curso es opcional: quien todavía no lo tiene claro es justo el lead
  // que hay que capturar. Si no marca ninguno, se guarda vacío y lo resuelve
  // la llamada comercial.
  const bruto = {
    firstName: String(formData.get("first_name") ?? ""),
    lastName: String(formData.get("last_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    city: String(formData.get("city") ?? ""),
  };

  if (!bruto.firstName || !bruto.lastName || !bruto.email || !bruto.phone || !bruto.city) {
    return { error: "missing_fields" };
  }

  // Cuánto ha tardado en rellenarlo. El formulario manda el instante en que
  // se pintó; si no viene —página servida de caché— no se tiene en cuenta.
  const pintado = Number(formData.get("t") ?? 0);
  const elapsedMs = pintado > 0 ? Date.now() - pintado : null;

  const revisado = validateLead({
    ...bruto,
    honeypot: String(formData.get("company") ?? ""),
    elapsedMs,
  });

  if (!revisado.ok) {
    // Al bot no se le dice que se le ha pillado: se le devuelve el mismo
    // "gracias" que a todo el mundo. Si supiera por qué ha fallado, probaría
    // otra vez con el campo arreglado.
    if (revisado.error === "spam") return { ok: true };
    return { error: revisado.error };
  }

  const { firstName, lastName, email, phone, city } = revisado.value;

  const locale = await getLocale();
  const admin = createAdminClient();

  // ── Freno ──
  // Cinco solicitudes del mismo correo en un día no las hace una persona.
  // Se cuenta por correo y no por IP a propósito: guardar direcciones IP
  // obligaría a cambiar la política de privacidad, que enumera exactamente
  // qué datos se recogen, y no compensa por esto.
  const desdeAyer = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", desdeAyer);

  if ((count ?? 0) >= MAX_POR_DIA) return { error: "too_many" };

  // ── ¿Es el mismo envío otra vez? ──
  const desdeHaceUnRato = new Date(Date.now() - VENTANA_REENVIO_MIN * 60 * 1000).toISOString();
  const { data: reciente } = await admin
    .from("leads")
    .select("id")
    .eq("email", email)
    .gte("created_at", desdeHaceUnRato)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (reciente?.id) {
    // Se actualiza en lugar de duplicar: si volvió a enviarlo es porque algo
    // quería cambiar, y los datos buenos son los últimos.
    await admin
      .from("leads")
      .update({ first_name: firstName, last_name: lastName, phone, city, courses, locale })
      .eq("id", reciente.id);

    // Sin formulario web: el correo de confirmación ya le llegó con el primer
    // envío, y un segundo sólo sería ruido en su bandeja.
    await enviarAZoho(admin, reciente.id, { firstName, lastName, email, phone, city, courses, locale, origin }, { webForm: false });
    return { ok: true };
  }

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

  await enviarAZoho(admin, fila?.id ?? null, { firstName, lastName, email, phone, city, courses, locale, origin }, { webForm: true });

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
        `*Origen:* ${describirOrigen(origin)}`,
      ],
    });
  } catch {
    // ignorado a propósito
  }

  return { ok: true };
}

/** Una línea legible con la campaña, para el aviso de Slack. */
function describirOrigen(o: LeadOrigin): string {
  const campana = [o.source, o.medium, o.campaign].filter(Boolean).join(" / ");
  const partes = [o.page, campana, o.clickId ? "clic de anuncio" : null, o.referrer]
    .filter(Boolean)
    .join(" · ");
  return partes || "directo";
}

/**
 * El lead al CRM.
 *
 * Primero por el formulario web de Zoho —es el que manda el correo de
 * confirmación, ver lib/zoho/webform.ts— y después por la API, que encuentra
 * ese mismo lead por el email y le añade cursos y campaña. Van en serie y no
 * en paralelo a propósito: si la API llegase antes, crearía la ficha y el
 * formulario web la duplicaría.
 *
 * Ni el CRM ni Slack pueden tumbar el envío: el lead ya está en Supabase, que
 * es la fuente de la verdad. Si Zoho está caído o mal configurado, queda el
 * aviso en el log, la persona ve su "gracias" y `npm run zoho:sync` lo
 * repesca después.
 */
async function enviarAZoho(
  admin: ReturnType<typeof createAdminClient>,
  leadId: string | null,
  lead: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    courses: CourseKey[];
    locale: string;
    origin: LeadOrigin;
  },
  { webForm }: { webForm: boolean },
) {
  if (webForm) {
    await submitZohoWebForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      city: lead.city,
    });
  }

  try {
    const zohoId = await upsertZohoLead({
      ...lead,
      courses: lead.courses.map((c) => COURSE_LABELS[c]),
    });
    if (zohoId && leadId) {
      await admin.from("leads").update({ zoho_lead_id: zohoId }).eq("id", leadId);
    }
  } catch (e) {
    console.error(`[zoho] fallo guardando el lead ${lead.email}: ${(e as Error).message}`);
  }
}
