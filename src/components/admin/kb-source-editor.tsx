"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createSource,
  deleteSource,
  dismissQuestion,
  faqFromQuestion,
  getSourceBody,
  setSourceActive,
  updateSource,
} from "@/app/admin/asistente/actions";
import { DeleteButton } from "@/components/admin/delete-button";
import { ALL_COURSES } from "@/lib/asistente/courses";
import { useI18n } from "@/lib/i18n/provider";
import type { KbKind, KbSource } from "@/lib/supabase/types";

/** Sin `body`, el texto se pide al abrir el formulario (los documentos). */
type Editable = Pick<KbSource, "id" | "kind" | "title" | "course" | "active" | "file_name"> & { body?: string };

/**
 * Botón que abre el formulario de una FAQ o un documento.
 *
 * Tres modos: crear, editar (`source`) y convertir una pregunta sin respuesta
 * en FAQ (`questionId`, con la pregunta ya escrita).
 */
export function KbSourceButton({
  kind,
  source,
  questionId,
  initialTitle,
  label,
  variant = "primary",
}: {
  kind: KbKind;
  source?: Editable;
  questionId?: string;
  initialTitle?: string;
  label: string;
  variant?: "primary" | "ghost";
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState<string | undefined>(source?.body);

  function openForm() {
    setError(null);
    setOpen(true);
    // Siempre fresco: tras guardar, el texto que se cargó la vez anterior ya no vale.
    setBody(source?.body);
    if (source && source.body === undefined) {
      startTransition(async () => {
        const r = await getSourceBody(source.id);
        if (r.error) setError(r.error);
        else setBody(r.body ?? "");
      });
    }
  }

  const loading = Boolean(source) && body === undefined;

  const heading = source
    ? kind === "faq" ? t.kb.editFaq : t.kb.editDoc
    : kind === "faq" ? t.kb.newFaq : t.kb.newDoc;

  function handle(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const r = source
        ? await updateSource(source.id, kind, formData)
        : questionId
          ? await faqFromQuestion(questionId, formData)
          : await createSource(kind, formData);
      if (r.error) {
        setError(r.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button type="button" className={`axr-btn axr-btn--${variant}`} onClick={openForm}>
        {label}
      </button>

      {open ? (
        <div className="axr-modal">
          <div className="axr-modal__panel" style={{ maxWidth: kind === "documento" ? 760 : 560 }}>
            <h2>{heading}</h2>
            {loading ? (
              <p style={{ margin: 0 }}>{error ?? t.common.loading}</p>
            ) : (
            <form action={handle} className="axr-form">
              {error ? <div className="axr-login__error">{error}</div> : null}

              <div className="axr-form__row">
                <label htmlFor="kb-title">{kind === "faq" ? t.kb.question : t.kb.docTitle}</label>
                <input
                  id="kb-title"
                  name="title"
                  required
                  defaultValue={source?.title ?? initialTitle ?? ""}
                  placeholder={kind === "documento" ? t.kb.docTitlePlaceholder : undefined}
                />
              </div>

              {kind === "documento" ? (
                <div className="axr-form__row">
                  <label htmlFor="kb-file">{t.kb.file}</label>
                  <input id="kb-file" name="file" type="file" accept=".pdf,.md,.markdown,.txt,application/pdf,text/plain,text/markdown" />
                  <span style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)" }}>
                    {source?.file_name ? `${source.file_name} · ` : ""}{t.kb.fileHint}
                  </span>
                </div>
              ) : null}

              <div className="axr-form__row">
                <label htmlFor="kb-body">{kind === "faq" ? t.kb.answer : t.kb.text}</label>
                <textarea
                  id="kb-body"
                  name="body"
                  // En un documento el archivo puede sustituir al texto.
                  required={kind === "faq"}
                  rows={kind === "faq" ? 6 : 14}
                  defaultValue={body ?? ""}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)" }}>
                  {kind === "faq" ? t.kb.answerHint : source ? t.kb.textEditHint : null}
                </span>
              </div>

              <div className="axr-form__row">
                <label htmlFor="kb-course">{t.kb.course}</label>
                <select id="kb-course" name="course" defaultValue={source?.course ?? ""}>
                  <option value="">{t.kb.allCourses}</option>
                  {ALL_COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {source ? (
                <div className="axr-form__row">
                  <label style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input type="checkbox" name="active" defaultChecked={source.active} style={{ width: "auto" }} />
                    {t.kb.active}
                  </label>
                </div>
              ) : null}

              <div className="axr-form__actions">
                <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setOpen(false)} disabled={pending}>
                  {t.common.cancel}
                </button>
                <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
                  {pending ? t.common.saving : t.common.save}
                </button>
              </div>
            </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Acciones de cada fila: editar, activar/desactivar y borrar. */
export function KbRowActions({ source }: { source: Editable }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ error?: string }>) {
    startTransition(async () => {
      const r = await fn();
      if (r.error) console.error(r.error);
      router.refresh();
    });
  }

  return (
    <span className="axr-admin-table__actions">
      <KbSourceButton kind={source.kind} source={source} label={t.admin.edit} variant="ghost" />
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        disabled={pending}
        onClick={() => run(() => setSourceActive(source.id, !source.active))}
      >
        {source.active ? t.kb.deactivate : t.kb.activate}
      </button>
      <DeleteButton action={() => deleteSource(source.id)} />
    </span>
  );
}

/** Pregunta sin respuesta: convertirla en FAQ o descartarla. */
export function KbQuestionActions({ id, question }: { id: string; question: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <span className="axr-admin-table__actions">
      <KbSourceButton kind="faq" questionId={id} initialTitle={question} label={t.kb.createFaq} />
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await dismissQuestion(id);
            router.refresh();
          })
        }
      >
        {t.kb.dismiss}
      </button>
    </span>
  );
}
