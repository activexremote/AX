import { createClient } from "@/lib/supabase/server";
import type { Lesson, LearningPathStep, Module, Quiz, QuizOption, QuizQuestion } from "@/lib/supabase/types";

export async function listModulesWithCounts() {
  const supabase = await createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .order("order_index");

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, duration_min");

  return (modules ?? []).map((m) => {
    const ml = (lessons ?? []).filter((l) => l.module_id === m.id);
    const minutes = ml.reduce((acc, l) => acc + (l.duration_min ?? 0), 0);
    return {
      ...m,
      lessons_count: ml.length,
      estimated_minutes: m.estimated_minutes ?? minutes,
    } as Module & { lessons_count: number };
  });
}

export async function getModuleBySlug(slug: string) {
  const supabase = await createClient();
  const { data: module } = await supabase
    .from("modules")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!module) return null;

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", module.id)
    .order("order_index");

  return { module: module as Module, lessons: (lessons ?? []) as Lesson[] };
}

export async function getLessonForView(lessonId: string) {
  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return null;

  const [{ data: module }, { data: siblings }, { data: quiz }] = await Promise.all([
    supabase.from("modules").select("*").eq("id", lesson.module_id).maybeSingle(),
    supabase.from("lessons").select("id, slug, title, order_index, duration_min")
      .eq("module_id", lesson.module_id).order("order_index"),
    supabase.from("quizzes").select("*").eq("lesson_id", lesson.id).maybeSingle(),
  ]);

  let questions: (QuizQuestion & { options: QuizOption[] })[] = [];
  if (quiz) {
    const { data: qs } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", quiz.id)
      .order("order_index");
    if (qs?.length) {
      const { data: opts } = await supabase
        .from("quiz_options")
        .select("*")
        .in("question_id", qs.map((q) => q.id))
        .order("order_index");
      questions = qs.map((q) => ({
        ...(q as QuizQuestion),
        options: (opts ?? []).filter((o) => o.question_id === q.id) as QuizOption[],
      }));
    }
  }

  return {
    lesson: lesson as Lesson,
    module: module as Module,
    siblings: (siblings ?? []) as Pick<Lesson, "id" | "slug" | "title" | "order_index" | "duration_min">[],
    quiz: quiz as Quiz | null,
    questions,
  };
}

export async function getLearningPath() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learning_path_steps")
    .select("*")
    .order("order_index");
  return (data ?? []) as LearningPathStep[];
}
