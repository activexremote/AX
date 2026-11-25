// ══════════════════════════════════════════════════════════
//  La encuesta del dry run
//
//  Las preguntas que contestan los invitados después de la clase
//  (/dry-run/<slug>/encuesta). Tipo test para poder contar y comparar, y
//  campos abiertos para lo que no cabe en una opción; el panel
//  (/admin/dry-run/<id>/encuesta) cuenta las cerradas y la IA lee y
//  clasifica las abiertas.
//
//  Sin dependencias de servidor: lo usan el formulario (cliente), la acción
//  que guarda, el panel y la lectura con IA.
//
//  Se pueden añadir preguntas u opciones sin migrar nada: las respuestas se
//  guardan como clave → valor. Cambiar la CLAVE de una opción deja huérfanas
//  las respuestas que ya la usaban; cambiar su texto, no.
// ══════════════════════════════════════════════════════════

export type Opcion = { k: string; t: string };

type Base = { k: string; titulo: string; ayuda?: string; obligatoria?: boolean };

export type Pregunta =
  | (Base & { tipo: "nps" })
  | (Base & { tipo: "escala"; min: string; max: string })
  | (Base & { tipo: "una"; opciones: Opcion[] })
  | (Base & { tipo: "varias"; opciones: Opcion[]; exclusiva?: string })
  | (Base & { tipo: "numero"; sufijo: string; max: number; placeholder?: string })
  | (Base & { tipo: "abierta"; placeholder?: string });

export type Bloque = { k: string; titulo: string; intro?: string; preguntas: Pregunta[] };

export type Respuestas = Record<string, string | string[] | number>;

