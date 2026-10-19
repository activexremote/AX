import type { SocialChannel } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Los canales y sus buenas prácticas
//
//  Un solo sitio para todo lo que distingue a un canal de otro:
//
//   · la GUÍA que recibe DeepSeek al escribir (qué funciona en cada red);
//   · la FORMA del contenido (un tuit no se parece a un artículo);
//   · las COMPROBACIONES que ve quien revisa antes de programar.
//
//  Cambiar cómo se escribe para LinkedIn es cambiar este archivo, y nada más.
//
//  Se importa también desde el navegador (el contador de caracteres del
//  editor), así que aquí no puede haber nada de servidor.
// ══════════════════════════════════════════════════════════

export const CANALES: SocialChannel[] = ["x", "linkedin", "blog"];

export const NOMBRE_CANAL: Record<SocialChannel, string> = {
  x: "X",
  linkedin: "LinkedIn",
  blog: "Blog",
};

// ── La forma del contenido ─────────────────────────────────

export type XBody = {
  /** El post. Si hay hilo, es el primero. */
  text: string;
  /** Posts que siguen al primero, en orden. Vacío = post suelto. */
  thread: string[];
};

export type LinkedInBody = {
  text: string;
};

export type BlogSection = {
  h2: string;
  /** Respuesta directa de 40-60 palabras: va primero, como en el blog. */
  answer: string;
  paragraphs: string[];
  bullets: string[];
};

export type BlogBody = {
  slug: string;
  title: string;
  metaDescription: string;
  keyword: string;
  intro: string[];
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
};

export type BodyFor = { x: XBody; linkedin: LinkedInBody; blog: BlogBody };

// ── Lo que sabe DeepSeek de cada canal ─────────────────────
//
// Reglas que no dependen del tema. Lo que es de marca (tono, palabras
// prohibidas) está en lib/social/generar.ts, que vale para los tres.

export const GUIA: Record<SocialChannel, string> = {
  x: `X (Twitter):
- Máximo 280 caracteres por post; apunta a 120-250. Un enlace cuenta como 23.
- La primera línea es el gancho: una afirmación concreta, una cifra o una
  tensión. Nada de "Hilo 🧵" ni "Os cuento".
- Una sola idea por post. Si el tema necesita más, haz un hilo de 3 a 6 posts:
  cada uno debe entenderse solo y aportar algo nuevo.
- Los enlaces externos reducen el alcance: si hay que enlazar, va en el último
  post del hilo, nunca en el primero.
- 0, 1 o como mucho 2 hashtags, y sólo si alguien los busca de verdad. Nunca en
  mitad de la frase.
- Nada de pedir RT, likes ni "comenta SÍ": X lo penaliza y resta credibilidad.`,

  linkedin: `LinkedIn:
- LinkedIn corta el texto a unos 210 caracteres con "…ver más". Esas dos o tres
  primeras líneas son lo único que se lee seguro: tienen que obligar a abrir.
- Longitud ideal entre 900 y 1.600 caracteres. Máximo absoluto 3.000.
- Párrafos de una o dos frases, separados por una línea en blanco. Se lee en
  el móvil.
- Experiencia y criterio propios: qué hemos visto, qué recomendamos y por qué.
  LinkedIn premia el punto de vista, no el resumen de noticias.
- Si hay enlace, al final y una sola vez: los enlaces reducen el alcance.
- Cierra con una pregunta concreta que invite a comentar desde la experiencia
  del lector (no "¿qué opináis?").
- 3 a 5 hashtags al final, en una línea propia, específicos del tema.
- Nada de listas con emojis como viñetas ni de frases sueltas de una palabra
  ("Spoiler:", "Resultado:") encadenadas.`,

  blog: `Blog de ActiveXRemote (artículo SEO):
- Pensado para tres lectores: la persona que escanea, el buscador y los
  modelos de lenguaje que citan bloques sueltos.
- "keyword": la búsqueda principal, tal como la escribiría alguien en Google.
- "title": con la keyword, máximo 65 caracteres, sin clickbait.
- "slug": la keyword en minúsculas, sin tildes, palabras separadas por guiones,
  máximo 60 caracteres.
- "metaDescription": entre 120 y 155 caracteres, con la keyword y un motivo
  para hacer clic.
- "intro": dos o tres párrafos que planteen el problema del lector.
- "sections": entre 4 y 7. Cada una con un "h2" que sea una pregunta o una
  afirmación que alguien buscaría, y un "answer" de 40 a 60 palabras que
  responda solo, sin depender del resto del artículo. Después, 2 a 4
  "paragraphs" que desarrollen, y "bullets" sólo si hay una lista real (si no,
  lista vacía).
- "faqs": 3 a 5 preguntas reales con respuestas de 2 o 3 frases.
- Entre 1.200 y 2.000 palabras en total.`,
};

// ── Leer lo que llega (de la IA o del formulario) ──────────

