"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { responderEncuesta } from "@/app/dry-run/[slug]/encuesta/actions";
import { PREGUNTAS, type Bloque, type Pregunta, type Respuestas } from "@/lib/dry-run/encuesta";

const TXT = {
  es: {
    of: "de",
    thanksTitle: "¡Gracias! Hemos recibido tus respuestas.",
    thanksBody: "Lo leemos todo, y lo que nos has contado cambia la versión final del curso. Si quieres corregir algo, puedes volver a esta página cuando quieras.",
    review: "Revisar mis respuestas",
    sending: "Enviando…",
    save: "Guardar mis respuestas",
    send: "Enviar mis respuestas",
    required: "Las preguntas con * son obligatorias. El resto, contesta las que quieras.",
    npsLow: "Nada probable",
    npsHigh: "Seguro que sí",
    teacher: (n: string) => `¿Cómo explicó ${n}?`,
  },
  en: {
    of: "of",
    thanksTitle: "Thank you! We have received your answers.",
    thanksBody: "We read everything, and what you told us changes the final version of the course. If you want to correct anything, you can come back to this page at any time.",
    review: "Review my answers",
    sending: "Sending…",
    save: "Save my answers",
    send: "Send my answers",
    required: "Questions marked * are required. Answer as many of the rest as you like.",
    npsLow: "Not at all likely",
    npsHigh: "Definitely",
    teacher: (n: string) => `How well did ${n} explain things?`,
  },
};
type Txt = (typeof TXT)["es"];

/**
 * La encuesta: seis bloques en una sola página, con una barra que dice
 * cuánto queda. Las obligatorias van marcadas; si falta una, se salta a ella.
 */
