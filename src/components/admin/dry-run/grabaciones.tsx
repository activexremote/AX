"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cancelarGrabaciones, programarGrabaciones } from "@/app/admin/dry-run/actions";

/**
 * Programar el correo de las grabaciones para todos los invitados: una
 * fecha y hora (de Madrid) y un segundo clic para confirmar.
 */
export function ProgramarGrabaciones({ runId, total, porDefecto, pendientes, hayGrabaciones }: {
  runId: string;
  total: number;
  porDefecto: string;
  pendientes: number;
  hayGrabaciones: boolean;
}) {
  const router = useRouter();
  const [cuando, setCuando] = useState(porDefecto);
  const [seguro, setSeguro] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [pending, start] = useTransition();

  const programar = () =>
    start(async () => {
      const r = await programarGrabaciones(runId, cuando);
      setSeguro(false);
      setMsg(
        r.ok
          ? {
              ok: true,
              t: `Programado para ${r.n} ${r.n === 1 ? "persona" : "personas"}: ${new Date(r.at).toLocaleString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" })}.`,
            }
          : { ok: false, t: r.error },
      );
      router.refresh();
    });

  const cancelar = () =>
    start(async () => {
      const r = await cancelarGrabaciones(runId);
      setMsg(r.ok ? { ok: true, t: `Cancelados ${r.n}.` } : { ok: false, t: r.error });
      router.refresh();
    });

  return (
    <div className="axr-dra-rec">
      <label>
        <span>Cuándo sale (hora de Madrid)</span>
        <input type="datetime-local" value={cuando} onChange={(e) => setCuando(e.target.value)} disabled={pending} />
      </label>
      {seguro ? (
        <>
          <button type="button" className="axr-btn" onClick={programar} disabled={pending}>
            {pending ? "Programando…" : `Sí, programar para ${total}`}
          </button>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setSeguro(false)} disabled={pending}>
            Cancelar
          </button>
        </>
      ) : (
        <button type="button" className="axr-btn" onClick={() => setSeguro(true)} disabled={!hayGrabaciones || !total || pending}>
          {pendientes ? "Cambiar la hora" : `Programar para ${total} invitados`}
        </button>
      )}
      {pendientes && !seguro ? (
        <button type="button" className="axr-btn axr-btn--ghost" onClick={cancelar} disabled={pending}>
          Cancelar el envío ({pendientes})
        </button>
      ) : null}
      {msg ? <small className={msg.ok ? "is-ok" : "is-error"}>{msg.t}</small> : null}
    </div>
  );
}
