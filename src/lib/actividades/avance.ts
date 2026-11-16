import "server-only";

import { cache } from "react";

import { actividadesDe } from "@/lib/actividades/catalogo";
import { cuentaComoHecha, type FilaRespuesta } from "@/lib/actividades/tipos";
import { parseBlocks } from "@/lib/content/blocks";
import { recursosDe, type Recurso } from "@/lib/content/recursos";
import { getCurrentProfile } from "@/lib/data/profile";
import { usuarioActual } from "@/lib/data/usuario";
import { getMiDryRun } from "@/lib/dry-run/datos";
import { onLessonCompleted } from "@/lib/slack/lesson-hooks";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  Qué cuenta para el avance del alumno
//
//  Dos reglas que comparten la portada, el módulo, la lección, «Mi
//  progreso» y «Mis tareas»:
//
//  1. Lo que aún no está abierto no cuenta. En el dry run, las horas de
//     clase se abren cuando empieza la clase: hasta entonces no suman al
//     total ni salen como pendientes.
//  2. Una lección con material (lecturas, vídeos, descargas) no se da por
//     terminada hasta que se ha abierto cada enlace. Cada apertura pasa por
//     /recurso y queda apuntada en resource_opens.
// ══════════════════════════════════════════════════════════

export type Cerradas = { ids: Set<string>; abre: string | null };

/** Las lecciones que quien está dentro aún no puede hacer, y cuándo se abren. */
export const leccionesCerradas = cache(async (): Promise<Cerradas> => {
  const vacio: Cerradas = { ids: new Set(), abre: null };
  const [perfil, dry] = await Promise.all([getCurrentProfile(), getMiDryRun()]);
  if (!dry || perfil?.role === "profesor" || perfil?.role === "administrador") return vacio;
  if (Date.now() >= new Date(dry.run.starts_at).getTime()) return vacio;
  const admin = createAdminClient();
  const { data } = await admin.from("lessons").select("id").eq("module_id", dry.run.module_id).order("order_index");
  // La primera es el material previo: ésa está abierta desde el principio.
  return { ids: new Set((data ?? []).slice(1).map((l) => l.id as string)), abre: dry.run.starts_at };
});

/** Los enlaces que ha abierto quien está dentro, por lección. */
export const misRecursosAbiertos = cache(async (): Promise<Map<string, Set<string>>> => {
  const user = await usuarioActual();
  if (!user) return new Map();
  const supabase = await createClient();
  const { data } = await supabase.from("resource_opens").select("lesson_id, url").eq("user_id", user.id);
  const out = new Map<string, Set<string>>();
  for (const r of data ?? []) {
    const k = r.lesson_id as string;
    if (!out.has(k)) out.set(k, new Set());
    out.get(k)!.add(r.url as string);
  }
  return out;
});

type FilaLeccion = { content_blocks: unknown; content_blocks_en?: unknown };

/**
 * El material de una lección en sus dos idiomas. La versión inglesa puede
 * enlazar otros archivos; sin ella, se ve la española.
 */
export function recursosDeLeccion(l: FilaLeccion): { es: Recurso[]; en: Recurso[] } {
  const es = recursosDe(parseBlocks(l.content_blocks));
  const en = recursosDe(parseBlocks(l.content_blocks_en));
  return { es, en: en.length ? en : es };
}

/** Todas las direcciones válidas del material de una lección. */
export const urlsDeLeccion = (l: FilaLeccion) => {
  const r = recursosDeLeccion(l);
  return new Set([...r.es, ...r.en].map((x) => x.url));
};

/** Lo que le falta por abrir, en el idioma en que lo tiene más avanzado. */
export function faltanRecursos(l: FilaLeccion, abiertos: Set<string> | undefined): Recurso[] {
  const r = recursosDeLeccion(l);
  const a = abiertos ?? new Set<string>();
  const fEs = r.es.filter((x) => !a.has(x.url));
  const fEn = r.en.filter((x) => !a.has(x.url));
  return fEn.length < fEs.length ? fEn : fEs;
}

/** Si ya ha abierto todo el material de la lección. */
export async function materialCompleto(userId: string, lessonId: string): Promise<boolean> {
  const admin = createAdminClient();
  const [{ data: l }, { data: filas }] = await Promise.all([
    admin.from("lessons").select("content_blocks, content_blocks_en").eq("id", lessonId).maybeSingle(),
    admin.from("resource_opens").select("url").eq("user_id", userId).eq("lesson_id", lessonId),
  ]);
  if (!l) return false;
  return faltanRecursos(l, new Set((filas ?? []).map((f) => f.url as string))).length === 0;
}

/**
 * Da la lección por terminada si ya está todo: las actividades obligatorias
 * y el material abierto. Sólo para lecciones con actividades: las demás se
 * cierran con su botón, que comprueba el material por su cuenta.
 */
export async function cerrarLeccionSiToca(userId: string, lessonId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: l } = await admin.from("lessons").select("id, order_index, modules(slug)").eq("id", lessonId).maybeSingle();
  const slug = (l?.modules as { slug?: string } | null)?.slug;
  if (!l || !slug) return false;
  const actividades = actividadesDe(slug, l.order_index as number);
  if (!actividades.length) return false;

  const obligatorias = actividades.filter((a) => a.obligatoria);
  const { data: filas } = obligatorias.length
    ? await admin
        .from("activity_responses")
        .select("activity_key, status, result")
        .eq("user_id", userId)
        .in(
          "activity_key",
          obligatorias.map((a) => a.key),
        )
    : { data: [] };
  const por = new Map((filas ?? []).map((f) => [f.activity_key as string, f as Pick<FilaRespuesta, "status" | "result">]));
  if (!obligatorias.every((a) => cuentaComoHecha(a, por.get(a.key)))) return false;
  if (!(await materialCompleto(userId, lessonId))) return false;

  const { data: progreso } = await admin.from("user_lesson_progress").select("status").eq("user_id", userId).eq("lesson_id", lessonId).maybeSingle();
  if (progreso?.status === "completada") return true;
  const ahora = new Date().toISOString();
  await admin.from("user_lesson_progress").upsert({ user_id: userId, lesson_id: lessonId, status: "completada", last_visit: ahora, completed_at: ahora });
  await admin.from("activity_log").insert({ user_id: userId, kind: "lesson_complete", lesson_id: lessonId });
  await onLessonCompleted(userId, lessonId);
  return true;
}
