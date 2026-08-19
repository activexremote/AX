"use client";

import { useEffect, useRef, useState } from "react";

import type { ModelCopy } from "@/app/cursos/signature";

// Comparativa de modelo de negocio (sólo Remote Founder). Dos columnas
// enfrentadas fila a fila, y una barra que mide lo único que importa: cuánto
// del ingreso deja de depender de las horas. La barra crece al entrar en
// pantalla, así el contraste se ve antes de leerse.
export function CourseModel({ copy }: { copy: ModelCopy }) {
  const ref = useRef<HTMLDivElement>(null);
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

  const columns = [
    { data: copy.before, variant: "before" as const },
    { data: copy.after, variant: "after" as const },
  ];

  return (
    <div className="axr-model" ref={ref} data-on={on}>
      <div className="axr-model__cols">
        {columns.map(({ data, variant }) => (
          <article key={variant} className="axr-model__col" data-variant={variant}>
            <span className="axr-model__tag">{data.tag}</span>
            <h3>{data.title}</h3>
            <p className="axr-model__desc">{data.desc}</p>

            <dl className="axr-model__rows">
              {data.rows.map((row, i) => (
                <div key={row} className="axr-model__row">
                  <dt>{copy.rowLabels[i]}</dt>
                  <dd>{row}</dd>
                </div>
              ))}
            </dl>

            <div className="axr-model__meter">
              <span className="axr-model__meter-label">{copy.leverageLabel}</span>
              <span className="axr-model__meter-track">
                <span
                  className="axr-model__meter-fill"
                  style={{ width: on ? `${data.leverage}%` : "0%" }}
                />
              </span>
              <strong className="axr-model__meter-value">{data.leverage}%</strong>
            </div>

            <p className="axr-model__ceiling">
              <em>{copy.ceilingLabel}</em>
              {data.ceiling}
            </p>
          </article>
        ))}
      </div>

      <p className="axr-model__close">{copy.close}</p>
    </div>
  );
}
