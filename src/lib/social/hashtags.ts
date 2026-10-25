// ══════════════════════════════════════════════════════════
//  Hashtags, menciones y emojis en el editor
//
//  Sin nada de servidor: lo usan el editor (navegador) y medios.ts.
// ══════════════════════════════════════════════════════════

/** Un hashtag válido: letras, cifras y guion bajo, sin espacios. */
export const HASHTAG_RE = /^#[\p{L}\p{N}_]{2,60}$/u;

/**
 * Los que siempre tienen público en nuestro tema. No es «tendencia de hoy»
 * (eso no lo da ninguna API gratuita): son hashtags con muchos seguidores y
 * búsquedas sostenidas, la base segura sobre la que la IA añade los
 * concretos de cada post. Revisar de vez en cuando.
 */
export const HASHTAGS_BASE: Record<"es" | "en", string[]> = {
  es: [
    "#TrabajoRemoto",
    "#Teletrabajo",
    "#NomadaDigital",
    "#Emprendimiento",
    "#Freelance",
    "#EmpleoRemoto",
    "#FuturoDelTrabajo",
    "#MarcaPersonal",
    "#Productividad",
    "#DesarrolloProfesional",
    "#InteligenciaArtificial",
  ],
  en: [
    "#RemoteWork",
    "#FutureOfWork",
    "#DigitalNomad",
    "#WorkFromAnywhere",
    "#RemoteJobs",
    "#Freelancing",
    "#Entrepreneurship",
    "#CareerAdvice",
    "#PersonalBranding",
    "#Productivity",
    "#AI",
  ],
};

/** Los hashtags que ya lleva un texto, en minúsculas para comparar. */
export const hashtagsDe = (texto: string) => new Set((texto.match(/#[\p{L}\p{N}_]+/gu) ?? []).map((t) => t.toLowerCase()));

/**
 * Añade hashtags donde los pone cada red: en X, al final de la frase; en
 * LinkedIn, en una línea propia al final (si ya hay una, se suman a ella).
 * Los que ya están no se repiten.
 */
export function anadirHashtags(texto: string, tags: string[], channel: "x" | "linkedin"): string {
  const ya = hashtagsDe(texto);
  const nuevos = tags.filter((t) => !ya.has(t.toLowerCase()));
  if (!nuevos.length) return texto;
  const base = texto.replace(/\s+$/, "");
  if (channel === "x") return base ? `${base} ${nuevos.join(" ")}` : nuevos.join(" ");
  const lineas = base.split("\n");
  const ultima = lineas.at(-1) ?? "";
  if (/^\s*(#[\p{L}\p{N}_]+\s*)+$/u.test(ultima)) {
    lineas[lineas.length - 1] = `${ultima.trim()} ${nuevos.join(" ")}`;
    return lineas.join("\n");
  }
  return base ? `${base}\n\n${nuevos.join(" ")}` : nuevos.join(" ");
}

/** Una mención limpia: «@nombre», sin espacios ni caracteres que las redes no admiten. */
export function limpiarMencion(v: string): string {
  const s = v.trim().replace(/^@+/, "").replace(/\s+/g, "");
  return /^[\p{L}\p{N}_.-]{1,60}$/u.test(s) ? `@${s}` : "";
}

/**
 * Emojis a mano. La IA no los pone (la voz de la marca va sin emojis), pero
 * quien edita puede añadirlos donde aporten. Una selección corta y útil para
 * posts profesionales; el selector del sistema (⌃⌘Espacio en Mac, Win+. en
 * Windows) tiene todos los demás.
 */
export const EMOJIS: { grupo: "frecuentes" | "caras" | "gestos" | "trabajo" | "simbolos" | "viaje"; lista: string[] }[] = [
  { grupo: "frecuentes", lista: ["👉", "✅", "🚀", "💡", "🔥", "📌", "🎯", "✨", "👇", "🙌", "💬", "📣"] },
  { grupo: "caras", lista: ["😀", "😄", "😅", "😂", "🙂", "😉", "😍", "🤩", "🤔", "😮", "😎", "🥳", "😌", "🙃", "😬", "🤯"] },
  { grupo: "gestos", lista: ["👍", "👏", "🙏", "💪", "🤝", "👋", "✌️", "🤞", "👀", "🫶", "☝️", "✋"] },
  { grupo: "trabajo", lista: ["💻", "🖥️", "📱", "📊", "📈", "🗂️", "📝", "📅", "⏰", "🧠", "🛠️", "⚙️", "🔗", "📚", "🎓", "💼"] },
  { grupo: "simbolos", lista: ["❌", "⚠️", "❓", "❗", "➡️", "⬇️", "🔹", "🔸", "⭐", "💯", "🆕", "🟢", "🟣", "🔴", "1️⃣", "2️⃣", "3️⃣"] },
  { grupo: "viaje", lista: ["🌍", "🌎", "🌏", "✈️", "🏝️", "🏙️", "🧳", "🗺️", "☕", "🏠", "🌅", "🧭"] },
];
