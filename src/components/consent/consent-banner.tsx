"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  ALLOW_ALL,
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
  DENY_ALL,
  OPTIONAL_CATEGORIES,
  parseConsent,
  toSignals,
  type ConsentChoices,
} from "@/lib/consent/config";
import type { ConsentCopy } from "@/lib/consent/copy";

/** Evento con el que el enlace del pie vuelve a abrir el panel. */
export const CONSENT_OPEN_EVENT = "axr:consent-open";

/**
 * Se emite en cuanto se guarda una decisión, conceder o revocar.
 *
 * Lo necesita cualquier cosa que dependa del consentimiento y ya esté pintada
 * —de momento, el mapa de la sede— para reaccionar en el acto en vez de
 * esperar a que alguien recargue. Revocar tiene que propagarse tan rápido
 * como conceder, y sin esto sólo se propagaba a las etiquetas.
 */
export const CONSENT_CHANGED_EVENT = "axr:consent-changed";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function writeConsent(choices: ConsentChoices) {
  const record = { v: CONSENT_VERSION, ts: new Date().toISOString(), c: choices };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(record))}` +
    `; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`;

  // Se avisa a las etiquetas en el acto, en los dos sentidos: conceder y
  // revocar tienen que propagarse igual de rápido.
  window.gtag?.("consent", "update", toSignals(choices));
  window.dataLayer?.push({ event: "axr_consent_update", axr_consent: choices });
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choices }));
}

export function ConsentBanner({ copy }: { copy: ConsentCopy }) {
  // `null` = todavía no sabemos si hay cookie (no se pinta nada en SSR).
  const [open, setOpen] = useState<boolean | null>(null);
  const [panel, setPanel] = useState(false);
  const [choices, setChoices] = useState<ConsentChoices>(DENY_ALL);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = parseConsent(
      document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`))?.[1],
    );
    if (saved) setChoices(saved.c);
    setOpen(!saved);

    const reopen = () => {
      setPanel(true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const decide = useCallback((next: ConsentChoices) => {
    writeConsent(next);
    setChoices(next);
    setOpen(false);
    setPanel(false);
  }, []);

  // Escape equivale a no decidir: se cierra el panel pero no se guarda nada,
  // así que el aviso vuelve en la siguiente visita.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (panel) setPanel(false);
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, panel]);

  if (!open) return null;

  return (
    <div
      className="axr-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="axr-consent-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="axr-consent__box" data-panel={panel}>
        <h2 id="axr-consent-title" className="axr-consent__title">
          {panel ? copy.panelTitle : copy.title}
        </h2>
        <p className="axr-consent__body">{panel ? copy.panelBody : copy.body}</p>

        {panel && (
          <div className="axr-consent__list">
            <div className="axr-consent__cat" data-locked="true">
              <div className="axr-consent__cat-head">
                <strong>{copy.necessary.name}</strong>
                <span className="axr-consent__locked">{copy.necessaryTag}</span>
              </div>
              <p>{copy.necessary.desc}</p>
            </div>

            {OPTIONAL_CATEGORIES.map((key) => (
              <div key={key} className="axr-consent__cat">
                <div className="axr-consent__cat-head">
                  <strong>{copy.categories[key].name}</strong>
                  {/* Interruptor real: un checkbox con apariencia propia. */}
                  <label className="axr-consent__switch">
                    <input
                      type="checkbox"
                      checked={choices[key]}
                      onChange={(e) =>
                        setChoices((prev) => ({ ...prev, [key]: e.target.checked }))
                      }
                    />
                    <span aria-hidden />
                    <span className="axr-consent__sr">{copy.categories[key].name}</span>
                  </label>
                </div>
                <p>{copy.categories[key].desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="axr-consent__actions">
          {/* Aceptar y rechazar, mismo peso visual y mismo número de clics. */}
          <button
            type="button"
            className="axr-consent__btn axr-consent__btn--solid"
            onClick={() => decide(panel ? choices : ALLOW_ALL)}
          >
            {panel ? copy.save : copy.acceptAll}
          </button>
          <button
            type="button"
            className="axr-consent__btn"
            onClick={() => decide(DENY_ALL)}
          >
            {copy.rejectAll}
          </button>
          <button
            type="button"
            className="axr-consent__btn axr-consent__btn--quiet"
            onClick={() => setPanel((v) => !v)}
          >
            {panel ? copy.back : copy.configure}
          </button>
        </div>

        <Link href="/legal/cookies" className="axr-consent__more">
          {copy.more}
        </Link>
      </div>
    </div>
  );
}
