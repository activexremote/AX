"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { crearCampana } from "@/app/admin/banners/actions";
import { SelectorVisual } from "@/components/admin/banners/selector-visual";
import { Icono } from "@/components/admin/publicaciones/iconos";
import type { Ref } from "@/lib/banners/direcciones";
import { estimar, type Calidad } from "@/lib/banners/costes";
import { ANGULOS, CURSOS, OBJETIVOS, PLANTILLAS, usaImagen, type Angulo, type Plantilla } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import { formatoUsd } from "@/lib/social/costes";
import type { AdCourse, AdObjective } from "@/lib/supabase/types";

const IMAGE_MODEL = "gpt-image-2";
const MAX_VARIANTES = 6;

function Espera({ copy, conFoto }: { copy: BanCopy; conFoto: boolean }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  // Segundo en el que aparece cada paso. Sin foto, no hay paso de pintar.
  const pasos = copy.waitSteps
    .map((label, i) => [[0, 3, 12, 18, 45][i], label] as const)
    .filter((_, i) => conFoto || i !== 3);
  const actual = pasos.reduce((i, [t], j) => (s >= t ? j : i), 0);
  return (
    <div className="axr-pubwait" role="status" aria-live="polite">
      <div className="axr-pubwait__card">
        <span className="axr-pubwait__spark">
          <Icono n="chispa" size={26} />
        </span>
        <strong>{copy.waitTitle}</strong>
        <ol>
          {pasos.map(([, label], j) => (
            <li key={label} className={j < actual ? "is-done" : j === actual ? "is-now" : ""}>
              <span>{j < actual ? <Icono n="ok" size={14} /> : null}</span>
              {label}
            </li>
          ))}
        </ol>
        <small>{fill(copy.waitSeconds, s)}</small>
      </div>
    </div>
  );
}

/** Muestra de cómo se ve cada plantilla, en pequeño y sin imagen real. */
function MuestraPlantilla({ p }: { p: Plantilla }) {
  return (
    <span className={`axr-ban-swatch axr-ban-swatch--${p}`} aria-hidden>
      <i />
      <b />
      <em />
    </span>
  );
}