export const BLOQUES: Bloque[] = [
  {
    k: "general",
    titulo: "La clase en general",
    preguntas: [
      {
        k: "nps",
        tipo: "nps",
        titulo: "¿Recomendarías este curso a alguien de tu entorno o de tu trabajo?",
        ayuda: "0 = nada probable, 10 = lo recomendaría seguro.",
        obligatoria: true,
      },
      { k: "global", tipo: "escala", titulo: "¿Qué nota le pones a la clase en conjunto?", min: "Muy mala", max: "Excelente", obligatoria: true },
      {
        k: "expectativas",
        tipo: "una",
        titulo: "Comparado con lo que esperabas…",
        opciones: [
          { k: "supero", t: "Ha sido mejor de lo que esperaba" },
          { k: "cumplio", t: "Ha sido lo que esperaba" },
          { k: "por_debajo", t: "Esperaba más" },
        ],
      },
    ],
  },
  {
    k: "contenido",
    titulo: "El contenido del módulo",
    preguntas: [
      { k: "claridad", tipo: "escala", titulo: "¿Se entendió bien lo que se explicó?", min: "Nada claro", max: "Muy claro" },
      { k: "utilidad", tipo: "escala", titulo: "¿Te sirve para tu trabajo o para tu situación ahora mismo?", min: "Nada útil", max: "Muy útil" },
      {
        k: "nivel",
        tipo: "una",
        titulo: "El nivel del contenido te pareció…",
        opciones: [
          { k: "basico", t: "Demasiado básico" },
          { k: "adecuado", t: "Adecuado" },
          { k: "avanzado", t: "Demasiado avanzado" },
        ],
      },
      { k: "mas_util", tipo: "abierta", titulo: "¿Qué fue lo más útil para ti?", placeholder: "Una idea, una herramienta, un ejercicio…" },
      { k: "falto", tipo: "abierta", titulo: "¿Qué te sobró o qué echaste en falta?", placeholder: "Temas que faltaban, partes que sobraban…" },
    ],
  },
  {
    k: "sesion",
    titulo: "El docente y el ritmo",
    preguntas: [
      { k: "docente", tipo: "escala", titulo: "¿Cómo explicó el docente?", min: "Muy mal", max: "Muy bien" },
      { k: "dinamica", tipo: "escala", titulo: "¿Pudiste participar y preguntar lo que necesitabas?", min: "Nada", max: "Del todo" },
      {
        k: "ritmo",
        tipo: "una",
        titulo: "El ritmo de la clase fue…",
        opciones: [
          { k: "lento", t: "Demasiado lento" },
          { k: "bien", t: "Adecuado" },
          { k: "rapido", t: "Demasiado rápido" },
        ],
      },
      {
        k: "duracion",
        tipo: "una",
        titulo: "La duración de la sesión fue…",
        opciones: [
          { k: "corta", t: "Se me hizo corta" },
          { k: "bien", t: "Adecuada" },
          { k: "larga", t: "Se me hizo larga" },
        ],
      },
      { k: "mejorar_sesion", tipo: "abierta", titulo: "¿Qué cambiarías de cómo se dio la clase?", placeholder: "Más práctica, más pausas, otro orden…" },
    ],
  },
  {
    k: "plataforma",
    titulo: "El campus y los materiales",
    preguntas: [
      { k: "campus", tipo: "escala", titulo: "¿Te resultó fácil moverte por el campus?", min: "Muy difícil", max: "Muy fácil" },
      { k: "preparacion", tipo: "escala", titulo: "¿El material previo te ayudó a preparar la clase?", min: "Nada", max: "Mucho" },
      { k: "classroom", tipo: "escala", titulo: "¿Te quedó claro cómo usar Google Classroom y entregar las tareas?", min: "Nada claro", max: "Muy claro" },
      {
        k: "problemas",
        tipo: "varias",
        titulo: "¿Tuviste problemas con algo de esto?",
        ayuda: "Marca todo lo que aplique.",
        exclusiva: "ninguno",
        opciones: [
          { k: "acceso", t: "Entrar al campus o registrarme" },
          { k: "material", t: "Encontrar el material" },
          { k: "videollamada", t: "El audio o el vídeo de la videollamada" },
          { k: "classroom", t: "Unirme a Classroom o entregar tareas" },
          { k: "correos", t: "Los correos (demasiados, confusos o no me llegaron)" },
          { k: "ninguno", t: "Ningún problema" },
        ],
      },
      { k: "plataforma_comentario", tipo: "abierta", titulo: "¿Algo más sobre el campus o los materiales?" },
    ],
  },
  {
    k: "precio",
    titulo: "El precio",
    intro: "Pensando en el curso completo (todos los módulos, no sólo esta clase).",
    preguntas: [
      {
        k: "pagaria",
        tipo: "una",
        titulo: "Si el curso completo estuviera a la venta hoy, ¿lo pagarías?",
        obligatoria: true,
        opciones: [
          { k: "si", t: "Sí" },
          { k: "quiza", t: "Quizá" },
          { k: "no", t: "No" },
        ],
      },
      {
        k: "rango",
        tipo: "una",
        titulo: "¿Cuánto pagarías por él?",
        opciones: [
          { k: "hasta_500", t: "500 € o menos" },
          { k: "500_1000", t: "Entre 500 y 1.000 €" },
          { k: "1000_2000", t: "Entre 1.000 y 2.000 €" },
          { k: "mas_2000", t: "2.000 € o más" },
        ],
      },
      { k: "precio_justo", tipo: "numero", titulo: "¿Qué precio te parecería justo?", ayuda: "Escribe una cifra, en euros.", sufijo: "€", max: 20000, placeholder: "Ej.: 750" },
      { k: "freno", tipo: "abierta", titulo: "¿Qué te haría falta para decidirte a comprarlo?", placeholder: "Pagar a plazos, saber más de…, ver resultados de otros…" },
    ],
  },
  {
    k: "cierre",
    titulo: "Para terminar",
    preguntas: [
      { k: "gusto", tipo: "abierta", titulo: "Lo que más te gustó, en una frase" },
      {
        k: "testimonio",
        tipo: "una",
        titulo: "¿Podemos usar tu opinión en la web?",
        opciones: [
          { k: "si_nombre", t: "Sí, con mi nombre" },
          { k: "si_anonimo", t: "Sí, pero sin mi nombre" },
          { k: "no", t: "Prefiero que no" },
        ],
      },
      { k: "comentario", tipo: "abierta", titulo: "¿Algo más que quieras contarnos?" },
    ],
  },
];

