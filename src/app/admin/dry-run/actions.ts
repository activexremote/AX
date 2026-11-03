"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { encolar, procesarCola, reprogramar, vistaPrevia } from "@/lib/dry-run/cola";
import { esTipoCorreo } from "@/lib/dry-run/secuencia";
import { deCampoLocal } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, type DryRun, type DryRunGuest, type EstadoInvitado } from "@/lib/dry-run/tipos";
import { enviarCorreo, getMailSettings } from "@/lib/correo/envio";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Resultado<T = object> = ({ ok: true } & T) | { ok?: false; error: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return { id: user.id, email: (profile.email || user.email) as string, full_name: profile.full_name as string | null };
}

const txt = (f: FormData, k: string, max = 300) => String(f.get(k) ?? "").trim().slice(0, max);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Las direcciones que ya usa la propia sección. */
const RESERVADOS = new Set(["baja"]);

function urlOpcional(v: string) {
  if (!v) return null;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Crear o editar la sesión. */
export async function guardarSesion(id: string | null, formData: FormData): Promise<Resultado<{ id: string }>> {
  const yo = await assertAdmin();
  const slug = txt(formData, "slug", 80).toLowerCase();
  const title = txt(formData, "title", 140);
  const module_id = txt(formData, "module_id", 40);
  const inicio = deCampoLocal(txt(formData, "starts_at", 20));
  const fin = deCampoLocal(txt(formData, "ends_at", 20));
  const accesoTxt = txt(formData, "access_until", 20);
  const acceso = accesoTxt ? deCampoLocal(accesoTxt) : null;
  const plazasTxt = txt(formData, "capacity", 6);
  const plazas = plazasTxt ? Number(plazasTxt) : null;
  const classroom_url = urlOpcional(txt(formData, "classroom_url", 500));
  const meet_url = urlOpcional(txt(formData, "meet_url", 500));

  if (!title) return { error: "Falta el nombre." };
  if (!SLUG.test(slug) || RESERVADOS.has(slug)) return { error: "La dirección solo admite minúsculas, números y guiones." };
  if (!module_id) return { error: "Elige el módulo." };
  if (!inicio || !fin) return { error: "Revisa la fecha y la hora de inicio y de fin." };
  if (fin <= inicio) return { error: "La sesión tiene que terminar después de empezar." };
  if (accesoTxt && !acceso) return { error: "Revisa la fecha de fin del acceso." };
  if (plazas !== null && (!Number.isInteger(plazas) || plazas < 1)) return { error: "Las plazas tienen que ser un número entero." };
  if (classroom_url === undefined || meet_url === undefined) return { error: "Los enlaces tienen que empezar por https://" };

  const fila = {
    slug,
    title,
    module_id,
    starts_at: inicio.toISOString(),
    ends_at: fin.toISOString(),
    teacher_name: txt(formData, "teacher_name", 80) || "Isaac",
    classroom_url,
    classroom_code: txt(formData, "classroom_code", 40) || null,
    meet_url,
    agenda: txt(formData, "agenda", 3000),
    capacity: plazas,
    access_until: acceso ? acceso.toISOString() : null,
    registration_open: formData.get("registration_open") === "on",
  };

  const admin = createAdminClient();
  if (!id) {
    const { data, error } = await admin.from("dry_runs").insert({ ...fila, created_by: yo.id }).select("id").single();
    if (error) return { error: /duplicate|unique/i.test(error.message) ? "Ya hay un dry run con esa dirección." : error.message };
    revalidatePath("/admin/dry-run");
    return { ok: true, id: data.id };
  }

  const { data: antes } = await admin.from("dry_runs").select("starts_at, ends_at").eq("id", id).maybeSingle();
  const { error } = await admin.from("dry_runs").update(fila).eq("id", id);
  if (error) return { error: /duplicate|unique/i.test(error.message) ? "Ya hay un dry run con esa dirección." : error.message };

  const cambioFecha = antes && (new Date(antes.starts_at).getTime() !== inicio.getTime() || new Date(antes.ends_at).getTime() !== fin.getTime());
  if (cambioFecha) await reprogramar(id);

  revalidatePath(`/admin/dry-run/${id}`);
  revalidatePath("/admin/dry-run");
  return { ok: true, id };
}

const codigoDe = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

export async function crearEnlace(runId: string, formData: FormData): Promise<Resultado> {
  await assertAdmin();
  const label = txt(formData, "label", 80);
  const source = codigoDe(txt(formData, "utm_source", 60)).replace(/-/g, "_") || "";
  const medium = codigoDe(txt(formData, "utm_medium", 60)).replace(/-/g, "_") || "";
  if (!label) return { error: "Ponle nombre al enlace." };
  if (!source || !medium) return { error: "utm_source y utm_medium son obligatorios." };

  const admin = createAdminClient();
  const { data: run } = await admin.from("dry_runs").select("slug").eq("id", runId).maybeSingle();
  if (!run) return { error: "No existe la sesión." };

  const base = codigoDe(txt(formData, "code", 40)) || codigoDe(label) || "enlace";
  // Si el código ya existe (en esta u otra sesión), se le añade un número.
  let code = base.length >= 3 ? base : `${base}-dr`;
  for (let i = 2; i < 50; i++) {
    const { data: hay } = await admin.from("dry_run_links").select("id").eq("code", code).maybeSingle();
    if (!hay) break;
    code = `${base}-${i}`;
  }

  const { error } = await admin.from("dry_run_links").insert({
    dry_run_id: runId,
    code,
    label,
    utm_source: source,
    utm_medium: medium,
    utm_campaign: codigoDe(txt(formData, "utm_campaign", 80)).replace(/-/g, "_") || run.slug.replace(/-/g, "_"),
    utm_content: codigoDe(txt(formData, "utm_content", 80)).replace(/-/g, "_") || null,
    utm_term: codigoDe(txt(formData, "utm_term", 80)).replace(/-/g, "_") || null,
  });
  if (error) return { error: error.message };
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true };
}

