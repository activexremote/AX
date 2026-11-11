import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Textos del gestor comercial (/admin/comercial)
//
//  Los leads se llevan en Zoho; aquí está lo que el equipo comercial
//  necesita además: el material para mandar, la calculadora de plazos y el
//  playbook. El material y el playbook van sólo en español (se vende en
//  español); la interfaz, en los dos idiomas como el resto del panel.
// ══════════════════════════════════════════════════════════

const es = {
  navGroup: "Comercial",
  navMaterial: "Material de apoyo",
  navCalc: "Calculadora",
  navPlaybook: "Playbook",

  // Material de apoyo
  matTitle: "Material de apoyo",
  matLead: "Los dosieres del curso para mandar a cada lead después de hablar con él: el del curso completo y uno por camino. En PDF, listos para adjuntar en un correo o en WhatsApp.",
  matDownload: "Descargar PDF",
  matPages: "{n} páginas",
  matInternal: "Uso interno",
  matInternalHint: "Para ti, no para mandar.",
  matTip: "Manda el dosier del camino que encaja con su objetivo. Si aún no lo tiene claro, el del curso completo. Y siempre con dos líneas tuyas que conecten con lo que te ha contado.",

  // Calculadora de plazos
  calcTitle: "Calculadora de plazos",
  calcLead: "Los precios de salida, las cuotas y sus fechas, y el mensaje con las condiciones listo para mandar o pegar en Zoho.",
  calcProduct: "Qué se lleva",
  calcOne: "Un curso",
  calcTwo: "Los dos cursos",
  calcMode: "Forma de pago",
  calcCash: "Pago único",
  calcInst: "A plazos",
  calcN: "Número de cuotas",
  calcFirst: "Primer cargo",
  calcTotal: "Total",
  calcEach: "Cada cuota",
  calcSaves: "Al contado se ahorra {x}.",
  calcCosts: "A plazos son {x} más que al contado.",
  calcSame: "El mismo precio al contado o a plazos, hasta en {n} cuotas.",
  calcAfterEnd: "El último cargo llega después de que termine el curso ({f}). Confírmalo con el equipo antes de ofrecerlo.",
  calcSchedule: "Calendario de pagos",
  calcCuota: "Cuota",
  calcDate: "Fecha",
  calcAmount: "Importe",
  calcName: "Su nombre (opcional)",
  calcNamePh: "Laura",
  calcMsg: "Mensaje",
  copy: "Copiar",
  copied: "Copiado",
  email: "Correo",

  // Playbook
  pbTitle: "Playbook comercial",
  pbLead: "Qué vendemos, a quién, cómo detectar el interés, cómo despertarlo en quien duda y lo que nunca decimos.",
  pbPdf: "Descargar PDF",
  pbContents: "Contenido",
  pbSignals: { verde: "Señales verdes", ambar: "Señales ámbar", rojo: "Señales rojas" },
  pbSay: "Di esto",
  pbDont: "No digas esto",
  pbBehind: "Lo que suele haber detrás:",
  pbImportant: "Importante",
};

export type ComercialCopy = typeof es;

const en: ComercialCopy = {
  navGroup: "Sales",
  navMaterial: "Sales material",
  navCalc: "Calculator",
  navPlaybook: "Playbook",

  matTitle: "Sales material",
  matLead: "Course brochures to send each lead after talking to them: the full course and one per path. PDFs ready to attach to an email or WhatsApp. Content in Spanish.",
  matDownload: "Download PDF",
  matPages: "{n} pages",
  matInternal: "Internal use",
  matInternalHint: "For you, not to send.",
  matTip: "Send the brochure for the path that fits their goal. If they are undecided, the full course. Always with two lines of your own that connect with what they told you.",

  calcTitle: "Instalment calculator",
  calcLead: "Launch prices, instalments with their dates, and the terms as a ready-to-send message or to paste into Zoho.",
  calcProduct: "What they take",
  calcOne: "One course",
  calcTwo: "Both courses",
  calcMode: "Payment",
  calcCash: "Single payment",
  calcInst: "Instalments",
  calcN: "Number of instalments",
  calcFirst: "First charge",
  calcTotal: "Total",
  calcEach: "Each instalment",
  calcSaves: "Paying upfront saves {x}.",
  calcCosts: "Instalments cost {x} more than paying upfront.",
  calcSame: "Same price upfront or in up to {n} instalments.",
  calcAfterEnd: "The last charge falls after the course ends ({f}). Check with the team before offering it.",
  calcSchedule: "Payment schedule",
  calcCuota: "Instalment",
  calcDate: "Date",
  calcAmount: "Amount",
  calcName: "Their name (optional)",
  calcNamePh: "Laura",
  calcMsg: "Message",
  copy: "Copy",
  copied: "Copied",
  email: "Email",

  pbTitle: "Sales playbook",
  pbLead: "What we sell, to whom, how to spot interest, how to spark it in those who hesitate, and what we never say. Content in Spanish.",
  pbPdf: "Download PDF",
  pbContents: "Contents",
  pbSignals: { verde: "Green signals", ambar: "Amber signals", rojo: "Red signals" },
  pbSay: "Say this",
  pbDont: "Don't say this",
  pbBehind: "What usually lies behind it:",
  pbImportant: "Important",
};

export const comCopy: Record<Locale, ComercialCopy> = { es, en };
