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
  /** Se marca solo, sin casilla. */
  automatico?: boolean;
};

export const PASOS: readonly PasoPreparacion[] = [
  {
    key: "cuenta",
    titulo: "Entra al campus con tu cuenta de Google",
    detalle: "Hecho: si estás viendo esta página, ya tienes acceso al Módulo 1.",
    automatico: true,
  },
  {
    key: "classroom",
    titulo: "Únete a la clase de Google Classroom",
    detalle: "Allí están las plantillas, se entregan las tareas y se publica el enlace de la sesión.",
  },
  {
    key: "calendario",
    titulo: "Guarda la fecha en tu calendario",
    detalle: "Con Google Calendar o descargando el evento para Outlook o Apple Calendar.",
  },
  {
    key: "material",
    titulo: "Abre la lección «Antes de la clase»",
    detalle: "Es el material previo del Módulo 1, con el tiempo orientativo de cada pieza.",
    automatico: true,
  },
  {
    key: "ficha",
    titulo: "Rellena tu ficha de presentación",
    detalle: "10 minutos. El docente la lee antes de la clase para llamarte por tu nombre y conectar los ejemplos con tu caso.",
  },
  {
    key: "test",
    titulo: "Haz el Test de Punto de Partida",
    detalle: "20 minutos, 26 preguntas. No puntúa: responde por la vida que tienes, no por la que quieres.",
  },
  {
    key: "estudio",
    titulo: "Lee el estudio sobre la penalización del remoto",
    detalle: "20 minutos. Si solo lees una parte, que sea el apartado Results.",
  },
  {
    key: "equipo",
    titulo: "Prueba cámara, micrófono y conexión",
    detalle: "En la hora 3 hablas delante de tu grupo. Chrome o Edge actualizado y un sitio tranquilo.",
  },
  {
    key: "asistente",
    titulo: "Hazle una pregunta al asistente",
    detalle: "El chat de abajo a la derecha responde dudas sobre el campus, el dry run y el módulo.",
    automatico: true,
  },
];

export const CLAVES_PASOS = new Set(PASOS.map((p) => p.key));

/** Cuántos pasos lleva hechos, contando los automáticos que se cumplan. */
export function pasosHechos(onboarding: Record<string, string>, automaticos: Record<string, boolean>): number {
  return PASOS.filter((p) => (p.automatico ? automaticos[p.key] : Boolean(onboarding[p.key]))).length;
}
