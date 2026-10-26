"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  borrarBanner,
  estadoBanner,
  guardarBanner,
  nuevaImagen,
  quitarImagen,
  quitarTraduccion,
  reescribirBanner,
  subirFoto,
  traducirBanner,
} from "@/app/admin/banners/actions";
import { Editable, Lienzo } from "@/components/admin/banners/lienzo";
import { ElegirLinea } from "@/components/admin/banners/selector-visual";
import { Icono } from "@/components/admin/publicaciones/iconos";
import {
  CTAS,
  ELEMENTOS,
  FORMATOS,
  FORMATO_IDS,
  LIMITES,
  COMPOSICIONES,
  PLANTILLAS,
  leerComposicion,
  type Composicion,
  leerCopy,
  leerElementos,
  otroIdioma,
  usaImagen,
  type BannerCopy,
  type Elementos,
  type FormatoId,
  type Plantilla,
} from "@/lib/banners/formatos";
import { lineaDe } from "@/lib/banners/direcciones";
import { bloquea, revisarVariante } from "@/lib/banners/normas";
import type { CampoTexto } from "@/lib/banners/pieza";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Una variante: la pieza a la izquierda, lo que se edita a la derecha
//
//  La pieza es la de verdad, pintada en el navegador con el mismo componente
//  que compone el PNG (lib/banners/pieza.tsx). Los textos se editan haciendo
//  clic encima; los elementos se encienden y se apagan; nada de eso vuelve a
//  pedir la imagen a la IA. La revisión de normas también va en vivo: es la
//  misma función que usa el servidor, así que lo que ves es lo que se guarda.
//
//  Si la variante tiene versión en el otro idioma, las dos comparten imagen,
//  plantilla y elementos: sólo cambian los textos.
// ══════════════════════════════════════════════════════════

type Lado = "main" | "alt";

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

/** Borrar en dos pasos, sin diálogos del navegador. */
function Borrar({ label, confirmar, cancelar, onConfirm, disabled }: { label: string; confirmar: string; cancelar: string; onConfirm: () => void; disabled?: boolean }) {
  const [armado, setArmado] = useState(false);
  if (!armado) {
    return (
      <button type="button" className="axr-btn axr-btn--ghost" disabled={disabled} onClick={() => setArmado(true)}>
        <Icono n="papelera" /> {label}
      </button>
    );
  }
  return (
    <span className="axr-ban-confirm">
      <button type="button" className="axr-btn axr-btn--danger" disabled={disabled} onClick={onConfirm}>
        {confirmar}
      </button>
      <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setArmado(false)}>
        {cancelar}
      </button>
    </span>
  );
}

