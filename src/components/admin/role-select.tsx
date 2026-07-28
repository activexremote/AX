"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { changeUserRole } from "@/app/admin/usuarios/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { UserRole } from "@/lib/supabase/types";

export function RoleSelect({ userId, role }: { userId: string; role: UserRole }) {
  const { t } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState<UserRole>(role);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: "0.125rem" }}>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as UserRole;
          const prev = current;
          setCurrent(next);
          setError(null);
          startTransition(async () => {
            const r = await changeUserRole(userId, next);
            if (r?.error) {
              setError(r.error);
              setCurrent(prev);
            } else {
              router.refresh();
            }
          });
        }}
        style={{
          padding: "0.375rem 0.5rem",
          border: "1px solid var(--axr-border-strong)",
          borderRadius: "2px",
          fontSize: "0.8125rem",
          fontFamily: "inherit",
        }}
      >
        <option value="alumno">{t.common.role_alumno}</option>
        <option value="profesor">{t.common.role_profesor}</option>
        <option value="administrador">{t.common.role_administrador}</option>
      </select>
      {error ? <span style={{ color: "#da1e28", fontSize: "0.6875rem" }}>{error}</span> : null}
    </span>
  );
}
