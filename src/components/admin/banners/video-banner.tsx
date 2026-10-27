"use client";

import { useEffect, useRef, useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { animar, DURACIONES_VIDEO, ESTILOS_VIDEO, estiloDeVariante, type DuracionVideo, type EstiloVideo } from "@/lib/banners/animacion";
import type { BannerCopy, Composicion, FormatoId } from "@/lib/banners/formatos";
import type { Animar } from "@/lib/banners/pieza";
import type { BanCopy } from "@/lib/i18n/banners";

// ══════════════════════════════════════════════════════════
//  El vídeo de una variante
//
//  «Ver animación» mueve la pieza del editor al momento, en el navegador, con
//  la misma animación que el MP4 (lib/banners/animacion.ts). «Descargar MP4»
//  se lo pide al servidor, que pinta los fotogramas: tarda un poco, así que se
//  baja entero y luego se guarda, con su aviso mientras tanto.
// ══════════════════════════════════════════════════════════

export function VideoBanner({
  bannerId,
  posicion,
  formato,
  alt,
  sucio,
  copy,
  composicion,
  textos,
  onAnim,
}: {
  bannerId: string;
  posicion: number;
  formato: FormatoId;
  alt: boolean;
  sucio: boolean;
  copy: BanCopy;
  composicion: Composicion;
  textos: BannerCopy;
  /** Cada fotograma de la animación, para la pieza del editor; `undefined` al parar. */
  onAnim: (a: Animar | undefined) => void;
}) {
  const [estilo, setEstilo] = useState<EstiloVideo>(() => estiloDeVariante(posicion));
  const [segundos, setSegundos] = useState<DuracionVideo>(6);
  const [jugando, setJugando] = useState(false);
  const [haciendo, setHaciendo] = useState(false);
  const [error, setError] = useState(false);
  const plan = useRef({ estilo, segundos, composicion, copy: textos });
  plan.current = { estilo, segundos, composicion, copy: textos };
  const aviso = useRef(onAnim);
  aviso.current = onAnim;

  useEffect(() => {
    if (!jugando) return;
    let raf = 0;
    const t0 = performance.now();
    const paso = (ahora: number) => {
      const t = (ahora - t0) / 1000;
      if (t > plan.current.segundos) {
        setJugando(false);
        return;
      }
      aviso.current(animar(plan.current, t));
      raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => {
      cancelAnimationFrame(raf);
      aviso.current(undefined);
    };
  }, [jugando]);

  async function descargar() {
    setHaciendo(true);
    setError(false);
    try {
      const url = `/admin/banners/video/${bannerId}/${formato}?e=${estilo}&s=${segundos}&dl=1${alt ? "&lang=alt" : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const nombre = /filename="([^"]+)"/.exec(res.headers.get("Content-Disposition") ?? "")?.[1] ?? "banner.mp4";
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = nombre;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
    } catch {
      setError(true);
    } finally {
      setHaciendo(false);
    }
  }

  return (
    <details className="axr-ban-pop axr-ban-video">
      <summary className="axr-btn axr-btn--ghost">
        <Icono n="play" /> {copy.video}
      </summary>
      <div className="axr-ban-pop__body">
        <small>{copy.videoHint}</small>
        <strong className="axr-ban-video__label">{copy.videoStyleLabel}</strong>
        <div className="axr-ban-video__chips" role="radiogroup" aria-label={copy.videoStyleLabel}>
          {ESTILOS_VIDEO.map((k) => (
            <button key={k} type="button" role="radio" aria-checked={estilo === k} onClick={() => setEstilo(k)}>
              {copy.videoStyle[k]}
            </button>
          ))}
        </div>
        <strong className="axr-ban-video__label">{copy.videoLength}</strong>
        <div className="axr-ban-video__chips" role="radiogroup" aria-label={copy.videoLength}>
          {DURACIONES_VIDEO.map((s) => (
            <button key={s} type="button" role="radio" aria-checked={segundos === s} onClick={() => setSegundos(s)}>
              {s} s
            </button>
          ))}
        </div>
        <div className="axr-ban-video__acciones">
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setJugando((j) => !j)}>
            <Icono n="play" /> {jugando ? copy.videoStop : copy.videoPlay}
          </button>
          <button type="button" className="axr-btn" disabled={haciendo || sucio} title={sucio ? copy.unsaved : undefined} onClick={descargar}>
            <Icono n="descarga" /> {copy.videoDownload}
          </button>
        </div>
        {haciendo ? (
          <small className="axr-ban-video__estado" role="status">
            <Icono n="chispa" size={14} /> {copy.videoMaking}
          </small>
        ) : null}
        {error ? <small className="axr-ban-danger">{copy.videoError}</small> : null}
      </div>
    </details>
  );
}
