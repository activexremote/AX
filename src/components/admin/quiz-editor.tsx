"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteQuizQuestion, upsertQuizQuestion } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { QuizOption, QuizQuestion } from "@/lib/supabase/types";

type Q = QuizQuestion & { options: QuizOption[] };

type DraftOption = { id?: string; label: string; isCorrect: boolean };

export function QuizEditor({ lessonId, questions }: { lessonId: string; questions: Q[] }) {
  const { t } = useI18n();
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <ol className="axr-quiz-editor__list">
        {questions.map((q, i) => (
          <QuestionRow key={q.id} lessonId={lessonId} question={q} index={i} />
        ))}
      </ol>

      {adding ? (
        <QuestionRow
          lessonId={lessonId}
          index={questions.length}
          onDone={() => setAdding(false)}
        />
      ) : (
        <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setAdding(true)}>
          + {t.adminForm.addQuestion}
        </button>
      )}
    </div>
  );
}

function QuestionRow({
  lessonId,
  question,
  index,
  onDone,
}: {
  lessonId: string;
  question?: Q;
  index: number;
  onDone?: () => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const isNew = !question;
  const [editing, setEditing] = useState(isNew);
  const [prompt, setPrompt] = useState(question?.prompt ?? "");
  const [options, setOptions] = useState<DraftOption[]>(
    question?.options.length
      ? question.options.map((o) => ({ id: o.id, label: o.label, isCorrect: o.is_correct }))
      : [
          { label: "", isCorrect: true },
          { label: "", isCorrect: false },
          { label: "", isCorrect: false },
          { label: "", isCorrect: false },
        ],
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!editing && question) {
    return (
      <li className="axr-quiz-editor__item">
        <div className="axr-quiz-editor__view">
          <strong>{index + 1}. {question.prompt}</strong>
          <ul>
            {question.options.map((o) => (
              <li key={o.id} data-correct={o.is_correct}>
                {o.is_correct ? "✓ " : "• "}{o.label}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: "flex", gap: "0.375rem" }}>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setEditing(true)}>
            {t.admin.edit}
          </button>
          <button
            type="button"
            className="axr-btn axr-btn--danger"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await deleteQuizQuestion(lessonId, question.id);
                router.refresh();
              })
            }
          >
            {t.admin.delete}
          </button>
        </div>
      </li>
    );
  }

  function save() {
    setError(null);
    if (!prompt.trim()) return setError(t.adminForm.errPrompt);
    const clean = options.filter((o) => o.label.trim());
    if (clean.length < 2) return setError(t.adminForm.errOptions);
    if (!clean.some((o) => o.isCorrect)) return setError(t.adminForm.errCorrect);

    startTransition(async () => {
      const r = await upsertQuizQuestion({
        lessonId,
        questionId: question?.id,
        prompt: prompt.trim(),
        orderIndex: question?.order_index ?? index + 1,
        options: clean.map((o, i) => ({
          id: o.id,
          label: o.label.trim(),
          isCorrect: o.isCorrect,
          orderIndex: i + 1,
        })),
      });
      if (r?.error) setError(r.error);
      else {
        router.refresh();
        if (isNew) onDone?.();
        else setEditing(false);
      }
    });
  }

  return (
    <li className="axr-quiz-editor__item axr-quiz-editor__item--editing">
      {error ? <div className="axr-login__error">{error}</div> : null}
      <div className="axr-form__row">
        <label>{t.adminForm.questionPrompt}</label>
        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </div>
      <div className="axr-quiz-editor__options">
        {options.map((o, i) => (
          <div key={i} className="axr-quiz-editor__option">
            <input
              type="radio"
              name={`correct-${question?.id ?? "new"}-${index}`}
              checked={o.isCorrect}
              onChange={() =>
                setOptions((prev) => prev.map((p, pi) => ({ ...p, isCorrect: pi === i })))
              }
            />
            <input
              type="text"
              placeholder={`${t.adminForm.option} ${i + 1}`}
              value={o.label}
              onChange={(e) =>
                setOptions((prev) => prev.map((p, pi) => (pi === i ? { ...p, label: e.target.value } : p)))
              }
            />
            {options.length > 2 ? (
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                onClick={() => setOptions((prev) => prev.filter((_, pi) => pi !== i))}
              >
                ✕
              </button>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="axr-btn axr-btn--ghost"
          onClick={() => setOptions((prev) => [...prev, { label: "", isCorrect: false }])}
        >
          + {t.adminForm.addOption}
        </button>
      </div>
      <div className="axr-form__actions">
        <button
          type="button"
          className="axr-btn axr-btn--ghost"
          onClick={() => (isNew ? onDone?.() : setEditing(false))}
        >
          {t.common.cancel}
        </button>
        <button type="button" className="axr-btn axr-btn--primary" disabled={pending} onClick={save}>
          {pending ? t.common.saving : t.adminForm.saveQuestion}
        </button>
      </div>
    </li>
  );
}
