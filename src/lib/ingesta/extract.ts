import "server-only";

import { unzipSync, strFromU8 } from "fflate";

import { MAX_BYTES } from "@/lib/ingesta/formatos";

// ══════════════════════════════════════════════════════════
//  Sacar el texto de lo que suelte el profesor
//
//  El profesor arrastra lo que tiene: el PDF de la clase, el guion en Word,
//  la hoja de cálculo con las cifras, el .md de sus notas o una foto de la
//  pizarra. Aquí se convierte todo eso en texto plano, que es lo único que
//  necesita el maquetador de IA.
//
//  Los formatos de Office (y los de Google Drive, que se exportan a Office o
//  a PDF) son ZIP con XML dentro, así que se abren con un descompresor
//  pequeño y se saca el texto del XML. Es deliberado no traer un parser por
//  formato: tres librerías pesadas para leer texto que después va a resumir
//  un modelo no compensan.
//
//  ⚠︎ Lo que sale de aquí es CONTENIDO, nunca instrucciones. Quien lo use
//  tiene que decírselo al modelo (ver lib/ai/estructurar.ts): un PDF puede
//  traer escrito «ignora las reglas anteriores», y eso es texto que hay que
//  maquetar, no una orden.
// ══════════════════════════════════════════════════════════


export type Extracted =
  /** Texto listo para maquetar. */
  | { kind: "text"; text: string; pages?: number; note?: string }
  /** Una imagen: la lee el modelo con visión, aquí sólo se prepara. */
  | { kind: "image"; dataUrl: string; note?: string };

export class FormatoNoSoportado extends Error {}

const TEXTO = /\.(txt|md|markdown|csv|tsv|json|html?|xml|rtf)$/i;
const IMAGEN = /\.(png|jpe?g|webp|gif|bmp)$/i;

/** Quita las etiquetas de un XML y deja el texto legible. */
function textoDeXml(xml: string, separador = " "): string {
  return xml
    .replace(/<[^>]+>/g, separador)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function abrirZip(buf: ArrayBuffer): Record<string, Uint8Array> {
  try {
    return unzipSync(new Uint8Array(buf));
  } catch {
    throw new FormatoNoSoportado("El archivo está dañado o no es del formato que parece.");
  }
}

/** Word: cada <w:p> es un párrafo. */
function deDocx(buf: ArrayBuffer): string {
  const zip = abrirZip(buf);
  const doc = zip["word/document.xml"];
  if (!doc) throw new FormatoNoSoportado("Ese .docx no trae documento dentro.");

  return strFromU8(doc)
    // Saltos y párrafos antes de quitar etiquetas, o todo acabaría en una línea.
    .replace(/<w:p[ >]/g, "\n<w:p ")
    .replace(/<w:br\/?>/g, "\n")
    .split("\n")
    .map((linea) => textoDeXml(linea, ""))
    .filter(Boolean)
    .join("\n");
}

/** PowerPoint: un bloque por diapositiva, en orden. */
function dePptx(buf: ArrayBuffer): string {
  const zip = abrirZip(buf);
  const slides = Object.keys(zip)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));

  if (!slides.length) throw new FormatoNoSoportado("Esa presentación no trae diapositivas.");

  return slides
    .map((nombre, i) => {
      // <a:t> es el texto de verdad; lo demás son posiciones y estilos.
      const textos = [...strFromU8(zip[nombre]).matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)]
        .map((m) => textoDeXml(m[1], ""))
        .filter(Boolean);
      return textos.length ? `Diapositiva ${i + 1}\n${textos.join("\n")}` : "";
    })
    .filter(Boolean)
    .join("\n\n");
}

