import PDFDocument from "pdfkit";

import {
  computeLensMetrics,
  formatEUR,
  formatPct,
  formatRatio,
  payoutCadenceLabel,
  scenarioPeriodLabel,
  LENS_DISCLAIMER,
  type LensScenarioData,
} from "@/lib/lens/calculadora";

// ══════════════════════════════════════════════════════════
//  El PDF de una página
// ══════════════════════════════════════════════════════════
//
//  Un A4, ni uno más. Un escenario que ocupa tres páginas ya no se comparte:
//  se archiva. Aquí todo tiene que caber de un vistazo —cuenta de resultados,
//  reparto entre socios y los supuestos de los que sale todo— porque el
//  destinatario típico lo abre en el móvil, mira dos cifras y decide.
//
//  ⚠︎ Sin HTML de por medio: se dibuja a mano con PDFKit. A cambio de escribir
//  las coordenadas se gana lo que aquí importa de verdad: cifrado con
//  contraseña de verdad (AES-256), que un render a imagen no da, y un archivo
//  de 20 KB que se abre en cualquier sitio.
//
//  Tipografía Helvetica: es una de las catorce fuentes que TODO lector de PDF
//  lleva dentro, así que el archivo no depende de nada externo. Inter, la de
//  la marca, obligaría a incrustar el fichero y a arrastrarlo hasta el
//  servidor.

const INK = "#161616";
const BODY = "#525252";
const HELPER = "#6f6f6f";
const BORDER = "#e0e0e0";
const GO = "#038632";
const LOSS = "#a32020";

/**
 * Las catorce fuentes base de un PDF hablan WinAnsi, y en WinAnsi no existen
 * ni el menos matemático (−) ni la flecha (→): salen como basura en medio de
 * una cifra. Aquí se cambian por sus equivalentes de teclado antes de
 * escribir nada. Pasa TODO el texto por aquí; un carácter que se cuele se ve
 * en el papel y ya es tarde.
 */
function wa(text: string): string {
  return text
    // El espacio duro que mete Intl entre la cifra y el € rompe el reparto de
    // palabras de PDFKit y se come el espacio siguiente ("1.800 €fijo").
    .replace(/\u00a0/g, " ")
    .replace(/[−–—]/g, "-")
    .replace(/→/g, ">")
    .replace(/[≥]/g, ">=")
    .replace(/[≤]/g, "<=")
    .replace(/≈/g, "~")
    .replace(/…/g, "...");
}

/** Evita el "-0 €" que sale al negar un cero. */
function noNegZero(value: number): number {
  return Object.is(value, -0) || Math.abs(value) < 0.005 ? 0 : value;
}

const PAGE = { width: 595.28, height: 841.89 }; // A4 en puntos
const M = 42; // margen
const W = PAGE.width - M * 2;

export type LensPdfOptions = {
  scenarioName: string;
  data: LensScenarioData;
  /** Vacía = PDF sin cifrar. */
  password?: string;
  /** Quién lo exporta, para el pie. */
  author?: string;
};

export async function buildScenarioPdf(opts: LensPdfOptions): Promise<Buffer> {
  const m = computeLensMetrics(opts.data);
  const d = opts.data;
  const pass = opts.password?.trim();

  const doc = new PDFDocument({
    size: "A4",
    margin: M,
    info: {
      Title: opts.scenarioName,
      Author: opts.author ?? "ActiveXRemote",
      Subject: "Escenario de matrículas — hipótesis, no contabilidad oficial",
      Creator: "ActiveXRemote Lens",
    },
    ...(pass
      ? {
          // AES-256. `ownerPassword` igual que la de usuario a propósito: dos
          // contraseñas distintas dan una falsa sensación de control, porque
          // los permisos de un PDF los respeta quien quiere.
          userPassword: pass,
          ownerPassword: pass,
          pdfVersion: "1.7ext3" as const,
          permissions: { printing: "highResolution" as const, copying: true },
        }
      : {}),
  });

  const chunks: Buffer[] = [];
  doc.on("data", (c: Buffer) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));

  let y = M;

  // ── Cabecera ──
  y = header(doc, opts.scenarioName, d, y);

  // ── Los cuatro números que se miran primero ──
  y = kpis(doc, m, y);

  // ── Dos columnas: cuenta de resultados | reparto y supuestos ──
  const colGap = 18;
  const colW = (W - colGap) / 2;
  const leftX = M;
  const rightX = M + colW + colGap;
  const top = y;

  const leftEnd = profitAndLoss(doc, m, d, leftX, top, colW);
  let rightEnd = dividends(doc, m, d, rightX, top, colW);
  rightEnd = assumptions(doc, m, d, rightX, rightEnd + 14, colW);

  y = Math.max(leftEnd, rightEnd) + 16;

  // ── Aviso y pie ──
  disclaimer(doc, y);

  doc.end();
  return done;
}

