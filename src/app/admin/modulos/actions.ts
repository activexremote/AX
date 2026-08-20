"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { notify } from "@/lib/slack/notify";

async function assertStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || (profile.role !== "administrador" && profile.role !== "profesor")) {
    throw new Error("forbidden");
  }
  return supabase;
}

const COURSE_KEYS = ["core", "remote-professional", "remote-founder"] as const;

/** El curso llega de un <select>, pero un formulario se puede reenviar a mano:
 *  un valor inventado aquí rompería el filtro de acceso, así que se descarta. */
function readCourse(formData: FormData): (typeof COURSE_KEYS)[number] {
  const value = String(formData.get("course") ?? "core");
  return (COURSE_KEYS as readonly string[]).includes(value)
    ? (value as (typeof COURSE_KEYS)[number])
    : "core";
}

export async function createModule(formData: FormData) {
  const supabase = await assertStaff();
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!slug || !title) return { error: "Slug y título son obligatorios." };

  const available = formData.get("available") === "on";
  const { error } = await supabase.from("modules").insert({
    slug,
    title,
    code: (formData.get("code") as string) || null,
    description: (formData.get("description") as string) || null,
    icon: (formData.get("icon") as string) || "Education",
    accent: (formData.get("accent") as string) || "#161616",
    order_index: Number(formData.get("order_index") ?? 0),
    estimated_minutes: Number(formData.get("estimated_minutes") ?? 0) || null,
    course: readCourse(formData),
    available,
  });
  if (error) return { error: error.message };

  if (available) {
    await notify({
      event: "content_published",
      title: "Nuevo módulo disponible",
      lines: [`*Módulo:* ${title}`, "Ya puedes empezarlo desde el catálogo del campus."],
    });
  }

  revalidatePath("/admin/modulos");
  revalidatePath("/");
  return { ok: true };
}

