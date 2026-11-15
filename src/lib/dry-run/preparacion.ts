// ══════════════════════════════════════════════════════════
//  La lista de preparación del dry run
//
//  Lo que tiene que hacer un invitado entre que se apunta y el sábado. La ve
//  en /preparacion y la va marcando; el panel enseña cuánto lleva cada uno.
//  Dos se marcan solas: la cuenta (si está viendo la página, la tiene) y el
//  material previo (si ha abierto la lección).
// ══════════════════════════════════════════════════════════

export type PasoPreparacion = {
  key: string;
  titulo: string;
  detalle: string;
  titulo_en: string;
  detalle_en: string;
  /** Se marca solo, sin casilla. */
  automatico?: boolean;
};

export const PASOS: readonly PasoPreparacion[] = [
  {
    key: "cuenta",
    titulo: "Entra al campus con tu cuenta de Google",
    detalle: "Hecho: si estás viendo esta página, ya tienes acceso al Módulo 1.",
    titulo_en: "Sign in to the campus with your Google account",
    detalle_en: "Done: if you're seeing this page, you already have access to Module 1.",
    automatico: true,
  },
  {
    key: "classroom",
    titulo: "Únete a la clase de Google Classroom",
    detalle: "Allí se publica el enlace de la sesión y los avisos de la clase.",
    titulo_en: "Join the Google Classroom class",
    detalle_en: "That's where the session link and class announcements are posted.",
  },
  {
    key: "calendario",
    titulo: "Guarda la fecha en tu calendario",
    detalle: "Con Google Calendar o descargando el evento para Outlook o Apple Calendar.",
    titulo_en: "Save the date in your calendar",
    detalle_en: "With Google Calendar, or by downloading the event for Outlook or Apple Calendar.",
  },
  {
    key: "material",
    titulo: "Abre la lección «Antes de la clase»",
    detalle: "Es el material previo del Módulo 1, con el tiempo orientativo de cada pieza.",
    titulo_en: "Open the “Before class” lesson",
    detalle_en: "It's the Module 1 pre-class material, with a time estimate for each piece.",
    automatico: true,
  },
  {
    key: "ficha",
    titulo: "Rellena tu ficha de presentación",
    detalle: "10 minutos, aquí en el campus. El docente la lee antes de la clase para llamarte por tu nombre y conectar los ejemplos con tu caso. Se marca sola al enviarla.",
    titulo_en: "Fill in your introduction card",
    detalle_en: "10 minutes, here on the campus. The teacher reads it before class to call you by your name and connect the examples to your case. It ticks itself when you submit it.",
    automatico: true,
  },
  {
    key: "test",
    titulo: "Haz el Test de Punto de Partida",
    detalle: "20 minutos, 26 preguntas, aquí en el campus. No puntúa: responde por la vida que tienes, no por la que quieres. Se marca solo al enviarlo.",
    titulo_en: "Take the Starting Point Test",
    detalle_en: "20 minutes, 26 questions, here on the campus. It isn't graded: answer for the life you have, not the one you want. It ticks itself when you submit it.",
    automatico: true,
  },
  {
    key: "estudio",
    titulo: "Lee el estudio sobre la penalización del remoto",
    detalle: "20 minutos. Si solo lees una parte, que sea el apartado Results.",
    titulo_en: "Read the study on the remote-work penalty",
    detalle_en: "20 minutes. If you only read one part, make it the Results section.",
  },
  {
    key: "equipo",
    titulo: "Prueba cámara, micrófono y conexión",
    detalle: "En la hora 3 hablas delante de tu grupo. La prueba del campus tarda un minuto y se marca sola si todo funciona.",
    titulo_en: "Test your camera, microphone and connection",
    detalle_en: "In hour 3 you speak in front of your group. The campus check takes a minute and ticks itself if everything works.",
  },
  {
    key: "asistente",
    titulo: "Hazle una pregunta al asistente",
    detalle: "El chat de abajo a la derecha responde dudas sobre el campus, el dry run y el módulo.",
    titulo_en: "Ask the assistant a question",
    detalle_en: "The chat at the bottom right answers questions about the campus, the dry run and the module.",
    automatico: true,
  },
];

export const CLAVES_PASOS = new Set(PASOS.map((p) => p.key));

/** Cuántos pasos lleva hechos, contando los automáticos que se cumplan. */
export function pasosHechos(onboarding: Record<string, string>, automaticos: Record<string, boolean>): number {
  return PASOS.filter((p) => (p.automatico ? automaticos[p.key] : Boolean(onboarding[p.key]))).length;
}
