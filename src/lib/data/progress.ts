import { usuarioActual } from "@/lib/data/usuario";
import { createClient } from "@/lib/supabase/server";
import { localize } from "@/lib/data/localize";
import { getLocale } from "@/lib/i18n/server";
import type { UserLessonProgress } from "@/lib/supabase/types";

export async function getProgressForCurrentUser() {
  const supabase = await createClient();
  const user = await usuarioActual();
  if (!user) return [];

  const { data } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id);
  return (data ?? []) as UserLessonProgress[];
}

// ══════════════════════════════════════════════════════════
//  Todo lo de «Mi progreso», en una ida al servidor
//
//  Sólo cuenta lo que el alumno puede ver: módulos y lecciones salen por la
//  RLS (has_course_access), así que el total es el de sus cursos, no el del
//  catálogo entero.
// ══════════════════════════════════════════════════════════

export type ModuloProgreso = { id: string; slug: string; title: string; icon: string | null; course: string; lessons: number; completed: number; started: boolean };
export type LeccionProgreso = {
  lesson_id: string;
  module_title: string;
  lesson_title: string;
  status: string;
  time_spent_s: number;
  last_visit: string | null;
  /** Mejor nota del test de la lección, o null si no tiene o no lo ha hecho. */
  quiz_score: number | null;
};
export type ResultadoTest = { lesson_id: string; lesson_title: string; best: number; passed: boolean; attempts: number; last: string };
export type Actividad = { id: string; kind: string; created_at: string; lesson_id: string | null; lesson_title: string | null; score: number | null };

export async function getAggregatedProgress() {
  const supabase = await createClient();
  const [locale, user] = await Promise.all([getLocale(), usuarioActual()]);
  const vacio = {
    totalLessons: 0,
    completed: 0,
    timeSpentS: 0,
    avgQuizScore: null as number | null,
    perModule: [] as ModuloProgreso[],
    details: [] as LeccionProgreso[],
    quizzes: [] as ResultadoTest[],
    activity: [] as Actividad[],
    /** La última lección empezada y sin terminar: el «sigue donde lo dejaste». */
    continuar: null as { lesson_id: string; lesson_title: string; module_title: string } | null,
  };
  if (!user) return vacio;

  const [{ data: modulesRaw }, { data: lessonsRaw }, { data: progress }, { data: attempts }, { data: activity }, { data: quizzesRaw }] = await Promise.all([
    supabase.from("modules").select("id, slug, title, title_en, icon, course").order("order_index"),
    supabase.from("lessons").select("id, module_id, title, title_en, order_index").order("order_index"),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("score, passed, quiz_id, created_at").eq("user_id", user.id),
    supabase.from("activity_log").select("id, kind, created_at, lesson_id, payload").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("quizzes").select("id, lesson_id"),
  ]);

  const modules = (modulesRaw ?? []).map((m) => localize(m, locale));
  const lessons = (lessonsRaw ?? []).map((l) => localize(l, locale));
  const lessonById = new Map(lessons.map((l) => [l.id as string, l]));
  const moduleById = new Map(modules.map((m) => [m.id as string, m]));
  const lessonOfQuiz = new Map((quizzesRaw ?? []).map((q) => [q.id as string, q.lesson_id as string]));
  const rows = progress ?? [];

  const totalLessons = lessons.length;
  // Sólo lecciones que existen y se pueden ver: una fila de progreso de una
  // lección borrada no cuenta.
  const completed = rows.filter((p) => p.status === "completada" && lessonById.has(p.lesson_id)).length;
  const timeSpentS = rows.reduce((acc, p) => acc + (p.time_spent_s ?? 0), 0);
  const avgQuizScore = attempts?.length ? attempts.reduce((acc, a) => acc + Number(a.score), 0) / attempts.length : null;

  const perModule: ModuloProgreso[] = modules
    .map((m) => {
      const ml = lessons.filter((l) => l.module_id === m.id);
      const mine = rows.filter((p) => ml.some((l) => l.id === p.lesson_id));
      return {
        id: m.id as string,
        slug: m.slug as string,
        title: m.title as string,
        icon: (m.icon as string | null) ?? null,
        course: m.course as string,
        lessons: ml.length,
        completed: mine.filter((p) => p.status === "completada").length,
        started: mine.length > 0,
      };
    })
    .filter((m) => m.lessons > 0);

  // Por lección, el mejor intento de su test.
  const tests = new Map<string, ResultadoTest>();
  for (const a of attempts ?? []) {
    const lid = lessonOfQuiz.get(a.quiz_id as string);
    const l = lid ? lessonById.get(lid) : undefined;
    if (!lid || !l) continue;
    const score = Number(a.score);
    const prev = tests.get(lid);
    tests.set(lid, {
      lesson_id: lid,
      lesson_title: l.title as string,
      best: Math.max(prev?.best ?? 0, score),
      passed: Boolean(prev?.passed || a.passed),
      attempts: (prev?.attempts ?? 0) + 1,
      last: !prev || a.created_at > prev.last ? (a.created_at as string) : prev.last,
    });
  }

  const details: LeccionProgreso[] = rows
    .filter((p) => lessonById.has(p.lesson_id))
    .map((p) => {
      const lesson = lessonById.get(p.lesson_id)!;
      return {
        lesson_id: p.lesson_id as string,
        module_title: (moduleById.get(lesson.module_id as string)?.title as string) ?? "—",
        lesson_title: lesson.title as string,
        status: p.status as string,
        time_spent_s: p.time_spent_s ?? 0,
        last_visit: p.last_visit ?? null,
        quiz_score: tests.get(p.lesson_id)?.best ?? null,
      };
    })
    .sort((a, b) => (b.last_visit ?? "").localeCompare(a.last_visit ?? ""));

  const abierta = details.find((d) => d.status !== "completada");

  return {
    totalLessons,
    completed,
    timeSpentS,
    avgQuizScore,
    perModule,
    details,
    quizzes: [...tests.values()].sort((a, b) => b.last.localeCompare(a.last)),
    activity: (activity ?? []).map((a) => {
      const lid = (a.lesson_id as string | null) ?? null;
      const score = (a.payload as { score?: unknown } | null)?.score;
      return {
        id: a.id as string,
        kind: a.kind as string,
        created_at: a.created_at as string,
        lesson_id: lid && lessonById.has(lid) ? lid : null,
        lesson_title: lid ? ((lessonById.get(lid)?.title as string) ?? null) : null,
        score: typeof score === "number" ? score : null,
      };
    }),
    continuar: abierta ? { lesson_id: abierta.lesson_id, lesson_title: abierta.lesson_title, module_title: abierta.module_title } : null,
  };
}
