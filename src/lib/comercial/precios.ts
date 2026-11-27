// ══════════════════════════════════════════════════════════
//  Los precios de salida y el cálculo de los plazos
//
//  La fuente para el equipo comercial: el playbook, sus mensajes, el PDF y
//  la calculadora del gestor leen de aquí. (La web y Stripe tienen su propio
//  catálogo en lib/stripe/catalog.ts.)
//
//  A plazos se paga más que al contado: nunca
//  se anuncia como «sin intereses». Sin imports a propósito: los scripts de los PDF lo leen
//  con Node.
// ══════════════════════════════════════════════════════════

// Formato 2.0 (nov. 2026): cada curso tiene su precio. Son los mismos
// importes que lib/stripe/catalog.ts y que los dosieres en PDF.
//   Professional (8 semanas):  890 € al contado, o 990 € en 5 cuotas de 198 €.
//   Founder (13 semanas):    1.490 € al contado, o 1.590 € en 5 cuotas de 318 €.
// No hay precio de pack: los dos cursos se pagan cada uno a su precio.

/** Cuántas cuotas se ofrecen por defecto, y como máximo. */
export const PLAZOS_POR_DEFECTO = 5;
/** Entre cuántos plazos se puede repartir. Fuera de esto, lo decide el equipo. */
export const PLAZOS_MIN = 2;
export const PLAZOS_MAX = 5;

export type Producto = "professional" | "founder";
/**
 * Céntimos, como Stripe: nada de euros en coma flotante. `fin` es el último
 * día del curso empezando el 9 de enero de 2027 (8 y 13 semanas): un cargo
 * después de esa fecha se avisa en la calculadora.
 */
export const PRODUCTOS: Record<Producto, { nombre: string; contado: number; plazos: number; maxCuotas: number; fin: string }> = {
  professional: { nombre: "Remote Professional", contado: 89_000, plazos: 99_000, maxCuotas: PLAZOS_MAX, fin: "2027-03-05" },
  founder: { nombre: "Remote Founder", contado: 149_000, plazos: 159_000, maxCuotas: PLAZOS_MAX, fin: "2027-04-09" },
};

/** El día de hoy en Madrid, como «2026-11-11». */
export const hoyMadrid = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);

const ENTEROS = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always", maximumFractionDigits: 0 });
const DECIMALES = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always", minimumFractionDigits: 2 });
/** 149000 → «1.490 €»; 19800 → «198 €»; 54750 → «547,50 €». */
export const euros = (centimos: number) => (centimos % 100 ? DECIMALES : ENTEROS).format(centimos / 100);

export type Cuota = { n: number; fecha: string; importe: number };

/** «2026-11-30» + 3 meses = «2027-02-28»: el mismo día o el último del mes. */
function sumarMeses(iso: string, meses: number) {
  const [a, m, d] = iso.split("-").map(Number);
  const destino = new Date(Date.UTC(a, m - 1 + meses, 1));
  const ultimo = new Date(Date.UTC(destino.getUTCFullYear(), destino.getUTCMonth() + 1, 0)).getUTCDate();
  destino.setUTCDate(Math.min(d, ultimo));
  return destino.toISOString().slice(0, 10);
}

/**
 * Las cuotas de un pago a plazos: iguales, redondeadas a 5 céntimos y con lo
 * que sobre en la primera, y una al mes desde el primer cargo. En 5 plazos
 * salen exactas: 198 € (Professional) y 318 € (Founder).
 */
export function calcularPlazos(total: number, plazos: number, primerCargo: string): Cuota[] {
  const base = Math.floor(total / plazos / 5) * 5;
  const resto = total - base * plazos;
  return Array.from({ length: plazos }, (_, i) => ({ n: i + 1, fecha: sumarMeses(primerCargo, i), importe: base + (i === 0 ? resto : 0) }));
}

/** Para el texto: «5 cuotas de 198 €», o la primera aparte si no salen iguales. */
export function resumenPlazos(cuotas: Cuota[]) {
  const [primera, ...resto] = cuotas;
  if (resto.every((c) => c.importe === primera.importe)) return `${cuotas.length} cuotas de ${euros(primera.importe)}`;
  return `${cuotas.length} cuotas: la primera de ${euros(primera.importe)} y ${resto.length} de ${euros(resto[0].importe)}`;
}