export async function activarEnlace(runId: string, linkId: string, active: boolean): Promise<Resultado> {
  await assertAdmin();
  const { error } = await createAdminClient().from("dry_run_links").update({ active }).eq("id", linkId).eq("dry_run_id", runId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true };
}

/** «Ana Pérez <ana@x.com>», «ana@x.com, Ana Pérez», «ana@x.com». */
function leerPersonas(texto: string) {
  const vistas = new Set<string>();
  const out: { email: string; nombre: string | null }[] = [];
  for (const linea of texto.split(/[\n;]+/)) {
    const email = /[^\s<>,;"']+@[^\s<>,;"']+\.[a-z]{2,}/i.exec(linea)?.[0]?.toLowerCase();
    if (!email || vistas.has(email)) continue;
    vistas.add(email);
    const nombre = linea.replace(email, "").replace(/[<>,"']/g, " ").replace(/\s+/g, " ").trim() || null;
    out.push({ email, nombre: nombre ? nombre.slice(0, 120) : null });
  }
  return out;
}

export async function invitar(runId: string, formData: FormData): Promise<Resultado<{ nuevas: number; repetidas: number }>> {
  await assertAdmin();
  const personas = leerPersonas(String(formData.get("personas") ?? "").slice(0, 50_000));
  if (!personas.length) return { error: "No hay ningún correo válido." };
  if (personas.length > 300) return { error: "Como mucho 300 por tanda." };

  const admin = createAdminClient();
  const { data: run } = await admin.from("dry_runs").select("*").eq("id", runId).maybeSingle();
  if (!run) return { error: "No existe la sesión." };
  const linkId = txt(formData, "link_id", 40) || null;

  const { data: existentes } = await admin.from("dry_run_guests").select("email").eq("dry_run_id", runId).in("email", personas.map((p) => p.email));
  const ya = new Set((existentes ?? []).map((e) => e.email));
  const nuevas = personas.filter((p) => !ya.has(p.email));

  if (nuevas.length) {
    const ahora = new Date().toISOString();
    const { data: filas, error } = await admin
      .from("dry_run_guests")
      .insert(nuevas.map((p) => ({ dry_run_id: runId, email: p.email, full_name: p.nombre, link_id: linkId, status: "invitado", invited_at: ahora })))
      .select("*");
    if (error) return { error: error.message };
    for (const g of (filas ?? []) as DryRunGuest[]) await encolar(g, run as DryRun, "invitados");
    const ids = (filas ?? []).map((g) => g.id);
    after(() => procesarCola({ guestIds: ids, limite: 300 }).catch((e) => console.error(`[dry-run] cola: ${e}`)));
  }

  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true, nuevas: nuevas.length, repetidas: personas.length - nuevas.length };
}

export async function reenviarInvitacion(guestId: string): Promise<Resultado> {
  await assertAdmin();
  const admin = createAdminClient();
  const { data: guest } = await admin.from("dry_run_guests").select("*").eq("id", guestId).maybeSingle();
  if (!guest) return { error: "No existe." };
  if (guest.status !== "invitado") return { error: "Ya tiene plaza." };
  const { data: run } = await admin.from("dry_runs").select("*").eq("id", guest.dry_run_id).maybeSingle();
  if (!run) return { error: "No existe la sesión." };
  await admin.from("dry_run_guests").update({ invited_at: new Date().toISOString(), unsubscribed_at: null }).eq("id", guestId);
  await encolar(guest as DryRunGuest, run as DryRun, "invitados", { reenviar: true });
  after(() => procesarCola({ guestIds: [guestId] }).catch((e) => console.error(`[dry-run] cola: ${e}`)));
  revalidatePath(`/admin/dry-run/${guest.dry_run_id}`);
  return { ok: true };
}

/**
 * Cambiar el estado de una persona. «Baja» le quita la plaza y el acceso al
 * módulo (si se lo dio este dry run) y cancela lo que tuviera en cola;
 * devolverla a «con plaza» se lo vuelve a dar.
 */
export async function cambiarEstado(guestId: string, status: EstadoInvitado): Promise<Resultado> {
  await assertAdmin();
  if (!["invitado", "registrado", "asistio", "no_asistio", "baja"].includes(status)) return { error: "Estado no válido." };
  const admin = createAdminClient();
  const { data: guest } = await admin.from("dry_run_guests").select("*").eq("id", guestId).maybeSingle();
  if (!guest) return { error: "No existe." };
  const { data: run } = await admin.from("dry_runs").select("*").eq("id", guest.dry_run_id).maybeSingle();
  if (!run) return { error: "No existe la sesión." };
  if (CON_PLAZA.includes(status) && !guest.user_id) return { error: "Todavía no ha entrado al campus: tiene que reservar la plaza desde su enlace." };

  const { error } = await admin.from("dry_run_guests").update({ status }).eq("id", guestId);
  if (error) return { error: error.message };

  if (status === "baja") {
    if (guest.user_id) {
      await admin.from("module_grants").delete().eq("user_id", guest.user_id).eq("module_id", run.module_id).eq("source", "dry-run");
    }
    await admin.from("dry_run_emails").update({ status: "cancelado", error: "baja desde el panel" }).eq("guest_id", guestId).eq("status", "pendiente");
  } else if (CON_PLAZA.includes(status) && guest.status === "baja" && guest.user_id) {
    await admin
      .from("module_grants")
      .upsert({ user_id: guest.user_id, module_id: run.module_id, source: "dry-run", expires_at: run.access_until }, { onConflict: "user_id,module_id" });
    await encolar({ ...(guest as DryRunGuest), status }, run as DryRun, "plaza");
  }

  revalidatePath(`/admin/dry-run/${guest.dry_run_id}`);
  return { ok: true };
}

export async function enviarPrueba(runId: string, kind: string): Promise<Resultado<{ a: string }>> {
  const yo = await assertAdmin();
  if (!esTipoCorreo(kind)) return { error: "Correo desconocido." };
  const correo = await vistaPrevia(runId, kind, { full_name: yo.full_name, email: yo.email });
  if (!correo) return { error: "No existe la sesión." };
  const r = await enviarCorreo({ to: yo.email, toName: yo.full_name, subject: `[Prueba] ${correo.asunto}`, html: correo.html, text: correo.texto });
  return r.ok ? { ok: true, a: yo.email } : { error: r.error };
}

export async function procesarAhora(runId: string): Promise<Resultado<{ enviados: number; omitidos: number; errores: number }>> {
  await assertAdmin();
  const r = await procesarCola({ limite: 100 });
  if (r.sinConfigurar) return { error: "El envío de correo no está configurado." };
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true, enviados: r.enviados, omitidos: r.omitidos, errores: r.errores };
}

// ── Cuenta de envío ──────────────────────────────────────

export async function guardarCorreo(formData: FormData): Promise<Resultado> {
  await assertAdmin();
  const port = Number(txt(formData, "smtp_port", 6) || 465);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return { error: "Puerto no válido." };
  const pass = String(formData.get("smtp_pass") ?? "").replace(/\s+/g, "");

  const fila: Record<string, unknown> = {
    id: true,
    enabled: formData.get("enabled") === "on",
    smtp_host: txt(formData, "smtp_host", 120) || "smtp.gmail.com",
    smtp_port: port,
    smtp_user: txt(formData, "smtp_user", 200) || null,
    from_name: txt(formData, "from_name", 120) || "ActiveXRemote",
    from_email: txt(formData, "from_email", 200) || null,
    reply_to: txt(formData, "reply_to", 200) || null,
    updated_at: new Date().toISOString(),
  };
  // Vacío: se deja la que hubiera (el campo nunca llega relleno al navegador).
  if (pass) fila.smtp_pass = pass;

  const { error } = await createAdminClient().from("mail_settings").upsert(fila, { onConflict: "id" });
  if (error) return { error: error.message };
  revalidatePath("/admin/dry-run");
  return { ok: true };
}

export async function probarCorreo(): Promise<Resultado<{ a: string }>> {
  const yo = await assertAdmin();
  const ajustes = await getMailSettings();
  const r = await enviarCorreo(
    {
      to: yo.email,
      subject: "Prueba de envío · ActiveXRemote",
      text: "Si lees esto, el envío de correos del campus funciona.",
      html: "<p style=\"font-family:Arial,sans-serif;font-size:15px;\">Si lees esto, el envío de correos del campus funciona.</p>",
    },
    ajustes,
  );
  return r.ok ? { ok: true, a: yo.email } : { error: r.error };
}
