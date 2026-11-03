// ══════════════════════════════════════════════════════════
//  Las horas del dry run, siempre en hora de Madrid
//
//  La sesión se anuncia en hora peninsular y los recordatorios salen a horas
//  de Madrid («la víspera a las 18:00»), da igual dónde corra el servidor
//  (Vercel, en UTC). Intl sabe el desfase de cada fecha, cambio de hora
//  incluido, así que no hace falta ninguna librería.
// ══════════════════════════════════════════════════════════

export const ZONA = "Europe/Madrid";

type Partes = { y: number; m: number; d: number; h: number; mi: number };

const lector = new Intl.DateTimeFormat("en-US", {
  timeZone: ZONA,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Fecha y hora de un instante tal como se leen en Madrid. */
export function partesMadrid(fecha: Date): Partes {
  const p = Object.fromEntries(lector.formatToParts(fecha).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
}

/** Minutos que Madrid va por delante de UTC en ese instante (60 o 120). */
function desfase(fecha: Date): number {
  const p = partesMadrid(fecha);
  return (Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi) - Math.floor(fecha.getTime() / 60000) * 60000) / 60000;
}

/** El instante en que en Madrid son esa fecha y esa hora. */
export function enMadrid(y: number, m: number, d: number, h: number, mi: number): Date {
  const comoUtc = Date.UTC(y, m - 1, d, h, mi);
  let t = comoUtc - desfase(new Date(comoUtc)) * 60000;
  // Cerca del cambio de hora, el desfase del resultado puede no ser el de la
  // primera estimación: una segunda vuelta lo deja bien.
  const otro = desfase(new Date(t));
  if (comoUtc - otro * 60000 !== t) t = comoUtc - otro * 60000;
  return new Date(t);
}

/** `dias` días antes o después de `base`, a esa hora de Madrid. */
export function diaRelativo(base: Date, dias: number, h: number, mi = 0): Date {
  const p = partesMadrid(base);
  const dia = new Date(Date.UTC(p.y, p.m - 1, p.d + dias));
  return enMadrid(dia.getUTCFullYear(), dia.getUTCMonth() + 1, dia.getUTCDate(), h, mi);
}

/** Para un `<input type="datetime-local">`: «2026-11-21T09:30». */
export function aCampoLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const p = partesMadrid(new Date(iso));
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${p.y}-${dos(p.m)}-${dos(p.d)}T${dos(p.h)}:${dos(p.mi)}`;
}

/** Lo contrario: el valor del campo, leído como hora de Madrid. */
export function deCampoLocal(valor: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(valor.trim());
  if (!m) return null;
  return enMadrid(+m[1], +m[2], +m[3], +m[4], +m[5]);
}

const fechaLarga = new Intl.DateTimeFormat("es-ES", { timeZone: ZONA, weekday: "long", day: "numeric", month: "long" });
const fechaCorta = new Intl.DateTimeFormat("es-ES", { timeZone: ZONA, day: "numeric", month: "short" });
const hora = new Intl.DateTimeFormat("es-ES", { timeZone: ZONA, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const fechaHora = new Intl.DateTimeFormat("es-ES", { timeZone: ZONA, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

/** «sábado, 21 de noviembre» */
export const diaLargo = (d: Date | string) => fechaLarga.format(new Date(d));
/** «21 nov» */
export const diaCorto = (d: Date | string) => fechaCorta.format(new Date(d));
/** «09:30» */
export const horaMadrid = (d: Date | string) => hora.format(new Date(d));
/** «21 nov, 09:30» */
export const fechaYHora = (d: Date | string) => fechaHora.format(new Date(d));

/** «Sábado, 21 de noviembre · 09:30–14:00 (hora de Madrid)» */
export function cuandoEs(inicio: string, fin: string): string {
  const dia = diaLargo(inicio);
  return `${dia.charAt(0).toUpperCase()}${dia.slice(1)} · ${horaMadrid(inicio)}–${horaMadrid(fin)} (hora de Madrid)`;
}

/** Fecha en el formato de Google Calendar y de los .ics: 20261121T083000Z */
export function sello(d: Date | string): string {
  return new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