// ── Piezas ────────────────────────────────────────────────

function header(doc: PDFKit.PDFDocument, name: string, d: LensScenarioData, y: number): number {
  // La marca: el triángulo (A) y el reloj de arena (X), el mismo trazado que
  // `components/brand-mark.tsx`, escalado a 14 pt de alto.
  const s = 14 / 28;
  const ox = M;
  const oy = y + 1;
  doc.save().lineWidth(2 * s).strokeColor(INK).lineJoin("miter");
  doc.moveTo(ox + 11 * s, oy + 2 * s).lineTo(ox + 20 * s, oy + 26 * s).lineTo(ox + 2 * s, oy + 26 * s).closePath().stroke();
  doc.moveTo(ox + 26 * s, oy + 2 * s).lineTo(ox + 44 * s, oy + 2 * s).lineTo(ox + 35 * s, oy + 14 * s).closePath().stroke();
  doc.moveTo(ox + 26 * s, oy + 26 * s).lineTo(ox + 44 * s, oy + 26 * s).lineTo(ox + 35 * s, oy + 14 * s).closePath().stroke();
  doc.restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .fillColor(INK)
    .text(wa("ACTIVEXREMOTE LENS"), M + 30, y + 3, { characterSpacing: 1.6 });

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(HELPER)
    .text(wa("HIPÓTESIS · NO ES UN DOCUMENTO CONTABLE"), M, y + 3, {
      width: W,
      align: "right",
      characterSpacing: 0.6,
    });

  y += 22;
  doc.font("Helvetica-Bold").fontSize(17).fillColor(INK).text(wa(name), M, y, { width: W });
  y = doc.y + 3;

  const periodo = `Los números corresponden a ${scenarioPeriodLabel(d)} · Generado el ${new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`;
  doc.font("Helvetica").fontSize(8.5).fillColor(HELPER).text(wa(periodo), M, y, { width: W });
  y = doc.y + 10;

  rule(doc, y, INK);
  return y + 12;
}

function kpis(doc: PDFKit.PDFDocument, m: ReturnType<typeof computeLensMetrics>, y: number): number {
  const cards: [string, string, string?][] = [
    ["ALUMNOS", String(m.totalStudents)],
    ["FACTURACIÓN", formatEUR(m.totalRevenue)],
    ["BENEFICIO NETO", formatEUR(m.netProfit), m.netProfit >= 0 ? GO : LOSS],
    ["MARGEN NETO", formatPct(m.netMarginPct), m.netMarginPct >= 0 ? GO : LOSS],
  ];
  const gap = 8;
  const cw = (W - gap * 3) / 4;
  const h = 44;

  cards.forEach(([label, value, color], i) => {
    const x = M + i * (cw + gap);
    doc.rect(x, y, cw, h).lineWidth(0.75).strokeColor(INK).stroke();
    doc.font("Helvetica").fontSize(6.5).fillColor(HELPER).text(wa(label), x + 8, y + 8, { width: cw - 16, characterSpacing: 0.5 });
    doc.font("Helvetica-Bold").fontSize(13).fillColor(color ?? INK).text(wa(value), x + 8, y + 20, { width: cw - 16, lineBreak: false });
  });

  return y + h + 16;
}

