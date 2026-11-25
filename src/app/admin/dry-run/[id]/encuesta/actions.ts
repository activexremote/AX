"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { procesarCola } from "@/lib/dry-run/cola";
import { analizarEncuesta } from "@/lib/dry-run/encuesta-ia";
import type { RespuestaEncuesta } from "@/lib/dry-run/encuesta-datos";
import { CON_PLAZA, type DryRunGuest } from "@/lib/dry-run/tipos";
import { correoListo, getMailSettings } from "@/lib/correo/envio";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type Resultado<T = object> = ({ ok: true } & T) | { ok?: false; error: string };

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
  return { id: user.id };
}

/** Pide a la IA una lectura nueva de todas las respuestas y la guarda. */
export async function analizarRespuestas(runId: string): Promise<Resultado> {
  let quien;
  try {
    quien = await assertAdmin();
  } catch {
    return { error: "No tienes permiso para esto." };
  }
  const admin = createAdminClient();
  const [{ data: run }, { data: filas }] = await Promise.all([
    admin.from("dry_runs").select("title, module_id").eq("id", runId).maybeSingle(),
    admin.from("dry_run_surveys").select("id, answers").eq("dry_run_id", runId).order("submitted_at"),
  ]);
  if (!run) return { error: "La sesión ya no existe." };
  const respuestas = (filas ?? []) as Pick<RespuestaEncuesta, "id" | "answers">[];
  if (respuestas.length < 2) return { error: "Hacen falta al menos 2 respuestas para que la IA saque algo útil." };

  const { data: modulo } = await admin.from("modules").select("title, order_index").eq("id", run.module_id).maybeSingle();
  try {
    const content = await analizarEncuesta(respuestas, { titulo: run.title, modulo: modulo ? `Módulo ${modulo.order_index}: ${modulo.title}` : "" });
    const { error } = await admin.from("dry_run_survey_reports").insert({ dry_run_id: runId, created_by: quien.id, responses_count: respuestas.length, content });
    if (error) return { error: `No se ha podido guardar: ${error.message}` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "La IA no ha podido analizarlo ahora." };
  }
  revalidatePath(`/admin/dry-run/${runId}/encuesta`);
  return { ok: true };
}

/** Quién recibiría ahora el correo de la encuesta: con plaza, con correo, sin baja y sin haber respondido. */
function destinatarios(guests: DryRunGuest[]) {
  return guests.filter((g) => g.email && CON_PLAZA.includes(g.status) && g.status !== "no_asistio" && !g.unsubscribed_at && !g.survey_at);
}

/**
 * Manda (o vuelve a mandar, como recordatorio) el correo de la encuesta a
 * quien tiene plaza y todavía no ha respondido. Sale por la cola de siempre.
 */
export async function enviarEncuestaPorCorreo(runId: string): Promise<Resultado<{ n: number }>> {
  try {
    await assertAdmin();
  } catch {
    return { error: "No tienes permiso para esto." };
  }
  if (!correoListo(await getMailSettings())) return { error: "El envío de correo no está configurado (Dry run → Cuenta de envío)." };

  const admin = createAdminClient();
  const { data } = await admin.from("dry_run_guests").select("*").eq("dry_run_id", runId);
  const para = destinatarios((data ?? []) as DryRunGuest[]);
  if (!para.length) return { error: "No queda nadie con plaza y correo que no haya respondido." };

  const ahora = new Date().toISOString();
  const { error } = await admin
    .from("dry_run_emails")
    .upsert(
      para.map((g) => ({ guest_id: g.id, kind: "encuesta", send_at: ahora, status: "pendiente", attempts: 0, error: null, sent_at: null, claimed_at: null })),
      { onConflict: "guest_id,kind" },
    );
  if (error) return { error: error.message };

  const ids = para.map((g) => g.id);
  after(async () => {
    // De 40 en 40, como el cron: con muchos invitados, en varias tandas.
    for (let i = 0; i < ids.length; i += 40) await procesarCola({ guestIds: ids.slice(i, i + 40) });
  });
  revalidatePath(`/admin/dry-run/${runId}/encuesta`);
  return { ok: true, n: para.length };
}
