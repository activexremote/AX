// ══════════════════════════════════════════════════════════
//  Actividades del campus: los tipos
//
//  Una actividad es lo que antes era «descarga la plantilla y entrégala en
//  Classroom»: la ficha de presentación, un cuestionario, una tarea, el test
//  del módulo. Ahora se hace aquí, en un formulario, y el profesor ve las
//  respuestas en el panel.
//
//  Qué pregunta cada una se define en código (m01.ts…), en los dos idiomas.
//  En la base sólo se guardan las respuestas (activity_responses).
// ══════════════════════════════════════════════════════════

export type Locale = "es" | "en";
export type Texto = { es: string; en: string };

export type Opcion = {
  v: string;
  es: string;
  en: string;
  /** En un diagnóstico, lo que suma esta respuesta. */
  puntos?: number;
  /** En el juego, por qué funciona o no esta respuesta. */
  porque?: Texto;
};

type Base = {
  k: string;
  label: Texto;
  ayuda?: Texto;
  /** Por defecto, todas las preguntas son obligatorias. */
  opcional?: boolean;
};

export type Campo =
  | { k: string; tipo: "seccion"; label: Texto; ayuda?: Texto }
  | (Base & { tipo: "texto" | "parrafo"; placeholder?: Texto; max?: number })
  | (Base & { tipo: "url"; placeholder?: Texto })
  | (Base & { tipo: "opcion"; opciones: Opcion[]; bloque?: string; correcta?: string; mejor?: string; explicacion?: Texto })
  | (Base & { tipo: "multiple"; opciones: Opcion[]; otra?: boolean })
  | (Base & { tipo: "escala"; min: number; max: number; extremos?: [Texto, Texto]; bloque?: string })
  | (Base & { tipo: "sino" });

export type TipoActividad = "formulario" | "diagnostico" | "test" | "encuesta" | "juego";

/** Un tramo del resultado de un diagnóstico, de `desde` % hacia arriba. */
export type Estadio = { desde: number; titulo: Texto; texto: Texto };

export type Criterio = { k: string; titulo: Texto; niveles: [Texto, Texto, Texto, Texto] };

export type Actividad = {
  key: string;
  /** El slug del módulo y la posición de la lección dentro de él (order_index). */
  modulo: string;
  leccion: number;
  tipo: TipoActividad;
  titulo: Texto;
  resumen: Texto;
  minutos: number;
  /** Sin las obligatorias hechas, la lección no se da por terminada. */
  obligatoria: boolean;
  /** Cuándo vence: antes de la clase en directo o al cierre de la semana. */
  plazo: "antes-clase" | "semana";
  /** El profesor la revisa con la rúbrica y puede devolverla. */
  revisa?: boolean;
  /** Las respuestas sólo se ven agregadas, nunca con nombre. */
  anonima?: boolean;
  /** El paso de la lista de preparación del dry run que marca al enviarla. */
  pasoDryRun?: string;
  /** Quién la ve, aparte del profesorado (se dice en el formulario). */
  visible?: Texto;
  campos: Campo[];
  bloques?: { k: string; titulo: Texto }[];
  estadios?: Estadio[];
  /** En un test, el % para aprobar. */
  aprobado?: number;
  rubrica?: Criterio[];
};

export type Respuestas = Record<string, string | string[]>;

export type Resultado = {
  /** Puntos y máximo, y el % redondeado. */
  puntos: number;
  max: number;
  pct: number;
  estadio?: number;
  bloques?: { k: string; puntos: number; max: number; pct: number }[];
  /** En test y juego: qué preguntas se han acertado. */
  aciertos?: Record<string, boolean>;
  aprobado?: boolean;
};

export type EstadoRespuesta = "borrador" | "enviada" | "revisada" | "devuelta";

export type FilaRespuesta = {
  id: string;
  user_id: string;
  lesson_id: string;
  activity_key: string;
  answers: Respuestas;
  result: Resultado | null;
  status: EstadoRespuesta;
  attempts: number;
  submitted_at: string | null;
  rubric: Record<string, number> | null;
  feedback: string | null;
  reviewed_at: string | null;
  updated_at: string;
};

export const tx = (t: Texto | undefined, locale: Locale) => (t ? t[locale] || t.es : "");

/** Si la actividad cuenta como hecha (para cerrar la lección y para Mis tareas). */
export const hecha = (status: EstadoRespuesta | undefined) => status === "enviada" || status === "revisada";

/** Cuenta como hecha: enviada o revisada, y un test sólo si está aprobado. */
export function cuentaComoHecha(a: Actividad, fila: Pick<FilaRespuesta, "status" | "result"> | undefined) {
  if (!fila || !hecha(fila.status)) return false;
  if (a.tipo === "test" && fila.result?.aprobado === false) return false;
  return true;
}
