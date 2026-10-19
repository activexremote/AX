import type { Cluster } from "@/app/blog/content-map";
import type { Article, Block } from "@/app/blog/types";

// ══════════════════════════════════════════════════════════
//  El artículo de blog que sale del panel
//
//  Tiene la misma forma que los artículos escritos a mano (app/blog/types.ts):
//  secciones con respuesta directa, bloques enriquecidos —tablas, checklist,
//  pasos, cifras, gráficos, avisos y llamadas al producto— y un «en corto» al
//  final de cada una. Así se pinta con el mismo componente y se ve igual.
//
//  Sin nada de servidor: el editor y la vista previa lo usan en el navegador.
// ══════════════════════════════════════════════════════════

export type BlogSection = {
  h2: string;
  /** Respuesta directa de 40-60 palabras: va primero, como en el blog. */
  answer: string;
  blocks: Block[];
  /** «En corto»: lo que hay que recordar de la sección. */
  takeaway: string;
};

export type Curso = "remote-professional" | "remote-founder";

export type BlogBody = {
  slug: string;
  title: string;
  metaDescription: string;
  keyword: string;
  cluster: Cluster;
  /** El curso al que empuja el artículo, si empuja a alguno. */
  course: Curso | null;
  intro: string[];
  sections: BlogSection[];
  faqs: { q: string; a: string }[];
  /** Fuentes oficiales o de autoridad. */
  external: { label: string; url: string }[];
};

export const CLUSTERS: Cluster[] = ["empleo", "fiscalidad", "legal", "negocio", "metodo", "herramientas"];
export const CURSOS: Curso[] = ["remote-professional", "remote-founder"];

/**
 * A dónde puede llevar una llamada al producto. Una lista cerrada: la IA no
 * se inventa URLs, y un botón a una página que no existe es peor que ninguno.
 */
export const DESTINOS: Record<string, { es: string; en: string }> = {
  "/cursos/remote-professional": { es: "Curso Remote Professional", en: "Remote Professional course" },
  "/cursos/remote-founder": { es: "Curso Remote Founder", en: "Remote Founder course" },
  "/cursos-relampago": { es: "Cursos relámpago", en: "Flash courses" },
  "/bienvenida#solicitar": { es: "Solicitar información", en: "Request information" },
};

export const TIPOS_BLOQUE: Block["t"][] = [
  "p", "ul", "ol", "check", "steps", "table", "pros", "stats", "chart", "note", "disclaimer", "quote", "cta",
];

// ── Leer lo que llega (de la IA o del formulario) ──────────

