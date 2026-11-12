"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { encolar, procesarCola, reprogramar, vistaPrevia } from "@/lib/dry-run/cola";
import { esTipoCorreo } from "@/lib/dry-run/secuencia";
import { deCampoLocal } from "@/lib/dry-run/tiempo";
import { urlDeEnlace } from "@/components/admin/dry-run/valores";
import { CON_PLAZA, SEGUIMIENTOS, type DryRun, type DryRunGuest, type DryRunLink, type EstadoInvitado, type Seguimiento } from "@/lib/dry-run/tipos";
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

export async function crearEnlace(runId: string, formData: FormData): Promise<Resultado<{ url: string }>> {
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

  const { data: fila, error } = await admin.from("dry_run_links").insert({
    dry_run_id: runId,
    code,
    label,
    utm_source: source,
    utm_medium: medium,
    utm_campaign: codigoDe(txt(formData, "utm_campaign", 80)).replace(/-/g, "_") || run.slug.replace(/-/g, "_"),
    utm_content: codigoDe(txt(formData, "utm_content", 80)).replace(/-/g, "_") || null,
    utm_term: codigoDe(txt(formData, "utm_term", 80)).replace(/-/g, "_") || null,
  }).select("*").single();
  if (error || !fila) return { error: error?.message ?? "No se pudo crear el enlace." };
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true, url: urlDeEnlace(run.slug, fila as DryRunLink) };
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
  const yo = await assertAdmin();
  const invitador = yo.full_name?.trim().split(/\s+/)[0] || null;
  const personas = leerPersonas(String(formData.get("personas") ?? "").slice(0, 50_000));
  if (!personas.length) return { error: "No hay ningún correo válido." };
  if (personas.length > 300) return { error: "Como mucho 300 por tanda." };

  const admin = createAdminClient();
  const { data: run } = await admin.from("dry_runs").select("*").eq("id", runId).maybeSingle();
  if (!run) return { error: "No existe la sesión." };
  const linkId = txt(formData, "link_id", 40) || null;

  const { data: existentes } = await admin
    .from("dry_run_guests")
    .select("*, dry_run_emails(kind, status)")
    .eq("dry_run_id", runId)
    .in("email", personas.map((p) => p.email));
  const ya = new Set((existentes ?? []).map((e) => e.email));
  const nuevas = personas.filter((p) => !ya.has(p.email));

  // Quien ya estaba en la lista sin plaza y sin invitación enviada (lo
  // apuntado desde la tabla, o una invitación que falló o se quedó sin salir)
  // también la recibe. A quien ya la recibió, se reserva o se dio de baja,
  // no se le vuelve a escribir: para eso está «Reenviar».
  const pendientes = ((existentes ?? []) as (DryRunGuest & { dry_run_emails: { kind: string; status: string }[] | null })[]).filter(
    (g) => g.status === "invitado" && !g.unsubscribed_at && !(g.dry_run_emails ?? []).some((e) => e.kind === "invitacion" && e.status === "enviado"),
  );
  const ahora = new Date().toISOString();
  for (const g of pendientes) {
    await admin.from("dry_run_guests").update({ invited_at: ahora }).eq("id", g.id);
    await encolar({ ...g, invited_at: ahora }, run as DryRun, "invitados", { reenviar: true });
  }
  if (pendientes.length) {
    const ids = pendientes.map((g) => g.id);
    after(() => procesarCola({ guestIds: ids, limite: 300 }).catch((e) => console.error(`[dry-run] cola: ${e}`)));
  }

  if (nuevas.length) {
    const { data: filas, error } = await admin
      .from("dry_run_guests")
      .insert(nuevas.map((p) => ({ dry_run_id: runId, email: p.email, full_name: p.nombre, inviter: invitador, link_id: linkId, status: "invitado", invited_at: ahora, shared_at: ahora, shared_via: "email" })))
      .select("*");
    if (error) return { error: error.message };
    for (const g of (filas ?? []) as DryRunGuest[]) await encolar(g, run as DryRun, "invitados");
    const ids = (filas ?? []).map((g) => g.id);
    after(() => procesarCola({ guestIds: ids, limite: 300 }).catch((e) => console.error(`[dry-run] cola: ${e}`)));
  }

  revalidatePath(`/admin/dry-run/${runId}`);
  const encoladas = nuevas.length + pendientes.length;
  return { ok: true, nuevas: encoladas, repetidas: personas.length - encoladas };
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

