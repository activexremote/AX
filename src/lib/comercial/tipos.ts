// ══════════════════════════════════════════════════════════
//  Los leads y su seguimiento (migración 0034)
// ══════════════════════════════════════════════════════════

export const ESTADOS_LEAD = ["nuevo", "contactado", "interesado", "en_duda", "inscrito", "descartado"] as const;
export type EstadoLead = (typeof ESTADOS_LEAD)[number];

export const TEMPERATURAS = ["caliente", "templado", "frio"] as const;
export type Temperatura = (typeof TEMPERATURAS)[number];

export const TIPOS_CONTACTO = ["llamada", "whatsapp", "email", "reunion", "nota"] as const;
export type TipoContacto = (typeof TIPOS_CONTACTO)[number];

export type Lead = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  courses: string[];
  locale: string | null;
  status: EstadoLead;
  notes: string | null;
  temperature: Temperatura | null;
  next_action: string | null;
  next_action_at: string | null;
  last_contact_at: string | null;
  owner_id: string | null;
  objection: string | null;
};

export type EventoLead = {
  id: string;
  lead_id: string;
  created_at: string;
  author_id: string | null;
  kind: TipoContacto | "estado";
  body: string;
  from_status: EstadoLead | null;
  to_status: EstadoLead | null;
};

/** Los que ya no se trabajan: abajo de la lista. */
export const CERRADO: EstadoLead[] = ["inscrito", "descartado"];

/** El día de hoy en Madrid, como «2026-11-11» (lo que guarda next_action_at). */
export const hoyMadrid = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);

/**
 * El orden de trabajo del día: primero las próximas acciones vencidas o de
 * hoy (la más antigua antes), luego los nuevos que esperan su primera
 * llamada (el que más lleva esperando antes), luego por temperatura y, al
 * final, los cerrados.
 */
export function prioridad(l: Lead, hoy: string): [number, number] {
  if (CERRADO.includes(l.status)) return [9, -Date.parse(l.created_at)];
  if (l.next_action_at && l.next_action_at <= hoy) return [0, Date.parse(l.next_action_at)];
  if (l.status === "nuevo") return [1, Date.parse(l.created_at)];
  const t = l.temperature === "caliente" ? 2 : l.temperature === "templado" ? 3 : l.temperature === "frio" ? 5 : 4;
  return [t, l.next_action_at ? Date.parse(l.next_action_at) : Number.MAX_SAFE_INTEGER];
}

/**
 * El número para wa.me. Muchos llegan del formulario sin prefijo: un móvil
 * español de 9 cifras (6… o 7…) se completa con el 34; con cualquier otra
 * cosa sin prefijo no se adivina el país y no hay botón.
 */
export function whatsappDe(tel: string | null | undefined) {
  const crudo = (tel ?? "").trim();
  const d = crudo.replace(/\D/g, "");
  if (crudo.startsWith("+")) return d.length >= 8 ? d : null;
  if (d.startsWith("00")) return d.length >= 10 ? d.slice(2) : null;
  if (/^[67]\d{8}$/.test(d)) return `34${d}`;
  return d.length >= 11 ? d : null;
}
