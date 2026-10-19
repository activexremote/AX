import { palabras, palabrasBlog, parseBlog, slugify, type BlogBody } from "@/lib/social/blog";
import type { SocialChannel } from "@/lib/supabase/types";

export { slugify, type BlogBody };

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

  blog: `Blog de ActiveXRemote (artículo SEO enriquecido):
- Pensado para tres lectores: la persona que escanea, el buscador y los
  modelos de lenguaje que citan bloques sueltos. Tiene que ser BONITO de leer:
  un muro de párrafos no sirve. Cada sección mezcla párrafos con piezas
  visuales que se entienden solas.
- "keyword": la búsqueda principal, tal como la escribiría alguien en Google.
- "title": con la keyword, máximo 65 caracteres, sin clickbait.
- "slug": la keyword en minúsculas, sin tildes, palabras separadas por guiones,
  máximo 60 caracteres.
- "metaDescription": entre 120 y 155 caracteres, con la keyword y un motivo
  para hacer clic.
- "cluster": uno de empleo | fiscalidad | legal | negocio | metodo | herramientas.
- "course": "remote-professional" si el tema es encontrar o hacer bien un
  trabajo remoto para una empresa; "remote-founder" si es montar o hacer
  crecer un negocio propio; null si no encaja con ninguno.
- "intro": dos o tres párrafos cortos que planteen el problema del lector.
- "sections": entre 5 y 7. Cada una con:
  · "h2": una pregunta o afirmación que alguien buscaría;
  · "answer": 40 a 60 palabras que respondan solas, sin depender del resto;
  · "blocks": de 2 a 5 bloques (ver abajo), empezando casi siempre por un
    párrafo "p" y nunca con dos bloques visuales iguales seguidos;
  · "takeaway": una frase de cierre, lo que hay que recordar.
- Bloques disponibles (campo "t" y sus campos):
  · "p" {text}: párrafo de 2 a 4 frases. Nunca más de dos "p" seguidos.
  · "ul" {items} / "ol" {items}: lista; "ol" sólo si el orden importa.
  · "check" {title, items}: checklist accionable que el lector puede ir
    marcando ("Antes de enviar tu CV, comprueba…"). 4 a 8 puntos.
  · "steps" {items: [{title, text}]}: proceso en 3 a 6 pasos con nombre.
  · "table" {head, rows}: comparativa; 2 a 4 columnas, 3 a 6 filas, celdas
    cortas.
  · "pros" {pros, cons}: ventajas e inconvenientes.
  · "stats" {items: [{value, label}], source}: 2 a 4 cifras grandes ("1
    página", "6-8 s").
  · "chart" {title, unit, bars: [{label, value}], source}: barras horizontales
    con 3 a 6 valores numéricos comparables.
  · "note" {text}: consejo práctico o matiz importante, destacado.
  · "disclaimer" {text}: aviso de que no es asesoramiento profesional.
  · "quote" {text}: una frase memorable nuestra (sin atribuirla a nadie).
  · "cta" {title, text, button, href}: llamada al producto en el punto donde
    encaja con lo que se acaba de leer. "href" es uno de:
    /cursos/remote-professional, /cursos/remote-founder, /cursos-relampago,
    /bienvenida#solicitar. Título que conecte con la sección, texto de una
    frase sin promesas, botón de 2 a 4 palabras ("Ver el programa").
- En el artículo entero tiene que haber, como mínimo: una "table" o "pros",
  un "check", un "steps", un "note" y entre 1 y 2 "cta" (nunca en la primera
  sección; el último, en la penúltima o la última).
- "stats" y "chart" SÓLO con cifras que estén en el material o que sean datos
  públicos y verificables de organismos oficiales, con el organismo en
  "source". Si no tienes datos así, no los uses: usa otro bloque.
- "disclaimer" OBLIGATORIO si el tema toca impuestos, contratos, visados,
  seguridad social o dinero: "Esta guía es informativa y no sustituye el
  asesoramiento de un profesional…", adaptado al tema.
- "faqs": 4 a 6 preguntas reales con respuestas de 2 o 3 frases.
- "external": 2 a 4 fuentes oficiales o de autoridad {label, url}. Sólo la
  página de inicio de organismos que existen seguro (https://europa.eu,
  https://www.agenciatributaria.es…) o el enlace de origen. Nunca inventes
  rutas profundas.
- Entre 1.400 y 2.200 palabras en total.`,
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
  return parseBlog(raw) as BodyFor[C];
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
      if (!s.blocks.length) avisos.push({ nivel: "aviso", texto: `La sección ${i + 1} sólo tiene la respuesta: le falta desarrollo.` });
    });
    const total = palabrasBlog(b);
    if (total < 800) avisos.push({ nivel: "aviso", texto: `Son ${total} palabras; un artículo que posicione suele pasar de 1.200.` });

    // Un artículo que se lea bien no es un muro de párrafos.
    const bloques = b.sections.flatMap((s) => s.blocks);
    const visuales = bloques.filter((x) => x.t !== "p").length;
    if (b.sections.length && visuales < b.sections.length) {
      avisos.push({ nivel: "aviso", texto: "Hay pocos bloques visuales (tablas, checklist, pasos…): el artículo se lee como un muro de texto." });
    }
    if (!bloques.some((x) => x.t === "cta")) avisos.push({ nivel: "aviso", texto: "No hay ninguna llamada al producto dentro del artículo." });
    if (bloques.filter((x) => x.t === "cta").length > 2) avisos.push({ nivel: "aviso", texto: "Hay más de dos llamadas al producto: resta credibilidad." });
    if (b.sections[0]?.blocks.some((x) => x.t === "cta")) avisos.push({ nivel: "aviso", texto: "Hay una llamada al producto en la primera sección: todavía no se ha ganado la atención." });
    bloques.forEach((x) => {
      if ((x.t === "stats" || x.t === "chart") && !x.source) {
        avisos.push({ nivel: "aviso", texto: `Un bloque de ${x.t === "chart" ? "gráfico" : "cifras"} no dice de dónde salen los datos: añade la fuente o quítalo.` });
      }
    });
    const delicado = /\b(impuest|fiscal|hacienda|irpf|iva|visado|contrato|seguridad social|cotiz|tax|visa|contract)/i;
    if (delicado.test(JSON.stringify(b)) && !bloques.some((x) => x.t === "disclaimer")) {
      avisos.push({ nivel: "aviso", texto: "Habla de impuestos, contratos o visados y no lleva aviso de «no es asesoramiento»." });
    }
    if (b.external.length) avisos.push({ nivel: "aviso", texto: "Abre las fuentes y comprueba que existen antes de programar." });
    const todo = JSON.stringify(b);
    if (PROHIBIDAS.test(todo)) avisos.push({ nivel: "aviso", texto: "Usa una palabra que la marca evita (gratis, free…)." });
  }
  return avisos;
}
