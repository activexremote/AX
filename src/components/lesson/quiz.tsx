"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import type { QuizOption, QuizQuestion } from "@/lib/supabase/types";
import { submitQuizAttempt } from "@/app/(campus)/lecciones/actions";
import { useI18n } from "@/lib/i18n/provider";
import { fmt } from "@/lib/i18n/dictionaries";
import type { CampusLessonCopy } from "@/lib/i18n/campus-v2-b";

type Q = QuizQuestion & { options: QuizOption[] };

// ══════════════════════════════════════════════════════════
//  El test de la lección
//
//  Una tarjeta por pregunta con las opciones como botones grandes (se tocan
//  bien en el móvil). Al comprobar, cada opción dice si era la buena o la
//  tuya, y abajo sale el resultado con la nota y lo que pide el aprobado.
//  Aprobado: la lección cuenta como completada y se ofrece la siguiente.
//  Suspenso: se puede repetir tantas veces como haga falta.
// ══════════════════════════════════════════════════════════

export function LessonQuiz({
  quizId,
  lessonId,
  questions,
  passScore,
  nextHref,
  nextLabel,
  copy,
}: {
  quizId: string;
  lessonId: string;
  questions: Q[];
  passScore: number;
  /** A dónde seguir al aprobar; null cuando después viene la misión. */
  nextHref: string | null;
  nextLabel: string;
  copy: CampusLessonCopy;
}) {
  const { t } = useI18n();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validated, setValidated] = useState(false);
  const [pending, startTransition] = useTransition();
  const [stored, setStored] = useState(false);

  const result = useMemo(() => {
    if (!validated) return null;
    let correct = 0;
    questions.forEach((q) => {
      const optId = answers[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (opt?.is_correct) correct += 1;
    });
    const score = (correct / questions.length) * 100;
    return {
      correct,
      total: questions.length,
      score,
      passed: score / 100 >= passScore,
    };
  }, [validated, questions, answers, passScore]);

  const respondidas = questions.filter((q) => answers[q.id]).length;
  const allAnswered = respondidas === questions.length;

  function handleValidate() {
    if (!allAnswered) return;
    setValidated(true);

    let correct = 0;
    questions.forEach((q) => {
      const optId = answers[q.id];
      const opt = q.options.find((o) => o.id === optId);
      if (opt?.is_correct) correct += 1;
    });
    const score = (correct / questions.length) * 100;
    const passed = score / 100 >= passScore;

    startTransition(async () => {
      await submitQuizAttempt({
        quizId,
        lessonId,
        answers,
        score,
        passed,
      });
      setStored(true);
    });
  }

  return (
    <div className="axr-quiz">
      {questions.map((q, qi) => {
        const selected = answers[q.id];
        return (
          <fieldset key={q.id} className="axr-quiz__question">
            <legend className="axr-quiz__legend">{fmt(t.lesson.quizQuestion, { n: qi + 1, total: questions.length })}</legend>
            <p className="axr-quiz__prompt">{q.prompt}</p>
            <div className="axr-quiz__options">
              {q.options.map((o, oi) => {
                let state: "default" | "selected" | "correct" | "wrong" = "default";
                if (validated) {
                  if (o.is_correct) state = "correct";
                  else if (selected === o.id) state = "wrong";
                } else if (selected === o.id) state = "selected";
                return (
                  <label key={o.id} className="axr-quiz__option" data-state={state}>
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={selected === o.id}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      disabled={validated}
                    />
                    <span className="axr-quiz__letter" aria-hidden>
                      {String.fromCharCode(65 + oi)}
                    </span>
                    <span className="axr-quiz__label">{o.label}</span>
                    {state === "correct" ? <span className="axr-quiz__tag axr-quiz__tag--ok">{copy.quizCorrect}</span> : null}
                    {state === "wrong" ? <span className="axr-quiz__tag axr-quiz__tag--bad">{copy.quizYours}</span> : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {!validated ? (
        <div className="axr-quiz__actions">
          <small>{fmt(copy.quizAnswered, { n: respondidas, total: questions.length })}</small>
          <button type="button" className="axr-btn axr-btn--primary" disabled={!allAnswered || pending} onClick={handleValidate}>
            {t.lesson.quizCheck}
          </button>
        </div>
      ) : (
        <div className={`axr-quiz__result ${result?.passed ? "is-pass" : "is-fail"}`} role="status">
          <div className="axr-quiz__score">
            <strong>{fmt(copy.quizScore, { n: Math.round(result?.score ?? 0) })}</strong>
            <small>{fmt(copy.quizNeed, { n: Math.round(passScore * 100) })}</small>
          </div>
          <div className="axr-quiz__result-text">
            <div className="axr-quiz__result-title">{result?.passed ? t.lesson.quizPassed : t.lesson.quizFailed}</div>
            <div className="axr-quiz__result-detail">
              {fmt(t.lesson.quizResultDetail, {
                correct: result?.correct ?? 0,
                total: result?.total ?? 0,
              })}
            </div>
          </div>
          <div className="axr-quiz__result-actions">
            {!result?.passed ? (
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                disabled={!stored}
                onClick={() => {
                  setAnswers({});
                  setValidated(false);
                  setStored(false);
                }}
              >
                {t.lesson.quizRetry}
              </button>
            ) : nextHref ? (
              <Link className="axr-btn axr-btn--primary" href={nextHref}>
                {nextLabel} →
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
