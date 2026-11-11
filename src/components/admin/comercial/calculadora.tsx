"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { apuntarContacto } from "@/app/admin/comercial/actions";
import {
  calcularPlazos,
  euros,
  FIN_CURSO,
  PLAZOS_MAX,
  PLAZOS_MIN,
  PLAZOS_POR_DEFECTO,
  PRECIO_CONTADO,
  PRECIO_PLAZOS,
  resumenPlazos,
} from "@/lib/comercial/precios";
import type { ComercialCopy } from "@/lib/i18n/comercial";
import { rellenar } from "@/lib/i18n/dry-run";

// ══════════════════════════════════════════════════════════
//  La calculadora de plazos
//
//  Pago único o a plazos (de PLAZOS_MIN a PLAZOS_MAX cuotas mensuales desde
//  el día del primer cargo): el total, cada cuota con su fecha y el mensaje
//  con las condiciones, para copiarlo. En la ficha de un lead lleva su nombre
//  y su curso, y se puede dejar apuntado en su historial.
// ══════════════════════════════════════════════════════════

const FECHA = new Intl.DateTimeFormat("es-ES", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" });
const fecha = (iso: string) => FECHA.format(new Date(`${iso}T00:00:00Z`));

export function Calculadora({
  hoy,
  c,
  nombre,
  curso,
  leadId,
  compacta,
}: {
  /** Hoy en Madrid, «2026-11-11»: el primer cargo por defecto. */
  hoy: string;
  c: ComercialCopy;
  nombre?: string;
  curso?: string;
  leadId?: string;
  compacta?: boolean;
}) {
  const router = useRouter();
  const [modo, setModo] = useState<"contado" | "plazos">("plazos");
  const [n, setN] = useState(PLAZOS_POR_DEFECTO);
  const [primero, setPrimero] = useState(hoy);
  const [copiado, setCopiado] = useState(false);
  const [apuntado, setApuntado] = useState(false);
  const [pending, startTransition] = useTransition();

  const valido = /^\d{4}-\d{2}-\d{2}$/.test(primero);
  const cuotas = useMemo(() => (modo === "plazos" && valido ? calcularPlazos(PRECIO_PLAZOS, n, primero) : []), [modo, n, primero, valido]);
  const total = modo === "plazos" ? PRECIO_PLAZOS : PRECIO_CONTADO;
  const diferencia = euros(PRECIO_PLAZOS - PRECIO_CONTADO);
  const ultimo = cuotas.at(-1)?.fecha;
  const tardio = Boolean(ultimo && ultimo > FIN_CURSO);

  const mensaje = useMemo(() => {
    const saludo = nombre ? `Hola, ${nombre}.` : "Hola.";
    const para = curso ? ` para ${curso}` : "";
    if (modo === "contado") {
      return `${saludo} Te paso las condiciones${para}:

· Pago único: ${euros(PRECIO_CONTADO)}.
· Un solo cargo con tarjeta, por Stripe, y su factura.

Si lo prefieres a plazos, son ${euros(PRECIO_PLAZOS)} en total. Me dices y te lo preparo.`;
    }
    const lineas = cuotas.map((q) => `${q.n}. ${fecha(q.fecha)}: ${euros(q.importe)}`).join("\n");
    return `${saludo} Te paso las condiciones${para} a plazos:

· Total: ${euros(PRECIO_PLAZOS)}, en ${resumenPlazos(cuotas)}.
· Un cargo al mes con tarjeta, por Stripe, y su factura de cada pago:
${lineas}

Si te viene mejor pagarlo de una vez, son ${euros(PRECIO_CONTADO)} (te ahorras ${diferencia}).`;
  }, [modo, cuotas, nombre, curso, diferencia]);

  return (
    <div className={`axr-calc${compacta ? " axr-calc--compact" : ""}`}>
      <div className="axr-calc__controls">
        <div className="axr-calc__field">
          <span>{c.calcMode}</span>
          <div className="axr-calc__seg" role="radiogroup" aria-label={c.calcMode}>
            {(["contado", "plazos"] as const).map((m) => (
              <button key={m} type="button" role="radio" aria-checked={modo === m} className={modo === m ? "is-on" : undefined} onClick={() => setModo(m)}>
                {m === "contado" ? c.calcCash : c.calcInst}
                <small>{euros(m === "contado" ? PRECIO_CONTADO : PRECIO_PLAZOS)}</small>
              </button>
            ))}
          </div>
        </div>
        {modo === "plazos" ? (
          <>
            <div className="axr-calc__field">
              <span>{c.calcN}</span>
              <div className="axr-calc__seg axr-calc__seg--n" role="radiogroup" aria-label={c.calcN}>
                {Array.from({ length: PLAZOS_MAX - PLAZOS_MIN + 1 }, (_, i) => PLAZOS_MIN + i).map((k) => (
                  <button key={k} type="button" role="radio" aria-checked={n === k} className={n === k ? "is-on" : undefined} onClick={() => setN(k)}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
            <label className="axr-calc__field">
              <span>{c.calcFirst}</span>
              <input type="date" value={primero} min={hoy} onChange={(e) => setPrimero(e.currentTarget.value || hoy)} />
            </label>
          </>
        ) : null}
      </div>

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
        <p>{rellenar(modo === "contado" ? c.calcSaves : c.calcCosts, { x: diferencia })}</p>
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
              <tr key={q.n} className={q.fecha > FIN_CURSO ? "is-late" : undefined}>
                <td>{q.n}</td>
                <td>{fecha(q.fecha)}</td>
                <td>{euros(q.importe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <div className="axr-calc__msg">
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
          {leadId ? (
            <button
              type="button"
              className="axr-btn axr-btn--small"
              disabled={pending || apuntado}
              onClick={() =>
                startTransition(async () => {
                  const plan = modo === "contado" ? `pago único de ${euros(PRECIO_CONTADO)}` : `${euros(PRECIO_PLAZOS)} en ${resumenPlazos(cuotas)} desde el ${fecha(primero)}`;
                  const r = await apuntarContacto(leadId, "nota", `Condiciones de pago propuestas: ${plan}.`);
                  if (r.ok) {
                    setApuntado(true);
                    router.refresh();
                  }
                })
              }
            >
              {apuntado ? c.calcLogged : c.calcLog}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
