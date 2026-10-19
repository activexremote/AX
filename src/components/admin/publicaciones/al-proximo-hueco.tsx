"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { programarEnProximoHueco } from "@/app/admin/publicaciones/actions";
import type { PubCopy } from "@/lib/i18n/publicaciones";

/** Saca una de la nevera y la pone en el primer hueco libre de su canal. */
export function AlProximoHueco({ id, copy }: { id: string; copy: PubCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span style={{ display: "inline-flex", gap: "0.5rem", alignItems: "center" }}>
      {error ? <span style={{ color: "#da1e28", fontSize: "0.75rem" }}>{error}</span> : null}
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const r = await programarEnProximoHueco(id);
            if (r.error) setError(r.error);
            router.refresh();
          })
        }
      >
        {copy.fridgeNext}
      </button>
    </span>
  );
}
