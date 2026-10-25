"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { crearPublicacion } from "@/app/admin/publicaciones/actions";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { estimar, formatoUsd } from "@/lib/social/costes";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";
import type { SocialChannel } from "@/lib/supabase/types";

/** Selector de imágenes con su texto alternativo, compartido con el editor. */
export function SelectorImagenes({ copy, max }: { copy: PubCopy; max: number }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  return (
    <div className="axr-pub-upload">
      <input
        type="file"
        name="images"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, max))}
      />
      {files.map((f, i) => (
        <div className="axr-pub-upload-row" key={`${f.name}-${i}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
          {previews[i] ? <img src={previews[i]} alt="" /> : <span />}
          <input name="alts" placeholder={`${copy.fAlt} · ${f.name}`} maxLength={400} />
        </div>
      ))}
    </div>
  );
}

/** Lo que va diciendo la pantalla de espera, con los segundos a los que aparece cada paso. */
function pasosEspera(copy: PubCopy, canales: SocialChannel[], conEnlace: boolean): [number, string][] {
  const out: [number, string][] = [];
  let t = 0;
  if (conEnlace) {
    out.push([t, copy.uWaitLink]);
    t += 3;
  }
  out.push([t, copy.uWaitThinking]);
  t += 3;
  if (canales.includes("x")) out.push([(t += 2), copy.uWaitX]);
  if (canales.includes("linkedin")) out.push([(t += 3), copy.uWaitLinkedIn]);
  if (canales.includes("blog")) out.push([(t += 3), copy.uWaitBlog]);
  out.push([t + (canales.includes("blog") ? 12 : 4), copy.uWaitChecks]);
  return out;
}

function Espera({ copy, canales, conEnlace }: { copy: PubCopy; canales: SocialChannel[]; conEnlace: boolean }) {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const pasos = pasosEspera(copy, canales, conEnlace);
  const actual = pasos.reduce((i, [t], j) => (s >= t ? j : i), 0);
  return (
    <div className="axr-pubwait" role="status" aria-live="polite">
      <div className="axr-pubwait__card">
        <span className="axr-pubwait__spark">
          <Icono n="chispa" size={26} />
        </span>
        <strong>{copy.uWaitTitle}</strong>
        <ol>
          {pasos.map(([, label], j) => (
            <li key={label} className={j < actual ? "is-done" : j === actual ? "is-now" : ""}>
              <span>{j < actual ? <Icono n="ok" size={14} /> : null}</span>
              {label}
            </li>
          ))}
        </ol>
        <small>{fill(copy.uWaitSeconds, s)}</small>
      </div>
    </div>
  );
}

export function NuevaPublicacion({
  copy,
  defaultLanguage,
  model,
  locale,
  canalInicial,
}: {
  copy: PubCopy;
  defaultLanguage: "es" | "en";
  model: string;
  locale: string;
  canalInicial?: SocialChannel;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [canales, setCanales] = useState<SocialChannel[]>(canalInicial ? [canalInicial] : [...CANALES]);
  const [idioma, setIdioma] = useState<"es" | "en" | "ambos">(defaultLanguage);
  const ambos = idioma === "ambos";

  const listo = Boolean(topic.trim() || url.trim()) && canales.length > 0;
  // Con «ambos» se escribe dos veces (la segunda, adaptando la primera).
  const coste = estimar(model, canales, Boolean(url.trim())) * (ambos ? 2 : 1);
  const segundos = (url.trim() ? 5 : 0) + (canales.includes("blog") ? 25 : 10) * (ambos ? 2 : 1);
  const falta = !topic.trim() && !url.trim() ? copy.uNeedTopic : !canales.length ? copy.uNeedChannel : null;

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = await crearPublicacion(formData);
      // Con id, la publicación existe aunque la IA haya fallado: el error se
      // ve en el editor, donde se puede volver a generar.
      if (r.id) router.push(`/admin/publicaciones/${r.id}${r.error ? `?aviso=${encodeURIComponent(r.error)}` : ""}`);
      else setError(r.error ?? "Error");
    });
  }

  const alternar = (c: SocialChannel) =>
    setCanales((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : CANALES.filter((x) => x === c || prev.includes(x))));

  return (
    <form action={handle} className="axr-pubnew">
      {pending ? <Espera copy={copy} canales={canales} conEnlace={Boolean(url.trim())} /> : null}
      {error ? <div className="axr-login__error">{error}</div> : null}

      <section className="axr-pubcard axr-pubnew__card">
        {/* ── Qué contar ── */}
        <label htmlFor="topic" className="axr-pubnew__q">
          <span className="axr-pubnew__n">1</span> {copy.uWhat}
        </label>
        <textarea
          id="topic"
          name="topic"
          rows={4}
          className="axr-pubnew__topic"
          placeholder={copy.fTopicPlaceholder}
          maxLength={4000}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          autoFocus
        />
        {!topic ? (
          <div className="axr-pub-examples">
            <span>{copy.uTry}</span>
            {copy.examples.map((ej) => (
              <button key={ej} type="button" onClick={() => setTopic(ej)}>
                {ej}
              </button>
            ))}
          </div>
        ) : (
          <small className="axr-pubnew__hint">{copy.fTopicHint}</small>
        )}
        <div className="axr-pubnew__link">
          <Icono n="enlace" />
          <input
            id="source_url"
            name="source_url"
            type="url"
            placeholder={copy.uLinkPlaceholder}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label={copy.fUrl}
          />
        </div>

        {/* ── Dónde ── */}
        <div className="axr-pubnew__q">
          <span className="axr-pubnew__n">2</span> {copy.uWhere}
        </div>
        <div className="axr-pubnew__where">
          <div className="axr-pubnew__channels" role="group" aria-label={copy.fChannels}>
            {CANALES.map((c) => (
              <label key={c} className={`axr-pubnew__channel axr-pubnew__channel--${c}${canales.includes(c) ? " is-on" : ""}`}>
                <input type="checkbox" name="channels" value={c} checked={canales.includes(c)} onChange={() => alternar(c)} />
                <span className="axr-pubnew__check">{canales.includes(c) ? <Icono n="ok" size={12} /> : null}</span>
                <strong>{NOMBRE_CANAL[c]}</strong>
                <small>{copy[`uWhat_${c}`]}</small>
              </label>
            ))}
          </div>
          <div className="axr-pv-switch axr-pubnew__lang" role="group" aria-label={copy.fLanguage}>
            <input type="hidden" name="language" value={idioma} />
            {(["es", "en", "ambos"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={idioma === l} onClick={() => setIdioma(l)} title={l === "ambos" ? copy.langBothHint : undefined}>
                {l === "es" ? "Español" : l === "en" ? "English" : copy.langBoth}
              </button>
            ))}
          </div>
          {ambos ? <small className="axr-pubnew__hint">{copy.langBothHint}</small> : null}
        </div>

        {/* ── Opcional ── */}
        <details className="axr-pubnew__more">
          <summary>
            <Icono n="imagen" /> {copy.uMore}
          </summary>
          <div className="axr-form">
            <div className="axr-form__row">
              <label>{copy.fImages}</label>
              <SelectorImagenes copy={copy} max={4} />
              <small>{copy.fImagesHint}</small>
            </div>
            <div className="axr-form__row">
              <label htmlFor="title">{copy.fTitle}</label>
              <input id="title" name="title" maxLength={200} />
              <small>{copy.fTitleHint}</small>
            </div>
          </div>
        </details>
      </section>

      <div className="axr-pubnew__bar">
        <div className="axr-pubnew__est">
          <strong>{fill(copy.uEstimate, formatoUsd(coste, locale))}</strong>
          <span>{fill(copy.uEstimateTime, segundos)}</span>
        </div>
        {falta ? <span className="axr-pubnew__missing">{falta}</span> : null}
        <button type="submit" className="axr-btn axr-pubnew__go" disabled={pending || !listo}>
          <Icono n="chispa" /> {pending ? copy.generating : copy.uGenerate}
        </button>
      </div>
    </form>
  );
}