// ── La versión inglesa ────────────────────────────────────
//
// Sólo cambia lo que se lee: las claves (y por tanto las respuestas) son las
// mismas, así que el panel y la IA las cuentan juntas. Lo que falte aquí se
// enseña en español.

type Traduccion = { titulo: string; ayuda?: string; min?: string; max?: string; placeholder?: string; opciones?: Record<string, string> };

const BLOQUES_EN: Record<string, { titulo: string; intro?: string }> = {
  general: { titulo: "The class overall" },
  contenido: { titulo: "The module content" },
  sesion: { titulo: "The teacher and the pace" },
  plataforma: { titulo: "The campus and the materials" },
  precio: { titulo: "Price", intro: "Thinking about the full course (every module, not just this class)." },
  cierre: { titulo: "To finish" },
};

const PREGUNTAS_EN: Record<string, Traduccion> = {
  nps: { titulo: "Would you recommend this course to someone you know or work with?", ayuda: "0 = not at all likely, 10 = I would definitely recommend it." },
  global: { titulo: "How would you rate the class overall?", min: "Very poor", max: "Excellent" },
  expectativas: {
    titulo: "Compared with what you expected…",
    opciones: { supero: "It was better than I expected", cumplio: "It was what I expected", por_debajo: "I expected more" },
  },
  claridad: { titulo: "Was what was explained easy to understand?", min: "Not clear at all", max: "Very clear" },
  utilidad: { titulo: "Is it useful for your work or your situation right now?", min: "Not useful", max: "Very useful" },
  nivel: { titulo: "The level of the content was…", opciones: { basico: "Too basic", adecuado: "About right", avanzado: "Too advanced" } },
  mas_util: { titulo: "What was the most useful part for you?", placeholder: "An idea, a tool, an exercise…" },
  falto: { titulo: "What was unnecessary, or what was missing?", placeholder: "Topics that were missing, parts that could go…" },
  docente: { titulo: "How well did the teacher explain things?", min: "Very poorly", max: "Very well" },
  dinamica: { titulo: "Could you take part and ask what you needed?", min: "Not at all", max: "Completely" },
  ritmo: { titulo: "The pace of the class was…", opciones: { lento: "Too slow", bien: "About right", rapido: "Too fast" } },
  duracion: { titulo: "The length of the session was…", opciones: { corta: "It felt short", bien: "About right", larga: "It felt long" } },
  mejorar_sesion: { titulo: "What would you change about how the class was run?", placeholder: "More practice, more breaks, a different order…" },
  campus: { titulo: "Was the campus easy to find your way around?", min: "Very hard", max: "Very easy" },
  preparacion: { titulo: "Did the pre-class material help you prepare?", min: "Not at all", max: "A lot" },
  classroom: { titulo: "Was it clear how to use Google Classroom and hand in tasks?", min: "Not clear at all", max: "Very clear" },
  problemas: {
    titulo: "Did you have problems with any of these?",
    ayuda: "Tick everything that applies.",
    opciones: {
      acceso: "Getting into the campus or signing up",
      material: "Finding the material",
      videollamada: "Audio or video in the video call",
      classroom: "Joining Classroom or handing in tasks",
      correos: "The emails (too many, confusing or not received)",
      ninguno: "No problems",
    },
  },
  plataforma_comentario: { titulo: "Anything else about the campus or the materials?" },
  pagaria: { titulo: "If the full course were on sale today, would you pay for it?", opciones: { si: "Yes", quiza: "Maybe", no: "No" } },
  rango: {
    titulo: "How much would you pay for it?",
    opciones: { hasta_500: "€500 or less", "500_1000": "Between €500 and €1,000", "1000_2000": "Between €1,000 and €2,000", mas_2000: "€2,000 or more" },
  },
  precio_justo: { titulo: "What price would feel fair to you?", ayuda: "Type a number, in euros.", placeholder: "E.g. 750" },
  freno: { titulo: "What would you need in order to decide to buy it?", placeholder: "Paying in instalments, knowing more about…, seeing others' results…" },
  gusto: { titulo: "What you liked most, in one sentence" },
  testimonio: { titulo: "Can we use your opinion on our website?", opciones: { si_nombre: "Yes, with my name", si_anonimo: "Yes, but without my name", no: "I'd rather not" } },
  comentario: { titulo: "Anything else you'd like to tell us?" },
};

