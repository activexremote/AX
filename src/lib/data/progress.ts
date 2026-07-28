import { createClient } from "@/lib/supabase/server";
import type { UserLessonProgress } from "@/lib/supabase/types";

export async function getProgressForCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id);
  return (data ?? []) as UserLessonProgress[];
}

export async function getAggregatedProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      totalLessons: 0,
      completed: 0,
      timeSpentS: 0,
      avgQuizScore: null as number | null,
      perModule: [] as { id: string; title: string; lessons: number; completed: number; icon: string | null }[],
      details: [] as {
        module_title: string;
        lesson_title: string;
        status: string;
        time_spent_s: number;
        last_visit: string | null;
        quiz_score: number | null;
      }[],
      activity: [] as { id: string; kind: string; created_at: string; payload: Record<string, unknown> }[],
    };
  }

  const [{ data: modules }, { data: lessons }, { data: progress }, { data: attempts }, { data: activity }] = await Promise.all([
    supabase.from("modules").select("id, title, icon").order("order_index"),
    supabase.from("lessons").select("id, module_id, title").order("module_id, order_index"),
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("score, passed, quiz_id, created_at").eq("user_id", user.id),
    supabase.from("activity_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
  ]);

  const totalLessons = (lessons ?? []).length;
  const completed = (progress ?? []).filter((p) => p.status === "completada").length;
  const timeSpentS = (progress ?? []).reduce((acc, p) => acc + (p.time_spent_s ?? 0), 0);
  const avgQuizScore = attempts?.length
    ? attempts.reduce((acc, a) => acc + Number(a.score), 0) / attempts.length
    : null;

  const perModule = (modules ?? []).map((m) => {
    const ml = (lessons ?? []).filter((l) => l.module_id === m.id);
    const completedHere = ml.filter((l) =>
      (progress ?? []).some((p) => p.lesson_id === l.id && p.status === "completada"),
    ).length;
    return {
      id: m.id,
      title: m.title,
      icon: m.icon,
      lessons: ml.length,
      completed: completedHere,
    };
  });

  const details = (progress ?? [])
    .map((p) => {
      const lesson = (lessons ?? []).find((l) => l.id === p.lesson_id);
      const moduleId = lesson?.module_id;
      const module = (modules ?? []).find((m) => m.id === moduleId);
      return {
        module_title: module?.title ?? "—",
        lesson_title: lesson?.title ?? "—",
        status: p.status,
        time_spent_s: p.time_spent_s,
        last_visit: p.last_visit,
        quiz_score: null,
      };
    })
    .sort((a, b) => (b.last_visit ?? "").localeCompare(a.last_visit ?? ""));

  return {
    totalLessons,
    completed,
    timeSpentS,
    avgQuizScore,
    perModule,
    details,
    activity: (activity ?? []).map((a) => ({
      id: a.id,
      kind: a.kind,
      created_at: a.created_at,
      payload: a.payload as Record<string, unknown>,
    })),
  };
}
