"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { onLessonCompleted, onQuizResult } from "@/lib/slack/lesson-hooks";
import { grantUnlocksIfComplete, saveReview, saveSubmission } from "@/lib/data/relampago";
import { reviewSubmission } from "@/lib/relampago/review";

export async function recordLessonVisit(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  const now = new Date().toISOString();
  const { data: existing } = await supabase
    .from("user_lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existing?.status === "completada") {
    await supabase
      .from("user_lesson_progress")
      .update({ last_visit: now })
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    return { ok: true };
  }

  await supabase.from("user_lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    status: "en_curso",
    last_visit: now,
  });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    kind: "lesson_start",
    lesson_id: lessonId,
  });

  return { ok: true };
}

export async function markLessonComplete(lessonId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  const now = new Date().toISOString();
  await supabase.from("user_lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    status: "completada",
    last_visit: now,
    completed_at: now,
  });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    kind: "lesson_complete",
    lesson_id: lessonId,
  });

  await onLessonCompleted(user.id, lessonId);

  revalidatePath(`/lecciones/${lessonId}`);
  revalidatePath("/mi-progreso");
  revalidatePath("/mis-tareas");
  return { ok: true };
}

export async function submitQuizAttempt(input: {
  quizId: string;
  lessonId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    quiz_id: input.quizId,
    score: input.score,
    passed: input.passed,
    answers: input.answers,
  });

  await supabase.from("activity_log").insert({
    user_id: user.id,
    kind: input.passed ? "quiz_pass" : "quiz_fail",
    lesson_id: input.lessonId,
    quiz_id: input.quizId,
    payload: { score: input.score },
  });

  if (input.passed) {
    const now = new Date().toISOString();
    await supabase.from("user_lesson_progress").upsert({
      user_id: user.id,
      lesson_id: input.lessonId,
      status: "completada",
      last_visit: now,
      completed_at: now,
    });
  }

  await onQuizResult(user.id, input.lessonId, input.passed, input.score);

  revalidatePath(`/lecciones/${input.lessonId}`);
  revalidatePath("/mi-progreso");
  revalidatePath("/mis-tareas");
  return { ok: true };
}

export async function addLessonTime(lessonId: string, seconds: number) {
  if (seconds <= 0 || seconds > 60 * 60) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("user_lesson_progress")
    .select("time_spent_s, status")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  await supabase.from("user_lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    status: existing?.status ?? "en_curso",
    time_spent_s: (existing?.time_spent_s ?? 0) + seconds,
    last_visit: new Date().toISOString(),
  });
}

// ══════════════════════════════════════════════════════════
//  Misiones de los cursos relámpago
// ══════════════════════════════════════════════════════════

/**
 * Entrega (o rehace) la misión de una lección y la manda a corregir.
 *
 * La corrección va EN LÍNEA, no en segundo plano, y es a propósito: el alumno
 * acaba de pulsar "entregar" y está mirando la pantalla. Diez segundos
 * esperando una nota son diez segundos de tensión útil; un "ya te avisaremos"
 * rompe el ciclo de la lección y casi nadie vuelve a mirarlo.
 */
export async function submitMission(input: {
  lessonId: string;
  evidenceUrl: string;
  explanation: string;
}): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  const explanation = input.explanation.trim();
  const evidenceUrl = input.evidenceUrl.trim();
  // Sin explicación no hay nada que corregir: la comprensión es el 25 % de la
  // rúbrica y la autonomía otro 10 %, y las dos se juzgan justo aquí.
  if (explanation.length < 40) return { error: "explicacion-corta" };
  if (explanation.length > 6000) return { error: "explicacion-larga" };
  if (evidenceUrl && !/^https?:\/\/\S+$/i.test(evidenceUrl)) return { error: "url-mala" };

  // La lección tiene que existir, tener misión y ser visible para este alumno:
  // el `select` pasa por RLS, así que si no tiene el curso comprado no la ve.
  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, title, outcome, terms, mission_md, mission_criterion, evidence_hint, module_id, content_md",
    )
    .eq("id", input.lessonId)
    .maybeSingle();
  if (!lesson) return { error: "no-acceso" };
  if (!lesson.mission_md) return { error: "sin-mision" };

  const submissionId = await saveSubmission({
    userId: user.id,
    lessonId: lesson.id,
    evidenceUrl: evidenceUrl || null,
    explanation,
  });
  if (!submissionId) return { error: "db" };

  const review = await reviewSubmission(
    {
      lessonTitle: lesson.title,
      outcome: lesson.outcome,
      terms: lesson.terms,
      mission: lesson.mission_md,
      criterion: lesson.mission_criterion,
      evidenceHint: lesson.evidence_hint,
      // La lectura técnica, para que se corrija contra lo que enseña la
      // lección y no contra lo que opine el modelo.
      reading: lesson.content_md,
    },
    { evidenceUrl: evidenceUrl || null, explanation },
  );
  await saveReview(submissionId, review);

  // Entregar la misión es el último paso de la lección: darla por completada
  // aquí evita el paso administrativo de pulsar además "marcar como hecha".
  await markLessonComplete(lesson.id);

  // ¿Se acaba de cerrar el curso entero? Entonces se abren los desbloqueos.
  const { data: mod } = await supabase
    .from("modules")
    .select("course")
    .eq("id", lesson.module_id)
    .maybeSingle();
  if (mod?.course && mod.course !== "core") {
    await grantUnlocksIfComplete(mod.course, user.id);
  }

  revalidatePath(`/lecciones/${lesson.id}`);
  revalidatePath("/");
  return { ok: true };
}
