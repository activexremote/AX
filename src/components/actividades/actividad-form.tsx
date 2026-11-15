"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { guardarActividad } from "@/app/(campus)/lecciones/actividades";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { RespuestasVista, ResultadoVista } from "@/components/actividades/vista";
import { errores } from "@/lib/actividades/catalogo";
import { tx, type Actividad, type Campo, type FilaRespuesta, type Locale, type Respuestas } from "@/lib/actividades/tipos";
import type { ActividadesCopy } from "@/lib/i18n/actividades";

// ══════════════════════════════════════════════════════════
//  Una actividad del campus, en su tarjeta
//
//  Cerrada, dice qué es, cuánto lleva, cuándo vence y en qué estado está.
//  Abierta, es el formulario. Enviada, enseña el resultado (o el comentario
//  del profesor) y deja rehacerla mientras no esté revisada.
// ══════════════════════════════════════════════════════════

const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

export type ActividadFormProps = {
  act: Actividad;
  lessonId: string;
  fila: FilaRespuesta | null;
  locale: Locale;
  copy: ActividadesCopy;
  /** «Vence el sábado 21 de noviembre, 09:30». */
  plazo: string | null;
  /** Si aún no se puede hacer (las de las horas de clase del dry run, antes de la clase). */
  bloqueo?: string | null;
  abierta?: boolean;
};

