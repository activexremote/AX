import "server-only";

import { alumnosVisibles } from "@/lib/actividades/acceso";
import { faltanRecursos, recursosDeLeccion } from "@/lib/actividades/avance";
import { actividadesDelModulo, modulosConActividades } from "@/lib/actividades/catalogo";
import { cuentaComoHecha, type Actividad, type FilaRespuesta } from "@/lib/actividades/tipos";
import { CON_PLAZA } from "@/lib/dry-run/tipos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  Seguimiento de los alumnos (panel)
//
//  Lo que necesitan las pestañas de Respuestas y la ficha del alumno, en una
//  sola carga: los módulos con actividades, sus lecciones y su material, y
//  de cada alumno que puede ver quien mira (un profesor, los suyos; la
//  administración, todos) qué ha completado, abierto y enviado.
// ══════════════════════════════════════════════════════════

const COLUMNAS = "id, user_id, lesson_id, activity_key, answers, result, status, attempts, submitted_at, rubric, feedback, reviewed_at, updated_at, grade, notified_at";
const SIN_ID = "00000000-0000-0000-0000-000000000000";

export type LeccionSeg = { id: string; moduleId: string; orden: number; title: string; recursos: { url: string; label: string }[]; fila: { content_blocks: unknown; content_blocks_en: unknown } };
export type AlumnoSeg = {
  id: string;
  nombre: string;
  email: string;
  /** Pasos de la preparación del dry run hechos, o null si no es invitado. */
  preparacion: { hechos: number; total: number } | null;
  completadas: Set<string>;
  /** Lecciones que para él aún no se han abierto (horas del dry run antes de la clase). */
  cerradas: Set<string>;
  abiertos: Map<string, Map<string, string>>;
  respuestas: Map<string, FilaRespuesta>;
  ultima: string | null;
};