const str = (v: unknown, max = 10_000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const strs = (v: unknown, max = 2_000) => (Array.isArray(v) ? v.map((x) => str(x, max)).filter(Boolean) : []);
const obj = (v: unknown) => (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
};

/** Un bloque que no tenga la forma de su tipo se cae, venga de donde venga. */
export function parseBlock(raw: unknown, course: Curso | null = null): Block | null {
  const o = obj(raw);
  switch (o.t) {
    case "p":
    case "note":
    case "disclaimer": {
      const text = str(o.text, 3_000);
      return text ? { t: o.t, text } : null;
    }
    case "quote": {
      const text = str(o.text, 1_000);
      const by = str(o.by, 120);
      return text ? { t: "quote", text, ...(by ? { by } : {}) } : null;
    }
    case "ul":
    case "ol": {
      const items = strs(o.items).slice(0, 15);
      return items.length ? { t: o.t, items } : null;
    }
    case "check": {
      const items = strs(o.items, 400).slice(0, 15);
      const title = str(o.title, 120);
      return items.length ? { t: "check", ...(title ? { title } : {}), items } : null;
    }
    case "steps": {
      const items = (Array.isArray(o.items) ? o.items : [])
        .map((s) => ({ title: str(obj(s).title, 150), text: str(obj(s).text, 1_500) }))
        .filter((s) => s.title && s.text)
        .slice(0, 10);
      return items.length ? { t: "steps", items } : null;
    }
    case "pros": {
      const pros = strs(o.pros, 400).slice(0, 10);
      const cons = strs(o.cons, 400).slice(0, 10);
      return pros.length || cons.length ? { t: "pros", pros, cons } : null;
    }
    case "table": {
      const head = strs(o.head, 120).slice(0, 6);
      const rows = (Array.isArray(o.rows) ? o.rows : [])
        .map((r) => strs(r, 400).slice(0, head.length))
        .filter((r) => r.length)
        // Una fila corta se rellena: una celda que falta descuadra la tabla.
        .map((r) => [...r, ...Array(Math.max(0, head.length - r.length)).fill("")])
        .slice(0, 15);
      return head.length >= 2 && rows.length ? { t: "table", head, rows } : null;
    }
    case "stats": {
      const items = (Array.isArray(o.items) ? o.items : [])
        .map((s) => ({ value: str(obj(s).value, 24), label: str(obj(s).label, 160) }))
        .filter((s) => s.value && s.label)
        .slice(0, 4);
      const source = str(o.source, 200);
      return items.length ? { t: "stats", items, ...(source ? { source } : {}) } : null;
    }
    case "chart": {
      const bars = (Array.isArray(o.bars) ? o.bars : [])
        .map((b) => ({ label: str(obj(b).label, 80), value: num(obj(b).value) }))
        .filter((b) => b.label && Number.isFinite(b.value) && b.value >= 0)
        .slice(0, 10);
      const title = str(o.title, 160);
      const unit = str(o.unit, 16);
      const source = str(o.source, 200);
      return bars.length >= 2 && title ? { t: "chart", title, bars, ...(unit ? { unit } : {}), ...(source ? { source } : {}) } : null;
    }
    case "cta": {
      const title = str(o.title, 120);
      const text = str(o.text, 400);
      const button = str(o.button, 40);
      const pedido = str(o.href, 120);
      const href = DESTINOS[pedido] ? pedido : course ? `/cursos/${course}` : "/bienvenida#solicitar";
      return title && button ? { t: "cta", title, text, button, href } : null;
    }
  }
  return null;
}

export function parseBlog(raw: unknown): BlogBody {
  const o = obj(raw);
  const cluster = CLUSTERS.includes(o.cluster as Cluster) ? (o.cluster as Cluster) : "empleo";
  const course = CURSOS.includes(o.course as Curso) ? (o.course as Curso) : null;

  const sections = (Array.isArray(o.sections) ? o.sections : [])
    .map((s) => {
      const so = obj(s);
      let blocks = (Array.isArray(so.blocks) ? so.blocks : []).map((b) => parseBlock(b, course)).filter((b): b is Block => b !== null);
      // Versiones guardadas antes de los bloques: párrafos y una lista.
      if (!Array.isArray(so.blocks)) {
        blocks = [
          ...strs(so.paragraphs, 10_000).map((text): Block => ({ t: "p", text })),
          ...(strs(so.bullets).length ? [{ t: "ul", items: strs(so.bullets) } as Block] : []),
        ];
      }
      return { h2: str(so.h2, 200), answer: str(so.answer, 1_500), blocks, takeaway: str(so.takeaway, 400) };
    })
    .filter((s) => s.h2 || s.answer || s.blocks.length);

  const faqs = (Array.isArray(o.faqs) ? o.faqs : [])
    .map((f) => ({ q: str(obj(f).q, 300), a: str(obj(f).a, 1_500) }))
    .filter((f) => f.q && f.a);

  const external = (Array.isArray(o.external) ? o.external : [])
    .map((e) => ({ label: str(obj(e).label, 160), url: str(obj(e).url, 500) }))
    .filter((e) => e.label && /^https:\/\/[^\s/]+\.[^\s]+$/.test(e.url))
    .slice(0, 8);

  return {
    slug: slugify(str(o.slug, 120) || str(o.title, 120)),
    title: str(o.title, 200),
    metaDescription: str(o.metaDescription, 400),
    keyword: str(o.keyword, 120),
    cluster,
    course,
    intro: strs(o.intro, 3_000),
    sections,
    faqs,
    external,
  };
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

// ── Contar ─────────────────────────────────────────────────

/** Todo el texto que se lee de un bloque, para contar palabras. */
export function textoDeBloque(b: Block): string[] {
  switch (b.t) {
    case "p":
    case "note":
    case "disclaimer":
    case "quote":
      return [b.text];
    case "ul":
    case "ol":
    case "check":
      return b.items;
    case "steps":
      return b.items.flatMap((s) => [s.title, s.text]);
    case "pros":
      return [...b.pros, ...b.cons];
    case "table":
      return [...b.head, ...b.rows.flat()];
    case "stats":
      return b.items.flatMap((s) => [s.value, s.label]);
    case "chart":
      return [b.title, ...b.bars.map((x) => x.label)];
    case "cta":
      return [b.title, b.text];
  }
}

export const palabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

export function palabrasBlog(b: BlogBody): number {
  return palabras(
    [
      ...b.intro,
      ...b.sections.flatMap((s) => [s.h2, s.answer, ...s.blocks.flatMap(textoDeBloque), s.takeaway]),
      ...b.faqs.flatMap((f) => [f.q, f.a]),
    ].join(" "),
  );
}

// ── De la versión del panel al artículo del blog ───────────

/**
 * El artículo tal como lo pinta el blog. Lo usan la vista previa y, al
 * publicar, el blog: lo que se revisa es lo que sale.
 */
export function articuloDesdeBlog(
  b: BlogBody,
  opts: { locale: "es" | "en"; fecha: string; hero?: { url: string; alt: string } | null },
): Article {
  const ids = new Set<string>();
  return {
    slug: b.slug,
    locale: opts.locale,
    cluster: b.cluster,
    funnel: b.course ? "mofu" : "tofu",
    intent: "informacional",
    keyword: b.keyword,
    secondary: [],
    title: b.title,
    h1: b.title,
    metaTitle: b.title,
    metaDescription: b.metaDescription,
    ogTitle: b.title,
    ogDescription: b.metaDescription,
    published: opts.fecha,
    updated: opts.fecha,
    readingMinutes: Math.max(1, Math.round(palabrasBlog(b) / 220)),
    author: opts.locale === "en" ? "ActiveXRemote team" : "Equipo ActiveXRemote",
    intro: b.intro,
    sections: b.sections.map((s, i) => {
      // Anclas únicas aunque dos títulos se parezcan.
      let id = slugify(s.h2) || `seccion-${i + 1}`;
      while (ids.has(id)) id = `${id}-${i + 1}`;
      ids.add(id);
      return { id, h2: s.h2, answer: s.answer, blocks: s.blocks, ...(s.takeaway ? { takeaway: s.takeaway } : {}) };
    }),
    faqs: b.faqs,
    external: b.external,
    terms: [],
    related: [],
    ...(b.course ? { course: b.course } : {}),
    ...(opts.hero ? { hero: { file: opts.hero.url, alt: opts.hero.alt || b.title } } : {}),
  };
}
