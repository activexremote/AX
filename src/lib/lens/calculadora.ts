// Motor de cálculo de la calculadora de matrículas de Lens.
//
// Todo en euros (no céntimos, a diferencia de `stripe/catalog.ts`): esto no
// cobra a nadie, es una hoja de cálculo para pensar en voz alta, así que
// prima que sea fácil de teclear ("2400") sobre la precisión de céntimos.

export type LensPlan = { id: string; name: string; price: number; mix: number };
export type LensChannel = { id: string; name: string; spend: number; students: number };
export type LensFixedCost = { id: string; name: string; amount: number };
export type LensPartner = { id: string; name: string; sharePct: number };

/**
 * Equipo comercial.
 *
 * Se separa de los costes fijos genéricos porque tiene dos mitades que se
 * comportan distinto: el sueldo se paga entren los alumnos que entren, y el
 * variable sólo si se cierra la matrícula. Esa segunda mitad hay que meterla
 * en el margen de contribución, o el punto de equilibrio sale optimista.
 */
export type LensSalesTeam = {
  /** Número de comerciales en nómina. */
  reps: number;
  /** Sueldo fijo por comercial y periodo. */
  salaryPerRep: number;
  /** Pago adicional por cada matrícula cerrada. */
  bonusPerEnrollment: number;
};

/**
 * Reparto de dividendos.
 *
 * Dos condiciones y una cadencia: se reparte un % del beneficio, sólo si la
 * facturación de la ventana de reparto llega al umbral, y cada tantos meses.
 * El resto se queda en la empresa.
 */
export type LensDividends = {
  enabled: boolean;
  /** % del beneficio (después de impuestos) que se reparte. */
  payoutPct: number;
  /** Facturación mínima de la ventana de reparto para que haya reparto. */
  revenueThreshold: number;
  /** Cada cuántos meses se reparte: 1, 3, 6 o 12. */
  everyMonths: number;
};

export type LensScenarioData = {
  plans: LensPlan[];
  channels: LensChannel[];
  fixedCosts: LensFixedCost[];
  /** Coste variable por alumno matriculado: soporte, materiales, certificado… */
  variableCostPerStudent: number;
  /** Comisión de la pasarela de pago (Stripe ≈ 1.5–2.9 % + fijo), en % sobre el ingreso. */
  gatewayFeePct: number;
  /** % de alumnos que además compra un upsell (otro curso, mentoría, etc.). */
  repeatPurchaseRate: number;
  /** Valor medio de ese upsell. */
  upsellValue: number;
  /**
   * Cuántos meses representan los números de este escenario.
   *
   * Sin esto no se puede hablar de "cada cuánto se reparte": un escenario de
   * 25 alumnos no dice por sí solo si son de un mes o de una convocatoria de
   * cuatro, y un dividendo trimestral significa una cosa muy distinta en cada
   * caso.
   */
  periodMonths: number;
  salesTeam: LensSalesTeam;
  /** Impuesto de sociedades, en %. A 0 el escenario se comporta como antes. */
  corporateTaxPct: number;
  dividends: LensDividends;
  /** Socios y su participación. Debería sumar 100 %. */
  partners: LensPartner[];
};

/** Escenario de partida con los precios reales del programa (ver `lib/stripe/catalog.ts`). */
export function defaultLensScenario(): LensScenarioData {
  return {
    plans: [
      { id: "unico", name: "Pago único", price: 2400, mix: 40 },
      { id: "anticipada", name: "Matrícula anticipada", price: 2100, mix: 35 },
      { id: "plazos", name: "Pago a plazos (3×)", price: 2400, mix: 25 },
    ],
    channels: [
      { id: "meta", name: "Meta Ads", spend: 3000, students: 12 },
      { id: "google", name: "Google Ads", spend: 2000, students: 7 },
      { id: "organico", name: "Orgánico / referidos", spend: 500, students: 6 },
    ],
    fixedCosts: [
      { id: "docencia", name: "Equipo docente", amount: 4000 },
      { id: "herramientas", name: "Herramientas y software", amount: 300 },
      { id: "soporte", name: "Soporte y comunidad", amount: 600 },
    ],
    variableCostPerStudent: 40,
    gatewayFeePct: 1.9,
    repeatPurchaseRate: 15,
    upsellValue: 300,
    periodMonths: 1,
    salesTeam: { reps: 1, salaryPerRep: 1800, bonusPerEnrollment: 150 },
    corporateTaxPct: 0,
    dividends: { enabled: true, payoutPct: 60, revenueThreshold: 60000, everyMonths: 3 },
    partners: [
      { id: "socio-1", name: "Socio 1", sharePct: 50 },
      { id: "socio-2", name: "Socio 2", sharePct: 50 },
    ],
  };
}

