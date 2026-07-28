import { createClient } from "@/lib/supabase/server";
import type { AssignmentStatus } from "@/lib/supabase/types";

export type AssignmentRow = {
  id: string;
  student_id: string;
  module_id: string;
  due_date: string | null;
  status: AssignmentStatus;
  note: string | null;
  created_at: string;
  completed_at: string | null;
  student_name: string;
  student_email: string;
  module_title: string;
  module_slug: string;
  module_lessons: number;
  lessons_done: number;
};

async function hydrate(
  rows: { id: string; student_id: string; module_id: string; due_date: string | null; status: AssignmentStatus; note: string | null; created_at: string; completed_at: string | null }[],
) {
  if (rows.length === 0) return [] as AssignmentRow[];
  const supabase = await createClient();

  const studentIds = [...new Set(rows.map((r) => r.student_id))];
  const moduleIds = [...new Set(rows.map((r) => r.module_id))];

  const [{ data: students }, { data: modules }, { data: lessons }, { data: progress }] =
    await Promise.all([
      supabase.from("profiles").select("id, full_name, email").in("id", studentIds),
      supabase.from("modules").select("id, title, slug").in("id", moduleIds),
      supabase.from("lessons").select("id, module_id").in("module_id", moduleIds),
      supabase
        .from("user_lesson_progress")
        .select("user_id, lesson_id, status")
        .in("user_id", studentIds),
    ]);

  const studentById = new Map((students ?? []).map((s) => [s.id, s]));
  const moduleById = new Map((modules ?? []).map((m) => [m.id, m]));

  return rows.map((r) => {
    const moduleLessons = (lessons ?? []).filter((l) => l.module_id === r.module_id);
    const lessonIds = new Set(moduleLessons.map((l) => l.id));
    const done = (progress ?? []).filter(
      (p) => p.user_id === r.student_id && lessonIds.has(p.lesson_id) && p.status === "completada",
    ).length;
    const student = studentById.get(r.student_id);
    const module = moduleById.get(r.module_id);
    return {
      ...r,
      student_name: student?.full_name ?? student?.email ?? "—",
      student_email: student?.email ?? "",
      module_title: module?.title ?? "—",
      module_slug: module?.slug ?? "",
      module_lessons: moduleLessons.length,
      lessons_done: done,
    } as AssignmentRow;
  });
}

export async function listAssignments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assignments")
    .select("id, student_id, module_id, due_date, status, note, created_at, completed_at")
    .order("created_at", { ascending: false });
  return hydrate(data ?? []);
}

export async function getMyAssignments() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as AssignmentRow[];

  const { data } = await supabase
    .from("assignments")
    .select("id, student_id, module_id, due_date, status, note, created_at, completed_at")
    .eq("student_id", user.id)
    .order("due_date", { ascending: true, nullsFirst: false });
  return hydrate(data ?? []);
}
