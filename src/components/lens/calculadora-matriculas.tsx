"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveScenario, updateScenario, deleteScenario } from "@/app/lens/calculadora-matriculas/actions";
import { MetricCard } from "@/components/lens/metric-card";
import {
  computeLensMetrics,
  defaultLensScenario,
  formatEUR,
  formatPct,
  formatRatio,
  type LensScenarioData,
} from "@/lib/lens/calculadora";

type SavedScenario = { id: string; name: string; data: LensScenarioData; updated_at: string };

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
}

export function CalculadoraMatriculas({ savedScenarios }: { savedScenarios: SavedScenario[] }) {
  const router = useRouter();
  const [scenario, setScenario] = useState<LensScenarioData>(() => defaultLensScenario());
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState("Escenario base");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const metrics = useMemo(() => computeLensMetrics(scenario), [scenario]);

  function loadScenario(id: string) {
    if (!id) return;
    const found = savedScenarios.find((s) => s.id === id);
    if (!found) return;
    setScenario(found.data);
    setScenarioId(found.id);
    setScenarioName(found.name);
    setMessage(null);
  }

  function resetScenario() {
    setScenario(defaultLensScenario());
    setScenarioId(null);
    setScenarioName("Nuevo escenario");
    setMessage(null);
  }

  function handleSaveNew() {
    startTransition(async () => {
      const r = await saveScenario(scenarioName, scenario);
      if (r?.error) {
        setMessage({ kind: "error", text: r.error });
      } else {
        setScenarioId(r.id ?? null);
        setMessage({ kind: "ok", text: "Escenario guardado." });
        router.refresh();
      }
    });
  }

  function handleUpdate() {
    if (!scenarioId) return;
    startTransition(async () => {
      const r = await updateScenario(scenarioId, scenarioName, scenario);
      setMessage(r?.error ? { kind: "error", text: r.error } : { kind: "ok", text: "Cambios guardados." });
      if (!r?.error) router.refresh();
    });
  }

  function handleDelete() {
    if (!scenarioId) return;
    if (!confirm(`¿Eliminar el escenario "${scenarioName}"?`)) return;
    startTransition(async () => {
      const r = await deleteScenario(scenarioId);
      if (r?.error) {
        setMessage({ kind: "error", text: r.error });
      } else {
        resetScenario();
        router.refresh();
      }
    });
  }

  // ── Planes ──
  const mixSum = scenario.plans.reduce((s, p) => s + (p.mix || 0), 0);

  function updatePlan(id: string, patch: Partial<LensScenarioData["plans"][number]>) {
    setScenario((s) => ({ ...s, plans: s.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }
  function addPlan() {
    setScenario((s) => ({ ...s, plans: [...s.plans, { id: newId(), name: "Nuevo plan", price: 0, mix: 0 }] }));
  }
  function removePlan(id: string) {
    setScenario((s) => ({ ...s, plans: s.plans.filter((p) => p.id !== id) }));
  }

  // ── Canales ──
  function updateChannel(id: string, patch: Partial<LensScenarioData["channels"][number]>) {
    setScenario((s) => ({ ...s, channels: s.channels.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }
  function addChannel() {
    setScenario((s) => ({
      ...s,
      channels: [...s.channels, { id: newId(), name: "Nuevo canal", spend: 0, students: 0 }],
    }));
  }
  function removeChannel(id: string) {
    setScenario((s) => ({ ...s, channels: s.channels.filter((c) => c.id !== id) }));
  }

  // ── Costes fijos ──
  function updateFixedCost(id: string, patch: Partial<LensScenarioData["fixedCosts"][number]>) {
    setScenario((s) => ({ ...s, fixedCosts: s.fixedCosts.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
  }
  function addFixedCost() {
    setScenario((s) => ({ ...s, fixedCosts: [...s.fixedCosts, { id: newId(), name: "Nuevo coste", amount: 0 }] }));
  }
  function removeFixedCost(id: string) {
    setScenario((s) => ({ ...s, fixedCosts: s.fixedCosts.filter((c) => c.id !== id) }));
  }

  const barMax = Math.max(
    metrics.totalRevenue,
    metrics.totalMarketingSpend,
    metrics.variableCostsTotal,
    metrics.gatewayFees,
    metrics.totalFixedCosts,
    Math.abs(metrics.netProfit),
    1,
  );

  return (
    <div className="axr-calc">
      {/* ── Barra de escenario ── */}
      <div className="axr-calc__scenario-bar">
        <select
          className="axr-calc__scenario-select"
          value={scenarioId ?? ""}
          onChange={(e) => (e.target.value ? loadScenario(e.target.value) : resetScenario())}
        >
          <option value="">— Escenario sin guardar —</option>
          {savedScenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          placeholder="Nombre del escenario"
        />
        {scenarioId ? (
          <>
            <button type="button" className="axr-btn axr-btn--primary" disabled={pending} onClick={handleUpdate}>
              Guardar cambios
            </button>
            <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={handleSaveNew}>
              Guardar como nuevo
            </button>
            <button type="button" className="axr-btn axr-btn--danger" disabled={pending} onClick={handleDelete}>
              Eliminar
            </button>
          </>
        ) : (
          <button type="button" className="axr-btn axr-btn--primary" disabled={pending} onClick={handleSaveNew}>
            Guardar escenario
          </button>
        )}
        <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={resetScenario}>
          Reiniciar
        </button>
        {message ? (
          <span style={{ color: message.kind === "error" ? "#a32020" : "var(--axr-go-deep)", fontSize: "0.8125rem" }}>
            {message.text}
          </span>
        ) : null}
      </div>

      {/* ── Resultado ── */}
      <div>
        <div className="axr-calc__kpis">
          <MetricCard metricKey="totalStudents" value={String(metrics.totalStudents)} />
          <MetricCard metricKey="totalRevenue" value={formatEUR(metrics.totalRevenue)} />
          <MetricCard
            metricKey="netProfit"
            value={formatEUR(metrics.netProfit)}
            tone={metrics.netProfit >= 0 ? "positive" : "negative"}
          />
          <MetricCard
            metricKey="netMarginPct"
            value={formatPct(metrics.netMarginPct)}
            tone={metrics.netMarginPct >= 0 ? "positive" : "negative"}
          />
        </div>
      </div>

      {/* ── Métricas de adquisición ── */}
      <div>
        <div className="axr-calc__kpis">
          <MetricCard metricKey="avgTicket" value={formatEUR(metrics.avgTicket)} />
          <MetricCard metricKey="totalMarketingSpend" value={formatEUR(metrics.totalMarketingSpend)} />
          <MetricCard metricKey="cac" value={formatEUR(metrics.cac, 0)} />
          <MetricCard metricKey="ltv" value={formatEUR(metrics.ltv)} />
          <MetricCard
            metricKey="ltvCacRatio"
            value={formatRatio(metrics.ltvCacRatio)}
            tone={metrics.ltvCacRatio >= 3 ? "positive" : metrics.ltvCacRatio < 1 ? "negative" : undefined}
          />
          <MetricCard metricKey="roas" value={formatRatio(metrics.roas)} tone={metrics.roas >= 1 ? "positive" : "negative"} />
          <MetricCard
            metricKey="breakEvenStudents"
            value={metrics.breakEvenStudents == null ? "No se cubre nunca" : `${Math.ceil(metrics.breakEvenStudents)} alumnos`}
            tone={
              metrics.breakEvenStudents != null && metrics.totalStudents >= metrics.breakEvenStudents
                ? "positive"
                : undefined
            }
          />
        </div>
      </div>

      {/* ── Cascada de rentabilidad ── */}
      <div className="axr-calc__section">
        <div className="axr-calc__section-head">
          <h2>De los ingresos al beneficio</h2>
        </div>
        <p className="axr-calc__section-hint">Cómo se reparte cada euro que entra por matrículas.</p>
        <div className="axr-calc__bars">
          <BarRow label="Ingresos totales" value={metrics.totalRevenue} max={barMax} variant="revenue" />
          <BarRow label="− Inversión en captación" value={metrics.totalMarketingSpend} max={barMax} />
          <BarRow label="− Costes variables" value={metrics.variableCostsTotal} max={barMax} />
          <BarRow label="− Comisión de pasarela de pago" value={metrics.gatewayFees} max={barMax} />
          <BarRow label="− Costes fijos" value={metrics.totalFixedCosts} max={barMax} />
          <BarRow
            label="= Beneficio neto"
            value={metrics.netProfit}
            max={barMax}
            variant={metrics.netProfit >= 0 ? "profit" : "loss"}
          />
        </div>
      </div>

      {/* ── Planes de precios ── */}
      <div className="axr-calc__section">
        <div className="axr-calc__section-head">
          <h2>Precios de licencias / planes</h2>
        </div>
        <p className="axr-calc__section-hint">
          El precio de cada plan y qué % de los alumnos matriculados lo elige. El ticket medio sale de esta mezcla.
        </p>
        <div className="axr-calc__row axr-calc__row--head" style={{ ["--cols" as string]: 2 }}>
          <span>Plan</span>
          <span>Precio (€)</span>
          <span>Mezcla (%)</span>
          <span />
        </div>
        {scenario.plans.map((p) => (
          <div className="axr-calc__row" style={{ ["--cols" as string]: 2 }} key={p.id}>
            <div className="axr-calc__field">
              <label>Plan</label>
              <input type="text" value={p.name} onChange={(e) => updatePlan(p.id, { name: e.target.value })} />
            </div>
            <div className="axr-calc__field">
              <label>Precio (€)</label>
              <input
                type="number"
                inputMode="decimal"
                value={p.price}
                onChange={(e) => updatePlan(p.id, { price: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="axr-calc__field">
              <label>Mezcla (%)</label>
              <input
                type="number"
                inputMode="decimal"
                value={p.mix}
                onChange={(e) => updatePlan(p.id, { mix: Number(e.target.value) || 0 })}
              />
            </div>
            <button type="button" className="axr-calc__row-remove" onClick={() => removePlan(p.id)} aria-label="Quitar plan">
              ×
            </button>
          </div>
        ))}
        <button type="button" className="axr-calc__add-btn" onClick={addPlan}>
          + Añadir plan
        </button>
        <div className="axr-calc__mix-total" data-off={mixSum !== 100}>
          Suma de mezcla: {mixSum}% {mixSum === 100 ? "✓" : "— debería sumar 100%"}
        </div>
      </div>

      {/* ── Canales de captación ── */}
      <div className="axr-calc__section">
        <div className="axr-calc__section-head">
          <h2>Canales de captación</h2>
        </div>
        <p className="axr-calc__section-hint">
          Cuánto inviertes en cada canal y cuántos alumnos matriculados trae. El CAC de cada canal se calcula solo.
        </p>
        <div className="axr-calc__row axr-calc__row--head" style={{ ["--cols" as string]: 2 }}>
          <span>Canal</span>
          <span>Inversión (€)</span>
          <span>Alumnos</span>
          <span />
        </div>
        {scenario.channels.map((c) => (
          <div className="axr-calc__row" style={{ ["--cols" as string]: 2 }} key={c.id}>
            <div className="axr-calc__field">
              <label>Canal</label>
              <input type="text" value={c.name} onChange={(e) => updateChannel(c.id, { name: e.target.value })} />
            </div>
            <div className="axr-calc__field">
              <label>Inversión (€)</label>
              <input
                type="number"
                inputMode="decimal"
                value={c.spend}
                onChange={(e) => updateChannel(c.id, { spend: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="axr-calc__field">
              <label>Alumnos</label>
              <input
                type="number"
                inputMode="decimal"
                value={c.students}
                onChange={(e) => updateChannel(c.id, { students: Number(e.target.value) || 0 })}
              />
            </div>
            <button
              type="button"
              className="axr-calc__row-remove"
              onClick={() => removeChannel(c.id)}
              aria-label="Quitar canal"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="axr-calc__add-btn" onClick={addChannel}>
          + Añadir canal
        </button>

        {metrics.channelStats.length > 0 ? (
          <table className="axr-calc__channel-table" style={{ marginTop: "1rem" }}>
            <thead>
              <tr>
                <th>Canal</th>
                <th>% alumnos</th>
                <th>CAC</th>
              </tr>
            </thead>
            <tbody>
              {metrics.channelStats.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{formatPct(c.share * 100)}</td>
                  <td>{formatEUR(c.cac, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      {/* ── Costes ── */}
      <div className="axr-calc__section">
        <div className="axr-calc__section-head">
          <h2>Costes fijos</h2>
        </div>
        <p className="axr-calc__section-hint">
          Costes de dar el curso independientemente de cuántos alumnos entren: equipo docente, herramientas, soporte…
        </p>
        <div className="axr-calc__row axr-calc__row--head" style={{ ["--cols" as string]: 1 }}>
          <span>Coste</span>
          <span>Importe (€)</span>
          <span />
        </div>
        {scenario.fixedCosts.map((c) => (
          <div className="axr-calc__row" style={{ ["--cols" as string]: 1 }} key={c.id}>
            <div className="axr-calc__field">
              <label>Coste</label>
              <input type="text" value={c.name} onChange={(e) => updateFixedCost(c.id, { name: e.target.value })} />
            </div>
            <div className="axr-calc__field">
              <label>Importe (€)</label>
              <input
                type="number"
                inputMode="decimal"
                value={c.amount}
                onChange={(e) => updateFixedCost(c.id, { amount: Number(e.target.value) || 0 })}
              />
            </div>
            <button
              type="button"
              className="axr-calc__row-remove"
              onClick={() => removeFixedCost(c.id)}
              aria-label="Quitar coste"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="axr-calc__add-btn" onClick={addFixedCost}>
          + Añadir coste fijo
        </button>
      </div>

      {/* ── Otros supuestos ── */}
      <div className="axr-calc__section">
        <div className="axr-calc__section-head">
          <h2>Otros supuestos</h2>
        </div>
        <p className="axr-calc__section-hint">Coste variable por alumno, comisión de la pasarela de pago y upsells.</p>
        <div className="axr-calc__assumptions">
          <div className="axr-calc__field">
            <label>Coste variable / alumno (€)</label>
            <input
              type="number"
              inputMode="decimal"
              value={scenario.variableCostPerStudent}
              onChange={(e) => setScenario((s) => ({ ...s, variableCostPerStudent: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="axr-calc__field">
            <label>Comisión pasarela de pago (%)</label>
            <input
              type="number"
              inputMode="decimal"
              value={scenario.gatewayFeePct}
              onChange={(e) => setScenario((s) => ({ ...s, gatewayFeePct: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="axr-calc__field">
            <label>% que compra un upsell</label>
            <input
              type="number"
              inputMode="decimal"
              value={scenario.repeatPurchaseRate}
              onChange={(e) => setScenario((s) => ({ ...s, repeatPurchaseRate: Number(e.target.value) || 0 }))}
            />
          </div>
          <div className="axr-calc__field">
            <label>Valor medio del upsell (€)</label>
            <input
              type="number"
              inputMode="decimal"
              value={scenario.upsellValue}
              onChange={(e) => setScenario((s) => ({ ...s, upsellValue: Number(e.target.value) || 0 }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  variant,
}: {
  label: string;
  value: number;
  max: number;
  variant?: "revenue" | "profit" | "loss";
}) {
  const pct = max > 0 ? Math.min(100, (Math.abs(value) / max) * 100) : 0;
  return (
    <div className="axr-calc__bar-row">
      <div className="axr-calc__bar-label">
        <span>{label}</span>
        <span>{formatEUR(value)}</span>
      </div>
      <div className="axr-calc__bar-track">
        <div className={`axr-calc__bar-fill${variant ? ` axr-calc__bar-fill--${variant}` : ""}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
