"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { proponerDesdeMaterial } from "@/lib/ai/estructurar";
import { extractDocument, FormatoNoSoportado, tituloDesdeNombre } from "@/lib/ingesta/extract";
import { parseBlocks, type Block } from "@/lib/content/blocks";

// ══════════════════════════════════════════════════════════
//  Crear una lección arrastrando un archivo
//
//  El profesor suelta el PDF de su clase y sale una lección montada. Dos
//  pasos, a propósito separados:
//
//   1. `proponerDesdeArchivo` — lee el archivo, se lo da a la IA y devuelve
//      una propuesta. NO guarda nada. El profesor la revisa bloque a bloque.
//   2. `crearLeccionConBloques` — con lo que el profesor haya aceptado, crea
//      la lección de verdad.
//
//  Si se guardara en el paso 1, el módulo se llenaría de lecciones a medias
//  cada vez que alguien prueba a subir un archivo para ver qué sale.
// ══════════════════════════════════════════════════════════

async function assertStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("no-auth");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrador" && profile?.role !== "profesor") throw new Error("forbidden");
  return supabase;
}

export type PropuestaArchivo = {
  blocks: Block[];
  notes: string[];
  title: string;
  /** Aviso sobre cómo se ha leído el archivo (imagen, PDF de muchas páginas…). */
  note?: string;
  error?: string;
};

/** Lee el archivo y pide la propuesta. No escribe en la base. */
export async function proponerDesdeArchivo(formData: FormData): Promise<PropuestaArchivo> {
  await assertStaff();

  const file = formData.get("file");
  const moduleId = String(formData.get("module_id") ?? "");
  if (!(file instanceof File) || !file.size) {
    return { blocks: [], notes: [], title: "", error: "No ha llegado ningún archivo." };
  }

  let material;
  let note: string | undefined;
  try {
    const extraido = await extractDocument(file);
    note = extraido.note;
    material = extraido.kind === "text" ? { kind: "text" as const, text: extraido.text } : { kind: "image" as const, dataUrl: extraido.dataUrl };
  } catch (e) {
    // Un formato que no sabemos leer no es un fallo del sistema: es algo que
    // la persona puede arreglar, así que se le dice qué hacer.
    if (e instanceof FormatoNoSoportado) return { blocks: [], notes: [], title: "", error: e.message };
    return { blocks: [], notes: [], title: "", error: `No se pudo leer el archivo: ${(e as Error).message}` };
  }

  const supabase = await createClient();
  const { data: modulo } = moduleId
    ? await supabase.from("modules").select("title").eq("id", moduleId).maybeSingle()
    : { data: null };

  const propuesta = await proponerDesdeMaterial(material, {
    fileName: file.name,
    moduleTitle: (modulo?.title as string | null) ?? null,
  });

  if (propuesta.error) return { blocks: [], notes: [], title: "", error: propuesta.error };

  return {
    blocks: propuesta.blocks,
    notes: propuesta.notes,
    // Si el modelo no ha sacado un título del material, el nombre del archivo
    // es mejor que "Lección sin título": al menos dice de qué iba.
    title: propuesta.title || tituloDesdeNombre(file.name) || "Lección sin título",
    note,
  };
}

export type CrearResult = { ok: true; lessonId: string } | { error: string };

/** Crea la lección con los bloques que el profesor ha aceptado. */
export async function crearLeccionConBloques(formData: FormData): Promise<CrearResult> {
  const supabase = await assertStaff();

  const moduleId = String(formData.get("module_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const blocks = parseBlocks(String(formData.get("blocks") ?? "[]"));

  if (!moduleId) return { error: "Falta el módulo." };
  if (!title) return { error: "La lección necesita un título." };

  // El slug sale del título. Si ya existe otro igual en el módulo, se le pone
  // un sufijo: dos lecciones con el mismo slug rompen la clave única de la
  // tabla y el error que sale no lo entiende nadie.
  const base = slugify(title) || "leccion";
  const { data: hermanas } = await supabase
    .from("lessons")
    .select("slug, order_index")
    .eq("module_id", moduleId);

  const usados = new Set((hermanas ?? []).map((l) => l.slug as string));
  let slug = base;
  for (let i = 2; usados.has(slug); i++) slug = `${base}-${i}`;

  const siguiente = Math.max(0, ...(hermanas ?? []).map((l) => Number(l.order_index) || 0)) + 1;

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      slug,
      title,
      order_index: siguiente,
      // El Markdown se queda vacío: esta lección nace por bloques. El campus
      // pinta los bloques cuando existen (ver la lección del alumno).
      content_md: "",
      content_blocks: blocks.length ? blocks : null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/admin/modulos/${moduleId}`);
  return { ok: true, lessonId: data.id as string };
}

function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}
