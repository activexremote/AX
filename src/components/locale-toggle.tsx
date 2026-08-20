"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import { LOCALES, type Locale } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/actions";
import { isLocalizedPath, splitLocale, switchLocale } from "@/lib/i18n/routing";
import { useI18n } from "@/lib/i18n/provider";

export function LocaleToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  // En las páginas públicas el idioma lo manda la URL, así que cambiarlo es
  // navegar a la traducción (/blog ↔ /en/blog). En el campus y el panel, que
  // no tienen idioma en la URL, sigue mandando la cookie.
  const { path } = splitLocale(pathname);
  const urlDriven = isLocalizedPath(path);

  function choose(next: Locale) {
    startTransition(async () => {
      // La cookie se guarda igualmente: es la que recuerda la preferencia
      // para la próxima visita y la que usa el campus.
      await setLocale(next);
      if (urlDriven) router.push(switchLocale(pathname, next));
      else router.refresh();
    });
  }

  return (
    <div className={`axr-locale axr-locale--${tone}`} role="group" aria-label="Idioma / Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={l === locale ? "is-active" : ""}
          disabled={pending || l === locale}
          onClick={() => choose(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
