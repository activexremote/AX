// ══════════════════════════════════════════════════════════
//  Las preguntas del perfilado de leads
//
//  Las contesta el equipo comercial después de hablar con cada lead de
//  Zoho (/admin/comercial/leads). Sirven para saber qué tipo de persona
//  deja sus datos, qué esperaba encontrar, si el precio la frena y cuánto
//  interés real tenía, y con eso comparar tipologías y reorientar los
//  anuncios (/admin/comercial/analisis).
//
//  Se pueden añadir preguntas u opciones sin migrar nada: las respuestas se
//  guardan como clave → valor. Cambiar la CLAVE de una opción deja huérfanas
//  las respuestas que ya la usaban; cambiar su texto, no.
// ══════════════════════════════════════════════════════════

export type Opcion = { k: string; t: string };

export type Pregunta =
  | { k: string; tipo: "una"; titulo: string; ayuda?: string; opciones: Opcion[] }
  | { k: string; tipo: "varias"; titulo: string; ayuda?: string; opciones: Opcion[] }
  | { k: string; tipo: "escala"; titulo: string; ayuda?: string; min: string; max: string; niveles: string[] };

export type Bloque = { titulo: string; preguntas: Pregunta[] };

export type Respuestas = Record<string, string | string[] | number>;

export const BLOQUES: Bloque[] = [
  {
    titulo: "Quién es",
    preguntas: [
      {
        k: "perfil",
        tipo: "una",
        titulo: "¿Qué tipo de perfil es?",
        ayuda: "Lo que mejor lo describe, por lo que te contó.",
        opciones: [
          { k: "busca_empleo", t: "Busca trabajo (quiere un empleo remoto)" },
          { k: "empleado_cambio", t: "Tiene trabajo y quiere pasarse a remoto" },
          { k: "freelance", t: "Freelance o autónomo que quiere más clientes fuera" },
          { k: "empresario", t: "Tiene empresa y quiere llevarla a remoto" },
          { k: "emprender", t: "Quiere montar un negocio remoto desde cero" },
          { k: "estudiante", t: "Estudiante o recién titulado" },
          { k: "otro", t: "Otro / no queda claro" },
        ],
      },
      {
        k: "edad",
        tipo: "una",
        titulo: "Edad aproximada",
        opciones: [
          { k: "menos25", t: "Menos de 25" },
          { k: "25_34", t: "25–34" },
          { k: "35_44", t: "35–44" },
          { k: "45_54", t: "45–54" },
          { k: "55mas", t: "55 o más" },
          { k: "nose", t: "No lo sé" },
        ],
      },
      {
        k: "ingles",
        tipo: "una",
        titulo: "Nivel de inglés que aparenta",
        opciones: [
          { k: "bajo", t: "Bajo" },
          { k: "medio", t: "Medio" },
          { k: "alto", t: "Alto" },
          { k: "nose", t: "No salió" },
        ],
      },
    ],
  },
  {
    titulo: "Qué buscaba",
    preguntas: [
      {
        k: "esperaba",
        tipo: "una",
        titulo: "¿Qué esperaba encontrar cuando dejó sus datos?",
        ayuda: "Clave para saber si el anuncio promete otra cosa.",
        opciones: [
          { k: "ofertas_empleo", t: "Ofertas de trabajo / que le colocáramos" },
          { k: "formacion_gratis", t: "Un curso o recurso gratis" },
          { k: "info_curso", t: "Información del curso" },
          { k: "asesoria_negocio", t: "Asesoría para su negocio" },
          { k: "no_recordaba", t: "No recordaba haber dejado sus datos" },
          { k: "otro", t: "Otra cosa" },
        ],
      },
      {
        k: "motivo",
        tipo: "varias",
        titulo: "¿Por qué le interesó? (su intención)",
        ayuda: "Marca todas las que salieron.",
        opciones: [
          { k: "encontrar_trabajo", t: "Encontrar trabajo cuanto antes" },
          { k: "ganar_mas", t: "Ganar más / cobrar en otra moneda" },
          { k: "vivir_fuera", t: "Vivir en otro país / nómada" },
          { k: "conciliar", t: "Conciliar, calidad de vida" },
          { k: "negocio", t: "Montar o escalar un negocio" },
          { k: "aprender", t: "Aprender una habilidad concreta" },
          { k: "curiosidad", t: "Curiosidad, sin un objetivo claro" },
        ],
      },
      {
        k: "urgencia",
        tipo: "una",
        titulo: "¿Con qué urgencia lo necesita?",
        opciones: [
          { k: "ya", t: "Ya (este mes)" },
          { k: "meses", t: "En unos meses" },
          { k: "sin_prisa", t: "Sin prisa" },
          { k: "nada", t: "No tiene un plan" },
        ],
      },
    ],
  },
  {
    titulo: "Precio",
    preguntas: [
      {
        k: "precio",
        tipo: "una",
        titulo: "¿Qué le pareció el precio?",
        opciones: [
          { k: "barato", t: "Barato" },
          { k: "justo", t: "Razonable" },
          { k: "caro_vale", t: "Caro, pero ve que lo vale" },
          { k: "demasiado_caro", t: "Demasiado caro para su bolsillo" },
          { k: "no_hablado", t: "No llegamos a hablar del precio" },
        ],
      },
      {
        k: "freno_precio",
        tipo: "una",
        titulo: "¿El precio es un motivo para no seguir?",
        opciones: [
          { k: "principal", t: "Sí, el principal" },
          { k: "uno_mas", t: "Sí, pero hay otros" },
          { k: "no", t: "No" },
          { k: "na", t: "No aplica" },
        ],
      },
      {
        k: "frenos",
        tipo: "varias",
        titulo: "¿Qué otros frenos tenía?",
        ayuda: "Marca todos los que salieron.",
        opciones: [
          { k: "no_esperaba", t: "No es lo que esperaba" },
          { k: "momento", t: "No es su momento" },
          { k: "tiempo", t: "No tiene tiempo" },
          { k: "desconfianza", t: "Desconfianza (¿es real?, ¿funciona?)" },
          { k: "quiere_empleo", t: "Quiere un empleo, no formación" },
          { k: "ya_formado", t: "Ya tiene una formación parecida" },
          { k: "idioma", t: "El idioma / su nivel de inglés" },
          { k: "pareja_familia", t: "Lo tiene que consultar" },
          { k: "ninguno", t: "Ninguno" },
        ],
      },
    ],
  },
  {
    titulo: "Cómo fue la llamada",
    preguntas: [
      {
        k: "interes",
        tipo: "escala",
        titulo: "¿Cuánto interés real tenía?",
        ayuda: "¿Te dejaba explicar por educación o le interesaba de verdad?",
        min: "Sólo por educación",
        max: "Mucho interés, preguntaba",
        niveles: ["Sólo por educación", "Poco", "Algo", "Bastante", "Muchísimo"],
      },
      {
        k: "encaje",
        tipo: "escala",
        titulo: "¿Encaja con el curso?",
        ayuda: "¿Es la persona para la que está hecho el programa?",
        min: "Nada",
        max: "Totalmente",
        niveles: ["Nada", "Poco", "A medias", "Bastante", "Totalmente"],
      },
      {
        k: "resultado",
        tipo: "una",
        titulo: "¿Cómo quedó?",
        opciones: [
          { k: "matricula", t: "Se matricula / va a matricularse" },
          { k: "seguimiento", t: "Le interesa: hay que hacer seguimiento" },
          { k: "info", t: "Pidió información por escrito" },
          { k: "no_interesado", t: "No le interesa" },
          { k: "no_contesta", t: "No contesta" },
          { k: "no_valido", t: "Dato no válido / no era la persona" },
        ],
      },
    ],
  },
  {
    titulo: "El anuncio",
    preguntas: [
      {
        k: "origen",
        tipo: "una",
        titulo: "¿Por dónde nos conoció?",
        opciones: [
          { k: "instagram", t: "Instagram" },
          { k: "facebook", t: "Facebook" },
          { k: "google", t: "Google" },
          { k: "linkedin", t: "LinkedIn" },
          { k: "recomendacion", t: "Recomendación" },
          { k: "no_recuerda", t: "No lo recuerda" },
          { k: "otro", t: "Otro" },
        ],
      },
      {
        k: "anuncio_recuerdo",
        tipo: "una",
        titulo: "¿Recordaba qué decía el anuncio?",
        opciones: [
          { k: "si_claro", t: "Sí, y era lo que buscaba" },
          { k: "si_distinto", t: "Sí, pero esperaba otra cosa" },
          { k: "vagamente", t: "Vagamente" },
          { k: "no", t: "No" },
        ],
      },
    ],
  },
];

