"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { analizarRespuestas, enviarEncuestaPorCorreo } from "@/app/admin/dry-run/[id]/encuesta/actions";

// Los botones de /admin/dry-run/<id>/encuesta.

/** Pide una lectura nueva a la IA (DeepSeek; cuesta céntimos). */
export function BotonAnalizarEncuesta({ runId, hayAnterior, deshabilitado }: { runId: string; hayAnterior: boolean; deshabilitado?: string }) {
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
            const r = await analizarRespuestas(runId);
            if (!r.ok) setError(r.error);
            else router.refresh();
          })
        }
      >
        {pending ? "Analizando… (unos 30 s)" : hayAnterior ? "Volver a analizar con IA" : "Analizar con IA"}
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

/** Manda la encuesta por correo a quien falta. Pide confirmar con un segundo clic. */
export function BotonEnviarEncuesta({ runId, pendientes, yaEnviados }: { runId: string; pendientes: number; yaEnviados: number }) {
  const router = useRouter();
  const [seguro, setSeguro] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [pending, start] = useTransition();
  if (!pendientes) return <small className="axr-dre-muted">Todos los que tienen plaza y correo ya han respondido.</small>;
  const etiqueta = yaEnviados ? `Recordar por correo a ${pendientes}` : `Enviar por correo a ${pendientes}`;
  return (
    <div className="axr-dre-send">
      {seguro ? (
        <>
          <button
            type="button"
            className="axr-btn"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const r = await enviarEncuestaPorCorreo(runId);
                setSeguro(false);
                setMsg(r.ok ? { ok: true, t: `En la cola: sale ahora a ${r.n} ${r.n === 1 ? "persona" : "personas"}.` } : { ok: false, t: r.error });
                router.refresh();
              })
            }
          >
            {pending ? "Enviando…" : `Sí, enviar a ${pendientes}`}
          </button>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setSeguro(false)} disabled={pending}>
            Cancelar
          </button>
        </>
      ) : (
        <button type="button" className="axr-btn" onClick={() => setSeguro(true)}>
          {etiqueta}
        </button>
      )}
      {msg ? <small className={msg.ok ? "is-ok" : "is-error"}>{msg.t}</small> : null}
    </div>
  );
}

export function CopiarTexto({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="axr-btn axr-btn--ghost axr-btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* sin permiso de portapapeles: se copia a mano */
        }
      }}
    >
      {ok ? "¡Copiado!" : etiqueta}
    </button>
  );
}