function profitAndLoss(
  doc: PDFKit.PDFDocument,
  m: ReturnType<typeof computeLensMetrics>,
  d: LensScenarioData,
  x: number,
  y: number,
  w: number,
): number {
  y = sectionTitle(doc, "Cuenta de resultados", x, y, w);

  const rows: [string, number, ("sub" | "total" | "grand")?][] = [
    ["Ingresos por matrículas", m.totalRevenue],
    ["- Comisión de pasarela", -m.gatewayFees],
    ["- Coste variable por alumno", -m.variableCostsTotal],
    ["- Variable comercial por matrícula", -m.salesBonusTotal],
    ["= Margen de contribución", m.totalRevenue - m.gatewayFees - m.variableCostsTotal - m.salesBonusTotal, "sub"],
    ["- Inversión en captación", -m.totalMarketingSpend],
    ["- Sueldos del equipo comercial", -m.salesFixedTotal],
    ["- Profesorado (horas de convocatoria)", -m.teachingCostTotal],
    ["- Costes fijos de estructura", -m.totalFixedCosts],
    ["= Beneficio antes de impuestos", m.profitBeforeTax, "sub"],
    [`- Impuesto de sociedades (${formatPct(d.corporateTaxPct, 2)})`, -m.corporateTax],
    ["= Beneficio neto", m.netProfit, "grand"],
  ];

  for (const [label, value, kind] of rows) {
    y = moneyRow(doc, label, value, x, y, w, kind);
  }

  y += 8;
  y = sectionTitle(doc, "Unidad económica", x, y, w);
  y = plainRow(doc, "Ticket medio", formatEUR(m.avgTicket), x, y, w);
  y = plainRow(doc, "Margen de contribución por alumno", formatEUR(m.contributionPerStudent), x, y, w);
  y = plainRow(doc, "CAC", formatEUR(m.cac), x, y, w);
  y = plainRow(doc, "LTV", formatEUR(m.ltv), x, y, w);
  y = plainRow(doc, "LTV : CAC", formatRatio(m.ltvCacRatio), x, y, w);
  y = plainRow(doc, "ROAS", formatRatio(m.roas), x, y, w);
  y = plainRow(
    doc,
    "Punto de equilibrio",
    m.breakEvenStudents == null ? "No se cubre" : `${Math.ceil(m.breakEvenStudents)} alumnos`,
    x,
    y,
    w,
  );

  return y;
}

