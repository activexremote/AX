"use client";

import { useEffect, useRef, useState } from "react";

import type { FunnelCopy } from "@/app/cursos/signature";

// Embudo de una candidatura remota internacional (sólo Remote Professional).
// Las barras se estrechan con la caída real y las cifras cuentan hacia arriba
// al entrar en pantalla: el objetivo es que se vea el desplome de 1.000 a 1
// antes de leer una sola palabra.
export function CourseFunnel({ copy }: { copy: FunnelCopy }) {
  const ref = useRef<HTMLOListElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setOn(true),
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = copy.stages[0]!.value;

  return (
    <ol className="axr-funnel" ref={ref} data-on={on}>
      {copy.stages.map((stage, i) => {
        // Escala de raíz cuadrada: con escala lineal las cuatro últimas
        // etapas serían indistinguibles del cero y no se leería nada.
        const width = Math.max(9, Math.sqrt(stage.value / max) * 100);
        return (
          <li
            key={stage.label}
            className="axr-funnel__stage"
            style={{ "--w": `${width}%`, "--i": i } as React.CSSProperties}
          >
            <div className="axr-funnel__bar">
              {/* La cifra va fuera de la barra: dentro quedaba en blanco sobre
                  blanco mientras la barra estaba sin desplegar. */}
              <span className="axr-funnel__value">
                <strong>{stage.value.toLocaleString("es-ES")}</strong>
                <em>{copy.ofLabel}</em>
              </span>
              <span className="axr-funnel__track">
                <span className="axr-funnel__fill" />
              </span>
            </div>

            <div className="axr-funnel__text">
              <strong>{stage.label}</strong>
              <p>{stage.desc}</p>
              <span className="axr-funnel__fix">
                <em>{copy.fixLabel}</em>
                {stage.fix}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
