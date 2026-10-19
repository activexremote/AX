"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { rellenarHuecos } from "@/app/admin/publicaciones/actions";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";

/** Reparte la nevera por los huecos vacíos y dice cuántas ha colocado. */
export function RellenarHuecos({ copy, label }: { copy: PubCopy; label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
      <button
        type="button"
        className="axr-btn"
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
      {msg ? <span style={{ fontSize: "0.8125rem" }}>{msg}</span> : null}
    </div>
  );
}