/** Los bloques en el idioma de quien responde. */
export function bloquesEn(locale: "es" | "en"): Bloque[] {
  if (locale !== "en") return BLOQUES;
  return BLOQUES.map((b) => ({
    ...b,
    titulo: BLOQUES_EN[b.k]?.titulo ?? b.titulo,
    intro: BLOQUES_EN[b.k]?.intro ?? b.intro,
    preguntas: b.preguntas.map((p): Pregunta => {
      const t = PREGUNTAS_EN[p.k];
      if (!t) return p;
      const base = { ...p, titulo: t.titulo, ayuda: t.ayuda ?? p.ayuda };
      switch (base.tipo) {
        case "escala":
          return { ...base, min: t.min ?? base.min, max: t.max ?? base.max };
        case "una":
        case "varias":
          return { ...base, opciones: base.opciones.map((o) => ({ ...o, t: t.opciones?.[o.k] ?? o.t })) };
        case "numero":
        case "abierta":
          return { ...base, placeholder: t.placeholder ?? base.placeholder };
        default:
          return base;
      }
    }),
  }));
}

export const PREGUNTAS: Pregunta[] = BLOQUES.flatMap((b) => b.preguntas);
const POR_CLAVE = new Map(PREGUNTAS.map((p) => [p.k, p]));
export const pregunta = (k: string) => POR_CLAVE.get(k);

export const ABIERTAS = PREGUNTAS.filter((p) => p.tipo === "abierta");

/** El texto de una opción, o la clave si ya no existe. */
export function textoOpcion(k: string, v: string): string {
  const p = POR_CLAVE.get(k);
  if (p && (p.tipo === "una" || p.tipo === "varias")) return p.opciones.find((o) => o.k === v)?.t ?? v;
  return v;
}

const MAX_TEXTO = 3000;

/**
 * Lo que llega del formulario, limpio: sólo claves que existen, opciones que
 * existen y números dentro de rango. Devuelve las respuestas o la primera
 * obligatoria que falta.
 */
export function leerRespuestas(formData: FormData): { ok: true; respuestas: Respuestas } | { ok: false; falta: string } {
  const r: Respuestas = {};
  for (const p of PREGUNTAS) {
    switch (p.tipo) {
      case "nps":
      case "escala": {
        const n = Number(formData.get(p.k));
        const [min, max] = p.tipo === "nps" ? [0, 10] : [1, 5];
        if (formData.get(p.k) !== null && formData.get(p.k) !== "" && Number.isInteger(n) && n >= min && n <= max) r[p.k] = n;
        break;
      }
      case "una": {
        const v = String(formData.get(p.k) ?? "");
        if (p.opciones.some((o) => o.k === v)) r[p.k] = v;
        break;
      }
      case "varias": {
        let vs = formData.getAll(p.k).map(String).filter((v) => p.opciones.some((o) => o.k === v));
        vs = [...new Set(vs)];
        // «Ningún problema» con otra marcada a la vez: manda lo concreto.
        if (p.exclusiva && vs.length > 1) vs = vs.filter((v) => v !== p.exclusiva);
        if (vs.length) r[p.k] = vs;
        break;
      }
      case "numero": {
        const bruto = String(formData.get(p.k) ?? "").replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
        const n = Math.round(Number(bruto));
        if (bruto && Number.isFinite(n) && n >= 0 && n <= p.max) r[p.k] = n;
        break;
      }
      case "abierta": {
        const t = String(formData.get(p.k) ?? "").trim().slice(0, MAX_TEXTO);
        if (t) r[p.k] = t;
        break;
      }
    }
  }
  const falta = PREGUNTAS.find((p) => p.obligatoria && r[p.k] === undefined);
  return falta ? { ok: false, falta: falta.k } : { ok: true, respuestas: r };
}