// ── Tabla de invitados ───────────────────────────────────

/** Las columnas de la tabla que se editan a mano. */
const CAMPOS = { full_name: 120, email: 200, phone: 40, country: 60, inviter: 60, profile: 160, notes: 2000 } as const;
type Campo = keyof typeof CAMPOS;

/** El valor limpio de una celda, o un error que enseñar en la fila. */
function limpiarCampo(campo: Campo, bruto: string): { valor: string | null } | { error: string } {
  // Las notas conservan los saltos de línea; lo demás es una línea.
  const v = (campo === "notes" ? bruto.replace(/[ \t]+/g, " ") : bruto.replace(/\s+/g, " ")).trim().slice(0, CAMPOS[campo]);
  if (!v) return { valor: null };
  if (campo === "email") {
    const e = v.toLowerCase();
    return /^[^\s@<>,;"']+@[^\s@<>,;"']+\.[a-z]{2,}$/i.test(e) ? { valor: e } : { error: "Ese correo no parece válido." };
  }
  if (campo === "phone") {
    if (/[^\d\s+().-]/.test(v)) return { error: "El teléfono solo admite números, espacios y +." };
    // «0034 659…» es «+34 659…».
    return { valor: v.replace(/^00/, "+") };
  }
  return { valor: v };
}

const duplicado = (m: string) => (/duplicate|unique/i.test(m) ? "Ya hay otro invitado con ese correo en esta sesión." : m);

export async function crearInvitado(runId: string, datos: Partial<Record<Campo, string>> & { tracking?: string }): Promise<Resultado<{ id: string }>> {
  await assertAdmin();
  const fila: Record<string, unknown> = { dry_run_id: runId, status: "invitado" };
  for (const campo of Object.keys(CAMPOS) as Campo[]) {
    const r = limpiarCampo(campo, datos[campo] ?? "");
    if ("error" in r) return { error: r.error };
    fila[campo] = r.valor;
  }
  if (!fila.full_name && !fila.email && !fila.phone) return { error: "Pon al menos el nombre." };
  if (datos.tracking && SEGUIMIENTOS.includes(datos.tracking as Seguimiento)) fila.tracking = datos.tracking;

  const { data, error } = await createAdminClient().from("dry_run_guests").insert(fila).select("id").single();
  if (error || !data) return { error: duplicado(error?.message ?? "No se pudo añadir.") };
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true, id: data.id };
}

/** Pegar filas de una hoja de cálculo: nombre, correo, teléfono, país, invitador, estado, perfil, notas. */
export async function importarInvitados(runId: string, texto: string): Promise<Resultado<{ nuevas: number; saltadas: number }>> {
  await assertAdmin();
  const orden: (Campo | "tracking")[] = ["full_name", "email", "phone", "country", "inviter", "tracking", "profile", "notes"];
  const estados: Record<string, Seguimiento> = {
    pendiente: "pendiente", confirmado: "confirmado", rechazado: "rechazado", asistio: "asistio", "asistió": "asistio",
    "no asistio": "no_asistio", "no asistió": "no_asistio",
  };
  const lineas = texto.slice(0, 100_000).split(/\r?\n/).filter((l) => l.trim());
  if (lineas.length > 300) return { error: "Como mucho 300 filas por tanda." };
  let nuevas = 0;
  let saltadas = 0;
  for (const linea of lineas) {
    // Sin tabuladores (pegado de otro sitio), se separa por comas o punto y coma.
    const celdas = (linea.includes("\t") ? linea.split("\t") : linea.split(/[;,]/)).map((c) => c.trim());
    // Una columna «ALU-001» delante, como en la hoja, se ignora; la cabecera también.
    if (/^alu-\d+$/i.test(celdas[0] ?? "")) celdas.shift();
    if (/^nombre/i.test(celdas[0] ?? "")) continue;
    const datos: Partial<Record<Campo, string>> & { tracking?: string } = {};
    orden.forEach((k, i) => {
      const v = celdas[i] ?? "";
      if (k === "tracking") datos.tracking = estados[v.toLowerCase()] ?? undefined;
      else datos[k] = v;
    });
    const r = await crearInvitado(runId, datos);
    if (r.ok) nuevas++;
    else saltadas++;
  }
  revalidatePath(`/admin/dry-run/${runId}`);
  return { ok: true, nuevas, saltadas };
}

