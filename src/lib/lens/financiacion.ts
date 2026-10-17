// Equity o revenue-based financing: cuál sale más caro.
//
// La pregunta llega siempre igual —«me ofrecen X por un % o devolver Y poco a
// poco»— y casi nadie hace la cuenta entera. El RBF parece caro porque el
// recargo se ve en la oferta; el equity parece gratis porque no sale de la
// cuenta del banco. Las dos cosas son ciertas el día que se firma y falsas el
// día que se vende la empresa. Esto pone las dos en euros, en el mismo sitio.
//
// La facturación sale de la previsión del escenario —lo COBRADO mes a mes,
// que es lo que un RBF se lleva— y no de un MRR inventado aparte. Para
// comparar con una oferta que llega con otros números, se puede pasar a un
// MRR a mano con su crecimiento.

import type { LensMonth } from "@/lib/lens/calculadora";

export type LensFunding = {
  /** Lo que se necesita levantar. */
  amount: number;
  /** De dónde sale la facturación que devuelve el RBF. */
  revenueSource: "forecast" | "manual";
  /** Sólo con revenueSource "manual": facturación mensual de partida. */
  manualMrr: number;
  /** Sólo con revenueSource "manual": crecimiento mensual, en %. */
  manualGrowthPct: number;
  /** Cuánto se devuelve por cada euro recibido. 1,3 = un 30 % de recargo. */
  rbfMultiple: number;
  /** % de la facturación de cada mes que se va a devolver el RBF. */
  rbfSharePct: number;
  /** Valoración antes de entrar el dinero. */
  preMoney: number;
  /** A cuánto se vendería la empresa: es lo que decide lo que cuesta el equity. */
  exitValue: number;
};

export function defaultFunding(): LensFunding {
  return {
    amount: 150000,
    revenueSource: "forecast",
    manualMrr: 15000,
    manualGrowthPct: 4,
    rbfMultiple: 1.3,
    rbfSharePct: 12,
    preMoney: 2000000,
    exitValue: 5000000,
  };
}

/** Más de 20 años devolviendo ya no es una financiación, es una renta. */
const MAX_MONTHS = 240;

export type LensFundingResult = {
  /**
   * Facturación mensual de referencia. Con la previsión es la MEDIA del año:
   * lo cobrado va a saltos según cuándo arranca cada convocatoria, y el mes
   * de enero no representa nada.
   */
  baseMonthlyRevenue: number;

  rbfTotal: number;
  rbfSurcharge: number;
  rbfSurchargePct: number;
  /** null = con esa facturación no se devuelve nunca (o tarda más de 20 años). */
  rbfMonths: number | null;
  /** TIR anualizada de lo que se recibe frente a lo que se devuelve. */
  rbfAnnualCostPct: number | null;
  /** Lo que se paga el primer año: lo que de verdad aprieta la caja. */
  rbfFirstYearPayments: number;

  /** % de la empresa que se cede. */
  equityStakePct: number;
  postMoney: number;
  /** Lo que vale ese % el día de la salida. */
  equityCostAtExit: number;

  /** Valor de salida a partir del cual el equity sale más caro que el RBF. */
  crossoverExit: number | null;
  /** Cuál cuesta menos con el valor de salida introducido. */
  cheaper: "rbf" | "equity" | "tie";

  /** Cuánto se tarda en devolver con la facturación plana, a tres porcentajes. */
  flatScenarios: { sharePct: number; months: number | null }[];
};

/**
 * La serie de facturación mes a mes durante MAX_MONTHS.
 *
 * Con la previsión, el año del escenario se repite tal cual: es la misma
 * hipótesis que usa el resto de la calculadora (cada convocatoria igual a la
 * configurada) y no se le añade un crecimiento que nadie ha escrito.
 */
