"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { estadoBanner, guardarBanner, nuevaImagen, quitarImagen, reescribirBanner, subirFoto } from "@/app/admin/banners/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import {
  CTAS,
  FORMATOS,
  FORMATO_IDS,
  LIMITES,
  PLANTILLAS,
  leerCopy,
  usaImagen,
  type BannerCopy,
  type FormatoId,
  type Plantilla,
} from "@/lib/banners/formatos";
import { bloquea, revisar } from "@/lib/banners/normas";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Una variante: la pieza a la izquierda, lo que se edita a la derecha
//
//  La vista previa es la pieza de verdad (el mismo PNG que se descarga),
//  recompuesta medio segundo después de dejar de escribir con el borrador en
//  la URL. La revisión de normas también va en vivo: es la misma función que
//  usa el servidor, así que lo que ves es lo que se guarda.
// ══════════════════════════════════════════════════════════

const b64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function Contador({ n, max, tpl }: { n: number; max: number; tpl: string }) {
  return <small className={`axr-ban-count${n > max ? " is-over" : ""}`}>{fill(tpl, `${n}/${max}`)}</small>;
}

function Copiar({ texto, copy }: { texto: string; copy: BanCopy }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="axr-ban-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* sin permiso de portapapeles: no pasa nada, se copia a mano */
        }
      }}
    >
      {ok ? <Icono n="ok" size={14} /> : null} {ok ? copy.copied : copy.copy}
    </button>
  );
}

/** Maqueta del anuncio en el feed: cómo se corta el texto y dónde va cada campo. */
function VistaFeed({ c, src, copy }: { c: BannerCopy; src: string; copy: BanCopy }) {
  const corto = c.primaryText.length > LIMITES.primaryText ? c.primaryText.slice(0, LIMITES.primaryText).trimEnd() : c.primaryText;
  return (
    <div className="axr-ban-feed" aria-label={copy.previewFeed}>
      <div className="axr-ban-feed__head">
        <span className="axr-ban-feed__avatar">ΔX</span>
        <span>
          <strong>ActiveXRemote</strong>
          <small>{copy.sponsored}</small>
        </span>
      </div>
      <p className="axr-ban-feed__text">
        {corto}
        {corto !== c.primaryText ? <span className="axr-ban-feed__more">{copy.seeMore}</span> : null}
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element -- PNG generado al vuelo */}
      <img src={src} alt={c.alt} />
      <div className="axr-ban-feed__foot">
        <span>
          <small>activexremote.com</small>
          <strong>{c.adHeadline}</strong>
          <small>{c.description}</small>
        </span>
        <span className="axr-ban-feed__cta">{c.cta}</span>
      </div>
    </div>
  );
}

