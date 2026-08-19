"use client";

import { useEffect, useRef, useState } from "react";

import type { LandingCopy } from "@/app/bienvenida/copy";

type StepsCopy = LandingCopy["steps"];

// Cronograma de la convocatoria. La animación es por scroll: cada hito se
// revela al entrar en pantalla y la línea de la izquierda se va llenando
// hasta el último hito visible, así se lee como una barra de progreso del
// propio programa.
//
// Sin animaciones de scroll de CSS a propósito: `animation-timeline` todavía
// no está en Safari, y esto tiene que verse igual en un iPhone.
export function Roadmap({ copy }: { copy: StepsCopy }) {
  const listRef = useRef<HTMLOListElement>(null);
  const [seen, setSeen] = useState<number>(-1);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = [...list.querySelectorAll<HTMLElement>(".axr-road__step")];

    // Con "menos movimiento" no hay revelado: todo visible desde el principio.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSeen(items.length - 1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = items.indexOf(entry.target as HTMLElement);
          // Sólo avanza: al subir de nuevo, lo ya revelado se queda.
          setSeen((prev) => (i > prev ? i : prev));
        }
      },
      // El hito se enciende cuando llega al tercio inferior de la pantalla.
      { rootMargin: "0px 0px -25% 0px", threshold: 0.01 },
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const total = copy.items.length;
  // La línea llega hasta el centro del último hito revelado.
  const progress = seen < 0 ? 0 : ((seen + 0.5) / total) * 100;

  return (
    <div className="axr-road">
      <div className="axr-road__total">
        <span className="axr-road__total-label">{copy.totalLabel}</span>
        <strong>{copy.total}</strong>
      </div>

      <ol className="axr-road__list" ref={listRef}>
        {/* Carril y relleno: decorativos, el orden real lo da la lista. */}
        <span className="axr-road__rail" aria-hidden>
          <span className="axr-road__rail-fill" style={{ height: `${progress}%` }} />
        </span>

        {copy.items.map((step, i) => (
          <li
            key={step.n}
            className="axr-road__step"
            data-on={i <= seen}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="axr-road__dot" aria-hidden>
              {step.n}
            </span>

            <div className="axr-road__card">
              <div className="axr-road__meta">
                <span className="axr-road__phase">{step.phase}</span>
                <span className="axr-road__when">{step.when}</span>
                <span className="axr-road__tag">{step.meta}</span>
              </div>

              <h3>{step.title}</h3>
              <p className="axr-road__desc">{step.desc}</p>

              <div className="axr-road__detail">
                <div className="axr-road__does">
                  <span className="axr-road__label">{copy.doesLabel}</span>
                  <ul>
                    {step.does.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="axr-road__gets">
                  <span className="axr-road__label">{copy.getsLabel}</span>
                  <p>{step.gets}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
