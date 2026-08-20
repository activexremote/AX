import type { Metadata } from "next";

import { ENTITY } from "@/app/legal/entity";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";

export const SITE_URL = `https://${ENTITY.domain}`;
export const SITE_NAME = "ActiveXRemote";

/** Código completo por idioma. Google prefiere el par idioma-región cuando el
 *  contenido apunta a un mercado concreto, y aquí lo hace: el programa se
 *  vende en euros y en español a Europa y Latinoamérica. */
export const OG_LOCALE: Record<Locale, string> = {
  es: "es_ES",
  en: "en_US",
};

export function absolute(locale: Locale, path: string): string {
  return `${SITE_URL}${withLocale(locale, path)}`;
}

/**
 * Canónica del idioma actual + las alternativas de idioma.
 *
 * `path` es la ruta SIN prefijo (/blog, /glosario/eor…). Cuando la traducción
 * vive en otra ruta —los artículos del blog tienen slug propio en cada
 * idioma— se pasa `paths` con la ruta de cada uno.
 *
 * `x-default` apunta al INGLÉS, no al español.
 *
 * Esa etiqueta le dice a Google qué versión servir a quien no habla ninguno de
 * los idiomas del sitio, y es justo el grupo que el proxy manda a /en (ver
 * FALLBACK_EXTRANJERO en negotiate.ts). Dejarla en español haría que el sitio
 * y el buscador hicieran cosas distintas con la misma persona: un alemán
 * vería la URL española en la SERP y, al pulsar, acabaría en la inglesa.
 *
 * Ojo: esto NO degrada el español. Sigue siendo el idioma por defecto, sigue
 * viviendo en la raíz del dominio y sigue declarado con hreflang="es" para
 * quien habla español. x-default sólo cubre a los demás.
 */
export function alternates(
  locale: Locale,
  path: string,
  paths?: Partial<Record<Locale, string>>,
): Metadata["alternates"] {
  const pathFor = (l: Locale) => paths?.[l] ?? path;

  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}${withLocale(l, pathFor(l))}`;
  languages["x-default"] = `${SITE_URL}${withLocale("en", pathFor("en"))}`;

  return {
    canonical: `${SITE_URL}${withLocale(locale, pathFor(locale))}`,
    languages,
  };
}

/**
 * Sólo se declara hreflang cuando la otra versión existe de verdad. Apuntar a
 * una traducción que no está publicada es peor que no declarar nada: Google
 * descarta el grupo entero y puede acabar sirviendo la URL equivocada.
 */
export function selfCanonical(locale: Locale, path: string): Metadata["alternates"] {
  return { canonical: `${SITE_URL}${withLocale(locale, path)}` };
}
