"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { borrarCarpeta, crearCarpeta, moverBanners, renombrarCarpeta } from "@/app/admin/banners/actions";
import { ElegirCarpeta, type ValorCarpeta } from "@/components/admin/banners/elegir-carpeta";
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
//  de abajo mueve lo elegido a una carpeta o lo descarga en un .zip
//  (galeria/descargar). A la izquierda, las carpetas: filtran, se crean, se
//  renombran y se borran (sin borrar lo que tienen).
// ══════════════════════════════════════════════════════════

export type ItemGaleria = {
  id: string;
  campaignId: string;
  campaignName: string;
  folderId: string | null;
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

/** Las carpetas a la izquierda: filtrar, crear, renombrar y borrar. */
function Carpetas({
  carpetas,
  items,
  actual,
  onElegir,
  copy,
}: {
  carpetas: { id: string; name: string }[];
  items: ItemGaleria[];
  actual: string;
  onElegir: (id: string) => void;
  copy: BanCopy;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [nueva, setNueva] = useState<string | null>(null);
  const [editando, setEditando] = useState<{ id: string; name: string } | null>(null);
  const [borrando, setBorrando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cuenta = (id: string | null) => items.filter((it) => it.folderId === id).length;
  const correr = (fn: () => Promise<{ error?: string; id?: string }>, despues?: (r: { error?: string; id?: string }) => void) =>
    start(async () => {
      setError(null);
      const r = await fn();
      if (r.error) setError(r.error);
      else despues?.(r);
      router.refresh();
    });

  const fila = (id: string, label: string, n: number, extra?: React.ReactNode) => (
    <li key={id || "todas"}>
      <button type="button" className={`axr-bangal__folder${actual === id ? " is-on" : ""}`} onClick={() => onElegir(id)}>
        <Icono n="carpeta" size={15} />
        <span>{label}</span>
        <small>{n}</small>
      </button>
      {extra}
    </li>
  );

  return (
    <aside className="axr-pubcard axr-bangal__folders" aria-label={copy.folders}>
      <strong className="axr-bangal__folders-title">{copy.folders}</strong>
      <ul>
        {fila("", copy.folderAll, items.length)}
        {fila("sin", copy.folderNone, cuenta(null))}
        {carpetas.map((c) =>
          editando?.id === c.id ? (
            <li key={c.id} className="axr-bangal__folder-edit">
              <input
                value={editando.name}
                maxLength={80}
                autoFocus
                onChange={(e) => setEditando({ ...editando, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") correr(() => renombrarCarpeta(c.id, editando.name), () => setEditando(null));
                  if (e.key === "Escape") setEditando(null);
                }}
              />
              <button type="button" className="axr-btn axr-btn--small" disabled={pending} onClick={() => correr(() => renombrarCarpeta(c.id, editando.name), () => setEditando(null))}>
                <Icono n="ok" size={13} />
              </button>
            </li>
          ) : (
            fila(
              c.id,
              c.name,
              cuenta(c.id),
              actual === c.id ? (
                <div className="axr-bangal__folder-acts">
                  {borrando === c.id ? (
                    <>
                      <small>{copy.folderDeleteConfirm}</small>
                      <button type="button" className="axr-btn axr-btn--danger axr-btn--small" disabled={pending} onClick={() => correr(() => borrarCarpeta(c.id), () => onElegir(""))}>
                        {copy.confirmDeleteShort}
                      </button>
                      <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" onClick={() => setBorrando(null)}>
                        {copy.cancel}
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => setEditando({ id: c.id, name: c.name })}>
                        {copy.folderRename}
                      </button>
                      <button type="button" onClick={() => setBorrando(c.id)}>
                        {copy.folderDelete}
                      </button>
                    </>
                  )}
                </div>
              ) : null,
            )
          ),
        )}
      </ul>
      {nueva === null ? (
        <button type="button" className="axr-bangal__folder-new" onClick={() => setNueva("")}>
          {copy.folderNew.replace("…", "")}
        </button>
      ) : (
        <div className="axr-bangal__folder-edit">
          <input
            value={nueva}
            maxLength={80}
            autoFocus
            placeholder={copy.folderNewPh}
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nueva.trim()) correr(() => crearCarpeta(nueva), (r) => { setNueva(null); if (r.id) onElegir(r.id); });
              if (e.key === "Escape") setNueva(null);
            }}
          />
          <button type="button" className="axr-btn axr-btn--small" disabled={pending || !nueva.trim()} onClick={() => correr(() => crearCarpeta(nueva), (r) => { setNueva(null); if (r.id) onElegir(r.id); })}>
            {copy.folderCreate}
          </button>
        </div>
      )}
      {error ? <div className="axr-login__error">{error}</div> : null}
    </aside>
  );
}

export function Galeria({
  items,
  campanas,
  carpetas,
  copy,
}: {
  items: ItemGaleria[];
  campanas: { id: string; name: string }[];
  carpetas: { id: string; name: string }[];
  copy: BanCopy;
}) {
  const router = useRouter();
  const [moviendo, startMover] = useTransition();
  const [carpeta, setCarpeta] = useState("");
  const [destino, setDestino] = useState<ValorCarpeta>({ v: "", nueva: "" });
  const [aviso, setAviso] = useState<string | null>(null);
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
          (!carpeta || (carpeta === "sin" ? !it.folderId : it.folderId === carpeta)) &&
          (!campana || it.campaignId === campana) &&
          (!estado || it.status === estado) &&
          (!tipo || (tipo === "nativo") === esNativo(it.layout)),
      ),
    [items, carpeta, campana, estado, tipo],
  );
  useEffect(() => setCuantas(PAGINA), [carpeta, campana, estado, tipo]);

  const mover = () =>
    startMover(async () => {
      setAviso(null);
      const r = await moverBanners([...elegidas], destino.v === "nueva" ? { nueva: destino.nueva } : { id: destino.v || null });
      if (r.error) setAviso(r.error);
      else {
        const nombre = r.id ? (carpetas.find((c) => c.id === r.id)?.name ?? destino.nueva) : copy.folderNone;
        setAviso(fill(copy.moved, nombre));
        setElegidas(new Set());
        setDestino({ v: "", nueva: "" });
      }
      router.refresh();
    });

  const alternar = (id: string) =>
    setElegidas((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  const demasiadas = elegidas.size > MAX_GALERIA;

  return (
    <div className="axr-bangal axr-bangal--carpetas">
      <Carpetas carpetas={carpetas} items={items} actual={carpeta} onElegir={setCarpeta} copy={copy} />
      <div className="axr-bangal__main">
      {aviso ? <div className="axr-adm-note">{aviso}</div> : null}
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
          <div className="axr-bangal__move">
            <ElegirCarpeta carpetas={carpetas} value={destino} onChange={setDestino} copy={copy} label={copy.moveTo} />
            <button type="button" className="axr-btn axr-btn--ghost axr-btn--small" disabled={moviendo || (destino.v === "nueva" && !destino.nueva.trim())} onClick={mover}>
              <Icono n="carpeta" size={14} /> {copy.moveGo}
            </button>
          </div>
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
    </div>
  );
}
