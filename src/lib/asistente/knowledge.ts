import { createAdminClient } from "@/lib/supabase/admin";
import type { KbSource } from "@/lib/supabase/types";

export { ALL_COURSES } from "@/lib/asistente/courses";

// ══════════════════════════════════════════════════════════
//  Base de conocimiento del asistente del campus
//
//  Lo que el equipo sube desde /admin/asistente se trocea por secciones y se
//  guarda en `kb_chunks`, donde Postgres le crea el índice de texto en
//  español. No hay IA ni llamadas externas: subir, buscar y responder no
//  cuesta nada por pregunta.
// ══════════════════════════════════════════════════════════

/** Todo texto se corta aquí. Un PDF de 300.000 caracteres ya es un libro. */
export const MAX_BODY_CHARS = 300_000;

export type Chunk = { heading: string; content: string };

/**
 * Trocea un documento en fragmentos de ~1.200 caracteres.
 *
 * Corta por párrafos y respeta los encabezados de markdown: cada trozo lleva
 * como encabezado el título del documento y la sección en la que cae. Es lo
 * que se le enseña al alumno como «según…», y además pesa más en la búsqueda:
 * un fragmento como «Se entrega el viernes antes de las 23:59» no dice de QUÉ
 * se habla, pero «Guía del alumno › Entregas» sí.
 */
export function chunkDocument(title: string, text: string, size = 1200): Chunk[] {
  const parrafos = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];
  let seccion = "";
  let actual = "";

  const cerrar = () => {
    const content = actual.trim();
    if (!content) return;
    chunks.push({ heading: [title, seccion].filter(Boolean).join(" › "), content });
    actual = "";
  };

  for (const bloque of parrafos) {
    let p = bloque;
    // "## Título" suele ir pegado a su primer párrafo con un solo salto.
    const encabezado = p.match(/^#{1,6}\s+(.+)(?:\n|$)/);
    if (encabezado) {
      cerrar();
      seccion = encabezado[1].trim();
      p = p.slice(encabezado[0].length).trim();
      if (!p) continue;
    }

    if (p.length <= size) {
      if (actual.length + p.length + 2 > size) cerrar();
      actual = actual ? `${actual}\n\n${p}` : p;
      continue;
    }

    // Un párrafo más largo que el trozo entero se parte por frases.
    if (actual) actual += "\n\n";
    for (const frase of p.match(/[^.!?\n]+[.!?]*\s*/g) ?? [p]) {
      if (actual.length + frase.length > size) cerrar();
      actual += frase;
    }
  }
  cerrar();
  return chunks;
}

/** Los trozos de una fuente. Una FAQ es uno solo: la pregunta y su respuesta. */
export function chunksFor(source: Pick<KbSource, "kind" | "title" | "body">): Chunk[] {
  if (source.kind === "faq") return [{ heading: source.title, content: source.body }];
  return chunkDocument(source.title, source.body);
}

/**
 * Saca el texto de un fichero subido.
 *
 * PDF, markdown y texto plano. Word y demás no: se exporta a PDF, que lo hace
 * cualquier editor, y se evita cargar un parser por formato.
 */
export async function extractText(file: File): Promise<string> {
  const nombre = file.name.toLowerCase();
  if (file.type === "application/pdf" || nombre.endsWith(".pdf")) {
    const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text } = await pdfText(pdf, { mergePages: false });
    // Una página por párrafo como mínimo, para que el troceado tenga dónde cortar.
    return text.map((t) => t.trim()).filter(Boolean).join("\n\n");
  }
  if (/\.(md|markdown|txt)$/.test(nombre) || file.type.startsWith("text/")) {
    return await file.text();
  }
  throw new Error("Formato no soportado. Sube un PDF, un .md o un .txt.");
}

/** Rehace los trozos de una fuente a partir de su título y su texto. */
export async function indexSource(sourceId: string): Promise<{ ok: boolean; error?: string }> {
  const admin = createAdminClient();

  const { data: source, error: readErr } = await admin
    .from("kb_sources")
    .select("id, kind, title, body")
    .eq("id", sourceId)
    .maybeSingle();
  if (readErr || !source) return { ok: false, error: readErr?.message ?? "No existe ese contenido." };

  const trozos = chunksFor(source as Pick<KbSource, "kind" | "title" | "body">);

  const { error: delErr } = await admin.from("kb_chunks").delete().eq("source_id", sourceId);
  if (delErr) return { ok: false, error: delErr.message };

  if (trozos.length) {
    const { error: insErr } = await admin
      .from("kb_chunks")
      .insert(trozos.map((t, i) => ({ source_id: sourceId, chunk_index: i, heading: t.heading, content: t.content })));
    if (insErr) return { ok: false, error: insErr.message };
  }

  await admin.from("kb_sources").update({ chunks_count: trozos.length }).eq("id", sourceId);
  return { ok: true };
}

/** Si hay algo que buscar. Sin contenido activo, el chat no se enseña en el campus. */
export async function hasKnowledge(): Promise<boolean> {
  const { count } = await createAdminClient()
    .from("kb_sources")
    .select("id", { count: "exact", head: true })
    .eq("active", true);
  return (count ?? 0) > 0;
}
