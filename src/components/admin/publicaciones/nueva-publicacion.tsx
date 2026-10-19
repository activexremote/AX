"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { crearPublicacion } from "@/app/admin/publicaciones/actions";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { estimar, formatoUsd } from "@/lib/social/costes";
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

export function NuevaPublicacion({
  copy,
  defaultLanguage,
  model,
  locale,
}: {
  copy: PubCopy;
  defaultLanguage: "es" | "en";
  model: string;
  locale: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [canales, setCanales] = useState<SocialChannel[]>([...CANALES]);

  const listo = (topic.trim() || url.trim()) && canales.length > 0;
  const coste = estimar(model, canales, Boolean(url.trim()));

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

  return (
    <form action={handle} className="axr-form">
      {error ? <div className="axr-login__error">{error}</div> : null}

      {/* ── 1 · Qué contar ── */}
      <div className="axr-admin-card">
        <h2>{copy.step1}</h2>
        <p className="axr-pub-lead">{copy.step1Hint}</p>
        <div className="axr-form">
          <div className="axr-form__row">
            <label htmlFor="topic">{copy.fTopic}</label>
            <textarea
              id="topic"
              name="topic"
              rows={5}
              placeholder={copy.fTopicPlaceholder}
              maxLength={4000}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <small>{copy.fTopicHint}</small>
          </div>
          {!topic ? (
            <div className="axr-pub-examples">
              <span>{copy.examplesTitle}</span>
              {copy.examples.map((ej) => (
                <button key={ej} type="button" onClick={() => setTopic(ej)}>
                  {ej}
                </button>
              ))}
            </div>
          ) : null}
          <div className="axr-form__row">
            <label htmlFor="source_url">{copy.fUrl}</label>
            <input id="source_url" name="source_url" type="url" placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
            <small>{copy.fUrlHint}</small>
          </div>
        </div>
      </div>

      {/* ── 2 · Dónde ── */}
      <div className="axr-admin-card">
        <h2>{copy.step2}</h2>
        <div className="axr-form__cols">
          <div className="axr-form__row">
            <label>{copy.fChannels}</label>
            <div className="axr-pub-channels">
              {CANALES.map((c) => (
                <label key={c}>
                  <input
                    type="checkbox"
                    name="channels"
                    value={c}
                    checked={canales.includes(c)}
                    onChange={(e) => setCanales((prev) => (e.target.checked ? CANALES.filter((x) => x === c || prev.includes(x)) : prev.filter((x) => x !== c)))}
                  />
                  {NOMBRE_CANAL[c]}
                </label>
              ))}
            </div>
            <small>{copy.fChannelsHint}</small>
          </div>
          <div className="axr-form__row">
            <label htmlFor="language">{copy.fLanguage}</label>
            <select id="language" name="language" defaultValue={defaultLanguage}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── 3 · Imágenes ── */}
      <div className="axr-admin-card">
        <h2>{copy.step3}</h2>
        <div className="axr-form">
          <div className="axr-form__row">
            <SelectorImagenes copy={copy} max={4} />
            <small>{copy.fImagesHint}</small>
          </div>
          <div className="axr-form__row">
            <label htmlFor="title">{copy.fTitle}</label>
            <input id="title" name="title" maxLength={200} />
            <small>{copy.fTitleHint}</small>
          </div>
        </div>
      </div>

      <div className="axr-pub-submit">
        <div>
          <strong>{fill(copy.estimate, formatoUsd(coste, locale))}</strong>
          <small>{copy.estimateHint}</small>
        </div>
        <button type="submit" className="axr-btn" disabled={pending || !listo}>
          {pending ? copy.generating : copy.generate}
        </button>
      </div>
    </form>
  );
}
