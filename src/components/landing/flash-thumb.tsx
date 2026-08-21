"use client";

import { useRef, useState } from "react";

import { PlayIcon } from "@/components/landing/flash-icons";

// Miniatura del vídeo en la tarjeta de un curso.
//
// De partida es una imagen de 100 KB, no un vídeo de 2,4 MB: en una rejilla
// de tarjetas, cargar el vídeo de cada una sería tirar megas de alguien que
// todavía no ha decidido ni mirar.
//
// El vídeo se monta al pasar por encima (o al enfocar con el teclado) y se
// reproduce en silencio y en bucle. Es un adelanto, no una clase: para verla
// entera hay que entrar en el curso, que es a donde lleva la tarjeta.
export function FlashThumb({
  poster,
  video,
  alt,
  badge,
}: {
  poster: string;
  video?: string;
  alt: string;
  badge?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  // Sólo cuando se ha pedido: hasta entonces no existe ni la etiqueta <video>,
  // así que el navegador no puede descargarse nada por su cuenta.
  const [armado, setArmado] = useState(false);

  function entrar() {
    if (!video) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (quieto || nav.connection?.saveData) return;
    setArmado(true);
    // Si ya estaba montado, basta con volver a darle.
    void ref.current?.play().catch(() => {});
  }

  function salir() {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  return (
    <span
      className="axr-fthumb"
      onPointerEnter={entrar}
      onPointerLeave={salir}
      onFocus={entrar}
      onBlur={salir}
    >
      <img src={poster} alt={alt} loading="lazy" decoding="async" />
      {armado && video && (
        <video
          ref={ref}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          autoPlay
          aria-hidden
        />
      )}
      <span className="axr-fthumb__play" aria-hidden>
        <PlayIcon size={18} />
      </span>
      {badge && <span className="axr-fthumb__badge">{badge}</span>}
    </span>
  );
}