export async function seguimiento() {
  const admin = createAdminClient();
  const visibles = await alumnosVisibles();
  const { data: modulos } = await admin.from("modules").select("id, slug, title").in("slug", modulosConActividades()).order("order_index");
  const ids = (modulos ?? []).map((m) => m.id as string);
  const actividades = (modulos ?? []).flatMap((m) => actividadesDelModulo(m.slug as string));

  const { data: lecs } = ids.length
    ? await admin.from("lessons").select("id, module_id, order_index, title, content_blocks, content_blocks_en").in("module_id", ids).order("order_index")
    : { data: [] };
  const lecciones: LeccionSeg[] = (lecs ?? []).map((l) => ({
    id: l.id as string,
    moduleId: l.module_id as string,
    orden: l.order_index as number,
    title: l.title as string,
    recursos: recursosDeLeccion(l).es,
    fila: { content_blocks: l.content_blocks, content_blocks_en: l.content_blocks_en },
  }));
  const lessonIds = lecciones.length ? lecciones.map((l) => l.id) : [SIN_ID];

  const { data: runs } = ids.length ? await admin.from("dry_runs").select("id, module_id, starts_at").in("module_id", ids) : { data: [] };
  const [{ data: guests }, { data: progreso }, { data: aperturas }, { data: resp }, { data: matriculas }] = await Promise.all([
    runs?.length
      ? admin
          .from("dry_run_guests")
          .select("user_id, dry_run_id, onboarding")
          .in(
            "dry_run_id",
            runs.map((r) => r.id),
          )
          .in("status", CON_PLAZA)
          .not("user_id", "is", null)
      : Promise.resolve({ data: [] as { user_id: string; dry_run_id: string; onboarding: Record<string, string> }[] }),
    admin.from("user_lesson_progress").select("user_id, lesson_id, status, last_visit").in("lesson_id", lessonIds),
    admin.from("resource_opens").select("user_id, lesson_id, url, opened_at").in("lesson_id", lessonIds),
    actividades.length
      ? admin
          .from("activity_responses")
          .select(COLUMNAS)
          .in(
            "activity_key",
            actividades.map((a) => a.key),
          )
      : Promise.resolve({ data: [] }),
    admin.from("enrollments").select("user_id").eq("active", true),
  ]);

  // Quién sale: invitados, matriculados, asignados y cualquiera que haya
  // hecho algo; y de ellos, sólo los que puede ver quien mira.
  const candidatos = new Set<string>(
    [
      ...(guests ?? []).map((g) => g.user_id as string),
      ...(matriculas ?? []).map((m) => m.user_id as string),
      ...visibles.ids,
      ...(aperturas ?? []).map((r) => r.user_id as string),
      ...((resp ?? []) as FilaRespuesta[]).map((r) => r.user_id),
    ].filter((id) => visibles.todos || visibles.ids.has(id)),
  );
  const { data: perfiles } = candidatos.size ? await admin.from("profiles").select("id, full_name, email, role").in("id", [...candidatos]) : { data: [] };
  const perfil = new Map((perfiles ?? []).map((p) => [p.id as string, p]));
  const ahora = Date.now();

  const alumnos: AlumnoSeg[] = [...candidatos]
    // El equipo prueba el campus con sus cuentas: no es un alumno.
    .filter((id) => perfil.has(id) && !["profesor", "administrador", "comercial"].includes(perfil.get(id)!.role as string))
    .map((id) => {
      const p = perfil.get(id)!;
      const g = (guests ?? []).find((x) => x.user_id === id);
      const pasos = ((g?.onboarding as Record<string, string> | null) ?? {}) as Record<string, string>;
      const run = g ? (runs ?? []).find((r) => r.id === g.dry_run_id) : null;
      const cerradas = new Set<string>();
      if (run && ahora < new Date(run.starts_at as string).getTime()) {
        lecciones.filter((l) => l.moduleId === run.module_id).slice(1).forEach((l) => cerradas.add(l.id));
      }
      const abiertos = new Map<string, Map<string, string>>();
      const fechas: string[] = [];
      for (const r of aperturas ?? []) {
        if (r.user_id !== id) continue;
        const k = r.lesson_id as string;
        if (!abiertos.has(k)) abiertos.set(k, new Map());
        abiertos.get(k)!.set(r.url as string, r.opened_at as string);
        fechas.push(r.opened_at as string);
      }
      const mios = (progreso ?? []).filter((x) => x.user_id === id);
      fechas.push(...mios.map((x) => x.last_visit as string).filter(Boolean));
      const respuestas = new Map(((resp ?? []) as FilaRespuesta[]).filter((x) => x.user_id === id).map((x) => [x.activity_key, x]));
      fechas.push(...[...respuestas.values()].map((x) => x.updated_at));
      return {
        id,
        nombre: (p.full_name as string) || (p.email as string) || "—",
        email: (p.email as string) ?? "",
        preparacion: g ? { hechos: PASOS.filter((x) => pasos[x.key]).length, total: PASOS.length } : null,
        completadas: new Set(mios.filter((x) => x.status === "completada").map((x) => x.lesson_id as string)),
        cerradas,
        abiertos,
        respuestas,
        ultima: fechas.sort().pop() ?? null,
      };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  return { modulos: modulos ?? [], lecciones, actividades, alumnos };
}

export type Seguimiento = Awaited<ReturnType<typeof seguimiento>>;

/** Cuántos enlaces de la lección ha abierto el alumno. */
export function materialDe(l: LeccionSeg, a: AlumnoSeg) {
  const abiertos = new Set(a.abiertos.get(l.id)?.keys() ?? []);
  const total = l.recursos.length;
  return { total, abiertos: total - faltanRecursos(l.fila, abiertos).length };
}

export const hechaPor = (act: Actividad, a: AlumnoSeg) => cuentaComoHecha(act, a.respuestas.get(act.key));

/** Las actividades de una lección. */
export const actividadesDeLeccion = (s: Seguimiento, l: LeccionSeg) =>
  s.actividades.filter((a) => s.modulos.some((m) => m.id === l.moduleId && m.slug === a.modulo) && a.leccion === l.orden);

/** Lo esencial de un alumno, sin contar lo que aún no se ha abierto. */
export function resumenDe(s: Seguimiento, a: AlumnoSeg) {
  const abiertas = s.lecciones.filter((l) => !a.cerradas.has(l.id));
  const obligatorias = abiertas.flatMap((l) => actividadesDeLeccion(s, l)).filter((x) => x.obligatoria);
  const material = abiertas.reduce(
    (acc, l) => {
      const m = materialDe(l, a);
      return { a: acc.a + m.abiertos, b: acc.b + m.total };
    },
    { a: 0, b: 0 },
  );
  const notas = [...a.respuestas.values()].map((x) => x.grade).filter((n): n is number => n !== null && n !== undefined).map(Number);
  const porCorregir = [...a.respuestas.values()].filter((x) => x.status === "enviada" && s.actividades.find((y) => y.key === x.activity_key)?.revisa);
  return {
    actividades: { a: obligatorias.filter((x) => hechaPor(x, a)).length, b: obligatorias.length },
    material,
    media: notas.length ? Math.round((notas.reduce((t, n) => t + n, 0) / notas.length) * 10) / 10 : null,
    porCorregir,
  };
}

/** Lo de la ficha que no hace falta en las listas: profesores, asistente e historial. */
export async function extrasFicha(id: string) {
  const admin = createAdminClient();
  const [{ data: tutores }, { data: equipo }, { data: preguntas }, { data: log }] = await Promise.all([
    admin.from("student_teachers").select("teacher_id").eq("student_id", id),
    admin.from("profiles").select("id, full_name, email, role").in("role", ["profesor", "administrador"]).order("full_name"),
    admin.from("assistant_questions").select("id, question, answer, created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(100),
    admin.from("activity_log").select("id, kind, lesson_id, created_at").eq("user_id", id).in("kind", ["lesson_start", "lesson_complete", "quiz_pass", "quiz_fail"]).order("created_at", { ascending: false }).limit(200),
  ]);
  const nombre = (p: { full_name?: unknown; email?: unknown }) => ((p.full_name as string) || (p.email as string)) ?? "—";
  const deEquipo = new Map((equipo ?? []).map((p) => [p.id as string, nombre(p)]));
  const ids = new Set((log ?? []).map((l) => l.lesson_id as string).filter(Boolean));
  const { data: titulos } = ids.size ? await admin.from("lessons").select("id, title").in("id", [...ids]) : { data: [] };
  return {
    tutores: (tutores ?? []).map((t) => ({ id: t.teacher_id as string, nombre: deEquipo.get(t.teacher_id as string) ?? "—" })),
    equipo: (equipo ?? []).map((p) => ({ id: p.id as string, nombre: nombre(p) })),
    preguntas: (preguntas ?? []) as { id: string; question: string; answer: string | null; created_at: string }[],
    log: (log ?? []) as { id: string; kind: string; lesson_id: string | null; created_at: string }[],
    tituloDe: new Map((titulos ?? []).map((l) => [l.id as string, l.title as string])),
  };
}
