import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Textos del campus v2: Mis tareas, Mi progreso y el asistente
//
//  Lo que ya estaba en dictionaries.ts (títulos, estados, etiquetas de
//  columnas) se sigue leyendo de allí; aquí sólo lo nuevo. ES define el tipo
//  y EN lo cumple. Plantillas con {n}.
// ══════════════════════════════════════════════════════════

const es = {
  // Mis tareas
  tOpen: "Abiertas",
  tSoon: "Vencen pronto",
  tOverdue: "Vencidas",
  tDone: "Completadas",
  tFilterAll: "Todas",
  tStatus: { pendiente: "Pendiente", en_curso: "En curso", pronto: "Vence pronto", vencida: "Vencida", completada: "Completada" },
  tDueToday: "Vence hoy",
  tDueTomorrow: "Vence mañana",
  tDueIn: "Vence en {n} días",
  tDueAgo1: "Venció ayer",
  tDueAgo: "Venció hace {n} días",
  tDueOn: "Fecha límite: {n}",
  tDoneOn: "Completada el {n}",
  tNoDue: "Sin fecha límite",
  tStart: "Empezar",
  tContinue: "Continuar",
  tReview: "Repasar",
  tFromTeacher: "Nota de tu profesor",
  tEmptyTitle: "No tienes tareas pendientes",
  tEmptyBody: "Cuando un profesor te asigne un módulo, aparecerá aquí con su fecha límite. Mientras tanto, puedes seguir por donde lo dejaste.",
  tEmptyCta: "Ir a mis módulos",
  tNoneHere: "No hay tareas en este filtro.",

  // Mi progreso
  pContinueTitle: "Sigue donde lo dejaste",
  pContinueCta: "Continuar la lección",
  pStartTitle: "Aún no has empezado",
  pStartBody: "Abre el primer módulo y empieza por la primera lección: tu progreso aparecerá aquí.",
  pStartCta: "Ver mis módulos",
  pModulesShow: "Ver todos los módulos ({n})",
  pModulesHide: "Ver sólo los empezados",
  pModuleNotStarted: "Sin empezar",
  pModuleDone: "Terminado",
  pQuizTitle: "Resultados de los tests",
  pQuizEmpty: "Todavía no has hecho ningún test.",
  pPassed: "Aprobado",
  pFailed: "Suspendido",
  pBest: "Mejor nota",
  pAttempts: "{n} intentos",
  pAttempt1: "1 intento",
  pOpenLesson: "Abrir",
  pAccount: "Tu cuenta",
  pData: "Tus datos",
  pDataBody: "Descarga todo tu progreso en un archivo, o empieza de cero.",
  pResetTitle: "¿Reiniciar todo tu progreso?",
  pResetBody: "Se borran tus lecciones completadas, los resultados de los tests y la actividad. No se puede deshacer.",
  pResetDone: "Tu progreso se ha reiniciado.",
  pExported: "Descargado",
  pActivityLesson: "{kind}: {n}",
  pScore: "{n} %",

  // Asistente
  aTyping: "Escribiendo",
  aSourceDoc: "Fuente",
  aSourceFaq: "Preguntas frecuentes",
};

export type CampusV2CCopy = typeof es;

const en: CampusV2CCopy = {
  tOpen: "Open",
  tSoon: "Due soon",
  tOverdue: "Overdue",
  tDone: "Completed",
  tFilterAll: "All",
  tStatus: { pendiente: "To do", en_curso: "In progress", pronto: "Due soon", vencida: "Overdue", completada: "Completed" },
  tDueToday: "Due today",
  tDueTomorrow: "Due tomorrow",
  tDueIn: "Due in {n} days",
  tDueAgo1: "Was due yesterday",
  tDueAgo: "Was due {n} days ago",
  tDueOn: "Due date: {n}",
  tDoneOn: "Completed on {n}",
  tNoDue: "No due date",
  tStart: "Start",
  tContinue: "Continue",
  tReview: "Review",
  tFromTeacher: "Note from your teacher",
  tEmptyTitle: "No tasks to do",
  tEmptyBody: "When a teacher assigns you a module, it will show up here with its due date. Meanwhile, you can pick up where you left off.",
  tEmptyCta: "Go to my modules",
  tNoneHere: "No tasks in this filter.",

  pContinueTitle: "Pick up where you left off",
  pContinueCta: "Continue the lesson",
  pStartTitle: "You haven't started yet",
  pStartBody: "Open the first module and start with the first lesson: your progress will show up here.",
  pStartCta: "See my modules",
  pModulesShow: "Show all modules ({n})",
  pModulesHide: "Show started only",
  pModuleNotStarted: "Not started",
  pModuleDone: "Finished",
  pQuizTitle: "Test results",
  pQuizEmpty: "You haven't taken any test yet.",
  pPassed: "Passed",
  pFailed: "Failed",
  pBest: "Best score",
  pAttempts: "{n} attempts",
  pAttempt1: "1 attempt",
  pOpenLesson: "Open",
  pAccount: "Your account",
  pData: "Your data",
  pDataBody: "Download all your progress in a file, or start from scratch.",
  pResetTitle: "Reset all your progress?",
  pResetBody: "Your completed lessons, test results and activity are deleted. This can't be undone.",
  pResetDone: "Your progress has been reset.",
  pExported: "Downloaded",
  pActivityLesson: "{kind}: {n}",
  pScore: "{n}%",

  aTyping: "Typing",
  aSourceDoc: "Source",
  aSourceFaq: "FAQ",
};

export const campusV2CCopy: Record<Locale, CampusV2CCopy> = { es, en };
