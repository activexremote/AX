import type { SupabaseClient } from "@supabase/supabase-js";

import { componer, enlaceBaja, type Contexto, type TipoCorreo } from "@/lib/dry-run/correos";
import { esTipoCorreo, motivoParaNoEnviar, PASO, programar } from "@/lib/dry-run/secuencia";
import type { DryRun, DryRunGuest, DryRunLink } from "@/lib/dry-run/tipos";
import { correoListo, enviarCorreo, getMailSettings } from "@/lib/correo/envio";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  La cola de correos del dry run
//
//  Encolar es apuntar qué correo toca y cuándo; enviar es otra cosa, la hace
//  `procesarCola`, que corre cada pocos minutos (pg_cron llama a
//  /api/cron/correos) y además justo después de invitar o de apuntarse, para
//  que la invitación y la bienvenida no esperen al siguiente pase.
//
//  Cada fila se «coge» antes de enviarla (pendiente → enviando, sólo si
//  seguía pendiente), así dos pases a la vez no mandan el mismo correo dos
//  veces. Un fallo se reintenta dos veces más, con diez y veinte minutos de
//  margen.
// ══════════════════════════════════════════════════════════

const INTENTOS = 3;

type Admin = SupabaseClient;

/** Lo que hace falta para escribir los correos de una sesión, una vez por sesión. */
async function datosDeSesion(admin: Admin, runId: string) {
  const { data: run } = await admin.from("dry_runs").select("*").eq("id", runId).maybeSingle();
  if (!run) return null;
  const [{ data: modulo }, { data: leccion }] = await Promise.all([
    admin.from("modules").select("title, slug, order_index").eq("id", run.module_id).maybeSingle(),
    admin.from("lessons").select("id").eq("module_id", run.module_id).order("order_index").limit(1).maybeSingle(),
  ]);
  return {
    run: run as DryRun,
    modulo: {
      title: modulo?.title ?? "Módulo",
      slug: modulo?.slug ?? "",
      numero: modulo?.order_index ?? 1,
      primeraLeccion: leccion?.id ?? null,
    },
  };
}

function invitacionDe(run: DryRun, link: Pick<DryRunLink, "code" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content"> | null): Contexto["invitacion"] {
  return link
    ? { ref: link.code, source: link.utm_source, medium: link.utm_medium, campaign: link.utm_campaign, content: link.utm_content }
    : { ref: "email", source: "email", medium: "invitacion", campaign: run.slug };
}

export async function contextoDe(admin: Admin, guest: DryRunGuest, sesion: NonNullable<Awaited<ReturnType<typeof datosDeSesion>>>): Promise<Contexto> {
  const { data: link } = guest.link_id
    ? await admin.from("dry_run_links").select("code, utm_source, utm_medium, utm_campaign, utm_content").eq("id", guest.link_id).maybeSingle()
    : { data: null };
  return { run: sesion.run, modulo: sesion.modulo, guest, invitacion: invitacionDe(sesion.run, link) };
}

/** Un correo de muestra para el panel, a nombre de quien lo mira. */
export async function vistaPrevia(runId: string, kind: TipoCorreo, quien: { full_name: string | null; email: string }) {
  const admin = createAdminClient();
  const sesion = await datosDeSesion(admin, runId);
  if (!sesion) return null;
  return componer(kind, {
    run: sesion.run,
    modulo: sesion.modulo,
    guest: { full_name: quien.full_name, email: quien.email, token: "vista-previa" },
    invitacion: invitacionDe(sesion.run, null),
  });
}

/**
 * Apunta en la cola los correos de una secuencia para un invitado. Volver a
 * llamarla no duplica nada (un correo de cada tipo por invitado); con
 * `reenviar`, el de la invitación vuelve a salir aunque ya hubiera salido.
 */
