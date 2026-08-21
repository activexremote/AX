import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  El idioma vive en la URL, no sólo en una cookie.
//
//  Una cookie no viaja en la petición de un rastreador: con el idioma
//  guardado sólo ahí, Google veía la web entera en español y la versión
//  inglesa no existía para nadie más que para quien pulsaba el selector.
//
//  Esquema elegido — el español, que es el idioma principal y el que ya
//  está indexado, se queda en la raíz; el inglés cuelga de /en:
//
//      /bienvenida            /en/bienvenida
//      /cursos/remote-founder /en/cursos/remote-founder
//      /blog/<slug>           /en/blog/<slug>
//
//  Así ninguna URL española cambia (no se rompe nada de lo ya enlazado) y
//  cada idioma tiene una dirección propia que se puede indexar, declarar
//  como canónica y emparejar con hreflang.
// ══════════════════════════════════════════════════════════

/** Primeros segmentos que existen en los dos idiomas. El campus y el panel
 *  de administración quedan fuera a propósito: son privados. */
export const LOCALIZED_ROOTS = [
  "bienvenida",
  "cursos",
  "blog",
  "glosario",
  "legal",
  // El checkout también existe en los dos idiomas: sin esto, "Enrol now"
  // desde la web en inglés llevaba a la pantalla de pago en español.
  "matricula",
  "cursos-relampago",
] as const;

/** Cabecera con la que el proxy le cuenta a la app qué idioma pide la URL. */
export const LOCALE_HEADER = "x-axr-locale";

// ══════════════════════════════════════════════════════════
//  Segmentos traducidos.
//
//  La ruta interna —la que existe en src/app— siempre está en español. Lo que
//  se enseña en inglés se traduce al construir el enlace y se deshace en el
//  proxy antes de resolver la página. Así el árbol de rutas no se duplica y
//  aun así un lector inglés ve /en/glossary en la barra, no /en/glosario.
//
//  Sólo se traducen segmentos de ruta, nunca identificadores de contenido:
//  los slugs de los artículos ya son propios de cada idioma, y los ids del
//  diccionario son datos compartidos por las dos versiones.
// ══════════════════════════════════════════════════════════
const SEGMENTS: Record<string, string> = {
  bienvenida: "welcome",
  cursos: "courses",
  glosario: "glossary",
  matricula: "enrolment",
  "cursos-relampago": "flash-courses",
  gracias: "thank-you",
  "aviso-legal": "legal-notice",
  privacidad: "privacy",
  terminos: "terms",
  // "blog", "cookies" y los slugs de curso se escriben igual en los dos.
};

const SEGMENTS_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(SEGMENTS).map(([es, en]) => [en, es]),
);

/** Ruta interna (española) → la que se enseña en ese idioma. */
export function translatePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  return mapSegments(path, SEGMENTS);
}

/** Lo contrario: lo que llega por la URL → la ruta interna que resuelve Next. */
export function untranslatePath(path: string): string {
  return mapSegments(path, SEGMENTS_BACK);
}

function mapSegments(path: string, table: Record<string, string>): string {
  const [bare, ...rest] = path.split(/(?=[?#])/);
  const mapped = bare
    .split("/")
    .map((seg) => table[seg] ?? seg)
    .join("/");
  return mapped + rest.join("");
}

/** La ruta sin query ni ancla: "/matricula?curso=x#pago" → "/matricula". */
function bare(path: string): string {
  return path.split(/[?#]/)[0] ?? "";
}

export function isLocalizedPath(pathname: string): boolean {
  // ⚠︎ Hay que quitar antes la query. Si no, "/matricula?curso=…" partía en
  // "matricula?curso=…", que no está en la lista, y el enlace se quedaba sin
  // prefijo: quien navegaba en inglés aterrizaba en el checkout en español.
  const first = bare(pathname).split("/")[1] ?? "";
  const internal = SEGMENTS_BACK[first] ?? first;
  return (LOCALIZED_ROOTS as readonly string[]).includes(internal);
}

/**
 * Ruta sin prefijo → ruta del idioma pedido.
 * El idioma por defecto no lleva prefijo: `/blog`, no `/es/blog`.
 */
export function withLocale(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (!path.startsWith("/")) return path;
  // El prefijo va delante de la ruta, no de la query: la query viaja detrás
  // tal cual (`/en/enrolment?curso=…`).
  if (bare(path) === "/") return `/${locale}`;
  return `/${locale}${translatePath(locale, path)}`;
}

/** Lo contrario: quita el prefijo y devuelve idioma y ruta limpia. */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first, ...rest] = bare(pathname).split("/");
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    // Se devuelve la ruta INTERNA, para poder volver a construirla en el otro
    // idioma sin arrastrar los segmentos traducidos.
    return { locale: first, path: untranslatePath(`/${rest.join("/")}`) };
  }
  return { locale: DEFAULT_LOCALE, path: pathname };
}

/**
 * La misma página en el otro idioma. La usan el selector de idioma y las
 * etiquetas hreflang, que tienen que apuntar a la traducción real y no a
 * la portada.
 */
export function switchLocale(pathname: string, to: Locale): string {
  const { path } = splitLocale(pathname);
  return withLocale(to, path);
}
