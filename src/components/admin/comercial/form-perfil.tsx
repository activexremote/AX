"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import { guardarPerfil } from "@/app/admin/comercial/leads/actions";
import { BLOQUES, contestadas, PREGUNTAS, type Pregunta, type Respuestas } from "@/lib/comercial/perfilado";

type Lead = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  estado: string | null;
  creado: string | null;
};

/** Los pasos del formulario: un bloque de preguntas cada vez y, al final, las notas. */
const PASOS = [...BLOQUES.map((b) => ({ titulo: b.titulo, preguntas: b.preguntas })), { titulo: "Notas", preguntas: [] as Pregunta[] }];
const ULTIMO = PASOS.length - 1;

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", timeZone: "Europe/Madrid" }) : null;

/**
 * La ficha de perfilado de un lead, en una ventana que tapa el resto de la
 * página: un bloque de preguntas cada vez, con botones (un clic, sin
 * desplegables). Al pasar de bloque se guarda solo; al final, «Guardar y
 * siguiente» salta al siguiente lead sin perfilar.
 */
export function FormPerfil({
  lead,
  inicial,
  notasIniciales,
  cerrarHref,
  siguienteHref,
  pendientes,
}: {
  lead: Lead;
  inicial: Respuestas;
  notasIniciales: string;
  cerrarHref: string;
  siguienteHref: string | null;
  pendientes: number;
}) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const [r, setR] = useState<Respuestas>(inicial);
  const [notas, setNotas] = useState(notasIniciales);
  const [paso, setPaso] = useState(0);
  const [estado, setEstado] = useState<{ ok?: string; error?: string } | null>(null);
  const [cambios, setCambios] = useState(false);
  const [avisoCerrar, setAvisoCerrar] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    const d = dialogo.current;
    if (d && !d.open) d.showModal();
    // Que el foco empiece en la ventana, no en el teléfono (el primer enlace).
    caja.current?.focus();
  }, []);

  useEffect(() => {
    cuerpo.current?.scrollTo({ top: 0 });
  }, [paso]);

  const poner = (k: string, v: string | number | string[] | undefined) => {
    setR((prev) => {
      const n = { ...prev };
      if (v === undefined || (Array.isArray(v) && !v.length)) delete n[k];
      else n[k] = v;
      return n;
    });
    setCambios(true);
    setEstado(null);
    setAvisoCerrar(false);
  };

  /** Guarda y, si va bien, hace lo que toque después. */
  const guardar = (despues?: () => void) =>
    start(async () => {
      const res = await guardarPerfil(lead.id, { nombre: lead.nombre, email: lead.email, estado: lead.estado, creado: lead.creado }, r, notas);
      if (res.error) {
        setEstado({ error: res.error });
        return;
      }
      setCambios(false);
      setEstado({ ok: "Guardado" });
      if (despues) despues();
      else router.refresh();
    });

  const cerrar = () => router.push(cerrarHref, { scroll: false });
  const intentarCerrar = () => (cambios ? setAvisoCerrar(true) : cerrar());
  const irA = (n: number) => {
    if (cambios) guardar(() => setPaso(n));
    else setPaso(n);
  };

  const hechas = contestadas(r);
  const actual = PASOS[paso];
  const hechasEn = (ps: Pregunta[]) => ps.filter((p) => r[p.k] !== undefined).length;
  const telefono = lead.telefono?.replace(/\s+/g, "");

  return (
    <dialog
      ref={dialogo}
      className="axr-lp-modal"
      aria-labelledby="axr-lp-modal-t"
      onCancel={(e) => {
        e.preventDefault();
        intentarCerrar();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) intentarCerrar();
      }}
    >
      <div className="axr-lp-modal__box" ref={caja} tabIndex={-1}>
        <header className="axr-lp-modal__head">
          <div className="axr-lp-modal__who">
            <h2 id="axr-lp-modal-t">{lead.nombre}</h2>
            <p>
              {telefono ? <a href={`tel:${telefono}`}>{lead.telefono}</a> : null}
              {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : null}
              {lead.ciudad ? <span>{lead.ciudad}</span> : null}
              {fecha(lead.creado) ? <span>Entró el {fecha(lead.creado)}</span> : null}
              {lead.estado ? <span>Zoho: {lead.estado}</span> : null}
            </p>
          </div>
          <button type="button" className="axr-lp-modal__x" onClick={intentarCerrar} aria-label="Cerrar">
            ×
          </button>
        </header>

        <nav className="axr-lp-steps" aria-label="Bloques del formulario">
          {PASOS.map((p, i) => {
            const total = p.preguntas.length;
            const n = total ? hechasEn(p.preguntas) : notas.trim() ? 1 : 0;
            const completo = total ? n === total : n > 0;
            return (
              <button
                key={p.titulo}
                type="button"
                className={`${i === paso ? "is-on" : ""}${completo ? " is-done" : ""}`}
                aria-current={i === paso ? "step" : undefined}
                onClick={() => irA(i)}
                disabled={pending}
              >
                <b>{completo ? "✓" : i + 1}</b>
                <span>{p.titulo}</span>
                {total ? (
                  <small>
                    {n}/{total}
                  </small>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="axr-lp-modal__body" ref={cuerpo}>
          <p className="axr-lp-modal__kicker">
            Paso {paso + 1} de {PASOS.length}
          </p>
          <h3 className="axr-lp-modal__t">{actual.titulo}</h3>
          {actual.preguntas.length ? (
            actual.preguntas.map((p) => <Campo key={p.k} p={p} valor={r[p.k]} poner={(v) => poner(p.k, v)} />)
          ) : (
            <label className="axr-lp-q">
              <span className="axr-lp-q__t">Lo que quieras añadir</span>
              <span className="axr-lp-q__h">Frases suyas, objeciones, qué anuncio mencionó… Esto también lo lee el análisis con IA.</span>
              <textarea
                value={notas}
                maxLength={4000}
                rows={7}
                autoFocus
                onChange={(e) => {
                  setNotas(e.target.value);
                  setCambios(true);
                  setEstado(null);
                  setAvisoCerrar(false);
                }}
              />
            </label>
          )}
        </div>

        <footer className="axr-lp-modal__foot">
          {avisoCerrar ? (
            <div className="axr-lp-modal__aviso" role="alert">
              <span>Tienes cambios sin guardar.</span>
              <button type="button" className="axr-btn axr-btn--ghost" onClick={cerrar} disabled={pending}>
                Cerrar sin guardar
              </button>
              <button type="button" className="axr-btn axr-btn--primary" onClick={() => guardar(cerrar)} disabled={pending}>
                {pending ? "Guardando…" : "Guardar y cerrar"}
              </button>
            </div>
          ) : (
            <>
              <span className="axr-lp-save__count">
                {hechas}/{PREGUNTAS.length} respondidas
                {pending ? <em> · Guardando…</em> : cambios ? <em> · Sin guardar</em> : estado?.ok ? <em className="is-ok"> · {estado.ok}</em> : null}
              </span>
              {estado?.error ? (
                <span role="alert" className="axr-lp-save__error">
                  {estado.error}
                </span>
              ) : null}
              <div className="axr-lp-save__btns">
                {paso > 0 ? (
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => irA(paso - 1)}>
                    ← Anterior
                  </button>
                ) : null}
                {paso < ULTIMO ? (
                  <button type="button" className="axr-btn axr-btn--primary" disabled={pending} onClick={() => irA(paso + 1)}>
                    Siguiente →
                  </button>
                ) : (
                  <>
                    <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => guardar(cerrar)}>
                      Guardar y cerrar
                    </button>
                    {siguienteHref ? (
                      <button
                        type="button"
                        className="axr-btn axr-btn--primary"
                        disabled={pending}
                        onClick={() => guardar(() => router.push(siguienteHref, { scroll: false }))}
                        title={`Quedan ${pendientes} por perfilar`}
                      >
                        Guardar y siguiente lead →
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </>
          )}
        </footer>
      </div>
    </dialog>
  );
}

function Campo({ p, valor, poner }: { p: Pregunta; valor: Respuestas[string] | undefined; poner: (v: string | number | string[] | undefined) => void }) {
  return (
    <div className="axr-lp-q" role="group" aria-label={p.titulo}>
      <span className="axr-lp-q__t">
        {p.titulo}
        {p.tipo === "varias" ? <small> · puedes marcar varias</small> : null}
      </span>
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
                  p.tipo === "varias" ? poner(on ? lista.filter((x) => x !== o.k) : [...lista, o.k]) : poner(on ? undefined : o.k)
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
