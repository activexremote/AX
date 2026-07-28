"use client";

import { useMemo, useState, useTransition } from "react";

import type { QuizOption, QuizQuestion } from "@/lib/supabase/types";
import { submitQuizAttempt } from "@/app/(campus)/lecciones/actions";
import { useI18n } from "@/lib/i18n/provider";
import { fmt } from "@/lib/i18n/dictionaries";

type Q = QuizQuestion & { options: QuizOption[] };

export function LessonQuiz({
  quizId,
  lessonId,
  questions,
  moduleHref,
  passScore,
}: {
  quizId: string;
  lessonId: string;
  questions: Q[];
  moduleHref: string;
  passScore: number;
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

  const allAnswered = questions.every((q) => answers[q.id]);

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
            <legend className="axr-quiz__legend">
              {fmt(t.lesson.quizQuestion, { n: qi + 1, total: questions.length })}
            </legend>
            <p className="axr-quiz__prompt">{q.prompt}</p>
            <div className="axr-quiz__options">
              {q.options.map((o) => {
                let state: "default" | "selected" | "correct" | "wrong" = "default";
                if (validated) {
                  if (o.is_correct) state = "correct";
                  else if (selected === o.id) state = "wrong";
                } else if (selected === o.id) state = "selected";
                return (
                  <label
                    key={o.id}
                    className="axr-quiz__option"
                    data-state={state}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={o.id}
                      checked={selected === o.id}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      disabled={validated}
                    />
                    <span>{o.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {!validated ? (
        <div className="axr-quiz__actions">
          <button
            type="button"
            className="axr-btn axr-btn--primary"
            disabled={!allAnswered || pending}
            onClick={handleValidate}
          >
            {t.lesson.quizCheck}
          </button>
        </div>
      ) : (
        <div className={`axr-quiz__result ${result?.passed ? "is-pass" : "is-fail"}`}>
          <div className="axr-quiz__result-icon" aria-hidden>
            {result?.passed ? "🎉" : "❌"}
          </div>
          <div className="axr-quiz__result-title">
            {result?.passed ? t.lesson.quizPassed : t.lesson.quizFailed}
          </div>
          <div className="axr-quiz__result-detail">
            {fmt(t.lesson.quizResultDetail, {
              correct: result?.correct ?? 0,
              total: result?.total ?? 0,
            })}
          </div>
          {stored && !result?.passed ? (
            <button
              type="button"
              className="axr-btn axr-btn--ghost"
              onClick={() => {
                setAnswers({});
                setValidated(false);
              }}
            >
              {t.lesson.quizRetry}
            </button>
          ) : null}
        </div>
      )}

      <hr className="axr-divider" />
      <div className="axr-quiz__footer">
        <a className="axr-btn axr-btn--ghost" href={moduleHref}>← {t.lesson.backToModule}</a>
        {result?.passed ? (
          <span className="axr-btn axr-btn--success" aria-disabled>
            ✓ {t.lesson.markedDone}
          </span>
        ) : null}
      </div>
    </div>
  );
}
