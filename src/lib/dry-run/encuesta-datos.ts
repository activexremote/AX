import "server-only";

import type { Respuestas } from "@/lib/dry-run/encuesta";
import type { DryRun, DryRunGuest } from "@/lib/dry-run/tipos";
import { notify } from "@/lib/slack/notify";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Guardar y leer las respuestas de la encuesta
//
//  Con la service role: las tablas del dry run no tienen políticas. Quien
//  llama ya sabe quién es el usuario (la sesión de Google), nunca uno que
//  venga del formulario.
// ══════════════════════════════════════════════════════════

export type RespuestaEncuesta = {
  id: string;
  dry_run_id: string;
  user_id: string;
  guest_id: string | null;
  email: string;
  full_name: string | null;
  answers: Respuestas;
  source: "encuesta" | "formulario-corto";
  submitted_at: string;
  updated_at: string;
};

export type Quien = { id: string; email: string; nombre: string | null };

const limpiar = (e: string) => e.trim().toLowerCase();

/** La fila de invitado de esta cuenta en la sesión: por usuario y, si no, por correo. */
export async function invitadoDe(runId: string, quien: Quien): Promise<DryRunGuest | null> {
  const admin = createAdminClient();
  const porUsuario = await admin.from("dry_run_guests").select("*").eq("dry_run_id", runId).eq("user_id", quien.id).maybeSingle();
  if (porUsuario.data) return porUsuario.data as DryRunGuest;
  const porCorreo = await admin.from("dry_run_guests").select("*").eq("dry_run_id", runId).eq("email", limpiar(quien.email)).maybeSingle();
  return (porCorreo.data as DryRunGuest | null) ?? null;
}

export async function miRespuesta(runId: string, userId: string): Promise<RespuestaEncuesta | null> {
  const { data } = await createAdminClient().from("dry_run_surveys").select("*").eq("dry_run_id", runId).eq("user_id", userId).maybeSingle();
  return (data as RespuestaEncuesta | null) ?? null;
}

/** Guarda (o sustituye) la respuesta de esta cuenta. Volver a enviar manda la última. */
export async function guardarRespuesta(run: DryRun, quien: Quien, respuestas: Respuestas): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const guest = await invitadoDe(run.id, quien);
  const previa = await miRespuesta(run.id, quien.id);
  const ahora = new Date().toISOString();

  const { error } = await admin.from("dry_run_surveys").upsert(
    {
      dry_run_id: run.id,
      user_id: quien.id,
      guest_id: guest?.id ?? null,
      email: limpiar(quien.email),
      full_name: guest?.full_name || quien.nombre,
      answers: respuestas,
      source: "encuesta",
      submitted_at: ahora,
    },
    { onConflict: "dry_run_id,user_id" },
  );
  if (error) return { ok: false, error: error.message };

  if (guest) {
    // `feedback_at` es lo que mira el resto del panel (el embudo, el
    // recordatorio de feedback) para saber que ya ha dejado su opinión.
    await admin
      .from("dry_run_guests")
      .update({ survey_at: ahora, feedback_at: guest.feedback_at ?? ahora, ...(guest.user_id ? {} : { user_id: quien.id }) })
      .eq("id", guest.id);
    await admin
      .from("dry_run_emails")
      .update({ status: "cancelado", error: "ya ha respondido la encuesta" })
      .eq("guest_id", guest.id)
      .in("kind", ["feedback", "encuesta"])
      .eq("status", "pendiente");
  }

  if (!previa || previa.source !== "encuesta") {
    const nps = typeof respuestas.nps === "number" ? respuestas.nps : "—";
    await notify({
      event: "user_created",
      title: "Respuesta nueva en la encuesta del dry run",
      lines: [
        `*Sesión:* ${run.title}`,
        `*De:* ${guest?.full_name || quien.nombre || quien.email}${guest ? "" : " (no está en la lista de invitados)"}`,
        `*Recomendaría (0-10):* ${nps}`,
        typeof respuestas.falto === "string" ? `*Echó en falta:* ${respuestas.falto.slice(0, 280)}` : "",
      ].filter(Boolean),
    }).catch(() => undefined);
  }

  return { ok: true };
}
