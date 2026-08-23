// Motor de cálculo de la calculadora de matrículas de Lens.
//
// Todo en euros (no céntimos, a diferencia de `stripe/catalog.ts`): esto no
// cobra a nadie, es una hoja de cálculo para pensar en voz alta, así que
// prima que sea fácil de teclear ("2400") sobre la precisión de céntimos.

export type LensPlan = { id: string; name: string; price: number; mix: number };
export type LensChannel = { id: string; name: string; spend: number; students: number };
export type LensFixedCost = { id: string; name: string; amount: number };

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
  };
}

export type LensChannelStats = LensChannel & { cac: number; share: number };

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
  totalCosts: number;
  netProfit: number;
  netMarginPct: number;
  contributionPerStudent: number;
  /** null = con este margen por alumno los costes fijos no se cubren nunca, sea cual sea el volumen. */
  breakEvenStudents: number | null;
  channelStats: LensChannelStats[];
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
  const totalCosts = totalMarketingSpend + variableCostsTotal + gatewayFees + totalFixedCosts;

  const netProfit = totalRevenue - totalCosts;
  const netMarginPct = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const contributionPerStudent = avgTicket - data.variableCostPerStudent - avgTicket * (data.gatewayFeePct / 100);
  const breakEvenStudents =
    contributionPerStudent > 0 ? (totalFixedCosts + totalMarketingSpend) / contributionPerStudent : null;

  const channelStats: LensChannelStats[] = data.channels.map((c) => ({
    ...c,
    cac: c.students > 0 ? c.spend / c.students : 0,
    share: totalStudents > 0 ? c.students / totalStudents : 0,
  }));

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
    totalCosts,
    netProfit,
    netMarginPct,
    contributionPerStudent,
    breakEvenStudents,
    channelStats,
  };
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
  channelCac: {
    label: "CAC por canal",
    formula: "Inversión del canal ÷ alumnos que trae ese canal",
    explanation: "Compara qué canal de captación trae alumnos más baratos, para decidir dónde mover el presupuesto.",
  },
};
