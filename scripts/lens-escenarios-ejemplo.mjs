// Tres escenarios de ejemplo —pesimista, realista, optimista— con cifras de
// mercado de agosto de 2026.
//
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs \
//     scripts/lens-escenarios-ejemplo.mjs --guardar
//
// Sin --guardar sólo los imprime. Con --guardar los inserta en lens_scenarios.
//
// De dónde salen las cifras que no son opinión:
//   · Impuesto de sociedades 2026, microempresa (INCN < 1 M€): 19 % hasta
//     50.000 € y 21 % el resto. Aquí va el tipo EFECTIVO de cada escenario,
//     porque la calculadora tiene un solo porcentaje.
//   · Stripe España 2026: 1,5 % + 0,25 € tarjeta estándar del EEE, 1,9 %
//     premium del EEE, 3,25 % internacional y +2 % si hay cambio de divisa.
//     El % de cada escenario es la mezcla esperada de tarjetas, no una tarifa.
//   · Los CPA son rangos de mercado para formación de 2.000-2.600 € en
//     español, no datos de esta casa. En cuanto haya tres convocatorias
//     hechas, esos números salen de Stripe y del administrador de anuncios y
//     estos sobran.
//
// Todo lo que va "por periodo" está en euros POR CONVOCATORIA (12 semanas =
// 2,77 meses), porque así se declara el escenario. Los costes mensuales se
// han multiplicado por 2,77 antes de meterlos aquí.
const PERIODO = (12 * 7) / (365 / 12); // meses que dura una convocatoria ≈ 2,77
const alMes = (euros) => Math.round(euros * PERIODO);

const comun = {
  periodMode: "convocatoria",
  periodMonths: 1,
  convocatoriaWeeks: 12,
  amortizationPerPeriod: 0,
  financialCostsPerPeriod: 0,
};

export const PESIMISTA = {
  ...comun,
  // Dos convocatorias al año, muy separadas: no hay músculo para más.
  courses: [
    { id: "professional", name: "Remote Professional", intakesPerYear: 1 },
    { id: "founder", name: "Remote Founder", intakesPerYear: 1 },
  ],
  calendar: { firstStartDay: 20, startEveryDays: 168, marketingLeadDays: 45 },
  // Mitad a plazos: sin marca, el pago único cuesta mucho más de vender.
  plans: [
    { id: "unico", name: "Pago único", price: 2400, mix: 25, payMonths: 1 },
    { id: "anticipada", name: "Matrícula anticipada", price: 2100, mix: 25, payMonths: 1 },
    { id: "plazos", name: "Pago a plazos (3×)", price: 2400, mix: 50, payMonths: 3 },
  ],
  // CPA de arranque en frío: sin píxel maduro ni creatividades probadas.
  channels: [
    { id: "meta", name: "Meta Ads", spend: 5000, students: 6 },
    { id: "google", name: "Google Ads", spend: 2200, students: 2 },
    { id: "organico", name: "Orgánico / referidos", spend: 600, students: 4 },
  ],
  fixedCosts: [
    { id: "herramientas", name: "Herramientas y software", amount: alMes(220) },
    { id: "plataforma", name: "Plataforma / LMS", amount: alMes(180) },
    { id: "gestoria", name: "Gestoría y legal", amount: alMes(250) },
    { id: "soporte", name: "Soporte y comunidad", amount: alMes(300) },
  ],
  // Sin volumen se paga más por hora: nadie hace precio por dos convocatorias.
  teachers: [
    { id: "principal", name: "Profesor principal", hours: 60, hourlyRate: 70 },
    { id: "invitado", name: "Profesor invitado", hours: 12, hourlyRate: 90 },
  ],
  salesTeam: { reps: 1, salaryPerRep: alMes(1600), bonusPerEnrollment: 120 },
  variableCostPerStudent: 55,
  gatewayFeePct: 2.4, // más alumnos LATAM: tarjeta internacional y cambio de divisa
  repeatPurchaseRate: 8,
  upsellValue: 250,
  corporateTaxPct: 19,
  cashOnHand: 30000,
  initialInvestment: 18000,
  dividends: { enabled: false, payoutPct: 50, revenueThreshold: 60000, everyMonths: 6 },
  partners: [
    { id: "s1", name: "Socio 1", sharePct: 50 },
    { id: "s2", name: "Socio 2", sharePct: 50 },
  ],
};

