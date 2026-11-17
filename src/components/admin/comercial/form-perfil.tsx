"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { guardarPerfil } from "@/app/admin/comercial/leads/actions";
import { BLOQUES, contestadas, PREGUNTAS, type Pregunta, type Respuestas } from "@/lib/comercial/perfilado";

type Lead = { id: string; nombre: string; email: string | null; estado: string | null; creado: string | null };

/**
 * La ficha de perfilado de un lead: botones para cada respuesta (un clic,
 * sin desplegables) y una nota libre. Se guarda con el botón; «Guardar y
 * siguiente» salta al siguiente lead sin perfilar.
 */
export function FormPerfil({
  lead,
  inicial,
  notasIniciales,
  siguiente,
}: {
  lead: Lead;
  inicial: Respuestas;
  notasIniciales: string;
  siguiente: string | null;
}) {
  const router = useRouter();
  const [r, setR] = useState<Respuestas>(inicial);
  const [notas, setNotas] = useState(notasIniciales);
  const [estado, setEstado] = useState<{ ok?: string; error?: string } | null>(null);
  const [cambios, setCambios] = useState(false);
  const [pending, start] = useTransition();

  const poner = (k: string, v: string | number | string[] | undefined) => {
    setR((prev) => {
      const n = { ...prev };
      if (v === undefined || (Array.isArray(v) && !v.length)) delete n[k];
      else n[k] = v;
      return n;
    });
    setCambios(true);
    setEstado(null);
  };

  const guardar = (yLuego?: string | null) =>
    start(async () => {
      const res = await guardarPerfil(lead.id, { nombre: lead.nombre, email: lead.email, estado: lead.estado, creado: lead.creado }, r, notas);
      if (res.error) {
        setEstado({ error: res.error });
        return;
      }
      setCambios(false);
      setEstado({ ok: "Guardado." });
      if (yLuego) router.push(`/admin/comercial/leads?lead=${yLuego}`);
      else router.refresh();
    });

  const hechas = contestadas(r);

  return (
    <div className="axr-lp-form">
      {BLOQUES.map((b) => (
        <fieldset key={b.titulo} className="axr-lp-bloque">
          <legend>{b.titulo}</legend>
          {b.preguntas.map((p) => (
            <Campo key={p.k} p={p} valor={r[p.k]} poner={(v) => poner(p.k, v)} />
          ))}
        </fieldset>
      ))}

      <fieldset className="axr-lp-bloque">
        <legend>Notas</legend>
        <label className="axr-lp-q">
          <span className="axr-lp-q__t">Lo que quieras añadir</span>
          <span className="axr-lp-q__h">Frases suyas, objeciones, qué anuncio mencionó… Esto también lo lee el análisis con IA.</span>
          <textarea
            value={notas}
            maxLength={4000}
            rows={4}
            onChange={(e) => {
              setNotas(e.target.value);
              setCambios(true);
              setEstado(null);
            }}
          />
        </label>
      </fieldset>

      <div className="axr-lp-save">
        <span className="axr-lp-save__count">
          {hechas}/{PREGUNTAS.length} respondidas
          {estado?.ok && !cambios ? <em className="is-ok"> · {estado.ok}</em> : null}
          {cambios ? <em> · Cambios sin guardar</em> : null}
        </span>
        {estado?.error ? (
          <span role="alert" className="axr-lp-save__error">
            {estado.error}
          </span>
        ) : null}
        <div className="axr-lp-save__btns">
          <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => guardar()}>
            {pending ? "Guardando…" : "Guardar"}
          </button>
          {siguiente ? (
            <button type="button" className="axr-btn axr-btn--primary" disabled={pending} onClick={() => guardar(siguiente)}>
              Guardar y siguiente sin perfilar →
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Campo({ p, valor, poner }: { p: Pregunta; valor: Respuestas[string] | undefined; poner: (v: string | number | string[] | undefined) => void }) {
  return (
    <div className="axr-lp-q" role="group" aria-label={p.titulo}>
      <span className="axr-lp-q__t">{p.titulo}</span>
      {p.ayuda ? <span className="axr-lp-q__h">{p.ayuda}</span> : null}

      {p.tipo === "escala" ? (
        <div className="axr-lp-escala">
          {p.niveles.map((nivel, i) => {
            const n = i + 1;
            const on = valor === n;
            return (
              <button key={n} type="button" aria-pressed={on} className={on ? "is-on" : ""} onClick={() => poner(on ? undefined : n)} title={nivel}>
                <b>{n}</b>
                <small>{nivel}</small>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="axr-lp-chips">
          {p.opciones.map((o) => {
            const lista = Array.isArray(valor) ? valor : [];
            const on = p.tipo === "varias" ? lista.includes(o.k) : valor === o.k;
            return (
              <button
                key={o.k}
                type="button"
                aria-pressed={on}
                className={on ? "is-on" : ""}
                onClick={() =>
                  p.tipo === "varias"
                    ? poner(on ? lista.filter((x) => x !== o.k) : [...lista, o.k])
                    : poner(on ? undefined : o.k)
                }
              >
                {o.t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
