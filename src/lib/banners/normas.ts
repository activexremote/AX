// ══════════════════════════════════════════════════════════
//  Normas de los anuncios: lo que Meta rechaza y lo que la ley prohíbe
//
//  Dos usos:
//   1. `REGLAS_PROMPT` va dentro de las instrucciones de la IA: escribe ya
//      dentro de las normas.
//   2. `revisar()` vuelve a mirar el resultado con reglas fijas, sin IA. La
//      IA se equivoca; una expresión regular no se cansa. Lo que bloquea no
//      se puede aprobar hasta corregirlo.
//
//  Fuentes (revisadas en octubre de 2026):
//   · Meta Advertising Standards — atributos personales, resultados poco
//     realistas, funcionalidad inexistente, contenido de baja calidad,
//     uso de la marca Meta, prácticas discriminatorias.
//   · Categoría especial «Empleo» de Meta (incluye programas de certificación
//     profesional): un anuncio que hable de ofertas de empleo puede caer ahí
//     y perder segmentación.
//   · Ley 34/1988 General de Publicidad (publicidad engañosa), Ley 3/1991 de
//     Competencia Desleal (escasez falsa, resultados garantizados), Directiva
//     Ómnibus (reseñas y precios) y AI Act art. 50 (imágenes realistas de IA,
//     desde agosto de 2026).
//
//  White hat siempre. Nada de cloaking, escasez inventada, testimonios
//  falsos ni trucos para esquivar la revisión: Meta no rechaza el anuncio,
//  cierra la cuenta publicitaria, y rehacerla después cuenta como evasión.
//
//  Sin nada de servidor: el editor revisa mientras se escribe.
// ══════════════════════════════════════════════════════════

import { ELEMENTOS_POR_DEFECTO, LIMITES, type BannerCopy, type Elemento, type Elementos } from "@/lib/banners/formatos";

export type Nivel = "bloquea" | "aviso";
export type Flag = { level: Nivel; rule: string; text: string };

type Regla = {
  rule: string;
  level: Nivel;
  /** Qué textos mira: los de la pieza, los de Meta o todos. */
  donde: "pieza" | "meta" | "todo";
  re: RegExp;
  text: string;
};

// `\b` no entiende de tildes: se usa este límite de palabra con letras
// españolas para no confundir «paro» con «comparo».
const L = "(?<![\\p{L}\\p{N}])";
const R = "(?![\\p{L}\\p{N}])";
const w = (s: string) => new RegExp(`${L}(?:${s})${R}`, "iu");

