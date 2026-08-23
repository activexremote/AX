"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveScenario, updateScenario, deleteScenario } from "@/app/lens/calculadora-matriculas/actions";
import { MetricCard } from "@/components/lens/metric-card";
import {
  buildScenarioName,
  computeLensMetrics,
  defaultLensScenario,
  formatEUR,
  formatPct,
  formatRatio,
  normalizeScenario,
  payoutCadenceLabel,
  periodLabel,
  LENS_DISCLAIMER,
  type LensScenarioData,
} from "@/lib/lens/calculadora";

type SavedScenario = { id: string; name: string; data: LensScenarioData; updated_at: string };

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
}

/** Búsqueda tolerante: sin acentos y sin mayúsculas, que es como se teclea. */
function fold(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const PERIOD_OPTIONS = [1, 3, 6, 12];
const PAYOUT_OPTIONS = [1, 3, 6, 12];

export function CalculadoraMatriculas({ savedScenarios }: { savedScenarios: SavedScenario[] }) {
  const router = useRouter();
  const [scenario, setScenario] = useState<LensScenarioData>(() => defaultLensScenario());
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  // ── Nombre ──
  // Se compone solo con fecha, volumen y un genérico; a mano sólo se escribe
  // la palabra clave. Así treinta escenarios se ordenan y se buscan, en vez
  // de convertirse en treinta "Escenario base (2)".
  const [keyword, setKeyword] = useState("");
  const [manualName, setManualName] = useState<string | null>(null);

  // ── Pantalla ──
  // En móvil sólo cabe una de las dos mitades a la vez; en escritorio se ven
  // juntas y esta pestaña no pinta nada (la oculta el CSS).
  const [pane, setPane] = useState<"config" | "resultado">("config");
  const [query, setQuery] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [pdfPassword, setPdfPassword] = useState("");
  const [exporting, setExporting] = useState(false);

  const metrics = useMemo(() => computeLensMetrics(scenario), [scenario]);
  const scenarioName = manualName ?? buildScenarioName(metrics.totalStudents, keyword);

  const filtered = useMemo(() => {
    const q = fold(query.trim());
    if (!q) return savedScenarios;
    return savedScenarios.filter((s) => fold(s.name).includes(q));
  }, [savedScenarios, query]);

  function loadScenario(s: SavedScenario) {
    setScenario(normalizeScenario(s.data));
    setScenarioId(s.id);
    setManualName(s.name);
    setMessage(null);
    setPane("config");
  }

  function resetScenario() {
    setScenario(defaultLensScenario());
    setScenarioId(null);
    setManualName(null);
    setKeyword("");
    setMessage(null);
  }

  function handleSaveNew() {
    startTransition(async () => {
      const r = await saveScenario(scenarioName, scenario);
      if (r?.error) setMessage({ kind: "error", text: r.error });
      else {
        setScenarioId(r.id ?? null);
        setManualName(scenarioName);
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
      if (r?.error) setMessage({ kind: "error", text: r.error });
      else {
        resetScenario();
        router.refresh();
      }
    });
  }

  /** El PDF lo arma el servidor: es el único sitio donde se puede cifrar. */
  async function handleExport() {
    setExporting(true);
    setMessage(null);
    try {
      const res = await fetch("/lens/calculadora-matriculas/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: scenarioName, data: scenario, password: pdfPassword }),
      });
      if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${scenarioName.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ.·-]/g, "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setExportOpen(false);
      setMessage({
        kind: "ok",
        text: pdfPassword.trim() ? "PDF descargado, protegido con contraseña." : "PDF descargado.",
      });
    } catch (e) {
      setMessage({ kind: "error", text: `No se ha podido generar el PDF. ${(e as Error).message}` });
    } finally {
      setExporting(false);
    }
  }

  // ── Listas ──
  const mixSum = scenario.plans.reduce((s, p) => s + (p.mix || 0), 0);

  function patch(patchFn: (s: LensScenarioData) => LensScenarioData) {
    setScenario(patchFn);
  }
  function updatePlan(id: string, p: Partial<LensScenarioData["plans"][number]>) {
    patch((s) => ({ ...s, plans: s.plans.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }
  function updateChannel(id: string, p: Partial<LensScenarioData["channels"][number]>) {
    patch((s) => ({ ...s, channels: s.channels.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }
  function updateFixedCost(id: string, p: Partial<LensScenarioData["fixedCosts"][number]>) {
    patch((s) => ({ ...s, fixedCosts: s.fixedCosts.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }
  function updatePartner(id: string, p: Partial<LensScenarioData["partners"][number]>) {
    patch((s) => ({ ...s, partners: s.partners.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }

  const div = metrics.dividendPlan;
  const barMax = Math.max(
    metrics.totalRevenue,
    metrics.totalMarketingSpend,
    metrics.variableCostsTotal,
    metrics.gatewayFees,
    metrics.totalFixedCosts,
    metrics.salesCostTotal,
    Math.abs(metrics.netProfit),
    1,
  );

  return (
    <div className="axr-calc">
      {/* ══ Barra de escenario ══ */}
      <div className="axr-calc__topbar">
        <div className="axr-calc__topbar-row">
          <input
            type="search"
            className="axr-calc__search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Buscar entre ${savedScenarios.length} escenarios…`}
            aria-label="Buscar escenarios guardados"
          />
          <button type="button" className="axr-btn axr-btn--ghost" onClick={resetScenario} disabled={pending}>
            Nuevo
          </button>
        </div>

        {query.trim() ? (
          <ul className="axr-calc__results">
            {filtered.length === 0 ? (
              <li className="axr-calc__results-empty">Ningún escenario contiene «{query.trim()}».</li>
            ) : (
              filtered.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="axr-calc__result"
                    data-current={s.id === scenarioId ? "" : undefined}
                    onClick={() => {
                      loadScenario(s);
                      setQuery("");
                    }}
                  >
                    <span>{s.name}</span>
                    <span className="axr-calc__result-date">
                      {new Date(s.updated_at).toLocaleDateString("es-ES")}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        <div className="axr-calc__name">
          <div className="axr-calc__field">
            <label htmlFor="keyword">Palabra clave</label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setManualName(null);
              }}
              placeholder="agresivo, conservador, sin ads…"
            />
          </div>
          <div className="axr-calc__name-preview">
            <span className="axr-calc__name-label">Nombre</span>
            <strong>{scenarioName}</strong>
            {manualName ? (
              <button
                type="button"
                className="axr-calc__linkbtn"
                onClick={() => setManualName(null)}
                title="Volver al nombre automático"
              >
                regenerar
              </button>
            ) : (
              <button
                type="button"
                className="axr-calc__linkbtn"
                onClick={() => setManualName(scenarioName)}
                title="Escribir el nombre a mano"
              >
                editar a mano
              </button>
            )}
          </div>
          {manualName !== null ? (
            <div className="axr-calc__field">
              <label htmlFor="manual-name">Nombre a mano</label>
              <input
                id="manual-name"
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            </div>
          ) : null}
        </div>

        <div className="axr-calc__actions">
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
          <button
            type="button"
            className="axr-btn axr-btn--ghost"
            onClick={() => setExportOpen((v) => !v)}
            aria-expanded={exportOpen}
          >
            Exportar PDF
          </button>
        </div>

        {exportOpen ? (
          <div className="axr-calc__export">
            <p>
              Una página con la cuenta de resultados, el reparto entre socios y los supuestos. Si pones contraseña,
              el PDF se cifra y no se abre sin ella.
            </p>
            <div className="axr-calc__export-row">
              <div className="axr-calc__field">
                <label htmlFor="pdf-pass">Contraseña (opcional)</label>
                <input
                  id="pdf-pass"
                  type="text"
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  placeholder="Dejar vacío = PDF sin contraseña"
                  autoComplete="off"
                />
              </div>
              <button type="button" className="axr-btn axr-btn--primary" onClick={handleExport} disabled={exporting}>
                {exporting ? "Generando…" : "Descargar"}
              </button>
            </div>
          </div>
        ) : null}

        {message ? <div className={`axr-calc__msg axr-calc__msg--${message.kind}`}>{message.text}</div> : null}

        {/* Resumen que no se va nunca: en móvil se configura mirando esto. */}
        <div className="axr-calc__ticker">
          <span>
            <em>Alumnos</em> {metrics.totalStudents}
          </span>
          <span>
            <em>Facturación</em> {formatEUR(metrics.totalRevenue)}
          </span>
          <span data-tone={metrics.netProfit >= 0 ? "up" : "down"}>
            <em>Beneficio</em> {formatEUR(metrics.netProfit)}
          </span>
          <span data-tone={div.poolPerPayout > 0 ? "up" : undefined}>
            <em>Dividendos</em> {formatEUR(div.poolPerPayout)}
          </span>
        </div>

        <div className="axr-calc__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={pane === "config"}
            data-active={pane === "config" ? "" : undefined}
            onClick={() => setPane("config")}
          >
            Configuración
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pane === "resultado"}
            data-active={pane === "resultado" ? "" : undefined}
            onClick={() => setPane("resultado")}
          >
            Resultado
          </button>
        </div>
      </div>

      {/* ══ Las dos mitades ══ */}
      <div className="axr-calc__split">
        {/* ── Configuración ── */}
        <div className="axr-calc__pane" data-pane="config" data-active={pane === "config" ? "" : undefined}>
          <Section title="Periodo" hint="Qué representan los números de este escenario. De aquí sale cada cuánto se puede repartir.">
            <div className="axr-calc__assumptions">
              <div className="axr-calc__field">
                <label htmlFor="period">El escenario cubre</label>
                <select
                  id="period"
                  value={scenario.periodMonths}
                  onChange={(e) => patch((s) => ({ ...s, periodMonths: Number(e.target.value) }))}
                >
                  {PERIOD_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {periodLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Section>

          <Section
            title="Precios de planes"
            hint="El precio de cada plan y qué % de los alumnos lo elige. El ticket medio sale de esta mezcla."
          >
            <Head cols={2} labels={["Plan", "Precio (€)", "Mezcla (%)"]} />
            {scenario.plans.map((p) => (
              <Row key={p.id} cols={2} onRemove={() => patch((s) => ({ ...s, plans: s.plans.filter((x) => x.id !== p.id) }))}>
                <Txt label="Plan" value={p.name} onChange={(v) => updatePlan(p.id, { name: v })} />
                <Num label="Precio (€)" value={p.price} onChange={(v) => updatePlan(p.id, { price: v })} />
                <Num label="Mezcla (%)" value={p.mix} onChange={(v) => updatePlan(p.id, { mix: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir plan"
              onClick={() => patch((s) => ({ ...s, plans: [...s.plans, { id: newId(), name: "Nuevo plan", price: 0, mix: 0 }] }))}
            />
            <div className="axr-calc__mix-total" data-off={mixSum !== 100}>
              Suma de mezcla: {mixSum}% {mixSum === 100 ? "✓" : "— debería sumar 100%"}
            </div>
          </Section>

          <Section
            title="Canales de captación"
            hint="Cuánto inviertes en cada canal y cuántos alumnos trae. El CAC de cada uno se calcula solo."
          >
            <Head cols={2} labels={["Canal", "Inversión (€)", "Alumnos"]} />
            {scenario.channels.map((c) => (
              <Row
                key={c.id}
                cols={2}
                onRemove={() => patch((s) => ({ ...s, channels: s.channels.filter((x) => x.id !== c.id) }))}
              >
                <Txt label="Canal" value={c.name} onChange={(v) => updateChannel(c.id, { name: v })} />
                <Num label="Inversión (€)" value={c.spend} onChange={(v) => updateChannel(c.id, { spend: v })} />
                <Num label="Alumnos" value={c.students} onChange={(v) => updateChannel(c.id, { students: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir canal"
              onClick={() =>
                patch((s) => ({ ...s, channels: [...s.channels, { id: newId(), name: "Nuevo canal", spend: 0, students: 0 }] }))
              }
            />
          </Section>

          <Section
            title="Equipo comercial"
            hint="El sueldo se paga entren los alumnos que entren; el variable, sólo por matrícula cerrada. Por eso el variable entra en el punto de equilibrio y el sueldo no."
          >
            <div className="axr-calc__assumptions">
              <Num
                label="Nº de comerciales"
                value={scenario.salesTeam.reps}
                onChange={(v) => patch((s) => ({ ...s, salesTeam: { ...s.salesTeam, reps: v } }))}
                always
              />
              <Num
                label={`Sueldo fijo por comercial (€ / ${periodLabel(scenario.periodMonths)})`}
                value={scenario.salesTeam.salaryPerRep}
                onChange={(v) => patch((s) => ({ ...s, salesTeam: { ...s.salesTeam, salaryPerRep: v } }))}
                always
              />
              <Num
                label="Pago por matrícula cerrada (€)"
                value={scenario.salesTeam.bonusPerEnrollment}
                onChange={(v) => patch((s) => ({ ...s, salesTeam: { ...s.salesTeam, bonusPerEnrollment: v } }))}
                always
              />
            </div>
            <p className="axr-calc__inline-total">
              Coste comercial del periodo: <strong>{formatEUR(metrics.salesCostTotal)}</strong> ({formatEUR(metrics.salesFixedTotal)} de
              sueldos + {formatEUR(metrics.salesBonusTotal)} de variable)
            </p>
          </Section>

          <Section title="Costes fijos" hint="Lo que cuesta dar el curso entren los alumnos que entren: docencia, herramientas, soporte…">
            <Head cols={1} labels={["Coste", "Importe (€)"]} />
            {scenario.fixedCosts.map((c) => (
              <Row
                key={c.id}
                cols={1}
                onRemove={() => patch((s) => ({ ...s, fixedCosts: s.fixedCosts.filter((x) => x.id !== c.id) }))}
              >
                <Txt label="Coste" value={c.name} onChange={(v) => updateFixedCost(c.id, { name: v })} />
                <Num label="Importe (€)" value={c.amount} onChange={(v) => updateFixedCost(c.id, { amount: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir coste fijo"
              onClick={() => patch((s) => ({ ...s, fixedCosts: [...s.fixedCosts, { id: newId(), name: "Nuevo coste", amount: 0 }] }))}
            />
          </Section>

          <Section title="Otros supuestos" hint="Coste variable por alumno, pasarela de pago, upsells e impuesto de sociedades.">
            <div className="axr-calc__assumptions">
              <Num
                label="Coste variable / alumno (€)"
                value={scenario.variableCostPerStudent}
                onChange={(v) => patch((s) => ({ ...s, variableCostPerStudent: v }))}
                always
              />
              <Num
                label="Comisión pasarela (%)"
                value={scenario.gatewayFeePct}
                onChange={(v) => patch((s) => ({ ...s, gatewayFeePct: v }))}
                always
              />
              <Num
                label="% que compra un upsell"
                value={scenario.repeatPurchaseRate}
                onChange={(v) => patch((s) => ({ ...s, repeatPurchaseRate: v }))}
                always
              />
              <Num
                label="Valor medio del upsell (€)"
                value={scenario.upsellValue}
                onChange={(v) => patch((s) => ({ ...s, upsellValue: v }))}
                always
              />
              <Num
                label="Impuesto de sociedades (%)"
                value={scenario.corporateTaxPct}
                onChange={(v) => patch((s) => ({ ...s, corporateTaxPct: v }))}
                always
              />
            </div>
          </Section>

          <Section
            title="Dividendos"
            hint="Cuánto del beneficio sale hacia los socios, con qué condición y cada cuánto. Lo que no se reparte se queda como reservas."
          >
            <label className="axr-calc__check">
              <input
                type="checkbox"
                checked={scenario.dividends.enabled}
                onChange={(e) => patch((s) => ({ ...s, dividends: { ...s.dividends, enabled: e.target.checked } }))}
              />
              <span>Repartir dividendos en este escenario</span>
            </label>

            <div className="axr-calc__assumptions" data-disabled={!scenario.dividends.enabled ? "" : undefined}>
              <Num
                label="% del beneficio a repartir"
                value={scenario.dividends.payoutPct}
                onChange={(v) => patch((s) => ({ ...s, dividends: { ...s.dividends, payoutPct: v } }))}
                always
              />
              <Num
                label="Sólo si la facturación supera (€)"
                value={scenario.dividends.revenueThreshold}
                onChange={(v) => patch((s) => ({ ...s, dividends: { ...s.dividends, revenueThreshold: v } }))}
                always
              />
              <div className="axr-calc__field">
                <label htmlFor="cadence">Cada cuánto se reparte</label>
                <select
                  id="cadence"
                  value={scenario.dividends.everyMonths}
                  onChange={(e) => patch((s) => ({ ...s, dividends: { ...s.dividends, everyMonths: Number(e.target.value) } }))}
                >
                  {PAYOUT_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {payoutCadenceLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="axr-calc__inline-total">
              El umbral se compara con la facturación de {div.windowMonths} {div.windowMonths === 1 ? "mes" : "meses"}:{" "}
              <strong>{formatEUR(div.revenueInWindow)}</strong>
              {div.thresholdMet ? " — llega." : " — no llega."}
            </p>
          </Section>

          <Section title="Socios" hint="Quién es dueño de qué. Cada reparto se divide con estos porcentajes.">
            <Head cols={1} labels={["Socio", "Participación (%)"]} />
            {scenario.partners.map((p) => (
              <Row
                key={p.id}
                cols={1}
                onRemove={() => patch((s) => ({ ...s, partners: s.partners.filter((x) => x.id !== p.id) }))}
              >
                <Txt label="Socio" value={p.name} onChange={(v) => updatePartner(p.id, { name: v })} />
                <Num label="Participación (%)" value={p.sharePct} onChange={(v) => updatePartner(p.id, { sharePct: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir socio"
              onClick={() =>
                patch((s) => ({
                  ...s,
                  partners: [...s.partners, { id: newId(), name: `Socio ${s.partners.length + 1}`, sharePct: 0 }],
                }))
              }
            />
            <div className="axr-calc__mix-total" data-off={Math.round(div.sharesSum) !== 100}>
              Suma de participaciones: {formatPct(div.sharesSum, 1)}{" "}
              {Math.round(div.sharesSum) === 100 ? "✓" : "— debería sumar 100%"}
            </div>
          </Section>
        </div>

        {/* ── Resultado ── */}
        <aside className="axr-calc__pane" data-pane="resultado" data-active={pane === "resultado" ? "" : undefined}>
          <div className="axr-calc__preview-inner">
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

            <Section title="De los ingresos al beneficio" hint="Cómo se reparte cada euro que entra por matrículas.">
              <div className="axr-calc__bars">
                <BarRow label="Ingresos totales" value={metrics.totalRevenue} max={barMax} variant="revenue" />
                <BarRow label="- Inversión en captación" value={metrics.totalMarketingSpend} max={barMax} />
                <BarRow label="- Costes variables" value={metrics.variableCostsTotal} max={barMax} />
                <BarRow label="- Comisión de pasarela" value={metrics.gatewayFees} max={barMax} />
                <BarRow label="- Equipo comercial" value={metrics.salesCostTotal} max={barMax} />
                <BarRow label="- Costes fijos" value={metrics.totalFixedCosts} max={barMax} />
                {scenario.corporateTaxPct > 0 ? (
                  <BarRow label="- Impuesto de sociedades" value={metrics.corporateTax} max={barMax} />
                ) : null}
                <BarRow
                  label="= Beneficio neto"
                  value={metrics.netProfit}
                  max={barMax}
                  variant={metrics.netProfit >= 0 ? "profit" : "loss"}
                />
              </div>
            </Section>

            <Section
              title="Dividendos"
              hint={`Ventana de ${div.windowMonths} ${div.windowMonths === 1 ? "mes" : "meses"} · ${payoutCadenceLabel(div.windowMonths)} · ${div.payoutsPerYear} repartos al año.`}
            >
              {div.blockedReason ? (
                <p className="axr-calc__blocked">
                  {div.blockedReason === "disabled"
                    ? "El reparto está desactivado en este escenario."
                    : div.blockedReason === "below-threshold"
                      ? `No se reparte: faltan ${formatEUR(div.threshold - div.revenueInWindow)} de facturación en la ventana para llegar al umbral.`
                      : "No se reparte: no hay beneficio en la ventana."}
                </p>
              ) : null}

              <div className="axr-calc__kpis">
                <MetricCard metricKey="dividendPool" value={formatEUR(div.poolPerPayout)} tone={div.poolPerPayout > 0 ? "positive" : undefined} />
                <MetricCard metricKey="retained" value={formatEUR(div.retainedPerPayout)} />
              </div>

              {div.partners.length > 0 ? (
                <table className="axr-calc__channel-table" style={{ marginTop: "1rem" }}>
                  <thead>
                    <tr>
                      <th>Socio</th>
                      <th>%</th>
                      <th>Por reparto</th>
                      <th>Al año</th>
                    </tr>
                  </thead>
                  <tbody>
                    {div.partners.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{formatPct(p.sharePct, 0)}</td>
                        <td>{formatEUR(p.perPayout)}</td>
                        <td>{formatEUR(p.perYear)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="axr-calc__blocked">No hay socios definidos: añádelos para ver el reparto.</p>
              )}
            </Section>

            <Section title="Unidad económica" hint="Lo que cuesta y lo que vale cada alumno.">
              <div className="axr-calc__kpis">
                <MetricCard metricKey="avgTicket" value={formatEUR(metrics.avgTicket)} />
                <MetricCard metricKey="cac" value={formatEUR(metrics.cac, 0)} />
                <MetricCard metricKey="ltv" value={formatEUR(metrics.ltv)} />
                <MetricCard
                  metricKey="ltvCacRatio"
                  value={formatRatio(metrics.ltvCacRatio)}
                  tone={metrics.ltvCacRatio >= 3 ? "positive" : metrics.ltvCacRatio < 1 ? "negative" : undefined}
                />
                <MetricCard
                  metricKey="roas"
                  value={formatRatio(metrics.roas)}
                  tone={metrics.roas >= 1 ? "positive" : "negative"}
                />
                <MetricCard
                  metricKey="breakEvenStudents"
                  value={
                    metrics.breakEvenStudents == null
                      ? "No se cubre nunca"
                      : `${Math.ceil(metrics.breakEvenStudents)} alumnos`
                  }
                  tone={
                    metrics.breakEvenStudents != null && metrics.totalStudents >= metrics.breakEvenStudents
                      ? "positive"
                      : undefined
                  }
                />
              </div>
            </Section>

            {metrics.channelStats.length > 0 ? (
              <Section title="Por canal" hint="Dónde salen los alumnos más baratos.">
                <table className="axr-calc__channel-table">
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
              </Section>
            ) : null}
          </div>
        </aside>
      </div>

      <p className="axr-calc__disclaimer">
        <strong>Aviso.</strong> {LENS_DISCLAIMER}
      </p>
    </div>
  );
}

// ── Piezas de formulario ──────────────────────────────────

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="axr-calc__section">
      <div className="axr-calc__section-head">
        <h2>{title}</h2>
      </div>
      {hint ? <p className="axr-calc__section-hint">{hint}</p> : null}
      {children}
    </div>
  );
}

function Head({ cols, labels }: { cols: number; labels: string[] }) {
  return (
    <div className="axr-calc__row axr-calc__row--head" style={{ ["--cols" as string]: cols }}>
      {labels.map((l) => (
        <span key={l}>{l}</span>
      ))}
      <span />
    </div>
  );
}

function Row({
  cols,
  onRemove,
  children,
}: {
  cols: number;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="axr-calc__row" style={{ ["--cols" as string]: cols }}>
      {children}
      <button type="button" className="axr-calc__row-remove" onClick={onRemove} aria-label="Quitar fila">
        ×
      </button>
    </div>
  );
}

function Txt({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="axr-calc__field">
      <label>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
  always,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Etiqueta siempre visible, también en escritorio (fuera de las tablas). */
  always?: boolean;
}) {
  return (
    <div className={`axr-calc__field${always ? " axr-calc__field--labelled" : ""}`}>
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

function AddBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="axr-calc__add-btn" onClick={onClick}>
      + {label}
    </button>
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
        <div
          className={`axr-calc__bar-fill${variant ? ` axr-calc__bar-fill--${variant}` : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
