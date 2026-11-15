import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Textos del dry run que ve el alumno dentro del campus
//
//  El aviso de la portada y el formulario de feedback. El panel
//  (/admin/dry-run) tiene los suyos en lib/i18n/dry-run.ts. Como el resto de
//  diccionarios: ES define el tipo y EN lo cumple; las plantillas llevan {n}
//  (o {a}/{b}) y se rellenan con `fmt` de dictionaries.ts.
// ══════════════════════════════════════════════════════════

const es = {
  // ── Aviso de la portada ──
  bannerFeedbackTitle: "¿Qué te pareció el dry run?",
  bannerFeedbackBody: "Déjanos tu feedback: son tres minutos.",
  bannerFeedbackCta: "Dejar mi feedback",
  bannerPrep: "Preparación: {a} de {b}",
  bannerPrepCta: "Ir a mi preparación",

  // ── Formulario de feedback ──
  fbNps: "¿Con qué probabilidad recomendarías este curso a alguien como tú? (0 = nada, 10 = seguro)",
  fbRates: "Valora de 1 (mal) a 5 (muy bien)",
  fbRateClase: "La dinámica de la clase",
  fbRateRitmo: "El ritmo y la duración",
  fbRateContenido: "El contenido del módulo",
  fbRateDocente: "El docente",
  fbRateCampus: "El campus (lecciones, material, asistente)",
  fbWouldPay: "Si el curso completo estuviera abierto, ¿lo harías?",
  fbYes: "Sí",
  fbMaybe: "Quizá",
  fbNo: "No",
  fbLiked: "Lo que más te ha servido",
  fbChange: "Lo que cambiarías o te ha sobrado",
  fbOther: "Cualquier otra cosa (el campus, Classroom, los correos…)",
  fbSending: "Enviando…",
  fbUpdate: "Actualizar mi feedback",
  fbSend: "Enviar mi feedback",
  fbThanks: "¡Gracias! Lo hemos recibido. Puedes cambiarlo cuando quieras.",

  // ── Errores de las acciones (preparacion/actions.ts) ──
  errSession: "Tu sesión ha caducado. Vuelve a entrar.",
  errNoSeat: "No encontramos tu plaza.",
  errNps: "Falta la nota de 0 a 10.",
  errSave: "No se pudo guardar. Inténtalo otra vez.",
  errGeneric: "Algo ha fallado. Inténtalo otra vez.",
};

export type DryRunCampusCopy = typeof es;

const en: DryRunCampusCopy = {
  bannerFeedbackTitle: "How was the dry run?",
  bannerFeedbackBody: "Leave us your feedback: it takes three minutes.",
  bannerFeedbackCta: "Leave my feedback",
  bannerPrep: "Preparation: {a} of {b}",
  bannerPrepCta: "Go to my preparation",

  fbNps: "How likely are you to recommend this course to someone like you? (0 = not at all, 10 = definitely)",
  fbRates: "Rate from 1 (poor) to 5 (very good)",
  fbRateClase: "How the class was run",
  fbRateRitmo: "The pace and length",
  fbRateContenido: "The module content",
  fbRateDocente: "The teacher",
  fbRateCampus: "The campus (lessons, materials, assistant)",
  fbWouldPay: "If the full course were open, would you take it?",
  fbYes: "Yes",
  fbMaybe: "Maybe",
  fbNo: "No",
  fbLiked: "What helped you most",
  fbChange: "What you would change or leave out",
  fbOther: "Anything else (the campus, Classroom, the emails…)",
  fbSending: "Sending…",
  fbUpdate: "Update my feedback",
  fbSend: "Send my feedback",
  fbThanks: "Thank you! We've received it. You can change it whenever you like.",

  errSession: "Your session has expired. Please sign in again.",
  errNoSeat: "We couldn't find your seat.",
  errNps: "The 0 to 10 score is missing.",
  errSave: "It couldn't be saved. Please try again.",
  errGeneric: "Something went wrong. Please try again.",
};

export const dryRunCampusCopy: Record<Locale, DryRunCampusCopy> = { es, en };

/**
 * Lo que devuelven hoy las acciones de preparacion/actions.ts, en español, a
 * su clave. Cuando las acciones devuelvan códigos, éstos son los códigos.
 */
const ERRORES: Record<string, keyof DryRunCampusCopy> = {
  "Tu sesión ha caducado. Vuelve a entrar.": "errSession",
  "no-auth": "errSession",
  "No encontramos tu plaza.": "errNoSeat",
  "Falta la nota de 0 a 10.": "errNps",
  "No se pudo guardar. Inténtalo otra vez.": "errSave",
  errSession: "errSession",
  errNoSeat: "errNoSeat",
  errNps: "errNps",
  errSave: "errSave",
};

/** Un error de las acciones del dry run, en el idioma del alumno. */
export function errorDryRun(error: string, locale: Locale): string {
  const k = ERRORES[error];
  const c = dryRunCampusCopy[locale];
  if (k) return c[k];
  // Un texto que no conocemos: en español se enseña tal cual; en inglés, el genérico.
  return locale === "es" ? error : c.errGeneric;
}