export function ActividadForm({ act, lessonId, fila, locale, copy, plazo, bloqueo, abierta }: ActividadFormProps) {
  const router = useRouter();
  const [estado, setEstado] = useState(fila?.status ?? null);
  const [resultado, setResultado] = useState(fila?.result ?? null);
  const [guardadas, setGuardadas] = useState<Respuestas>(fila?.answers ?? {});
  const [r, setR] = useState<Respuestas>(fila?.answers ?? {});
  const enviada = estado === "enviada" || estado === "revisada";
  const [editando, setEditando] = useState(!enviada);
  const [abiertaYa, setAbiertaYa] = useState(Boolean(abierta) || estado === "devuelta");
  const [marcas, setMarcas] = useState<Record<string, "falta" | "url">>({});
  const [aviso, setAviso] = useState<{ tono: "ok" | "bad"; texto: string } | null>(null);
  const [pendiente, empezar] = useTransition();

  const nivel = act.obligatoria ? copy.required : act.tipo === "juego" ? copy.optional : copy.recommended;
  const pill = estado === "revisada" ? "axr-c-pill--ok" : estado === "enviada" ? "axr-c-pill--info" : estado === "devuelta" ? "axr-c-pill--bad" : estado === "borrador" ? "axr-c-pill--warn" : "";
  const etiqueta = copy.status[(estado ?? "pendiente") as keyof typeof copy.status];
  const fecha = (iso: string) => new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long" });

  const set = (k: string, v: string | string[]) => {
    setR((prev) => ({ ...prev, [k]: v }));
    if (marcas[k]) setMarcas(({ [k]: _, ...resto }) => resto);
  };

  const guardar = (enviar: boolean) => {
    setAviso(null);
    if (enviar) {
      const e = errores(act, r);
      if (Object.keys(e).length) {
        setMarcas(e);
        setAviso({ tono: "bad", texto: f(copy.incomplete, { n: Object.keys(e).length }) });
        document.getElementById(`campo-${act.key}-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    empezar(async () => {
      const res = await guardarActividad({ key: act.key, lessonId, answers: r, enviar });
      if (!res.ok) {
        if (res.campos) setMarcas(res.campos);
        setAviso({ tono: "bad", texto: copy.errors[res.error] ?? copy.errors.error });
        return;
      }
      setEstado(res.status);
      if (enviar) {
        setResultado(res.result);
        setGuardadas(r);
        setEditando(false);
        setAviso(null);
        document.getElementById(`act-${act.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else setAviso({ tono: "ok", texto: copy.draftSaved });
      router.refresh();
    });
  };

  const conBorrador = act.tipo === "formulario";
  const puedeRehacer = estado === "enviada" || (estado === "revisada" && act.tipo === "test");

  return (
    <section id={`act-${act.key}`} className={`axr-act${enviada ? " is-done" : ""}`}>
      <header className="axr-act__head">
        <span className="axr-act__icon" aria-hidden>
          <Icono n={enviada ? "ok" : act.tipo === "test" ? "tareas" : act.tipo === "formulario" ? "revisar" : "chispa"} size={18} />
        </span>
        <div className="axr-act__titles">
          <h3>{tx(act.titulo, locale)}</h3>
          <div className="axr-act__meta">
            <span className={`axr-c-pill ${pill}`}>{etiqueta}</span>
            <span className="axr-c-pill">{nivel}</span>
            <span className="axr-c-pill">
              <Icono n="reloj" size={12} /> {f(copy.minutes, { n: act.minutos })}
            </span>
            {plazo && !enviada ? (
              <span className="axr-c-pill">
                <Icono n="calendario" size={12} /> {f(copy.dueOn, { d: plazo })}
              </span>
            ) : null}
            {fila?.submitted_at && enviada ? <span className="axr-act__date">{f(copy.submittedOn, { d: fecha(fila.submitted_at) })}</span> : null}
          </div>
        </div>
        {!abiertaYa && !bloqueo ? (
          <button type="button" className={`axr-btn axr-btn--small${enviada ? " axr-btn--ghost" : ""}`} onClick={() => setAbiertaYa(true)}>
            {enviada ? copy.open : estado === "borrador" ? copy.continue : copy.start}
          </button>
        ) : null}
      </header>

      <p className="axr-act__lead">{tx(act.resumen, locale)}</p>
      {bloqueo ? (
        <p className="axr-c-note">
          <Icono n="reloj" /> <span>{bloqueo}</span>
        </p>
      ) : null}

      {abiertaYa && !bloqueo ? (
        <div className="axr-act__body">
          {act.visible ? (
            <p className="axr-act__visible">
              <Icono n="info" size={14} /> <strong>{copy.visibleTo}:</strong> {tx(act.visible, locale)}
            </p>
          ) : null}

          {/* El comentario del profesor, siempre arriba si lo hay. */}
          {fila?.feedback && (estado === "revisada" || estado === "devuelta") ? (
            <div className={`axr-c-note ${estado === "devuelta" ? "axr-c-note--bad" : "axr-c-note--ok"}`}>
              <Icono n={estado === "devuelta" ? "aviso" : "chat"} />
              <div>
                <strong>{copy.teacherFeedback}</strong>
                {estado === "devuelta" ? <p>{copy.returned}</p> : null}
                <p className="axr-act__feedback">{fila.feedback}</p>
                {fila.rubric && act.rubrica ? (
                  <ul className="axr-act__rubric">
                    {act.rubrica.map((c) => (
                      <li key={c.k}>
                        <strong>{tx(c.titulo, locale)}:</strong> {fila.rubric?.[c.k] ?? "—"}/4 · {fila.rubric?.[c.k] ? tx(c.niveles[(fila.rubric[c.k] ?? 1) - 1], locale) : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}

          {!editando ? (
            <>
              {act.anonima ? <p className="axr-c-note axr-c-note--ok">{copy.thanksAnon}</p> : null}
              {act.tipo === "formulario" && estado === "enviada" ? <p className="axr-c-note axr-c-note--ok">{copy.thanksForm}</p> : null}
              <ResultadoVista act={act} result={resultado} answers={guardadas} locale={locale} copy={copy} />
              {act.tipo === "formulario" || act.tipo === "encuesta" ? (
                <details className="axr-act__answers" open={act.tipo === "formulario"}>
                  <summary>{copy.seeAnswers}</summary>
                  <RespuestasVista act={act} answers={guardadas} locale={locale} copy={copy} />
                </details>
              ) : null}
              {puedeRehacer && !act.anonima ? (
                <div className="axr-act__actions">
                  <button
                    type="button"
                    className="axr-btn axr-btn--ghost"
                    onClick={() => {
                      setEditando(true);
                      if (act.tipo === "test" || act.tipo === "juego") setR({});
                    }}
                  >
                    {act.tipo === "test" ? copy.retake : copy.edit}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <form
              className="axr-act__form"
              onSubmit={(e) => {
                e.preventDefault();
                guardar(true);
              }}
              noValidate
            >
              {act.campos.map((c) => (
                <CampoVista key={c.k} act={act} c={c} r={r} set={set} marca={marcas[c.k]} locale={locale} copy={copy} />
              ))}
              {aviso ? (
                <p className={`axr-c-note axr-c-note--${aviso.tono}`} role="status">
                  {aviso.texto}
                </p>
              ) : null}
              <div className="axr-act__actions">
                {conBorrador && estado !== "enviada" ? (
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pendiente} onClick={() => guardar(false)}>
                    {pendiente ? copy.saving : copy.saveDraft}
                  </button>
                ) : null}
                {enviada ? (
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pendiente} onClick={() => (setR(guardadas), setEditando(false), setMarcas({}), setAviso(null))}>
                    {copy.cancelEdit}
                  </button>
                ) : null}
                <button type="submit" className="axr-btn" disabled={pendiente}>
                  {pendiente ? copy.submitting : copy.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : null}
    </section>
  );
}

function CampoVista({
  act,
  c,
  r,
  set,
  marca,
  locale,
  copy,
}: {
  act: Actividad;
  c: Campo;
  r: Respuestas;
  set: (k: string, v: string | string[]) => void;
  marca?: "falta" | "url";
  locale: Locale;
  copy: ActividadesCopy;
}) {
  if (c.tipo === "seccion") {
    return (
      <div className="axr-act__section">
        <h4>{tx(c.label, locale)}</h4>
        {c.ayuda ? <p>{tx(c.ayuda, locale)}</p> : null}
      </div>
    );
  }
  const id = `campo-${act.key}-${c.k}`;
  const v = r[c.k];
  const s = typeof v === "string" ? v : "";
  const error = marca === "falta" ? copy.required_field : marca === "url" ? copy.bad_url : null;
  const cab = (
    <>
      <span className="axr-act__label">{tx(c.label, locale)}</span>
      {c.ayuda ? <span className="axr-act__help">{tx(c.ayuda, locale)}</span> : null}
    </>
  );

  let control: React.ReactNode = null;
  if (c.tipo === "texto" || c.tipo === "url") {
    control = (
      <input
        id={id}
        type={c.tipo === "url" ? "url" : "text"}
        className="axr-act__input"
        value={s}
        maxLength={c.tipo === "texto" ? c.max : undefined}
        placeholder={c.tipo === "url" ? (c.placeholder ? tx(c.placeholder, locale) : copy.urlPh) : c.placeholder ? tx(c.placeholder, locale) : undefined}
        onChange={(e) => set(c.k, e.target.value)}
        aria-invalid={Boolean(error)}
      />
    );
  } else if (c.tipo === "parrafo") {
    control = (
      <>
        <textarea id={id} className="axr-act__input" rows={4} value={s} maxLength={c.max} placeholder={c.placeholder ? tx(c.placeholder, locale) : undefined} onChange={(e) => set(c.k, e.target.value)} aria-invalid={Boolean(error)} />
        {c.max ? <small className="axr-act__count">{f(copy.chars, { n: s.length, max: c.max })}</small> : null}
      </>
    );
  } else if (c.tipo === "opcion" || c.tipo === "sino") {
    const ops = c.tipo === "sino" ? [{ v: "si", es: copy.yes, en: copy.yes }, { v: "no", es: copy.no, en: copy.no }] : c.opciones;
    control = (
      <div className={`axr-act__choices${c.tipo === "sino" ? " axr-act__choices--row" : ""}`} role="radiogroup" id={id}>
        {ops.map((o) => (
          <label key={o.v} className={`axr-act__choice${s === o.v ? " is-on" : ""}`}>
            <input type="radio" name={id} value={o.v} checked={s === o.v} onChange={() => set(c.k, o.v)} />
            <span>{o[locale]}</span>
          </label>
        ))}
      </div>
    );
  } else if (c.tipo === "multiple") {
    const lista = Array.isArray(v) ? v : [];
    const otra = typeof r[`${c.k}__otra`] === "string" ? (r[`${c.k}__otra`] as string) : "";
    control = (
      <div className="axr-act__choices" id={id}>
        {c.opciones.map((o) => (
          <label key={o.v} className={`axr-act__choice${lista.includes(o.v) ? " is-on" : ""}`}>
            <input type="checkbox" checked={lista.includes(o.v)} onChange={(e) => set(c.k, e.target.checked ? [...lista, o.v] : lista.filter((x) => x !== o.v))} />
            <span>{o[locale]}</span>
          </label>
        ))}
        {c.otra ? <input type="text" className="axr-act__input" placeholder={`${copy.other}: ${copy.otherPh}`} value={otra} maxLength={200} onChange={(e) => set(`${c.k}__otra`, e.target.value)} /> : null}
      </div>
    );
  } else if (c.tipo === "escala") {
    const nums = Array.from({ length: c.max - c.min + 1 }, (_, i) => String(c.min + i));
    control = (
      <div className="axr-act__scale" role="radiogroup" id={id}>
        {c.extremos ? <small>{tx(c.extremos[0], locale)}</small> : null}
        {nums.map((n) => (
          <label key={n} className={`axr-act__dot${s === n ? " is-on" : ""}`}>
            <input type="radio" name={id} value={n} checked={s === n} onChange={() => set(c.k, n)} />
            <span>{n}</span>
          </label>
        ))}
        {c.extremos ? <small>{tx(c.extremos[1], locale)}</small> : null}
      </div>
    );
  }

  const agrupa = c.tipo === "opcion" || c.tipo === "sino" || c.tipo === "multiple" || c.tipo === "escala";
  return agrupa ? (
    <fieldset className={`axr-act__field${error ? " is-error" : ""}`}>
      <legend>{cab}</legend>
      {control}
      {error ? <span className="axr-act__error">{error}</span> : null}
    </fieldset>
  ) : (
    <div className={`axr-act__field${error ? " is-error" : ""}`}>
      <label htmlFor={id}>{cab}</label>
      {control}
      {error ? <span className="axr-act__error">{error}</span> : null}
    </div>
  );
}
