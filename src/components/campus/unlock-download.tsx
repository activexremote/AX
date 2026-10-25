"use client";

import { useEffect, useState } from "react";

import { Icono } from "@/components/admin/publicaciones/iconos";

// Botones para llevarse el material: descargarlo en Markdown o copiarlo.
//
// El archivo se construye en el navegador a partir del texto que ya está en la
// página: no hace falta una ruta aparte que sirva el archivo, y sobre todo no
// hace falta un archivo en public/ que cualquiera pudiera pedir sin haberlo
// ganado. Lo que no está en la página no se puede descargar.
export function UnlockDownload({
  filename,
  content,
  label,
  copyLabel,
  copiedLabel,
}: {
  filename: string;
  content: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [href, setHref] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setHref(url);
    // Sin esto, cada visita deja un blob colgado en memoria hasta recargar.
    return () => URL.revokeObjectURL(url);
  }, [content]);

  // Hasta que el blob existe no se pinta un enlace que no llevaría a nada.
  if (!href) return null;

  return (
    <div className="axr-unlock__actions">
      <a className="axr-btn axr-btn--primary" href={href} download={filename}>
        <Icono n="descarga" /> {label}
      </a>
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(content);
            setCopiado(true);
            setTimeout(() => setCopiado(false), 1800);
          } catch {
            /* sin permiso de portapapeles: queda la descarga */
          }
        }}
      >
        <Icono n={copiado ? "ok" : "capas"} /> {copiado ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}
