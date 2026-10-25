"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { clonarBanner } from "@/app/admin/banners/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { costeUsd, TOKENS_IMAGEN, type Calidad } from "@/lib/banners/costes";
import { CURSOS, PLANTILLAS, type Plantilla } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import { formatoUsd } from "@/lib/social/costes";
import type { AdCourse } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Clonador: se suelta un banner y salen hasta 5 nuestros
//
//  La imagen viaja con el formulario (acción de servidor, límite de 14 MB en
//  next.config.ts). Se valida aquí lo mismo que en el servidor para no
//  esperar a la subida para enterarse de que pesa demasiado.
// ══════════════════════════════════════════════════════════

const TIPOS = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 8 * 1024 * 1024;

function Espera({ copy, conFoto }: { copy: BanCopy; conFoto: boolean }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const pasos = copy.cloneWaitSteps
    .map((label, i) => [[0, 3, 10, 22, 28][i], label] as const)
    .filter((_, i) => conFoto || i !== 4);
  const actual = pasos.reduce((i, [t], j) => (s >= t ? j : i), 0);
  return (
    <div className="axr-pubwait" role="status" aria-live="polite">
      <div className="axr-pubwait__card">
        <span className="axr-pubwait__spark">
          <Icono n="chispa" size={26} />
        </span>
        <strong>{copy.cloneWaitTitle}</strong>
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

export function Clonador({ copy, locale, textModel }: { copy: BanCopy; locale: string; textModel: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [encima, setEncima] = useState(false);
  const [count, setCount] = useState(3);
  const [course, setCourse] = useState<AdCourse>("remote-professional");
  const [style, setStyle] = useState<Plantilla | "auto">("auto");
  const [idioma, setIdioma] = useState<"es" | "en" | "ambos">(locale === "en" ? "en" : "es");
  const [calidad, setCalidad] = useState<Calidad>("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function elegir(f: File | undefined | null) {
    setError(null);
    if (!f) return;
    if (!TIPOS.includes(f.type)) return setError("La imagen tiene que ser JPG, PNG o WebP.");
    if (f.size > MAX_BYTES) return setError("La imagen pesa más de 8 MB.");
    setFile(f);
  }

  // Pegar una captura con Cmd+V también vale: es lo más rápido desde la
  // biblioteca de anuncios de Meta.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
      const f = item?.getAsFile();
      if (f) elegir(new File([f], `captura.${f.type.split("/")[1] ?? "png"}`, { type: f.type }));
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const conFoto = style === "auto" || style !== "marca";
  // Lectura de la imagen (~1.100 tokens en detalle alto) + texto, y una foto por banner.
  const coste = costeUsd(textModel, 4_800, 500 * count + 600) + (conFoto ? count * costeUsd("gpt-image-2", 350, TOKENS_IMAGEN[calidad]) : 0);

  function handle(formData: FormData) {
    if (!file) return setError(copy.cloneNeedImage);
    formData.set("reference", file);
    setError(null);
    startTransition(async () => {
      const r = await clonarBanner(formData);
      if (r.id) router.push(`/admin/banners/${r.id}${r.error ? `?aviso=${encodeURIComponent(r.error)}` : ""}`);
      else setError(r.error ?? "Error");
    });
  }

  return (
    <form action={handle} className="axr-pubnew axr-banclone">
      {pending ? <Espera copy={copy} conFoto={conFoto} /> : null}
      {error ? <div className="axr-login__error">{error}</div> : null}

      <section className="axr-pubcard axr-pubnew__card">
        <div className="axr-banclone__top">
          {/* ── La referencia ── */}
          <div
            className={`axr-ban-drop${encima ? " is-over" : ""}${preview ? " has-file" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setEncima(true);
            }}
            onDragLeave={() => setEncima(false)}
            onDrop={(e) => {
              e.preventDefault();
              setEncima(false);
              elegir(e.dataTransfer.files?.[0]);
            }}
          >
            {preview ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
                <img src={preview} alt="" />
                <span className="axr-ban-drop__change">
                  <Icono n="imagen" /> {copy.dropChange}
                </span>
              </>
            ) : (
              <>
                <Icono n="descarga" size={30} />
                <strong>{copy.dropTitle}</strong>
                <small>{copy.dropHint}</small>
              </>
            )}
            <input ref={inputRef} type="file" accept={TIPOS.join(",")} hidden onChange={(e) => elegir(e.target.files?.[0])} />
          </div>

          <div className="axr-banclone__side">
            <label htmlFor="clone-prompt" className="axr-pubnew__q">
              <span className="axr-pubnew__n">1</span> {copy.promptLabel}
            </label>
            <textarea id="clone-prompt" name="prompt" rows={4} className="axr-pubnew__topic" placeholder={copy.promptPh} maxLength={1500} />

            <div className="axr-pubnew__q">
              <span className="axr-pubnew__n">2</span> {copy.countLabel}
            </div>
            <div className="axr-ban-count-pick" role="radiogroup" aria-label={copy.countLabel}>
              <input type="hidden" name="count" value={count} />
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={count === n} className={count === n ? "is-on" : ""} onClick={() => setCount(n)}>
                  {n}
                </button>
              ))}
            </div>
            <small className="axr-pubnew__hint">{copy.countHint}</small>

            <div className="axr-ban-never">
              <strong>
                <Icono n="escudo" /> {copy.cloneNever}
              </strong>
              <ul>
                {copy.cloneNeverList.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Para qué curso ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">3</span> {copy.qCourse}
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

        {/* ── Cómo se ve ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">4</span> {copy.qLook}
        </div>
        <div className="axr-pubnew__where">
          <div className="axr-ban-choices axr-ban-choices--4" role="radiogroup" aria-label={copy.qLook}>
            <label className={`axr-ban-choice${style === "auto" ? " is-on" : ""}`}>
              <input type="radio" name="style" value="auto" checked={style === "auto"} onChange={() => setStyle("auto")} />
              <span className="axr-ban-swatch axr-ban-swatch--auto" aria-hidden>
                <Icono n="chispa" size={22} />
              </span>
              <strong>{copy.styleAuto}</strong>
              <small>{copy.styleAutoHint}</small>
            </label>
            {PLANTILLAS.map((p) => (
              <label key={p} className={`axr-ban-choice axr-ban-choice--look${style === p ? " is-on" : ""}`}>
                <input type="radio" name="style" value={p} checked={style === p} onChange={() => setStyle(p)} />
                <span className={`axr-ban-swatch axr-ban-swatch--${p}`} aria-hidden>
                  <i />
                  <b />
                  <em />
                </span>
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

        <details className="axr-pubnew__more">
          <summary>
            <Icono n="info" /> {copy.fQuality} · {copy.fName}
          </summary>
          <div className="axr-form">
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
            <div className="axr-form__row">
              <label htmlFor="clone-name">{copy.fName}</label>
              <input id="clone-name" name="name" maxLength={120} />
              <small>{copy.fNameHint}</small>
            </div>
          </div>
        </details>
      </section>

      <div className="axr-pubnew__bar">
        <div className="axr-pubnew__est">
          <strong>{fill(copy.estimate, formatoUsd(coste, locale))}</strong>
          <span>{fill(copy.estimateTime, conFoto ? 50 : 20)}</span>
        </div>
        {!file ? <span className="axr-pubnew__missing">{copy.cloneNeedImage}</span> : null}
        <button type="submit" className="axr-btn axr-pubnew__go" disabled={pending || !file}>
          <Icono n="capas" /> {pending ? copy.generating : copy.cloneGo}
        </button>
      </div>
    </form>
  );
}
