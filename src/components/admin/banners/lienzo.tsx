"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { FORMATOS } from "@/lib/banners/formatos";
import { Banner, type CampoTexto, type Pieza } from "@/lib/banners/pieza";

// ══════════════════════════════════════════════════════════
//  La pieza en el navegador
//
//  El mismo componente que pinta el PNG (lib/banners/pieza.tsx), a tamaño
//  real (1080 px de ancho) y reducido con `transform` al hueco que tenga.
//  Así las proporciones, los saltos de línea y los tamaños son los del PNG,
//  no una imitación.
// ══════════════════════════════════════════════════════════

/** La tipografía de la app (next/font): la misma Inter que usa Satori. */
const FUENTE = "var(--font-inter), Inter, system-ui, sans-serif";

export function Lienzo(p: Omit<Pieza, "fuente">) {
  const caja = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(0);
  const { w, h } = FORMATOS[p.formato];

  useLayoutEffect(() => {
    const el = caja.current;
    if (!el) return;
    const medir = () => setEscala(el.clientWidth / w);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={caja} className="axr-ban-lienzo" style={{ aspectRatio: `${w} / ${h}` }}>
      {escala ? (
        <div style={{ width: w, height: h, transform: `scale(${escala})`, transformOrigin: "0 0" }}>
          <Banner {...p} fuente={FUENTE} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Un texto de la pieza que se edita en el sitio: clic, escribir, Intro o
 * clic fuera. No es un input: es el propio texto de la pieza, con su
 * tipografía y su tamaño, para que se vea exactamente lo que va a salir.
 *
 * No controlado mientras se escribe (si React reescribiera el texto en cada
 * tecla, el cursor saltaría al principio): el valor de fuera sólo se aplica
 * cuando no tiene el foco.
 */
export function Editable({
  campo,
  valor,
  placeholder,
  onChange,
  onEnter,
  foco,
}: {
  campo: CampoTexto;
  valor: string;
  placeholder: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
  /** Recién creado (un punto nuevo): entra ya con el cursor dentro. */
  foco?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (foco) ref.current?.focus();
  }, [foco]);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== valor) el.textContent = valor;
  }, [valor]);

  return (
    <span
      ref={ref}
      className={`axr-ban-edit axr-ban-edit--${campo}`}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={placeholder}
      data-ph={placeholder}
      spellCheck
      onInput={(e) => onChange((e.currentTarget.textContent ?? "").replace(/\s*\n\s*/g, " "))}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (onEnter) onEnter();
          else e.currentTarget.blur();
        }
        if (e.key === "Escape") e.currentTarget.blur();
      }}
      onBlur={(e) => {
        // Al salir, el texto queda limpio (sin espacios de más) y a la vista.
        const limpio = (e.currentTarget.textContent ?? "").replace(/\s+/g, " ").trim();
        if (limpio !== valor) onChange(limpio);
        e.currentTarget.textContent = limpio;
      }}
    />
  );
}