export const PREGUNTAS: Pregunta[] = BLOQUES.flatMap((b) => b.preguntas);

export const pregunta = (k: string) => PREGUNTAS.find((p) => p.k === k);

/** El texto de una opción, o la clave si ya no existe. */
export function textoOpcion(k: string, v: string): string {
  const p = pregunta(k);
  if (!p || p.tipo === "escala") return v;
  return p.opciones.find((o) => o.k === v)?.t ?? v;
}

/** Limpia lo que llega del formulario: sólo preguntas y opciones que existen. */
export function limpiar(entrada: Record<string, unknown>): Respuestas {
  const r: Respuestas = {};
  for (const p of PREGUNTAS) {
    const v = entrada[p.k];
    if (p.tipo === "escala") {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1 && n <= p.niveles.length) r[p.k] = n;
    } else if (p.tipo === "una") {
      if (typeof v === "string" && p.opciones.some((o) => o.k === v)) r[p.k] = v;
    } else {
      const lista = (Array.isArray(v) ? v : []).filter((x): x is string => typeof x === "string" && p.opciones.some((o) => o.k === x));
      if (lista.length) r[p.k] = [...new Set(lista)];
    }
  }
  return r;
}

/** Cuántas preguntas tiene contestadas (para «perfilado» / «a medias»). */
export const contestadas = (r: Respuestas) => PREGUNTAS.filter((p) => r[p.k] !== undefined).length;

/** Qué cuenta como perfilado: al menos el perfil y el interés real. */
export const perfilado = (r: Respuestas) => r.perfil !== undefined && r.interes !== undefined;
