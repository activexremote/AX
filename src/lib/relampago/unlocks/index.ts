import { PROMPT_PACK } from "@/lib/relampago/unlocks/prompt-pack";
import { RESEARCH_HACK } from "@/lib/relampago/unlocks/research-hack";
import { SHIP_CHECKLIST } from "@/lib/relampago/unlocks/ship-checklist";
import { STARTER_TEMPLATE } from "@/lib/relampago/unlocks/starter-template";
import { TOOL_PERKS } from "@/lib/relampago/unlocks/tool-perks";

// ══════════════════════════════════════════════════════════
//  El contenido de los desbloqueos
//
//  Va en módulos TypeScript y NO en archivos sueltos de public/ por una razón
//  concreta: lo que está en public/ lo sirve el servidor de estáticos a
//  cualquiera que adivine la URL, y estos materiales son justamente lo que se
//  gana terminando el curso. Aquí sólo salen por una ruta que comprueba antes
//  quién pregunta.
//
//  De paso, así van dentro del bundle y no dependen de que el sistema de
//  archivos exista en el entorno donde corra la app.
// ══════════════════════════════════════════════════════════

export const UNLOCK_CONTENT: Record<string, string> = {
  "web-abc-starter-template": STARTER_TEMPLATE,
  "web-abc-research-hack": RESEARCH_HACK,
  "web-abc-prompt-pack": PROMPT_PACK,
  "web-abc-tool-perks": TOOL_PERKS,
  "web-abc-ship-checklist": SHIP_CHECKLIST,
};

export function unlockContent(key: string): string | null {
  return UNLOCK_CONTENT[key] ?? null;
}

/** Nombre del archivo al descargarlo. */
export function unlockFilename(key: string): string {
  return `${key}.md`;
}