/**
 * Rellena lo que falte de un escenario guardado.
 *
 * Los escenarios viven en una columna `jsonb`, así que los que se guardaron
 * antes de existir los dividendos siguen ahí tal cual, sin esos campos. Sin
 * esto, abrir uno viejo reventaría al leer `data.salesTeam.reps`.
 */
export function normalizeScenario(raw: Partial<LensScenarioData> | null | undefined): LensScenarioData {
  const base = defaultLensScenario();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    plans: raw.plans ?? base.plans,
    channels: raw.channels ?? base.channels,
    fixedCosts: raw.fixedCosts ?? base.fixedCosts,
    periodMonths: raw.periodMonths ?? base.periodMonths,
    salesTeam: { ...base.salesTeam, ...(raw.salesTeam ?? {}) },
    corporateTaxPct: raw.corporateTaxPct ?? 0,
    // Un escenario guardado antes de que existiera el reparto NO empieza a
    // repartir solo al abrirlo: sale con el reparto apagado y con dos socios
    // de ejemplo listos para editar. Encenderlo es una decisión, y tiene que
    // tomarla alguien, no una migración silenciosa.
    dividends: raw.dividends
      ? { ...base.dividends, ...raw.dividends }
      : { ...base.dividends, enabled: false },
    partners: raw.partners ?? base.partners,
  };
}

export type LensChannelStats = LensChannel & { cac: number; share: number };

export type LensPartnerPayout = {
  id: string;
  name: string;
  sharePct: number;
  /** Lo que se lleva en cada reparto. */
  perPayout: number;
  /** Lo que se lleva en un año, si el escenario se repite igual. */
  perYear: number;
};

export type LensDividendPlan = {
  enabled: boolean;
  /** Meses que cubre cada reparto. */
  windowMonths: number;
  payoutsPerYear: number;
  /** Facturación acumulada en esa ventana. */
  revenueInWindow: number;
  threshold: number;
  thresholdMet: boolean;
  /** Beneficio (ya con impuestos descontados) acumulado en la ventana. */
  profitInWindow: number;
  /** Bolsa a repartir en cada reparto. */
  poolPerPayout: number;
  poolPerYear: number;
  /** Lo que se queda en la empresa en cada ventana. */
  retainedPerPayout: number;
  partners: LensPartnerPayout[];
  /** Suma de participaciones. Debería ser 100. */
  sharesSum: number;
  /** Por qué no se reparte, cuando no se reparte. */
  blockedReason: "disabled" | "below-threshold" | "no-profit" | null;
};

export type LensMetrics = {
  totalStudents: number;
  totalMarketingSpend: number;
  avgTicket: number;
  totalRevenue: number;
  cac: number;
  ltv: number;
  ltvCacRatio: number;
  roas: number;
  gatewayFees: number;
  variableCostsTotal: number;
  totalFixedCosts: number;
  /** Sueldos del equipo comercial: reps × sueldo. */
  salesFixedTotal: number;
  /** Variable comercial: pago por matrícula × alumnos. */
  salesBonusTotal: number;
  salesCostTotal: number;
  totalCosts: number;
  /** Beneficio antes de impuestos. */
  profitBeforeTax: number;
  corporateTax: number;
  netProfit: number;
  netMarginPct: number;
  contributionPerStudent: number;
  /** null = con este margen por alumno los costes fijos no se cubren nunca, sea cual sea el volumen. */
  breakEvenStudents: number | null;
  channelStats: LensChannelStats[];
  dividendPlan: LensDividendPlan;
};

