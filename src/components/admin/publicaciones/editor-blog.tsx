"use client";

import { blogCopy } from "@/app/blog/copy";
import type { Block } from "@/app/blog/types";
import {
  CLUSTERS,
  CURSOS,
  DESTINOS,
  TIPOS_BLOQUE,
  palabras,
  parseBlock,
  parseBlog,
  type BlogBody,
  type Curso,
} from "@/lib/social/blog";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";

// ══════════════════════════════════════════════════════════
//  El artículo del blog, bloque a bloque
//
//  Cada bloque es una tarjeta con sus campos en texto llano: las listas, una
//  línea por elemento; las tablas y las cifras, con «|» entre columnas. Se
//  guarda el texto tal cual se escribe y sólo se convierte al leerlo: si se
//  convirtiera en cada tecla, la línea en blanco que separa dos párrafos o
//  el «|» que se está escribiendo desaparecerían antes de terminar.
// ══════════════════════════════════════════════════════════

type T = Block["t"];
type Campo = { k: string; kind: "line" | "area" | "lines" | "href" };

const CAMPOS: Record<T, Campo[]> = {
  p: [{ k: "text", kind: "area" }],
  ul: [{ k: "items", kind: "lines" }],
  ol: [{ k: "items", kind: "lines" }],
  check: [{ k: "title", kind: "line" }, { k: "items", kind: "lines" }],
  steps: [{ k: "steps", kind: "lines" }],
  table: [{ k: "head", kind: "line" }, { k: "rows", kind: "lines" }],
  pros: [{ k: "pros", kind: "lines" }, { k: "cons", kind: "lines" }],
  stats: [{ k: "stats", kind: "lines" }, { k: "source", kind: "line" }],
  chart: [{ k: "title", kind: "line" }, { k: "unit", kind: "line" }, { k: "bars", kind: "lines" }, { k: "source", kind: "line" }],
  note: [{ k: "text", kind: "area" }],
  disclaimer: [{ k: "text", kind: "area" }],
  quote: [{ k: "text", kind: "area" }, { k: "by", kind: "line" }],
  cta: [{ k: "title", kind: "line" }, { k: "text", kind: "area" }, { k: "button", kind: "line" }, { k: "href", kind: "href" }],
};

export type BloqueForm = { id: number; t: T; f: Record<string, string> };

export type BlogForm = Omit<BlogBody, "intro" | "sections" | "external"> & {
  intro: string;
  external: string;
  sections: { id: number; h2: string; answer: string; takeaway: string; blocks: BloqueForm[] }[];
};

let siguiente = 1;
const nuevoId = () => siguiente++;

const lineas = (s: string) => s.split("\n").map((l) => l.replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "").trim()).filter(Boolean);
const celdas = (s: string) => s.split("|").map((c) => c.trim());
const parrafos = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

function aCampos(b: Block): Record<string, string> {
  switch (b.t) {
    case "p":
    case "note":
    case "disclaimer":
      return { text: b.text };
    case "quote":
      return { text: b.text, by: b.by ?? "" };
    case "ul":
    case "ol":
      return { items: b.items.join("\n") };
    case "check":
      return { title: b.title ?? "", items: b.items.join("\n") };
    case "steps":
      return { steps: b.items.map((s) => `${s.title}: ${s.text}`).join("\n") };
    case "table":
      return { head: b.head.join(" | "), rows: b.rows.map((r) => r.join(" | ")).join("\n") };
    case "pros":
      return { pros: b.pros.join("\n"), cons: b.cons.join("\n") };
    case "stats":
      return { stats: b.items.map((s) => `${s.value} | ${s.label}`).join("\n"), source: b.source ?? "" };
    case "chart":
      return { title: b.title, unit: b.unit ?? "", bars: b.bars.map((x) => `${x.label} | ${x.value}`).join("\n"), source: b.source ?? "" };
    case "cta":
      return { title: b.title, text: b.text, button: b.button, href: b.href };
  }
}