export function NuevaCampana({ copy, locale, textModel }: { copy: BanCopy; locale: string; textModel: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<AdCourse>("remote-professional");
  const [objective, setObjective] = useState<AdObjective>("leads");
  const [angles, setAngles] = useState<Angulo[]>(["obstaculo", "metodo", "directo"]);
  const [style, setStyle] = useState<Plantilla>("foto");
  const [idioma, setIdioma] = useState<"es" | "en" | "ambos">(locale === "en" ? "en" : "es");
  const [calidad, setCalidad] = useState<Calidad>("medium");
  const [refs, setRefs] = useState<Ref[]>([]);
  const [imageBrief, setImageBrief] = useState("");

  const conFoto = usaImagen(style);
  // Con referencias de imagen, una variante por referencia si hay más que ángulos.
  const variantes = angles.length ? (conFoto ? Math.min(MAX_VARIANTES, Math.max(angles.length, refs.length)) : angles.length) : 0;
  const coste = estimar(textModel, IMAGE_MODEL, variantes, conFoto, calidad);
  const segundos = conFoto ? 45 + (calidad === "high" ? 30 : 0) : 15;

  const alternar = (a: Angulo) =>
    setAngles((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : ANGULOS.filter((x) => x === a || prev.includes(x))));

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await crearCampana(formData);
      if (r.id) router.push(`/admin/banners/${r.id}${r.error ? `?aviso=${encodeURIComponent(r.error)}` : ""}`);
      else setError(r.error ?? "Error");
    });
  }

  return (
    <form action={handle} className="axr-pubnew axr-bannew">
      {pending ? <Espera copy={copy} conFoto={conFoto} /> : null}
      {error ? <div className="axr-login__error">{error}</div> : null}

      <section className="axr-pubcard axr-pubnew__card">
        {/* ── Qué ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">1</span> {copy.qCourse}
        </div>
        <div className="axr-ban-choices" role="radiogroup" aria-label={copy.qCourse}>
          {CURSOS.map((c) => (
            <label key={c} className={`axr-ban-choice axr-ban-choice--${c}${course === c ? " is-on" : ""}`}>
              <input type="radio" name="course" value={c} checked={course === c} onChange={() => setCourse(c)} />
              <strong>{copy.course[c]}</strong>
              <small>{copy.courseHint[c]}</small>
            </label>
          ))}
        </div>

        {/* ── Para qué ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">2</span> {copy.qObjective}
        </div>
        <div className="axr-ban-choices" role="radiogroup" aria-label={copy.qObjective}>
          {OBJETIVOS.map((o) => (
            <label key={o} className={`axr-ban-choice${objective === o ? " is-on" : ""}`}>
              <input type="radio" name="objective" value={o} checked={objective === o} onChange={() => setObjective(o)} />
              <strong>{copy.objective[o]}</strong>
              <small>{copy.objectiveHint[o]}</small>
            </label>
          ))}
        </div>

        {/* ── Ángulos ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">3</span> {copy.qAngles}
        </div>
        <small className="axr-pubnew__hint">{copy.qAnglesHint}</small>
        <div className="axr-ban-choices axr-ban-choices--angles" role="group" aria-label={copy.qAngles}>
          {ANGULOS.map((a) => (
            <label key={a} className={`axr-ban-choice axr-ban-choice--check${angles.includes(a) ? " is-on" : ""}`}>
              <input type="checkbox" name="angles" value={a} checked={angles.includes(a)} onChange={() => alternar(a)} />
              <span className="axr-pubnew__check">{angles.includes(a) ? <Icono n="ok" size={12} /> : null}</span>
              <strong>{copy.angle[a]}</strong>
              <small>{copy.angleHint[a]}</small>
            </label>
          ))}
        </div>

        {/* ── Cómo se ve ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">4</span> {copy.qLook}
        </div>
        <div className="axr-pubnew__where">
          <div className="axr-ban-choices" role="radiogroup" aria-label={copy.qLook}>
            {PLANTILLAS.map((p) => (
              <label key={p} className={`axr-ban-choice axr-ban-choice--look${style === p ? " is-on" : ""}`}>
                <input type="radio" name="style" value={p} checked={style === p} onChange={() => setStyle(p)} />
                <MuestraPlantilla p={p} />
                <strong>{copy.template[p]}</strong>
                <small>{copy.templateHint[p]}</small>
              </label>
            ))}
          </div>
          <div className="axr-pv-switch axr-pubnew__lang" role="group" aria-label={copy.qLanguage}>
            <input type="hidden" name="language" value={idioma} />
            {(["es", "en", "ambos"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={idioma === l} onClick={() => setIdioma(l)} title={l === "ambos" ? copy.bothLangsHint : undefined}>
                {l === "es" ? "Español" : l === "en" ? "English" : `${copy.bothLangs} · ES + EN`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Qué imagen ── */}
        {conFoto ? (
          <>
            <div className="axr-pubnew__q">
              <span className="axr-pubnew__n">5</span> {copy.qImage}
            </div>
            <small className="axr-pubnew__hint">{copy.qImageHint}</small>
            <input type="hidden" name="visual" value={JSON.stringify(refs)} />
            <SelectorVisual
              copy={copy}
              locale={locale}
              value={refs}
              onChange={setRefs}
              brief={imageBrief}
              onBrief={setImageBrief}
              max={MAX_VARIANTES}
              contexto={{ course, objective, angles }}
            />
          </>
        ) : null}

        {/* ── Opcional ── */}
        <details className="axr-pubnew__more">
          <summary>
            <Icono n="info" /> {copy.more}
          </summary>
          <div className="axr-form">
            <div className="axr-form__row">
              <label htmlFor="audience">{copy.fAudience}</label>
              <textarea id="audience" name="audience" rows={2} maxLength={1000} placeholder={copy.fAudiencePh} />
            </div>
            <div className="axr-form__row">
              <label htmlFor="notes">{copy.fNotes}</label>
              <textarea id="notes" name="notes" rows={3} maxLength={2000} placeholder={copy.fNotesPh} />
            </div>
            {conFoto ? (
              <div className="axr-form__row">
                <label>{copy.fQuality}</label>
                <div className="axr-pv-switch" role="group" aria-label={copy.fQuality}>
                  <input type="hidden" name="quality" value={calidad} />
                  {(["low", "medium", "high"] as const).map((q) => (
                    <button key={q} type="button" aria-pressed={calidad === q} onClick={() => setCalidad(q)}>
                      {copy.quality[q]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <input type="hidden" name="quality" value={calidad} />
            )}
            <div className="axr-form__row">
              <label htmlFor="name">{copy.fName}</label>
              <input id="name" name="name" maxLength={120} />
              <small>{copy.fNameHint}</small>
            </div>
          </div>
        </details>
      </section>

      <div className="axr-pubnew__bar">
        <div className="axr-pubnew__est">
          <strong>{fill(copy.estimate, formatoUsd(coste, locale))}</strong>
          <span>{fill(copy.estimateTime, segundos)}</span>
        </div>
        {!angles.length ? <span className="axr-pubnew__missing">{copy.needAngle}</span> : null}
        <button type="submit" className="axr-btn axr-pubnew__go" disabled={pending || !angles.length}>
          <Icono n="chispa" /> {pending ? copy.generating : copy.generate}
        </button>
      </div>
    </form>
  );
}
