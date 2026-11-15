"use client";

import { useState, useTransition } from "react";

import { enviarFeedback } from "@/app/(campus)/preparacion/actions";
import type { Feedback } from "@/lib/dry-run/tipos";
import { dryRunCampusCopy, errorDryRun, type DryRunCampusCopy } from "@/lib/i18n/dry-run-campus";
import { useI18n } from "@/lib/i18n/provider";

const VALORACIONES: [keyof Feedback, keyof DryRunCampusCopy][] = [
  ["clase", "fbRateClase"],
  ["ritmo", "fbRateRitmo"],
  ["contenido", "fbRateContenido"],
  ["docente", "fbRateDocente"],
  ["campus", "fbRateCampus"],
];

/** Tres minutos: una nota de 0 a 10, cinco valoraciones de 1 a 5 y tres preguntas abiertas. */
export function FormularioFeedback({ guestId, previo }: { guestId: string; previo: Feedback | null }) {
  const { locale } = useI18n();
  const c = dryRunCampusCopy[locale];
  const [pending, startTransition] = useTransition();
  const [estado, setEstado] = useState<{ ok: boolean; texto: string } | null>(null);

  function enviar(formData: FormData) {
    setEstado(null);
    startTransition(async () => {
      const r = await enviarFeedback(guestId, formData);
      setEstado(r.error ? { ok: false, texto: errorDryRun(r.error, locale) } : { ok: true, texto: c.fbThanks });
    });
  }

  return (
    <form action={enviar} className="axr-prep__fb">
      <fieldset>
        <legend>{c.fbNps}</legend>
        <div className="axr-prep__nps">
          {Array.from({ length: 11 }, (_, n) => (
            <label key={n}>
              <input type="radio" name="nps" value={n} defaultChecked={previo?.nps === n} required />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{c.fbRates}</legend>
        <div className="axr-prep__rates">
          {VALORACIONES.map(([k, etiqueta]) => (
            <div key={k} className="axr-prep__rate">
              <span>{c[etiqueta]}</span>
              <div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n}>
                    <input type="radio" name={k} value={n} defaultChecked={previo?.[k] === n} />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>{c.fbWouldPay}</legend>
        <div className="axr-prep__pills">
          {(
            [
              ["si", c.fbYes],
              ["quiza", c.fbMaybe],
              ["no", c.fbNo],
            ] as const
          ).map(([v, t]) => (
            <label key={v}>
              <input type="radio" name="pagaria" value={v} defaultChecked={previo?.pagaria === v} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="axr-prep__field">
        <span>{c.fbLiked}</span>
        <textarea name="gusto" rows={3} defaultValue={previo?.gusto ?? ""} />
      </label>
      <label className="axr-prep__field">
        <span>{c.fbChange}</span>
        <textarea name="cambiaria" rows={3} defaultValue={previo?.cambiaria ?? ""} />
      </label>
      <label className="axr-prep__field">
        <span>{c.fbOther}</span>
        <textarea name="comentario" rows={3} defaultValue={previo?.comentario ?? ""} />
      </label>

      {estado ? <p className={`axr-c-note axr-c-note--${estado.ok ? "ok" : "warn"}`}>{estado.texto}</p> : null}
      <div>
        <button type="submit" className="axr-btn" disabled={pending}>
          {pending ? c.fbSending : previo ? c.fbUpdate : c.fbSend}
        </button>
      </div>
    </form>
  );
}
