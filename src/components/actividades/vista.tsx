import { tx, type Actividad, type Locale, type Respuestas, type Resultado } from "@/lib/actividades/tipos";
import type { ActividadesCopy } from "@/lib/i18n/actividades";

// ══════════════════════════════════════════════════════════
//  Cómo se enseña una actividad ya enviada
//
//  El resultado (estadio, nota, aciertos) y las respuestas, en lectura. Lo
//  usan el alumno, al enviar, y el profesor, en el panel.
// ══════════════════════════════════════════════════════════

const f = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/** El texto que se enseña para una respuesta: la etiqueta de la opción, «Sí»/«No», el número… */
export function valorLegible(act: Actividad, k: string, r: Respuestas, locale: Locale, copy: ActividadesCopy): string {
  const c = act.campos.find((x) => x.k === k);
  const v = r[k];
  if (!c || c.tipo === "seccion" || v === undefined) return "";
  if (c.tipo === "opcion") {
    const o = c.opciones.find((x) => x.v === v);
    return o ? o[locale] : String(v);
  }
  if (c.tipo === "multiple") {
    const lista = (Array.isArray(v) ? v : [v]).map((x) => c.opciones.find((o) => o.v === x)?.[locale] ?? x);
    const otra = r[`${k}__otra`];
    if (typeof otra === "string" && otra) lista.push(`${copy.other}: ${otra}`);
    return lista.join(" · ");
  }
  if (c.tipo === "sino") return v === "si" ? copy.yes : copy.no;
  if (c.tipo === "escala") return `${v} / ${c.max}`;
  return Array.isArray(v) ? v.join(", ") : v;
}

export function ResultadoVista({ act, result, answers, locale, copy }: { act: Actividad; result: Resultado | null; answers: Respuestas; locale: Locale; copy: ActividadesCopy }) {
  if (!result) return null;

  if (act.tipo === "diagnostico") {
    const e = act.estadios?.[result.estadio ?? 0];
    const minimo = Math.min(...(result.bloques ?? []).map((b) => b.pct));
    return (
      <div className="axr-act-res">
        <div className="axr-act-res__head">
          <small>{copy.yourStage}</small>
          <strong>{e ? tx(e.titulo, locale) : "—"}</strong>
          <span className="axr-c-pill">{result.pct} %</span>
        </div>
        {e ? <p>{tx(e.texto, locale)}</p> : null}
        {result.bloques?.length ? (
          <>
            <h4>{copy.breakdown}</h4>
            <p className="axr-act-res__hint">{copy.breakdownHint}</p>
            <ul className="axr-act-res__bars">
              {result.bloques.map((b) => {
                const def = act.bloques?.find((x) => x.k === b.k);
                return (
                  <li key={b.k} className={b.pct === minimo ? "is-low" : undefined}>
                    <span>{def ? tx(def.titulo, locale) : b.k}</span>
                    <div className="axr-c-progress" aria-hidden>
                      <span style={{ width: `${b.pct}%` }} />
                    </div>
                    <small>{b.pct} %</small>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    );
  }

  if (act.tipo === "test" || act.tipo === "juego") {
    const qs = act.campos.filter((c) => c.tipo === "opcion");
    return (
      <div className="axr-act-res">
        <div className="axr-act-res__head">
          <strong>{f(copy.score, { p: result.puntos, m: result.max })}</strong>
          {act.tipo === "test" ? (
            <span className={`axr-c-pill ${result.aprobado ? "axr-c-pill--ok" : "axr-c-pill--bad"}`}>{result.aprobado ? copy.passed : `${result.pct} %`}</span>
          ) : null}
        </div>
        {act.tipo === "test" && result.aprobado === false ? <p>{f(copy.failed, { n: act.aprobado ?? 0 })}</p> : null}
        {act.tipo === "juego" ? <p>{f(copy.gameScore, { p: result.puntos, m: result.max })}</p> : null}
        <ol className="axr-act-res__qs">
          {qs.map((c) => {
            if (c.tipo !== "opcion") return null;
            const ok = result.aciertos?.[c.k];
            const elegida = c.opciones.find((o) => o.v === answers[c.k]);
            const buena = c.opciones.find((o) => o.v === (act.tipo === "test" ? c.correcta : c.mejor));
            return (
              <li key={c.k} className={ok ? "is-ok" : "is-bad"}>
                <p className="axr-act-res__q">{tx(c.label, locale)}</p>
                <p>
                  <span className={`axr-c-pill ${ok ? "axr-c-pill--ok" : "axr-c-pill--bad"}`}>{ok ? copy.correct : copy.wrong}</span>{" "}
                  {act.tipo === "juego" && elegida ? (
                    <>
                      <strong>{copy.yourChoice}:</strong> {elegida[locale]}
                    </>
                  ) : null}
                </p>
                {act.tipo === "juego" && elegida?.porque ? <p className="axr-act-res__why">{tx(elegida.porque, locale)}</p> : null}
                {!ok && buena ? (
                  <p className="axr-act-res__why">
                    <strong>{act.tipo === "test" ? f(copy.correctAnswer, { a: buena[locale] }) : `${copy.bestReply}: ${buena[locale]}`}</strong>
                    {act.tipo === "juego" && buena.porque ? ` ${tx(buena.porque, locale)}` : null}
                  </p>
                ) : null}
                {act.tipo === "test" && c.explicacion ? <p className="axr-act-res__why">{tx(c.explicacion, locale)}</p> : null}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  return null;
}

/** Las respuestas en lectura, con sus secciones. */
export function RespuestasVista({ act, answers, locale, copy }: { act: Actividad; answers: Respuestas; locale: Locale; copy: ActividadesCopy }) {
  return (
    <dl className="axr-act-ans">
      {act.campos.map((c) =>
        c.tipo === "seccion" ? (
          <h4 key={c.k}>{tx(c.label, locale)}</h4>
        ) : (
          <div key={c.k}>
            <dt>{tx(c.label, locale)}</dt>
            <dd>
              {c.tipo === "url" && typeof answers[c.k] === "string" && answers[c.k] ? (
                <a href={answers[c.k] as string} target="_blank" rel="noreferrer">
                  {answers[c.k] as string} ↗
                </a>
              ) : (
                valorLegible(act, c.k, answers, locale, copy) || "—"
              )}
            </dd>
          </div>
        ),
      )}
    </dl>
  );
}