export function computeLensMetrics(data: LensScenarioData): LensMetrics {
  const totalStudents = data.channels.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalMarketingSpend = data.channels.reduce((sum, c) => sum + (c.spend || 0), 0);

  const mixSum = data.plans.reduce((sum, p) => sum + (p.mix || 0), 0);
  const avgTicket =
    mixSum > 0 ? data.plans.reduce((sum, p) => sum + p.price * ((p.mix || 0) / mixSum), 0) : 0;

  const totalRevenue = avgTicket * totalStudents;
  const cac = totalStudents > 0 ? totalMarketingSpend / totalStudents : 0;
  const ltv = avgTicket + (data.repeatPurchaseRate / 100) * data.upsellValue;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;
  const roas = totalMarketingSpend > 0 ? totalRevenue / totalMarketingSpend : 0;

  const gatewayFees = totalRevenue * (data.gatewayFeePct / 100);
  const variableCostsTotal = data.variableCostPerStudent * totalStudents;
  const totalFixedCosts = data.fixedCosts.reduce((sum, c) => sum + (c.amount || 0), 0);

  // El equipo comercial, partido en sus dos mitades: la que se paga pase lo
  // que pase y la que sólo se paga si se cierra la matrícula.
  const salesFixedTotal = (data.salesTeam.reps || 0) * (data.salesTeam.salaryPerRep || 0);
  const salesBonusTotal = (data.salesTeam.bonusPerEnrollment || 0) * totalStudents;
  const salesCostTotal = salesFixedTotal + salesBonusTotal;

  const totalCosts =
    totalMarketingSpend + variableCostsTotal + gatewayFees + totalFixedCosts + salesCostTotal;

  const profitBeforeTax = totalRevenue - totalCosts;
  // Sobre pérdidas no se paga impuesto: con BAI negativo la cuota es 0, no un
  // ingreso ficticio que maquillaría el resultado.
  const corporateTax = profitBeforeTax > 0 ? profitBeforeTax * ((data.corporateTaxPct || 0) / 100) : 0;
  const netProfit = profitBeforeTax - corporateTax;
  const netMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // El variable comercial entra aquí: es coste por alumno, y dejarlo fuera
  // hacía que el punto de equilibrio saliera más bajo de lo que es.
  const contributionPerStudent =
    avgTicket -
    data.variableCostPerStudent -
    (data.salesTeam.bonusPerEnrollment || 0) -
    avgTicket * (data.gatewayFeePct / 100);
  const breakEvenStudents =
    contributionPerStudent > 0
      ? (totalFixedCosts + salesFixedTotal + totalMarketingSpend) / contributionPerStudent
      : null;

  const channelStats: LensChannelStats[] = data.channels.map((c) => ({
    ...c,
    cac: c.students > 0 ? c.spend / c.students : 0,
    share: totalStudents > 0 ? c.students / totalStudents : 0,
  }));

  const dividendPlan = computeDividendPlan(data, totalRevenue, netProfit);

  return {
    totalStudents,
    totalMarketingSpend,
    avgTicket,
    totalRevenue,
    cac,
    ltv,
    ltvCacRatio,
    roas,
    gatewayFees,
    variableCostsTotal,
    totalFixedCosts,
    salesFixedTotal,
    salesBonusTotal,
    salesCostTotal,
    totalCosts,
    profitBeforeTax,
    corporateTax,
    netProfit,
    netMarginPct,
    contributionPerStudent,
    breakEvenStudents,
    channelStats,
    dividendPlan,
  };
}

/**
 * Reparto de dividendos.
 *
 * Todo se lleva a la ventana de reparto: si el escenario es de un mes y se
 * reparte cada trimestre, se compara con tres meses de facturación y se
 * reparte sobre tres meses de beneficio. Comparar un umbral trimestral con la
 * facturación de un mes es el error fácil aquí, y da repartos que no existen.
 */
