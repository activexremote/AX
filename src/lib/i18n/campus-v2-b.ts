import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Textos nuevos de la lección y de los desbloqueos (campus v2)
//
//  Lo que ya existía sigue en dictionaries.ts (t.lesson, t.mission,
//  t.unlocks); aquí sólo lo que añade el rediseño. ES define el tipo y EN lo
//  cumple, como en el resto de diccionarios por sección.
// ══════════════════════════════════════════════════════════

const es = {
  // Índice del módulo
  lessonsOfModule: "Lecciones del módulo",
  progressShort: "{done} de {total}",
  current: "Estás aquí",
  done: "Completada",

  // Cabecera de la lección
  lessonN: "Lección {n}",
  duration: "{n} min",
  withAudio: "Con audio narrado",
  noAudio: "Audio próximamente",
  withMission: "Misión · {n} min",
  onThisPage: "En esta lección",

  // Final de la lección
  finishTitle: "¿Has terminado esta lección?",
  finishBody: "Márcala como completada y sigue con la siguiente. Puedes volver cuando quieras.",
  finishDone: "Lección completada. Sigue cuando quieras.",
  quizTitleHint: "Responde las preguntas: con el control aprobado, la lección cuenta como completada.",
  missionHint: "La misión es el último paso: al entregarla, la lección queda completada.",
  prev: "Anterior",
  next: "Siguiente",
  nextLesson: "Siguiente lección",
  moduleDone: "Has llegado al final del módulo",
  backToModule: "Volver al módulo",

  // Test
  quizScore: "{n} %",
  quizNeed: "Para aprobar: {n} %",
  quizCorrect: "Correcta",
  quizYours: "Tu respuesta",
  quizAnswered: "{n} de {total} respondidas",

  // Desbloqueos
  unlockEyebrow: "Material desbloqueado",
  unlockEarnedOn: "Lo ganaste el {date}",
  unlockStaff: "Lo ves porque eres del equipo: a un alumno se le abre al terminar el curso.",
  unlockWhat: "Qué incluye",
  unlockCopy: "Copiar texto",
  unlockCopied: "Copiado",
  unlockHow: "Es un archivo Markdown: ábrelo en Notion, Obsidian, VS Code o pégalo en tu herramienta de IA.",
};

export type CampusLessonCopy = typeof es;

const en: CampusLessonCopy = {
  lessonsOfModule: "Lessons in this module",
  progressShort: "{done} of {total}",
  current: "You are here",
  done: "Completed",

  lessonN: "Lesson {n}",
  duration: "{n} min",
  withAudio: "Narrated audio",
  noAudio: "Audio coming soon",
  withMission: "Mission · {n} min",
  onThisPage: "In this lesson",

  finishTitle: "Finished this lesson?",
  finishBody: "Mark it as completed and move on to the next one. You can come back any time.",
  finishDone: "Lesson completed. Carry on whenever you like.",
  quizTitleHint: "Answer the questions: once you pass the check, the lesson counts as completed.",
  missionHint: "The mission is the last step: submitting it completes the lesson.",
  prev: "Previous",
  next: "Next",
  nextLesson: "Next lesson",
  moduleDone: "You've reached the end of the module",
  backToModule: "Back to the module",

  quizScore: "{n}%",
  quizNeed: "To pass: {n}%",
  quizCorrect: "Correct",
  quizYours: "Your answer",
  quizAnswered: "{n} of {total} answered",

  unlockEyebrow: "Unlocked material",
  unlockEarnedOn: "You earned it on {date}",
  unlockStaff: "You can see it because you're on the team: students get it when they finish the course.",
  unlockWhat: "What's inside",
  unlockCopy: "Copy text",
  unlockCopied: "Copied",
  unlockHow: "It's a Markdown file: open it in Notion, Obsidian or VS Code, or paste it into your AI tool.",
};

export const campusLessonCopy: Record<Locale, CampusLessonCopy> = { es, en };
