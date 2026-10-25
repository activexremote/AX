"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { changeUserRole } from "@/app/admin/usuarios/actions";
import { useI18n } from "@/lib/i18n/provider";
import type { UserRole } from "@/lib/supabase/types";

/** El rol de un usuario, que se cambia al elegirlo. Si falla, vuelve al de antes. */
export function RoleSelect({ userId, role, disabled, label }: { userId: string; role: UserRole; disabled?: boolean; label?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [current, setCurrent] = useState<UserRole>(role);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="axr-al-role">
      <select
        value={current}
        disabled={pending || disabled}
        aria-label={label}
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
      >
        <option value="alumno">{t.common.role_alumno}</option>
        <option value="profesor">{t.common.role_profesor}</option>
        <option value="administrador">{t.common.role_administrador}</option>
      </select>
      {error ? <small>{error}</small> : null}
    </span>
  );
}
