import type { Block } from "@/lib/content/blocks";

// Los enlaces del material de una lección: cada elemento de sus bloques de
// recursos (lecturas, vídeos, descargas). Son los que hay que abrir para
// darla por terminada.

export type Recurso = { url: string; label: string };

export function recursosDe(blocks: Block[]): Recurso[] {
  const vistos = new Set<string>();
  const out: Recurso[] = [];
  for (const b of blocks) {
    if (b.t !== "resources") continue;
    for (const r of b.items) {
      const url = r.url?.trim();
      if (!url || vistos.has(url)) continue;
      vistos.add(url);
      out.push({ url, label: r.label });
    }
  }
  return out;
}

/** La dirección que apunta la apertura y lleva al recurso. */
export const enlaceRecurso = (lessonId: string, url: string) => `/recurso?l=${encodeURIComponent(lessonId)}&u=${encodeURIComponent(url)}`;
