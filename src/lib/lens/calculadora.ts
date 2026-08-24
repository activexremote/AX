// Motor de cálculo de la calculadora de matrículas de Lens.
//
// Todo en euros (no céntimos, a diferencia de `stripe/catalog.ts`): esto no
// cobra a nadie, es una hoja de cálculo para pensar en voz alta, así que
// prima que sea fácil de teclear ("2400") sobre la precisión de céntimos.

export type LensPlan = {
  id: string;
  name: string;
  price: number;
  mix: number;
  /** En cuántos meses paga el alumno. 1 = de una vez; 3 = tres plazos. */
  payMonths: number;
};
export type LensChannel = { id: string; name: string; spend: number; students: number };
export type LensFixedCost = { id: string; name: string; amount: number };
export type LensPartner = { id: string; name: string; sharePct: number };

/**
 * Un curso del catálogo y cuántas convocatorias suyas se hacen al año.
 *
 * Es la variable que convierte un escenario —que describe UNA convocatoria—
 * en un año de negocio. Sin ella sólo se puede hablar de lo que da una
 * convocatoria suelta, que no es como se decide nada.
 */
export type LensCourse = { id: string; name: string; intakesPerYear: number };

/**
 * El calendario del año.
 *
 * Es lo que convierte una lista de convocatorias en una previsión de
 * ingresos: no es lo mismo abrir cinco convocatorias seguidas que abrirlas
 * cada tres semanas y solaparlas. El dinero entra en meses distintos, y en
 * una previsión eso es TODO.
 */
export type LensCalendar = {
  /** Día del año en que arranca la primera (1 = 1 de enero). */
  firstStartDay: number;
  /**
   * Cada cuántos días arranca la siguiente.
   *
   * Si es menor que lo que dura una convocatoria, se solapan: dos grupos en
   * marcha a la vez. Eso no es un error, es una decisión, y la previsión lo
   * refleja tal cual.
   */
  startEveryDays: number;
  /** Con cuántos días de antelación se gasta la captación de cada una. */
  marketingLeadDays: number;
};

/**
 * Un profesor, cobrado como se cobra de verdad: por convocatoria, a un precio
 * por hora, sobre un número de horas ya cerrado de antemano.
 *
 * Por eso no vive en los costes fijos: un coste fijo mensual no sabe nada de
 * convocatorias, y una convocatoria de 12 semanas no cae en tres meses justos.
 */
export type LensTeacher = {
  id: string;
  name: string;
  /** Horas cerradas para toda la convocatoria. */
  hours: number;
  /** Precio por hora. */
  hourlyRate: number;
};

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
   * Cuánto tiempo cubren los números de este escenario.
   *
   * Sin esto no se puede hablar de "cada cuánto se reparte": un escenario de
   * 25 alumnos no dice por sí solo si son de un mes o de una convocatoria, y
   * un dividendo trimestral significa una cosa muy distinta en cada caso.
   *
   * Se declara de dos maneras porque el negocio funciona por convocatorias
   * pero los dividendos se piensan en meses: o el escenario es UNA
   * convocatoria (dure lo que dure), o son N meses de calendario.
   */
  periodMode: "convocatoria" | "months";
  /** Sólo cuenta con periodMode "months". */
  periodMonths: number;
  /** Lo que dura una convocatoria. Doce semanas, salvo que cambie. */
  convocatoriaWeeks: number;
  /** Profesorado, cobrado por convocatoria. */
  teachers: LensTeacher[];
  /** Catálogo y ritmo: cuántas convocatorias de cada curso al año. */
  courses: LensCourse[];
  /** Cuándo arranca cada convocatoria dentro del año. */
  calendar: LensCalendar;
  salesTeam: LensSalesTeam;
  /** Impuesto de sociedades, en %. A 0 el escenario se comporta como antes. */
  corporateTaxPct: number;
  /**
   * Amortizaciones del periodo. Es lo que separa el EBITDA del EBIT: sin
   * este campo, "EBITDA" sería un nombre bonito para el beneficio operativo.
   */
  amortizationPerPeriod: number;
  /** Gastos financieros del periodo (intereses, comisiones de financiación). */
  financialCostsPerPeriod: number;
  /** Caja disponible hoy. De aquí sale el runway, que no es un KPI: es la vida. */
  cashOnHand: number;
  /**
   * Inversión inicial: el desembolso del arranque.
   *
   * Sale de la CAJA y no de la cuenta de resultados, que es lo que es: no se
   * gasta un local o una plataforma, se compra. En el resultado entra poco a
   * poco, por la amortización. Confundir las dos cosas es lo que hace que un
   * año parezca ruinoso el día que se invierte y estupendo los tres
   * siguientes.
   */
  initialInvestment: number;
  /** % de alumnos que termina el curso. Predice recompra, reseñas y churn. */
  completionRate: number;
  dividends: LensDividends;
  /** Socios y su participación. Debería sumar 100 %. */
  partners: LensPartner[];
};

