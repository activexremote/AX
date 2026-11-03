"use client";

import { useState, useTransition } from "react";

import { enviarFeedback } from "@/app/(campus)/preparacion/actions";
import type { Feedback } from "@/lib/dry-run/tipos";

const VALORACIONES: [keyof Feedback, string][] = [
  ["clase", "La dinámica de la clase"],
  ["ritmo", "El ritmo y la duración"],
  ["contenido", "El contenido del módulo"],
  ["docente", "El docente"],
  ["campus", "El campus (lecciones, material, asistente)"],
];

/** Tres minutos: una nota de 0 a 10, cinco valoraciones de 1 a 5 y tres preguntas abiertas. */
export function FormularioFeedback({ guestId, previo }: { guestId: string; previo: Feedback | null }) {
  const [pending, startTransition] = useTransition();
  const [estado, setEstado] = useState<{ ok: boolean; texto: string } | null>(null);

  function enviar(formData: FormData) {
    setEstado(null);
    startTransition(async () => {
      const r = await enviarFeedback(guestId, formData);
      setEstado(r.error ? { ok: false, texto: r.error } : { ok: true, texto: "¡Gracias! Lo hemos recibido. Puedes cambiarlo cuando quieras." });
    });
  }

  return (
    <form action={enviar} className="axr-prep__fb">
      <fieldset>
        <legend>¿Con qué probabilidad recomendarías este curso a alguien como tú? (0 = nada, 10 = seguro)</legend>
        <div className="axr-prep__nps">
          {Array.from({ length: 11 }, (_, n) => (
            <label key={n}>
              <input type="radio" name="nps" value={n} defaultChecked={previo?.nps === n} required />
              <span>{n}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Valora de 1 (mal) a 5 (muy bien)</legend>
        <div className="axr-prep__rates">
          {VALORACIONES.map(([k, etiqueta]) => (
            <div key={k} className="axr-prep__rate">
              <span>{etiqueta}</span>
              <div>
                {[1, 2, 3, 4, 5].map((n) => (
                  <label key={n}>
                    <input type="radio" name={k} value={n} defaultChecked={previo?.[k] === n} />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Si el curso completo estuviera abierto, ¿lo harías?</legend>
        <div className="axr-prep__pills">
          {(
            [
              ["si", "Sí"],
              ["quiza", "Quizá"],
              ["no", "No"],
            ] as const
          ).map(([v, t]) => (
            <label key={v}>
              <input type="radio" name="pagaria" value={v} defaultChecked={previo?.pagaria === v} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="axr-prep__field">
        <span>Lo que más te ha servido</span>
        <textarea name="gusto" rows={3} defaultValue={previo?.gusto ?? ""} />
      </label>
      <label className="axr-prep__field">
        <span>Lo que cambiarías o te ha sobrado</span>
        <textarea name="cambiaria" rows={3} defaultValue={previo?.cambiaria ?? ""} />
      </label>
      <label className="axr-prep__field">
        <span>Cualquier otra cosa (el campus, Classroom, los correos…)</span>
        <textarea name="comentario" rows={3} defaultValue={previo?.comentario ?? ""} />
      </label>

      {estado ? <p className={`axr-c-note axr-c-note--${estado.ok ? "ok" : "warn"}`}>{estado.texto}</p> : null}
      <div>
        <button type="submit" className="axr-btn" disabled={pending}>
          {pending ? "Enviando…" : previo ? "Actualizar mi feedback" : "Enviar mi feedback"}
        </button>
      </div>
    </form>
  );
}
