"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { generarAnalisis } from "@/app/admin/comercial/analisis/actions";

/** Pide una lectura nueva a la IA (DeepSeek; cuesta céntimos). */
export function BotonAnalizar({ hayAnterior, deshabilitado }: { hayAnterior: boolean; deshabilitado?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="axr-la-ai__btn">
      <button
        type="button"
        className="axr-btn"
        disabled={pending || Boolean(deshabilitado)}
        title={deshabilitado}
        onClick={() =>
          start(async () => {
            setError(null);
            const r = await generarAnalisis();
            if (r.error) setError(r.error);
            else router.refresh();
          })
        }
      >
        {pending ? "Analizando… (unos 20 s)" : hayAnterior ? "Volver a analizar con IA" : "Analizar con IA"}
      </button>
      {deshabilitado ? <small>{deshabilitado}</small> : null}
      {error ? (
        <small role="alert" className="is-error">
          {error}
        </small>
      ) : null}
    </div>
  );
}