export const REALISTA = {
  ...comun,
  courses: [
    { id: "professional", name: "Remote Professional", intakesPerYear: 2 },
    { id: "founder", name: "Remote Founder", intakesPerYear: 2 },
  ],
  // Cada 13 semanas: 12 de clase y una de respiro para cerrar y montar.
  calendar: { firstStartDay: 15, startEveryDays: 91, marketingLeadDays: 35 },
  plans: [
    { id: "unico", name: "Pago único", price: 2400, mix: 35, payMonths: 1 },
    { id: "anticipada", name: "Matrícula anticipada", price: 2100, mix: 30, payMonths: 1 },
    { id: "plazos", name: "Pago a plazos (3×)", price: 2400, mix: 35, payMonths: 3 },
  ],
  channels: [
    { id: "meta", name: "Meta Ads", spend: 5500, students: 10 },
    { id: "google", name: "Google Ads", spend: 2400, students: 4 },
    { id: "organico", name: "Orgánico / referidos", spend: 900, students: 6 },
  ],
  fixedCosts: [
    { id: "herramientas", name: "Herramientas y software", amount: alMes(250) },
    { id: "plataforma", name: "Plataforma / LMS", amount: alMes(200) },
    { id: "gestoria", name: "Gestoría y legal", amount: alMes(250) },
    { id: "soporte", name: "Soporte y comunidad", amount: alMes(350) },
  ],
  teachers: [
    { id: "principal", name: "Profesor principal", hours: 60, hourlyRate: 65 },
    { id: "invitado", name: "Profesor invitado", hours: 12, hourlyRate: 85 },
  ],
  salesTeam: { reps: 1, salaryPerRep: alMes(1900), bonusPerEnrollment: 150 },
  variableCostPerStudent: 45,
  gatewayFeePct: 2.1,
  repeatPurchaseRate: 12,
  upsellValue: 350,
  corporateTaxPct: 20, // 19 % hasta 50.000 € y 21 % el resto: tipo efectivo
  cashOnHand: 45000,
  initialInvestment: 20000,
  dividends: { enabled: true, payoutPct: 50, revenueThreshold: 40000, everyMonths: 3 },
  partners: [
    { id: "s1", name: "Socio 1", sharePct: 60 },
    { id: "s2", name: "Socio 2", sharePct: 40 },
  ],
};

export const OPTIMISTA = {
  ...comun,
  courses: [
    { id: "professional", name: "Remote Professional", intakesPerYear: 4 },
    { id: "founder", name: "Remote Founder", intakesPerYear: 2 },
  ],
  // Cada 8 semanas: los grupos se solapan y hay dos en marcha casi siempre.
  calendar: { firstStartDay: 12, startEveryDays: 56, marketingLeadDays: 30 },
  plans: [
    { id: "unico", name: "Pago único", price: 2600, mix: 45, payMonths: 1 },
    { id: "anticipada", name: "Matrícula anticipada", price: 2300, mix: 30, payMonths: 1 },
    { id: "plazos", name: "Pago a plazos (3×)", price: 2600, mix: 25, payMonths: 3 },
  ],
  // Píxel maduro, creatividades probadas y una comunidad que ya recomienda.
  channels: [
    { id: "meta", name: "Meta Ads", spend: 6000, students: 18 },
    { id: "google", name: "Google Ads", spend: 2500, students: 6 },
    { id: "organico", name: "Orgánico / referidos", spend: 1000, students: 8 },
  ],
  fixedCosts: [
    { id: "herramientas", name: "Herramientas y software", amount: alMes(320) },
    { id: "plataforma", name: "Plataforma / LMS", amount: alMes(280) },
    { id: "gestoria", name: "Gestoría y legal", amount: alMes(300) },
    { id: "soporte", name: "Soporte y comunidad", amount: alMes(650) },
  ],
  // Dos grupos a la vez: hace falta un segundo profesor principal.
  teachers: [
    { id: "principal", name: "Profesor principal", hours: 60, hourlyRate: 60 },
    { id: "segundo", name: "Segundo profesor", hours: 40, hourlyRate: 55 },
    { id: "invitado", name: "Profesor invitado", hours: 12, hourlyRate: 80 },
  ],
  salesTeam: { reps: 2, salaryPerRep: alMes(1900), bonusPerEnrollment: 180 },
  variableCostPerStudent: 40,
  gatewayFeePct: 1.9,
  repeatPurchaseRate: 18,
  upsellValue: 450,
  corporateTaxPct: 21,
  cashOnHand: 60000,
  initialInvestment: 25000,
  dividends: { enabled: true, payoutPct: 60, revenueThreshold: 90000, everyMonths: 3 },
  partners: [
    { id: "s1", name: "Socio 1", sharePct: 60 },
    { id: "s2", name: "Socio 2", sharePct: 40 },
  ],
};

// ── Guardar ───────────────────────────────────────────────
if (process.argv.includes("--guardar")) {
  const { createClient } = await import("@supabase/supabase-js");
  const { normalizeScenario, computeLensMetrics, buildScenarioName } = await import(
    "../src/lib/lens/calculadora.ts"
  );
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  for (const [escenario, palabra] of [[PESIMISTA, "pesimista"], [REALISTA, "realista"], [OPTIMISTA, "optimista"]]) {
    const d = normalizeScenario(escenario);
    const m = computeLensMetrics(d);
    const name = buildScenarioName(m.totalStudents, palabra);
    const { error } = await admin.from("lens_scenarios").insert({ name, data: d });
    console.log(error ? `ERROR: ${error.message}` : `guardado: ${name}`);
  }
}
