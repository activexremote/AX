"use server";

import { revalidatePath } from "next/cache";

import { actividad } from "@/lib/actividades/catalogo";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// La revisión del profesor: la rúbrica, el comentario y si la da por buena
// o la devuelve para rehacer. Lo ve el alumno en la lección y en Mis tareas.
export async function revisarRespuesta(input: { id: string; rubric: Record<string, number>; feedback: string; devolver: boolean }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, error: "no-auth" };
  const { data: perfil } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (perfil?.role !== "administrador" && perfil?.role !== "profesor") return { ok: false as const, error: "forbidden" };

  // La política de staff deja leer y escribir a profesorado y administración.
  const { data: fila } = await supabase.from("activity_responses").select("id, activity_key, lesson_id, status").eq("id", input.id).maybeSingle();
  if (!fila) return { ok: false as const, error: "no-existe" };
  const act = actividad(fila.activity_key as string);
  const rubric: Record<string, number> = {};
  for (const c of act?.rubrica ?? []) {
    const n = Number(input.rubric[c.k]);
    if (Number.isInteger(n) && n >= 1 && n <= 4) rubric[c.k] = n;
  }

  const { error } = await supabase
    .from("activity_responses")
    .update({
      status: input.devolver ? "devuelta" : "revisada",
      rubric: Object.keys(rubric).length ? rubric : null,
      feedback: input.feedback.trim().slice(0, 4000) || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", input.id);
  if (error) return { ok: false as const, error: "error" };

  // Devolverla la deja sin hacer, así que la lección deja de contar como terminada.
  if (input.devolver) {
    const { data: r } = await supabase.from("activity_responses").select("user_id").eq("id", input.id).maybeSingle();
    if (r && act?.obligatoria) {
      await createAdminClient().from("user_lesson_progress").update({ status: "en_curso", completed_at: null }).eq("user_id", r.user_id).eq("lesson_id", fila.lesson_id);
    }
  }

  revalidatePath("/admin/respuestas");
  revalidatePath(`/admin/respuestas/${input.id}`);
  return { ok: true as const };
}
