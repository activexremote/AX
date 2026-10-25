import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Textos del campus v2: Inicio, Módulo y Acceso pendiente
//
//  Como lib/i18n/publicaciones.ts: ES define el tipo y EN lo cumple. Las
//  plantillas llevan {n} (o {a}/{b}); se rellenan con `fmt` de
//  dictionaries.ts.
// ══════════════════════════════════════════════════════════

const es = {
  // ── Inicio ──
  hello: "Hola, {n}",
  helloLead: "Tu formación en remoto, en un sitio: sigue donde lo dejaste, mira cuánto llevas y qué viene después.",
  overall: "Tu progreso",
  overallOf: "{a} de {b} lecciones",
  statModules: "Módulos",
  statLessons: "Lecciones",
  statMinutes: "Horas de formación",

  continueTitle: "Continúa donde lo dejaste",
  startTitle: "Empieza por aquí",
  doneTitle: "Has terminado todo lo que tienes abierto",
  doneBody: "Repasa cualquier módulo cuando quieras: las lecciones, los audios y los tests siguen aquí.",
  continueCta: "Continuar",
  startCta: "Empezar",
  continueLesson: "Lección {n}",
  moduleProgress: "{a} de {b} lecciones del módulo",

  pathTitle: "Ruta recomendada",
  pathLead: "El orden que mejor funciona si acabas de llegar.",
  audioNote: "Cada lección tiene su versión en audio: puedes avanzar también escuchando.",

  catalogTitle: "Tus módulos",
  catalogLead: "Agrupados por camino. Abre uno para ver sus lecciones.",
  modulesCount: "{n} módulos",
  course: {
    core: "Núcleo común",
    "remote-professional": "Remote Professional",
    "remote-founder": "Remote Founder",
    "web-abc": "The Web ABC",
  } as Record<string, string>,
  courseLead: {
    core: "Lo que comparten los dos caminos.",
    "remote-professional": "Trabajar en remoto para empresas de todo el mundo.",
    "remote-founder": "Montar y hacer crecer un negocio sin fronteras.",
    "web-abc": "Curso relámpago.",
  } as Record<string, string>,
  stateDone: "Completado",
  stateDoing: "En curso",
  stateNew: "Disponible",
  stateSoon: "Próximamente",
  lessonsShort: "{n} lecciones",
  minutesShort: "{n} min",
  lessonsDone: "{a}/{b}",

  flashTag: "Curso relámpago",
  flashModules: "Módulos",

  // ── Módulo ──
  crumbHome: "Inicio",
  moduleStart: "Empezar el módulo",
  moduleContinue: "Continuar: {n}",
  moduleReview: "Repasar desde el principio",
  moduleDone: "Módulo completado",
  moduleLessons: "Lecciones",
  moduleLessonsLead: "En el orden en que se ven. Puedes volver a cualquiera.",
  lessonDone: "Hecha",
  lessonDoing: "En curso",
  lessonTodo: "Pendiente",
  lessonAudio: "Audio",
  lessonQuiz: "Test",
  lessonNext: "Siguiente",
  emptyModule: "Este módulo todavía no tiene lecciones.",

  // ── Acceso pendiente ──
  pendingHello: "Hola, {n}",
};

export type CampusACopy = typeof es;

const en: CampusACopy = {
  hello: "Hi, {n}",
  helloLead: "Your remote-work training in one place: pick up where you left off, see how far you've come and what's next.",
  overall: "Your progress",
  overallOf: "{a} of {b} lessons",
  statModules: "Modules",
  statLessons: "Lessons",
  statMinutes: "Hours of training",

  continueTitle: "Pick up where you left off",
  startTitle: "Start here",
  doneTitle: "You've finished everything you have open",
  doneBody: "Review any module whenever you like: the lessons, audio and quizzes are still here.",
  continueCta: "Continue",
  startCta: "Start",
  continueLesson: "Lesson {n}",
  moduleProgress: "{a} of {b} lessons in this module",

  pathTitle: "Recommended path",
  pathLead: "The order that works best if you've just arrived.",
  audioNote: "Every lesson has an audio version: you can also make progress by listening.",

  catalogTitle: "Your modules",
  catalogLead: "Grouped by path. Open one to see its lessons.",
  modulesCount: "{n} modules",
  course: {
    core: "Common core",
    "remote-professional": "Remote Professional",
    "remote-founder": "Remote Founder",
    "web-abc": "The Web ABC",
  },
  courseLead: {
    core: "What both paths share.",
    "remote-professional": "Work remotely for companies anywhere in the world.",
    "remote-founder": "Build and grow a business without borders.",
    "web-abc": "Flash course.",
  },
  stateDone: "Completed",
  stateDoing: "In progress",
  stateNew: "Available",
  stateSoon: "Coming soon",
  lessonsShort: "{n} lessons",
  minutesShort: "{n} min",
  lessonsDone: "{a}/{b}",

  flashTag: "Flash course",
  flashModules: "Modules",

  crumbHome: "Home",
  moduleStart: "Start the module",
  moduleContinue: "Continue: {n}",
  moduleReview: "Review from the start",
  moduleDone: "Module completed",
  moduleLessons: "Lessons",
  moduleLessonsLead: "In the order they're taken. You can go back to any of them.",
  lessonDone: "Done",
  lessonDoing: "In progress",
  lessonTodo: "To do",
  lessonAudio: "Audio",
  lessonQuiz: "Quiz",
  lessonNext: "Next",
  emptyModule: "This module has no lessons yet.",

  pendingHello: "Hi, {n}",
};

export const campusACopy: Record<Locale, CampusACopy> = { es, en };
