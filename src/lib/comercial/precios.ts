// ══════════════════════════════════════════════════════════
//  Los precios de salida y el cálculo de los plazos
//
//  La fuente para el equipo comercial: el playbook, sus mensajes, el PDF y
//  la calculadora del gestor leen de aquí. (La web y Stripe tienen su propio
//  catálogo en lib/stripe/catalog.ts.)
//
//  A plazos se paga más que al contado (con un curso y con los dos): nunca
//  se anuncia como «sin intereses». Sin imports a propósito: los scripts de los PDF lo leen
//  con Node.
// ══════════════════════════════════════════════════════════

/** Céntimos, como Stripe: nada de euros en coma flotante. */
export const PRECIO_CONTADO = 199_000;
export const PRECIO_PLAZOS = 219_000;
/** Los dos cursos (lib/stripe/catalog.ts, «pack-dos»): el mismo descuento por pagar al contado que con uno. */
export const PRECIO_DOS_CONTADO = 279_000;
export const PRECIO_DOS_PLAZOS = 299_000;
export const PLAZOS_POR_DEFECTO = 3;
/** Entre cuántos plazos se puede repartir. Fuera de esto, lo decide el equipo. */
export const PLAZOS_MIN = 2;
export const PLAZOS_MAX = 6;
export const PLAZOS_MAX_DOS = 10;
/** El último día del curso: con un curso, un cargo después de esta fecha se avisa. */
export const FIN_CURSO = "2027-02-21";

export type Producto = "uno" | "dos";
export const PRODUCTOS: Record<Producto, { contado: number; plazos: number; maxCuotas: number; avisoFinCurso: boolean }> = {
  uno: { contado: PRECIO_CONTADO, plazos: PRECIO_PLAZOS, maxCuotas: PLAZOS_MAX, avisoFinCurso: true },
  // Hasta 10 cuotas: con los dos cursos el pago se alarga más allá del curso
  // a propósito, así que no se avisa.
  dos: { contado: PRECIO_DOS_CONTADO, plazos: PRECIO_DOS_PLAZOS, maxCuotas: PLAZOS_MAX_DOS, avisoFinCurso: false },
};

/** El día de hoy en Madrid, como «2026-11-11». */
export const hoyMadrid = (d = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(d);

const ENTEROS = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always", maximumFractionDigits: 0 });
const DECIMALES = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", useGrouping: "always", minimumFractionDigits: 2 });
/** 199000 → «1.990 €»; 73000 → «730 €»; 54750 → «547,50 €». */
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
 * que sobre en la primera, y una al mes desde el primer cargo. Con 2.190 €
 * salen exactas de 2 a 6 plazos (1.095, 730, 547,50, 438 y 365 €); con
 * 2.990 €, en 10 son 299 €.
 */
export function calcularPlazos(total: number, plazos: number, primerCargo: string): Cuota[] {
  const base = Math.floor(total / plazos / 5) * 5;
  const resto = total - base * plazos;
  return Array.from({ length: plazos }, (_, i) => ({ n: i + 1, fecha: sumarMeses(primerCargo, i), importe: base + (i === 0 ? resto : 0) }));
}

/** Para el texto: «3 cuotas de 730 €», o la primera aparte si no salen iguales. */
export function resumenPlazos(cuotas: Cuota[]) {
  const [primera, ...resto] = cuotas;
  if (resto.every((c) => c.importe === primera.importe)) return `${cuotas.length} cuotas de ${euros(primera.importe)}`;
  return `${cuotas.length} cuotas: la primera de ${euros(primera.importe)} y ${resto.length} de ${euros(resto[0].importe)}`;
}
