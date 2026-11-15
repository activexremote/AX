"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { revisarRespuesta } from "@/app/admin/respuestas/actions";
import type { ActividadesCopy } from "@/lib/i18n/actividades";

// La revisión de una tarea: un nivel de 1 a 4 en cada criterio de la
// rúbrica, un comentario, y darla por buena o devolverla para rehacer.
export function FormRevision({
  id,
  rubrica,
  inicial,
  copy,
}: {
  id: string;
  rubrica: { k: string; titulo: string; niveles: string[] }[];
  inicial: { rubric: Record<string, number>; feedback: string };
  copy: ActividadesCopy;
}) {
  const router = useRouter();
  const [notas, setNotas] = useState<Record<string, number>>(inicial.rubric);
  const [feedback, setFeedback] = useState(inicial.feedback);
  const [msg, setMsg] = useState<string | null>(null);
  const [pendiente, empezar] = useTransition();

  const enviar = (devolver: boolean) =>
    empezar(async () => {
      const r = await revisarRespuesta({ id, rubric: notas, feedback, devolver });
      setMsg(r.ok ? copy.aSaved : copy.errors[r.error] ?? copy.errors.error);
      if (r.ok) router.refresh();
    });

  return (
    <div className="axr-resp__review">
      {rubrica.map((c) => (
        <fieldset key={c.k}>
          <legend>{c.titulo}</legend>
          {[4, 3, 2, 1].map((n) => (
            <label key={n} className={notas[c.k] === n ? "is-on" : undefined}>
              <input type="radio" name={`r-${c.k}`} checked={notas[c.k] === n} onChange={() => setNotas((p) => ({ ...p, [c.k]: n }))} />
              <span>
                <strong>{n}</strong> · {c.niveles[n - 1]}
              </span>
            </label>
          ))}
        </fieldset>
      ))}
      <label className="axr-resp__fb">
        <span>{copy.teacherFeedback}</span>
        <textarea rows={6} value={feedback} placeholder={copy.aFeedbackPh} onChange={(e) => setFeedback(e.target.value)} />
      </label>
      {msg ? <p className="axr-adm-note">{msg}</p> : null}
      <div className="axr-resp__actions">
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pendiente} onClick={() => enviar(true)}>
          {copy.aReturn}
        </button>
        <button type="button" className="axr-btn" disabled={pendiente} onClick={() => enviar(false)}>
          {copy.aMarkReviewed}
        </button>
      </div>
    </div>
  );
}
