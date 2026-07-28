"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { LOCALES } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "@/lib/i18n/provider";

export function LocaleToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className={`axr-locale axr-locale--${tone}`} role="group" aria-label="Idioma / Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={l === locale ? "is-active" : ""}
          disabled={pending || l === locale}
          onClick={() =>
            startTransition(async () => {
              await setLocale(l);
              router.refresh();
            })
          }
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
