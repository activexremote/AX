"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/slack/notify";

async function assertStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).maybeSingle();
  if (!profile || (profile.role !== "administrador" && profile.role !== "profesor")) {
    throw new Error("forbidden");
  }
  return { supabase, user, profile };
}

export async function createAssignment(formData: FormData) {
  const { supabase, user, profile } = await assertStaff();

  const studentId = String(formData.get("student_id") ?? "");
  const moduleId = String(formData.get("module_id") ?? "");
  const dueDate = (formData.get("due_date") as string) || null;
  const note = ((formData.get("note") as string) || "").trim() || null;

  if (!studentId || !moduleId) return { error: "Selecciona alumno y módulo." };

  const { error } = await supabase.from("assignments").insert({
    student_id: studentId,
    module_id: moduleId,
    assigned_by: user.id,
    due_date: dueDate,
    note,
    status: "pendiente",
  });

  if (error) {
    if (error.code === "23505") return { error: "Ese alumno ya tiene asignado ese módulo." };
    return { error: error.message };
  }

  // Notificación a Slack (no bloquea si falla)
  const [{ data: student }, { data: module }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", studentId).maybeSingle(),
    supabase.from("modules").select("title").eq("id", moduleId).maybeSingle(),
  ]);

  await notify({
    event: "assignment_created",
    title: "Nueva tarea asignada",
    lines: [
      `*Alumno:* ${student?.full_name ?? student?.email ?? "—"}`,
      `*Módulo:* ${module?.title ?? "—"}`,
      dueDate ? `*Fecha límite:* ${dueDate}` : "*Sin fecha límite*",
      `*Asignada por:* ${profile.full_name ?? profile.email}`,
      ...(note ? [`*Nota:* ${note}`] : []),
    ],
    dmEmail: student?.email ?? null,
  });

  revalidatePath("/admin/tareas");
  revalidatePath("/mis-tareas");
  return { ok: true };
}

export async function deleteAssignment(id: string) {
  const { supabase } = await assertStaff();
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/tareas");
  revalidatePath("/mis-tareas");
  return { ok: true };
}
