// ══════════════════════════════════════════════════════════
//  Cursos relámpago — modelo de dominio
//
//  Un relámpago es un curso corto (~4 h de vídeo) a precio cerrado que se
//  compra suelto, sin convocatoria y sin cohorte. No es una versión reducida
//  del programa largo: es otro producto, con otro ritmo y otro contrato con
//  el alumno —entras, construyes una cosa, la entregas y te la corrigen—.
//
//  Este archivo es la fuente ÚNICA del contenido. De aquí salen tres cosas
//  que antes se habrían escrito por separado y habrían acabado divergiendo:
//
//    · la landing pública (temario, misiones, duraciones, precio),
//    · el seed de Supabase (`scripts/build-relampago-seed.mjs`),
//    · y el contexto que se le pasa a la corrección automática.
//
//  Si el temario cambia, cambia aquí y se regenera el seed. No hay una copia
//  del temario en el SQL que alguien tenga que acordarse de tocar.
// ══════════════════════════════════════════════════════════

/** Una microlección: vídeo + lectura + test + misión. */
export type FlashLesson = {
  /** Número dentro del curso, 1..N. También es el orden. */
  n: number;
  slug: string;
  title: string;
  /**
   * El gancho humano con el que abre el instructor.
   *
   * La directriz de comunicación del curso es «problema humano → concepto
   * técnico → herramienta → demo → resultado». Esto es el primer paso: la
   * frase que el alumno ya se ha dicho a sí mismo, antes de darle el nombre
   * técnico correcto.
   */
  hook: string;
  minutes: number;
  /**
   * Vídeo propio de la lección.
   *
   * Cuando falta se usa `demoVideo` del curso. Es lo que permite publicar el
   * curso entero con un vídeo de muestra e ir sustituyéndolo lección a
   * lección según se graban, sin tocar ni una línea de código: se rellena
   * este campo y se regenera el seed.
   */
  video?: string;
  /** Qué sabrá hacer al terminar. Una frase, no una lista. */
  outcome: string;
  /** Vocabulario técnico que se introduce. Se pinta como fichas. */
  terms: string[];
  /** Lectura técnica de apoyo (Markdown). Añade precisión, no repite el vídeo. */
  reading: string;
  mission: {
    /** Qué hay que construir. */
    brief: string;
    minutes: number;
    /** El mínimo para dar la misión por buena. */
    criterion: string;
    /** Qué prueba tiene que subir. */
    evidence: string;
  };
  /**
   * Control de comprensión: tres preguntas por lección.
   *
   * El máster plan pide que cada lección tenga una de cada clase, y el orden
   * de este array ES esa clasificación:
   *
   *   [0] conceptual    — ¿ha entendido la idea?
   *   [1] de aplicación — ¿sabe usarla en un caso concreto?
   *   [2] de discriminación — ¿distingue esta herramienta de la de al lado?
   *
   * La tercera es la que más enseña de este curso entero: casi todo el daño
   * lo hace confundir GitHub con hosting, o auth con autorización.
   */
  quiz: [Question, Question, Question];
};

export type Question = {
  prompt: string;
  /** La correcta es SIEMPRE la primera: el seed las baraja al insertarlas. */
  options: [string, string, string, string];
};

/** Un bloque de lecciones con un resultado propio. */
export type FlashModule = {
  n: number;
  slug: string;
  code: string;
  title: string;
  summary: string;
  /** Números de lección que entran, en orden. */
  lessons: number[];
  /** Qué sabe hacer el alumno al cerrar el módulo. */
  result: string;
  icon: string;
  accent: string;
};

/** Un material que se gana al terminar, no al comprar. */
export type FlashUnlock = {
  key: string;
  title: string;
  description: string;
  icon: string;
};

/**
 * Los dos extras que se anuncian en la landing.
 *
 * No son cosas nuevas: son DOS DE LOS DESBLOQUEOS, ascendidos a portada. Uno
 * es el regalo —lo que te llevas puesto— y otro el truco que no se cuenta en
 * ningún sitio. `unlock` los ata al desbloqueo real, así que no puede
 * anunciarse en la landing un regalo que luego no existe en el campus.
 */
export type FlashExtra = {
  /** Clave del desbloqueo correspondiente. */
  unlock: string;
  /** El gancho, en dos o tres palabras. */
  tag: string;
  title: string;
  /** Qué es y por qué importa. Dos frases como mucho. */
  body: string;
  /** El detalle concreto que lo hace apetecible. */
  hook: string;
};

export type FlashCourse = {
  /** Clave del enum `course_key` en Supabase. */
  key: string;
  /** Segmento de URL. */
  slug: string;
  code: string;
  title: string;
  claim: string;
  /** El problema, en las palabras del alumno. Es el copy nuclear del curso. */
  problem: string;
  lead: string;
  /** Precio en céntimos. Cerrado: ni plazos ni convocatoria. */
  priceCents: number;
  /** Herramientas que se tocan. */
  stack: string[];
  /**
   * Qué se construye, pieza a pieza y en orden.
   *
   * Es una lista y no una frase porque se dibuja encadenado: el orden importa
   * —cada pieza necesita la anterior— y eso en una frase con flechas se lee
   * como una enumeración cualquiera.
   */
  build: string[];
  level: string;
  language: string;
  /**
   * Vídeo de muestra, para las lecciones que todavía no tienen el suyo.
   *
   * ⚠︎ Es un marcador de posición: el MISMO clip en las 24 lecciones. Sirve
   * para ver el campus funcionando de punta a punta —el reproductor, el
   * ciclo, la misión— pero NO es el contenido del curso. Antes de vender una
   * plaza hay que grabar los 24 y rellenar `video` en cada lección.
   *
   * `demoNotice` es lo que se le dice al alumno mientras esto siga así. No es
   * opcional: cobrar 75 € por un curso y servir el mismo clip de diez
   * segundos veinticuatro veces sin avisar no es un marcador de posición, es
   * otra cosa.
   */
  demoVideo?: string;
  demoNotice?: string;
  /**
   * Fotograma del vídeo, para las miniaturas y como `poster`.
   *
   * Es una imagen de 100 KB frente a un vídeo de 2,4 MB: en una rejilla de
   * tarjetas, la diferencia entre cargar la página y no cargarla. El vídeo
   * sólo se descarga cuando alguien pasa por encima o lo pulsa.
   */
  poster?: string;
  /** El regalo y el truco, para la portada del curso. */
  gift: FlashExtra;
  ninja: FlashExtra;
  modules: FlashModule[];
  lessons: FlashLesson[];
  unlocks: FlashUnlock[];
  /** Lo que NO se promete. Va en la landing, a la vista. */
  notPromised: string;
};

export function totalMinutes(course: FlashCourse): number {
  return course.lessons.reduce((acc, l) => acc + l.minutes, 0);
}

export function missionMinutes(course: FlashCourse): number {
  return course.lessons.reduce((acc, l) => acc + l.mission.minutes, 0);
}

export function lessonsOf(course: FlashCourse, mod: FlashModule): FlashLesson[] {
  return mod.lessons.map((n) => {
    const l = course.lessons.find((x) => x.n === n);
    if (!l) throw new Error(`Falta la lección ${n} del módulo ${mod.slug}`);
    return l;
  });
}
