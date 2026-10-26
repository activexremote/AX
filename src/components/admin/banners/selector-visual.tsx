"use client";

import { useMemo, useState, useTransition } from "react";

import { idearImagenesAccion } from "@/app/admin/banners/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { FAMILIAS, LINEAS, lineaDe, muestraDe, type Familia, type Ref } from "@/lib/banners/direcciones";
import type { Angulo } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";

// ══════════════════════════════════════════════════════════
//  Elegir la imagen antes de pagarla
//
//  Dos fuentes de referencias, que se mezclan en una sola selección:
//   · la biblioteca: 32 líneas visuales con un ejemplo pintado cada una;
//   · «Ideas con IA»: 12 conceptos escritos para esta campaña, cada uno
//     apoyado en una línea (que pone el acabado).
//
//  Debajo, cómo queda el reparto: qué ángulo y qué referencia lleva cada
//  variante. Las referencias se reparten por turnos.
// ══════════════════════════════════════════════════════════

const clave = (r: Ref) => `${r.dir}|${r.titulo ?? ""}`;

export function SelectorVisual({
  copy,
  locale,
  value,
  onChange,
  brief,
  onBrief,
  max,
  total,
  contexto,
}: {
  copy: BanCopy;
  locale: string;
  value: Ref[];
  onChange: (v: Ref[]) => void;
  brief: string;
  onBrief: (v: string) => void;
  max: number;
  /** Cuántas variantes se van a crear. */
  total: number;
  contexto: { course: string; objective: string; angles: Angulo[] };
}) {
  const lang = locale === "en" ? "en" : "es";
  const [tab, setTab] = useState<"lib" | "ideas">("lib");
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [ideas, setIdeas] = useState<Ref[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pensando, startIdeas] = useTransition();

  const elegidas = useMemo(() => new Map(value.map((r, i) => [clave(r), i])), [value]);
  const lleno = value.length >= max;

  const alternar = (r: Ref) => {
    const k = clave(r);
    if (elegidas.has(k)) onChange(value.filter((x) => clave(x) !== k));
    else if (!lleno) onChange([...value, r]);
  };

  const sorprender = () => {
    // Tantas como variantes haya (mínimo 3), de familias distintas.
    const n = Math.min(max, Math.max(3, total));
    const mezcladas = LINEAS.slice().sort(() => Math.random() - 0.5);
    const out: Ref[] = [];
    for (const l of mezcladas) {
      if (out.length >= n) break;
      if (out.length < FAMILIAS.length && out.some((o) => lineaDe(o.dir)?.familia === l.familia)) continue;
      out.push({ dir: l.id });
    }
    onChange(out);
  };

  const pedirIdeas = () => {
    setError(null);
    startIdeas(async () => {
      const r = await idearImagenesAccion({
        course: contexto.course,
        objective: contexto.objective,
        angles: contexto.angles,
        imageBrief: brief,
        evitar: ideas.map((i) => i.titulo ?? ""),
      });
      if (r.ideas.length) setIdeas(r.ideas);
      if (r.error) setError(r.error);
    });
  };

  const visibles = familia ? LINEAS.filter((l) => l.familia === familia) : LINEAS;

  return (
    <div className="axr-ban-vis">
      <div className="axr-ban-vis__bar">
        <div className="axr-pv-switch" role="tablist">
          <button type="button" role="tab" aria-pressed={tab === "lib"} onClick={() => setTab("lib")}>
            <Icono n="imagen" size={14} /> {copy.visLibrary} · {LINEAS.length}
          </button>
          <button type="button" role="tab" aria-pressed={tab === "ideas"} onClick={() => setTab("ideas")}>
            <Icono n="chispa" size={14} /> {copy.visIdeas}
            {ideas.length ? ` · ${ideas.length}` : ""}
          </button>
        </div>
        <div className="axr-ban-vis__acts">
          <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={sorprender}>
            <Icono n="chispa" size={14} /> {copy.visSurprise}
          </button>
          {value.length ? (
            <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => onChange([])}>
              {copy.visClear}
            </button>
          ) : null}
        </div>
      </div>

      {tab === "lib" ? (
        <>
          <div className="axr-ban-vis__fams" role="group">
            <button type="button" aria-pressed={familia === null} onClick={() => setFamilia(null)}>
              {copy.visAll}
            </button>
            {FAMILIAS.map((f) => (
              <button key={f} type="button" aria-pressed={familia === f} onClick={() => setFamilia(f)}>
                {copy.family[f]}
              </button>
            ))}
          </div>
          <div className="axr-ban-vis__grid">
            {visibles.map((l) => {
              const r = { dir: l.id };
              const i = elegidas.get(clave(r));
              const on = i !== undefined;
              return (
                <button
                  key={l.id}
                  type="button"
                  className={`axr-ban-vis__card${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  disabled={!on && lleno}
                  onClick={() => alternar(r)}
                >
                  <span className="axr-ban-vis__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={muestraDe(l.id)} alt="" loading="lazy" />
                    {on ? <span className="axr-ban-vis__n">{i + 1}</span> : null}
                  </span>
                  <strong>{l.nombre[lang]}</strong>
                  <small>{l.desc[lang]}</small>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="axr-ban-vis__ideas">
          <p className="axr-ban-vis__lead">{copy.visIdeasLead}</p>
          <button type="button" className="axr-btn axr-btn--small" onClick={pedirIdeas} disabled={pensando}>
            <Icono n="chispa" size={14} /> {pensando ? copy.visIdeasWorking : ideas.length ? copy.visIdeasMore : copy.visIdeasGo}
          </button>
          {error ? <div className="axr-login__error">{error}</div> : null}
          {ideas.length ? (
            <div className="axr-ban-vis__ideagrid" aria-busy={pensando}>
              {ideas.map((r) => {
                const l = lineaDe(r.dir)!;
                const i = elegidas.get(clave(r));
                const on = i !== undefined;
                return (
                  <button
                    key={clave(r)}
                    type="button"
                    className={`axr-ban-vis__idea${on ? " is-on" : ""}`}
                    aria-pressed={on}
                    disabled={!on && lleno}
                    onClick={() => alternar(r)}
                  >
                    <span className="axr-ban-vis__img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={muestraDe(l.id)} alt="" loading="lazy" />
                      {on ? <span className="axr-ban-vis__n">{i + 1}</span> : null}
                    </span>
                    <span>
                      <strong>{r.titulo}</strong>
                      <small>{r.idea}</small>
                      <em className="axr-adm-pill">{l.nombre[lang]}</em>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      )}

      <div className="axr-ban-vis__plan">
        <div className="axr-ban-vis__plan-head">
          <strong>{value.length ? fill(copy.visPlan, total) : copy.visAuto}</strong>
          <span className="axr-adm-pill">{lleno ? fill(copy.visMax, max) : fill(copy.visPicked, value.length)}</span>
        </div>
        {value.length && contexto.angles.length ? (
          <ol>
            {Array.from({ length: total }, (_, i) => {
              const r = value[i % value.length];
              const l = lineaDe(r.dir)!;
              const a = contexto.angles[i % contexto.angles.length];
              return (
                <li key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={muestraDe(l.id)} alt="" />
                  <span>
                    <small>{fill(copy.visPlanRow, i + 1)} · {copy.angle[a]}</small>
                    <strong>{r.titulo ?? l.nombre[lang]}</strong>
                  </span>
                  {i < value.length ? (
                    <button type="button" aria-label={copy.visClear} onClick={() => alternar(r)}>
                      <Icono n="cerrar" size={14} />
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

      <div className="axr-form__row axr-ban-vis__brief">
        <label htmlFor="image_brief">{copy.visBrief}</label>
        <textarea id="image_brief" name="image_brief" rows={2} maxLength={1000} value={brief} onChange={(e) => onBrief(e.target.value)} placeholder={copy.visBriefPh} />
      </div>
    </div>
  );
}

/** En el editor de una variante: la línea con la que se pinta la próxima imagen. */
export function ElegirLinea({ copy, locale, value, onChange }: { copy: BanCopy; locale: string; value: string; onChange: (dir: string) => void }) {
  const lang = locale === "en" ? "en" : "es";
  // Con 100 líneas, se abre en la familia de la actual.
  const [familia, setFamilia] = useState<Familia | null>(lineaDe(value)?.familia ?? null);
  const visibles = familia ? LINEAS.filter((l) => l.familia === familia) : LINEAS;
  return (
    <>
      <div className="axr-ban-vis__fams" role="group">
        <button type="button" aria-pressed={familia === null} onClick={() => setFamilia(null)}>
          {copy.visAll}
        </button>
        {FAMILIAS.map((f) => (
          <button key={f} type="button" aria-pressed={familia === f} onClick={() => setFamilia(f)}>
            {copy.family[f]}
          </button>
        ))}
      </div>
      <div className="axr-ban-vis__strip" role="radiogroup" aria-label={copy.visLine}>
        {visibles.map((l) => (
          <button key={l.id} type="button" role="radio" aria-checked={value === l.id} className={value === l.id ? "is-on" : undefined} onClick={() => onChange(l.id)} title={l.desc[lang]}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={muestraDe(l.id)} alt="" loading="lazy" />
            <span>{l.nombre[lang]}</span>
          </button>
        ))}
      </div>
    </>
  );
}
