"use client";

import { useEffect, useState } from "react";

export type TickerCopy = {
  intro: string;
  seats: string;
  units: { d: string; h: string; m: string; s: string };
};

type Props = {
  copy: TickerCopy;
  /** Fecha de inicio de la convocatoria, en ISO con zona horaria. */
  target: string;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Barra superior de la landing: cuenta atrás hasta el inicio de la
// convocatoria y plazas que quedan. El reloj se calcula sólo en el cliente
// (el servidor no sabe la hora del visitante) — hasta que monta, pinta la
// misma estructura con guiones para que no haya salto de layout.
export function CohortTicker({ copy, target }: Props) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(target).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const parts =
    left === null
      ? [null, null, null, null]
      : [
          Math.floor(left / 86_400_000),
          Math.floor(left / 3_600_000) % 24,
          Math.floor(left / 60_000) % 60,
          Math.floor(left / 1000) % 60,
        ];
  const units = [copy.units.d, copy.units.h, copy.units.m, copy.units.s];

  return (
    <div className="axr-lp__ticker">
      <div className="axr-lp__ticker-inner">
        <span className="axr-lp__ticker-intro">{copy.intro}</span>

        <span className="axr-lp__ticker-clock" role="timer" aria-live="off">
          {parts.map((value, i) => (
            <span key={units[i]} className="axr-lp__ticker-unit">
              <strong>{value === null ? "--" : pad(value)}</strong>
              <em>{units[i]}</em>
            </span>
          ))}
        </span>

        <span className="axr-lp__ticker-seats">
          <span className="axr-lp__ticker-dot" aria-hidden />
          {copy.seats}
        </span>
      </div>
    </div>
  );
}