/** Escenario de partida con los precios reales del programa (ver `lib/stripe/catalog.ts`). */
export function defaultLensScenario(): LensScenarioData {
  return {
    plans: [
      { id: "unico", name: "Pago único", price: 2400, mix: 40, payMonths: 1 },
      { id: "anticipada", name: "Matrícula anticipada", price: 2100, mix: 35, payMonths: 1 },
      { id: "plazos", name: "Pago a plazos (3×)", price: 2400, mix: 25, payMonths: 3 },
    ],
    channels: [
      { id: "meta", name: "Meta Ads", spend: 3000, students: 12 },
      { id: "google", name: "Google Ads", spend: 2000, students: 7 },
      { id: "organico", name: "Orgánico / referidos", spend: 500, students: 6 },
    ],
    // Sin "equipo docente": la docencia tiene su propio bloque, con horas y
    // precio/hora. Dejarla también aquí sería contarla dos veces.
    fixedCosts: [
      { id: "herramientas", name: "Herramientas y software", amount: 300 },
      { id: "soporte", name: "Soporte y comunidad", amount: 600 },
    ],
    teachers: [
      { id: "docente-1", name: "Profesor principal", hours: 60, hourlyRate: 60 },
      { id: "docente-2", name: "Profesor invitado", hours: 12, hourlyRate: 80 },
    ],
    courses: [
      { id: "professional", name: "Remote Professional", intakesPerYear: 3 },
      { id: "founder", name: "Remote Founder", intakesPerYear: 2 },
    ],
    calendar: { firstStartDay: 15, startEveryDays: 70, marketingLeadDays: 30 },
    variableCostPerStudent: 40,
    gatewayFeePct: 1.9,
    repeatPurchaseRate: 15,
    upsellValue: 300,
    periodMode: "convocatoria",
    periodMonths: 1,
    convocatoriaWeeks: 12,
    salesTeam: { reps: 1, salaryPerRep: 1800, bonusPerEnrollment: 150 },
    corporateTaxPct: 0,
    amortizationPerPeriod: 0,
    financialCostsPerPeriod: 0,
    cashOnHand: 40000,
    initialInvestment: 15000,
    completionRate: 70,
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
    // Un plan guardado antes de los plazos cobra de una vez, que es lo que
    // hacía la calculadora hasta ahora: no se le inventan tres meses.
    plans: (raw.plans ?? base.plans).map((p) => ({ ...p, payMonths: p.payMonths ?? 1 })),
    channels: raw.channels ?? base.channels,
    fixedCosts: raw.fixedCosts ?? base.fixedCosts,
    // Un escenario guardado antes de esto hablaba en meses: se respeta tal
    // cual. Y NO se le inventa profesorado, porque su coste docente ya está
    // metido a mano en los costes fijos y aparecería dos veces.
    periodMode: raw.periodMode ?? (raw.periodMonths ? "months" : base.periodMode),
    periodMonths: raw.periodMonths ?? base.periodMonths,
    convocatoriaWeeks: raw.convocatoriaWeeks ?? base.convocatoriaWeeks,
    teachers: raw.teachers ?? (raw.periodMonths ? [] : base.teachers),
    courses: raw.courses ?? base.courses,
    calendar: { ...base.calendar, ...(raw.calendar ?? {}) },
    salesTeam: { ...base.salesTeam, ...(raw.salesTeam ?? {}) },
    corporateTaxPct: raw.corporateTaxPct ?? 0,
    amortizationPerPeriod: raw.amortizationPerPeriod ?? 0,
    financialCostsPerPeriod: raw.financialCostsPerPeriod ?? 0,
    cashOnHand: raw.cashOnHand ?? base.cashOnHand,
    initialInvestment: raw.initialInvestment ?? 0,
    completionRate: raw.completionRate ?? base.completionRate,
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

/** 52/12. Un mes no son cuatro semanas, y con convocatorias de 12 el error se nota. */
export const WEEKS_PER_MONTH = 52 / 12;

/** Lo que dura una convocatoria, en meses. */
export function convocatoriaMonths(d: Pick<LensScenarioData, "convocatoriaWeeks">): number {
  return Math.max(0.25, (d.convocatoriaWeeks || 12) / WEEKS_PER_MONTH);
}

/**
 * Meses que cubre el escenario, se haya declarado como se haya declarado.
 * Es el número con el que se compara todo lo demás.
 */
export function effectivePeriodMonths(d: LensScenarioData): number {
  return d.periodMode === "convocatoria" ? convocatoriaMonths(d) : Math.max(0.25, d.periodMonths || 1);
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

/**
 * El año.
 *
 * Un escenario describe una convocatoria (o un periodo suelto). El año sale
 * de repetirlo tantas veces como convocatorias se hagan, sumando las de todos
 * los cursos. Cada convocatoria se da por igual a la del escenario: es una
 * hipótesis, y está dicha en pantalla, pero es lo que permite pasar de "esta
 * convocatoria deja X" a "el año deja Y" sin inventar un modelo entero.
 */
export type LensAnnual = {
  /** Convocatorias al año, sumando todos los cursos. */
  intakes: number;
  /**
   * Cuántas veces se repite lo que va POR CONVOCATORIA: matrículas,
   * captación, coste por alumno, comisión comercial y docencia.
   */
  intakeFactor: number;
  /**
   * Cuántas veces cabe el periodo del escenario en un año natural. Es el que
   * se aplica a lo que va POR CALENDARIO: estructura, sueldos, amortización
   * y financieros, que se pagan los doce meses haya convocatoria o no.
   *
   * Confundir los dos factores era el error que hacía que los doce meses no
   * sumaran el año: cinco convocatorias de doce semanas son sesenta semanas,
   * y la estructura no se paga sesenta semanas, se paga cincuenta y dos.
   */
  timeFactor: number;
  students: number;
  revenue: number;
  /** Explotación del año: ingresos menos gastos de explotación. */
  ebitda: number;
  /** Amortizaciones + financieros del año. */
  belowEbitda: number;
  tax: number;
  netProfit: number;
  dividends: number;
  /** Semanas del año con alguna convocatoria en marcha. Máximo 52. */
  weeksBusy: number;
  /** Semanas del último grupo que se van al ejercicio siguiente. */
  weeksOver: number;
  perCourse: { id: string; name: string; intakes: number; students: number; revenue: number }[];
};

/** Un mes del año, con lo que entra y lo que sale. */
export type LensMonth = {
  /** 0 = enero. */
  index: number;
  label: string;
  /** Lo COBRADO este mes. */
  revenue: number;
  /**
   * Lo DEVENGADO: la parte del curso que se ha entregado este mes.
   *
   * Cobrar en enero un programa que se da hasta marzo no es facturación de
   * enero, es caja de enero. Un inversor mira las dos y compara: la
   * diferencia entre ellas es el ingreso diferido, y es lo primero que
   * pregunta quien ha visto quebrar a alguien con la caja llena.
   */
  recognized: number;
  costs: number;
  profit: number;
  cumulative: number;
  /** Caja al cierre del mes, contando la que había al empezar el año. */
  cash: number;
  /** Convocatorias que arrancan este mes. */
  starts: number;
  /** Convocatorias en marcha algún día de este mes. */
  running: number;
};

/**
 * Las métricas que mira quien no ha visto el negocio por dentro.
 *
 * No son "otra vista" de las mismas cifras: son definiciones concretas, con
 * su letra pequeña. El CAC de aquí lleva ventas dentro, no sólo publicidad;
 * el LTV va a margen bruto y no a ingreso; y el margen bruto sólo descuenta
 * lo que cuesta ENTREGAR la formación. Cambiar cualquiera de esas tres cosas
 * cambia la conversación entera, así que están dichas una por una.
 */
export type LensInvestorKpis = {
  /** Ingreso devengado medio por mes: lo que de verdad se ha entregado. */
  mrr: number;
  /** El año entero, devengado. */
  arr: number;
  /** Crecimiento medio mes a mes del devengado, en %. */
  growthMoM: number;
  /** Lo cobrado por adelantado que aún no se ha entregado, en % del año. */
  deferredPct: number;

  /** Ingresos menos lo que cuesta entregar: docencia, plataforma, pasarela. */
  grossProfit: number;
  grossMarginPct: number;
  /** Beneficio operativo antes de amortizaciones. */
  ebitda: number;
  ebitdaMarginPct: number;
  ebit: number;

  /** Captar un alumno cuesta esto, contando marketing Y ventas. */
  cacLoaded: number;
  /** Meses en recuperar ese CAC con el margen bruto que deja el alumno. */
  paybackMonths: number | null;
  /** Margen bruto que deja un alumno, contando la recompra. */
  ltvGross: number;
  ltvCacLoaded: number;

  /** % que vuelve a comprar (aquí no hay suscripción, hay recompra). */
  repurchasePct: number;
  completionPct: number;

  cashOnHand: number;
  /** Meses de vida al ritmo de quema actual. null = no quema. */
  runwayMonths: number | null;
  /** El punto más bajo de la caja durante el año. */
  cashTrough: number;
  /** Mes en que la caja toca ese suelo (0 = enero). */
  cashTroughMonth: number;
  /** Mes en que la caja se queda en negativo, si pasa. */
  runsOutMonth: number | null;
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
  /** Gastos de explotación: todo menos amortizaciones e impuestos. */
  opex: number;
  /** Beneficio operativo antes de amortizaciones. */
  ebitda: number;
  /** EBITDA menos amortizaciones. */
  ebit: number;
  /** Horas de docencia contratadas para una convocatoria. */
  teachingHours: number;
  /** Coste del profesorado de UNA convocatoria entera. */
  teachingCostPerConvocatoria: number;
  /** Ese coste llevado al periodo del escenario. */
  teachingCostTotal: number;
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
  annual: LensAnnual;
  months: LensMonth[];
  kpis: LensInvestorKpis;
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

  // ── Profesorado ──
  // Se contrata por convocatoria y por horas cerradas, así que primero se
  // calcula lo que cuesta una convocatoria entera y luego se lleva al periodo
  // del escenario. Si el escenario ES una convocatoria, el factor es 1 y no
  // se toca nada; si es un mes, se reparte lo que toque de esas 12 semanas.
  const teachers = data.teachers ?? [];
  const teachingHours = teachers.reduce((sum, t) => sum + (t.hours || 0), 0);
  const teachingCostPerConvocatoria = teachers.reduce(
    (sum, t) => sum + (t.hours || 0) * (t.hourlyRate || 0),
    0,
  );
  const periodMonths = effectivePeriodMonths(data);
  const teachingCostTotal = teachingCostPerConvocatoria * (periodMonths / convocatoriaMonths(data));

  // El equipo comercial, partido en sus dos mitades: la que se paga pase lo
  // que pase y la que sólo se paga si se cierra la matrícula.
  const salesFixedTotal = (data.salesTeam.reps || 0) * (data.salesTeam.salaryPerRep || 0);
  const salesBonusTotal = (data.salesTeam.bonusPerEnrollment || 0) * totalStudents;
  const salesCostTotal = salesFixedTotal + salesBonusTotal;

  // Gastos de explotación: todo lo que cuesta operar, sin amortizaciones ni
  // financieros. Lo que queda al restarlos es el EBITDA, que es exactamente
  // lo que significan esas siglas y no "el beneficio antes de lo que me
  // convenga".
  const opex =
    totalMarketingSpend +
    variableCostsTotal +
    gatewayFees +
    totalFixedCosts +
    teachingCostTotal +
    salesCostTotal;

  const ebitda = totalRevenue - opex;
  const ebit = ebitda - (data.amortizationPerPeriod || 0);
  const profitBeforeTax = ebit - (data.financialCostsPerPeriod || 0);
  const totalCosts = totalRevenue - profitBeforeTax;
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
      ? (totalFixedCosts + teachingCostTotal + salesFixedTotal + totalMarketingSpend) /
        contributionPerStudent
      : null;

  const channelStats: LensChannelStats[] = data.channels.map((c) => ({
    ...c,
    cac: c.students > 0 ? c.spend / c.students : 0,
    share: totalStudents > 0 ? c.students / totalStudents : 0,
  }));

  // El orden importa: el año primero, porque los dividendos se reparten sobre
  // el año y los meses tienen que sumar exactamente lo que diga el año.
  const annual = computeAnnual(data, {
    students: totalStudents,
    revenue: totalRevenue,
    marketing: totalMarketingSpend,
    variableCosts: variableCostsTotal,
    salesBonus: salesBonusTotal,
    teachingPerConvocatoria: teachingCostPerConvocatoria,
    gatewayPct: data.gatewayFeePct,
    fixedCosts: totalFixedCosts,
    salesFixed: salesFixedTotal,
    periodMonths,
  });

  const dividendPlan = computeDividendPlan(data, annual.revenue, annual.netProfit);
  annual.dividends = dividendPlan.poolPerYear;

  const months = computeMonths(data, {
    intakes: annual.intakes,
    // Todo lo que va por convocatoria se reparte entre las convocatorias del
    // año, así que los doce meses suman el año por construcción y no por
    // suerte.
    revenuePerIntake: annual.intakeFactor > 0 ? annual.revenue / annual.intakeFactor : 0,
    marketingPerIntake: totalMarketingSpend,
    variablePerIntake: variableCostsTotal + salesBonusTotal,
    teachingPerIntake: teachingCostPerConvocatoria,
    gatewayPct: data.gatewayFeePct,
    // La amortización se queda fuera: es un apunte contable, no una salida
    // de dinero. Meterla aquí haría que la caja pareciera peor de lo que es.
    monthlyOverheads:
      (totalFixedCosts + salesFixedTotal + (data.financialCostsPerPeriod || 0)) / periodMonths,
    // El año empieza con la inversión ya pagada: es el agujero del que hay
    // que salir, y enseñarlo es justo el sentido de la gráfica.
    cashOnHand: (data.cashOnHand || 0) - (data.initialInvestment || 0),
  });

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
    opex,
    ebitda,
    ebit,
    teachingHours,
    teachingCostPerConvocatoria,
    teachingCostTotal,
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
    annual,
    kpis: computeInvestorKpis(data, {
      revenue: totalRevenue,
      students: totalStudents,
      teaching: teachingCostTotal,
      variableCosts: variableCostsTotal,
      gatewayFees,
      marketing: totalMarketingSpend,
      salesCost: salesCostTotal,
      ebitda,
      ebit,
      periodMonths,
      months,
    }),
    months,
  };
}

// ── El año, mes a mes ─────────────────────────────────────

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_LABELS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** En qué mes (0-11) cae un día del año. Los días fuera del año se recortan. */
function monthOfDay(day: number): number {
  let acc = 0;
  for (let m = 0; m < 12; m++) {
    acc += MONTH_DAYS[m];
    if (day <= acc) return m;
  }
  return 11;
}

/**
 * Reparte el año en doce meses.
 *
 * Cada convocatoria arranca un día concreto y desde ahí caen las cosas donde
 * les toca: la captación ANTES (con los días de antelación que se digan), la
 * matrícula al empezar —o en varios plazos, si el plan los tiene—, las horas
 * de docencia repartidas por los días que dura, y la estructura todos los
 * meses pase lo que pase.
 *
 * Ese desfase es justo lo que no se ve en un total anual: se puede cerrar un
 * año estupendo y tener tres meses seguidos en rojo porque la captación se
 * paga antes de que entre la primera matrícula.
 */
function computeMonths(
  data: LensScenarioData,
  v: {
    intakes: number;
    revenuePerIntake: number;
    marketingPerIntake: number;
    variablePerIntake: number;
    teachingPerIntake: number;
    gatewayPct: number;
    monthlyOverheads: number;
    cashOnHand: number;
  },
): LensMonth[] {
  const revenue = new Array(12).fill(0);
  const recognized = new Array(12).fill(0);
  const costs = new Array(12).fill(0);
  const starts = new Array(12).fill(0);
  const running = new Array(12).fill(0);

  const cal = data.calendar;
  const durationDays = Math.max(1, (data.convocatoriaWeeks || 12) * 7);
  const mixSum = data.plans.reduce((sum, p) => sum + (p.mix || 0), 0) || 1;

  /**
   * Lo que se sale del año se imputa al borde.
   *
   * Una convocatoria que arranca en noviembre da clase hasta febrero, y su
   * captación se pagó en octubre. En un año en marcha eso se compensa solo:
   * lo que se va por diciembre lo devuelve la convocatoria del año anterior
   * que entra por enero. Recortarlo sin más haría que los doce meses no
   * sumaran el año, y entonces la gráfica y el resumen dirían cosas
   * distintas del mismo escenario.
   */
  const mes = (day: number) => monthOfDay(Math.min(365, Math.max(1, day)));

  if (data.periodMode === "convocatoria" && v.intakes > 0) {
    for (let i = 0; i < v.intakes; i++) {
      const startDay = (cal.firstStartDay || 1) + i * Math.max(1, cal.startEveryDays || 1);
      const startMonth = mes(startDay);
      starts[startMonth] += 1;

      // Captación: se paga por delante.
      costs[mes(startDay - (cal.marketingLeadDays || 0))] += v.marketingPerIntake;

      // Matrículas: cada plan cobra en los meses que tenga.
      for (const p of data.plans) {
        const total = v.revenuePerIntake * ((p.mix || 0) / mixSum);
        const meses = Math.max(1, Math.round(p.payMonths || 1));
        for (let k = 0; k < meses; k++) {
          const m = mes(startDay + k * 30);
          revenue[m] += total / meses;
          costs[m] += (total / meses) * (v.gatewayPct / 100);
        }
      }

      // Variables y comisión comercial: al matricularse.
      costs[startMonth] += v.variablePerIntake;

      // Docencia y devengado: repartidos por los días que dura.
      const mesesEnMarcha = new Set<number>();
      for (let d = 0; d < durationDays; d++) {
        const m = mes(startDay + d);
        costs[m] += v.teachingPerIntake / durationDays;
        recognized[m] += v.revenuePerIntake / durationDays;
        mesesEnMarcha.add(m);
      }
      // Un grupo cuenta una vez por mes, aunque dure treinta días de ese mes:
      // lo que se quiere saber es cuántos grupos hay a la vez.
      for (const m of mesesEnMarcha) running[m] += 1;
    }
  } else {
    // Sin convocatorias: el escenario describe un trozo de tiempo y el año es
    // ese trozo repetido. No hay calendario que valga, así que se reparte por
    // igual entre los doce meses.
    const meses = Math.max(0.25, effectivePeriodMonths(data));
    for (let m = 0; m < 12; m++) {
      revenue[m] += v.revenuePerIntake / meses;
      recognized[m] += v.revenuePerIntake / meses;
      costs[m] +=
        (v.marketingPerIntake + v.variablePerIntake + v.teachingPerIntake) / meses +
        (v.revenuePerIntake / meses) * (v.gatewayPct / 100);
      running[m] = 1;
    }
  }

  // Estructura y sueldos: todos los meses, haya o no convocatoria.
  for (let m = 0; m < 12; m++) costs[m] += v.monthlyOverheads;

  let acc = 0;
  return MONTH_LABELS.map((label, m) => {
    const profit = revenue[m] - costs[m];
    acc += profit;
    return {
      index: m,
      label,
      revenue: revenue[m],
      recognized: recognized[m],
      costs: costs[m],
      profit,
      cumulative: acc,
      cash: v.cashOnHand + acc,
      starts: starts[m],
      running: running[m],
    };
  });
}

export { MONTH_NAMES };

// ── Las métricas de inversor ──────────────────────────────

/**
 * Aquí no hay fórmulas nuevas: hay definiciones, y cada una lleva su letra
 * pequeña escrita al lado. Un CAC sin ventas dentro y un CAC con ventas
 * dentro son el mismo nombre para dos números que llevan a decisiones
 * distintas, y eso es lo que hay que dejar claro antes de enseñárselo a
 * nadie.
 */
function computeInvestorKpis(
  data: LensScenarioData,
  v: {
    revenue: number;
    students: number;
    teaching: number;
    variableCosts: number;
    gatewayFees: number;
    marketing: number;
    salesCost: number;
    ebitda: number;
    ebit: number;
    periodMonths: number;
    months: LensMonth[];
  },
): LensInvestorKpis {
  // ── Recurrencia ──
  // No hay suscripción, así que el "MRR" es facturación normalizada: el
  // ingreso devengado que cae en cada mes. Llamarlo MRR sin esa aclaración
  // sería vender humo.
  const devengadoAnual = v.months.reduce((a, m) => a + m.recognized, 0);
  const cobradoAnual = v.months.reduce((a, m) => a + m.revenue, 0);
  const mrr = devengadoAnual / 12;

  // Crecimiento mes a mes: media de los meses con actividad, comparando cada
  // uno con el anterior. Los meses a cero se saltan; con un calendario de
  // convocatorias, dividir por cero sale más veces de lo que parece.
  const saltos: number[] = [];
  for (let m = 1; m < 12; m++) {
    const antes = v.months[m - 1].recognized;
    if (antes > 0) saltos.push(((v.months[m].recognized - antes) / antes) * 100);
  }
  const growthMoM = saltos.length ? saltos.reduce((a, b) => a + b, 0) / saltos.length : 0;

  // Diferido: lo cobrado que todavía no se ha entregado. Si se cobra por
  // adelantado un programa largo, la caja y la cuenta de resultados cuentan
  // dos historias distintas, y ésta es la diferencia entre las dos.
  const deferredPct = cobradoAnual > 0 ? Math.max(0, ((cobradoAnual - devengadoAnual) / cobradoAnual) * 100) : 0;

  // ── Márgenes ──
  // Coste directo de ENTREGAR: docencia, coste variable por alumno y
  // pasarela. Ni marketing ni ventas ni estructura: eso no es entregar.
  const cogs = v.teaching + v.variableCosts + v.gatewayFees;
  const grossProfit = v.revenue - cogs;
  const grossMarginPct = v.revenue > 0 ? (grossProfit / v.revenue) * 100 : 0;

  // ── Unidad ──
  const cacLoaded = v.students > 0 ? (v.marketing + v.salesCost) / v.students : 0;
  const grossPerStudent = v.students > 0 ? grossProfit / v.students : 0;

  // Payback: en cuántos meses vuelve el CAC. Se mide contra el margen bruto
  // que deja el alumno mientras paga, no contra el precio: recuperar el CAC
  // con dinero que se va en dar la clase no es recuperarlo.
  const mixSum = data.plans.reduce((sum, p) => sum + (p.mix || 0), 0) || 1;
  const mesesDeCobro = Math.max(
    1,
    data.plans.reduce((sum, p) => sum + Math.max(1, p.payMonths || 1) * ((p.mix || 0) / mixSum), 0),
  );
  const margenMensual = grossPerStudent / mesesDeCobro;
  const paybackMonths = margenMensual > 0 ? cacLoaded / margenMensual : null;

  const repurchasePct = data.repeatPurchaseRate || 0;
  // LTV a margen, no a ingreso: es lo que se compara con el CAC. El upsell
  // entra con el mismo margen bruto que el curso, que es la hipótesis menos
  // mala mientras no se venda otra cosa.
  const ltvGross = grossPerStudent * (1 + repurchasePct / 100);
  const ltvCacLoaded = cacLoaded > 0 ? ltvGross / cacLoaded : 0;

  // ── Caja ──
  const cashOnHand = (data.cashOnHand || 0) - (data.initialInvestment || 0);
  const flujos = v.months.map((m) => m.profit);
  const quema = flujos.filter((f) => f < 0);
  const quemaMedia = quema.length ? Math.abs(quema.reduce((a, b) => a + b, 0)) / quema.length : 0;
  const anual = flujos.reduce((a, b) => a + b, 0);
  // Si el año cierra en positivo no hay runway que contar: no se quema, se
  // acumula. Poner un número ahí sería asustar sin motivo.
  const runwayMonths = anual < 0 && quemaMedia > 0 ? cashOnHand / quemaMedia : null;

  let cashTrough = cashOnHand;
  let cashTroughMonth = 0;
  let runsOutMonth: number | null = null;
  v.months.forEach((m) => {
    if (m.cash < cashTrough) {
      cashTrough = m.cash;
      cashTroughMonth = m.index;
    }
    if (runsOutMonth === null && m.cash < 0) runsOutMonth = m.index;
  });

  return {
    mrr,
    arr: devengadoAnual,
    growthMoM,
    deferredPct,
    grossProfit,
    grossMarginPct,
    ebitda: v.ebitda,
    ebitdaMarginPct: v.revenue > 0 ? (v.ebitda / v.revenue) * 100 : 0,
    ebit: v.ebit,
    cacLoaded,
    paybackMonths,
    ltvGross,
    ltvCacLoaded,
    repurchasePct,
    completionPct: data.completionRate || 0,
    cashOnHand,
    runwayMonths,
    cashTrough,
    cashTroughMonth,
    runsOutMonth,
  };
}

function computeAnnual(
  data: LensScenarioData,
  v: {
    students: number;
    revenue: number;
    marketing: number;
    variableCosts: number;
    salesBonus: number;
    teachingPerConvocatoria: number;
    gatewayPct: number;
    fixedCosts: number;
    salesFixed: number;
    periodMonths: number;
  },
): LensAnnual {
  const courses = data.courses ?? [];
  const intakes = courses.reduce((sum, c) => sum + (c.intakesPerYear || 0), 0);

  // Dos ritmos distintos, y hay que respetarlos por separado.
  const intakeFactor = data.periodMode === "convocatoria" ? intakes : 12 / Math.max(0.25, v.periodMonths);
  const timeFactor = 12 / Math.max(0.25, v.periodMonths);

  const revenue = v.revenue * intakeFactor;
  const opex =
    v.marketing * intakeFactor +
    v.variableCosts * intakeFactor +
    v.salesBonus * intakeFactor +
    v.teachingPerConvocatoria * (data.periodMode === "convocatoria" ? intakes : intakeFactor) +
    revenue * (v.gatewayPct / 100) +
    v.fixedCosts * timeFactor +
    v.salesFixed * timeFactor;

  const ebitda = revenue - opex;
  const belowEbitda =
    ((data.amortizationPerPeriod || 0) + (data.financialCostsPerPeriod || 0)) * timeFactor;
  const pretax = ebitda - belowEbitda;
  const tax = pretax > 0 ? pretax * ((data.corporateTaxPct || 0) / 100) : 0;

  // Semanas del año con alguna convocatoria en marcha.
  //
  // NO es convocatorias × duración: si dos grupos van en paralelo, esas
  // semanas se cuentan una vez, no dos. Sumarlas daba "72 de 52", que además
  // de imposible es mentira: con seis grupos solapados el calendario está
  // lleno, no desbordado. Lo que sí se sale del año es la cola del último,
  // y eso se cuenta aparte.
  const durationDays = (data.convocatoriaWeeks || 12) * 7;
  const ocupados = new Set<number>();
  let colaFuera = 0;
  for (let i = 0; i < intakes; i++) {
    const inicio = (data.calendar?.firstStartDay || 1) + i * Math.max(1, data.calendar?.startEveryDays || 1);
    for (let d = 0; d < durationDays; d++) {
      const dia = inicio + d;
      if (dia >= 1 && dia <= 365) ocupados.add(dia);
      else if (dia > 365) colaFuera = Math.max(colaFuera, dia - 365);
    }
  }
  const weeksBusy = ocupados.size / 7;

  return {
    intakes,
    intakeFactor,
    timeFactor,
    students: v.students * intakeFactor,
    revenue,
    ebitda,
    belowEbitda,
    tax,
    netProfit: pretax - tax,
    // Los dividendos ya vienen anualizados por su propia cadencia.
    dividends: 0,
    weeksBusy,
    /** Días del último grupo que caen ya en el año siguiente, en semanas. */
    weeksOver: colaFuera / 7,
    perCourse: courses.map((c) => ({
      id: c.id,
      name: c.name,
      intakes: c.intakesPerYear || 0,
      students: v.students * (c.intakesPerYear || 0),
      revenue: v.revenue * (c.intakesPerYear || 0),
    })),
  };
}

// ── El año, mes a mes ─────────────────────────────────────


// ── Las métricas de inversor ──────────────────────────────
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
  annualRevenue: number,
  annualNetProfit: number,
): LensDividendPlan {
  const windowMonths = Math.max(1, data.dividends?.everyMonths || 1);
  // La ventana es un trozo de AÑO, no un trozo del periodo del escenario: un
  // reparto trimestral es un trimestre de calendario, se hagan las
  // convocatorias que se hagan y duren lo que duren.
  const trozo = windowMonths / 12;

  const revenueInWindow = annualRevenue * trozo;
  const profitInWindow = annualNetProfit * trozo;
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

/** Qué representan los números del escenario, en meses de calendario. */
export function periodLabel(periodMonths: number): string {
  if (periodMonths === 1) return "1 mes";
  if (periodMonths === 3) return "1 trimestre";
  if (periodMonths === 6) return "1 semestre";
  if (periodMonths === 12) return "1 año";
  return `${periodMonths} meses`;
}

/** El periodo del escenario, dicho entero. */
export function scenarioPeriodLabel(d: LensScenarioData): string {
  if (d.periodMode === "convocatoria") {
    const semanas = d.convocatoriaWeeks || 12;
    return `1 convocatoria (${semanas} ${semanas === 1 ? "semana" : "semanas"})`;
  }
  return periodLabel(d.periodMonths);
}

/** Y en corto, para meterlo en una frase: "cada convocatoria", "cada mes"… */
export function scenarioPeriodShort(d: LensScenarioData): string {
  if (d.periodMode === "convocatoria") return "convocatoria";
  return periodLabel(d.periodMonths).replace("1 ", "");
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

/** Meses con coma decimal, que aquí se escribe "0,3" y no "0.3". */
export function formatMonths(value: number, maximumFractionDigits = 1): string {
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits }).format(value);
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

/**
 * El resumen del ejercicio, en prosa.
 *
 * Un cuadro de mandos contesta preguntas que ya te has hecho. Esto contesta
 * la que se hace en voz alta cuando alguien mira la pantalla por encima del
 * hombro: "vale, ¿y esto qué significa?". Va en frases, con los números
 * dentro, y dice también lo que no cuadra —semanas que no caben, mezclas que
 * no suman, meses en rojo— porque un resumen que sólo cuenta lo bueno no es
 * un resumen, es un folleto.
 *
 * Devuelve párrafos sueltos para que los pinte igual la pantalla que el PDF.
 */
export function buildYearSummary(d: LensScenarioData, m: LensMetrics): string[] {
  const parrafos: string[] = [];
  const a = m.annual;
  const p = m.dividendPlan;

  // ── El plan del año ──
  const cursos = (d.courses ?? []).filter((c) => (c.intakesPerYear || 0) > 0);
  const trozos = cursos.map((c) => `${c.intakesPerYear} de ${c.name}`);
  const detalle =
    trozos.length <= 1 ? trozos.join("") : `${trozos.slice(0, -1).join(", ")} y ${trozos[trozos.length - 1]}`;
  const duracionDias = (d.convocatoriaWeeks || 12) * 7;
  const hueco = (d.calendar?.startEveryDays || 0) - duracionDias;
  const semanasHueco = Math.round(Math.abs(hueco) / 7);
  const ritmo =
    hueco > 3
      ? `con ${semanasHueco} ${semanasHueco === 1 ? "semana" : "semanas"} de descanso entre una y la siguiente`
      : hueco < -3
        ? `solapándose ${semanasHueco} ${semanasHueco === 1 ? "semana" : "semanas"}, o sea con dos grupos en marcha a la vez`
        : "encadenadas, una detrás de otra sin descanso";

  parrafos.push(
    `Este año se harán ${a.intakes} ${a.intakes === 1 ? "convocatoria" : "convocatorias"}` +
      (detalle ? ` (${detalle})` : "") +
      `, de ${d.convocatoriaWeeks} semanas cada una y ${ritmo}. ` +
      `Eso son ${Math.round(a.students)} alumnos en el año, a un ticket medio de ${formatEUR(m.avgTicket)}.`,
  );

  // ── El dinero ──
  const estructura = m.totalFixedCosts * a.timeFactor + m.salesFixedTotal * a.timeFactor;
  const docencia = m.teachingCostPerConvocatoria * a.intakes;
  parrafos.push(
    `Supondrá una facturación de ${formatEUR(a.revenue)} y unos costes de ${formatEUR(a.revenue - a.ebitda)}, ` +
      `de los cuales ${formatEUR(estructura)} son estructura y sueldos fijos —se pagan los doce meses, haya clase o no— ` +
      `y ${formatEUR(docencia)}, profesorado. ` +
      `Deja un EBITDA de ${formatEUR(a.ebitda)} (${formatPct(m.totalRevenue > 0 ? (a.ebitda / a.revenue) * 100 : 0, 0)}) ` +
      `y un beneficio neto de ${formatEUR(a.netProfit)}` +
      (a.tax > 0 ? `, ya descontados ${formatEUR(a.tax)} de impuesto de sociedades` : "") +
      `.`,
  );

  // ── El reparto ──
  if (p.blockedReason === null && p.poolPerPayout > 0) {
    const socios = p.partners
      .map((s) => `${s.name} ${formatEUR(s.perYear)}`)
      .join(", ");
    parrafos.push(
      `Se repartirán dividendos ${p.payoutsPerYear} ${p.payoutsPerYear === 1 ? "vez" : "veces"} al año, ` +
        `${formatEUR(p.poolPerPayout)} cada vez —${formatEUR(p.poolPerYear)} en total—, siempre que la facturación ` +
        `de cada ${payoutCadenceLabel(p.windowMonths).replace("cada ", "")} llegue a ${formatEUR(p.threshold)}. ` +
        (socios ? `Al año, por socio: ${socios}. ` : "") +
        `El resto, ${formatEUR(a.netProfit - p.poolPerYear)}, se queda como reservas.`,
    );
  } else {
    parrafos.push(
      p.blockedReason === "disabled"
        ? `No hay reparto de dividendos en este escenario: el beneficio se queda entero dentro.`
        : p.blockedReason === "below-threshold"
          ? `No habrá reparto: la facturación de cada ${payoutCadenceLabel(p.windowMonths).replace("cada ", "")} ` +
            `se queda en ${formatEUR(p.revenueInWindow)} y el umbral está en ${formatEUR(p.threshold)}.`
          : `No habrá reparto: no hay beneficio que repartir.`,
    );
  }

  // ── El calendario ──
  const fuertes = [...m.months].sort((x, y) => y.revenue - x.revenue).slice(0, 3);
  const rojos = m.months.filter((x) => x.profit < 0);
  // "marzo, agosto y octubre", no "marzo, agosto, octubre": el resumen se lee
  // en voz alta delante de alguien, y ahí la coma final canta.
  const nombres = (lista: LensMonth[]) => {
    const ms = lista.map((x) => MONTH_NAMES[x.index]);
    if (ms.length <= 1) return ms.join("");
    return `${ms.slice(0, -1).join(", ")} y ${ms[ms.length - 1]}`;
  };
  parrafos.push(
    `Los meses más fuertes serán ${nombres(fuertes)}, que es cuando entran las matrículas de cada convocatoria. ` +
      (rojos.length
        ? `Y ${rojos.length} ${rojos.length === 1 ? "mes cerrará" : "meses cerrarán"} en negativo (${nombres(rojos)}): ` +
          `son los meses sin arranque, en los que se paga docencia y estructura mientras sólo entran los plazos pendientes.`
        : `Ningún mes cierra en negativo.`),
  );

  // ── La caja ──
  const suelo = m.kpis.cashTrough;
  parrafos.push(
    m.kpis.runsOutMonth !== null
      ? `Ojo con la caja: se queda en negativo en ${MONTH_NAMES[m.kpis.runsOutMonth]}. ` +
        `Con ${formatEUR(d.cashOnHand)} de partida y ${formatEUR(d.initialInvestment)} de inversión inicial no llega; ` +
        `hace falta más colchón, cobrar antes o gastar menos por delante.`
      : `La caja aguanta todo el año: el punto más bajo es ${formatEUR(suelo)} en ${MONTH_NAMES[m.kpis.cashTroughMonth]}, ` +
        `y diciembre cierra con ${formatEUR(m.months[11].cash)}.`,
  );

  // ── Lo que no cuadra ──
  const avisos: string[] = [];
  if (a.weeksOver > 0) {
    avisos.push(
      `la última convocatoria se sale del año: ${Math.round(a.weeksOver)} ` +
        `${Math.round(a.weeksOver) === 1 ? "semana suya cae" : "semanas suyas caen"} ya en el ejercicio siguiente`,
    );
  }
  // Convocatorias que, con este ritmo, arrancarían ya fuera del año.
  const cabenEnElAno = (() => {
    let n = 0;
    for (let i = 0; i < a.intakes; i++) {
      if ((d.calendar?.firstStartDay || 1) + i * Math.max(1, d.calendar?.startEveryDays || 1) <= 365) n++;
    }
    return n;
  })();
  if (cabenEnElAno < a.intakes) {
    avisos.push(
      `con ${d.calendar.startEveryDays} días entre convocatorias sólo arrancan ${cabenEnElAno} de las ${a.intakes} ` +
        `dentro del año — las otras se han imputado a diciembre para que las cuentas cuadren, pero el calendario no da`,
    );
  }
  if (a.weeksBusy >= 51.5 && a.intakes > 1) {
    avisos.push(`el calendario está lleno: hay clase las 52 semanas, sin ventana para descansar ni para reorganizar`);
  }
  const mixSum = d.plans.reduce((sum, x) => sum + (x.mix || 0), 0);
  if (Math.round(mixSum) !== 100) avisos.push(`la mezcla de planes suma ${formatPct(mixSum, 0)} en vez de 100 %`);
  if (p.partners.length && Math.round(p.sharesSum) !== 100) {
    avisos.push(`las participaciones de los socios suman ${formatPct(p.sharesSum, 0)}`);
  }
  if (m.breakEvenStudents != null && m.totalStudents < m.breakEvenStudents) {
    avisos.push(
      `cada convocatoria necesita ${Math.ceil(m.breakEvenStudents)} alumnos para cubrir costes y hay ${m.totalStudents}`,
    );
  }
  if (avisos.length) {
    parrafos.push(`Antes de dar esto por bueno: ${avisos.join("; ")}.`);
  }

  return parrafos;
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
  teachingCostTotal: {
    label: "Coste del profesorado",
    formula: "Suma de (horas × precio/hora) de cada profesor, llevada al periodo del escenario",
    explanation:
      "Lo que cuesta dar las clases de una convocatoria. Se contrata por horas cerradas, así que no depende de cuántos alumnos entren.",
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