function computeDividendPlan(
  data: LensScenarioData,
  totalRevenue: number,
  netProfit: number,
): LensDividendPlan {
  const periodMonths = Math.max(1, data.periodMonths || 1);
  const windowMonths = Math.max(1, data.dividends?.everyMonths || 1);
  const factor = windowMonths / periodMonths;

  const revenueInWindow = totalRevenue * factor;
  const profitInWindow = netProfit * factor;
  const threshold = data.dividends?.revenueThreshold || 0;
  const thresholdMet = revenueInWindow >= threshold;

  let blockedReason: LensDividendPlan["blockedReason"] = null;
  if (!data.dividends?.enabled) blockedReason = "disabled";
  else if (!thresholdMet) blockedReason = "below-threshold";
  else if (profitInWindow <= 0) blockedReason = "no-profit";

  const poolPerPayout = blockedReason ? 0 : profitInWindow * ((data.dividends.payoutPct || 0) / 100);
  const payoutsPerYear = 12 / windowMonths;

  const partners = data.partners ?? [];
  const sharesSum = partners.reduce((sum, p) => sum + (p.sharePct || 0), 0);

  return {
    enabled: Boolean(data.dividends?.enabled),
    windowMonths,
    payoutsPerYear,
    revenueInWindow,
    threshold,
    thresholdMet,
    profitInWindow,
    poolPerPayout,
    poolPerYear: poolPerPayout * payoutsPerYear,
    retainedPerPayout: profitInWindow - poolPerPayout,
    sharesSum,
    partners: partners.map((p) => {
      // Se reparte según lo declarado, no según lo que "debería" sumar: si
      // los porcentajes suman 90, se reparte el 90 % y el 10 % restante se
      // ve que falta. Repartir el sobrante en secreto escondería el error.
      const perPayout = poolPerPayout * ((p.sharePct || 0) / 100);
      return {
        id: p.id,
        name: p.name,
        sharePct: p.sharePct || 0,
        perPayout,
        perYear: perPayout * payoutsPerYear,
      };
    }),
    blockedReason,
  };
}

/** Cada cuánto se reparte, dicho en cristiano. */
export function payoutCadenceLabel(everyMonths: number): string {
  if (everyMonths === 1) return "cada mes";
  if (everyMonths === 3) return "cada trimestre";
  if (everyMonths === 6) return "cada semestre";
  if (everyMonths === 12) return "cada año";
  return `cada ${everyMonths} meses`;
}

/** Qué representan los números del escenario. */
export function periodLabel(periodMonths: number): string {
  if (periodMonths === 1) return "1 mes";
  if (periodMonths === 3) return "1 trimestre";
  if (periodMonths === 6) return "1 semestre";
  if (periodMonths === 12) return "1 año";
  return `${periodMonths} meses`;
}

export function formatEUR(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
    maximumFractionDigits,
  }).format(value);
}

export function formatPct(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits }).format(value) + " %";
}

export function formatRatio(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits }).format(value) + "×";
}

/**
 * Nombre automático del escenario.
 *
 * Nomenclatura fija: fecha, volumen y un nombre genérico, más la palabra
 * clave que se escriba a mano. Así una lista de treinta escenarios se ordena
 * y se busca sola —por fecha, por volumen o por la palabra— en vez de
 * convertirse en treinta "Escenario base (2)".
 *
 *   2026-08-23 · 25 alumnos · Escenario · agresivo
 */
export function buildScenarioName(students: number, keyword: string, date = new Date()): string {
  const iso = date.toISOString().slice(0, 10);
  const alumnos = `${students} ${students === 1 ? "alumno" : "alumnos"}`;
  const partes = [iso, alumnos, "Escenario"];
  const clave = keyword.trim();
  if (clave) partes.push(clave);
  return partes.join(" · ");
}

/**
 * El aviso que acompaña a la calculadora y encabeza el PDF.
 *
 * Va en una constante y no suelto en la plantilla porque tiene que decir
 * exactamente lo mismo en la pantalla y en el papel: en cuanto un PDF sale
 * del edificio, deja de estar claro quién lo lee ni con qué idea.
 */
export const LENS_DISCLAIMER =
  "Este documento es un cuadro de mandos para lanzar hipótesis, no un documento contable. " +
  "Todas las cifras son proyecciones a partir de los supuestos que se han introducido a mano " +
  "(precios, mezcla de planes, captación, costes, impuestos y reparto), no resultados reales ni " +
  "cerrados. No sustituye a la contabilidad de la empresa, ni a las cuentas anuales, ni a un " +
  "informe de auditoría, y no es asesoramiento fiscal, contable ni de inversión. Cambiar un " +
  "supuesto cambia el resultado: úsese para comparar escenarios y tomar decisiones, nunca como " +
  "prueba de un resultado.";

