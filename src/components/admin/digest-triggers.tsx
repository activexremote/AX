"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  triggerReminders,
  triggerStudentDigest,
  triggerTeacherDigest,
} from "@/app/admin/slack/digest-actions";
import { useI18n } from "@/lib/i18n/provider";

// Los tres envíos que también hace el cron, a mano. Cada uno es una tarjeta
// pulsable; el resultado sale debajo.
export function DigestTriggers() {
  const { t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function run(fn: () => Promise<{ message: string }>) {
    setMsg(null);
    startTransition(async () => {
      const r = await fn();
      setMsg(r.message);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="axr-slack-digests">
        <button type="button" disabled={pending} onClick={() => run(triggerStudentDigest)}>
          <span aria-hidden>📊</span>
          <strong>{t.slack.digestStudents}</strong>
        </button>
        <button type="button" disabled={pending} onClick={() => run(triggerTeacherDigest)}>
          <span aria-hidden>🧭</span>
          <strong>{t.slack.digestTeachers}</strong>
        </button>
        <button type="button" disabled={pending} onClick={() => run(triggerReminders)}>
          <span aria-hidden>⏰</span>
          <strong>{t.slack.digestReminders}</strong>
        </button>
      </div>
      {msg ? <p className="axr-adm-note" style={{ marginTop: "0.75rem", marginBottom: 0 }}>{msg}</p> : null}
    </div>
  );
}