// ── Cuentas que usan el panel y la IA ─────────────────────

export type Barra = { k: string; t: string; n: number; pct: number };

const pctDe = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

/** Cómo se reparte una pregunta cerrada entre los que la han contestado. */
export function distribucion(rs: Respuestas[], k: string): { total: number; barras: Barra[] } {
  const p = POR_CLAVE.get(k);
  if (!p) return { total: 0, barras: [] };
  if (p.tipo === "nps" || p.tipo === "escala") {
    const [min, max] = p.tipo === "nps" ? [0, 10] : [1, 5];
    const con = rs.filter((r) => typeof r[k] === "number");
    const barras: Barra[] = [];
    for (let i = min; i <= max; i++) {
      const n = con.filter((r) => r[k] === i).length;
      barras.push({ k: String(i), t: String(i), n, pct: pctDe(n, con.length) });
    }
    return { total: con.length, barras };
  }
  if (p.tipo === "una" || p.tipo === "varias") {
    const con = rs.filter((r) => r[k] !== undefined);
    const tiene = (r: Respuestas, v: string) => (Array.isArray(r[k]) ? (r[k] as string[]).includes(v) : r[k] === v);
    return {
      total: con.length,
      barras: p.opciones.map((o) => {
        const n = con.filter((r) => tiene(r, o.k)).length;
        return { k: o.k, t: o.t, n, pct: pctDe(n, con.length) };
      }),
    };
  }
  return { total: 0, barras: [] };
}

export function media(rs: Respuestas[], k: string): number | null {
  const v = rs.map((r) => r[k]).filter((x): x is number => typeof x === "number");
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null;
}

export function mediana(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
}

/** NPS: % de promotores (9–10) menos % de detractores (0–6). */
export function nps(rs: Respuestas[]): { valor: number | null; promotores: number; pasivos: number; detractores: number; n: number } {
  const v = rs.map((r) => r.nps).filter((x): x is number => typeof x === "number");
  const promotores = v.filter((x) => x >= 9).length;
  const detractores = v.filter((x) => x <= 6).length;
  return {
    valor: v.length ? Math.round(((promotores - detractores) / v.length) * 100) : null,
    promotores,
    pasivos: v.length - promotores - detractores,
    detractores,
    n: v.length,
  };
}

export const grupoNps = (n: unknown): "promotor" | "pasivo" | "detractor" | null =>
  typeof n !== "number" ? null : n >= 9 ? "promotor" : n >= 7 ? "pasivo" : "detractor";

/** Una respuesta en una línea legible, para la IA y para el CSV. */
export function valorLegible(k: string, v: Respuestas[string] | undefined): string {
  if (v === undefined) return "";
  const p = POR_CLAVE.get(k);
  if (Array.isArray(v)) return v.map((x) => textoOpcion(k, x)).join(" + ");
  if (typeof v === "number") return p?.tipo === "escala" ? `${v}/5` : p?.tipo === "nps" ? `${v}/10` : p?.tipo === "numero" ? `${v} ${p.sufijo}` : String(v);
  return textoOpcion(k, v);
}

// ── Los temas en los que la IA clasifica las respuestas ───

export const TEMAS: Opcion[] = [
  { k: "contenido", t: "Contenido" },
  { k: "nivel", t: "Nivel" },
  { k: "docente", t: "Docente" },
  { k: "ritmo", t: "Ritmo y duración" },
  { k: "dinamica", t: "Participación" },
  { k: "practica", t: "Práctica y ejercicios" },
  { k: "materiales", t: "Material previo" },
  { k: "campus", t: "Campus" },
  { k: "classroom", t: "Classroom y tareas" },
  { k: "videollamada", t: "Videollamada" },
  { k: "comunicacion", t: "Correos y avisos" },
  { k: "precio", t: "Precio y pago" },
  { k: "resultados", t: "Resultados y empleo" },
  { k: "comunidad", t: "Comunidad" },
  { k: "otro", t: "Otro" },
];
export const textoTema = (k: string) => TEMAS.find((t) => t.k === k)?.t ?? k;
