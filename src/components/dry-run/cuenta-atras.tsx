"use client";

import { useEffect, useState } from "react";

/**
 * Cuenta atrás hasta el inicio de la sesión. Sale ya con los números desde el
 * servidor (`servidor` es su hora al pintar la página), y en cuanto el
 * navegador hidrata sigue con su propio reloj. Antes enseñaba guiones hasta
 * hidratar, y en un móvil lento eso eran varios segundos de «-- -- --».
 * Durante la clase dice «En directo ahora»; después, nada.
 */
export function CuentaAtras({ inicio, fin, servidor }: { inicio: string; fin: string; servidor: number }) {
  const [ahora, setAhora] = useState<number>(servidor);

  useEffect(() => {
    setAhora(Date.now());
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const a = new Date(inicio).getTime();
  const b = new Date(fin).getTime();

  if (ahora >= b) return null;
  if (ahora >= a) {
    return (
      <p className="axr-dr-count axr-dr-count--live">
        <span className="axr-dr-count__dot" aria-hidden /> En directo ahora
      </p>
    );
  }

  const falta = Math.max(0, a - ahora);
  const partes: [string, number][] = [
    ["días", Math.floor(falta / 86_400_000)],
    ["horas", Math.floor(falta / 3_600_000) % 24],
    ["min", Math.floor(falta / 60_000) % 60],
    ["seg", Math.floor(falta / 1000) % 60],
  ];

  return (
    <div className="axr-dr-count" role="timer" aria-label="Tiempo hasta el inicio de la clase">
      {partes.map(([etiqueta, n]) => (
        <div key={etiqueta} className="axr-dr-count__cell">
          <strong suppressHydrationWarning>{String(n).padStart(2, "0")}</strong>
          <span>{etiqueta}</span>
        </div>
      ))}
    </div>
  );
}
