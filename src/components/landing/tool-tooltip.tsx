"use client";

import { useEffect, useRef, useState } from "react";

type Bubble = {
  name: string;
  desc: string;
  /** Coordenadas de la ficha que la ha abierto, en el viewport. */
  x: number;
  top: number;
  bottom: number;
  above: boolean;
  max: number;
};

const W = 248;
const GAP = 10;

// La nube de la sección de herramientas. Es la única parte con JavaScript:
// una nube en CSS puro se sale de pantalla en las fichas de los extremos, y
// .axr-lp recorta el desbordamiento horizontal, así que se quedaría invisible.
// Se posiciona en el viewport y se recorta a los bordes.
export function ToolTooltip() {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [bubble, setBubble] = useState<Bubble | null>(null);

  useEffect(() => {
    const section = anchorRef.current?.closest(".axr-tools");
    if (!section) return;

    const open = (el: HTMLElement) => {
      const desc = el.dataset.desc;
      const name = el.dataset.name;
      if (!desc || !name) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Ficha fuera de pantalla: no hay nada que anclar.
      if (r.bottom < 0 || r.top > vh) return;

      const x = Math.min(
        Math.max(8, r.left + r.width / 2 - W / 2),
        Math.max(8, window.innerWidth - W - 8),
      );
      // Se abre hacia el lado con más sitio y se limita a ese hueco, así no
      // se sale por arriba ni por abajo sin tener que medir su altura.
      const above = r.top >= vh - r.bottom;
      setBubble({
        name,
        desc,
        x,
        top: r.top,
        bottom: r.bottom,
        above,
        max: Math.max(64, (above ? r.top : vh - r.bottom) - GAP - 8),
      });
    };

    const onOver = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-desc]");
      if (el) open(el);
    };
    const onOut = (e: Event) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-desc]");
      if (el) setBubble(null);
    };
    const close = () => setBubble(null);

    // pointerover/out delegan bien y cubren ratón y lápiz; el toque entra por
    // focusin, porque en iOS pulsar un <button> le da el foco.
    section.addEventListener("pointerover", onOver);
    section.addEventListener("pointerout", onOut);
    section.addEventListener("focusin", onOver);
    section.addEventListener("focusout", onOut);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);

    return () => {
      section.removeEventListener("pointerover", onOver);
      section.removeEventListener("pointerout", onOut);
      section.removeEventListener("focusin", onOver);
      section.removeEventListener("focusout", onOut);
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, []);

  return (
    <span ref={anchorRef} className="axr-tools__anchor" aria-hidden>
      {bubble && (
        <span
          className="axr-tools__bubble"
          data-above={bubble.above}
          style={
            bubble.above
              ? {
                  left: bubble.x,
                  bottom: window.innerHeight - bubble.top + GAP,
                  maxHeight: bubble.max,
                }
              : { left: bubble.x, top: bubble.bottom + GAP, maxHeight: bubble.max }
          }
        >
          <strong>{bubble.name}</strong>
          <span>{bubble.desc}</span>
        </span>
      )}
    </span>
  );
}
