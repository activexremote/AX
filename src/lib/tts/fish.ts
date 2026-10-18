// ══════════════════════════════════════════════════════════
//  Narración de las lecciones con Fish Audio
//
//  El campus ya tenía `lessons.audio_url` y un reproductor, pero el MP3 había
//  que grabarlo y subirlo a mano. Esto lo genera a partir de `content_md`.
//
//  Tres decisiones que no son técnicas:
//
//  · El markdown NO se manda tal cual. Un modelo de voz lee lo que le pones,
//    incluidos los `#`, las URLs y los bloques de código: media lección
//    sonaría a alguien deletreando `https://supabase.co/dashboard`. Antes de
//    sintetizar, `contentToNarration()` deja sólo lo que tiene sentido oír.
//
//  · Y el código se cae entero. Dictar `create policy "x" on storage.objects`
//    no le sirve a nadie: el alumno lo tiene en pantalla. En su lugar queda
//    una frase que avisa de que ahí hay un bloque para mirar.
//
//  · Sin FISH_API_KEY no se inventa nada ni se rompe nada: la generación
//    automática deja de ofrecerse y la subida manual del MP3 sigue estando,
//    igual que antes. El campus funciona entero sin esta variable.
// ══════════════════════════════════════════════════════════

import { blocksToText, parseBlocks } from "@/lib/content/blocks";

const API = "https://api.fish.audio";

/** Modelo de síntesis. `s1` es el bueno; `speech-1.6` es más barato. */
const DEFAULT_MODEL = "s1";

/**
 * Fish acepta textos largos, pero un único POST con una lección entera es una
 * petición de varios minutos que cualquier proxy puede cortar por el medio, y
 * si se corta se pierde todo. Troceado, lo que se pierde es un trozo.
 */
const MAX_CHUNK = 1800;

export function ttsConfigured(): boolean {
  return Boolean(process.env.FISH_API_KEY);
}

export type TtsOptions = {
  /** Id del modelo de voz de Fish. Sin él, Fish usa su voz por defecto. */
  referenceId?: string | null;
  /** `s1`, `s1-mini`, `speech-1.6`… Se cambia sin tocar código. */
  model?: string;
  /** 64 · 128 · 192. La voz hablada no gana nada por encima de 128. */
  bitrate?: number;
};

function options(o: TtsOptions = {}) {
  return {
    referenceId: o.referenceId ?? process.env.FISH_VOICE_ID ?? null,
    model: o.model ?? process.env.FISH_MODEL ?? DEFAULT_MODEL,
    bitrate: o.bitrate ?? Number(process.env.FISH_BITRATE ?? 128),
  };
}

// ── Síntesis ──────────────────────────────────────────────

