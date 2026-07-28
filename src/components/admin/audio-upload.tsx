"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { uploadLessonAudio } from "@/app/admin/modulos/actions";
import { useI18n } from "@/lib/i18n/provider";

export function AudioUpload({ lessonId, currentUrl }: { lessonId: string; currentUrl: string | null }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function handle(formData: FormData) {
    setMsg(null);
    startTransition(async () => {
      const r = await uploadLessonAudio(lessonId, formData);
      if (r?.error) setMsg(`Error: ${r.error}`);
      else {
        setMsg(t.adminForm.audioUploaded);
        router.refresh();
      }
    });
  }

  return (
    <form action={handle} className="axr-form">
      {currentUrl ? (
        <audio controls src={currentUrl} style={{ width: "100%" }} />
      ) : (
        <p style={{ color: "var(--axr-text-helper)", fontSize: "0.8125rem", margin: 0 }}>
          {t.adminForm.audioNone}
        </p>
      )}
      <div className="axr-form__row">
        <label>{t.adminForm.audioUploadLabel}</label>
        <input type="file" name="file" accept="audio/*" required />
      </div>
      {msg ? <div className="axr-login__ok">{msg}</div> : null}
      <div className="axr-form__actions">
        <button type="submit" className="axr-btn axr-btn--primary" disabled={pending}>
          {pending ? t.adminForm.uploading : t.adminForm.uploadAudio}
        </button>
      </div>
    </form>
  );
}