const REGLAS: Regla[] = [
  // ── Atributos personales ──
  {
    rule: "Atributos personales",
    level: "bloquea",
    donde: "todo",
    re: w("en paro|parad[oa]s?|desemplead[oa]s?|sin trabajo|endeudad[oa]s?|tus deudas|arruinad[oa]|unemployed|jobless|in debt|broke"),
    text: "Sugiere que quien lo ve está en paro o tiene deudas. Meta no deja afirmar ni insinuar situaciones personales de quien ve el anuncio. Habla del programa, no de su situación.",
  },
  {
    rule: "Atributos personales",
    level: "bloquea",
    donde: "todo",
    re: w("(?:tienes|si tienes|con) (?:más|menos) de \\d+ años|(?:over|under) \\d+(?!\\s*(?:%|h\\b|hours?|weekends?|weeks?|modules?|countries|days?|months?|students?|people|clients?))|tu edad|your age|ansiedad|depresi[oó]n|anxiety|depression"),
    text: "Alude a la edad o la salud de quien lo ve. Es un atributo personal: Meta lo rechaza.",
  },
  {
    rule: "Atributos personales",
    level: "aviso",
    donde: "todo",
    re: w("cansad[oa] de tu|harto de tu|odias tu|tu sueldo|tu jefe|tired of your|hate your|your salary|your boss"),
    text: "Le dice a quien lo ve cómo es su trabajo o su sueldo. Es la forma de «tú + atributo» que Meta suele rechazar. Mejor: «Para profesionales que quieren…».",
  },
  {
    rule: "Atributos personales",
    level: "aviso",
    donde: "todo",
    re: /¿\s*(?:estás|eres|te sientes|sufres|vives)\b[^?]*\?|\b(?:are you|do you feel)\b[^?]*\?/iu,
    text: "Pregunta a quien lo ve por su situación («¿Estás…?», «¿Eres…?»). Si la pregunta da por hecho un atributo personal, Meta la rechaza. Revísala o conviértela en afirmación sobre el programa.",
  },

  // ── Resultados poco realistas ──
  {
    rule: "Resultados poco realistas",
    level: "bloquea",
    donde: "todo",
    // «€» no es letra: `\b` detrás no funciona, de ahí el (?!\p{L}).
    re: /(?:\d[\d.,]*\s?(?:k|mil)?\s?(?:€|\$|eur(?:os)?|usd|dólares|dollars)(?!\p{L})[^.]{0,30}(?:al|a la|por|per|\/|a)\s?(?:mes|año|semana|día|hora|month|year|week|day|hour)|(?:€|\$)\s?\d[\d.,]*\s?(?:k)?[^.]{0,30}(?:al|a la|por|per|\/|a)\s?(?:mes|año|semana|día|hora|month|year|week|day|hour)|(?<![\p{L}])(?:gana|ganar|factura|facturar|earn|make)\s+(?:hasta\s+|up to\s+)?(?:€|\$)?\s?\d)/iu,
    text: "Promete una cifra de ingresos. Meta lo considera resultado poco realista y la ley, publicidad engañosa si no se puede demostrar para cualquier alumno.",
  },
  {
    rule: "Resultados poco realistas",
    level: "bloquea",
    donde: "todo",
    re: w("hazte rico|hacerte rico|dinero fácil|ingresos pasivos|libertad financiera|gana dinero|ganar dinero desde casa|get rich|easy money|passive income|financial freedom|make money"),
    text: "Es lenguaje de «hazte rico». Meta lo rechaza en anuncios de formación y negocio.",
  },
  {
    rule: "Resultados garantizados",
    level: "bloquea",
    donde: "todo",
    re: w("garantizad[oa]s?|garantiza(?:mos)?|te aseguramos|asegurad[oa]|100 ?%|guaranteed?|we guarantee"),
    text: "Garantiza un resultado. Sin una garantía real y con condiciones publicadas es publicidad engañosa (Ley 3/1991) y Meta lo trata como resultado poco realista.",
  },
  {
    rule: "Resultados poco realistas",
    level: "bloquea",
    donde: "todo",
    re: /(?:empleo|trabajo|curro|clientes|negocio|job|clients|business)[^.]{0,40}\ben\s+\d+\s+(?:días|semanas|meses)\b|\bin\s+\d+\s+(?:days|weeks|months)\b[^.]{0,40}(?:job|clients|business)/iu,
    text: "Pone plazo a un resultado («empleo en 30 días»). Nadie puede prometerlo: Meta lo rechaza y es engañoso.",
  },
  {
    rule: "Resultados poco realistas",
    level: "aviso",
    donde: "todo",
    re: w("sin esfuerzo|fácil y rápido|rápido y fácil|sin experiencia|desde el sofá|effortless|no experience needed|quick and easy"),
    text: "Sugiere que no cuesta nada. Si no es verdad para todo el mundo, es un resultado poco realista.",
  },

  // ── Escasez y urgencia ──
  {
    rule: "Escasez inventada",
    level: "bloquea",
    donde: "todo",
    re: w("últimas plazas|quedan \\d+ plazas|solo quedan|sólo quedan|última oportunidad|solo hoy|sólo hoy|termina hoy|last chance|only \\d+ (?:spots|seats) left|today only|ends today"),
    text: "Urgencia o escasez. Sólo vale si es verdad y se puede demostrar el día que sale el anuncio; la escasez falsa es una práctica desleal prohibida. La barra de plazas de la web es un dato de maqueta: no se usa.",
  },

  // ── Gancho de interacción y clickbait ──
  {
    rule: "Cebo de interacción",
    level: "bloquea",
    donde: "todo",
    re: w("comenta|etiqueta a|menciona a|comparte si|dale like|dale a me gusta|tag a friend|comment below|like if|share if"),
    text: "Pide comentar, etiquetar o compartir. Meta lo penaliza como cebo de interacción.",
  },
  {
    rule: "Clickbait",
    level: "aviso",
    donde: "todo",
    re: w("no vas a creer|no te lo vas a creer|lo que nadie te cuenta|el secreto|secretos de|you won.t believe|the secret|nobody tells you"),
    text: "Titular sensacionalista que esconde la información. Meta lo trata como contenido de baja calidad.",
  },

  // ── Marca y estilo ──
  {
    rule: "Gratis",
    level: "bloquea",
    donde: "todo",
    re: w("gratis|gratuit[oa]s?|sin coste|free"),
    text: "«Gratis» está fuera del tono de la marca y, si después hay un pago, es engañoso.",
  },
  {
    rule: "Marca Meta",
    level: "aviso",
    donde: "pieza",
    re: w("facebook|instagram|whatsapp|meta"),
    text: "Nombra una marca de Meta en la imagen. Sólo se permite en texto llano y nunca como lo más visible ni sugiriendo que Meta nos respalda.",
  },
  {
    rule: "Discriminación",
    level: "bloquea",
    donde: "todo",
    re: w("solo (?:para )?(?:hombres|mujeres|jóvenes|menores de \\d+)|sólo (?:para )?(?:hombres|mujeres|jóvenes|menores de \\d+)|only (?:for )?(?:men|women|young people|under \\d+)"),
    text: "Excluye a gente por sexo o edad. Está prohibido por Meta y por la ley.",
  },
  {
    rule: "Testimonio",
    level: "aviso",
    donde: "pieza",
    re: /^[«"“].{10,}[»"”]$|[«"“][^»"”]*\b(?:yo|mi|me|conseguí|I|my)\b[^»"”]*[»"”]/iu,
    text: "Parece un testimonio. Sólo si es de una persona real que ha dado su permiso por escrito, con su nombre. Nunca con una cara generada por IA.",
  },
  {
    rule: "Categoría especial «Empleo»",
    level: "aviso",
    donde: "todo",
    re: w("ofertas? de (?:empleo|trabajo)|vacantes?|contratamos|te contratan|bolsa de empleo|job offers?|we.re hiring|hiring now|vacanc(?:y|ies)"),
    text: "Habla de ofertas de empleo. Meta puede clasificarlo como categoría especial «Empleo» (sin segmentar por edad, sexo ni código postal). Mejor hablar de lo que se aprende y se hace.",
  },
];