export function revenueSeries(f: LensFunding, months: LensMonth[]): number[] {
  const out: number[] = [];
  if (f.revenueSource === "manual") {
    const g = 1 + (f.manualGrowthPct || 0) / 100;
    let r = Math.max(0, f.manualMrr || 0);
    for (let i = 0; i < MAX_MONTHS; i++) {
      out.push(r);
      r *= g;
    }
    return out;
  }
  const year = months.map((m) => Math.max(0, m.revenue || 0));
  if (year.length === 0) return out;
  for (let i = 0; i < MAX_MONTHS; i++) out.push(year[i % year.length]);
  return out;
}

/** Calendario de pagos del RBF: el % de cada mes hasta completar el total. */
function rbfSchedule(series: number[], sharePct: number, total: number): number[] {
  const share = Math.max(0, sharePct) / 100;
  const payments: number[] = [];
  let left = total;
  for (const rev of series) {
    if (left <= 0.005) break;
    const p = Math.min(left, rev * share);
    payments.push(p);
    left -= p;
  }
  return left <= 0.005 ? payments : [];
}

function monthsToRepay(series: number[], sharePct: number, total: number): number | null {
  const s = rbfSchedule(series, sharePct, total);
  return s.length ? s.length : null;
}

/**
 * TIR mensual por bisección: se recibe `amount` hoy y se devuelve un pago al
 * cierre de cada mes. Bisección y no Newton porque la función es monótona en
 * este caso y así no hay forma de que diverja con un calendario raro.
 */
function monthlyIrr(amount: number, payments: number[]): number | null {
  if (!payments.length || amount <= 0) return null;
  const npv = (r: number) => payments.reduce((acc, p, i) => acc + p / Math.pow(1 + r, i + 1), 0) - amount;
  let lo = -0.99;
  let hi = 1;
  if (npv(lo) < 0 || npv(hi) > 0) return null;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function computeFunding(f: LensFunding, months: LensMonth[]): LensFundingResult {
  const amount = Math.max(0, f.amount || 0);
  const series = revenueSeries(f, months);

  const rbfTotal = amount * Math.max(0, f.rbfMultiple || 0);
  const rbfSurcharge = rbfTotal - amount;
  const payments = rbfSchedule(series, f.rbfSharePct, rbfTotal);
  const irr = monthlyIrr(amount, payments);

  const postMoney = Math.max(0, f.preMoney || 0) + amount;
  const stake = postMoney > 0 ? amount / postMoney : 0;
  const equityCostAtExit = stake * Math.max(0, f.exitValue || 0);
  const crossoverExit = stake > 0 ? rbfTotal / stake : null;

  // Con la facturación plana: el primer mes, sin crecimiento. Es la prueba de
  // estrés que importa, porque un RBF se firma pensando en crecer y se paga
  // con lo que entra de verdad.
  const flatBase = f.revenueSource === "manual" ? Math.max(0, f.manualMrr || 0) : average(series.slice(0, 12));
  const flat = Array.from({ length: MAX_MONTHS }, () => flatBase);
  const mid = Math.max(0, f.rbfSharePct || 0);
  const shares = [Math.max(1, mid - 4), mid, mid + 4];

  return {
    baseMonthlyRevenue: flatBase,
    rbfTotal,
    rbfSurcharge,
    rbfSurchargePct: amount > 0 ? (rbfSurcharge / amount) * 100 : 0,
    rbfMonths: payments.length ? payments.length : null,
    rbfAnnualCostPct: irr === null ? null : (Math.pow(1 + irr, 12) - 1) * 100,
    rbfFirstYearPayments: payments.slice(0, 12).reduce((a, b) => a + b, 0),
    equityStakePct: stake * 100,
    postMoney,
    equityCostAtExit,
    crossoverExit,
    cheaper:
      Math.abs(equityCostAtExit - rbfTotal) < 1 ? "tie" : equityCostAtExit > rbfTotal ? "rbf" : "equity",
    flatScenarios: shares.map((s) => ({ sharePct: s, months: monthsToRepay(flat, s, rbfTotal) })),
  };
}

function average(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