/** Excel: se reconstruyen las filas, que es lo que hace útil una hoja. */
function deXlsx(buf: ArrayBuffer): string {
  const zip = abrirZip(buf);

  // Las celdas de texto no guardan el texto: guardan un número que apunta a
  // esta tabla compartida.
  const compartidas: string[] = [];
  if (zip["xl/sharedStrings.xml"]) {
    for (const m of strFromU8(zip["xl/sharedStrings.xml"]).matchAll(/<si>([\s\S]*?)<\/si>/g)) {
      const partes = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => textoDeXml(t[1], ""));
      compartidas.push(partes.join(""));
    }
  }

  const hojas = Object.keys(zip)
    .filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));

  if (!hojas.length) throw new FormatoNoSoportado("Ese libro no trae hojas dentro.");

  const salida: string[] = [];
  for (const [i, nombre] of hojas.entries()) {
    const xml = strFromU8(zip[nombre]);
    const filas: string[] = [];

    for (const fila of xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
      const celdas: string[] = [];
      for (const celda of fila[1].matchAll(/<c[^>]*?(?:\st="(\w+)")?[^>]*>([\s\S]*?)<\/c>/g)) {
        const tipo = celda[1];
        const valor = celda[2].match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
        const inline = celda[2].match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
        // `t="s"` significa que el valor es el índice de la tabla compartida.
        const texto = tipo === "s" ? (compartidas[Number(valor)] ?? "") : (inline ?? valor);
        celdas.push(textoDeXml(texto, ""));
      }
      // Una fila vacía es una separación visual en la hoja, no un dato.
      if (celdas.some(Boolean)) filas.push(celdas.join(" · "));
    }

    if (filas.length) salida.push(`Hoja ${i + 1}\n${filas.join("\n")}`);
  }

  return salida.join("\n\n");
}

async function dePdf(buf: ArrayBuffer): Promise<{ text: string; pages: number }> {
  const { extractText: pdfText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text, totalPages } = await pdfText(pdf, { mergePages: false });
  return {
    // Una página por bloque: le da al modelo dónde cortar las secciones.
    text: text.map((t) => t.trim()).filter(Boolean).join("\n\n"),
    pages: totalPages,
  };
}

/**
 * El texto (o la imagen) de un archivo subido.
 *
 * Lanza `FormatoNoSoportado` con un mensaje que se le puede enseñar a una
 * persona: los formatos raros existen y lo único útil es decir qué hacer.
 */
export async function extractDocument(file: File): Promise<Extracted> {
  if (file.size > MAX_BYTES) {
    throw new FormatoNoSoportado(
      `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB y el tope son ${MAX_BYTES / 1024 / 1024} MB.`,
    );
  }

  const nombre = file.name.toLowerCase();
  const tipo = file.type;

  if (IMAGEN.test(nombre) || tipo.startsWith("image/")) {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    return {
      kind: "image",
      dataUrl: `data:${tipo || "image/png"};base64,${base64}`,
      note: "Imagen leída con el modelo de visión: comprueba las cifras que haya sacado.",
    };
  }

  if (tipo === "application/pdf" || nombre.endsWith(".pdf")) {
    const { text, pages } = await dePdf(await file.arrayBuffer());
    if (!text.trim()) {
      throw new FormatoNoSoportado(
        "Ese PDF no tiene texto: es un escaneo. Súbelo como imagen y lo leo con visión, o pásalo por un OCR.",
      );
    }
    return { kind: "text", text, pages };
  }

  if (TEXTO.test(nombre) || tipo.startsWith("text/")) {
    return { kind: "text", text: await file.text() };
  }

  if (nombre.endsWith(".docx")) return { kind: "text", text: deDocx(await file.arrayBuffer()) };
  if (nombre.endsWith(".pptx")) return { kind: "text", text: dePptx(await file.arrayBuffer()) };
  if (nombre.endsWith(".xlsx")) return { kind: "text", text: deXlsx(await file.arrayBuffer()) };

  // Los formatos viejos de Office (.doc, .xls, .ppt) no son ZIP: son binarios
  // propietarios de los noventa. Y los de OpenDocument sí son ZIP, pero con
  // otro esqueleto. En los dos casos, la salida honrada es decir qué hacer.
  if (/\.(doc|xls|ppt)$/.test(nombre)) {
    throw new FormatoNoSoportado(
      "Ese formato es el antiguo de Office. Ábrelo y usa «Guardar como» en .docx, .xlsx o .pptx, o expórtalo a PDF.",
    );
  }
  if (/\.(odt|ods|odp|pages|numbers|key)$/.test(nombre)) {
    throw new FormatoNoSoportado("Exporta ese archivo a PDF o a formato de Office (.docx, .xlsx, .pptx) y vuelve a subirlo.");
  }

  throw new FormatoNoSoportado(
    "No sé leer ese formato. Sube un PDF, un Word, un Excel, un PowerPoint, un .md, un .txt o una imagen.",
  );
}

/** Nombre del archivo sin extensión, para proponer el título de la lección. */
export function tituloDesdeNombre(nombre: string): string {
  return nombre
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
