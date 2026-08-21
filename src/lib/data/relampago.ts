import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  CourseKey,
  Submission,
  SubmissionFeedback,
  Unlock,
} from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Campus · cursos relámpago
//
//  Lo que hace falta para cerrar el ciclo de una lección:
//  la entrega del alumno, su corrección y los desbloqueos.
// ══════════════════════════════════════════════════════════

export async function getSubmission(lessonId: string): Promise<Submission | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("lesson_id", lessonId)
    .maybeSingle();
  return (data as Submission) ?? null;
}

/** Todas las entregas del alumno, para el panel de progreso. */
export async function listSubmissions(): Promise<Submission[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("*");
  return (data ?? []) as Submission[];
}

/**
 * Estado de un curso relámpago para el alumno actual.
 *
 * Devuelve las cifras que gobiernan la pantalla y el desbloqueo final. Se
 * calcula del lado del servidor y de una vez: hacerlo lección a lección en la
 * plantilla eran veinticuatro consultas por pintura.
 */
export async function getFlashProgress(course: CourseKey) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: modules } = await supabase
    .from("modules")
    .select("id, slug, title, code, order_index, accent, icon")
    .eq("course", course)
    .order("order_index");

  const moduleIds = (modules ?? []).map((m) => m.id);
  if (moduleIds.length === 0) {
    return { modules: [], lessons: [], done: 0, passed: 0, submitted: 0, total: 0, complete: false };
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, module_id, slug, title, order_index, duration_min")
    .in("module_id", moduleIds)
    .order("order_index");

  const lessonIds = (lessons ?? []).map((l) => l.id);
  if (!user || lessonIds.length === 0) {
    return {
      modules: modules ?? [],
      lessons: lessons ?? [],
      done: 0,
      passed: 0,
      submitted: 0,
      total: lessonIds.length,
      complete: false,
    };
  }

  const [{ data: progress }, { data: subs }, { data: quizzes }] = await Promise.all([
    supabase
      .from("user_lesson_progress")
      .select("lesson_id, status")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds),
    supabase.from("submissions").select("lesson_id, status, score").in("lesson_id", lessonIds),
    supabase.from("quizzes").select("id, lesson_id").in("lesson_id", lessonIds),
  ]);

  const quizIds = (quizzes ?? []).map((q) => q.id);
  const { data: attempts } = quizIds.length
    ? await supabase
        .from("quiz_attempts")
        .select("quiz_id, passed")
        .eq("user_id", user.id)
        .in("quiz_id", quizIds)
    : { data: [] };

  const done = (progress ?? []).filter((p) => p.status === "completada").length;
  const passedQuizzes = new Set(
    (attempts ?? []).filter((a) => a.passed).map((a) => a.quiz_id),
  );
  const submitted = (subs ?? []).length;

  return {
    modules: modules ?? [],
    lessons: lessons ?? [],
    done,
    passed: passedQuizzes.size,
    submitted,
    total: lessonIds.length,
    // El criterio del máster plan: todas las lecciones vistas, todos los
    // controles superados y todas las misiones entregadas. La NOTA de las
    // misiones no entra: el objetivo es dominar el concepto, no filtrar, y
    // una entrega floja se rehace tras el feedback.
    complete:
      done >= lessonIds.length &&
      passedQuizzes.size >= quizIds.length &&
      submitted >= lessonIds.length,
  };
}

/** El catálogo de premios del curso, con su estado para el alumno. */
export async function getUnlocks(course: CourseKey) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: unlocks } = await supabase
    .from("unlocks")
    .select("*")
    .eq("course", course)
    .order("order_index");

  const ganados = new Set<string>();
  if (user) {
    const { data } = await supabase.from("user_unlocks").select("unlock_key").eq("user_id", user.id);
    for (const u of data ?? []) ganados.add(u.unlock_key);
  }

  return ((unlocks ?? []) as Unlock[]).map((u) => ({
    ...u,
    earned: ganados.has(u.key),
    // ⚠︎ La URL sólo viaja si está ganada. Mandarla siempre y esconder el
    // botón con CSS es regalar el material a quien abra el inspector.
    url: ganados.has(u.key) ? u.url : null,
  }));
}

/**
 * Abre los desbloqueos del curso si ya se cumple el requisito.
 *
 * Idempotente: se puede llamar en cada visita. Escribe con la service role
 * porque `user_unlocks` sólo lo gestiona el staff — que sea el propio alumno
 * quien pueda insertar ahí sería regalarle el candado con la llave puesta.
 */
export async function grantUnlocksIfComplete(course: CourseKey, userId: string) {
  const progress = await getFlashProgress(course);
  if (!progress.complete) return { granted: 0 };

  const admin = createAdminClient();
  const { data: unlocks } = await admin.from("unlocks").select("key").eq("course", course);
  if (!unlocks?.length) return { granted: 0 };

  const { error } = await admin
    .from("user_unlocks")
    .upsert(
      unlocks.map((u) => ({ user_id: userId, unlock_key: u.key })),
      { onConflict: "user_id,unlock_key", ignoreDuplicates: true },
    );
  if (error) {
    console.error(`[relampago] no se pudieron abrir los desbloqueos: ${error.message}`);
    return { granted: 0 };
  }
  return { granted: unlocks.length };
}

/** Guarda o rehace una entrega. Devuelve su id. */
export async function saveSubmission(input: {
  userId: string;
  lessonId: string;
  evidenceUrl: string | null;
  explanation: string;
}): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("submissions")
    .upsert(
      {
        user_id: input.userId,
        lesson_id: input.lessonId,
        evidence_url: input.evidenceUrl,
        explanation: input.explanation,
        // Rehacer una entrega borra la nota anterior: dejarla puesta mientras
        // se corrige la nueva hace creer que ya está corregida.
        status: "enviada" as const,
        score: null,
        feedback: null,
        reviewer: null,
        reviewed_at: null,
      },
      { onConflict: "user_id,lesson_id" },
    )
    .select("id")
    .maybeSingle();

  if (error) {
    console.error(`[relampago] no se pudo guardar la entrega: ${error.message}`);
    return null;
  }
  return data?.id ?? null;
}

/** Escribe el resultado de la corrección. */
export async function saveReview(
  submissionId: string,
  review: { score: number | null; feedback: SubmissionFeedback | null; reviewer: string; manual: boolean },
) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("submissions")
    .update({
      status: review.manual ? "revision_manual" : "corregida",
      score: review.score,
      feedback: review.feedback,
      reviewer: review.reviewer,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  if (error) console.error(`[relampago] no se pudo guardar la corrección: ${error.message}`);
}
