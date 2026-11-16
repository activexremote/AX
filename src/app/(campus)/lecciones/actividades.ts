"use server";

import { revalidatePath } from "next/cache";

import { cerrarLeccionSiToca } from "@/lib/actividades/avance";
import { actividad, calcular, errores, limpiar } from "@/lib/actividades/catalogo";
import type { FilaRespuesta, Respuestas, Resultado } from "@/lib/actividades/tipos";
import { marcarPaso } from "@/lib/dry-run/datos";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Guardar una actividad del campus
//
//  Guarda el borrador o la envía. Al enviar se valida de verdad (lo del
//  navegador es sólo una ayuda), se calcula el resultado y, si con ésta ya
//  están todas las obligatorias de la lección, la lección se da por
//  terminada sola: ya no hay un «marcar como completada» que no comprueba
//  nada.
// ══════════════════════════════════════════════════════════

export type RespuestaGuardar =
  | { ok: true; status: FilaRespuesta["status"]; result: Resultado | null; leccionTerminada: boolean }
  | { ok: false; error: "no-auth" | "no-existe" | "sin-acceso" | "revisada" | "incompleta" | "error"; campos?: Record<string, "falta" | "url"> };

export async function guardarActividad(input: { key: string; lessonId: string; answers: Respuestas; enviar: boolean }): Promise<RespuestaGuardar> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "no-auth" };

  const act = actividad(input.key);
  if (!act) return { ok: false, error: "no-existe" };

  // Con el cliente del alumno: si no tiene acceso a la lección, la política
  // de lessons no la devuelve.
  const { data: leccion } = await supabase.from("lessons").select("id, order_index, module_id, modules(slug)").eq("id", input.lessonId).maybeSingle();
  const slug = (leccion?.modules as { slug?: string } | null)?.slug;
  if (!leccion || slug !== act.modulo || leccion.order_index !== act.leccion) return { ok: false, error: "sin-acceso" };

  const admin = createAdminClient();
  const { data: previa } = await admin.from("activity_responses").select("status, attempts").eq("user_id", user.id).eq("activity_key", act.key).maybeSingle();
  // Lo que el profesor ya ha dado por bueno no se toca. Un test sí se puede repetir.
  if (previa?.status === "revisada" && act.tipo !== "test") return { ok: false, error: "revisada" };

  const answers = limpiar(act, input.answers);
  if (input.enviar) {
    const campos = errores(act, answers);
    if (Object.keys(campos).length) return { ok: false, error: "incompleta", campos };
  }

  const result = input.enviar ? calcular(act, answers) : null;
  const ahora = new Date().toISOString();
  const status: FilaRespuesta["status"] = input.enviar ? "enviada" : previa?.status === "devuelta" ? "devuelta" : previa?.status === "enviada" ? "enviada" : "borrador";
  // Un borrador sobre algo ya enviado no se guarda como envío: se queda lo enviado.
  if (!input.enviar && previa?.status === "enviada") return { ok: false, error: "error" };

  const { error } = await admin.from("activity_responses").upsert(
    {
      user_id: user.id,
      lesson_id: leccion.id,
      activity_key: act.key,
      answers,
      ...(input.enviar ? { result, submitted_at: ahora, attempts: (previa?.attempts ?? 0) + 1 } : {}),
      status,
    },
    { onConflict: "user_id,activity_key" },
  );
  if (error) return { ok: false, error: "error" };

  let leccionTerminada = false;
  if (input.enviar) {
    if (act.pasoDryRun) await marcarPaso(user.id, act.pasoDryRun);
    await admin.from("activity_log").insert({ user_id: user.id, kind: "activity_submit", lesson_id: leccion.id, payload: { activity: act.key, pct: result?.pct ?? null } });
    leccionTerminada = await cerrarLeccionSiToca(user.id, leccion.id as string);
  }

  revalidatePath(`/lecciones/${leccion.id}`);
  revalidatePath("/mis-tareas");
  revalidatePath("/mi-progreso");
  revalidatePath("/preparacion");
  revalidatePath("/");
  return { ok: true, status, result, leccionTerminada };
}