function dividends(
  doc: PDFKit.PDFDocument,
  m: ReturnType<typeof computeLensMetrics>,
  d: LensScenarioData,
  x: number,
  y: number,
  w: number,
): number {
  const p = m.dividendPlan;
  y = sectionTitle(doc, "Reparto de dividendos", x, y, w);

  const cadencia = payoutCadenceLabel(p.windowMonths);
  const condicion = `Se reparte ${cadencia} el ${formatPct(d.dividends.payoutPct, 0)} del beneficio neto, siempre que la facturación de la ventana llegue a ${formatEUR(p.threshold)}.`;
  doc.font("Helvetica").fontSize(7.5).fillColor(HELPER).text(wa(condicion), x, y, { width: w });
  y = doc.y + 6;

  y = plainRow(doc, `Facturación por ventana (${p.windowMonths} m)`, formatEUR(p.revenueInWindow), x, y, w);
  y = plainRow(doc, "Beneficio neto de la ventana", formatEUR(p.profitInWindow), x, y, w);

  if (p.blockedReason) {
    const motivo =
      p.blockedReason === "disabled"
        ? "Reparto desactivado en este escenario."
        : p.blockedReason === "below-threshold"
          ? `No se reparte: la facturación de la ventana no llega al umbral. Faltan ${formatEUR(Math.max(0, p.threshold - p.revenueInWindow))}.`
          : "No se reparte: no hay beneficio que repartir en la ventana.";
    y += 2;
    doc.font("Helvetica-Bold").fontSize(8).fillColor(LOSS).text(wa(motivo), x, y, { width: w });
    return doc.y + 4;
  }

  y = moneyRow(doc, "Dividendos por reparto", p.poolPerPayout, x, y, w, "sub");
  y = plainRow(doc, "Reservas (se queda dentro)", formatEUR(p.retainedPerPayout), x, y, w);
  y = plainRow(doc, `Dividendos al año (${p.payoutsPerYear}×)`, formatEUR(p.poolPerYear), x, y, w);

  y += 8;
  y = sectionTitle(doc, "Qué se lleva cada socio", x, y, w);

  if (p.partners.length === 0) {
    doc.font("Helvetica").fontSize(8).fillColor(LOSS).text(wa("No hay socios definidos."), x, y, { width: w });
    return doc.y + 4;
  }

  // Cabecera de la tabla
  doc.font("Helvetica").fontSize(6.5).fillColor(HELPER);
  doc.text(wa("SOCIO"), x, y, { width: w * 0.4, characterSpacing: 0.5 });
  doc.text("%", x + w * 0.4, y, { width: w * 0.15, align: "right" });
  doc.text(wa("POR REPARTO"), x + w * 0.55, y, { width: w * 0.45, align: "right", characterSpacing: 0.5 });
  y += 11;
  rule(doc, y - 3, BORDER, x, w);

  for (const s of p.partners) {
    doc.font("Helvetica").fontSize(8.5).fillColor(INK).text(wa(s.name), x, y, { width: w * 0.4, lineBreak: false });
    doc.fillColor(BODY).text(wa(formatPct(s.sharePct, 0)), x + w * 0.4, y, { width: w * 0.15, align: "right" });
    doc.font("Helvetica-Bold").fillColor(INK).text(wa(formatEUR(s.perPayout)), x + w * 0.55, y, { width: w * 0.45, align: "right" });
    doc.font("Helvetica").fontSize(6.5).fillColor(HELPER).text(wa(`al año ${formatEUR(s.perYear)}`), x + w * 0.55, y + 10, { width: w * 0.45, align: "right" });
    y += 21;
  }

  if (Math.round(p.sharesSum) !== 100) {
    doc
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .fillColor(LOSS)
      .text(wa(`Las participaciones suman ${formatPct(p.sharesSum, 1)}, no 100 %: el reparto de arriba está incompleto.`), x, y, { width: w });
    y = doc.y + 2;
  }

  return y;
}

function assumptions(
  doc: PDFKit.PDFDocument,
  m: ReturnType<typeof computeLensMetrics>,
  d: LensScenarioData,
  x: number,
  y: number,
  w: number,
): number {
  y = sectionTitle(doc, "Supuestos de partida", x, y, w);

  // ⚠︎ Cada fragmento TERMINA en el importe, nunca al revés.
  //
  // El PDF no incrusta la fuente: usa Helvetica, que cada visor sustituye por
  // la suya. Y en casi todas las sustitutas el glifo del euro es más ancho de
  // lo que dice la métrica de Helvetica, así que se come el espacio que viene
  // detrás y se lee "1.800 €fijo". Con el importe al final el problema no
  // existe, porque lo siguiente es un separador con aire propio.
  const planes = d.plans.map((p) => `${p.name} (${p.mix} %) ${formatEUR(p.price)}`).join(" · ");
  const canales = d.channels
    .map((c) => `${c.name} ${c.students} al. por ${formatEUR(c.spend)}`)
    .join(" · ");
  const fijos = d.fixedCosts.map((c) => `${c.name} ${formatEUR(c.amount)}`).join(" · ");
  const docentes = d.teachers
    .map((t) => `${t.name}: ${t.hours} h x ${formatEUR(t.hourlyRate)}`)
    .join(" · ");

  y = wrapRow(doc, "Planes y mezcla", planes, x, y, w);
  y = wrapRow(doc, "Canales de captación", canales, x, y, w);
  y = wrapRow(
    doc,
    `Profesorado por convocatoria (${m.teachingHours} h, ${formatEUR(m.teachingCostPerConvocatoria)})`,
    docentes,
    x,
    y,
    w,
  );
  y = wrapRow(doc, "Costes fijos", fijos, x, y, w);
  y = wrapRow(
    doc,
    "Equipo comercial",
    `${d.salesTeam.reps} ${d.salesTeam.reps === 1 ? "comercial" : "comerciales"} · Sueldo por comercial ${formatEUR(d.salesTeam.salaryPerRep)} · Por matrícula cerrada ${formatEUR(d.salesTeam.bonusPerEnrollment)}`,
    x,
    y,
    w,
  );
  y = wrapRow(
    doc,
    "Otros",
    `Pasarela ${formatPct(d.gatewayFeePct, 2)} · Coste variable por alumno ${formatEUR(d.variableCostPerStudent)} · Upsell al ${formatPct(d.repeatPurchaseRate, 0)} de ${formatEUR(d.upsellValue)}`,
    x,
    y,
    w,
  );

  return y;
}