/** Del formulario al bloque. `null` si todavía está incompleto. */
export function aBloque(b: BloqueForm, course: Curso | null): Block | null {
  const f = b.f;
  const raw: Record<string, unknown> = { t: b.t, ...f };
  if ("items" in f) raw.items = lineas(f.items);
  if (b.t === "steps") {
    raw.items = lineas(f.steps ?? "").map((l) => {
      const i = l.indexOf(":");
      return i > 0 ? { title: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { title: l, text: "" };
    });
  }
  if (b.t === "table") {
    raw.head = celdas(f.head ?? "").filter(Boolean);
    raw.rows = (f.rows ?? "").split("\n").filter((l) => l.trim()).map(celdas);
  }
  if (b.t === "pros") {
    raw.pros = lineas(f.pros ?? "");
    raw.cons = lineas(f.cons ?? "");
  }
  if (b.t === "stats") {
    raw.items = lineas(f.stats ?? "").map((l) => {
      const [value, ...label] = celdas(l);
      return { value, label: label.join(" | ") };
    });
  }
  if (b.t === "chart") {
    raw.bars = lineas(f.bars ?? "").map((l) => {
      const c = celdas(l);
      return { label: c.slice(0, -1).join(" | "), value: c[c.length - 1] };
    });
  }
  return parseBlock(raw, course);
}

export function blogAForm(b: BlogBody): BlogForm {
  return {
    ...b,
    intro: b.intro.join("\n\n"),
    external: b.external.map((e) => `${e.label} | ${e.url}`).join("\n"),
    sections: b.sections.map((s) => ({
      id: nuevoId(),
      h2: s.h2,
      answer: s.answer,
      takeaway: s.takeaway,
      blocks: s.blocks.map((x) => ({ id: nuevoId(), t: x.t, f: aCampos(x) })),
    })),
  };
}

export function formABlog(f: BlogForm): BlogBody {
  return parseBlog({
    ...f,
    intro: parrafos(f.intro),
    external: lineas(f.external).map((l) => {
      const c = celdas(l);
      return { label: c.slice(0, -1).join(" | ") || c[0], url: c[c.length - 1] };
    }),
    sections: f.sections.map((s) => ({
      h2: s.h2,
      answer: s.answer,
      takeaway: s.takeaway,
      blocks: s.blocks.map((x) => aBloque(x, f.course)).filter(Boolean),
    })),
  });
}

function vacio(t: T, locale: string): BloqueForm {
  const f = Object.fromEntries(CAMPOS[t].map((c) => [c.k, ""]));
  if (t === "cta") f.href = "/bienvenida#solicitar";
  if (t === "disclaimer") {
    f.text =
      locale === "en"
        ? "This guide is for information only and does not replace advice from a qualified professional for your specific case."
        : "Esta guía es informativa y no sustituye el asesoramiento de un profesional para tu caso concreto.";
  }
  return { id: nuevoId(), t, f };
}

// ── Una tarjeta de bloque ──────────────────────────────────

function Bloque({
  b,
  n,
  total,
  course,
  copy,
  locale,
  disabled,
  onChange,
  onMove,
  onRemove,
}: {
  b: BloqueForm;
  n: number;
  total: number;
  course: Curso | null;
  copy: PubCopy;
  locale: string;
  disabled: boolean;
  onChange: (b: BloqueForm) => void;
  onMove: (d: -1 | 1) => void;
  onRemove: () => void;
}) {
  const incompleto = aBloque(b, course) === null;
  const set = (k: string, v: string) => onChange({ ...b, f: { ...b.f, [k]: v } });
  const etiqueta = (k: string) => copy.campos[`${b.t}.${k}` as keyof PubCopy["campos"]] ?? copy.campos[k as keyof PubCopy["campos"]] ?? k;

  return (
    <div className={`axr-pub-block axr-pub-block--${b.t}`}>
      <div className="axr-pub-block__head">
        <span className="axr-pub-block__type">{copy.bloques[b.t]}</span>
        {incompleto ? <span className="axr-pub-block__warn">{copy.bIncomplete}</span> : null}
        {!disabled ? (
          <span className="axr-pub-block__tools">
            <button type="button" onClick={() => onMove(-1)} disabled={n === 0} aria-label={copy.bUp} title={copy.bUp}>
              ↑
            </button>
            <button type="button" onClick={() => onMove(1)} disabled={n === total - 1} aria-label={copy.bDown} title={copy.bDown}>
              ↓
            </button>
            <button type="button" onClick={onRemove} aria-label={copy.bRemoveBlock} title={copy.bRemoveBlock}>
              ✕
            </button>
          </span>
        ) : null}
      </div>
      {CAMPOS[b.t].map((c) => (
        <div className="axr-form__row" key={c.k}>
          <label>{etiqueta(c.k)}</label>
          {c.kind === "line" ? (
            <input value={b.f[c.k] ?? ""} onChange={(e) => set(c.k, e.target.value)} disabled={disabled} />
          ) : c.kind === "href" ? (
            <select value={b.f[c.k] ?? ""} onChange={(e) => set(c.k, e.target.value)} disabled={disabled}>
              {Object.entries(DESTINOS).map(([href, d]) => (
                <option key={href} value={href}>
                  {d[locale === "en" ? "en" : "es"]} · {href}
                </option>
              ))}
            </select>
          ) : (
            <textarea
              rows={c.kind === "area" ? 3 : Math.min(8, Math.max(3, (b.f[c.k] ?? "").split("\n").length + 1))}
              value={b.f[c.k] ?? ""}
              onChange={(e) => set(c.k, e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function AnadirBloque({ onAdd, copy }: { onAdd: (t: T) => void; copy: PubCopy }) {
  return (
    <div className="axr-pub-addblock">
      <span>+ {copy.bAddBlock}</span>
      {TIPOS_BLOQUE.map((t) => (
        <button type="button" key={t} onClick={() => onAdd(t)}>
          {copy.bloques[t]}
        </button>
      ))}
    </div>
  );
}

// ── El artículo entero ─────────────────────────────────────

export function EditorBlog({
  form,
  onChange,
  copy,
  locale,
  disabled,
}: {
  form: BlogForm;
  onChange: (f: BlogForm) => void;
  copy: PubCopy;
  locale: string;
  disabled: boolean;
}) {
  const set = <K extends keyof BlogForm>(k: K, v: BlogForm[K]) => onChange({ ...form, [k]: v });
  type Sec = BlogForm["sections"][number];
  const setSec = (i: number, s: Partial<Sec>) => set("sections", form.sections.map((x, j) => (j === i ? { ...x, ...s } : x)));
  const setFaq = (i: number, k: "q" | "a", v: string) => set("faqs", form.faqs.map((f, j) => (j === i ? { ...f, [k]: v } : f)));
  const clusters = blogCopy[locale === "en" ? "en" : "es"].clusters;

  const mover = <X,>(xs: X[], i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= xs.length) return xs;
    const next = [...xs];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  return (
    <div className="axr-form">
      <div className="axr-form__row">
        <label>{copy.bTitle}</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} disabled={disabled} />
        <div className={`axr-pub-count${form.title.length > 65 ? " axr-pub-count--over" : ""}`}>
          {fill(copy.chars, form.title.length)} / 65
        </div>
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{copy.bSlug}</label>
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} disabled={disabled} />
          <small>/blog/{form.slug}</small>
        </div>
        <div className="axr-form__row">
          <label>{copy.bKeyword}</label>
          <input value={form.keyword} onChange={(e) => set("keyword", e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label>{copy.bCluster}</label>
          <select value={form.cluster} onChange={(e) => set("cluster", e.target.value as BlogForm["cluster"])} disabled={disabled}>
            {CLUSTERS.map((c) => (
              <option key={c} value={c}>
                {clusters[c]}
              </option>
            ))}
          </select>
        </div>
        <div className="axr-form__row">
          <label>{copy.bCourse}</label>
          <select value={form.course ?? ""} onChange={(e) => set("course", (e.target.value || null) as Curso | null)} disabled={disabled}>
            <option value="">{copy.bNoCourse}</option>
            {CURSOS.map((c) => (
              <option key={c} value={c}>
                {DESTINOS[`/cursos/${c}`][locale === "en" ? "en" : "es"]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="axr-form__row">
        <label>{copy.bMeta}</label>
        <textarea rows={2} value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} disabled={disabled} />
        <div className={`axr-pub-count${form.metaDescription.length > 155 ? " axr-pub-count--over" : ""}`}>
          {fill(copy.chars, form.metaDescription.length)} / 155
        </div>
      </div>
      <div className="axr-form__row">
        <label>{copy.bIntro}</label>
        <textarea rows={6} value={form.intro} onChange={(e) => set("intro", e.target.value)} disabled={disabled} />
        <small>{copy.bIntroHint}</small>
      </div>

      {form.sections.map((s, i) => (
        <div className="axr-pub-section" key={s.id}>
          <div className="axr-pub-section__head">
            <strong>{fill(copy.bSection, i + 1)}</strong>
            {!disabled ? (
              <span className="axr-pub-block__tools">
                <button type="button" onClick={() => set("sections", mover(form.sections, i, -1))} disabled={i === 0} title={copy.bUp}>
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => set("sections", mover(form.sections, i, 1))}
                  disabled={i === form.sections.length - 1}
                  title={copy.bDown}
                >
                  ↓
                </button>
                <button type="button" onClick={() => set("sections", form.sections.filter((_, j) => j !== i))} title={copy.bRemoveSection}>
                  ✕
                </button>
              </span>
            ) : null}
          </div>
          <div className="axr-form__row">
            <label>{copy.bH2}</label>
            <input value={s.h2} onChange={(e) => setSec(i, { h2: e.target.value })} disabled={disabled} />
          </div>
          <div className="axr-form__row">
            <label>{copy.bAnswer}</label>
            <textarea rows={3} value={s.answer} onChange={(e) => setSec(i, { answer: e.target.value })} disabled={disabled} />
            <div className="axr-pub-count">{fill(copy.words, palabras(s.answer))}</div>
          </div>

          {s.blocks.map((b, j) => (
            <Bloque
              key={b.id}
              b={b}
              n={j}
              total={s.blocks.length}
              course={form.course}
              copy={copy}
              locale={locale}
              disabled={disabled}
              onChange={(nb) => setSec(i, { blocks: s.blocks.map((x) => (x.id === b.id ? nb : x)) })}
              onMove={(d) => setSec(i, { blocks: mover(s.blocks, j, d) })}
              onRemove={() => setSec(i, { blocks: s.blocks.filter((x) => x.id !== b.id) })}
            />
          ))}
          {!disabled ? <AnadirBloque copy={copy} onAdd={(t) => setSec(i, { blocks: [...s.blocks, vacio(t, locale)] })} /> : null}

          <div className="axr-form__row">
            <label>{copy.bTakeaway}</label>
            <input value={s.takeaway} onChange={(e) => setSec(i, { takeaway: e.target.value })} disabled={disabled} />
          </div>
        </div>
      ))}
      {!disabled ? (
        <div>
          <button
            type="button"
            className="axr-btn axr-btn--ghost"
            onClick={() => set("sections", [...form.sections, { id: nuevoId(), h2: "", answer: "", takeaway: "", blocks: [vacio("p", locale)] }])}
          >
            + {copy.bAddSection}
          </button>
        </div>
      ) : null}

      <div className="axr-pub-variant__sub">{copy.bFaqs}</div>
      {form.faqs.map((f, i) => (
        <div className="axr-pub-section" key={i}>
          <div className="axr-pub-section__head">
            <strong>{fill(copy.bFaqN, i + 1)}</strong>
            {!disabled ? (
              <span className="axr-pub-block__tools">
                <button type="button" onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))} title={copy.bRemoveBlock}>
                  ✕
                </button>
              </span>
            ) : null}
          </div>
          <div className="axr-form__row">
            <label>{copy.bQ}</label>
            <input value={f.q} onChange={(e) => setFaq(i, "q", e.target.value)} disabled={disabled} />
          </div>
          <div className="axr-form__row">
            <label>{copy.bA}</label>
            <textarea rows={3} value={f.a} onChange={(e) => setFaq(i, "a", e.target.value)} disabled={disabled} />
          </div>
        </div>
      ))}
      {!disabled ? (
        <div>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => set("faqs", [...form.faqs, { q: "", a: "" }])}>
            + {copy.bAddFaq}
          </button>
        </div>
      ) : null}

      <div className="axr-form__row">
        <label>{copy.bExternal}</label>
        <textarea rows={3} value={form.external} onChange={(e) => set("external", e.target.value)} disabled={disabled} />
        <small>{copy.bExternalHint}</small>
      </div>
    </div>
  );
}
