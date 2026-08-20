"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useI18n } from "@/lib/i18n/provider";
import { isLocalizedPath, withLocale } from "@/lib/i18n/routing";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * `Link` que arrastra el idioma de la URL actual.
 *
 * Sin esto, quien está en /en/blog y pulsa "Glosario" aterriza en /glosario y
 * la web le cambia de idioma sola. Sólo se tocan las rutas que existen en los
 * dos idiomas: las anclas (#faq), los externos y el campus se dejan tal cual.
 */
export function LocaleLink({ href, ...rest }: Props) {
  const { locale } = useI18n();
  const target = isLocalizedPath(href) ? withLocale(locale, href) : href;
  return <Link href={target} {...rest} />;
}
