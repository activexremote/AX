"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { setCourseAccess } from "@/app/admin/usuarios/actions";
import { useI18n } from "@/lib/i18n/provider";

const COURSES = [
  { key: "remote-professional", label: "Remote Professional" },
  { key: "remote-founder", label: "Remote Founder" },
  { key: "web-abc", label: "Web ABC" },
] as const;

type CourseKey = (typeof COURSES)[number]["key"];

/** Un interruptor por curso: encendido = matrícula activa. */
export function AccessToggles({ userId, active }: { userId: string; active: string[] }) {
  const { t } = useI18n();
  const router = useRouter();
  const [on, setOn] = useState<Set<string>>(new Set(active));
  const [busy, setBusy] = useState<CourseKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(course: CourseKey) {
    const next = !on.has(course);
    const prev = new Set(on);
    const optimistic = new Set(on);
    if (next) optimistic.add(course);
    else optimistic.delete(course);
    setOn(optimistic);
    setBusy(course);
    setError(null);
    startTransition(async () => {
      const r = await setCourseAccess(userId, course, next);
      setBusy(null);
      if (r?.error) {
        setOn(prev);
        setError(t.admin.accessError);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <span className="axr-access">
      <span className="axr-access__row">
        {COURSES.map((c) => {
          const enabled = on.has(c.key);
          return (
            <button
              key={c.key}
              type="button"
              role="switch"
              aria-checked={enabled}
              disabled={busy !== null}
              className={`axr-access__chip${enabled ? " is-on" : ""}`}
              onClick={() => toggle(c.key)}
            >
              <span className="axr-access__dot" aria-hidden />
              {c.label}
            </button>
          );
        })}
      </span>
      {error ? <span className="axr-access__error">{error}</span> : null}
    </span>
  );
}