const str = (v: unknown, max = 10_000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strs = (v: unknown, max = 10_000) =>
  Array.isArray(v) ? v.map((x) => str(x, max)).filter(Boolean) : [];

/** Lo que no tenga la forma del canal se cae aquí, venga de donde venga. */
export function parseBody<C extends SocialChannel>(channel: C, raw: unknown): BodyFor[C] {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (channel === "x") {
    return { text: str(o.text, 2_000), thread: strs(o.thread, 2_000).slice(0, 12) } as BodyFor[C];
  }
  if (channel === "linkedin") {
    return { text: str(o.text, 6_000) } as BodyFor[C];
  }
  const sections = (Array.isArray(o.sections) ? o.sections : [])
    .map((s) => {
      const so = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
      return { h2: str(so.h2, 200), answer: str(so.answer, 1_500), paragraphs: strs(so.paragraphs), bullets: strs(so.bullets, 500) };
    })
    .filter((s) => s.h2 || s.answer || s.paragraphs.length);
  const faqs = (Array.isArray(o.faqs) ? o.faqs : [])
    .map((f) => {
      const fo = (f && typeof f === "object" ? f : {}) as Record<string, unknown>;
      return { q: str(fo.q, 300), a: str(fo.a, 1_500) };
    })
    .filter((f) => f.q && f.a);
  return {
    slug: slugify(str(o.slug, 120) || str(o.title, 120)),
    title: str(o.title, 200),
    metaDescription: str(o.metaDescription, 400),
    keyword: str(o.keyword, 120),
    intro: strs(o.intro),
    sections,
    faqs,
  } as BodyFor[C];
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

// ── Comprobaciones para quien revisa ───────────────────────

/**
 * Caracteres tal como los cuenta X: cada enlace vale 23, lo mida lo que mida.
 * Es una aproximación (X cuenta doble algunos emojis y el CJK), suficiente
 * para avisar antes de que la publicación falle.
 */
export function longitudX(text: string): number {
  return [...text.replace(/https?:\/\/\S+/g, "x".repeat(23))].length;
}

export const LIMITE_X = 280;
export const LIMITE_LINKEDIN = 3_000;
/** Lo que LinkedIn enseña antes de "…ver más". */
export const PLIEGUE_LINKEDIN = 210;

/** Palabras que la marca no usa (ver app/blog/content-map.ts). */
const PROHIBIDAS = /\b(gratis|gratuit[oa]s?|free|sin coste)\b/i;

export type Aviso = { nivel: "error" | "aviso"; texto: string };

const palabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function revisar(channel: SocialChannel, body: unknown): Aviso[] {
  const avisos: Aviso[] = [];
  if (channel === "x") {
    const b = parseBody("x", body);
    [b.text, ...b.thread].forEach((t, i) => {
      const n = longitudX(t);
      const cual = b.thread.length ? `Post ${i + 1}` : "El post";
      if (!t) avisos.push({ nivel: "error", texto: `${cual} está vacío.` });
      else if (n > LIMITE_X) avisos.push({ nivel: "error", texto: `${cual} tiene ${n} caracteres; X admite ${LIMITE_X}.` });
      if ((t.match(/#\w+/g) ?? []).length > 2) avisos.push({ nivel: "aviso", texto: `${cual} lleva más de dos hashtags.` });
    });
    if (/https?:\/\//.test(b.text) && b.thread.length) {
      avisos.push({ nivel: "aviso", texto: "El enlace está en el primer post: en un hilo, rinde más en el último." });
    }
    if (PROHIBIDAS.test([b.text, ...b.thread].join(" "))) avisos.push({ nivel: "aviso", texto: "Usa una palabra que la marca evita (gratis, free…)." });
  } else if (channel === "linkedin") {
    const b = parseBody("linkedin", body);
    const n = [...b.text].length;
    if (!b.text) avisos.push({ nivel: "error", texto: "El texto está vacío." });
    else if (n > LIMITE_LINKEDIN) avisos.push({ nivel: "error", texto: `Tiene ${n} caracteres; LinkedIn admite ${LIMITE_LINKEDIN}.` });
    else if (n < 500) avisos.push({ nivel: "aviso", texto: "Es corto para LinkedIn: entre 900 y 1.600 caracteres rinde mejor." });
    const tags = (b.text.match(/#\w+/g) ?? []).length;
    if (tags > 5) avisos.push({ nivel: "aviso", texto: `Lleva ${tags} hashtags; con 3 a 5 basta.` });
    if (PROHIBIDAS.test(b.text)) avisos.push({ nivel: "aviso", texto: "Usa una palabra que la marca evita (gratis, free…)." });
  } else {
    const b = parseBody("blog", body);
    if (!b.title) avisos.push({ nivel: "error", texto: "Falta el título." });
    else if (b.title.length > 65) avisos.push({ nivel: "aviso", texto: `El título tiene ${b.title.length} caracteres; Google corta hacia los 60-65.` });
    if (!b.slug) avisos.push({ nivel: "error", texto: "Falta la URL (slug)." });
    const m = b.metaDescription.length;
    if (m < 120 || m > 155) avisos.push({ nivel: "aviso", texto: `La meta descripción tiene ${m} caracteres; lo ideal es 120-155.` });
    if (b.sections.length < 3) avisos.push({ nivel: "aviso", texto: "Tiene menos de 3 secciones." });
    b.sections.forEach((s, i) => {
      const n = palabras(s.answer);
      if (n < 30 || n > 75) avisos.push({ nivel: "aviso", texto: `La respuesta de la sección ${i + 1} tiene ${n} palabras; lo ideal es 40-60.` });
    });
    const total = palabras([...b.intro, ...b.sections.flatMap((s) => [s.answer, ...s.paragraphs, ...s.bullets]), ...b.faqs.map((f) => f.a)].join(" "));
    if (total < 800) avisos.push({ nivel: "aviso", texto: `Son ${total} palabras; un artículo que posicione suele pasar de 1.200.` });
    const todo = JSON.stringify(b);
    if (PROHIBIDAS.test(todo)) avisos.push({ nivel: "aviso", texto: "Usa una palabra que la marca evita (gratis, free…)." });
  }
  return avisos;
}