/** Maqueta del anuncio en el feed: cómo se corta el texto y dónde va cada campo. */
function VistaFeed({ c, children, copy }: { c: BannerCopy; children: React.ReactNode; copy: BanCopy }) {
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
      {children}
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

export function EditorBanner({
  banner,
  campaign,
  n,
  copy,
  locale,
  imagenUrl,
}: {
  banner: AdBanner;
  campaign: AdCampaign;
  n: number;
  copy: BanCopy;
  locale: string;
  /** Enlace firmado a la foto (el bucket es privado), o null. */
  imagenUrl: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [traduciendo, setTraduciendo] = useState(false);

  const guardado = useMemo(
    () => ({
      copy: leerCopy(banner.copy),
      alt: banner.copy_alt ? leerCopy(banner.copy_alt) : null,
      template: banner.template as Plantilla,
      elementos: leerElementos(banner.elements),
      layout: leerComposicion(banner.layout),
    }),
    [banner.copy, banner.copy_alt, banner.template, banner.elements, banner.layout],
  );
  const [main, setMain] = useState<BannerCopy>(guardado.copy);
  const [alt, setAlt] = useState<BannerCopy | null>(guardado.alt);
  const [template, setTemplate] = useState<Plantilla>(guardado.template);
  const [elementos, setElementos] = useState<Elementos>(guardado.elementos);
  const [layout, setLayout] = useState<Composicion>(guardado.layout);
  const [lado, setLado] = useState<Lado>("main");
  const [formato, setFormato] = useState<FormatoId>("vertical");
  const [zonas, setZonas] = useState(false);
  const [escena, setEscena] = useState(banner.image_prompt ?? "");
  const [linea, setLinea] = useState(banner.visual_ref?.dir ?? "");
  const [instruccion, setInstruccion] = useState("");
  const [nuevoPunto, setNuevoPunto] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Si el servidor trae otra versión (reescrita, traducida, otra imagen), se adopta.
  useEffect(() => {
    setMain(guardado.copy);
    setAlt(guardado.alt);
    setTemplate(guardado.template);
    setElementos(guardado.elementos);
    setLayout(guardado.layout);
    if (!guardado.alt) setLado("main");
  }, [guardado]);
  useEffect(() => setEscena(banner.image_prompt ?? ""), [banner.image_prompt]);
  useEffect(() => setLinea(banner.visual_ref?.dir ?? ""), [banner.visual_ref?.dir]);

  const idioma = lado === "alt" ? otroIdioma(campaign.language) : campaign.language;
  const otro = otroIdioma(campaign.language);
  const c = lado === "alt" && alt ? alt : main;
  const setC = useCallback(
    (fn: (prev: BannerCopy) => BannerCopy) => (lado === "alt" ? setAlt((p) => (p ? fn(p) : p)) : setMain(fn)),
    [lado],
  );

  const sucio =
    JSON.stringify(main) !== JSON.stringify(guardado.copy) ||
    JSON.stringify(alt) !== JSON.stringify(guardado.alt) ||
    template !== guardado.template ||
    layout !== guardado.layout ||
    JSON.stringify(elementos) !== JSON.stringify(guardado.elementos);
  const conImagen = Boolean(banner.image_path && imagenUrl);
  const imagenIa = banner.image_source === "ia" && usaImagen(template) && conImagen;
  const flags = useMemo(
    () => revisarVariante({ copy: main, copyAlt: alt, altLang: otro, imagenIa, elementos }),
    [main, alt, otro, imagenIa, elementos],
  );
  const bloqueado = bloquea(flags);
  const descartado = banner.status === "descartado";
  const aprobado = banner.status === "aprobado";

  const correr = (fn: () => Promise<{ error?: string } | { flags?: unknown; error?: string }>) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.error) setError(r.error);
      router.refresh();
    });

  const guardar = () => {
    if (!sucio || pending) return;
    correr(() => guardarBanner(banner.id, { copy: main, copyAlt: alt, template, elements: elementos, layout }));
  };
  // El atajo de teclado guarda lo último, no lo que había al montar.
  const guardarRef = useRef(guardar);
  useLayoutEffect(() => {
    guardarRef.current = guardar;
  });

  // ⌘S / Ctrl+S guarda la variante en la que se está escribiendo.
  const articulo = useRef<HTMLElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && articulo.current?.contains(document.activeElement)) {
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur();
        // El blur deja el texto limpio en el estado; se guarda tras el siguiente pintado.
        setTimeout(() => guardarRef.current(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const set = (k: keyof BannerCopy) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.value;
    setC((prev) => ({ ...prev, [k]: v }));
  };

  const toggle = (k: (typeof ELEMENTOS)[number]) => setElementos((e) => ({ ...e, [k]: !e[k] }));

  // ── Los textos de la pieza, editables en el sitio ──
  const lineas = c.points.split("\n").slice(0, 3);
  const pintar = (campo: CampoTexto, valor: string, i?: number) => {
    if (campo === "points") {
      const idx = i ?? 0;
      return (
        <Editable
          key={`${lado}-points-${idx}`}
          campo="points"
          valor={valor}
          placeholder={copy.placeholder.points}
          foco={nuevoPunto === idx}
          onChange={(v) =>
            setC((prev) => {
              const ls = prev.points.split("\n").slice(0, 3);
              while (ls.length <= idx) ls.push("");
              ls[idx] = v;
              return { ...prev, points: ls.join("\n") };
            })
          }
          onEnter={() => {
            // Intro en un punto abre el siguiente (hasta 3).
            if (lineas.length < 3 && idx === lineas.length - 1) {
              setC((prev) => ({ ...prev, points: `${prev.points}\n` }));
              setNuevoPunto(idx + 1);
            } else (document.activeElement as HTMLElement | null)?.blur();
          }}
        />
      );
    }
    return (
      <Editable
        key={`${lado}-${campo}`}
        campo={campo}
        valor={valor}
        placeholder={copy.placeholder[campo]}
        onChange={(v) => setC((prev) => ({ ...prev, [campo]: v }))}
      />
    );
  };

  const f = FORMATOS[formato];
  const ctas = CTAS[idioma] as readonly string[];
  const base = `/admin/banners/render/${banner.id}`;
  const version = encodeURIComponent(banner.updated_at);
  const nombreOtro = copy.langName[otro];

  return (
    <article ref={articulo} className={`axr-pubcard axr-ban-editor${descartado ? " is-discarded" : ""}${aprobado ? " is-approved" : ""}`}>
      <header className="axr-ban-editor__head">
        <strong>{fill(copy.variant, n)}</strong>
        {banner.angle ? <span className="axr-ban-pill">{copy.angle[banner.angle as keyof BanCopy["angle"]] ?? banner.angle}</span> : null}
        <span className={`axr-ban-pill axr-ban-pill--${banner.status}`}>{copy.status[banner.status]}</span>
        <span className="axr-ban-editor__spacer" />
        {sucio ? <span className="axr-ban-unsaved">{copy.unsaved}</span> : null}
        {descartado ? (
          <>
            <Borrar
              label={copy.deleteVariant}
              confirmar={copy.confirmDeleteVariant}
              cancelar={copy.cancel}
              disabled={pending}
              onConfirm={() => correr(() => borrarBanner(banner.id))}
            />
            <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => estadoBanner(banner.id, "borrador"))}>
              {copy.restore}
            </button>
          </>
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
          <div className="axr-ban-stage__top">
            <div className="axr-pv-switch" role="group" aria-label="Formato">
              {FORMATO_IDS.map((id) => (
                <button key={id} type="button" aria-pressed={formato === id} onClick={() => setFormato(id)}>
                  {FORMATOS[id].label}
                </button>
              ))}
            </div>
            {alt ? (
              <div className="axr-pv-switch axr-ban-lang" role="group" aria-label="Idioma">
                {(["main", "alt"] as const).map((l) => (
                  <button key={l} type="button" aria-pressed={lado === l} onClick={() => setLado(l)}>
                    {(l === "main" ? campaign.language : otro).toUpperCase()}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`axr-ban-frame axr-ban-frame--${formato}`} style={{ aspectRatio: `${f.w} / ${f.h}` }}>
            <Lienzo
              copy={c}
              template={template}
              course={campaign.course}
              language={idioma}
              formato={formato}
              imagen={conImagen ? imagenUrl : null}
              elementos={elementos}
              composicion={layout}
              texto={pintar}
              editando
            />
            {zonas ? (
              <span className="axr-ban-safe" aria-hidden>
                <i style={{ top: 0, height: `${(f.safe.top / f.h) * 100}%` }} />
                <i style={{ bottom: 0, height: `${(f.safe.bottom / f.h) * 100}%` }} />
                <b style={{ left: 0, width: `${(f.safe.side / f.w) * 100}%` }} />
                <b style={{ right: 0, width: `${(f.safe.side / f.w) * 100}%` }} />
              </span>
            ) : null}
            {pending ? (
              <span className="axr-ban-frame__busy">
                <Icono n="chispa" size={22} />
              </span>
            ) : null}
          </div>
          <p className="axr-ban-hint">
            <Icono n="info" size={14} /> {copy.clickToEdit}
          </p>
          <div className="axr-ban-comps" role="radiogroup" aria-label={copy.layoutLabel}>
            <span>{copy.layoutLabel}</span>
            {COMPOSICIONES.map((k) => (
              <button key={k} type="button" role="radio" aria-checked={layout === k} onClick={() => setLayout(k)}>
                <i className={`axr-ban-comp axr-ban-comp--${k}`} aria-hidden>
                  <b />
                  <em />
                </i>
                {copy.layout[k]}
              </button>
            ))}
          </div>
          <div className="axr-ban-stage__bar">
            <label className="axr-ban-toggle">
              <input type="checkbox" checked={zonas} onChange={(e) => setZonas(e.target.checked)} /> {copy.safeZones}
            </label>
            <small>{f.placements}</small>
            <a
              className="axr-btn axr-btn--ghost"
              href={`${base}/${formato}?dl=1&v=${version}${lado === "alt" ? "&lang=alt" : ""}`}
              aria-disabled={sucio}
              onClick={(e) => sucio && e.preventDefault()}
              title={sucio ? copy.unsaved : undefined}
            >
              <Icono n="descarga" /> {copy.download}
            </a>
          </div>

          <details className="axr-ban-feedwrap">
            <summary>{copy.previewFeed}</summary>
            <VistaFeed c={c} copy={copy}>
              <Lienzo copy={c} template={template} course={campaign.course} language={idioma} formato="vertical" imagen={conImagen ? imagenUrl : null} elementos={elementos} composicion={layout} />
            </VistaFeed>
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

          <section>
            <h3>{copy.elements}</h3>
            <small className="axr-ban-help">{copy.elementsHint}</small>
            <ul className="axr-ban-elements">
              {ELEMENTOS.map((k) => {
                const sinFoto = k === "aiLabel" && !conImagen;
                return (
                  <li key={k}>
                    <label className={`axr-ban-switch${sinFoto ? " is-off" : ""}`}>
                      <input type="checkbox" checked={elementos[k] && !sinFoto} disabled={sinFoto} onChange={() => toggle(k)} />
                      <span className="axr-ban-switch__track" aria-hidden />
                      <span>{copy.element[k]}</span>
                      {sinFoto ? <small>{copy.aiLabelNoImage}</small> : null}
                    </label>
                    {k === "points" && elementos.points && lineas.length < 3 ? (
                      <button
                        type="button"
                        className="axr-ban-mini"
                        onClick={() => {
                          // Sin puntos ya hay uno vacío a la vista: se entra en él.
                          if (c.points) setC((prev) => ({ ...prev, points: `${prev.points}\n` }));
                          setNuevoPunto(c.points ? lineas.length : 0);
                        }}
                      >
                        <Icono n="mas" size={12} /> {copy.addPoint}
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="axr-ban-row2">
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
              <div className="axr-form__row">
                <label>{copy.ctaMeta}</label>
                <select value={c.cta} onChange={set("cta")}>
                  {[...new Set([...ctas, c.cta])].filter(Boolean).map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="axr-form">
            <h3>
              {copy.metaTexts}
              {alt ? <span className="axr-ban-pill">{idioma.toUpperCase()}</span> : null}
            </h3>
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
            <button type="button" className="axr-btn" disabled={pending || !sucio} onClick={guardar}>
              {pending ? copy.saving : sucio ? copy.save : copy.saved}
            </button>
          </div>

          <details className="axr-ban-tools" open={traduciendo || undefined}>
            <summary>
              <Icono n="capas" /> {alt ? fill(copy.redoLang, nombreOtro) : fill(copy.addLang, nombreOtro)}
            </summary>
            <small className="axr-ban-help">{copy.addLangHint}</small>
            <div className="axr-ban-tools__row">
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                disabled={pending || sucio}
                title={sucio ? copy.unsaved : undefined}
                onClick={() => {
                  setTraduciendo(true);
                  correr(async () => {
                    const r = await traducirBanner(banner.id);
                    setTraduciendo(false);
                    if (!r.error) setLado("alt");
                    return r;
                  });
                }}
              >
                <Icono n="chispa" /> {traduciendo ? fill(copy.translating, nombreOtro) : alt ? fill(copy.redoLang, nombreOtro) : fill(copy.addLang, nombreOtro)}
              </button>
              {alt ? (
                <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => quitarTraduccion(banner.id))}>
                  <Icono n="papelera" /> {fill(copy.removeLang, nombreOtro)}
                </button>
              ) : null}
            </div>
          </details>

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
            <label className="axr-ban-help">
              {copy.visLine}: <strong>{linea ? (lineaDe(linea)?.nombre[locale === "en" ? "en" : "es"] ?? linea) : copy.visLineNone}</strong>
            </label>
            <ElegirLinea copy={copy} locale={locale} value={linea} onChange={setLinea} />
            <small className="axr-ban-help">{copy.visLineHint}</small>
            <label className="axr-ban-help">{copy.regenImageHint}</label>
            <textarea rows={3} value={escena} onChange={(e) => setEscena(e.target.value)} maxLength={1500} />
            <div className="axr-ban-tools__row">
              <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => correr(() => nuevaImagen(banner.id, escena, linea || undefined))}>
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
