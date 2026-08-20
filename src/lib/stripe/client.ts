import "server-only";

import Stripe from "stripe";

import { OFFERS, type Offer } from "@/lib/stripe/catalog";

// Instancia única de Stripe. No se fija `apiVersion`: el SDK ya viene clavado
// a la versión con la que se generaron sus tipos (2026-07-29.dahlia), y
// escribir aquí otra distinta sólo consigue que los tipos mientan.
let cached: Stripe | null = null;

export function stripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Falta STRIPE_SECRET_KEY. Copia las claves de test del panel de Stripe a .env.local (ver .env.example).",
    );
  }
  cached = new Stripe(key, {
    // Aparece en el panel de Stripe junto a cada petición: ayuda a saber qué
    // la originó cuando algo falla en producción.
    appInfo: { name: "ActiveXRemote Campus", url: "https://activexremote.com" },
    maxNetworkRetries: 2,
  });
  return cached;
}

/** ¿Está Stripe configurado? Lo usan las páginas para no ofrecer un botón de
 *  pago que va a reventar. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

/**
 * El price_… de una oferta. Si falta, se avisa nombrando la variable: es el
 * error más probable al montar esto por primera vez y el mensaje por defecto
 * de Stripe ("No such price: undefined") no ayuda nada.
 */
export function priceIdFor(offer: Offer): string {
  const id = process.env[offer.priceEnv];
  if (!id) {
    throw new Error(
      `Falta ${offer.priceEnv} para la oferta "${offer.key}". Ejecuta "node scripts/stripe-setup.mjs" y pega en .env.local las líneas que imprime.`,
    );
  }
  return id;
}

/** Todas las variables de precio que faltan, para avisar de una vez. */
export function missingPriceEnvs(): string[] {
  return Object.values(OFFERS)
    .map((o) => o.priceEnv)
    .filter((name) => !process.env[name]);
}
