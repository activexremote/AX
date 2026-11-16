"use server";

import { revalidatePath } from "next/cache";

import { alumnosVisibles, puedeVer } from "@/lib/actividades/acceso";
import { actividad } from "@/lib/actividades/catalogo";
import { notaDeRubrica, tx } from "@/lib/actividades/tipos";
import { enviarAvisoCorreccion } from "@/lib/correo/aviso-correccion";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// ══════════════════════════════════════════════════════════
//  La corrección del profesor
//
//  La rúbrica, la nota de 0 a 10, el comentario y si la da por buena o la
//  devuelve para rehacer. Lo ve el alumno en la lección y en Mis tareas, y
//  si el profesor lo deja marcado le llega un correo con todo.
//
//  Sólo corrige quien puede ver al alumno: la administración, o el profesor
//  que lo tiene asignado.
// ══════════════════════════════════════════════════════════

export type ResultadoRevision = { ok: true; correo: "enviado" | "no" | "fallo" } | { ok: false; error: string };

export async function revisarRespuesta(input: {
  id: string;
  rubric: Record<string, number>;
  feedback: string;
  devolver: boolean;
  nota?: number | null;
  avisar?: boolean;
}): Promise<ResultadoRevision> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "no-auth" };
  const visibles = await alumnosVisibles();
  if (!visibles.admin && visibles.yo !== user.id) return { ok: false, error: "forbidden" };

  const admin = createAdminClient();
  const { data: fila } = await admin.from("activity_responses").select("id, user_id, activity_key, lesson_id, status").eq("id", input.id).maybeSingle();
  if (!fila) return { ok: false, error: "no-existe" };
  if (!puedeVer(visibles, fila.user_id as string)) return { ok: false, error: "forbidden" };

  const act = actividad(fila.activity_key as string);
  const rubric: Record<string, number> = {};
  for (const c of act?.rubrica ?? []) {
    const n = Number(input.rubric[c.k]);
    if (Number.isInteger(n) && n >= 1 && n <= 4) rubric[c.k] = n;
  }
  // La nota la pone el profesor; si no la pone, la que sale de la rúbrica.
  const n = input.nota === null || input.nota === undefined || Number.isNaN(Number(input.nota)) ? null : Math.round(Math.min(10, Math.max(0, Number(input.nota))) * 100) / 100;
  const nota = input.devolver ? n : (n ?? notaDeRubrica(rubric, act?.rubrica?.length ?? 0));
  const ahora = new Date().toISOString();
  const feedback = input.feedback.trim().slice(0, 4000) || null;

  const { error } = await admin
    .from("activity_responses")
    .update({
      status: input.devolver ? "devuelta" : "revisada",
      rubric: Object.keys(rubric).length ? rubric : null,
      feedback,
      grade: nota,
      reviewed_by: user.id,
      reviewed_at: ahora,
    })
    .eq("id", input.id);
  if (error) return { ok: false, error: "error" };

  // Devolverla la deja sin hacer, así que la lección deja de contar como terminada.
  if (input.devolver && act?.obligatoria) {
    await admin.from("user_lesson_progress").update({ status: "en_curso", completed_at: null }).eq("user_id", fila.user_id).eq("lesson_id", fila.lesson_id);
  }
  await admin.from("activity_log").insert({
    user_id: fila.user_id,
    kind: input.devolver ? "activity_returned" : "activity_reviewed",
    lesson_id: fila.lesson_id,
    payload: { activity: fila.activity_key, grade: nota, by: user.id },
  });

  // El aviso al alumno.
  let correo: "enviado" | "no" | "fallo" = "no";
  if (input.avisar && act) {
    const [{ data: alumno }, { data: profe }, { data: leccion }] = await Promise.all([
      admin.from("profiles").select("email, full_name").eq("id", fila.user_id).maybeSingle(),
      admin.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      admin.from("lessons").select("title").eq("id", fila.lesson_id).maybeSingle(),
    ]);
    if (alumno?.email) {
      const r = await enviarAvisoCorreccion({
        to: alumno.email as string,
        nombre: (alumno.full_name as string) || null,
        actividad: tx(act.titulo, "es"),
        leccion: (leccion?.title as string) ?? "",
        devuelta: input.devolver,
        nota,
        rubrica: (act.rubrica ?? [])
          .filter((c) => rubric[c.k])
          .map((c) => ({ criterio: tx(c.titulo, "es"), nivel: rubric[c.k], texto: tx(c.niveles[rubric[c.k] - 1], "es") })),
        comentario: feedback,
        profesor: (profe?.full_name as string) || null,
        url: `/lecciones/${fila.lesson_id}#act-${act.key}`,
      });
      correo = r.ok ? "enviado" : "fallo";
      if (r.ok) await admin.from("activity_responses").update({ notified_at: new Date().toISOString() }).eq("id", input.id);
    } else {
      correo = "fallo";
    }
  }

  revalidatePath("/admin/respuestas");
  revalidatePath(`/admin/respuestas/${input.id}`);
  revalidatePath(`/admin/respuestas/alumnos/${fila.user_id}`);
  return { ok: true, correo };
}

/** Asigna un profesor a un alumno (sólo administración). */
export async function asignarProfesor(studentId: string, form: FormData) {
  const visibles = await alumnosVisibles();
  if (!visibles.admin) return;
  const teacherId = String(form.get("teacher") ?? "");
  if (!teacherId) return;
  const admin = createAdminClient();
  const { data: t } = await admin.from("profiles").select("role").eq("id", teacherId).maybeSingle();
  if (t?.role !== "profesor" && t?.role !== "administrador") return;
  await admin.from("student_teachers").upsert({ student_id: studentId, teacher_id: teacherId, assigned_by: visibles.yo }, { onConflict: "student_id,teacher_id", ignoreDuplicates: true });
  revalidatePath(`/admin/respuestas/alumnos/${studentId}`);
  revalidatePath("/admin/respuestas/alumnos");
}

/** Le quita un profesor a un alumno (sólo administración). */
export async function quitarProfesor(studentId: string, teacherId: string) {
  const visibles = await alumnosVisibles();
  if (!visibles.admin) return;
  await createAdminClient().from("student_teachers").delete().eq("student_id", studentId).eq("teacher_id", teacherId);
  revalidatePath(`/admin/respuestas/alumnos/${studentId}`);
  revalidatePath("/admin/respuestas/alumnos");
}
