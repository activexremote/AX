import { hasBlocks } from "@/lib/content/blocks";
import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Módulos y lecciones en el idioma del alumno
//
//  Se resuelve aquí, al leer, y no en cada pantalla: así la home, la ficha
//  del módulo, la lección y el progreso cambian de idioma a la vez y ninguna
//  se queda en español por olvido. Si la versión inglesa no existe, se queda
//  la española: mejor una lección en otro idioma que una lección en blanco.
// ══════════════════════════════════════════════════════════

type Localizable = {
  title?: string;
  title_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  subtitle?: string | null;
  subtitle_en?: string | null;
  content_blocks?: unknown;
  content_blocks_en?: unknown;
};

export function localize<T extends Localizable>(row: T, locale: Locale): T {
  if (locale !== "en") return row;
  const out = { ...row };
  if (row.title_en?.trim()) out.title = row.title_en;
  if (row.description_en?.trim()) out.description = row.description_en;
  if (row.subtitle_en?.trim()) out.subtitle = row.subtitle_en;
  if ("content_blocks_en" in row && hasBlocks(row.content_blocks_en)) out.content_blocks = row.content_blocks_en;
  return out;
}