/** Explicaciones en lenguaje llano de cada métrica, para el icono (i) de cada tarjeta. */
export const METRIC_INFO: Record<string, { label: string; formula: string; explanation: string }> = {
  totalStudents: {
    label: "Alumnos matriculados",
    formula: "Suma de los alumnos aportados por cada canal de captación",
    explanation: "El volumen total sobre el que se calcula todo lo demás: ingresos, costes y márgenes.",
  },
  totalMarketingSpend: {
    label: "Inversión en captación",
    formula: "Suma de la inversión de todos los canales",
    explanation: "Todo el presupuesto de marketing destinado a conseguir alumnos, sumando cada canal.",
  },
  totalRevenue: {
    label: "Ingresos totales",
    formula: "Ticket medio × alumnos matriculados",
    explanation: "Todo el dinero que entra por matrículas, sumando los tres planes de pago.",
  },
  netProfit: {
    label: "Beneficio neto",
    formula: "Ingresos − marketing − costes variables − comisión de pago − costes fijos",
    explanation: "Lo que queda para el negocio después de pagar captación, entrega del curso y estructura.",
  },
  netMarginPct: {
    label: "Margen neto",
    formula: "Beneficio neto ÷ ingresos",
    explanation: "Qué porcentaje de cada euro cobrado se convierte en beneficio.",
  },
  cac: {
    label: "CAC (coste de adquisición)",
    formula: "Inversión total en captación ÷ alumnos matriculados",
    explanation:
      "Cuánto cuesta conseguir un alumno matriculado, de media entre todos los canales. Cuanto más bajo, mejor.",
  },
  ltv: {
    label: "LTV (valor de vida del alumno)",
    formula: "Ticket medio + (% que compra upsell × valor del upsell)",
    explanation:
      "Cuánto ingresa el negocio de media por cada alumno a lo largo del tiempo, contando también ventas adicionales.",
  },
  ltvCacRatio: {
    label: "LTV : CAC",
    formula: "LTV ÷ CAC",
    explanation:
      "Cuántas veces recuperas lo invertido en captar a un alumno. Por debajo de 1× pierdes dinero por alumno; en negocios sanos suele buscarse 3× o más.",
  },
  roas: {
    label: "ROAS (retorno de la inversión publicitaria)",
    formula: "Ingresos totales ÷ inversión en captación",
    explanation:
      "Por cada euro invertido en marketing, cuántos euros de ingresos genera. Un ROAS de 4× significa 4 € de ingreso por cada 1 € invertido.",
  },
  avgTicket: {
    label: "Ticket medio",
    formula: "Media de los precios de los planes, ponderada por su mezcla de ventas",
    explanation: "El precio medio que paga un alumno, teniendo en cuenta qué plan elige cada uno.",
  },
  breakEvenStudents: {
    label: "Punto de equilibrio",
    formula: "(Costes fijos + inversión en captación) ÷ margen de contribución por alumno",
    explanation:
      "El número mínimo de alumnos matriculados para cubrir todos los costes. A partir de ahí, cada matrícula extra es beneficio.",
  },
  salesCostTotal: {
    label: "Coste del equipo comercial",
    formula: "(Comerciales × sueldo fijo) + (pago por matrícula × alumnos)",
    explanation:
      "Lo que cuesta vender: la parte fija que se paga entren los alumnos que entren, y la variable que sólo se paga por matrícula cerrada.",
  },
  profitBeforeTax: {
    label: "Beneficio antes de impuestos",
    formula: "Ingresos − todos los costes (captación, entrega, pasarela, estructura y comercial)",
    explanation: "El resultado del negocio antes de que Hacienda se lleve su parte.",
  },
  corporateTax: {
    label: "Impuesto de sociedades",
    formula: "Beneficio antes de impuestos × tipo impositivo (0 si hay pérdidas)",
    explanation:
      "La cuota estimada con el tipo que se haya puesto. Con pérdidas es cero: sobre números rojos no se tributa.",
  },
  dividendPool: {
    label: "Dividendos por reparto",
    formula: "Beneficio neto de la ventana × % de reparto, sólo si la facturación llega al umbral",
    explanation:
      "El dinero que sale de la empresa hacia los socios en cada reparto. Lo que no se reparte se queda como reservas.",
  },
  retained: {
    label: "Reservas (no repartido)",
    formula: "Beneficio neto de la ventana − dividendos",
    explanation: "Lo que se queda dentro para financiar el crecimiento, el colchón o el siguiente trimestre.",
  },
  channelCac: {
    label: "CAC por canal",
    formula: "Inversión del canal ÷ alumnos que trae ese canal",
    explanation: "Compara qué canal de captación trae alumnos más baratos, para decidir dónde mover el presupuesto.",
  },
};