export async function updateModule(id: string, formData: FormData) {
  const supabase = await assertStaff();
  const { error } = await supabase
    .from("modules")
    .update({
      slug: (formData.get("slug") as string) || undefined,
      title: (formData.get("title") as string) || undefined,
      code: (formData.get("code") as string) || null,
      description: (formData.get("description") as string) || null,
      icon: (formData.get("icon") as string) || null,
      accent: (formData.get("accent") as string) || null,
      order_index: Number(formData.get("order_index") ?? 0),
      estimated_minutes: Number(formData.get("estimated_minutes") ?? 0) || null,
      course: readCourse(formData),
      available: formData.get("available") === "on",
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/modulos");
  revalidatePath(`/admin/modulos/${id}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteModule(id: string) {
  const supabase = await assertStaff();
  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/modulos");
  revalidatePath("/");
  return { ok: true };
}

export async function createLesson(moduleId: string, formData: FormData) {
  const supabase = await assertStaff();
  const slug = String(formData.get("slug") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!slug || !title) return { error: "Slug y título son obligatorios." };

  const { error } = await supabase.from("lessons").insert({
    module_id: moduleId,
    slug,
    title,
    subtitle: (formData.get("subtitle") as string) || null,
    order_index: Number(formData.get("order_index") ?? 0),
    duration_min: Number(formData.get("duration_min") ?? 0) || null,
    content_md: (formData.get("content_md") as string) || "",
    audio_url: (formData.get("audio_url") as string) || null,
  });
  if (error) return { error: error.message };

  const { data: module } = await supabase
    .from("modules")
    .select("title")
    .eq("id", moduleId)
    .maybeSingle();
  await notify({
    event: "content_published",
    title: "Nueva lección publicada",
    lines: [`*Lección:* ${title}`, `*Módulo:* ${module?.title ?? "—"}`],
  });

  revalidatePath(`/admin/modulos/${moduleId}`);
  return { ok: true };
}

export async function updateLesson(lessonId: string, formData: FormData) {
  const supabase = await assertStaff();
  const { error } = await supabase
    .from("lessons")
    .update({
      slug: (formData.get("slug") as string) || undefined,
      title: (formData.get("title") as string) || undefined,
      subtitle: (formData.get("subtitle") as string) || null,
      order_index: Number(formData.get("order_index") ?? 0),
      duration_min: Number(formData.get("duration_min") ?? 0) || null,
      content_md: (formData.get("content_md") as string) ?? "",
      audio_url: (formData.get("audio_url") as string) || null,
    })
    .eq("id", lessonId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/modulos`);
  revalidatePath(`/admin/lecciones/${lessonId}`);
  revalidatePath(`/lecciones/${lessonId}`);
  return { ok: true };
}

export async function deleteLesson(lessonId: string) {
  const supabase = await assertStaff();
  const { error } = await supabase.from("lessons").delete().eq("id", lessonId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/modulos`);
  return { ok: true };
}

export async function uploadLessonAudio(lessonId: string, formData: FormData) {
  const supabase = await assertStaff();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo." };
  }

  const path = `lessons/${lessonId}/${Date.now()}-${file.name.replace(/[^a-z0-9_.-]/gi, "_")}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("lesson-audio")
    .upload(path, new Uint8Array(arrayBuffer), {
      contentType: file.type || "audio/mpeg",
      upsert: false,
    });
  if (upErr) return { error: upErr.message };

  const { data: pub } = supabase.storage.from("lesson-audio").getPublicUrl(path);
  const { error: updErr } = await supabase
    .from("lessons")
    .update({ audio_url: pub.publicUrl })
    .eq("id", lessonId);
  if (updErr) return { error: updErr.message };

  revalidatePath(`/admin/lecciones/${lessonId}`);
  revalidatePath(`/lecciones/${lessonId}`);
  return { ok: true, url: pub.publicUrl };
}

export async function upsertQuizQuestion(input: {
  lessonId: string;
  questionId?: string;
  prompt: string;
  orderIndex: number;
  options: { id?: string; label: string; isCorrect: boolean; orderIndex: number }[];
}) {
  const supabase = await assertStaff();

  // Ensure quiz exists for this lesson
  let { data: quiz } = await supabase.from("quizzes").select("*").eq("lesson_id", input.lessonId).maybeSingle();
  if (!quiz) {
    const { data: created, error } = await supabase
      .from("quizzes")
      .insert({ lesson_id: input.lessonId })
      .select("*")
      .single();
    if (error) return { error: error.message };
    quiz = created;
  }

  let questionId = input.questionId;
  if (!questionId) {
    const { data, error } = await supabase
      .from("quiz_questions")
      .insert({ quiz_id: quiz.id, prompt: input.prompt, order_index: input.orderIndex })
      .select("id")
      .single();
    if (error) return { error: error.message };
    questionId = data.id;
  } else {
    await supabase
      .from("quiz_questions")
      .update({ prompt: input.prompt, order_index: input.orderIndex })
      .eq("id", questionId);
    // Clean old options
    await supabase.from("quiz_options").delete().eq("question_id", questionId);
  }

  if (input.options.length) {
    await supabase.from("quiz_options").insert(
      input.options.map((o) => ({
        question_id: questionId!,
        label: o.label,
        is_correct: o.isCorrect,
        order_index: o.orderIndex,
      })),
    );
  }

  revalidatePath(`/admin/lecciones/${input.lessonId}`);
  revalidatePath(`/lecciones/${input.lessonId}`);
  return { ok: true };
}

export async function deleteQuizQuestion(lessonId: string, questionId: string) {
  const supabase = await assertStaff();
  const { error } = await supabase.from("quiz_questions").delete().eq("id", questionId);
  if (error) return { error: error.message };
  revalidatePath(`/admin/lecciones/${lessonId}`);
  revalidatePath(`/lecciones/${lessonId}`);
  return { ok: true };
}
