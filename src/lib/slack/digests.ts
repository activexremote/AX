import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { notify } from "@/lib/slack/notify";

const DAY = 24 * 60 * 60 * 1000;

/** Resumen de progreso de alumnos → canal de profesores. */
export async function runStudentProgressDigest() {
  const admin = createAdminClient();
  const since = new Date(Date.now() - 7 * DAY).toISOString();

  const [{ data: students }, { data: progress }, { data: attempts }] = await Promise.all([
    admin.from("profiles").select("id, full_name, email").eq("role", "alumno"),
    admin.from("user_lesson_progress").select("user_id, status, completed_at, last_visit"),
    admin.from("quiz_attempts").select("user_id, passed, created_at"),
  ]);

  const studentList = students ?? [];
  const completedWeek = (progress ?? []).filter(
    (p) => p.status === "completada" && p.completed_at && p.completed_at >= since,
  ).length;
  const attemptsWeek = (attempts ?? []).filter((a) => a.created_at >= since);
  const passedWeek = attemptsWeek.filter((a) => a.passed).length;

  const activeIds = new Set(
    (progress ?? []).filter((p) => p.last_visit && p.last_visit >= since).map((p) => p.user_id),
  );
  const inactive = studentList.filter((s) => !activeIds.has(s.id));

  const lines = [
    `*Alumnos totales:* ${studentList.length}`,
    `*Lecciones completadas (7 días):* ${completedWeek}`,
    `*Exámenes realizados (7 días):* ${attemptsWeek.length} · aprobados: ${passedWeek}`,
    `*Alumnos sin actividad esta semana:* ${inactive.length}`,
  ];
  if (inactive.length) {
    lines.push(
      "_Inactivos:_ " +
        inactive.slice(0, 12).map((s) => s.full_name ?? s.email).join(", ") +
        (inactive.length > 12 ? "…" : ""),
    );
  }

  return notify({
    event: "student_progress_digest",
    title: "Resumen semanal de progreso de alumnos",
    lines,
  });
}

/** Seguimiento de cumplimiento de profesores → canal de administración. */
export async function runTeacherComplianceDigest() {
  const admin = createAdminClient();

  const [{ data: teachers }, { data: assignments }] = await Promise.all([
    admin.from("profiles").select("id, full_name, email").eq("role", "profesor"),
    admin.from("assignments").select("assigned_by, status"),
  ]);

  const teacherList = teachers ?? [];
  const lines: string[] = [`*Profesores activos:* ${teacherList.length}`];

  for (const t of teacherList) {
    const own = (assignments ?? []).filter((a) => a.assigned_by === t.id);
    const pendientes = own.filter((a) => a.status !== "completada").length;
    lines.push(
      `• *${t.full_name ?? t.email}* — ${own.length} tareas asignadas · ${pendientes} pendientes de cierre`,
    );
  }
  if (teacherList.length === 0) lines.push("_No hay profesores dados de alta._");

  return notify({
    event: "teacher_compliance_digest",
    title: "Seguimiento de cumplimiento de profesores",
    lines,
  });
}

/** Recordatorios de tareas próximas a vencer y marcado de vencidas. */
export async function runAssignmentReminders() {
  const admin = createAdminClient();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const soonStr = new Date(today.getTime() + 3 * DAY).toISOString().slice(0, 10);

  const { data: assignments } = await admin
    .from("assignments")
    .select("id, student_id, module_id, due_date, status, reminder_sent_at, overdue_notified_at")
    .neq("status", "completada")
    .not("due_date", "is", null);

  const list = assignments ?? [];
  if (list.length === 0) return { reminders: 0, overdue: 0 };

  const moduleIds = [...new Set(list.map((a) => a.module_id))];
  const studentIds = [...new Set(list.map((a) => a.student_id))];
  const [{ data: modules }, { data: students }] = await Promise.all([
    admin.from("modules").select("id, title, slug").in("id", moduleIds),
    admin.from("profiles").select("id, full_name, email").in("id", studentIds),
  ]);
  const moduleById = new Map((modules ?? []).map((m) => [m.id, m]));
  const studentById = new Map((students ?? []).map((s) => [s.id, s]));

  let reminders = 0;
  let overdue = 0;

  for (const a of list) {
    const mod = moduleById.get(a.module_id);
    const stu = studentById.get(a.student_id);
    if (!mod || !stu) continue;

    // Vencida
    if (a.due_date < todayStr && !a.overdue_notified_at) {
      await admin
        .from("assignments")
        .update({ status: "vencida", overdue_notified_at: new Date().toISOString() })
        .eq("id", a.id);
      await notify({
        event: "assignment_overdue",
        title: "Tarea vencida",
        lines: [
          `*Alumno:* ${stu.full_name ?? stu.email}`,
          `*Módulo:* ${mod.title}`,
          `*Fecha límite:* ${a.due_date} (superada)`,
        ],
        dmEmail: stu.email,
      });
      overdue += 1;
      continue;
    }

    // Próxima a vencer (dentro de 3 días)
    if (a.due_date >= todayStr && a.due_date <= soonStr && !a.reminder_sent_at) {
      await admin
        .from("assignments")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", a.id);
      await notify({
        event: "assignment_due_soon",
        title: "Tienes una tarea próxima a vencer",
        lines: [
          `*Módulo:* ${mod.title}`,
          `*Fecha límite:* ${a.due_date}`,
          "Entra al campus para completarla a tiempo.",
        ],
        dmEmail: stu.email,
      });
      reminders += 1;
    }
  }

  return { reminders, overdue };
}
