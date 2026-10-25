import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

// ══════════════════════════════════════════════════════════
//  Las fuentes de la pieza en PNG
//
//  La pieza (pieza.tsx) la pinta `next/og` (Satori) en el servidor y el
//  editor en el navegador. Aquí sólo queda lo que necesita el servidor: Inter
//  estática leída del repositorio (fonts/), porque Satori no entiende fuentes
//  variables. next.config.ts las incluye en las funciones que las usan.
// ══════════════════════════════════════════════════════════

export { Banner, type Pieza } from "@/lib/banners/pieza";

const FONTS_DIR = path.join(process.cwd(), "src/lib/banners/fonts");

let fontsCache: Promise<{ name: string; data: Buffer; weight: 500 | 700 | 800; style: "normal" }[]> | null = null;

export function fuentes() {
  fontsCache ??= Promise.all(
    ([500, 700, 800] as const).map(async (weight) => ({
      name: "Inter",
      data: await readFile(path.join(FONTS_DIR, `Inter-${weight}.ttf`)),
      weight,
      style: "normal" as const,
    })),
  );
  return fontsCache;
}
