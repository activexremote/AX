"use client";

import { useEffect, useState } from "react";

// Botón para bajarse el material en Markdown.
//
// El archivo se construye en el navegador a partir del texto que ya está en la
// página: no hace falta una ruta aparte que sirva el archivo, y sobre todo no
// hace falta un archivo en public/ que cualquiera pudiera pedir sin haberlo
// ganado. Lo que no está en la página no se puede descargar.
export function UnlockDownload({
  filename,
  content,
  label,
}: {
  filename: string;
  content: string;
  label: string;
}) {
  const [href, setHref] = useState<string | null>(null);

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
    <a className="axr-btn axr-btn--primary axr-unlock__dl" href={href} download={filename}>
      {label}
    </a>
  );
}
