"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { generateLessonAudio, uploadLessonAudio } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";

export function AudioUpload({
  lessonId,
  currentUrl,
  ttsReady,
  lang = "es",
}: {
  lessonId: string;
  currentUrl: string | null;
  /** Si el servidor no tiene FISH_API_KEY, no se ofrece generar: sólo subir. */
  ttsReady: boolean;
  /** De qué versión es este audio: la española o la inglesa. */
  lang?: "es" | "en";
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [generatingNow, setGeneratingNow] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function handle(formData: FormData) {
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const r = await uploadLessonAudio(lessonId, formData, lang);
      if (r?.error) setErr(r.error);
      else {
        setMsg(t.adminForm.audioUploaded);
        router.refresh();
      }
    });
  }

  function generate() {
    setMsg(null);
    setErr(null);
    setGeneratingNow(true);
    startTransition(async () => {
      const r = await generateLessonAudio(lessonId, lang);
      setGeneratingNow(false);
      if (r?.error) setErr(r.error);
      else {
        setMsg(t.adminForm.audioGenerated);
        router.refresh();
      }
    });
  }

  return (
    <div className="axr-form">
      {currentUrl ? (
        // La URL cambia con cada generación, así que `key` fuerza a recargar el
        // <audio>: sin ella el navegador seguiría con el archivo anterior.
        <audio key={currentUrl} controls src={currentUrl} style={{ width: "100%" }} />
      ) : (
        <p style={{ color: "var(--axr-text-helper)", fontSize: "0.8125rem", margin: 0 }}>
          {t.adminForm.audioNone}
        </p>
      )}

      {ttsReady ? (
        <div className="axr-form__actions">
          <button
            type="button"
            className="axr-btn axr-btn--primary"
            onClick={generate}
            disabled={pending}
          >
            {generatingNow ? t.adminForm.generating : t.adminForm.generateAudio}
          </button>
        </div>
      ) : (
        <p style={{ color: "var(--axr-text-helper)", fontSize: "0.8125rem", margin: 0 }}>
          {t.adminForm.ttsOff}
        </p>
      )}

      <form action={handle}>
        <div className="axr-form__row">
          <label>{ttsReady ? t.adminForm.audioOrUpload : t.adminForm.audioUploadLabel}</label>
          <input type="file" name="file" accept="audio/*" required />
        </div>
        <div className="axr-form__actions">
          <button type="submit" className="axr-btn axr-btn--ghost" disabled={pending}>
            {pending && !generatingNow ? t.adminForm.uploading : t.adminForm.uploadAudio}
          </button>
        </div>
      </form>

      {msg ? <div className="axr-login__ok">{msg}</div> : null}
      {err ? <div className="axr-login__error">Error: {err}</div> : null}
    </div>
  );
}
