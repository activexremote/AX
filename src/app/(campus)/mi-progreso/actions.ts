"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function resetMyProgress() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "no-auth" };

  // Los intentos de test y la actividad no los puede borrar el propio alumno
  // (la RLS sólo deja borrarlos a un administrador: 0001, qa_admin_del y
  // activity_admin_del). Con el cliente normal el borrado no fallaba: no
  // borraba nada, y «reiniciar» dejaba los tests y la actividad donde
  // estaban. Se borra con el de servicio, siempre filtrado por el usuario
  // que acaba de verificarse arriba.
  const admin = createAdminClient();
  const resultados = await Promise.all([
    admin.from("user_lesson_progress").delete().eq("user_id", user.id),
    admin.from("quiz_attempts").delete().eq("user_id", user.id),
    admin.from("activity_log").delete().eq("user_id", user.id),
  ]);
  const fallo = resultados.find((r) => r.error);
  if (fallo?.error) return { error: fallo.error.message };

  revalidatePath("/mi-progreso");
  revalidatePath("/mis-tareas");
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
