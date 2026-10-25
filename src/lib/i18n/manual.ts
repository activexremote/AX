import type { Locale } from "@/lib/i18n/config";

// Textos de la página del manual del profesorado (lo que rodea al contenido,
// que está en lib/manual/contenido.ts y va sólo en español).

const es = {
  eyebrow: "Playbook del profesorado",
  title: "Manual del profesor",
  lead: "Cómo preparar, dar y cerrar un módulo, y cómo trabajar con el panel en cada paso. De principio a fin.",
  search: "Buscar en el manual…",
  noResults: "Nada en el manual con esas palabras.",
  index: "Índice",
  print: "Imprimir",
  checks: "{n} de {t} hechas",
  resetChecks: "Desmarcar",
  copy: "Copiar",
  copied: "Copiado",
  go: "Ir",
  when: "Cuándo",
  what: "Qué",
  where: "Dónde",
  onlySpanish: "",
  updated: "Se actualiza con el panel: si una pantalla cambia, cambia este manual.",
};

const en: typeof es = {
  eyebrow: "Teaching playbook",
  title: "Teacher handbook",
  lead: "How to prepare, teach and close a module, and how to use the panel at every step. End to end.",
  search: "Search the handbook…",
  noResults: "Nothing in the handbook matches those words.",
  index: "Contents",
  print: "Print",
  checks: "{n} of {t} done",
  resetChecks: "Clear",
  copy: "Copy",
  copied: "Copied",
  go: "Open",
  when: "When",
  what: "What",
  where: "Where",
  onlySpanish: "The handbook is written in Spanish, the language the faculty teaches in.",
  updated: "It is kept in sync with the panel: when a screen changes, this handbook changes.",
};

export const manualCopy: Record<Locale, typeof es> = { es, en };
export type ManualCopy = typeof es;
