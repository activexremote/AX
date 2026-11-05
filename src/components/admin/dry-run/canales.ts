// ══════════════════════════════════════════════════════════
//  Los canales del generador de enlaces
//
//  Cada uno trae sus UTM ya decididas, siempre con los mismos valores: así
//  los informes agrupan bien («linkedin / social» y no también «LinkedIn /
//  Social» y «linkedin / redes»). Quien comparte va en utm_content.
// ══════════════════════════════════════════════════════════

export type Canal = {
  id: string;
  nombre: string;
  source: string;
  medium: string;
  /** Lo que va en el ?ref= antes del nombre de quien comparte. */
  ref: string;
};

export const CANALES: readonly Canal[] = [
  { id: "linkedin", nombre: "LinkedIn · publicación", source: "linkedin", medium: "social", ref: "linkedin" },
  { id: "linkedin-dm", nombre: "LinkedIn · mensaje", source: "linkedin", medium: "mensaje", ref: "linkedin-dm" },
  { id: "whatsapp", nombre: "WhatsApp · chat", source: "whatsapp", medium: "mensaje", ref: "whatsapp" },
  { id: "whatsapp-grupo", nombre: "WhatsApp · grupo", source: "whatsapp", medium: "comunidad", ref: "whatsapp-grupo" },
  { id: "email", nombre: "Email personal", source: "email", medium: "email", ref: "email" },
  { id: "newsletter", nombre: "Newsletter", source: "newsletter", medium: "email", ref: "newsletter" },
  { id: "instagram", nombre: "Instagram", source: "instagram", medium: "social", ref: "instagram" },
  { id: "x", nombre: "X", source: "x", medium: "social", ref: "x" },
  { id: "facebook", nombre: "Facebook", source: "facebook", medium: "social", ref: "facebook" },
  { id: "slack", nombre: "Slack / comunidad", source: "slack", medium: "comunidad", ref: "slack" },
  { id: "telegram", nombre: "Telegram", source: "telegram", medium: "comunidad", ref: "telegram" },
  { id: "qr", nombre: "QR / presencial", source: "qr", medium: "presencial", ref: "qr" },
];

/** Los que crea «Paquete básico»: lo mínimo para lanzar. */
export const PAQUETE_BASICO = ["linkedin", "linkedin-dm", "whatsapp", "email"] as const;

/** «Oriol Claramunt» → «oriol»; «María José» → «maria_jose». */
export const slugPersona = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 30);

export type Propuesta = { label: string; source: string; medium: string; campaign: string; content: string; code: string };

/** Todo lo que el generador rellena a partir del canal y de quién lo comparte. */
export function proponer(canal: Canal, persona: string, campana: string): Propuesta {
  const p = slugPersona(persona);
  const nombre = persona.trim().split(/\s+/)[0] ?? "";
  return {
    label: nombre ? `${canal.nombre} · ${nombre}` : canal.nombre,
    source: canal.source,
    medium: canal.medium,
    campaign: campana,
    content: p,
    code: [canal.ref, p.split("_")[0]].filter(Boolean).join("-").slice(0, 40),
  };
}