export function EditorBanner({ banner, campaign, n, copy }: { banner: AdBanner; campaign: AdCampaign; n: number; copy: BanCopy }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const guardado = useMemo(() => ({ copy: leerCopy(banner.copy), template: banner.template as Plantilla }), [banner.copy, banner.template]);
  const [c, setC] = useState<BannerCopy>(guardado.copy);
  const [template, setTemplate] = useState<Plantilla>(guardado.template);
  const [formato, setFormato] = useState<FormatoId>("vertical");
  const [zonas, setZonas] = useState(false);
  const [escena, setEscena] = useState(banner.image_prompt ?? "");
  const [instruccion, setInstruccion] = useState("");
  const [preview, setPreview] = useState("");
  // La pieza tarda 1-2 s en recomponerse: mientras, se ve la anterior atenuada.
  const [cargando, setCargando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Si el servidor trae otra versión (reescrita, otra imagen), se adopta.
  useEffect(() => {
    setC(guardado.copy);
    setTemplate(guardado.template);
  }, [guardado]);
  useEffect(() => setEscena(banner.image_prompt ?? ""), [banner.image_prompt]);

  const sucio = JSON.stringify(c) !== JSON.stringify(guardado.copy) || template !== guardado.template;
  const conImagen = Boolean(banner.image_path);
  const imagenIa = banner.image_source === "ia" && usaImagen(template) && conImagen;
  const flags = useMemo(() => revisar(c, { imagenIa }), [c, imagenIa]);
  const bloqueado = bloquea(flags);
  const descartado = banner.status === "descartado";
  const aprobado = banner.status === "aprobado";

  // Vista previa: el borrador viaja en la URL, con medio segundo de calma.
  const base = `/admin/banners/render/${banner.id}`;
  const version = encodeURIComponent(banner.updated_at);
  useEffect(() => {
    const t = setTimeout(() => {
      const d = sucio ? `&d=${b64url(JSON.stringify({ copy: c, template }))}` : "";
      setPreview((prev) => {
        const next = `?v=${version}${d}`;
        if (next !== prev) setCargando(true);
        return next;
      });
    }, sucio ? 500 : 0);
    return () => clearTimeout(t);
  }, [c, template, sucio, version]);

  const set = (k: keyof BannerCopy) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setC((prev) => ({ ...prev, [k]: e.target.value }));

  const correr = (fn: () => Promise<{ error?: string } | { flags?: unknown; error?: string }>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.error) setError(r.error);
      router.refresh();
    });

  const f = FORMATOS[formato];
  const ctas = CTAS[campaign.language] as readonly string[];

  return (
    <article className={`axr-pubcard axr-ban-editor${descartado ? " is-discarded" : ""}${aprobado ? " is-approved" : ""}`}>
      <header className="axr-ban-editor__head">
        <strong>{fill(copy.variant, n)}</strong>
        {banner.angle ? <span className="axr-ban-pill">{copy.angle[banner.angle as keyof BanCopy["angle"]] ?? banner.angle}</span> : null}
        <span className={`axr-ban-pill axr-ban-pill--${banner.status}`}>{copy.status[banner.status]}</span>
        <span className="axr-ban-editor__spacer" />
        {sucio ? <span className="axr-ban-unsaved">{copy.unsaved}</span> : null}
        {descartado ? (
          <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => estadoBanner(banner.id, "borrador"))}>
            {copy.restore}
          </button>
        ) : (
          <>
            <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => estadoBanner(banner.id, "descartado"))}>
              {copy.discard}
            </button>
            {aprobado ? (
              <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => estadoBanner(banner.id, "borrador"))}>
                {copy.unapprove}
              </button>
            ) : (
              <button
                type="button"
                className="axr-btn axr-ban-approve"
                disabled={pending || bloqueado || sucio}
                title={bloqueado ? copy.fixFirst : sucio ? copy.unsaved : undefined}
                onClick={() => correr(() => estadoBanner(banner.id, "aprobado"))}
              >
                <Icono n="ok" /> {copy.approve}
              </button>
            )}
          </>
        )}
      </header>

      {error ? <div className="axr-login__error">{error}</div> : null}

      <div className="axr-ban-editor__grid">
        {/* ── La pieza ── */}
        <div className="axr-ban-stage">
          <div className="axr-pv-switch" role="group" aria-label="Formato">
            {FORMATO_IDS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={formato === id}
                onClick={() => {
                  if (id !== formato) setCargando(true);
                  setFormato(id);
                }}
              >
                {FORMATOS[id].label}
              </button>
            ))}
          </div>
          <div className={`axr-ban-frame axr-ban-frame--${formato}`} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- PNG generado al vuelo, privado
              <img src={`${base}/${formato}${preview}`} alt={c.alt} onLoad={() => setCargando(false)} onError={() => setCargando(false)} />
            ) : null}
            {zonas ? (
              <span className="axr-ban-safe" aria-hidden>
                <i style={{ top: 0, height: `${(f.safe.top / f.h) * 100}%` }} />
                <i style={{ bottom: 0, height: `${(f.safe.bottom / f.h) * 100}%` }} />
                <b style={{ left: 0, width: `${(f.safe.side / f.w) * 100}%` }} />
                <b style={{ right: 0, width: `${(f.safe.side / f.w) * 100}%` }} />
              </span>
            ) : null}
            {pending || cargando ? <span className="axr-ban-frame__busy"><Icono n="chispa" size={22} /></span> : null}
          </div>
          <div className="axr-ban-stage__bar">
            <label className="axr-ban-toggle">
              <input type="checkbox" checked={zonas} onChange={(e) => setZonas(e.target.checked)} /> {copy.safeZones}
            </label>
            <small>{f.placements}</small>
            <a className="axr-btn axr-btn--ghost" href={`${base}/${formato}?dl=1&v=${version}`} aria-disabled={sucio} onClick={(e) => sucio && e.preventDefault()} title={sucio ? copy.unsaved : undefined}>
              <Icono n="descarga" /> {copy.download}
            </a>
          </div>

          <details className="axr-ban-feedwrap">
            <summary>{copy.previewFeed}</summary>
            {preview ? <VistaFeed c={c} src={`${base}/vertical${preview}`} copy={copy} /> : null}
          </details>
        </div>

        {/* ── Lo que se edita ── */}
        <div className="axr-ban-fields">
          <section>
            <h3>{copy.review}</h3>
            {flags.length ? (
              <ul className="axr-ban-flags">
                {flags.map((fl) => (
                  <li key={`${fl.rule}-${fl.text}`} className={`axr-ban-flag axr-ban-flag--${fl.level}`}>
                    <Icono n={fl.level === "bloquea" ? "error" : "aviso"} />
                    <span>
                      <strong>
                        {fl.rule} · {fl.level === "bloquea" ? copy.blocking : copy.warning}
                      </strong>
                      {fl.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="axr-ban-flag axr-ban-flag--ok">
                <Icono n="ok" /> {copy.reviewOk}
              </p>
            )}
          </section>

          <section className="axr-form">
            <h3>{copy.piece}</h3>
            <small className="axr-ban-help">{copy.pieceHint}</small>
            <div className="axr-form__row">
              <label>{copy.fKicker}</label>
              <input value={c.kicker} onChange={set("kicker")} maxLength={40} />
            </div>
            <div className="axr-form__row">
              <label>{copy.fHeadline}</label>
              <textarea rows={2} value={c.headline} onChange={set("headline")} maxLength={140} />
              <Contador n={c.headline.split(/\s+/).filter(Boolean).length} max={LIMITES.headlineWords} tpl={copy.words} />
            </div>
            <div className="axr-form__row">
              <label>{copy.fSub}</label>
              <textarea rows={2} value={c.sub} onChange={set("sub")} maxLength={160} />
            </div>
            <div className="axr-ban-row2">
              <div className="axr-form__row">
                <label>{copy.fCta}</label>
                <select value={c.cta} onChange={set("cta")}>
                  {[...new Set([...ctas, c.cta])].filter(Boolean).map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
              <div className="axr-form__row">
                <label>{copy.look}</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value as Plantilla)}>
                  {PLANTILLAS.map((p) => (
                    <option key={p} value={p} disabled={usaImagen(p) && !conImagen}>
                      {copy.template[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="axr-form">
            <h3>{copy.metaTexts}</h3>
            <small className="axr-ban-help">{copy.metaHint}</small>
            <div className="axr-form__row">
              <label>
                {copy.fPrimary} <Copiar texto={c.primaryText} copy={copy} />
              </label>
              <textarea rows={4} value={c.primaryText} onChange={set("primaryText")} maxLength={2000} />
              <Contador n={c.primaryText.length} max={LIMITES.primaryText} tpl={copy.chars} />
            </div>
            <div className="axr-ban-row2">
              <div className="axr-form__row">
                <label>
                  {copy.fAdHeadline} <Copiar texto={c.adHeadline} copy={copy} />
                </label>
                <input value={c.adHeadline} onChange={set("adHeadline")} maxLength={120} />
                <Contador n={c.adHeadline.length} max={LIMITES.adHeadline} tpl={copy.chars} />
              </div>
              <div className="axr-form__row">
                <label>
                  {copy.fDescription} <Copiar texto={c.description} copy={copy} />
                </label>
                <input value={c.description} onChange={set("description")} maxLength={120} />
                <Contador n={c.description.length} max={LIMITES.description} tpl={copy.chars} />
              </div>
            </div>
            <div className="axr-form__row">
              <label>
                {copy.fAlt} <Copiar texto={c.alt} copy={copy} />
              </label>
              <input value={c.alt} onChange={set("alt")} maxLength={300} />
            </div>
          </section>

          <div className="axr-ban-save">
            <button
              type="button"
              className="axr-btn"
              disabled={pending || !sucio}
              onClick={() => correr(() => guardarBanner(banner.id, { copy: c, template }))}
            >
              {pending ? copy.saving : sucio ? copy.save : copy.saved}
            </button>
          </div>

          <details className="axr-ban-tools">
            <summary>
              <Icono n="chispa" /> {copy.rewrite}
            </summary>
            <textarea rows={2} value={instruccion} onChange={(e) => setInstruccion(e.target.value)} placeholder={copy.rewritePh} maxLength={1000} />
            <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => reescribirBanner(banner.id, instruccion))}>
              <Icono n="chispa" /> {copy.rewrite}
            </button>
          </details>

          <details className="axr-ban-tools">
            <summary>
              <Icono n="imagen" /> {copy.image}
            </summary>
            <label className="axr-ban-help">{copy.regenImageHint}</label>
            <textarea rows={3} value={escena} onChange={(e) => setEscena(e.target.value)} maxLength={1500} />
            <div className="axr-ban-tools__row">
              <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => nuevaImagen(banner.id, escena))}>
                <Icono n="chispa" /> {copy.regenImage}
              </button>
              <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => fileRef.current?.click()}>
                <Icono n="imagen" /> {copy.uploadImage}
              </button>
              {conImagen ? (
                <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => quitarImagen(banner.id))}>
                  <Icono n="papelera" /> {copy.removeImage}
                </button>
              ) : null}
            </div>
            <small className="axr-ban-help">{copy.uploadHint}</small>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.set("file", file);
                e.target.value = "";
                correr(() => subirFoto(banner.id, fd));
              }}
            />
          </details>
        </div>
      </div>
    </article>
  );
}