/** Textos de la pieza (lo que va pintado en la imagen). */
const PIEZA = ["kicker", "headline", "sub", "extra", "points", "cta"] as const satisfies readonly (keyof BannerCopy & Elemento)[];
/** Textos que van en los campos del anuncio en Meta. */
const META: (keyof BannerCopy)[] = ["primaryText", "adHeadline", "description"];

const palabras = (s: string) => s.split(/\s+/).filter(Boolean).length;

/**
 * Revisión fija, sin IA. Devuelve una lista de avisos: lo que «bloquea» no se
 * puede aprobar; lo que «avisa» se puede aprobar sabiendo lo que se hace.
 */
export function revisar(c: BannerCopy, opts: { imagenIa?: boolean; elementos?: Elementos } = {}): Flag[] {
  const out: Flag[] = [];
  // Sólo cuenta lo que se ve: un texto apagado no está en la pieza.
  const el = opts.elementos ?? ELEMENTOS_POR_DEFECTO;
  const visibles = PIEZA.filter((k) => el[k]);
  const textos = {
    pieza: visibles.map((k) => c[k]).join("\n"),
    meta: META.map((k) => c[k]).join("\n"),
  };
  const vistos = new Set<string>();

  for (const r of REGLAS) {
    const objetivo = r.donde === "todo" ? `${textos.pieza}\n${textos.meta}` : textos[r.donde];
    const m = objetivo.match(r.re);
    if (!m) continue;
    const clave = `${r.rule}|${r.text}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    out.push({ level: r.level, rule: r.rule, text: `«${m[0].trim()}»: ${r.text}` });
  }

  // ── Cantidad de texto en la imagen ──
  // El 20 % ya no existe, pero menos texto sigue rindiendo más: se lee en un
  // segundo o no se lee.
  if (el.headline && !c.headline.trim()) out.push({ level: "bloquea", rule: "Titular", text: "Falta el titular de la pieza." });
  if (palabras(c.headline) > LIMITES.headlineWords) {
    out.push({ level: "aviso", rule: "Demasiado texto", text: `El titular tiene ${palabras(c.headline)} palabras. Por encima de ${LIMITES.headlineWords} no se lee de un vistazo en el móvil.` });
  }
  const total = visibles.reduce((n, k) => n + palabras(c[k]), 0);
  if (total > 28) {
    out.push({ level: "aviso", rule: "Demasiado texto", text: `La imagen lleva ${total} palabras. Lo que no cabe en el titular va en el texto principal del anuncio.` });
  }
  const mayus = c.headline.replace(/[^\p{L}]/gu, "");
  if (mayus.length > 12 && mayus === mayus.toUpperCase()) {
    out.push({ level: "aviso", rule: "Mayúsculas", text: "Titular entero en mayúsculas: se lee peor y Meta lo asocia a contenido sensacionalista." });
  }
  if (/!!|¡¡|\p{Extended_Pictographic}/u.test(textos.pieza)) {
    out.push({ level: "aviso", rule: "Estilo", text: "Exclamaciones dobles o emojis en la pieza: fuera del tono de la marca." });
  }

  // ── Textos de Meta ──
  if (!c.primaryText.trim()) out.push({ level: "aviso", rule: "Texto principal", text: "Falta el texto principal del anuncio." });
  if (c.primaryText.length > LIMITES.primaryText) {
    out.push({ level: "aviso", rule: "Longitud", text: `Texto principal: ${c.primaryText.length} caracteres. Meta enseña unos ${LIMITES.primaryText} antes de «Ver más»: el gancho tiene que estar al principio.` });
  }
  if (c.adHeadline.length > LIMITES.adHeadline) {
    out.push({ level: "aviso", rule: "Longitud", text: `Titular del anuncio: ${c.adHeadline.length} caracteres. A partir de ${LIMITES.adHeadline} se corta en muchas ubicaciones.` });
  }
  if (c.description.length > LIMITES.description) {
    out.push({ level: "aviso", rule: "Longitud", text: `Descripción: ${c.description.length} caracteres. Más de ${LIMITES.description} casi nunca se ve entera.` });
  }

  if (opts.imagenIa) {
    out.push({
      level: "aviso",
      rule: "Imagen de IA",
      text: el.aiLabel
        ? "La imagen es de IA y lleva la etiqueta. Nunca la presentes como un alumno, un profesor o un testimonio real."
        : "La imagen es de IA y va sin etiqueta. Si es realista (personas, lugares), el AI Act pide avisar: enciende «Etiqueta de IA» en los elementos. Y nunca la presentes como un alumno real.",
    });
  }

  return out;
}

export const bloquea = (flags: Flag[]) => flags.some((f) => f.level === "bloquea");

/**
 * Las dos versiones de una variante bilingüe: los avisos de la segunda llevan
 * el idioma delante («EN · Titular») y el de la imagen sale una sola vez.
 */
export function revisarVariante(v: {
  copy: BannerCopy;
  copyAlt?: BannerCopy | null;
  altLang?: "es" | "en";
  imagenIa?: boolean;
  elementos?: Elementos;
}): Flag[] {
  const out = revisar(v.copy, { imagenIa: v.imagenIa, elementos: v.elementos });
  if (v.copyAlt) {
    const tag = (v.altLang ?? "en").toUpperCase();
    for (const f of revisar(v.copyAlt, { elementos: v.elementos })) out.push({ ...f, rule: `${tag} · ${f.rule}` });
  }
  return out;
}

/** Las normas, tal cual se le dan a la IA. */
export const REGLAS_PROMPT = `NORMAS DE PUBLICIDAD DE META Y LEY ESPAÑOLA (no se negocian; un anuncio que
las rompe no sirve aunque sea bueno):

1. ATRIBUTOS PERSONALES. Nunca afirmes ni insinúes una situación personal de
   quien ve el anuncio: paro, deudas, sueldo, edad, salud, origen, religión,
   orientación. Prohibido «¿Estás en paro?», «¿Cansado de tu sueldo?», «Si
   tienes más de 40…». Habla del programa y de lo que se aprende: «Programa
   para profesionales que quieren trabajar en remoto».
2. NADA DE RESULTADOS PROMETIDOS. Ni empleo, ni ingresos, ni clientes, ni
   plazos («en 30 días»), ni garantías, ni «hazte rico», «ingresos pasivos»,
   «libertad financiera», «sin esfuerzo». Promete lo que haces: clases,
   método, entregables, acompañamiento.
3. NADA DE ESCASEZ NI URGENCIA INVENTADA. Prohibido «últimas plazas», «solo
   hoy», cuentas atrás. La única urgencia válida es un dato real de los
   DATOS VERIFICADOS (por ejemplo, la fecha de inicio).
4. NADA DE CEBO NI CLICKBAIT. Ni «comenta», «etiqueta a», ni titulares que
   esconden la información («no vas a creer…»).
5. NADA DE TESTIMONIOS NI CIFRAS INVENTADAS. Ni alumnos, ni frases entre
   comillas atribuidas a alguien, ni porcentajes, ni «+1.000 alumnos», ni
   logos de medios. Sólo los datos de DATOS VERIFICADOS.
6. NADA DE FUNCIONALIDAD FALSA en la imagen: botones de reproducir,
   notificaciones, cruces de cerrar, barras de progreso, interfaz de chat.
7. NADA DE MARCAS DE META (Facebook, Instagram, WhatsApp) en la pieza.
8. NO DISCRIMINES. Nada de «solo para jóvenes», «solo hombres»…
9. SIN «GRATIS» ni variantes. Sin emojis ni exclamaciones dobles en la pieza.
10. NO HABLES DE OFERTAS DE EMPLEO, VACANTES NI CONTRATACIÓN: haría que Meta
    lo clasificara como anuncio de empleo. Habla de habilidades, método y
    proyecto profesional.`;

// ── Guía para la pantalla de normas ──────────────────────
export const GUIA: { titulo: string; bien: string[]; mal: string[]; porque: string }[] = [
  {
    titulo: "Habla del programa, no de la persona",
    bien: ["Aprende a trabajar en remoto para empresas internacionales", "Programa en directo para profesionales que quieren trabajar sin fronteras"],
    mal: ["¿Estás en paro?", "¿Cansado de tu sueldo de 1.000 €?", "Si tienes más de 40 años…"],
    porque: "Meta prohíbe afirmar o insinuar atributos personales (situación económica, edad, salud…). Es la causa más habitual de rechazo.",
  },
  {
    titulo: "Promete lo que haces, no lo que consigue cada alumno",
    bien: ["14 módulos en directo y entregables reales", "Método paso a paso para preparar tu candidatura internacional"],
    mal: ["Consigue empleo remoto en 30 días", "Gana 5.000 $ al mes desde casa", "Resultados garantizados"],
    porque: "«Resultados poco realistas» en Meta y publicidad engañosa en la ley española.",
  },
  {
    titulo: "Urgencia sólo si es verdad",
    bien: ["La convocatoria arranca el 9 de enero"],
    mal: ["¡Últimas plazas!", "Solo hoy", "Quedan 3 plazas (si no es cierto ese día)"],
    porque: "La escasez falsa es una práctica desleal prohibida. La barra de plazas de la web es de maqueta.",
  },
  {
    titulo: "Nada de pruebas inventadas",
    bien: ["Datos del programa: módulos, horas, formato, herramientas"],
    mal: ["Testimonios con caras de IA", "«+2.000 alumnos»", "Logos de medios en los que no hemos salido"],
    porque: "Reseñas y testimonios falsos están prohibidos (Directiva Ómnibus). Una cara de IA nunca es un alumno.",
  },
  {
    titulo: "La imagen no imita una interfaz",
    bien: ["Una foto o el mesh de marca, con el texto compuesto encima"],
    mal: ["Botón de play falso", "Globo de notificación", "Cruz de cerrar", "Cuenta atrás"],
    porque: "«Funcionalidad inexistente»: Meta rechaza cualquier elemento que parezca pulsable y no lo es.",
  },
  {
    titulo: "Poco texto, un mensaje",
    bien: ["Titular de 6-10 palabras, una línea de apoyo y la llamada a la acción"],
    mal: ["Tres ideas en la misma pieza", "Párrafos dentro de la imagen", "Todo en mayúsculas"],
    porque: "El límite del 20 % ya no existe, pero la pieza se lee en un segundo o no se lee. Lo demás va en el texto principal.",
  },
  {
    titulo: "Diversifica de verdad",
    bien: ["Cada variante con un ángulo distinto: obstáculo, aspiración, método, directo, herramientas"],
    mal: ["Cinco piezas iguales cambiando el color del botón"],
    porque: "Desde Andromeda, Meta agrupa las creatividades casi idénticas como un único anuncio: no se prueba nada.",
  },
  {
    titulo: "Imagen de IA, sólo ilustrativa",
    bien: ["Escenas ilustrativas de trabajo en remoto", "Si es realista, la etiqueta «Imagen generada con IA» encendida (Elementos)", "Mejor aún: fotos reales del equipo o de las clases"],
    mal: ["Una persona de IA presentada como alumna", "Una cara de IA junto a un testimonio"],
    porque: "Una persona generada nunca es un alumno real. Meta, además, detecta las imágenes de IA por sus metadatos y puede añadir su propia marca «Info de IA».",
  },
];

/** Lo que nunca se hace, aunque «funcione». */
export const NUNCA = [
  "Cloaking: enseñar a la revisión de Meta una página distinta de la que ve la gente.",
  "Esquivar la revisión: texto con caracteres raros, imágenes emborronadas, rehacer un anuncio rechazado con otra cuenta.",
  "Escasez o cuentas atrás falsas.",
  "Testimonios, reseñas, estrellas o «vistos en» inventados.",
  "Capturas de ingresos, de cuentas bancarias o de «antes y después».",
  "Usar famosos o marcas que no nos respaldan.",
];