/** Convierte UN fragmento de texto en MP3. Para una lección entera, usa `narrateLesson()`. */
export async function synthesize(text: string, opts: TtsOptions = {}): Promise<Uint8Array> {
  const key = process.env.FISH_API_KEY;
  if (!key) throw new Error("Falta FISH_API_KEY.");

  const { referenceId, model, bitrate } = options(opts);

  const res = await fetch(`${API}/v1/tts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Fish elige el motor por cabecera, no por el cuerpo.
      model,
    },
    body: JSON.stringify({
      text,
      reference_id: referenceId,
      format: "mp3",
      mp3_bitrate: bitrate,
      normalize: true,
      latency: "normal",
    }),
  });

  if (!res.ok) {
    // El error de Fish viene en el cuerpo; sin leerlo, un 402 por saldo agotado
    // y un 401 por clave mala se parecen demasiado desde fuera.
    const detail = await res.text().catch(() => "");
    throw new Error(`Fish Audio ${res.status}: ${detail.slice(0, 400) || res.statusText}`);
  }

  return new Uint8Array(await res.arrayBuffer());
}

/** Genera el MP3 de una lección a partir de su markdown. */
export async function narrateLesson(
  contentMd: string,
  opts: TtsOptions & { onProgress?: (done: number, total: number) => void } = {},
): Promise<{ audio: Uint8Array; characters: number; chunks: number }> {
  return narrateText(contentToNarration(contentMd), opts);
}

/**
 * Lo que se narra de una lección, en el idioma pedido.
 *
 * Con bloques, salen de ellos: es donde está el contenido de las lecciones
 * del programa, y su `content_md` está vacío. Se saltan los recursos (leer en
 * voz alta una lista de descargas no sirve a nadie), las tablas, las cifras
 * y los gráficos: en audio no se entienden, y el alumno los tiene en pantalla.
 * Sin bloques, el Markdown de siempre (sólo en español: no hay otro).
 */
export function lessonNarrationText(
  lesson: { content_md?: string | null; content_blocks?: unknown; content_blocks_en?: unknown },
  lang: "es" | "en" = "es",
): string {
  const blocks = parseBlocks(lang === "en" ? lesson.content_blocks_en : lesson.content_blocks).filter(
    (b) => !["resources", "table", "stats", "chart", "divider"].includes(b.t),
  );
  if (blocks.length) return contentToNarration(blocksToText(blocks));
  return lang === "es" ? contentToNarration(lesson.content_md ?? "") : "";
}

/** La voz de cada idioma. La inglesa, si no hay una propia, es la misma. */
export function voiceFor(lang: "es" | "en"): string | null {
  if (lang === "en") return process.env.FISH_VOICE_ID_EN || process.env.FISH_VOICE_ID || null;
  return process.env.FISH_VOICE_ID || null;
}

/** Genera el MP3 de un texto ya preparado para la voz. */
export async function narrateText(
  text: string,
  opts: TtsOptions & { onProgress?: (done: number, total: number) => void } = {},
): Promise<{ audio: Uint8Array; characters: number; chunks: number }> {
  if (!text.trim()) throw new Error("La lección no tiene texto que narrar.");

  const parts = splitForTts(text);
  const buffers: Uint8Array[] = [];
  for (const [i, part] of parts.entries()) {
    buffers.push(await synthesize(part, opts));
    opts.onProgress?.(i + 1, parts.length);
  }

  // Un MP3 es una sucesión de tramas independientes: pegar los buffers en
  // orden da un MP3 válido. No hace falta ffmpeg ni recodificar.
  const total = buffers.reduce((n, b) => n + b.length, 0);
  const audio = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    audio.set(b, offset);
    offset += b.length;
  }

  return { audio, characters: text.length, chunks: parts.length };
}

// ── Preparación del texto ─────────────────────────────────

/**
 * Markdown → texto locutable.
 *
 * No pretende ser un parser de markdown: pretende que nadie oiga una almohadilla.
 */
export function contentToNarration(md: string): string {
  let t = md ?? "";

  t = t.replace(/^---\n[\s\S]*?\n---\n/, "");                 // frontmatter
  t = t.replace(/```[\s\S]*?```/g, "\n[[BLOQUE]]\n");          // código vallado
  t = t.replace(/^ {4}\S[^\n]*(\n {4}[^\n]*)*/gm, "\n[[BLOQUE]]\n"); // código indentado
  t = t.replace(/<[^>]+>/g, " ");                              // HTML suelto
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");                 // imágenes
  t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");               // enlaces → su texto
  t = t.replace(/^\s*\|.*\|\s*$/gm, "");                       // tablas: ilegibles en voz
  t = t.replace(/^\s*[-*_]{3,}\s*$/gm, "");                    // separadores
  t = t.replace(/^(#{1,6})\s*(.+)$/gm, (_m, _h, title) => `${String(title).replace(/[.:]\s*$/, "")}.`);
  t = t.replace(/^\s*>\s?/gm, "");                             // citas
  t = t.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "");             // viñetas y numeración
  t = t.replace(/`([^`]+)`/g, "$1");                           // código en línea
  t = t.replace(/(\*\*|__|\*|_|~~)/g, "");                     // negritas y cursivas
  t = t.replace(/https?:\/\/\S+/g, " el enlace de la lección ");
  t = t.replace(/\[\[BLOQUE\]\]/g, "Aquí tienes un bloque de código en pantalla.");
  t = t.replace(/[ \t]+/g, " ");
  t = t.replace(/\n{3,}/g, "\n\n");

  return t
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

/** Trocea por párrafos, y un párrafo demasiado largo por frases. */
export function splitForTts(text: string, max = MAX_CHUNK): string[] {
  const out: string[] = [];
  let buf = "";

  const push = () => {
    if (buf.trim()) out.push(buf.trim());
    buf = "";
  };

  for (const paragraph of text.split(/\n{2,}/)) {
    const p = paragraph.trim();
    if (!p) continue;

    if (p.length > max) {
      push();
      let frase = "";
      for (const s of p.match(/[^.!?…]+[.!?…]*\s*/g) ?? [p]) {
        if (frase.length + s.length > max) {
          if (frase.trim()) out.push(frase.trim());
          frase = "";
        }
        frase += s;
      }
      if (frase.trim()) out.push(frase.trim());
      continue;
    }

    if (buf.length + p.length + 2 > max) push();
    buf += (buf ? "\n\n" : "") + p;
  }
  push();

  return out;
}

// ── Cuenta ────────────────────────────────────────────────

export type FishVoice = { id: string; title: string; languages: string[] };

/** Voces del usuario (las clonadas y las guardadas). La usa `npm run fish:setup`. */
export async function listVoices(): Promise<FishVoice[]> {
  const key = process.env.FISH_API_KEY;
  if (!key) throw new Error("Falta FISH_API_KEY.");

  const res = await fetch(`${API}/model?self=true&page_size=50`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Fish Audio ${res.status}: ${(await res.text()).slice(0, 300)}`);

  const json = (await res.json()) as { items?: Array<Record<string, unknown>> };
  return (json.items ?? []).map((m) => ({
    id: String(m._id ?? m.id ?? ""),
    title: String(m.title ?? "(sin título)"),
    languages: Array.isArray(m.languages) ? (m.languages as string[]) : [],
  }));
}
