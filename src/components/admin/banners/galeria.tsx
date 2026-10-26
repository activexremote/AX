"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Lienzo } from "@/components/admin/banners/lienzo";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { FORMATOS, FORMATO_IDS, MAX_GALERIA, esNativo, leerBoton, leerComposicion, leerCopy, leerElementos, type FormatoId, type Plantilla } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import type { AdBannerStatus, AdCourse } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  La galería: ver, elegir y descargar
//
//  Cada miniatura es la pieza de verdad (lienzo.tsx), pintada sólo cuando se
//  acerca a la pantalla: con cientos de variantes, montar todas de golpe
//  cargaría cientos de fotos. Se elige con un clic en la tarjeta; la barra
//  de abajo descarga lo elegido en un .zip (galeria/descargar).
// ══════════════════════════════════════════════════════════

export type ItemGaleria = {
  id: string;
  campaignId: string;
  campaignName: string;
  course: AdCourse;
  language: "es" | "en";
  n: number;
  status: AdBannerStatus;
  angle: string | null;
  template: string;
  layout: string;
  copy: Record<string, string>;
  elements: Record<string, boolean>;
  boton: Record<string, string>;
  imagen: string | null;
  bilingue: boolean;
};

const PAGINA = 48;

/** La pieza, montada sólo cuando está cerca de verse. */
function Miniatura({ it, formato }: { it: ItemGaleria; formato: FormatoId }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const obs = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && setVisible(true), { rootMargin: "400px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);
  const { w, h } = FORMATOS[formato];
  return (
    <div ref={ref} className="axr-bangal__thumb" style={{ aspectRatio: `${w} / ${h}` }}>
      {visible ? (
        <Lienzo
          copy={leerCopy(it.copy)}
          template={it.template as Plantilla}
          course={it.course}
          language={it.language}
          formato={formato}
          imagen={it.imagen}
          elementos={leerElementos(it.elements)}
          composicion={leerComposicion(it.layout)}
          boton={leerBoton(it.boton)}
        />
      ) : null}
    </div>
  );
}

export function Galeria({ items, campanas, copy }: { items: ItemGaleria[]; campanas: { id: string; name: string }[]; copy: BanCopy }) {
  const [campana, setCampana] = useState("");
  const [estado, setEstado] = useState<"" | AdBannerStatus>("");
  const [tipo, setTipo] = useState<"" | "imagen" | "nativo">("");
  const [vista, setVista] = useState<FormatoId>("vertical");
  const [elegidas, setElegidas] = useState<Set<string>>(new Set());
  const [cuantas, setCuantas] = useState(PAGINA);
  const [formatos, setFormatos] = useState<FormatoId[]>([...FORMATO_IDS]);
  const [ambos, setAmbos] = useState(true);
  const [preparando, setPreparando] = useState(false);

  const filtradas = useMemo(
    () =>
      items.filter(
        (it) =>
          (!campana || it.campaignId === campana) &&
          (!estado || it.status === estado) &&
          (!tipo || (tipo === "nativo") === esNativo(it.layout)),
      ),
    [items, campana, estado, tipo],
  );
  useEffect(() => setCuantas(PAGINA), [campana, estado, tipo]);

  const alternar = (id: string) =>
    setElegidas((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  const demasiadas = elegidas.size > MAX_GALERIA;

  return (
    <div className="axr-bangal">
      <div className="axr-pubcard axr-bangal__filters">
        <label>
          <span>{copy.galCampaign}</span>
          <select value={campana} onChange={(e) => setCampana(e.target.value)}>
            <option value="">{copy.galAllCampaigns}</option>
            {campanas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.galStatus}</span>
          <select value={estado} onChange={(e) => setEstado(e.target.value as "" | AdBannerStatus)}>
            <option value="">{copy.galAllStatus}</option>
            {(["aprobado", "borrador", "descartado"] as const).map((s) => (
              <option key={s} value={s}>
                {copy.status[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy.galKind}</span>
          <select value={tipo} onChange={(e) => setTipo(e.target.value as "" | "imagen" | "nativo")}>
            <option value="">{copy.galKindAll}</option>
            <option value="imagen">{copy.galKindImage}</option>
            <option value="nativo">{copy.galKindNative}</option>
          </select>
        </label>
        <div className="axr-bangal__view">
          <span>{copy.galPreview}</span>
          <div className="axr-pv-switch" role="group" aria-label={copy.galPreview}>
            {FORMATO_IDS.map((f) => (
              <button key={f} type="button" aria-pressed={vista === f} onClick={() => setVista(f)}>
                {FORMATOS[f].w}×{FORMATOS[f].h}
              </button>
            ))}
          </div>
        </div>
        <div className="axr-bangal__count">
          <strong>{fill(copy.galCount, filtradas.length)}</strong>
          <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setElegidas((prev) => new Set([...prev, ...filtradas.map((f) => f.id)]))} disabled={!filtradas.length}>
            <Icono n="ok" size={14} /> {fill(copy.galSelectAll, filtradas.length)}
          </button>
          {elegidas.size ? (
            <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setElegidas(new Set())}>
              {copy.galClear}
            </button>
          ) : null}
        </div>
      </div>

      {filtradas.length ? (
        <div className={`axr-bangal__grid axr-bangal__grid--${vista}`}>
          {filtradas.slice(0, cuantas).map((it) => {
            const on = elegidas.has(it.id);
            return (
              <article key={it.id} className={`axr-bangal__card${on ? " is-on" : ""}`}>
                <button type="button" className="axr-bangal__pick" aria-pressed={on} onClick={() => alternar(it.id)} aria-label={`${it.campaignName} · v${it.n}`}>
                  <span className="axr-bangal__check" aria-hidden>
                    {on ? <Icono n="ok" size={14} /> : null}
                  </span>
                  <Miniatura it={it} formato={vista} />
                </button>
                <div className="axr-bangal__meta">
                  <div>
                    <strong title={it.campaignName}>{it.campaignName}</strong>
                    <small>
                      v{it.n} · {copy.layout[leerComposicion(it.layout)]}
                      {it.bilingue ? " · ES+EN" : ""}
                    </small>
                  </div>
                  <span className={`axr-ban-pill axr-ban-pill--${it.status}`}>{copy.status[it.status]}</span>
                </div>
                <div className="axr-bangal__links">
                  <Link href={`/admin/banners/${it.campaignId}`}>{copy.galOpen}</Link>
                  <a href={`/admin/banners/render/${it.id}/${vista}?dl=1`}>
                    <Icono n="descarga" size={13} /> {copy.galPng}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="axr-pubcard axr-adm-empty">{copy.galEmpty}</div>
      )}
      {filtradas.length > cuantas ? (
        <button type="button" className="axr-btn axr-btn--ghost axr-bangal__more" onClick={() => setCuantas((n) => n + PAGINA)}>
          {copy.galMore} ({filtradas.length - cuantas})
        </button>
      ) : null}

      {elegidas.size ? (
        <form
          className="axr-bangal__bar"
          method="post"
          action="/admin/banners/galeria/descargar"
          onSubmit={(e) => {
            if (demasiadas || !formatos.length) {
              e.preventDefault();
              return;
            }
            // La descarga llega sola; el aviso se va al rato.
            setPreparando(true);
            setTimeout(() => setPreparando(false), Math.min(60_000, 4_000 + elegidas.size * 1_500));
          }}
        >
          {[...elegidas].map((id) => (
            <input key={id} type="hidden" name="ids" value={id} />
          ))}
          {formatos.map((f) => (
            <input key={f} type="hidden" name="formatos" value={f} />
          ))}
          <input type="hidden" name="ambos" value={ambos ? "1" : "0"} />
          <strong>{fill(copy.galSelected, elegidas.size)}</strong>
          <div className="axr-bangal__fmts" role="group" aria-label={copy.galFormats}>
            {FORMATO_IDS.map((f) => (
              <label key={f}>
                <input type="checkbox" checked={formatos.includes(f)} onChange={() => setFormatos((p) => (p.includes(f) ? p.filter((x) => x !== f) : FORMATO_IDS.filter((x) => x === f || p.includes(x))))} />
                {FORMATOS[f].label.split(" (")[0]}
              </label>
            ))}
            <label>
              <input type="checkbox" checked={ambos} onChange={(e) => setAmbos(e.target.checked)} />
              {copy.galBothLangs}
            </label>
          </div>
          {demasiadas ? <span className="axr-bangal__warn">{fill(copy.galMax, MAX_GALERIA)}</span> : preparando ? <span className="axr-bangal__note">{copy.galPreparing}</span> : null}
          <button type="submit" className="axr-btn" disabled={demasiadas || !formatos.length}>
            <Icono n="descarga" /> {fill(copy.galDownload, elegidas.size)}
          </button>
        </form>
      ) : null}
    </div>
  );
}
