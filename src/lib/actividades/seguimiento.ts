import "server-only";

import { faltanRecursos, recursosDeLeccion } from "@/lib/actividades/avance";
import { actividadesDelModulo, modulosConActividades } from "@/lib/actividades/catalogo";
import { cuentaComoHecha, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { CON_PLAZA } from "@/lib/dry-run/tipos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { alumnosVisibles } from "@/lib/actividades/acceso";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Seguimiento por alumno (panel)
//
//  Para el profesorado: de cada alumno, qué lecciones ha completado, qué
//  enlaces del material ha abierto (y cuándo), qué actividades ha enviado y
//  cómo va su lista de preparación del dry run. Las actividades anónimas no
//  salen: ni siquiera si alguien la ha contestado.
// ══════════════════════════════════════════════════════════

const COLUMNAS = "id, user_id, lesson_id, activity_key, answers, result, status, attempts, submitted_at, rubric, feedback, reviewed_at, updated_at, grade, notified_at";

export type LeccionSeg = { id: string; moduleId: string; orden: number; title: string; recursos: { url: string; label: string }[]; fila: { content_blocks: unknown; content_blocks_en: unknown } };
export type AlumnoSeg = {
  id: string;
  nombre: string;
  email: string;
  /** Pasos de la lista de preparación del dry run hechos, o null si no es invitado. */
  preparacion: { hechos: number; total: number; pasos: Record<string, string> } | null;
  completadas: Map<string, string | null>;
  abiertos: Map<string, Map<string, string>>;
  respuestas: Map<string, FilaRespuesta>;
};

export async function seguimiento() {
  const admin = createAdminClient();
  const { data: modulos } = await admin.from("modules").select("id, slug, title, order_index").in("slug", modulosConActividades()).order("order_index");
  const ids = (modulos ?? []).map((m) => m.id as string);
  if (!ids.length) return { modulos: [], lecciones: [] as LeccionSeg[], actividades: [] as Actividad[], alumnos: [] as AlumnoSeg[] };

  const { data: lecs } = await admin.from("lessons").select("id, module_id, order_index, title, content_blocks, content_blocks_en").in("module_id", ids).order("order_index");
  const lecciones: LeccionSeg[] = (lecs ?? []).map((l) => ({
    id: l.id as string,
    moduleId: l.module_id as string,
    orden: l.order_index as number,
    title: l.title as string,
    recursos: recursosDeLeccion(l).es,
    fila: { content_blocks: l.content_blocks, content_blocks_en: l.content_blocks_en },
  }));
  const lessonIds = lecciones.map((l) => l.id);
  if (!lessonIds.length) lessonIds.push("00000000-0000-0000-0000-000000000000");
  const actividades = (modulos ?? []).flatMap((m) => actividadesDelModulo(m.slug as string)).filter((a) => !a.anonima);

  const { data: runs } = await admin.from("dry_runs").select("id").in("module_id", ids);
  const [{ data: guests }, { data: progreso }, { data: aperturas }, { data: resp }, { data: matriculas }, visibles] = await Promise.all([
    runs?.length
      ? admin
          .from("dry_run_guests")
          .select("user_id, full_name, email, onboarding")
          .in(
            "dry_run_id",
            runs.map((r) => r.id),
          )
          .in("status", CON_PLAZA)
          .not("user_id", "is", null)
      : Promise.resolve({ data: [] as { user_id: string; full_name: string; email: string; onboarding: Record<string, string> }[] }),
    admin.from("user_lesson_progress").select("user_id, lesson_id, status, completed_at").in("lesson_id", lessonIds).eq("status", "completada"),
    admin.from("resource_opens").select("user_id, lesson_id, url, opened_at").in("lesson_id", lessonIds),
    admin
      .from("activity_responses")
      .select(COLUMNAS)
      .in(
        "activity_key",
        actividades.map((a) => a.key),
      ),
    admin.from("enrollments").select("user_id").eq("active", true),
    alumnosVisibles(),
  ]);

  // Quién sale: los invitados con plaza, los matriculados, los asignados y
  // cualquiera que haya hecho algo; y de ellos, sólo los que puede ver quien
  // mira (un profesor, los suyos).
  const userIds = new Set<string>(
    [
      ...(guests ?? []).map((g) => g.user_id as string),
      ...(matriculas ?? []).map((m) => m.user_id as string),
      ...visibles.ids,
      ...(aperturas ?? []).map((r) => r.user_id as string),
      ...((resp ?? []) as FilaRespuesta[]).map((r) => r.user_id),
    ].filter((id) => visibles.todos || visibles.ids.has(id)),
  );
  const { data: perfiles } = userIds.size ? await admin.from("profiles").select("id, full_name, email, role").in("id", [...userIds]) : { data: [] };
  const perfil = new Map((perfiles ?? []).map((p) => [p.id as string, p]));

  const alumnos: AlumnoSeg[] = [...userIds]
    // El equipo prueba el campus con sus cuentas: no es un alumno.
    .filter((id) => !["profesor", "administrador"].includes((perfil.get(id)?.role as string) ?? ""))
    .map((id) => {
      const g = (guests ?? []).find((x) => x.user_id === id);
      const p = perfil.get(id);
      const pasos = ((g?.onboarding as Record<string, string> | null) ?? {}) as Record<string, string>;
      const abiertos = new Map<string, Map<string, string>>();
      for (const r of aperturas ?? []) {
        if (r.user_id !== id) continue;
        const k = r.lesson_id as string;
        if (!abiertos.has(k)) abiertos.set(k, new Map());
        abiertos.get(k)!.set(r.url as string, r.opened_at as string);
      }
      return {
        id,
        nombre: (p?.full_name as string) || (g?.full_name as string) || (p?.email as string) || "—",
        email: (p?.email as string) || (g?.email as string) || "",
        preparacion: g ? { hechos: PASOS.filter((x) => pasos[x.key]).length, total: PASOS.length, pasos } : null,
        completadas: new Map((progreso ?? []).filter((x) => x.user_id === id).map((x) => [x.lesson_id as string, (x.completed_at as string) ?? null])),
        abiertos,
        respuestas: new Map(((resp ?? []) as FilaRespuesta[]).filter((x) => x.user_id === id).map((x) => [x.activity_key, x])),
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return { modulos: modulos ?? [], lecciones, actividades, alumnos };
}

/** Cuántos enlaces de la lección ha abierto el alumno, en el idioma en que lo tiene más avanzado. */
export function materialDe(l: LeccionSeg, a: AlumnoSeg) {
  const abiertos = new Set(a.abiertos.get(l.id)?.keys() ?? []);
  const total = l.recursos.length;
  return { total, abiertos: total - faltanRecursos(l.fila, abiertos).length };
}

export const hechaPor = (act: Actividad, a: AlumnoSeg) => cuentaComoHecha(act, a.respuestas.get(act.key));

export type Evento = { at: string; tipo: string; texto: string; href?: string; extra?: string };

/** Todo lo de un alumno para su ficha: lo del seguimiento y lo demás (visitas, asistente, tests, entregas, tutores). */
export async function fichaAlumno(id: string) {
  const base = await seguimiento();
  const alumno = base.alumnos.find((a) => a.id === id);
  if (!alumno) return null;
  const admin = createAdminClient();
  const [{ data: perfil }, { data: tutores }, { data: equipo }, { data: visitas }, { data: preguntas }, { data: log }, { data: intentos }, { data: entregas }, { data: matriculas }] =
    await Promise.all([
      admin.from("profiles").select("id, full_name, email, phone, created_at").eq("id", id).maybeSingle(),
      admin.from("student_teachers").select("teacher_id, created_at").eq("student_id", id),
      admin.from("profiles").select("id, full_name, email, role").in("role", ["profesor", "administrador"]).order("full_name"),
      admin.from("user_lesson_progress").select("lesson_id, status, time_spent_s, last_visit, completed_at").eq("user_id", id),
      admin.from("assistant_questions").select("id, question, answer, answered, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(200),
      admin.from("activity_log").select("id, kind, lesson_id, payload, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(400),
      admin.from("quiz_attempts").select("id, quiz_id, score, passed, created_at").eq("user_id", id).order("created_at", { ascending: false }),
      admin.from("submissions").select("id, lesson_id, evidence_url, explanation, status, score, feedback, created_at").eq("user_id", id).order("created_at", { ascending: false }),
      admin.from("enrollments").select("course, granted_at, active").eq("user_id", id),
    ]);

  // Los títulos de cualquier lección que salga (visitas, registro, entregas), no sólo las del seguimiento.
  const { data: quizzes } = (intentos ?? []).length
    ? await admin
        .from("quizzes")
        .select("id, lesson_id")
        .in(
          "id",
          (intentos ?? []).map((q) => q.quiz_id as string),
        )
    : { data: [] };
  const leccionDeQuiz = new Map((quizzes ?? []).map((q) => [q.id as string, q.lesson_id as string]));
  const idsLecciones = new Set<string>([
    ...(visitas ?? []).map((v) => v.lesson_id as string),
    ...(log ?? []).map((l) => l.lesson_id as string).filter(Boolean),
    ...(entregas ?? []).map((e) => e.lesson_id as string),
    ...leccionDeQuiz.values(),
  ]);
  const { data: titulos } = idsLecciones.size ? await admin.from("lessons").select("id, title").in("id", [...idsLecciones]) : { data: [] };
  const tituloDe = new Map((titulos ?? []).map((l) => [l.id as string, l.title as string]));
  const nombreDe = new Map((equipo ?? []).map((p) => [p.id as string, (p.full_name as string) || (p.email as string)]));

  return {
    ...base,
    alumno,
    perfil,
    tutores: (tutores ?? []).map((t) => ({ id: t.teacher_id as string, nombre: nombreDe.get(t.teacher_id as string) ?? "—", desde: t.created_at as string })),
    equipo: (equipo ?? []).map((p) => ({ id: p.id as string, nombre: ((p.full_name as string) || (p.email as string)) ?? "—", rol: p.role as string })),
    visitas: visitas ?? [],
    preguntas: preguntas ?? [],
    log: log ?? [],
    intentos: (intentos ?? []).map((q) => ({ ...q, lesson_id: leccionDeQuiz.get(q.quiz_id as string) ?? null })),
    entregas: entregas ?? [],
    matriculas: matriculas ?? [],
    tituloDe,
  };
}
