import { COHORT_START } from "@/app/bienvenida/cohort";
import { FLASH_COURSES } from "@/lib/relampago/catalog";

// ══════════════════════════════════════════════════════════
//  Catálogo comercial. Es la única fuente de verdad de qué se vende y a qué
//  precio; la copy de la landing y el FAQ tienen que decir esto mismo.
//
//  Los importes van en céntimos porque es la unidad que usa Stripe: trabajar
//  con euros en coma flotante y redondear al cobrar es la vía rápida a cobrar
//  2.399,99 €.
//
//  ⚠︎ Los identificadores de precio (price_…) NO se escriben aquí: viven en
//  variables de entorno porque cambian entre la cuenta de pruebas y la real.
//  `scripts/stripe-setup.mjs` crea los productos y te imprime las líneas que
//  hay que pegar en .env.local.
// ══════════════════════════════════════════════════════════

export type CourseKey = "remote-professional" | "remote-founder";
export const COURSE_KEYS: readonly CourseKey[] = ["remote-professional", "remote-founder"];

export function isCourseKey(v: unknown): v is CourseKey {
  return typeof v === "string" && (COURSE_KEYS as readonly string[]).includes(v);
}

/**
 * Clave de oferta.
 *
 * Formato 2.0 (nov. 2026): cada curso tiene su precio, así que la oferta lleva
 * el curso dentro (`professional-…`, `founder-…`) y ya no hay que leerlo del
 * formulario. `relampago-…` es un curso relámpago suelto.
 *
 * Las cuatro claves antiguas (`curso-…`, `pack-dos`) ya no se venden: siguen
 * aquí sólo para leer los pedidos que se hicieron con ellas (el webhook
 * necesita saber cuántos plazos tenía una suscripción viva).
 */
export type OfferKey =
  | "professional-unico"
  | "professional-plazos"
  | "founder-unico"
  | "founder-plazos"
  | LegacyOfferKey
  | `relampago-${string}`;

type LegacyOfferKey = "curso-unico" | "curso-plazos" | "curso-anticipada" | "pack-dos";

export type Offer = {
  key: OfferKey;
  /** Cuántos cursos entran. */
  courses: 1 | 2;
  /** El curso que se compra, cuando la oferta es de un curso concreto. */
  course?: CourseKey;
  /** "payment" cobra una vez; "subscription" son los plazos. */
  mode: "payment" | "subscription";
  plan: "unico" | "plazos" | "anticipada";
  /** Céntimos que se cobran en cada cargo. */
  unitAmount: number;
  /** Cuántos cargos. 1 salvo en los plazos. */
  charges: number;
  currency: "eur";
  /** Variable de entorno con el price_… correspondiente. */
  priceEnv: string;
  /** Si la oferta caduca, fecha límite en ISO. */
  until?: string;
};

/** Cuántas cuotas mensuales tienen los plazos de los dos cursos. */
export const INSTALMENTS = 5;

// Precios del formato 2.0 (nov. 2026), los mismos que los dosieres en PDF:
//   Professional: 890 € al contado, o 5 × 198 € = 990 €.
//   Founder:    1.490 € al contado, o 5 × 318 € = 1.590 €.
// A plazos se paga más que al contado: en ningún sitio se anuncian como
// «sin intereses».
export const OFFERS: Record<"professional-unico" | "professional-plazos" | "founder-unico" | "founder-plazos", Offer> = {
  "professional-unico": {
    key: "professional-unico",
    courses: 1,
    course: "remote-professional",
    mode: "payment",
    plan: "unico",
    unitAmount: 89000,
    charges: 1,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_PROFESSIONAL_UNICO",
  },
  "professional-plazos": {
    key: "professional-plazos",
    courses: 1,
    course: "remote-professional",
    // Suscripción mensual que se corta sola tras el último cobro: Checkout no
    // sabe hacer "cóbrame cinco veces y para", así que el webhook la cancela
    // cuando cuenta la última factura pagada.
    mode: "subscription",
    plan: "plazos",
    unitAmount: 19800,
    charges: INSTALMENTS,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_PROFESSIONAL_PLAZOS",
  },
  "founder-unico": {
    key: "founder-unico",
    courses: 1,
    course: "remote-founder",
    mode: "payment",
    plan: "unico",
    unitAmount: 149000,
    charges: 1,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_FOUNDER_UNICO",
  },
  "founder-plazos": {
    key: "founder-plazos",
    courses: 1,
    course: "remote-founder",
    mode: "subscription",
    plan: "plazos",
    unitAmount: 31800,
    charges: INSTALMENTS,
    currency: "eur",
    priceEnv: "STRIPE_PRICE_FOUNDER_PLAZOS",
  },
};

