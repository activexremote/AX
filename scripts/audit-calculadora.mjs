// Auditoría de la calculadora de Lens.
//
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs scripts/audit-calculadora.mjs
//
// Comprueba invariantes, no resultados concretos: que el EBITDA sea ingresos
// menos gastos de explotación, que los doce meses sumen exactamente el año,
// que en el punto de equilibrio el beneficio sea cero, que el reparto entre
// socios sume la bolsa. Si una fórmula se toca y deja de cuadrar, esto lo
// dice; una captura de pantalla, no.
//
// Se pasa sobre cuatro escenarios a propósito —el normal, uno declarado en
// meses, otro con impuestos y amortización y otro con las convocatorias
// solapadas—, porque los tres fallos que encontró la primera vez sólo se
// veían en alguno de ellos.
import { defaultLensScenario, computeLensMetrics, effectivePeriodMonths, convocatoriaMonths } from "@/lib/lens/calculadora.ts";

const E = 0.51; // tolerancia en euros
let fallos = 0;
const ok = (nombre, a, b, tol = E) => {
  const bien = Math.abs(a - b) <= tol;
  if (!bien) fallos++;
  console.log(`${bien ? "OK  " : "FALLA"} ${nombre}: ${a.toFixed(2)} vs ${b.toFixed(2)} (dif ${(a - b).toFixed(2)})`);
};

function auditar(nombre, d) {
  console.log(`\n═══ ${nombre} ═══`);
  const m = computeLensMetrics(d);
  const k = m.kpis;

  // 1. Cuenta de resultados
  const mixSum = d.plans.reduce((s, p) => s + p.mix, 0);
  const ticket = d.plans.reduce((s, p) => s + p.price * (p.mix / mixSum), 0);
  ok("ticket medio", m.avgTicket, ticket);
  ok("ingresos", m.totalRevenue, ticket * m.totalStudents);
  ok("pasarela", m.gatewayFees, m.totalRevenue * d.gatewayFeePct / 100);
  ok("variables", m.variableCostsTotal, d.variableCostPerStudent * m.totalStudents);
  ok("docencia/convocatoria", m.teachingCostPerConvocatoria, d.teachers.reduce((s,t)=>s+t.hours*t.hourlyRate,0));
  ok("docencia/periodo", m.teachingCostTotal, m.teachingCostPerConvocatoria * (effectivePeriodMonths(d)/convocatoriaMonths(d)));
  ok("comercial", m.salesCostTotal, d.salesTeam.reps*d.salesTeam.salaryPerRep + d.salesTeam.bonusPerEnrollment*m.totalStudents);
  ok("opex", m.opex, m.totalMarketingSpend+m.variableCostsTotal+m.gatewayFees+m.totalFixedCosts+m.teachingCostTotal+m.salesCostTotal);
  ok("EBITDA", m.ebitda, m.totalRevenue - m.opex);
  ok("EBIT", m.ebit, m.ebitda - d.amortizationPerPeriod);
  ok("BAI", m.profitBeforeTax, m.ebit - d.financialCostsPerPeriod);
  ok("impuesto", m.corporateTax, m.profitBeforeTax > 0 ? m.profitBeforeTax*d.corporateTaxPct/100 : 0);
  ok("neto", m.netProfit, m.profitBeforeTax - m.corporateTax);
  ok("costes totales", m.totalCosts, m.totalRevenue - m.profitBeforeTax);

  // 2. Punto de equilibrio: con esos alumnos el beneficio operativo es 0
  if (m.breakEvenStudents != null) {
    const be = m.breakEvenStudents;
    const ingresos = ticket * be;
    const costes = m.totalMarketingSpend + d.variableCostPerStudent*be + ingresos*d.gatewayFeePct/100
      + m.totalFixedCosts + m.teachingCostTotal + d.salesTeam.reps*d.salesTeam.salaryPerRep + d.salesTeam.bonusPerEnrollment*be;
    ok("equilibrio deja beneficio 0", ingresos - costes, 0, 1);
  }

  // 3. Los doce meses suman el año
  const sumaCobros = m.months.reduce((a,x)=>a+x.revenue,0);
  const sumaCostes = m.months.reduce((a,x)=>a+x.costs,0);
  const sumaDeveng = m.months.reduce((a,x)=>a+x.recognized,0);
  ok("Σ cobros = facturación anual", sumaCobros, m.annual.revenue, 1);
  ok("Σ devengado = ARR", sumaDeveng, k.arr, 1);
  // Los meses son CAJA: sin impuestos ni amortización. El beneficio anual es
  // contable. La diferencia entre los dos tiene que ser exactamente eso.
  ok("Σ flujos = EBITDA anual - financieros", sumaCobros - sumaCostes,
     m.annual.ebitda - (d.financialCostsPerPeriod * m.annual.timeFactor), 1);
  ok("neto anual = EBITDA - amort/fin - impuesto", m.annual.netProfit,
     m.annual.ebitda - m.annual.belowEbitda - m.annual.tax, 1);
  ok("caja dic = inicial + Σ flujos", m.months[11].cash, (d.cashOnHand - d.initialInvestment) + (sumaCobros - sumaCostes), 1);

  // 4. Dividendos
  const p = m.dividendPlan;
  ok("suma repartos = bolsa", p.partners.reduce((a,x)=>a+x.perPayout,0), p.poolPerPayout * (p.sharesSum/100), 1);
  ok("bolsa + reservas = beneficio ventana", p.poolPerPayout + p.retainedPerPayout, p.profitInWindow, 1);
  ok("anual = reparto × repartos", p.poolPerYear, p.poolPerPayout * p.payoutsPerYear, 1);

  // 5. KPIs
  ok("margen bruto", k.grossProfit, m.totalRevenue - (m.teachingCostTotal + m.variableCostsTotal + m.gatewayFees));
  ok("CAC cargado", k.cacLoaded, (m.totalMarketingSpend + m.salesCostTotal)/m.totalStudents);
  ok("LTV bruto", k.ltvGross, (k.grossProfit/m.totalStudents)*(1+d.repeatPurchaseRate/100));
  ok("LTV:CAC", k.ltvCacLoaded, k.ltvGross/k.cacLoaded, 0.01);
  ok("MRR×12 = ARR", k.mrr*12, k.arr, 1);
  return m;
}

auditar("por defecto (convocatoria, 5 al año)", defaultLensScenario());

const enMeses = { ...defaultLensScenario(), periodMode: "months", periodMonths: 1 };
auditar("declarado en meses", enMeses);

const conTodo = { ...defaultLensScenario(), corporateTaxPct: 25, amortizationPerPeriod: 800, financialCostsPerPeriod: 200 };
auditar("con impuestos, amortización y financieros", conTodo);

const solapado = { ...defaultLensScenario(), calendar: { firstStartDay: 10, startEveryDays: 30, marketingLeadDays: 45 } };
auditar("convocatorias solapadas cada 30 días", solapado);

console.log(`\n${fallos === 0 ? "TODO CUADRA" : fallos + " COMPROBACIONES FALLAN"}`);
