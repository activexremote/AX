"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  triggerReminders,
  triggerStudentDigest,
  triggerTeacherDigest,
} from "@/app/admin/slack/digest-actions";
import { useI18n } from "@/lib/i18n/provider";

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
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => run(triggerStudentDigest)}>
          📊 {t.slack.digestStudents}
        </button>
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => run(triggerTeacherDigest)}>
          🧭 {t.slack.digestTeachers}
        </button>
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => run(triggerReminders)}>
          ⏰ {t.slack.digestReminders}
        </button>
      </div>
      {msg ? <p style={{ fontSize: "0.8125rem", marginBottom: 0 }}>{msg}</p> : null}
    </div>
  );
}
