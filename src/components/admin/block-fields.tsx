"use client";

import type { Block, BlockType, NoteKind } from "@/lib/content/blocks";
import type { editorCopy } from "@/lib/i18n/editor";

type Copy = (typeof editorCopy)["es"];

// ══════════════════════════════════════════════════════════
//  Los campos de cada tipo de bloque
//
//  Separado del editor porque es la mitad larga y aburrida: un formulario
//  por tipo. Aquí no hay estado propio —todo sube al editor con `onChange`—,
//  así que el orden de los bloques, el guardado y el deshacer viven en un
//  único sitio.
//
//  Regla de la pantalla: un campo dice QUÉ es, no cómo se llama por dentro.
//  El profesor no tiene por qué saber que un cuadro es un `note` con
//  `kind: "aviso"`.
// ══════════════════════════════════════════════════════════

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="axr-blked__field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

/**
 * Lista de líneas de texto: los puntos de una lista, de una checklist…
 *
 * Enter al final de una línea crea la siguiente: escribir seis puntos sin
 * soltar el teclado es lo que separa un editor cómodo de uno que se usa una
 * vez y se abandona.
 */
function ItemsEditor({
  items,
  onChange,
  copy,
  label,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  copy: Copy;
  label: string;
}) {
  return (
    <div className="axr-blked__items">
      <span className="axr-blked__items-label">{label}</span>
      {items.map((it, i) => (
        <div key={i} className="axr-blked__item">
          <input
            value={it}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const next = [...items];
                next.splice(i + 1, 0, "");
                onChange(next);
                // El foco al recién creado, que es donde está escribiendo.
                queueMicrotask(() => {
                  const padre = (e.target as HTMLElement).closest(".axr-blked__items");
                  const inputs = padre?.querySelectorAll("input");
                  (inputs?.[i + 1] as HTMLInputElement | undefined)?.focus();
                });
              }
              // Retroceso en una línea vacía la borra, como en cualquier lista.
              if (e.key === "Backspace" && it === "" && items.length > 1) {
                e.preventDefault();
                onChange(items.filter((_, j) => j !== i));
              }
            }}
          />
          <button
            type="button"
            className="axr-blked__mini"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label={copy.fRemoveItem}
            disabled={items.length === 1}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="axr-blked__mini axr-blked__mini--add" onClick={() => onChange([...items, ""])}>
        + {copy.fAddItem}
      </button>
    </div>
  );
}

