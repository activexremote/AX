import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/slack/notify";

type Ctx = {
  studentName: string;
  studentEmail: string;
  lessonTitle: string;
  moduleId: string;
  moduleTitle: string;
};

async function loadContext(userId: string, lessonId: string): Promise<Ctx | null> {
  const admin = createAdminClient();
  const { data: lesson } = await admin
    .from("lessons")
    .select("title, module_id")
    .eq("id", lessonId)
    .maybeSingle();
  if (!lesson) return null;

  const [{ data: profile }, { data: module }] = await Promise.all([
    admin.from("profiles").select("full_name, email").eq("id", userId).maybeSingle(),
    admin.from("modules").select("title").eq("id", lesson.module_id).maybeSingle(),
  ]);

  return {
    studentName: profile?.full_name ?? profile?.email ?? "Un alumno",
    studentEmail: profile?.email ?? "",
    lessonTitle: lesson.title as string,
    moduleId: lesson.module_id as string,
    moduleTitle: module?.title ?? "—",
  };
}

/** Si el alumno tiene asignado el módulo y lo ha completado entero, cierra la tarea. */
async function syncAssignment(userId: string, ctx: Ctx) {
  const admin = createAdminClient();
  const { data: assignment } = await admin
    .from("assignments")
    .select("id, status")
    .eq("student_id", userId)
    .eq("module_id", ctx.moduleId)
    .maybeSingle();
  if (!assignment || assignment.status === "completada") return;

  const { data: lessons } = await admin
    .from("lessons")
    .select("id")
    .eq("module_id", ctx.moduleId);
  const lessonIds = (lessons ?? []).map((l) => l.id);
  if (lessonIds.length === 0) return;

  const { data: progress } = await admin
    .from("user_lesson_progress")
    .select("lesson_id, status")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  const done = (progress ?? []).filter((p) => p.status === "completada").length;

  if (done < lessonIds.length) {
    if (assignment.status === "pendiente") {
      await admin.from("assignments").update({ status: "en_curso" }).eq("id", assignment.id);
    }
    return;
  }

  await admin
    .from("assignments")
    .update({ status: "completada", completed_at: new Date().toISOString() })
    .eq("id", assignment.id);

  await notify({
    event: "assignment_completed",
    title: "Tarea completada",
    lines: [
      `*Alumno:* ${ctx.studentName}`,
      `*Módulo:* ${ctx.moduleTitle}`,
      "El alumno ha terminado todas las lecciones del módulo asignado.",
    ],
  });
}

export async function onLessonCompleted(userId: string, lessonId: string) {
  try {
    const ctx = await loadContext(userId, lessonId);
    if (!ctx) return;
    await notify({
      event: "lesson_completed",
      title: "Lección completada",
      lines: [
        `*Alumno:* ${ctx.studentName}`,
        `*Lección:* ${ctx.lessonTitle}`,
        `*Módulo:* ${ctx.moduleTitle}`,
      ],
    });
    await syncAssignment(userId, ctx);
  } catch {
    // las notificaciones nunca rompen el flujo principal
  }
}

export async function onQuizResult(
  userId: string,
  lessonId: string,
  passed: boolean,
  score: number,
) {
  try {
    const ctx = await loadContext(userId, lessonId);
    if (!ctx) return;
    await notify({
      event: passed ? "quiz_passed" : "quiz_failed",
      title: passed ? "Examen aprobado" : "Examen suspendido",
      lines: [
        `*Alumno:* ${ctx.studentName}`,
        `*Lección:* ${ctx.lessonTitle}`,
        `*Nota:* ${Math.round(score)}%`,
      ],
    });
    if (passed) await syncAssignment(userId, ctx);
  } catch {
    // ignore
  }
}