export function FormularioEncuesta({ slug, previas, docente, bloques, locale }: { slug: string; previas: Respuestas | null; docente: string; bloques: Bloque[]; locale: "es" | "en" }) {
  const x = TXT[locale];
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<{ texto: string; falta?: string } | null>(null);
  const [hecho, setHecho] = useState(false);
  const [contestadas, setContestadas] = useState(() => contar(previas));

  function recontar() {
    if (!form.current) return;
    const fd = new FormData(form.current);
    setContestadas(PREGUNTAS.filter((p) => fd.getAll(p.k).some((v) => String(v).trim() !== "")).length);
  }

  function enviar(fd: FormData) {
    setError(null);
    start(async () => {
      const r = await responderEncuesta(slug, fd, locale);
      if (r.ok) {
        setHecho(true);
        router.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      setError({ texto: r.error, falta: r.falta });
      if (r.falta) document.getElementById(`q-${r.falta}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  if (hecho) {
    return (
      <div className="axr-enc__done" role="status">
        <span className="axr-enc__done-icon" aria-hidden>
          ✓
        </span>
        <h2>{x.thanksTitle}</h2>
        <p>{x.thanksBody}</p>
        <button type="button" className="axr-enc__ghost" onClick={() => setHecho(false)}>
          {x.review}
        </button>
      </div>
    );
  }

  const total = PREGUNTAS.length;
  return (
    <form ref={form} action={enviar} onChange={recontar} className="axr-enc__form" noValidate>
      <div className="axr-enc__progress" aria-hidden>
        <span className="axr-enc__track">
          <span style={{ width: `${Math.round((contestadas / total) * 100)}%` }} />
        </span>
        <small>
          {contestadas} {x.of} {total}
        </small>
      </div>

      {bloques.map((b, i) => (
        <section key={b.k} className="axr-enc__block" aria-labelledby={`b-${b.k}`}>
          <header>
            <span className="axr-enc__num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 id={`b-${b.k}`}>{b.titulo}</h2>
              {b.intro ? <p>{b.intro}</p> : null}
            </div>
          </header>
          {b.preguntas.map((p) => (
            <Campo key={p.k} p={p} previa={previas?.[p.k]} docente={docente} marcada={error?.falta === p.k} x={x} />
          ))}
        </section>
      ))}

      {error ? (
        <p className="axr-enc__error" role="alert">
          {error.texto}
        </p>
      ) : null}
      <div className="axr-enc__submit">
        <button type="submit" className="axr-dr__cta" disabled={pending}>
          {pending ? x.sending : previas ? x.save : x.send} <span aria-hidden>→</span>
        </button>
        <small>{x.required}</small>
      </div>
    </form>
  );
}

function contar(r: Respuestas | null) {
  return r ? PREGUNTAS.filter((p) => r[p.k] !== undefined).length : 0;
}

function Campo({ p, previa, docente, marcada, x }: { p: Pregunta; previa: Respuestas[string] | undefined; docente: string; marcada: boolean; x: Txt }) {
  const titulo = p.k === "docente" && docente ? x.teacher(docente) : p.titulo;
  const cabecera = (
    <legend>
      {titulo}
      {p.obligatoria ? <span className="axr-enc__req"> *</span> : null}
      {p.ayuda ? <small>{p.ayuda}</small> : null}
    </legend>
  );

  return (
    <fieldset id={`q-${p.k}`} className={`axr-enc__q axr-enc__q--${p.tipo}${marcada ? " is-missing" : ""}`}>
      {p.tipo === "abierta" || p.tipo === "numero" ? (
        <legend>
          <label htmlFor={`in-${p.k}`}>{titulo}</label>
          {p.ayuda ? <small>{p.ayuda}</small> : null}
        </legend>
      ) : (
        cabecera
      )}

      {p.tipo === "nps" ? (
        <>
          <div className="axr-enc__nps">
            {Array.from({ length: 11 }, (_, n) => (
              <label key={n} className={n <= 6 ? "is-low" : n <= 8 ? "is-mid" : "is-high"}>
                <input type="radio" name={p.k} value={n} defaultChecked={previa === n} />
                <span>{n}</span>
              </label>
            ))}
          </div>
          <div className="axr-enc__ends">
            <span>{x.npsLow}</span>
            <span>{x.npsHigh}</span>
          </div>
        </>
      ) : null}

      {p.tipo === "escala" ? (
        <>
          <div className="axr-enc__scale">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n}>
                <input type="radio" name={p.k} value={n} defaultChecked={previa === n} />
                <span>{n}</span>
              </label>
            ))}
          </div>
          <div className="axr-enc__ends">
            <span>{p.min}</span>
            <span>{p.max}</span>
          </div>
        </>
      ) : null}

      {p.tipo === "una" ? (
        <div className="axr-enc__pills">
          {p.opciones.map((o) => (
            <label key={o.k}>
              <input type="radio" name={p.k} value={o.k} defaultChecked={previa === o.k} />
              <span>{o.t}</span>
            </label>
          ))}
        </div>
      ) : null}

      {p.tipo === "varias" ? (
        <div className="axr-enc__pills axr-enc__pills--multi">
          {p.opciones.map((o) => (
            <label key={o.k}>
              <input
                type="checkbox"
                name={p.k}
                value={o.k}
                defaultChecked={Array.isArray(previa) && previa.includes(o.k)}
                onChange={(e) => {
                  // «Ningún problema» desmarca lo demás, y al revés.
                  if (!p.exclusiva || !e.target.checked) return;
                  const grupo = e.target.form?.querySelectorAll<HTMLInputElement>(`input[name="${p.k}"]`) ?? [];
                  for (const c of grupo) {
                    if (c === e.target) continue;
                    if (o.k === p.exclusiva || c.value === p.exclusiva) c.checked = false;
                  }
                }}
              />
              <span>{o.t}</span>
            </label>
          ))}
        </div>
      ) : null}

      {p.tipo === "numero" ? (
        <div className="axr-enc__number">
          <input
            id={`in-${p.k}`}
            name={p.k}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={p.placeholder}
            defaultValue={typeof previa === "number" ? String(previa) : ""}
          />
          <span>{p.sufijo}</span>
        </div>
      ) : null}

      {p.tipo === "abierta" ? (
        <textarea id={`in-${p.k}`} name={p.k} rows={3} maxLength={3000} placeholder={p.placeholder} defaultValue={typeof previa === "string" ? previa : ""} />
      ) : null}
    </fieldset>
  );
}
