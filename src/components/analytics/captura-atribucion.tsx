"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { captureAttribution } from "@/lib/analytics/atribucion";

// Guarda los `utm_*` y los identificadores de clic de cada página pública
// (ver lib/analytics/atribucion.ts). Por ruta y no sólo al montar: entre
// páginas de la web se navega sin recargar.
export function CapturaAtribucion() {
  const pathname = usePathname();
  useEffect(() => captureAttribution(), [pathname]);
  return null;
}
