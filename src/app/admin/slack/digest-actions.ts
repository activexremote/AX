"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  runAssignmentReminders,
  runStudentProgressDigest,
  runTeacherComplianceDigest,
} from "@/lib/slack/digests";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador") throw new Error("forbidden");
}

export async function triggerStudentDigest() {
  await assertAdmin();
  const r = await runStudentProgressDigest();
  revalidatePath("/admin/slack");
  return r.skipped
    ? { message: `No enviado (${r.reason}). Revisa la configuración de Slack.` }
    : { message: `Resumen de alumnos enviado (${r.sent} mensaje/s).` };
}

export async function triggerTeacherDigest() {
  await assertAdmin();
  const r = await runTeacherComplianceDigest();
  revalidatePath("/admin/slack");
  return r.skipped
    ? { message: `No enviado (${r.reason}). Revisa la configuración de Slack.` }
    : { message: `Informe de profesores enviado (${r.sent} mensaje/s).` };
}

export async function triggerReminders() {
  await assertAdmin();
  const r = await runAssignmentReminders();
  revalidatePath("/admin/slack");
  return { message: `Recordatorios procesados: ${r.reminders} próximas, ${r.overdue} vencidas.` };
}
