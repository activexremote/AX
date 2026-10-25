import { createClient } from "@/lib/supabase/server";
import { localize } from "@/lib/data/localize";
import { getLocale } from "@/lib/i18n/server";
import type { Lesson, LearningPathStep, Module, Quiz, QuizOption, QuizQuestion } from "@/lib/supabase/types";

export async function listModulesWithCounts() {
  const supabase = await createClient();
  // Módulos y lecciones a la vez: son independientes.
  const [locale, { data: modules }, { data: lessons }] = await Promise.all([
    getLocale(),
    supabase.from("modules").select("*").order("order_index"),
    supabase.from("lessons").select("id, module_id, duration_min, order_index, title, title_en"),
  ]);

  return (modules ?? []).map((m) => {
    const ml = (lessons ?? []).filter((l) => l.module_id === m.id).sort((a, b) => a.order_index - b.order_index);
    const minutes = ml.reduce((acc, l) => acc + (l.duration_min ?? 0), 0);
    return {
      ...localize(m, locale),
      lessons_count: ml.length,
      estimated_minutes: m.estimated_minutes ?? minutes,
      // Las lecciones en orden, sólo id y título: con esto la portada del
      // campus sabe por dónde va cada alumno y a qué lección llevarle.
      ordered_lessons: ml.map((l) => ({ id: l.id as string, title: (locale === "en" && l.title_en?.trim() ? l.title_en : l.title) as string })),
    } as Module & { lessons_count: number; ordered_lessons: { id: string; title: string }[] };
  });
}

export async function getModuleBySlug(slug: string) {
  const supabase = await createClient();
  // El módulo y sus lecciones en una sola consulta (antes eran dos, una
  // detrás de otra). El orden se pone aquí: es una lista corta.
  const [locale, { data: fila }] = await Promise.all([
    getLocale(),
    // Con el test de cada lección (sólo su id): la lista dice qué lecciones tienen control.
    supabase.from("modules").select("*, lecciones:lessons(*, quizzes(id))").eq("slug", slug).maybeSingle(),
  ]);
  if (!fila) return null;
  const { lecciones, ...module } = fila as Module & { lecciones: (Lesson & { quizzes: { id: string }[] | { id: string } | null })[] | null };

  return {
    module: localize(module as Module, locale),
    lessons: [...(lecciones ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map(({ quizzes, ...l }) => ({
        ...localize(l as Lesson, locale),
        has_quiz: Array.isArray(quizzes) ? quizzes.length > 0 : Boolean(quizzes),
      })),
  };
}

type Hermana = Pick<Lesson, "id" | "slug" | "title" | "title_en" | "order_index" | "duration_min">;

export async function getLessonForView(lessonId: string) {
  const supabase = await createClient();
  // Todo en una ida al servidor: la lección con su módulo y las lecciones
  // hermanas, y el test con sus preguntas y opciones. Antes eran cuatro
  // consultas en cadena (lección → módulo/hermanas/test → preguntas → opciones).
  const [locale, { data: fila }, { data: quizFila }] = await Promise.all([
    getLocale(),
    supabase
      .from("lessons")
      .select("*, modulo:modules(*, hermanas:lessons(id, slug, title, title_en, order_index, duration_min))")
      .eq("id", lessonId)
      .maybeSingle(),
    supabase.from("quizzes").select("*, preguntas:quiz_questions(*, opciones:quiz_options(*))").eq("lesson_id", lessonId).maybeSingle(),
  ]);
  if (!fila) return null;

  const { modulo, ...lesson } = fila as Lesson & { modulo: (Module & { hermanas: Hermana[] | null }) | null };
  const { hermanas, ...module } = (modulo ?? {}) as Module & { hermanas: Hermana[] | null };
  const siblings = [...(hermanas ?? [])].sort((a, b) => a.order_index - b.order_index);

  let quiz: Quiz | null = null;
  let questions: (QuizQuestion & { options: QuizOption[] })[] = [];
  if (quizFila) {
    const { preguntas, ...resto } = quizFila as Quiz & { preguntas: (QuizQuestion & { opciones: QuizOption[] | null })[] | null };
    quiz = resto as Quiz;
    questions = [...(preguntas ?? [])]
      .sort((a, b) => a.order_index - b.order_index)
      .map(({ opciones, ...q }) => ({
        ...(q as QuizQuestion),
        options: [...(opciones ?? [])].sort((a, b) => a.order_index - b.order_index),
      }));
  }

  return {
    lesson: localize(lesson as Lesson, locale),
    module: localize(module as Module, locale),
    // Sin traducir: es lo que editan los editores, que tienen su propio
    // selector de idioma. Editar la versión traducida y guardarla en la otra
    // columna era la forma de pisar el español con el inglés.
    raw: { lesson: lesson as Lesson, module: module as Module },
    siblings: siblings.map((s) => localize(s, locale)),
    quiz,
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
