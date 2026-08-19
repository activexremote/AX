"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  /** Línea de contexto: la misma convocatoria que anuncia el ticker. */
  note: string;
  cta: string;
};

// Barra de conversión del móvil. Aparece cuando el héroe (con su formulario)
// sale de pantalla y se esconde otra vez al llegar al formulario final: si no,
// taparía justo el bloque al que quiere llevarte.
export function LandingCtaBar({ note, cta }: Props) {
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const hero = document.querySelector(".axr-lp__hero");
    const form = document.getElementById("solicitar");

    // Un observador por objetivo: sólo interesa "hay algo de esto en pantalla".
    const watch = (el: Element | null, set: (v: boolean) => void) => {
      if (!el) return undefined;
      const io = new IntersectionObserver(
        ([entry]) => set(entry.isIntersecting),
        { threshold: 0 },
      );
      io.observe(el);
      return io;
    };

    // Sin formulario al que llevar (páginas legales), no hay barra: sería un
    // botón fijo tapando texto y sin destino.
    if (!form) {
      setFormVisible(true);
      return;
    }

    const a = watch(hero, setHeroVisible);
    const b = watch(form, setFormVisible);
    // Sin héroe pero con formulario, la barra puede aparecer desde el principio.
    if (!hero) setHeroVisible(false);

    return () => {
      a?.disconnect();
      b?.disconnect();
    };
  }, []);

  const show = mounted && !heroVisible && !formVisible;

  // El nav no debe repetir el mismo CTA mientras la barra está abajo: se
  // marca en el <body> y lo resuelve el CSS, sin pasar estado entre islas.
  useEffect(() => {
    document.body.dataset.ctaBar = show ? "true" : "false";
    return () => {
      delete document.body.dataset.ctaBar;
    };
  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <div className="axr-lp__cta-bar" data-show={show} aria-hidden={!show}>
      <div className="axr-lp__cta-bar-inner">
        <span className="axr-lp__cta-bar-note">{note}</span>
        <a href="#solicitar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
          {cta}
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>,
    document.body,
  );
}
