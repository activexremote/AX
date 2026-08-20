import { cookies, headers } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "@/lib/i18n/config";
import { LOCALE_HEADER } from "@/lib/i18n/routing";
import { negotiateLocale } from "@/lib/i18n/negotiate";
import { dictionaries, type Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Orden de resolución:
 *
 *  1. La cabecera que pone el proxy a partir de la URL. Manda sobre todo lo
 *     demás: si alguien abre /en/blog, esa página está en inglés aunque la
 *     cookie diga otra cosa; si no, la URL prometería una cosa y la página
 *     serviría otra, que es justo lo que rompe el hreflang.
 *  2. La cookie, que guarda lo que la persona eligió (o lo que se detectó la
 *     primera vez). Es la que manda en el campus y en el panel, que no llevan
 *     idioma en la URL.
 *  3. El idioma del navegador. Cubre la primera visita a una página privada
 *     —login, campus— donde no hay URL que traducir ni cookie todavía: sin
 *     esto, quien entra desde un navegador en inglés vería el login en
 *     español aunque el resto del sitio se le sirva en el suyo.
 *  4. El idioma por defecto.
 */
export async function getLocale(): Promise<Locale> {
  const h = await headers();

  const fromUrl = h.get(LOCALE_HEADER);
  if (isLocale(fromUrl)) return fromUrl;

  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return negotiateLocale(h.get("accept-language")) ?? DEFAULT_LOCALE;
}

export async function getI18n(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
