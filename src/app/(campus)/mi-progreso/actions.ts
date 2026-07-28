"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function resetMyProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  await supabase.from("user_lesson_progress").delete().eq("user_id", user.id);
  await supabase.from("quiz_attempts").delete().eq("user_id", user.id);
  await supabase.from("activity_log").delete().eq("user_id", user.id);

  revalidatePath("/mi-progreso");
  revalidatePath("/");
  return { ok: true };
}

export async function exportMyProgressJson() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [progress, attempts, activity] = await Promise.all([
    supabase.from("user_lesson_progress").select("*").eq("user_id", user.id),
    supabase.from("quiz_attempts").select("*").eq("user_id", user.id),
    supabase.from("activity_log").select("*").eq("user_id", user.id),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    userId: user.id,
    progress: progress.data ?? [],
    quizAttempts: attempts.data ?? [],
    activity: activity.data ?? [],
  };
}