export async function encolar(guest: DryRunGuest, run: DryRun, para: "invitados" | "plaza", opciones: { reenviar?: boolean } = {}) {
  const admin = createAdminClient();
  const filas = programar(para, run, guest).map((p) => ({ guest_id: guest.id, kind: p.kind, send_at: p.at.toISOString() }));
  if (!filas.length) return;

  if (opciones.reenviar) {
    const { error } = await admin
      .from("dry_run_emails")
      .upsert(filas.map((f) => ({ ...f, status: "pendiente", attempts: 0, error: null, sent_at: null, claimed_at: null })), { onConflict: "guest_id,kind" });
    if (error) throw new Error(error.message);
    return;
  }
  const { error } = await admin.from("dry_run_emails").upsert(filas, { onConflict: "guest_id,kind", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

/**
 * Cuando cambia la fecha de la sesión, las horas de lo que está por salir se
 * recalculan. Lo que ya no tiene hora (la vuelta por el campus de alguien
 * que se apuntó demasiado cerca) se cancela.
 */
export async function reprogramar(runId: string) {
  const admin = createAdminClient();
  const sesion = await datosDeSesion(admin, runId);
  if (!sesion) return;
  const { data: guests } = await admin.from("dry_run_guests").select("id, invited_at, registered_at").eq("dry_run_id", runId);
  const porId = new Map((guests ?? []).map((g) => [g.id, g]));
  if (!porId.size) return;

  const { data: pendientes } = await admin
    .from("dry_run_emails")
    .select("id, guest_id, kind")
    .eq("status", "pendiente")
    .in("guest_id", [...porId.keys()]);

  for (const e of pendientes ?? []) {
    if (!esTipoCorreo(e.kind) || e.kind === "invitacion" || e.kind === "bienvenida") continue;
    const at = PASO[e.kind].hora(sesion.run, porId.get(e.guest_id)!);
    await admin
      .from("dry_run_emails")
      .update(at ? { send_at: at.toISOString() } : { status: "cancelado", error: "sin hora tras cambiar la fecha" })
      .eq("id", e.id)
      .eq("status", "pendiente");
  }

  // Y lo que con la fecha nueva sí cabe (un aviso que antes ya había pasado)
  // se encola. Lo que ya estaba en la cola no se toca: un tipo por invitado.
  const { data: completos } = await admin.from("dry_run_guests").select("*").eq("dry_run_id", runId);
  for (const g of (completos ?? []) as DryRunGuest[]) {
    await encolar(g, sesion.run, g.status === "invitado" ? "invitados" : "plaza");
  }
}

export type ResultadoCola = { sinConfigurar?: boolean; enviados: number; omitidos: number; errores: number };

/**
 * Manda lo que ha llegado a su hora. `guestIds` limita el pase a esos
 * invitados (lo que se acaba de encolar al invitar o al apuntarse).
 */
export async function procesarCola(opciones: { limite?: number; guestIds?: string[] } = {}): Promise<ResultadoCola> {
  const resultado: ResultadoCola = { enviados: 0, omitidos: 0, errores: 0 };
  const ajustes = await getMailSettings();
  if (!correoListo(ajustes)) return { ...resultado, sinConfigurar: true };

  const admin = createAdminClient();
  const ahora = new Date();

  // Un envío que se quedó a medias (la función murió entre coger y mandar).
  await admin
    .from("dry_run_emails")
    .update({ status: "pendiente" })
    .eq("status", "enviando")
    .lt("claimed_at", new Date(ahora.getTime() - 15 * 60000).toISOString());

  let consulta = admin
    .from("dry_run_emails")
    .select("id, guest_id, kind, send_at, attempts")
    .eq("status", "pendiente")
    .lte("send_at", ahora.toISOString())
    .order("send_at")
    .limit(opciones.limite ?? 40);
  if (opciones.guestIds?.length) consulta = consulta.in("guest_id", opciones.guestIds);
  const { data: tanda } = await consulta;

  const sesiones = new Map<string, Awaited<ReturnType<typeof datosDeSesion>>>();

  for (const fila of tanda ?? []) {
    const { data: cogida } = await admin
      .from("dry_run_emails")
      .update({ status: "enviando", claimed_at: new Date().toISOString(), attempts: fila.attempts + 1 })
      .eq("id", fila.id)
      .eq("status", "pendiente")
      .select("id");
    if (!cogida?.length) continue;

    const terminar = (cambios: Record<string, unknown>) => admin.from("dry_run_emails").update(cambios).eq("id", fila.id);

    const { data: guest } = await admin.from("dry_run_guests").select("*").eq("id", fila.guest_id).maybeSingle();
    if (!guest || !esTipoCorreo(fila.kind)) {
      await terminar({ status: "cancelado", error: "invitado o tipo desconocido" });
      continue;
    }
    if (!sesiones.has(guest.dry_run_id)) sesiones.set(guest.dry_run_id, await datosDeSesion(admin, guest.dry_run_id));
    const sesion = sesiones.get(guest.dry_run_id);
    if (!sesion) {
      await terminar({ status: "cancelado", error: "la sesión ya no existe" });
      continue;
    }

    const motivo = motivoParaNoEnviar(fila.kind, sesion.run, guest as DryRunGuest, new Date(fila.send_at));
    if (motivo) {
      await terminar({ status: "omitido", error: motivo });
      resultado.omitidos++;
      continue;
    }

    const correo = componer(fila.kind, await contextoDe(admin, guest as DryRunGuest, sesion));
    const envio = await enviarCorreo(
      {
        to: guest.email,
        toName: guest.full_name,
        subject: correo.asunto,
        html: correo.html,
        text: correo.texto,
        unsubscribeUrl: enlaceBaja(guest.token),
      },
      ajustes,
    );

    if (envio.ok) {
      await terminar({ status: "enviado", subject: correo.asunto, sent_at: new Date().toISOString(), error: null });
      resultado.enviados++;
    } else {
      const otraVez = fila.attempts + 1 < INTENTOS;
      await terminar({
        status: otraVez ? "pendiente" : "error",
        error: envio.error.slice(0, 500),
        ...(otraVez ? { send_at: new Date(Date.now() + (fila.attempts + 1) * 10 * 60000).toISOString() } : {}),
      });
      resultado.errores++;
    }
  }

  return resultado;
}
