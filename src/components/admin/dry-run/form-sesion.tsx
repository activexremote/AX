"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { guardarSesion } from "@/app/admin/dry-run/actions";
import type { DryRunCopy } from "@/lib/i18n/dry-run";

export type ValoresSesion = {
  title: string;
  slug: string;
  module_id: string;
  starts_at: string;
  ends_at: string;
  teacher_name: string;
  classroom_url: string;
  classroom_code: string;
  meet_url: string;
  agenda: string;
  capacity: string;
  access_until: string;
  registration_open: boolean;
};

/** Crear un dry run o editar el que hay. Las fechas van en hora de Madrid. */
export function FormSesion({
  id,
  valores,
  modulos,
  copy,
}: {
  id: string | null;
  valores: ValoresSesion;
  modulos: { id: string; label: string }[];
  copy: DryRunCopy;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; texto: string } | null>(null);

  function enviar(formData: FormData) {
    setMsg(null);
    startTransition(async () => {
      const r = await guardarSesion(id, formData);
      if (!r.ok) return setMsg({ ok: false, texto: r.error });
      if (!id) router.push(`/admin/dry-run/${r.id}`);
      else {
        setMsg({ ok: true, texto: copy.saved });
        router.refresh();
      }
    });
  }

  return (
    <form action={enviar} className="axr-form">
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="dr-title">{copy.fTitle}</label>
          <input id="dr-title" name="title" defaultValue={valores.title} required maxLength={140} />
        </div>
        <div className="axr-form__row">
          <label htmlFor="dr-slug">{copy.fSlug}</label>
          <input id="dr-slug" name="slug" defaultValue={valores.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} />
          <small>{copy.fSlugHint}</small>
        </div>
      </div>

      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="dr-module">{copy.fModule}</label>
          <select id="dr-module" name="module_id" defaultValue={valores.module_id} required>
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="axr-form__row">
          <label htmlFor="dr-teacher">{copy.fTeacher}</label>
          <input id="dr-teacher" name="teacher_name" defaultValue={valores.teacher_name} maxLength={80} />
        </div>
      </div>

      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="dr-start">{copy.fStart}</label>
          <input id="dr-start" name="starts_at" type="datetime-local" defaultValue={valores.starts_at} required />
        </div>
        <div className="axr-form__row">
          <label htmlFor="dr-end">{copy.fEnd}</label>
          <input id="dr-end" name="ends_at" type="datetime-local" defaultValue={valores.ends_at} required />
        </div>
      </div>

      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="dr-classroom">{copy.fClassroomUrl}</label>
          <input id="dr-classroom" name="classroom_url" type="url" defaultValue={valores.classroom_url} placeholder="https://classroom.google.com/c/…" />
        </div>
        <div className="axr-form__row">
          <label htmlFor="dr-code">{copy.fClassroomCode}</label>
          <input id="dr-code" name="classroom_code" defaultValue={valores.classroom_code} maxLength={40} />
        </div>
      </div>

      <div className="axr-form__row">
        <label htmlFor="dr-meet">{copy.fMeetUrl}</label>
        <input id="dr-meet" name="meet_url" type="url" defaultValue={valores.meet_url} placeholder="https://meet.google.com/…" />
        <small>{copy.fMeetHint}</small>
      </div>

      <div className="axr-form__row">
        <label htmlFor="dr-agenda">{copy.fAgenda}</label>
        <textarea id="dr-agenda" name="agenda" defaultValue={valores.agenda} rows={7} />
        <small>{copy.fAgendaHint}</small>
      </div>

      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="dr-cap">{copy.fCapacity}</label>
          <input id="dr-cap" name="capacity" type="number" min={1} defaultValue={valores.capacity} />
          <small>{copy.fCapacityHint}</small>
        </div>
        <div className="axr-form__row">
          <label htmlFor="dr-access">{copy.fAccessUntil}</label>
          <input id="dr-access" name="access_until" type="datetime-local" defaultValue={valores.access_until} />
          <small>{copy.fAccessHint}</small>
        </div>
      </div>

      <label className="axr-ia-switch">
        <input type="checkbox" name="registration_open" defaultChecked={valores.registration_open} />
        <span className="axr-ia-switch__track" aria-hidden />
        <span>
          <strong>{copy.fOpen}</strong>
        </span>
      </label>

      {msg ? <p className={`axr-adm-note axr-adm-note--${msg.ok ? "ok" : "bad"}`}>{msg.texto}</p> : null}
      <div className="axr-form__actions">
        <button type="submit" className="axr-btn" disabled={pending}>
          {id ? copy.save : copy.create}
        </button>
      </div>
    </form>
  );
}
