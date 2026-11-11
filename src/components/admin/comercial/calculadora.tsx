"use client";

import { useMemo, useState } from "react";

import { calcularPlazos, euros, FIN_CURSO, PLAZOS_MIN, PLAZOS_POR_DEFECTO, PRODUCTOS, resumenPlazos, type Producto } from "@/lib/comercial/precios";
import type { ComercialCopy } from "@/lib/i18n/comercial";
import { rellenar } from "@/lib/i18n/dry-run";

// ══════════════════════════════════════════════════════════
//  La calculadora de plazos
//
//  Un curso o los dos, en pago único o a plazos (cuotas mensuales desde el
//  día del primer cargo, hasta el máximo de cada producto): el total, cada
//  cuota con su fecha y el mensaje con las condiciones, para copiarlo y
//  mandarlo o pegarlo en Zoho.
// ══════════════════════════════════════════════════════════

const FECHA = new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
const fecha = (iso: string) => FECHA.format(new Date(`${iso}T00:00:00Z`));

export function Calculadora({ hoy, c }: { /** Hoy en Madrid, «2026-11-11»: el primer cargo por defecto. */ hoy: string; c: ComercialCopy }) {
  const [producto, setProducto] = useState<Producto>("uno");
  const [modo, setModo] = useState<"contado" | "plazos">("plazos");
  const [n, setN] = useState(PLAZOS_POR_DEFECTO);
  const [nombre, setNombre] = useState("");
  const [primero, setPrimero] = useState(hoy);
  const [copiado, setCopiado] = useState(false);

  const p = PRODUCTOS[producto];
  const cuotasN = Math.min(n, p.maxCuotas);
  const valido = /^\d{4}-\d{2}-\d{2}$/.test(primero);
  const cuotas = useMemo(() => (modo === "plazos" && valido ? calcularPlazos(p.plazos, cuotasN, primero) : []), [modo, valido, p.plazos, cuotasN, primero]);
  const total = modo === "plazos" ? p.plazos : p.contado;
  const diferencia = p.plazos - p.contado;
  const tardio = p.avisoFinCurso && Boolean(cuotas.at(-1) && cuotas.at(-1)!.fecha > FIN_CURSO);
  const curso = producto === "dos" ? "los dos cursos (Remote Professional y Remote Founder)" : "el curso";

  const mensaje = useMemo(() => {
    const saludo = nombre.trim() ? `Hola, ${nombre.trim()}.` : "Hola.";
    if (modo === "contado") {
      const alternativa = diferencia ? `Si lo prefieres a plazos, son ${euros(p.plazos)} en total.` : `Si lo prefieres, también puedes pagarlo a plazos, hasta en ${p.maxCuotas} cuotas, por el mismo precio.`;
      return `${saludo} Te paso las condiciones para ${curso}:

· Pago único: ${euros(p.contado)}.
· Un solo cargo con tarjeta, por Stripe, y su factura.

${alternativa} Me dices y te lo preparo.`;
    }
    const lineas = cuotas.map((q) => `${q.n}. ${fecha(q.fecha)}: ${euros(q.importe)}`).join("\n");
    const cierre = diferencia ? `\n\nSi te viene mejor pagarlo de una vez, son ${euros(p.contado)} (te ahorras ${euros(diferencia)}).` : "";
    return `${saludo} Te paso las condiciones para ${curso} a plazos:

· Total: ${euros(p.plazos)}, en ${resumenPlazos(cuotas)}.
· Un cargo al mes con tarjeta, por Stripe, y su factura de cada pago:
${lineas}${cierre}`;
  }, [modo, cuotas, nombre, curso, diferencia, p]);

  return (
    <div className="axr-calc">
      <div className="axr-calc__controls">
        <div className="axr-calc__field">
          <span>{c.calcProduct}</span>
          <div className="axr-calc__seg" role="radiogroup" aria-label={c.calcProduct}>
            {(["uno", "dos"] as const).map((k) => (
              <button key={k} type="button" role="radio" aria-checked={producto === k} className={producto === k ? "is-on" : undefined} onClick={() => setProducto(k)}>
                {k === "uno" ? c.calcOne : c.calcTwo}
                <small>{euros(PRODUCTOS[k].contado)}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="axr-calc__field">
          <span>{c.calcMode}</span>
          <div className="axr-calc__seg" role="radiogroup" aria-label={c.calcMode}>
            {(["contado", "plazos"] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={modo === m} className={modo === m ? "is-on" : undefined} onClick={() => setModo(m)}>
                {m === "contado" ? c.calcCash : c.calcInst}
                <small>{euros(m === "contado" ? p.contado : p.plazos)}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      {modo === "plazos" ? (
        <div className="axr-calc__controls">
          <div className="axr-calc__field">
            <span>{c.calcN}</span>
            <div className="axr-calc__seg axr-calc__seg--n" role="radiogroup" aria-label={c.calcN}>
              {Array.from({ length: p.maxCuotas - PLAZOS_MIN + 1 }, (_, i) => PLAZOS_MIN + i).map((k) => (
                <button key={k} type="button" role="radio" aria-checked={cuotasN === k} className={cuotasN === k ? "is-on" : undefined} onClick={() => setN(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <label className="axr-calc__field">
            <span>{c.calcFirst}</span>
            <input type="date" value={primero} min={hoy} onChange={(e) => setPrimero(e.currentTarget.value || hoy)} />
          </label>
        </div>
      ) : null}

      <div className="axr-calc__result">
        <div>
          <span>{c.calcTotal}</span>
          <strong>{euros(total)}</strong>
        </div>
        {modo === "plazos" && cuotas.length ? (
          <div>
            <span>{c.calcEach}</span>
            <strong>{euros(cuotas[cuotas.length - 1].importe)}</strong>
            {cuotas[0].importe !== cuotas[cuotas.length - 1].importe ? <small>1.ª: {euros(cuotas[0].importe)}</small> : null}
          </div>
        ) : null}
        <p>{diferencia ? rellenar(modo === "contado" ? c.calcSaves : c.calcCosts, { x: euros(diferencia) }) : rellenar(c.calcSame, { n: p.maxCuotas })}</p>
      </div>

      {tardio ? (
        <p className="axr-calc__warn" role="status">
          {rellenar(c.calcAfterEnd, { f: fecha(FIN_CURSO) })}
        </p>
      ) : null}

      {modo === "plazos" && cuotas.length ? (
        <table className="axr-calc__table">
          <caption>{c.calcSchedule}</caption>
          <thead>
            <tr>
              <th>{c.calcCuota}</th>
              <th>{c.calcDate}</th>
              <th>{c.calcAmount}</th>
            </tr>
          </thead>
          <tbody>
            {cuotas.map((q) => (
              <tr key={q.n} className={p.avisoFinCurso && q.fecha > FIN_CURSO ? "is-late" : undefined}>
                <td>{q.n}</td>
                <td>{fecha(q.fecha)}</td>
                <td>{euros(q.importe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div className="axr-calc__msg">
        <label className="axr-calc__field">
          <span>{c.calcName}</span>
          <input value={nombre} onChange={(e) => setNombre(e.currentTarget.value)} placeholder={c.calcNamePh} maxLength={60} />
        </label>
        <span>{c.calcMsg}</span>
        <pre>{mensaje}</pre>
        <div className="axr-com-actions">
          <button
            type="button"
            className="axr-btn axr-btn--ghost axr-btn--small"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(mensaje);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1800);
              } catch {
                setCopiado(false);
              }
            }}
          >
            {copiado ? c.copied : c.copy}
          </button>
        </div>
      </div>
    </div>
  );
}
