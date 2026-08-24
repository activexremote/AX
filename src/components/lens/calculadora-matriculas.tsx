"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { saveScenario, updateScenario, deleteScenario } from "@/app/lens/calculadora-matriculas/actions";
import { CAT, CAT_ORDER, CashLine, MiniBars, MonthlyPL, StackedBar, TrendBars } from "@/components/lens/charts";
import {
  buildScenarioName,
  computeLensMetrics,
  defaultLensScenario,
  formatEUR,
  formatPct,
  formatMonths,
  formatRatio,
  normalizeScenario,
  METRIC_INFO,
  payoutCadenceLabel,
  periodLabel,
  scenarioPeriodLabel,
  scenarioPeriodShort,
  buildYearSummary,
  LENS_DISCLAIMER,
  MONTH_NAMES,
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
const COLLAPSE_KEY = "axr-lens-calc-collapsed";
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
  const [pane, setPane] = useState<"config" | "resultado" | "kpis">("config");
  // La barra de mando ocupaba media pantalla. Ahora se pliega, y se recuerda
  // plegada: quien la cierra es porque quiere el sitio para los números.
  const [collapsed, setCollapsed] = useState(false);
  const [panel, setPanel] = useState<"none" | "escenario" | "pdf">("none");
  const [query, setQuery] = useState("");
  const [pdfPassword, setPdfPassword] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* modo privado o almacenamiento bloqueado: se queda desplegada */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((v) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, v ? "0" : "1");
      } catch {
        /* da igual: es una comodidad, no un dato */
      }
      return !v;
    });
  }

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
      setPanel("none");
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
  function updateCourse(id: string, p: Partial<LensScenarioData["courses"][number]>) {
    patch((s) => ({ ...s, courses: s.courses.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }
  function updateTeacher(id: string, p: Partial<LensScenarioData["teachers"][number]>) {
    patch((s) => ({ ...s, teachers: s.teachers.map((x) => (x.id === id ? { ...x, ...p } : x)) }));
  }

  const div = metrics.dividendPlan;
  const k = metrics.kpis;

  // En pantalla ancha la configuración está SIEMPRE a la izquierda, así que
  // la derecha necesita saber qué enseñar cuando la pestaña elegida es
  // justamente la configuración: enseña el informe, que es lo que se estaba
  // mirando antes de ir a tocar un número.
  const rightPane = pane === "config" ? "resultado" : pane;

  const resumen = useMemo(() => buildYearSummary(scenario, metrics), [scenario, metrics]);

  // De la tabla de canales sólo se mira esto: dónde sale barato el alumno y
  // dónde caro. Los canales sin alumnos quedan fuera, que su CAC es 0 y
  // saldrían siempre como "el más barato".
  // ¿Se pisan las convocatorias? Si la siguiente arranca antes de que acabe
  // la anterior, hay dos grupos a la vez, y eso cambia el profesorado que
  // hace falta aunque la cuenta de resultados no se entere.
  const solapan = scenario.calendar.startEveryDays < scenario.convocatoriaWeeks * 7;
  const maxSolape = Math.max(...metrics.months.map((m) => m.running), 0);

  const conAlumnos = metrics.channelStats.filter((c) => c.students > 0);
  const bestChannel = conAlumnos.length ? conAlumnos.reduce((a, b) => (b.cac < a.cac ? b : a)) : null;
  const worstChannel = conAlumnos.length > 1 ? conAlumnos.reduce((a, b) => (b.cac > a.cac ? b : a)) : null;
  const barMax = Math.max(
    metrics.totalRevenue,
    metrics.totalMarketingSpend,
    metrics.variableCostsTotal,
    metrics.gatewayFees,
    metrics.totalFixedCosts,
    metrics.teachingCostTotal,
    metrics.salesCostTotal,
    Math.abs(metrics.netProfit),
    1,
  );

  return (
    <div className="axr-calc">
      {/* ══ Barra de mando ══ */}
      {/* Plegada deja una sola línea: el nombre y el beneficio, que es lo que
          se mira de reojo. Todo lo demás vive en paneles que se abren cuando
          hacen falta, no ocupando pantalla por si acaso. */}
      <div className="axr-calc__topbar" data-collapsed={collapsed ? "" : undefined}>
        <div className="axr-calc__bar-main">
          <button
            type="button"
            className="axr-calc__collapse"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Desplegar la barra" : "Plegar la barra"}
            title={collapsed ? "Desplegar" : "Plegar"}
          >
            {collapsed ? "▾" : "▴"}
          </button>
          <span className="axr-calc__bar-name" title={scenarioName}>
            {scenarioName}
          </span>
          <span className="axr-calc__bar-quick" data-tone={metrics.netProfit >= 0 ? "up" : "down"}>
            {formatEUR(metrics.netProfit)}
          </span>
        </div>

        {!collapsed ? (
          <>
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
              <span>
                <em>Al año</em> {formatEUR(metrics.annual.revenue)}
              </span>
            </div>

            <div className="axr-calc__actions">
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                aria-expanded={panel === "escenario"}
                onClick={() => setPanel((p) => (p === "escenario" ? "none" : "escenario"))}
              >
                Escenario ▾
              </button>
              <button
                type="button"
                className="axr-btn axr-btn--primary"
                disabled={pending}
                onClick={scenarioId ? handleUpdate : handleSaveNew}
              >
                {scenarioId ? "Guardar cambios" : "Guardar"}
              </button>
              <button
                type="button"
                className="axr-btn axr-btn--ghost"
                aria-expanded={panel === "pdf"}
                onClick={() => setPanel((p) => (p === "pdf" ? "none" : "pdf"))}
              >
                PDF
              </button>
            </div>

            {panel === "escenario" ? (
              <div className="axr-calc__panel">
                <div className="axr-calc__field axr-calc__field--labelled">
                  <label htmlFor="buscar">Buscar entre los guardados</label>
                  <input
                    id="buscar"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`${savedScenarios.length} escenarios`}
                  />
                </div>

                {query.trim() ? (
                  <ul className="axr-calc__results">
                    {filtered.length === 0 ? (
                      <li className="axr-calc__results-empty">Ninguno contiene «{query.trim()}».</li>
                    ) : (
                      filtered.map((sc) => (
                        <li key={sc.id}>
                          <button
                            type="button"
                            className="axr-calc__result"
                            data-current={sc.id === scenarioId ? "" : undefined}
                            onClick={() => {
                              loadScenario(sc);
                              setQuery("");
                              setPanel("none");
                            }}
                          >
                            <span>{sc.name}</span>
                            <span className="axr-calc__result-date">
                              {new Date(sc.updated_at).toLocaleDateString("es-ES")}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                ) : null}

                <div className="axr-calc__field axr-calc__field--labelled">
                  <label htmlFor="keyword">Palabra clave del nombre</label>
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
                  <button
                    type="button"
                    className="axr-calc__linkbtn"
                    onClick={() => setManualName(manualName === null ? scenarioName : null)}
                  >
                    {manualName === null ? "editar a mano" : "regenerar"}
                  </button>
                </div>

                {manualName !== null ? (
                  <div className="axr-calc__field axr-calc__field--labelled">
                    <label htmlFor="manual-name">Nombre a mano</label>
                    <input
                      id="manual-name"
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                    />
                  </div>
                ) : null}

                <div className="axr-calc__actions">
                  <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={resetScenario}>
                    Nuevo
                  </button>
                  {scenarioId ? (
                    <>
                      <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={handleSaveNew}>
                        Guardar como nuevo
                      </button>
                      <button type="button" className="axr-btn axr-btn--danger" disabled={pending} onClick={handleDelete}>
                        Eliminar
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {panel === "pdf" ? (
              <div className="axr-calc__panel">
                <p className="axr-calc__section-hint" style={{ margin: 0 }}>
                  Una página con la cuenta de resultados, el reparto entre socios y los supuestos. Con contraseña, el
                  PDF se cifra y no se abre sin ella.
                </p>
                <div className="axr-calc__export-row">
                  <div className="axr-calc__field axr-calc__field--labelled">
                    <label htmlFor="pdf-pass">Contraseña (opcional)</label>
                    <input
                      id="pdf-pass"
                      type="text"
                      value={pdfPassword}
                      onChange={(e) => setPdfPassword(e.target.value)}
                      placeholder="Vacío = sin contraseña"
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
          </>
        ) : null}

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
          <button
            type="button"
            role="tab"
            aria-selected={pane === "kpis"}
            data-active={pane === "kpis" ? "" : undefined}
            onClick={() => setPane("kpis")}
          >
            KPIs
          </button>
        </div>
      </div>

      {/* ══ Las dos mitades ══ */}
      <div className="axr-calc__split">
        {/* ── Configuración ── */}
        <div className="axr-calc__pane" data-pane="config" data-active={pane === "config" ? "" : undefined}>
          <Section
            title="Convocatorias al año"
            badge={`${metrics.annual.intakes} al año · ${Math.round(metrics.annual.students)} alumnos`}
            hint="Cuántas veces al año se abre cada curso. Es lo que convierte una convocatoria suelta en un año de negocio."
          >
            <Head cols={1} labels={["Curso", "Convocatorias / año"]} />
            {scenario.courses.map((c) => (
              <Row
                key={c.id}
                cols={1}
                onRemove={() => patch((s) => ({ ...s, courses: s.courses.filter((x) => x.id !== c.id) }))}
              >
                <Txt label="Curso" value={c.name} onChange={(v) => updateCourse(c.id, { name: v })} />
                <Num
                  label="Convocatorias / año"
                  value={c.intakesPerYear}
                  onChange={(v) => updateCourse(c.id, { intakesPerYear: v })}
                />
              </Row>
            ))}
            <AddBtn
              label="Añadir curso"
              onClick={() =>
                patch((s) => ({
                  ...s,
                  courses: [...s.courses, { id: newId(), name: "Nuevo curso", intakesPerYear: 1 }],
                }))
              }
            />
            <p className="axr-calc__inline-total">
              <strong>{metrics.annual.intakes}</strong>{" "}
              {metrics.annual.intakes === 1 ? "convocatoria" : "convocatorias"} al año ={" "}
              <strong>{Math.round(metrics.annual.students)} alumnos</strong> y{" "}
              <strong>{formatEUR(metrics.annual.revenue)}</strong> de facturación anual.
            </p>
            <p className="axr-calc__section-hint" style={{ margin: "0.5rem 0 0" }}>
              Cada convocatoria se supone igual a la que estás configurando abajo. Es una hipótesis: si el Founder
              tiene la mitad de alumnos que el Professional, esto se queda largo.
            </p>
          </Section>

          <Section
            title="Calendario"
            badge={`cada ${scenario.calendar.startEveryDays} días${solapan ? " · solapadas" : ""}`}
            hint="Cuándo arranca cada convocatoria dentro del año. Es lo que decide en qué mes entra el dinero, y por tanto toda la previsión."
          >
            <div className="axr-calc__assumptions">
              <Num
                label="Primera arranca el día del año"
                value={scenario.calendar.firstStartDay}
                onChange={(v) => patch((s) => ({ ...s, calendar: { ...s.calendar, firstStartDay: v } }))}
                always
              />
              <Num
                label="Días entre convocatorias"
                value={scenario.calendar.startEveryDays}
                onChange={(v) => patch((s) => ({ ...s, calendar: { ...s.calendar, startEveryDays: v } }))}
                always
              />
              <Num
                label="Captación, días de antelación"
                value={scenario.calendar.marketingLeadDays}
                onChange={(v) => patch((s) => ({ ...s, calendar: { ...s.calendar, marketingLeadDays: v } }))}
                always
              />
            </div>
            <p className="axr-calc__inline-total">
              {solapan ? (
                <>
                  Se <strong>solapan</strong>: cada {scenario.calendar.startEveryDays} días arranca una y duran{" "}
                  {scenario.convocatoriaWeeks * 7}, así que llega a haber{" "}
                  <strong>{maxSolape} grupos a la vez</strong>.
                </>
              ) : (
                <>
                  Van <strong>en fila</strong>, sin solaparse: cada una acaba antes de que empiece la siguiente.
                </>
              )}
            </p>
          </Section>

          <Section
            title="Periodo"
            badge={scenarioPeriodLabel(scenario)}
            hint="Todo lo que rellenes debajo —alumnos, inversión, costes— es lo de UN periodo. Aquí eliges de cuánto tiempo hablamos."
          >
            <div className="axr-calc__assumptions">
              <div className="axr-calc__field axr-calc__field--labelled">
                <label htmlFor="period-mode">Los números de abajo son de</label>
                <select
                  id="period-mode"
                  value={scenario.periodMode === "convocatoria" ? "convocatoria" : String(scenario.periodMonths)}
                  onChange={(e) =>
                    patch((s) =>
                      e.target.value === "convocatoria"
                        ? { ...s, periodMode: "convocatoria" }
                        : { ...s, periodMode: "months", periodMonths: Number(e.target.value) },
                    )
                  }
                >
                  <option value="convocatoria">1 convocatoria</option>
                  {PERIOD_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {periodLabel(m)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Hace falta siempre, no sólo en modo convocatoria: aunque el
                  escenario se declare en meses, el profesorado se contrata por
                  convocatoria y hay que saber cuánto dura para repartir su coste. */}
              <Num
                label="Semanas que dura una convocatoria"
                value={scenario.convocatoriaWeeks}
                onChange={(v) => patch((s) => ({ ...s, convocatoriaWeeks: v }))}
                always
              />
            </div>
            <p className="axr-calc__inline-total">
              Estás diciendo: cada {scenarioPeriodShort(scenario)} entran{" "}
              <strong>{metrics.totalStudents} alumnos</strong> y se facturan{" "}
              <strong>{formatEUR(metrics.totalRevenue)}</strong>.
            </p>
            <p className="axr-calc__section-hint" style={{ margin: "0.5rem 0 0" }}>
              El periodo no cambia la cuenta de resultados: decide cuánto se acumula entre un reparto de dividendos
              y el siguiente, y cómo se reparte el coste del profesorado, que se contrata por convocatoria.
            </p>
          </Section>

          <Section
            title="Precios de planes"
            badge={`Ticket medio ${formatEUR(metrics.avgTicket)}`}
            hint="Precio, qué % lo elige y en cuántos meses lo paga. Los meses de pago no cambian el total: cambian el mes en que entra el dinero."
          >
            <Head cols={3} labels={["Plan", "Precio (€)", "Mezcla (%)", "Meses de pago"]} />
            {scenario.plans.map((p) => (
              <Row key={p.id} cols={3} onRemove={() => patch((s) => ({ ...s, plans: s.plans.filter((x) => x.id !== p.id) }))}>
                <Txt label="Plan" value={p.name} onChange={(v) => updatePlan(p.id, { name: v })} />
                <Num label="Precio (€)" value={p.price} onChange={(v) => updatePlan(p.id, { price: v })} />
                <Num label="Mezcla (%)" value={p.mix} onChange={(v) => updatePlan(p.id, { mix: v })} />
                <Num label="Meses de pago" value={p.payMonths} onChange={(v) => updatePlan(p.id, { payMonths: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir plan"
              onClick={() => patch((s) => ({ ...s, plans: [...s.plans, { id: newId(), name: "Nuevo plan", price: 0, mix: 0, payMonths: 1 }] }))}
            />
            <div className="axr-calc__mix-total" data-off={mixSum !== 100}>
              Suma de mezcla: {mixSum}% {mixSum === 100 ? "✓" : "— debería sumar 100%"}
            </div>
          </Section>

          <Section
            title="Canales de captación"
            badge={`${metrics.totalStudents} alumnos · ${formatEUR(metrics.totalMarketingSpend)}`}
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
            title="Profesorado"
            badge={`${metrics.teachingHours} h · ${formatEUR(metrics.teachingCostPerConvocatoria)}`}
            hint={`Horas cerradas por convocatoria y precio por hora. No depende de cuántos alumnos entren: si la convocatoria se da, las horas se pagan.`}
          >
            <Head cols={2} labels={["Profesor", "Horas / convocatoria", "€ por hora"]} />
            {scenario.teachers.map((t) => (
              <Row
                key={t.id}
                cols={2}
                onRemove={() => patch((s) => ({ ...s, teachers: s.teachers.filter((x) => x.id !== t.id) }))}
              >
                <Txt label="Profesor" value={t.name} onChange={(v) => updateTeacher(t.id, { name: v })} />
                <Num label="Horas / convocatoria" value={t.hours} onChange={(v) => updateTeacher(t.id, { hours: v })} />
                <Num label="€ por hora" value={t.hourlyRate} onChange={(v) => updateTeacher(t.id, { hourlyRate: v })} />
              </Row>
            ))}
            <AddBtn
              label="Añadir profesor"
              onClick={() =>
                patch((s) => ({
                  ...s,
                  teachers: [...s.teachers, { id: newId(), name: "Nuevo profesor", hours: 0, hourlyRate: 0 }],
                }))
              }
            />
            <p className="axr-calc__inline-total">
              {metrics.teachingHours} h por convocatoria ={" "}
              <strong>{formatEUR(metrics.teachingCostPerConvocatoria)}</strong> por convocatoria
              {scenario.periodMode === "convocatoria" ? (
                "."
              ) : (
                <>
                  , que en {scenarioPeriodShort(scenario)} son{" "}
                  <strong>{formatEUR(metrics.teachingCostTotal)}</strong>.
                </>
              )}
            </p>
            {scenario.teachers.length === 0 ? (
              <p className="axr-calc__section-hint" style={{ margin: "0.5rem 0 0" }}>
                Este escenario no tiene profesorado aquí. Si su coste docente está metido como coste fijo, déjalo
                así: repetirlo en los dos sitios lo contaría dos veces.
              </p>
            ) : null}
          </Section>

          <Section
            title="Equipo comercial"
            badge={formatEUR(metrics.salesCostTotal)}
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
                label={`Sueldo fijo por comercial (€ / ${scenarioPeriodShort(scenario)})`}
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

          <Section
            title="Costes fijos"
            badge={formatEUR(metrics.totalFixedCosts)}
            hint="Estructura que se paga entren los alumnos que entren: herramientas, soporte, alquiler… La docencia NO va aquí: tiene su propio bloque, con horas y precio por hora.">
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

          <Section
            title="Otros supuestos"
            badge={`Pasarela ${formatPct(scenario.gatewayFeePct, 1)} · Impuestos ${formatPct(scenario.corporateTaxPct, 0)}`}
            hint="Coste variable por alumno, pasarela de pago, upsells e impuesto de sociedades."
          >
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
            title="Caja y contabilidad"
            badge={`Caja ${formatEUR(scenario.cashOnHand)} · fin. ${formatPct(scenario.completionRate, 0)}`}
            hint="Lo que hace falta para hablar de EBITDA y de runway: amortizaciones, gastos financieros, caja disponible y cuántos alumnos terminan."
          >
            <div className="axr-calc__assumptions">
              <Num
                label="Amortizaciones (€ / periodo)"
                value={scenario.amortizationPerPeriod}
                onChange={(v) => patch((s) => ({ ...s, amortizationPerPeriod: v }))}
                always
              />
              <Num
                label="Gastos financieros (€ / periodo)"
                value={scenario.financialCostsPerPeriod}
                onChange={(v) => patch((s) => ({ ...s, financialCostsPerPeriod: v }))}
                always
              />
              <Num
                label="Caja disponible hoy (€)"
                value={scenario.cashOnHand}
                onChange={(v) => patch((s) => ({ ...s, cashOnHand: v }))}
                always
              />
              <Num
                label="Inversión inicial (€)"
                value={scenario.initialInvestment}
                onChange={(v) => patch((s) => ({ ...s, initialInvestment: v }))}
                always
              />
              <Num
                label="% que termina el curso"
                value={scenario.completionRate}
                onChange={(v) => patch((s) => ({ ...s, completionRate: v }))}
                always
              />
            </div>
            <p className="axr-calc__inline-total">
              EBITDA <strong>{formatEUR(metrics.ebitda)}</strong> ({formatPct(k.ebitdaMarginPct, 0)}) · EBIT{" "}
              <strong>{formatEUR(metrics.ebit)}</strong>. La amortización no sale de la caja; los financieros, sí. La
              inversión inicial tampoco pasa por el resultado: sale de la caja y vuelve poco a poco por la
              amortización.
            </p>
          </Section>

          <Section
            title="Dividendos"
            badge={
              scenario.dividends.enabled
                ? `${formatPct(scenario.dividends.payoutPct, 0)} ${payoutCadenceLabel(scenario.dividends.everyMonths)}`
                : "apagado"
            }
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

          <Section
            title="Socios"
            badge={`${scenario.partners.length} · ${formatPct(div.sharesSum, 0)}`}
            hint="Quién es dueño de qué. Cada reparto se divide con estos porcentajes."
          >
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
        <aside
          className="axr-calc__pane"
          data-pane="resultado"
          data-active={pane === "resultado" ? "" : undefined}
          data-wide-active={rightPane === "resultado" ? "" : undefined}
        >
          {/* ══ El informe ══
              Cabe entero en una pantalla de móvil, sin scroll. Esa es la
              restricción que manda sobre todo lo demás: bloques pequeños,
              nada repetido y ni un número que no se mire.

              Por eso se fue la cascada: decía exactamente lo mismo que la
              barra apilada, en el triple de alto. Y la tabla de canales se
              quedó en una línea con los dos extremos, que es lo único que se
              mira de ella: dónde sale barato y dónde caro. */}
          <div className="axr-report">
            {/* Sin tira de KPIs: alumnos, facturación, beneficio y margen del
                periodo ya están arriba, en la barra de mando. Repetirlos aquí
                costaba cincuenta píxeles de la única pantalla que hay. */}
            {/* ── Los doce meses: la imagen central ── */}
            <section className="axr-report__block">
              <h3>
                Caja mes a mes
                <em>{maxSolape > 1 ? `hasta ${maxSolape} grupos a la vez` : "sin solape"}</em>
              </h3>
              <MonthlyPL
                months={metrics.months}
                cumulative={metrics.months[11]?.cash ?? 0}
                initialInvestment={scenario.initialInvestment}
                openingCash={k.cashOnHand}
              />
              <div className="axr-report__trio">
                <Tile label="Factura/año" value={formatEUR(metrics.annual.revenue)} />
                <Tile
                  label="Beneficio/año"
                  value={formatEUR(metrics.annual.netProfit)}
                  tone={metrics.annual.netProfit >= 0 ? "up" : "down"}
                />
                <Tile
                  label="Dividendos/año"
                  value={formatEUR(metrics.annual.dividends)}
                  tone={metrics.annual.dividends > 0 ? "up" : undefined}
                />
              </div>
            </section>

            {/* ── Por curso ── */}
            <section className="axr-report__block">
              <h3>
                Por curso
                <em>
                  {metrics.annual.intakes} convocatorias ·{" "}
                  <span data-alert={metrics.annual.weeksOver > 0 ? "" : undefined}>
                    {Math.round(metrics.annual.weeksBusy)}/52 sem
                    {metrics.annual.weeksOver > 0 ? ` (+${Math.round(metrics.annual.weeksOver)})` : ""}
                  </span>
                </em>
              </h3>
              <MiniBars
                rows={metrics.annual.perCourse.map((c, i) => ({
                  key: c.id,
                  label: c.name,
                  meta: `${c.intakes} × ${Math.round(c.students / Math.max(1, c.intakes))} al.`,
                  value: c.revenue,
                  color: CAT_ORDER[i % CAT_ORDER.length],
                }))}
              />
            </section>

            {/* ── Cada euro ── */}
            <section className="axr-report__block">
              <h3>
                A dónde va cada euro
                <em>por {scenarioPeriodShort(scenario)}</em>
              </h3>
              <StackedBar
                total={metrics.totalRevenue}
                dense
                slices={[
                  { key: "captacion", label: "Captación", value: metrics.totalMarketingSpend, color: CAT.captacion },
                  { key: "variables", label: "Variables", value: metrics.variableCostsTotal, color: CAT.variables },
                  { key: "pasarela", label: "Pasarela", value: metrics.gatewayFees, color: CAT.pasarela },
                  { key: "profesorado", label: "Profesorado", value: metrics.teachingCostTotal, color: CAT.profesorado },
                  { key: "comercial", label: "Comercial", value: metrics.salesCostTotal, color: CAT.comercial },
                  { key: "estructura", label: "Estructura", value: metrics.totalFixedCosts, color: CAT.estructura },
                  ...(metrics.corporateTax > 0
                    ? [{ key: "tax", label: "Impuestos", value: metrics.corporateTax, color: "#525252" }]
                    : []),
                  { key: "beneficio", label: "Beneficio", value: Math.max(0, metrics.netProfit), color: "#038632" },
                ]}
              />
            </section>

            {/* ── Dividendos ── */}
            <section className="axr-report__block">
              <h3>
                Dividendos
                <em>{payoutCadenceLabel(div.windowMonths)}</em>
              </h3>

              {div.blockedReason ? (
                <p className="axr-report__note">
                  {div.blockedReason === "disabled"
                    ? "Reparto desactivado."
                    : div.blockedReason === "below-threshold"
                      ? `Faltan ${formatEUR(div.threshold - div.revenueInWindow)} de facturación en la ventana.`
                      : "No hay beneficio que repartir."}
                </p>
              ) : null}

              <div className="axr-report__split">
                <Tile
                  label="Por reparto"
                  value={formatEUR(div.poolPerPayout)}
                  tone={div.poolPerPayout > 0 ? "up" : undefined}
                  big
                  metricKey="dividendPool"
                />
                <Tile label="Reservas" value={formatEUR(div.retainedPerPayout)} metricKey="retained" />
              </div>

              {div.partners.length > 0 && div.poolPerPayout > 0 ? (
                <MiniBars
                  rows={div.partners.map((p, i) => ({
                    key: p.id,
                    label: p.name,
                    meta: `${formatPct(p.sharePct, 0)} · ${formatEUR(p.perYear)}/año`,
                    value: p.perPayout,
                    color: CAT_ORDER[i % CAT_ORDER.length],
                  }))}
                />
              ) : null}
            </section>

            {/* ── Unidad económica ── */}
            <section className="axr-report__block">
              <h3>
                Por alumno
                <em>
                  {metrics.breakEvenStudents == null
                    ? "sin equilibrio"
                    : `equilibrio en ${Math.ceil(metrics.breakEvenStudents)}`}
                </em>
              </h3>
              <div className="axr-report__grid6">
                <Tile label="Ticket" value={formatEUR(metrics.avgTicket)} metricKey="avgTicket" />
                <Tile label="CAC" value={formatEUR(metrics.cac, 0)} metricKey="cac" />
                <Tile label="LTV" value={formatEUR(metrics.ltv)} metricKey="ltv" />
                <Tile
                  label="LTV : CAC"
                  metricKey="ltvCacRatio"
                  value={formatRatio(metrics.ltvCacRatio)}
                  tone={metrics.ltvCacRatio >= 3 ? "up" : metrics.ltvCacRatio < 1 ? "down" : undefined}
                />
                <Tile
                  label="ROAS"
                  metricKey="roas"
                  value={formatRatio(metrics.roas)}
                  tone={metrics.roas >= 1 ? "up" : "down"}
                />
                <Tile
                  label="Equilibrio"
                  metricKey="breakEvenStudents"
                  value={
                    metrics.breakEvenStudents == null ? "—" : `${Math.ceil(metrics.breakEvenStudents)} al.`
                  }
                  tone={
                    metrics.breakEvenStudents != null && metrics.totalStudents >= metrics.breakEvenStudents
                      ? "up"
                      : "down"
                  }
                />
              </div>

            </section>

            {/* ── El año contado en frases ──
                Va debajo de todo a propósito: no es un dato más, es lo que se
                lee cuando alguien pregunta "vale, ¿y esto qué significa?", y
                para eso hay que haber visto antes los números. */}
            <section className="axr-report__block axr-report__summary">
              <h3>
                Resumen del ejercicio
                <em>en cristiano</em>
              </h3>
              {resumen.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </section>

            <details className="axr-report__aviso">
              <summary>Aviso: hipótesis, no contabilidad oficial</summary>
              <p>{LENS_DISCLAIMER}</p>
            </details>
          </div>
        </aside>

        {/* ══ Las métricas que mira quien viene de fuera ══
            En pestaña propia y no debajo del informe: son otra conversación
            —la de si esto es invertible— y meterlas en la misma pantalla
            obligaría a hacer scroll en las dos. */}
        <aside
          className="axr-calc__pane"
          data-pane="kpis"
          data-active={pane === "kpis" ? "" : undefined}
          data-wide-active={rightPane === "kpis" ? "" : undefined}
        >
          <div className="axr-report">
            {/* ── Recurrencia ── */}
            <section className="axr-report__block">
              <h3>
                Ingresos normalizados
                <em>{formatPct(k.deferredPct, 0)} diferido</em>
              </h3>
              <div className="axr-report__trio" style={{ marginTop: 0 }}>
                <Tile label="MRR" value={formatEUR(k.mrr)} />
                <Tile label="ARR" value={formatEUR(k.arr)} />
                <Tile
                  label="Crecim. mensual"
                  value={formatPct(k.growthMoM, 0)}
                  tone={k.growthMoM >= 10 ? "up" : k.growthMoM < 0 ? "down" : undefined}
                />
              </div>
              <TrendBars months={metrics.months.map((m) => ({ index: m.index, label: m.label, value: m.recognized }))} />
            </section>

            {/* ── Márgenes ── */}
            <section className="axr-report__block">
              <h3>
                Márgenes
                <em data-alert={k.grossMarginPct < 60 ? "" : undefined}>
                  bruto {formatPct(k.grossMarginPct, 0)} · EBITDA {formatPct(k.ebitdaMarginPct, 0)}
                </em>
              </h3>
              <MiniBars
                rows={[
                  { key: "rev", label: "Ingresos", meta: "100 %", value: metrics.totalRevenue, color: "#161616" },
                  {
                    key: "bruto",
                    label: "Margen bruto",
                    meta: formatPct(k.grossMarginPct, 0),
                    value: k.grossProfit,
                    color: CAT.pasarela,
                  },
                  {
                    key: "ebitda",
                    label: "EBITDA",
                    meta: formatPct(k.ebitdaMarginPct, 0),
                    value: k.ebitda,
                    color: CAT.captacion,
                  },
                  {
                    key: "neto",
                    label: "Beneficio neto",
                    meta: formatPct(metrics.netMarginPct, 0),
                    value: metrics.netProfit,
                    color: "#038632",
                  },
                ]}
              />
            </section>

            {/* ── Unidad ── */}
            <section className="axr-report__block">
              <h3>
                Por alumno
                <em>CAC con ventas dentro</em>
              </h3>
              <div className="axr-report__grid6">
                <Tile label="CAC" value={formatEUR(k.cacLoaded, 0)} />
                <Tile
                  label="Payback"
                  value={k.paybackMonths == null ? "nunca" : `${formatMonths(k.paybackMonths)} m`}
                  tone={k.paybackMonths == null ? "down" : k.paybackMonths <= 12 ? "up" : k.paybackMonths > 18 ? "down" : undefined}
                />
                <Tile label="LTV bruto" value={formatEUR(k.ltvGross)} />
                <Tile
                  label="LTV : CAC"
                  value={formatRatio(k.ltvCacLoaded)}
                  tone={k.ltvCacLoaded >= 3 ? "up" : k.ltvCacLoaded < 2 ? "down" : undefined}
                />
                <Tile label="Recompra" value={formatPct(k.repurchasePct, 0)} />
                <Tile
                  label="Finalización"
                  value={formatPct(k.completionPct, 0)}
                  tone={k.completionPct >= 70 ? "up" : k.completionPct < 50 ? "down" : undefined}
                />
              </div>
            </section>

            {/* ── Caja ── */}
            <section className="axr-report__block">
              <h3>
                Caja y runway
                <em>
                  {k.runwayMonths == null
                    ? "no quema"
                    : `${formatMonths(k.runwayMonths, 0)} meses de vida`}
                </em>
              </h3>
              <div className="axr-report__trio" style={{ marginTop: 0 }}>
                <Tile label="Caja hoy" value={formatEUR(k.cashOnHand)} />
                <Tile
                  label="Suelo del año"
                  value={formatEUR(k.cashTrough)}
                  tone={k.cashTrough < 0 ? "down" : k.cashTrough > k.cashOnHand * 0.5 ? "up" : undefined}
                />
                <Tile
                  label="Runway"
                  value={k.runwayMonths == null ? "—" : `${formatMonths(k.runwayMonths, 0)} m`}
                  tone={k.runwayMonths == null ? "up" : k.runwayMonths >= 12 ? "up" : k.runwayMonths < 6 ? "down" : undefined}
                />
              </div>
              <CashLine
                months={metrics.months.map((m) => ({ index: m.index, label: m.label, cash: m.cash }))}
                cashOnHand={k.cashOnHand}
              />
              <p className="axr-report__note" data-alert={k.runsOutMonth !== null ? "" : undefined}>
                {k.runsOutMonth !== null
                  ? `La caja se queda en negativo en ${MONTH_NAMES[k.runsOutMonth]}. Eso no es un KPI: es la fecha.`
                  : `El punto más bajo del año es ${formatEUR(k.cashTrough)}, en ${MONTH_NAMES[k.cashTroughMonth]}.`}
              </p>
            </section>

            <details className="axr-report__aviso">
              <summary>Cómo está calculado cada uno</summary>
              <p>
                <strong>MRR / ARR</strong>: aquí no hay suscripción, es facturación devengada — el curso repartido
                por los meses en que se da, no el día que se cobra. Lo cobrado por adelantado y aún sin entregar es
                el ingreso diferido.
              </p>
              <p>
                <strong>Margen bruto</strong>: descuenta sólo lo que cuesta ENTREGAR (docencia, coste por alumno,
                pasarela). Ni marketing, ni ventas, ni estructura. Por debajo del 60 % no vendes producto digital:
                vendes horas. Un edtech online sano está entre el 70 % y el 85 %.
              </p>
              <p>
                <strong>CAC</strong>: marketing <em>y</em> ventas entre los alumnos nuevos. El{" "}
                <strong>payback</strong> se mide contra el margen bruto que deja el alumno mientras paga: sano por
                debajo de 12 meses, preocupante por encima de 18. <strong>LTV</strong> a margen bruto, con la
                recompra dentro; <strong>LTV : CAC</strong> mínimo 3×, y por debajo de 2× el negocio no escala,
                compra ingresos.
              </p>
              <p>
                <strong>Runway</strong>: caja disponible entre la quema media de los meses que cierran en negativo.
                Si el año no quema, no hay runway que contar. La amortización no resta caja; los gastos
                financieros, sí.
              </p>
            </details>
          </div>
        </aside>
      </div>

    </div>
  );
}

// ── Piezas de formulario ──────────────────────────────────

/**
 * Una cifra del informe.
 *
 * Sin caja, sin icono y sin botón de ayuda: el informe entero tiene que caber
 * en una pantalla, y cuatro tarjetas con borde y relleno se comen esa
 * pantalla ellas solas. La explicación de cada métrica sigue estando, en el
 * `title` del elemento.
 */
function Tile({
  label,
  value,
  tone,
  big,
  metricKey,
}: {
  label: string;
  value: string;
  tone?: "up" | "down";
  big?: boolean;
  /** Qué métrica es, para poder explicarla al pasar por encima. */
  metricKey?: keyof typeof METRIC_INFO;
}) {
  const info = metricKey ? METRIC_INFO[metricKey] : undefined;
  return (
    <div
      className="axr-report__tile"
      data-tone={tone}
      data-big={big ? "" : undefined}
      title={info ? `${info.label}. ${info.explanation} Cálculo: ${info.formula}.` : undefined}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/**
 * Un bloque de configuración, plegado por defecto.
 *
 * La lista entera son nueve bloques: desplegados son cuatro pantallas de
 * móvil de scroll para cambiar un número. Plegados caben todos a la vez, y
 * cada uno enseña en su cabecera el dato que resume lo que hay dentro —25
 * alumnos, 4.560 €, 100 %—, así que se ve el escenario completo sin abrir
 * nada y se abre sólo lo que se va a tocar.
 *
 * <details> nativo a propósito: el teclado, el buscador del navegador y los
 * lectores de pantalla ya saben qué es esto. Un acordeón hecho a mano habría
 * que enseñárselo a los tres.
 */
function Section({
  title,
  hint,
  badge,
  open,
  children,
}: {
  title: string;
  hint?: string;
  /** Lo que resume el bloque, visible con el bloque cerrado. */
  badge?: React.ReactNode;
  open?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details className="axr-calc__section" open={open}>
      <summary>
        <h2>{title}</h2>
        {badge ? <span className="axr-calc__badge">{badge}</span> : null}
      </summary>
      {hint ? <p className="axr-calc__section-hint">{hint}</p> : null}
      {children}
    </details>
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