export async function actualizarInvitado(guestId: string, campo: string, valor: string): Promise<Resultado<{ valor: string | null }>> {
  await assertAdmin();
  if (!(campo in CAMPOS)) return { error: "Campo no válido." };
  const r = limpiarCampo(campo as Campo, valor);
  if ("error" in r) return { error: r.error };
  const admin = createAdminClient();
  const { data: guest } = await admin.from("dry_run_guests").select("dry_run_id, user_id").eq("id", guestId).maybeSingle();
  if (!guest) return { error: "No existe." };
  // Con plaza, el correo es el de su cuenta de Google: ahí le llegan los correos.
  if (campo === "email" && guest.user_id && !r.valor) return { error: "Tiene plaza: el correo no se puede dejar vacío." };
  const { error } = await admin.from("dry_run_guests").update({ [campo]: r.valor }).eq("id", guestId);
  if (error) return { error: duplicado(error.message) };
  revalidatePath(`/admin/dry-run/${guest.dry_run_id}`);
  return { ok: true, valor: r.valor };
}

/**
 * El estado de la tabla. Asistió y no asistió también cambian el del sistema
 * si tiene plaza: de eso depende que le llegue el correo de feedback.
 */
export async function cambiarSeguimiento(guestId: string, tracking: Seguimiento): Promise<Resultado> {
  await assertAdmin();
  if (!SEGUIMIENTOS.includes(tracking)) return { error: "Estado no válido." };
  const admin = createAdminClient();
  const { data: guest } = await admin.from("dry_run_guests").select("dry_run_id, status").eq("id", guestId).maybeSingle();
  if (!guest) return { error: "No existe." };
  const cambios: Record<string, unknown> = { tracking };
  if (CON_PLAZA.includes(guest.status as EstadoInvitado)) {
    cambios.status = tracking === "asistio" || tracking === "no_asistio" ? tracking : "registrado";
  }
  const { error } = await admin.from("dry_run_guests").update(cambios).eq("id", guestId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/dry-run/${guest.dry_run_id}`);
  return { ok: true };
}

/** Alguien del equipo ha copiado o abierto su invitación. */
export async function marcarCompartido(guestId: string, via: string): Promise<Resultado> {
  await assertAdmin();
  if (!["whatsapp", "email", "directo"].includes(via)) return { error: "Canal no válido." };
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dry_run_guests")
    .update({ shared_at: new Date().toISOString(), shared_via: via })
    .eq("id", guestId)
    .select("dry_run_id")
    .maybeSingle();
  if (error || !data) return { error: error?.message ?? "No existe." };
  revalidatePath(`/admin/dry-run/${data.dry_run_id}`);
  return { ok: true };
}

/** Borra la fila, sus correos y, si se lo dio este dry run, el acceso al módulo. */
export async function eliminarInvitado(guestId: string): Promise<Resultado> {
  await assertAdmin();
  const admin = createAdminClient();
  const { data: guest } = await admin.from("dry_run_guests").select("dry_run_id, user_id").eq("id", guestId).maybeSingle();
  if (!guest) return { error: "No existe." };
  if (guest.user_id) {
    const { data: run } = await admin.from("dry_runs").select("module_id").eq("id", guest.dry_run_id).maybeSingle();
    if (run) await admin.from("module_grants").delete().eq("user_id", guest.user_id).eq("module_id", run.module_id).eq("source", "dry-run");
  }
  const { error } = await admin.from("dry_run_guests").delete().eq("id", guestId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/dry-run/${guest.dry_run_id}`);
  return { ok: true };
}

export async function guardarMensaje(runId: string, texto: string): Promise<Resultado> {
  await assertAdmin();
  const limpio = texto.replace(/\r\n/g, "\n").trim().slice(0, 4000);
  const { error } = await createAdminClient().from("dry_runs").update({ invite_message: limpio || null }).eq("id", runId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/dry-run/${runId}`);
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
