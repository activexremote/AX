"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { rellenarHuecos } from "@/app/admin/publicaciones/actions";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";

/** Reparte la nevera por los huecos vacíos y dice cuántas ha colocado. */
export function RellenarHuecos({ copy, label, ghost }: { copy: PubCopy; label?: string; ghost?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <span className="axr-pubfill">
      <button
        type="button"
        className={`axr-btn${ghost ? " axr-btn--ghost" : ""}`}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMsg(null);
            const r = await rellenarHuecos();
            setMsg([fill(copy.fridgeFilled, r.colocadas), r.sinHueco ? fill(copy.fridgeNoSlot, r.sinHueco) : ""].filter(Boolean).join(" "));
            router.refresh();
          })
        }
      >
        {pending ? copy.fridgeFilling : (label ?? copy.calFill)}
      </button>
      {msg ? <span className="axr-pubfill__msg" role="status">{msg}</span> : null}
    </span>
  );
}