/**
 * Las ofertas del programa de 14 módulos. NO se venden: no entran en
 * ALL_OFFERS, así que el checkout las rechaza. Sólo las lee el webhook para
 * los pedidos que ya existían.
 */
const LEGACY_OFFERS: Record<LegacyOfferKey, Offer> = {
  "curso-unico": { key: "curso-unico", courses: 1, mode: "payment", plan: "unico", unitAmount: 199000, charges: 1, currency: "eur", priceEnv: "STRIPE_PRICE_CURSO_UNICO" },
  "curso-anticipada": { key: "curso-anticipada", courses: 1, mode: "payment", plan: "anticipada", unitAmount: 210000, charges: 1, currency: "eur", priceEnv: "STRIPE_PRICE_CURSO_ANTICIPADA" },
  "curso-plazos": { key: "curso-plazos", courses: 1, mode: "subscription", plan: "plazos", unitAmount: 73000, charges: 3, currency: "eur", priceEnv: "STRIPE_PRICE_CURSO_PLAZOS" },
  "pack-dos": { key: "pack-dos", courses: 2, mode: "payment", plan: "unico", unitAmount: 279000, charges: 1, currency: "eur", priceEnv: "STRIPE_PRICE_PACK_DOS" },
};

// ── Cursos relámpago ──────────────────────────────────────
// Se generan desde el registro de cursos en vez de escribirse a mano: así el
// precio que se cobra y el precio que anuncia la landing salen del MISMO
// sitio. Escribirlo dos veces es cómo se acaba cobrando 75 € por algo que la
// página anuncia a 65.

/** Nombre de la variable de entorno con el price_… de un relámpago. */
export function flashPriceEnv(courseKey: string): string {
  return `STRIPE_PRICE_RELAMPAGO_${courseKey.toUpperCase().replace(/-/g, "_")}`;
}

export const FLASH_OFFERS: Record<string, Offer> = Object.fromEntries(
  FLASH_COURSES.map((c) => [
    `relampago-${c.key}`,
    {
      key: `relampago-${c.key}` as OfferKey,
      courses: 1,
      mode: "payment",
      // Precio cerrado: sin plazos, sin matrícula anticipada y sin
      // convocatoria. Ése es medio producto.
      plan: "unico",
      unitAmount: c.priceCents,
      charges: 1,
      currency: "eur",
      priceEnv: flashPriceEnv(c.key),
    } satisfies Offer,
  ]),
);

/** La oferta de un relámpago a partir de su clave de curso. */
export function flashOffer(courseKey: string): Offer | undefined {
  return FLASH_OFFERS[`relampago-${courseKey}`];
}

/** Todas las ofertas que se pueden comprar, del tipo que sean. */
export const ALL_OFFERS: Record<string, Offer> = { ...OFFERS, ...FLASH_OFFERS };

/**
 * La oferta de un pedido ya hecho, también si es de las antiguas. Para el
 * webhook: nunca para abrir un pago.
 */
export function orderOffer(key: string): Offer | null {
  return ALL_OFFERS[key] ?? LEGACY_OFFERS[key as LegacyOfferKey] ?? null;
}

export function isOfferKey(v: unknown): v is OfferKey {
  return typeof v === "string" && v in ALL_OFFERS;
}

/** ¿Sigue viva la matrícula anticipada? Se comprueba en el servidor: que la
 *  oferta desaparezca del HTML no impide que alguien pida esa sesión de pago. */
export function isOfferAvailable(offer: Offer, now: Date = new Date()): boolean {
  if (!offer.until) return true;
  return now.getTime() <= new Date(offer.until).getTime();
}

/** Las ofertas del programa que se pueden comprar ahora mismo. */
export function availableOffers(now: Date = new Date()): Offer[] {
  return Object.values(OFFERS).filter((o) => isOfferAvailable(o, now));
}

/**
 * Ofertas del programa largo. `availableOffers()` NO las incluye a propósito:
 * la pantalla de matrícula vende el programa, y colar ahí un curso de 75 €
 * junto a uno de 890 € sólo consigue que nadie entienda qué está comprando.
 */
export function totalAmount(offer: Offer): number {
  return offer.unitAmount * offer.charges;
}

/**
 * Importe con el formato de cada idioma: 1.490 € / €1,490.
 *
 * `useGrouping: "always"` no es cosmético. En español, CLDR no agrupa los
 * números de cuatro cifras, así que por defecto salía "1490 €" mientras el
 * resto —dosieres, condiciones, equipo comercial— escribe "1.490 €". Que la cifra cambie de aspecto justo en la pantalla de pago es
 * de las cosas que hacen dudar de si es el mismo importe.
 */
export function formatAmount(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** La convocatoria a la que da acceso la compra. */
export const COHORT_START_ISO = COHORT_START;
