"use client";

import { useId, useState, useTransition } from "react";

import { submitMission } from "@/app/(campus)/lecciones/actions";
import type { Submission } from "@/lib/supabase/types";

// La misión de una lección relámpago: el enunciado, la entrega y la
// corrección, en el mismo bloque.
//
// Están juntos a propósito. El ciclo de la lección es construir → entregar →
// leer el feedback, y partirlo en tres pantallas es la forma más segura de que
// nadie llegue al final.

export type MissionCopy = {
  title: string;
  criterion: string;
  evidence: string;
  urlLabel: string;
  urlHint: string;
  explanationLabel: string;
  explanationHint: string;
  submit: string;
  resubmit: string;
  sending: string;
  scoreLabel: string;
  good: string;
  watch: string;
  improve: string;
  next: string;
  pendingTitle: string;
  pendingBody: string;
  sentAt: string;
  errors: Record<string, string>;
  minutes: string;
};

type Props = {
  lessonId: string;
  mission: string;
  minutes: number | null;
  criterion: string | null;
  evidenceHint: string | null;
  submission: Submission | null;
  copy: MissionCopy;
};

export function LessonMission({
  lessonId,
  mission,
  minutes,
  criterion,
  evidenceHint,
  submission,
  copy,
}: Props) {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Se abre el formulario si no hay entrega; si la hay, se enseña la
  // corrección y el formulario queda detrás de "volver a entregar".
  const [open, setOpen] = useState(!submission);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitMission({
        lessonId,
        evidenceUrl: String(formData.get("evidence_url") ?? ""),
        explanation: String(formData.get("explanation") ?? ""),
      });
      if ("error" in result) {
        setError(copy.errors[result.error] ?? copy.errors.db);
        return;
      }
      setOpen(false);
    });
  }

  const fb = submission?.feedback;

  return (
    <section className="axr-mission" id="mision">
      <header className="axr-mission__head">
        <h2>{copy.title}</h2>
        {minutes ? <span className="axr-mission__time">~{minutes} {copy.minutes}</span> : null}
      </header>

      <p className="axr-mission__brief">{mission}</p>

      <dl className="axr-mission__specs">
        {criterion && (
          <>
            <dt>{copy.criterion}</dt>
            <dd>{criterion}</dd>
          </>
        )}
        {evidenceHint && (
          <>
            <dt>{copy.evidence}</dt>
            <dd>{evidenceHint}</dd>
          </>
        )}
      </dl>

      {/* ── La corrección ── */}
      {submission && submission.status === "corregida" && (
        <div className="axr-mission__review" data-score={scoreBand(submission.score)}>
          <div className="axr-mission__score">
            <strong>{submission.score}</strong>
            <span>{copy.scoreLabel}</span>
          </div>
          {fb && (
            <div className="axr-mission__feedback">
              {fb.clavado.length > 0 && (
                <div data-kind="good">
                  <h3>{copy.good}</h3>
                  <ul>{fb.clavado.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              )}
              {fb.ojo.length > 0 && (
                <div data-kind="watch">
                  <h3>{copy.watch}</h3>
                  <ul>{fb.ojo.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              )}
              {fb.mejora.length > 0 && (
                <div data-kind="improve">
                  <h3>{copy.improve}</h3>
                  <ul>{fb.mejora.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              )}
              {fb.next && (
                <p className="axr-mission__next">
                  <strong>{copy.next}</strong> {fb.next}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {submission && submission.status === "revision_manual" && (
        <div className="axr-mission__pending">
          <h3>{copy.pendingTitle}</h3>
          <p>{copy.pendingBody}</p>
          {fb?.ojo.length ? <ul>{fb.ojo.map((x) => <li key={x}>{x}</li>)}</ul> : null}
        </div>
      )}

      {submission && !open && (
        <div className="axr-mission__done">
          <p className="axr-mission__sent">
            {copy.sentAt} {new Date(submission.created_at).toLocaleDateString()}
          </p>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setOpen(true)}>
            {copy.resubmit}
          </button>
        </div>
      )}

      {open && (
        <form className="axr-mission__form" action={handleSubmit} noValidate>
          <div className="axr-mission__field">
            <label htmlFor={`${uid}-url`}>{copy.urlLabel}</label>
            <input
              id={`${uid}-url`}
              name="evidence_url"
              type="url"
              inputMode="url"
              placeholder="https://"
              defaultValue={submission?.evidence_url ?? ""}
            />
            <small>{copy.urlHint}</small>
          </div>

          <div className="axr-mission__field">
            <label htmlFor={`${uid}-exp`}>{copy.explanationLabel}</label>
            <textarea
              id={`${uid}-exp`}
              name="explanation"
              rows={6}
              required
              defaultValue={submission?.explanation ?? ""}
            />
            <small>{copy.explanationHint}</small>
          </div>

          {error && (
            <p className="axr-mission__error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
            {pending ? copy.sending : submission ? copy.resubmit : copy.submit}
          </button>
        </form>
      )}
    </section>
  );
}

/** Tres tramos para el color de la nota. 80 es el aprobado del curso. */
function scoreBand(score: number | null): "alto" | "medio" | "bajo" {
  if (score === null) return "medio";
  if (score >= 80) return "alto";
  if (score >= 60) return "medio";
  return "bajo";
}
