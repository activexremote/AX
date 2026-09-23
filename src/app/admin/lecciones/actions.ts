"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { proponerBloques, type Propuesta } from "@/lib/ai/estructurar";
import { parseBlocks } from "@/lib/content/blocks";

// ══════════════════════════════════════════════════════════
//  Acciones del editor de bloques
//
//  Dos, y las dos las puede usar un profesor:
//
//   · guardar los bloques de una lección;
//   · pedirle a la IA que proponga una estructura a partir del borrador.
//
//  La clave de OpenAI NO pasa por aquí: la resuelve el servidor dentro de
//  lib/ai/settings.ts. El profesor usa la IA sin llegar a ver la clave.
// ══════════════════════════════════════════════════════════

/**
 * Profesor o administrador, comprobado contra la sesión.
 *
 * Con el cliente de sesión —no el de servicio— para que las políticas de la
 * base sigan aplicando: si alguien se saltara esta comprobación, la RLS
 * volvería a pararlo.
 */
async function assertStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador" && profile?.role !== "profesor") throw new Error("forbidden");
  return { supabase, userId: user.id };
}

export type SaveBlocksResult = { ok: true; count: number } | { error: string };

/**
 * Guarda los bloques de una lección.
 *
 * Llega JSON del navegador, así que se vuelve a validar aquí: lo que manda
 * un cliente nunca se guarda por la cara, y `parseBlocks` es la única puerta
 * (ver la cabecera de lib/content/blocks.ts).
 *
 * `content_md` NO se toca. Sigue siendo el borrador del profesor y la fuente
 * de la narración de audio; los bloques son cómo se presenta, no el original.
 */
export async function saveLessonBlocks(lessonId: string, json: string): Promise<SaveBlocksResult> {
  const { supabase } = await assertStaff();

  const blocks = parseBlocks(json);

  const { error } = await supabase
    .from("lessons")
    // Vaciar el editor devuelve la lección a su Markdown de siempre, que es
    // lo que espera quien borra todos los bloques.
    .update({ content_blocks: blocks.length ? blocks : null })
    .eq("id", lessonId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/lecciones/${lessonId}`);
  revalidatePath(`/lecciones/${lessonId}`);
  return { ok: true, count: blocks.length };
}

/**
 * La propuesta de la IA para un borrador.
 *
 * No guarda nada: devuelve los bloques para que el profesor los revise uno a
 * uno en el panel. Publicar sin que nadie lo lea sería poner a un modelo a
 * dar clase.
 */
export async function proposeLessonStructure(lessonId: string, draft: string): Promise<Propuesta> {
  await assertStaff();

  const supabase = await createClient();
  const { data: lesson } = await supabase
    .from("lessons")
    .select("title, subtitle, outcome, module_id")
    .eq("id", lessonId)
    .maybeSingle();

  if (!lesson) return { blocks: [], notes: [], error: "No se encuentra la lección." };

  const { data: modulo } = await supabase
    .from("modules")
    .select("title")
    .eq("id", lesson.module_id as string)
    .maybeSingle();

  return proponerBloques(draft, {
    title: lesson.title as string,
    subtitle: lesson.subtitle as string | null,
    outcome: lesson.outcome as string | null,
    moduleTitle: (modulo?.title as string | null) ?? null,
  });
}