export function BlockFields({
  block,
  onChange,
  copy,
}: {
  block: Block;
  onChange: (b: Block) => void;
  copy: Copy;
}) {
  // Atajo: cambia unas cuantas claves del bloque sin perder el resto.
  const set = (patch: Record<string, unknown>) => onChange({ ...block, ...patch } as Block);

  switch (block.t) {
    case "h":
      return (
        <>
          <Row label={copy.fText}>
            <input value={block.text} onChange={(e) => set({ text: e.target.value })} autoFocus={!block.text} />
          </Row>
          <Row label={copy.fLevel}>
            <select value={block.level} onChange={(e) => set({ level: Number(e.target.value) === 3 ? 3 : 2 })}>
              <option value={2}>{copy.fLevel2}</option>
              <option value={3}>{copy.fLevel3}</option>
            </select>
          </Row>
        </>
      );

    case "p":
      return (
        <Row label={copy.fText}>
          <textarea rows={4} value={block.text} onChange={(e) => set({ text: e.target.value })} autoFocus={!block.text} />
        </Row>
      );

    case "ul":
    case "ol":
      return <ItemsEditor items={block.items} onChange={(items) => set({ items })} copy={copy} label={copy.fItems} />;

    case "checklist":
      return (
        <>
          <Row label={copy.fTitle}>
            <input value={block.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </Row>
          <ItemsEditor items={block.items} onChange={(items) => set({ items })} copy={copy} label={copy.fItems} />
        </>
      );

    case "checkpoint":
      return (
        <>
          <Row label={copy.fTitle}>
            <input value={block.title} onChange={(e) => set({ title: e.target.value })} />
          </Row>
          <ItemsEditor items={block.items} onChange={(items) => set({ items })} copy={copy} label={copy.fItems} />
        </>
      );

    case "note":
      return (
        <>
          <Row label={copy.fKind}>
            <select value={block.kind} onChange={(e) => set({ kind: e.target.value as NoteKind })}>
              {(Object.keys(copy.noteKinds) as NoteKind[]).map((k) => (
                <option key={k} value={k}>
                  {copy.noteKinds[k]}
                </option>
              ))}
            </select>
          </Row>
          <Row label={copy.fTitle}>
            <input value={block.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </Row>
          <Row label={copy.fText}>
            <textarea rows={3} value={block.text} onChange={(e) => set({ text: e.target.value })} />
          </Row>
        </>
      );

    case "quote":
      return (
        <>
          <Row label={copy.fText}>
            <textarea rows={3} value={block.text} onChange={(e) => set({ text: e.target.value })} />
          </Row>
          <Row label={copy.fAuthor}>
            <input value={block.by ?? ""} onChange={(e) => set({ by: e.target.value })} />
          </Row>
        </>
      );

    case "table": {
      const cols = block.head.length;
      const setCelda = (fila: number, col: number, v: string) =>
        set({ rows: block.rows.map((f, i) => (i === fila ? f.map((c, j) => (j === col ? v : c)) : f)) });

      return (
        <>
          <div className="axr-blked__table">
            <span className="axr-blked__items-label">{copy.fHead}</span>
            <div className="axr-blked__table-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(90px, 1fr)) auto` }}>
              {block.head.map((h, j) => (
                <input
                  key={`h${j}`}
                  value={h}
                  placeholder={`${copy.fHead} ${j + 1}`}
                  onChange={(e) => set({ head: block.head.map((x, k) => (k === j ? e.target.value : x)) })}
                />
              ))}
              <button
                type="button"
                className="axr-blked__mini"
                onClick={() =>
                  // Una columna nueva se añade a la cabecera Y a todas las
                  // filas: si sólo se añadiera arriba, la tabla quedaría
                  // descuadrada y el validador tiraría la fila entera.
                  set({ head: [...block.head, ""], rows: block.rows.map((f) => [...f, ""]) })
                }
                aria-label={copy.fAddCol}
                title={copy.fAddCol}
              >
                +
              </button>

              {block.rows.map((fila, i) => (
                <FilaTabla
                  key={`r${i}`}
                  fila={fila}
                  onCell={(j, v) => setCelda(i, j, v)}
                  onRemove={() => set({ rows: block.rows.filter((_, k) => k !== i) })}
                  removable={block.rows.length > 1}
                  label={copy.fRemoveRow}
                />
              ))}
            </div>
            <div className="axr-blked__table-actions">
              <button
                type="button"
                className="axr-blked__mini axr-blked__mini--add"
                onClick={() => set({ rows: [...block.rows, Array.from({ length: cols }, () => "")] })}
              >
                + {copy.fAddRow}
              </button>
              {cols > 1 ? (
                <button
                  type="button"
                  className="axr-blked__mini"
                  onClick={() => set({ head: block.head.slice(0, -1), rows: block.rows.map((f) => f.slice(0, -1)) })}
                >
                  − {copy.fRemoveCol}
                </button>
              ) : null}
            </div>
          </div>
          <Row label={copy.fCaption}>
            <input value={block.caption ?? ""} onChange={(e) => set({ caption: e.target.value })} />
          </Row>
        </>
      );
    }

    case "steps":
      return (
        <div className="axr-blked__items">
          <span className="axr-blked__items-label">{copy.fItems}</span>
          {block.items.map((s, i) => (
            <div key={i} className="axr-blked__sub">
              <div className="axr-blked__sub-head">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="axr-blked__mini"
                  onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}
                  disabled={block.items.length === 1}
                  aria-label={copy.fRemoveItem}
                >
                  ✕
                </button>
              </div>
              <input
                placeholder={copy.fStepTitle}
                value={s.title}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
              />
              <textarea
                rows={2}
                placeholder={copy.fStepText}
                value={s.text}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
              />
            </div>
          ))}
          <button
            type="button"
            className="axr-blked__mini axr-blked__mini--add"
            onClick={() => set({ items: [...block.items, { title: "", text: "" }] })}
          >
            + {copy.fAddItem}
          </button>
        </div>
      );

    case "pros":
      return (
        <>
          <Row label={copy.fTitle}>
            <input value={block.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </Row>
          <div className="axr-blked__cols">
            <ItemsEditor items={block.pros} onChange={(pros) => set({ pros })} copy={copy} label={copy.fPros} />
            <ItemsEditor items={block.cons} onChange={(cons) => set({ cons })} copy={copy} label={copy.fCons} />
          </div>
        </>
      );

    case "compare":
      return (
        <div className="axr-blked__cols">
          {(["left", "right"] as const).map((lado) => (
            <div key={lado}>
              <Row label={lado === "left" ? copy.fLeft : copy.fRight}>
                <input
                  value={block[lado].title}
                  onChange={(e) => set({ [lado]: { ...block[lado], title: e.target.value } })}
                />
              </Row>
              <ItemsEditor
                items={block[lado].items}
                onChange={(items) => set({ [lado]: { ...block[lado], items } })}
                copy={copy}
                label={copy.fItems}
              />
            </div>
          ))}
        </div>
      );

    case "stats":
      return (
        <div className="axr-blked__items">
          <span className="axr-blked__items-label">{copy.fItems}</span>
          {block.items.map((s, i) => (
            <div key={i} className="axr-blked__sub">
              <div className="axr-blked__sub-head">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="axr-blked__mini"
                  onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}
                  disabled={block.items.length === 1}
                  aria-label={copy.fRemoveItem}
                >
                  ✕
                </button>
              </div>
              <input
                placeholder={copy.fValue}
                value={s.value}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })}
              />
              <input
                placeholder={copy.fLabel}
                value={s.label}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
              />
              <input
                placeholder={copy.fNote}
                value={s.note ?? ""}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)) })}
              />
            </div>
          ))}
          {block.items.length < 4 ? (
            <button
              type="button"
              className="axr-blked__mini axr-blked__mini--add"
              onClick={() => set({ items: [...block.items, { value: "", label: "" }] })}
            >
              + {copy.fAddItem}
            </button>
          ) : null}
        </div>
      );

    case "chart":
      return (
        <>
          <div className="axr-blked__cols">
            <Row label={copy.fChartKind}>
              <select value={block.kind} onChange={(e) => set({ kind: e.target.value })}>
                <option value="bar">{copy.fBar}</option>
                <option value="line">{copy.fLine}</option>
                <option value="pie">{copy.fPie}</option>
              </select>
            </Row>
            <Row label={copy.fUnit}>
              <input value={block.unit ?? ""} onChange={(e) => set({ unit: e.target.value })} placeholder="€, %, h" />
            </Row>
          </div>
          <Row label={copy.fTitle}>
            <input value={block.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </Row>
          <div className="axr-blked__items">
            <span className="axr-blked__items-label">{copy.fSeries}</span>
            {block.series.map((s, i) => (
              <div key={i} className="axr-blked__item">
                <input
                  placeholder={copy.fLabel}
                  value={s.label}
                  onChange={(e) => set({ series: block.series.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })}
                />
                <input
                  type="number"
                  step="any"
                  placeholder={copy.fValue}
                  value={Number.isFinite(s.value) ? s.value : ""}
                  onChange={(e) =>
                    set({ series: block.series.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)) })
                  }
                  style={{ maxWidth: "7rem" }}
                />
                <button
                  type="button"
                  className="axr-blked__mini"
                  onClick={() => set({ series: block.series.filter((_, j) => j !== i) })}
                  disabled={block.series.length <= 2}
                  aria-label={copy.fRemoveItem}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              className="axr-blked__mini axr-blked__mini--add"
              onClick={() => set({ series: [...block.series, { label: "", value: 0 }] })}
            >
              + {copy.fAddItem}
            </button>
          </div>
          <Row label={copy.fSource} hint="Un gráfico sin fuente es un adorno.">
            <input value={block.source ?? ""} onChange={(e) => set({ source: e.target.value })} />
          </Row>
        </>
      );

    case "timeline":
      return (
        <div className="axr-blked__items">
          <span className="axr-blked__items-label">{copy.fItems}</span>
          {block.items.map((it, i) => (
            <div key={i} className="axr-blked__sub">
              <div className="axr-blked__sub-head">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="axr-blked__mini"
                  onClick={() => set({ items: block.items.filter((_, j) => j !== i) })}
                  disabled={block.items.length === 1}
                  aria-label={copy.fRemoveItem}
                >
                  ✕
                </button>
              </div>
              <input
                placeholder={copy.fWhen}
                value={it.when}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, when: e.target.value } : x)) })}
              />
              <input
                placeholder={copy.fTitle}
                value={it.title}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
              />
              <textarea
                rows={2}
                placeholder={copy.fText}
                value={it.text ?? ""}
                onChange={(e) => set({ items: block.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
              />
            </div>
          ))}
          <button
            type="button"
            className="axr-blked__mini axr-blked__mini--add"
            onClick={() => set({ items: [...block.items, { when: "", title: "", text: "" }] })}
          >
            + {copy.fAddItem}
          </button>
        </div>
      );

    case "divider":
      return null;
  }
}

