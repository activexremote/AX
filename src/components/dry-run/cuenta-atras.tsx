"use client";

import { useEffect, useState } from "react";

/**
 * Cuenta atrás hasta el inicio de la sesión. En el servidor (y hasta que el
 * navegador hidrata) enseña guiones, para no pintar una hora que ya no vale.
 * Durante la clase dice «En directo ahora»; después, nada.
 */
export function CuentaAtras({ inicio, fin }: { inicio: string; fin: string }) {
  const [ahora, setAhora] = useState<number | null>(null);

  useEffect(() => {
    setAhora(Date.now());
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const a = new Date(inicio).getTime();
  const b = new Date(fin).getTime();

  if (ahora !== null && ahora >= b) return null;
  if (ahora !== null && ahora >= a) {
    return (
      <p className="axr-dr-count axr-dr-count--live">
        <span className="axr-dr-count__dot" aria-hidden /> En directo ahora
      </p>
    );
  }

  const falta = ahora === null ? null : Math.max(0, a - ahora);
  const partes: [string, number | null][] = [
    ["días", falta === null ? null : Math.floor(falta / 86_400_000)],
    ["horas", falta === null ? null : Math.floor(falta / 3_600_000) % 24],
    ["min", falta === null ? null : Math.floor(falta / 60_000) % 60],
    ["seg", falta === null ? null : Math.floor(falta / 1000) % 60],
  ];

  return (
    <div className="axr-dr-count" role="timer" aria-label="Tiempo hasta el inicio de la clase">
      {partes.map(([etiqueta, n]) => (
        <div key={etiqueta} className="axr-dr-count__cell">
          <strong suppressHydrationWarning>{n === null ? "--" : String(n).padStart(2, "0")}</strong>
          <span>{etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
