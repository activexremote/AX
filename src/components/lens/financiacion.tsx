"use client";

import { useMemo } from "react";

import { MiniBars } from "@/components/lens/charts";
import { formatEUR, formatPct, type LensMonth } from "@/lib/lens/calculadora";
import { computeFunding, type LensFunding } from "@/lib/lens/financiacion";

/**
 * Pestaña de financiación: equity frente a revenue-based financing.
 *
 * Arriba la oferta, que se teclea aquí mismo porque es otra conversación que
 * la del escenario —el escenario dice cuánto factura el negocio; la oferta,
 * cuánto cuesta el dinero—. Debajo, las dos opciones en euros y el valor de
 * salida a partir del cual una sale más cara que la otra.
 */
export function FinanciacionPane({
  funding,
  onChange,
  months,
  ebitdaMarginPct,
}: {
  funding: LensFunding;
  onChange: (f: LensFunding) => void;
  months: LensMonth[];
  ebitdaMarginPct: number;
}) {
  const r = useMemo(() => computeFunding(funding, months), [funding, months]);
  const set = (p: Partial<LensFunding>) => onChange({ ...funding, ...p });

  const mesesRbf = r.rbfMonths === null ? "nunca" : `${r.rbfMonths} m`;
  const margenCorto = funding.rbfSharePct >= ebitdaMarginPct;

  return (
    <div className="axr-report">
      {/* ── La oferta ── */}
      <section className="axr-report__block">
        <h3>
          La oferta
          <em>equity o revenue-based</em>
        </h3>
        <div className="axr-calc__assumptions">
          <Num label="Necesitas (€)" value={funding.amount} onChange={(v) => set({ amount: v })} />
          <div className="axr-calc__field axr-calc__field--labelled">
            <label htmlFor="fin-source">Facturación</label>
            <select
              id="fin-source"
              value={funding.revenueSource}
              onChange={(e) => set({ revenueSource: e.target.value as LensFunding["revenueSource"] })}
            >
              <option value="forecast">La de la previsión</option>
              <option value="manual">MRR a mano</option>
            </select>
          </div>
          {funding.revenueSource === "manual" ? (
            <>
              <Num label="MRR (€/mes)" value={funding.manualMrr} onChange={(v) => set({ manualMrr: v })} />
              <Num
                label="Crecimiento (%/mes)"
                value={funding.manualGrowthPct}
                onChange={(v) => set({ manualGrowthPct: v })}
              />
            </>
          ) : null}
          <Num label="RBF: múltiplo" value={funding.rbfMultiple} onChange={(v) => set({ rbfMultiple: v })} />
          <Num
            label="RBF: % de facturación"
            value={funding.rbfSharePct}
            onChange={(v) => set({ rbfSharePct: v })}
          />
          <Num label="Valoración pre-money (€)" value={funding.preMoney} onChange={(v) => set({ preMoney: v })} />
          <Num label="Valor de salida (€)" value={funding.exitValue} onChange={(v) => set({ exitValue: v })} />
        </div>
        <p className="axr-report__note">
          {funding.revenueSource === "forecast" ? (
            <>
              Facturación media <strong>{formatEUR(r.baseMonthlyRevenue)}/mes</strong>: lo cobrado mes a mes según la
              previsión del escenario, repitiendo el año.
            </>
          ) : (
            <>
              Facturación de partida <strong>{formatEUR(r.baseMonthlyRevenue)}/mes</strong>, creciendo un{" "}
              {formatPct(funding.manualGrowthPct, 1)} al mes.
            </>
          )}
        </p>
      </section>

      {/* ── RBF ── */}
      <section className="axr-report__block">
        <h3>
          Revenue-based financing
          <em data-alert={r.rbfMonths === null ? "" : undefined}>{mesesRbf} devolviendo</em>
        </h3>
        <div className="axr-report__grid6">
          <Tile label="A devolver" value={formatEUR(r.rbfTotal)} />
          <Tile label={`Recargo (${formatPct(r.rbfSurchargePct, 0)})`} value={formatEUR(r.rbfSurcharge)} />
          <Tile
            label="Coste anual"
            value={r.rbfAnnualCostPct === null ? "—" : formatPct(r.rbfAnnualCostPct, 1)}
            tone={r.rbfAnnualCostPct !== null && r.rbfAnnualCostPct > 25 ? "down" : undefined}
          />
          <Tile label="Meses" value={mesesRbf} tone={r.rbfMonths === null ? "down" : undefined} />
          <Tile label="Pagas el 1.er año" value={formatEUR(r.rbfFirstYearPayments)} />
          <Tile label="Del mes" value={formatPct(funding.rbfSharePct, 0)} />
        </div>
        <p className="axr-report__note" data-alert={margenCorto ? "" : undefined}>
          {margenCorto
            ? `El ${formatPct(funding.rbfSharePct, 0)} que se lleva el RBF iguala o supera tu margen EBITDA (${formatPct(ebitdaMarginPct, 0)}): devolverlo se come todo el beneficio operativo.`
            : `Tu margen EBITDA es del ${formatPct(ebitdaMarginPct, 0)}: el RBF se lleva ${formatPct(funding.rbfSharePct, 0)} de cada euro facturado y te deja el resto.`}
        </p>
      </section>

      {/* ── Equity ── */}
      <section className="axr-report__block">
        <h3>
          Equity
          <em>{formatPct(r.equityStakePct, 2)} de la empresa</em>
        </h3>
        <div className="axr-report__trio" style={{ marginTop: 0 }}>
          <Tile label="Cedes" value={formatPct(r.equityStakePct, 2)} />
          <Tile label="Post-money" value={formatEUR(r.postMoney)} />
          <Tile label="Vale a la salida" value={formatEUR(r.equityCostAtExit)} />
        </div>
      </section>

      {/* ── Cuál sale más caro ── */}
      <section className="axr-report__block">
        <h3>
          Cuál sale más caro
          <em>con una salida de {formatEUR(funding.exitValue)}</em>
        </h3>
        <MiniBars
          rows={[
            {
              key: "rbf",
              label: "RBF: lo que devuelves",
              meta: r.cheaper === "rbf" ? "más barato" : undefined,
              value: r.rbfTotal,
              color: "#161616",
            },
            {
              key: "equity",
              label: "Equity: lo que vale tu % al vender",
              meta: r.cheaper === "equity" ? "más barato" : undefined,
              value: r.equityCostAtExit,
              color: "#5B4BF5",
            },
          ]}
        />
        <p className="axr-report__note">
          {r.crossoverExit === null ? (
            "Sin equity no hay punto de cruce."
          ) : (
            <>
              Punto de cruce: <strong>{formatEUR(r.crossoverExit)}</strong> de valor de salida. Si la empresa acaba
              valiendo más, el equity te sale más caro que devolver el RBF.
            </>
          )}
        </p>
      </section>

      {/* ── Prueba de estrés ── */}
      <section className="axr-report__block">
        <h3>
          Si la facturación no crece
          <em>{formatEUR(r.rbfTotal)} a devolver</em>
        </h3>
        <div className="axr-report__trio" style={{ marginTop: 0 }}>
          {r.flatScenarios.map((s) => (
            <Tile
              key={s.sharePct}
              label={`Al ${formatPct(s.sharePct, 0)}`}
              value={s.months === null ? "nunca" : `${s.months} m`}
              tone={s.months === null || s.months > 60 ? "down" : undefined}
            />
          ))}
        </div>
        <p className="axr-report__note">
          Meses en devolverlo con la facturación media del primer año, sin crecer, según el % que se lleve cada mes.
        </p>
      </section>

      <details className="axr-report__aviso">
        <summary>Cómo está calculado</summary>
        <p>
          <strong>RBF</strong>: se devuelve el importe × el múltiplo, pagando cada mes el % pactado de lo cobrado
          hasta completarlo. El <strong>coste anual</strong> es la TIR de recibir el dinero hoy y devolverlo así,
          anualizada: un recargo del 30 % no cuesta lo mismo en tres años que en ocho.
        </p>
        <p>
          <strong>Equity</strong>: lo cedido es importe ÷ (pre-money + importe). Hoy no sale de la caja, pero el día
          de la venta ese % vale su parte del precio. El <strong>punto de cruce</strong> es el valor de salida en el
          que ese % vale exactamente lo que devuelves con el RBF.
        </p>
        <p>
          Con la previsión, el año del escenario se repite igual cada año, sin crecimiento añadido. Son hipótesis
          para comparar ofertas, no condiciones de nadie ni asesoramiento financiero.
        </p>
      </details>
    </div>
  );
}

function Tile({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  return (
    <div className="axr-report__tile" data-tone={tone}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="axr-calc__field axr-calc__field--labelled">
      <label>{label}</label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  );
}
