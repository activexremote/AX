"use client";

import { useEffect, useRef, useState } from "react";

import { PlayIcon } from "@/components/landing/flash-icons";

// El vídeo de la cabecera del curso.
//
// Arranca solo, en silencio y en bucle: es una MUESTRA, no una clase. Un
// vídeo que se mueve dice «esto es un curso en vídeo» antes de que nadie lea
// una palabra, que es exactamente lo que tiene que hacer la cabecera de una
// página que recibe tráfico de anuncios.
//
// Al pulsarlo pasa a ser un vídeo de verdad: sonido y controles. Ese es el
// único momento en que puede sonar algo, porque un vídeo que empieza a sonar
// solo hace que la gente cierre la pestaña, no que se quede.
export function FlashVideo({
  src,
  poster,
  label,
}: {
  src: string;
  /** Primer fotograma. Se pinta mientras llega el vídeo y se queda si el
   *  navegador bloquea la reproducción automática. */
  poster?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // Quien pide menos movimiento no recibe un bucle en la cabecera. Se queda
    // el primer fotograma, que sigue enseñando de qué va el vídeo.
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Y con ahorro de datos activado tampoco: son 2,4 MB que nadie ha pedido.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (quieto || nav.connection?.saveData) return;

    // `play()` devuelve una promesa que el navegador puede rechazar (política
    // de reproducción automática, pestaña en segundo plano). No es un error:
    // si se rechaza, queda el póster y el botón de play, que es el plan B.
    v.play().catch(() => {});
  }, []);

  function activar() {
    const v = ref.current;
    if (!v) return;
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.currentTime = 0;
    void v.play();
    setPlaying(true);
  }

  return (
    <div className="axr-flash__video" data-playing={playing}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        // Sin `controls` de partida: en modo muestra no hay nada que
        // controlar, y una barra de reproducción sobre un bucle de diez
        // segundos sólo ensucia la cabecera.
        aria-label={label}
      />
      {!playing && (
        <button type="button" className="axr-flash__video-play" onClick={activar}>
          <PlayIcon size={22} />
          <span>{label}</span>
        </button>
      )}
    </div>
  );
}
