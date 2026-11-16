"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { revisarRespuesta } from "@/app/admin/respuestas/actions";
import { notaDeRubrica } from "@/lib/actividades/tipos";
import type { ActividadesCopy } from "@/lib/i18n/actividades";

// La revisión de una tarea: un nivel de 1 a 4 en cada criterio de la
// rúbrica, la nota de 0 a 10 (por defecto, la de la rúbrica), un comentario,
// darla por buena o devolverla para rehacer, y avisar al alumno por correo.
export function FormRevision({
  id,
  rubrica,
  inicial,
  copy,
}: {
  id: string;
  rubrica: { k: string; titulo: string; niveles: string[] }[];
  inicial: { rubric: Record<string, number>; feedback: string; nota: number | null };
  copy: ActividadesCopy;
}) {
  const router = useRouter();
  const [notas, setNotas] = useState<Record<string, number>>(inicial.rubric);
  const [nota, setNota] = useState(inicial.nota !== null ? String(inicial.nota).replace(".", ",") : "");
  const [feedback, setFeedback] = useState(inicial.feedback);
  const [avisar, setAvisar] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [pendiente, empezar] = useTransition();
  const sugerida = notaDeRubrica(notas, rubrica.length);

  const enviar = (devolver: boolean) =>
    empezar(async () => {
      const limpia = nota.trim().replace(",", ".");
      const r = await revisarRespuesta({ id, rubric: notas, feedback, devolver, nota: limpia ? Number(limpia) : null, avisar });
      setMsg(r.ok ? (r.correo === "enviado" ? copy.aSavedMail : r.correo === "fallo" ? copy.aSavedMailFail : copy.aSaved) : (copy.errors as Record<string, string>)[r.error] ?? copy.errors.error);
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
        <span>{copy.aGrade}</span>
        <input
          type="text"
          inputMode="decimal"
          value={nota}
          placeholder={sugerida !== null ? String(sugerida).replace(".", ",") : ""}
          onChange={(e) => setNota(e.target.value.replace(/[^0-9.,]/g, "").slice(0, 5))}
          className="axr-resp__grade"
        />
        <small>{sugerida !== null ? copy.aGradeSuggested.replace("{n}", String(sugerida).replace(".", ",")) : copy.aGradeHint}</small>
      </label>
      <label className="axr-resp__fb">
        <span>{copy.teacherFeedback}</span>
        <textarea rows={6} value={feedback} placeholder={copy.aFeedbackPh} onChange={(e) => setFeedback(e.target.value)} />
      </label>
      <label className="axr-resp__notify">
        <input type="checkbox" checked={avisar} onChange={(e) => setAvisar(e.target.checked)} />
        <span>{copy.aNotify}</span>
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