function disclaimer(doc: PDFKit.PDFDocument, y: number) {
  // El aviso se ancla abajo del todo: es lo último que se lee y lo primero
  // que hay que poder señalar si alguien confunde esto con un cierre.
  const boxTop = Math.max(y, PAGE.height - M - 78);
  doc.rect(M, boxTop, W, 3).fillColor(INK).fill();
  doc
    .font("Helvetica-Bold")
    .fontSize(7)
    .fillColor(INK)
    .text(wa("AVISO"), M, boxTop + 9, { characterSpacing: 1 });
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(BODY)
    .text(wa(LENS_DISCLAIMER), M, boxTop + 19, { width: W, align: "justify", lineGap: 0.5 });
}

// ── Utilidades de dibujo ──────────────────────────────────

function rule(doc: PDFKit.PDFDocument, y: number, color = BORDER, x = M, w = W) {
  doc.save().moveTo(x, y).lineTo(x + w, y).lineWidth(0.75).strokeColor(color).stroke().restore();
}

function sectionTitle(doc: PDFKit.PDFDocument, text: string, x: number, y: number, w: number): number {
  doc.font("Helvetica-Bold").fontSize(7).fillColor(INK).text(wa(text.toUpperCase()), x, y, { width: w, characterSpacing: 1 });
  const end = doc.y + 3;
  rule(doc, end, INK, x, w);
  return end + 6;
}

function moneyRow(
  doc: PDFKit.PDFDocument,
  label: string,
  value: number,
  x: number,
  y: number,
  w: number,
  kind?: "sub" | "total" | "grand",
): number {
  const bold = kind === "sub" || kind === "grand";
  const size = kind === "grand" ? 10 : 8.5;
  const color = kind === "grand" ? (value >= 0 ? GO : LOSS) : INK;

  if (kind === "grand") y += 3;
  doc
    .font(bold ? "Helvetica-Bold" : "Helvetica")
    .fontSize(size)
    .fillColor(kind ? INK : BODY)
    .text(wa(label), x, y, { width: w * 0.62, lineBreak: false });
  doc.fillColor(color).text(wa(formatEUR(noNegZero(value))), x + w * 0.62, y, { width: w * 0.38, align: "right" });

  const next = y + (kind === "grand" ? 15 : 12.5);
  if (kind === "sub" || kind === "grand") rule(doc, next - 3.5, BORDER, x, w);
  return next;
}

function plainRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, w: number): number {
  doc.font("Helvetica").fontSize(8.5).fillColor(BODY).text(wa(label), x, y, { width: w * 0.62, lineBreak: false });
  doc.font("Helvetica-Bold").fillColor(INK).text(wa(value), x + w * 0.62, y, { width: w * 0.38, align: "right" });
  return y + 12.5;
}

function wrapRow(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, w: number): number {
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor(HELPER).text(wa(label.toUpperCase()), x, y, { width: w, characterSpacing: 0.5 });
  doc.font("Helvetica").fontSize(7.5).fillColor(BODY).text(wa(value) || "-", x, doc.y + 1, { width: w });
  return doc.y + 5;
}
