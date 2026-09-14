"use server";

import { revalidatePath } from "next/cache";

import { ALL_COURSES, MAX_BODY_CHARS, extractText, indexSource } from "@/lib/asistente/knowledge";
import { createClient } from "@/lib/supabase/server";
import type { CourseKey, KbKind } from "@/lib/supabase/types";

async function assertStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile || (profile.role !== "administrador" && profile.role !== "profesor")) {
    throw new Error("forbidden");
  }
  return { supabase, user };
}

type Result = { ok?: boolean; error?: string };

function readCourse(formData: FormData): CourseKey | null {
  const v = String(formData.get("course") ?? "");
  return (ALL_COURSES as readonly string[]).includes(v) ? (v as CourseKey) : null;
}

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

/** FAQ o documento. El archivo, si viene, manda sobre el texto pegado. */
async function readSource(kind: KbKind, formData: FormData) {
  const title = text(formData, "title");
  let body = text(formData, "body");
  let fileName: string | null = null;

  const file = formData.get("file");
  if (kind === "documento" && file instanceof File && file.size > 0) {
    body = (await extractText(file)).trim();
    fileName = file.name;
    if (!body) {
      throw new Error("No se ha podido sacar texto del archivo. Si es un PDF escaneado, pega el texto a mano.");
    }
  }

  if (!title) throw new Error(kind === "faq" ? "Falta la pregunta." : "Falta el título.");
  if (!body) throw new Error(kind === "faq" ? "Falta la respuesta." : "Sube un archivo o pega el texto.");

  return { title, body: body.slice(0, MAX_BODY_CHARS), fileName, course: readCourse(formData) };
}

function revalidate() {
  revalidatePath("/admin/asistente");
}

export async function createSource(kind: KbKind, formData: FormData): Promise<Result> {
  const { supabase, user } = await assertStaff();

  let fields: Awaited<ReturnType<typeof readSource>>;
  try {
    fields = await readSource(kind, formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }

  const { data, error } = await supabase
    .from("kb_sources")
    .insert({
      kind,
      title: fields.title,
      body: fields.body,
      file_name: fields.fileName,
      course: fields.course,
      created_by: user.id,
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  const r = await indexSource(data.id as string);
  if (!r.ok) {
    // Sin trozos no se encontraría nunca: mejor no dejar un contenido fantasma.
    await supabase.from("kb_sources").delete().eq("id", data.id);
    return { error: r.error };
  }
  revalidate();
  return { ok: true };
}

export async function updateSource(id: string, kind: KbKind, formData: FormData): Promise<Result> {
  const { supabase } = await assertStaff();

  let fields: Awaited<ReturnType<typeof readSource>>;
  try {
    fields = await readSource(kind, formData);
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }

  const { error } = await supabase
    .from("kb_sources")
    .update({
      title: fields.title,
      body: fields.body,
      course: fields.course,
      active: formData.get("active") === "on",
      // Un archivo nuevo sustituye al anterior; si no, se conserva el nombre.
      ...(fields.fileName ? { file_name: fields.fileName } : {}),
    })
    .eq("id", id);
  if (error) return { error: error.message };

  // Se trocea de nuevo siempre: el título va en el encabezado de cada trozo.
  const r = await indexSource(id);
  revalidate();
  return r.ok ? { ok: true } : { error: r.error };
}

/** El texto entero de un documento, que la tabla no carga para no mandar megas al navegador. */
export async function getSourceBody(id: string): Promise<{ body?: string; error?: string }> {
  const { supabase } = await assertStaff();
  const { data, error } = await supabase.from("kb_sources").select("body").eq("id", id).maybeSingle();
  if (error || !data) return { error: error?.message ?? "No existe ese contenido." };
  return { body: data.body as string };
}

export async function setSourceActive(id: string, active: boolean): Promise<Result> {
  const { supabase } = await assertStaff();
  const { error } = await supabase.from("kb_sources").update({ active }).eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { ok: true };
}

export async function deleteSource(id: string): Promise<Result> {
  const { supabase } = await assertStaff();
  const { error } = await supabase.from("kb_sources").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { ok: true };
}

export async function dismissQuestion(id: string): Promise<Result> {
  const { supabase } = await assertStaff();
  const { error } = await supabase.from("assistant_questions").update({ reviewed: true }).eq("id", id);
  if (error) return { error: error.message };
  revalidate();
  return { ok: true };
}

/** Convierte una pregunta sin respuesta en FAQ y la saca de la lista. */
export async function faqFromQuestion(questionId: string, formData: FormData): Promise<Result> {
  const r = await createSource("faq", formData);
  if (r.error) return r;
  await dismissQuestion(questionId);
  return r;
}
