"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";

export type BloqueoDescargas = {
  /** Cuándo se abren, en ISO: el inicio de la clase. */
  desde: string;
  /** La hora del servidor al pintar, para que el contador salga ya con números. */
  servidor: number;
  /** «Se podrán descargar cuando empiece la clase: sábado, 21 de noviembre, a las 09:30 (hora de Madrid).» */
  aviso: string;
  /** Las unidades del contador: días, horas, minutos, segundos. */
  unidades: [string, string, string, string];
  etiqueta: string;
};

/**
 * La cuenta atrás de las descargas bloqueadas. Los enlaces no están en la
 * página (el servidor no los pinta hasta la hora), así que al llegar a cero
 * no basta con quitar el candado: se vuelve a pedir la página al servidor y
 * llega ya con los archivos.
 */
export function CuentaDescargas({ desde, servidor, aviso, unidades, etiqueta }: BloqueoDescargas) {
  const router = useRouter();
  const [ahora, setAhora] = useState(servidor);
  const inicio = new Date(desde).getTime();
  const falta = Math.max(0, inicio - ahora);
  const abierta = falta === 0;

  useEffect(() => {
    setAhora(Date.now());
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (abierta) router.refresh();
  }, [abierta, router]);

  const partes = [
    Math.floor(falta / 86_400_000),
    Math.floor(falta / 3_600_000) % 24,
    Math.floor(falta / 60_000) % 60,
    Math.floor(falta / 1000) % 60,
  ];

  return (
    <div className="axr-blk__locked">
      <p>
        <Icono n="reloj" size={16} />
        <span>{aviso}</span>
      </p>
      <div className="axr-blk__locked-count" role="timer" aria-label={etiqueta}>
        {partes.map((n, i) => (
          <span key={unidades[i]}>
            <strong suppressHydrationWarning>{String(n).padStart(2, "0")}</strong>
            <small>{unidades[i]}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