function FilaTabla({
  fila,
  onCell,
  onRemove,
  removable,
  label,
}: {
  fila: string[];
  onCell: (col: number, v: string) => void;
  onRemove: () => void;
  removable: boolean;
  label: string;
}) {
  return (
    <>
      {fila.map((c, j) => (
        <input key={j} value={c} onChange={(e) => onCell(j, e.target.value)} />
      ))}
      <button type="button" className="axr-blked__mini" onClick={onRemove} disabled={!removable} aria-label={label}>
        ✕
      </button>
    </>
  );
}

/** Una línea que resume el bloque, para leer la lista con los bloques cerrados. */
export function blockSummary(b: Block): string {
  switch (b.t) {
    case "h": return b.text;
    case "p": return b.text.slice(0, 120);
    case "ul":
    case "ol":
    case "checklist": return b.items.filter(Boolean).slice(0, 3).join(" · ");
    case "checkpoint": return b.title;
    case "note": return b.title || b.text.slice(0, 120);
    case "quote": return b.text.slice(0, 120);
    case "table": return b.head.filter(Boolean).join(" · ");
    case "steps": return b.items.map((s) => s.title).filter(Boolean).slice(0, 3).join(" · ");
    case "pros": return b.title || `${b.pros.length} / ${b.cons.length}`;
    case "compare": return `${b.left.title} / ${b.right.title}`;
    case "stats": return b.items.map((s) => s.value).filter(Boolean).join(" · ");
    case "chart": return b.title || b.series.map((s) => s.label).filter(Boolean).join(" · ");
    case "timeline": return b.items.map((i) => i.title).filter(Boolean).slice(0, 3).join(" · ");
    case "divider": return "———";
  }
}

export type { BlockType };
