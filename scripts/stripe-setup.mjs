#!/usr/bin/env node
// Crea en Stripe los productos y precios del catálogo e imprime las líneas
// que hay que pegar en .env.local.
//
//   node scripts/stripe-setup.mjs            # muestra lo que haría
//   node scripts/stripe-setup.mjs --write    # lo crea de verdad
//
// Es idempotente: cada precio lleva una clave en sus metadatos (axr_offer), y
// si ya existe uno con esa clave y ese importe, se reutiliza en vez de crear
// un duplicado. Ejecutarlo dos veces no te deja el panel lleno de precios
// repetidos.

import Stripe from "stripe";
import { readFileSync } from "node:fs";

const WRITE = process.argv.includes("--write");

// .env.local no lo carga Node por su cuenta.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // el fichero puede no existir: no es un error
  }
}

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("Falta STRIPE_SECRET_KEY en .env.local (usa la clave de test: sk_test_…).");
  process.exit(1);
}
if (WRITE && !key.startsWith("sk_test_")) {
  console.error(
    "STRIPE_SECRET_KEY no es de test. Este script crea productos: ejecútalo primero\n" +
    "en modo test. Si de verdad quieres tocar la cuenta real, hazlo desde el panel.",
  );
  process.exit(1);
}

const stripe = new Stripe(key);

// Espejo de src/lib/stripe/catalog.ts. Se repite porque este script corre en
// Node pelado, sin el alias @/ ni TypeScript.
const CATALOG = [
  {
    offer: "curso-unico",
    env: "STRIPE_PRICE_CURSO_UNICO",
    product: "Curso ActiveXRemote · un camino",
    description: "14 módulos en directo: 7 de núcleo común y 7 del camino elegido.",
    unitAmount: 240000,
    recurring: null,
  },
  {
    offer: "curso-anticipada",
    env: "STRIPE_PRICE_CURSO_ANTICIPADA",
    product: "Curso ActiveXRemote · un camino",
    description: "14 módulos en directo: 7 de núcleo común y 7 del camino elegido.",
    unitAmount: 210000,
    recurring: null,
    nickname: "Matrícula anticipada",
  },
  {
    offer: "curso-plazos",
    env: "STRIPE_PRICE_CURSO_PLAZOS",
    product: "Curso ActiveXRemote · un camino",
    description: "14 módulos en directo: 7 de núcleo común y 7 del camino elegido.",
    unitAmount: 80000,
    recurring: { interval: "month" },
    nickname: "3 plazos sin intereses",
  },
  {
    offer: "pack-dos",
    env: "STRIPE_PRICE_PACK_DOS",
    product: "Curso ActiveXRemote · los dos caminos",
    description: "Los 21 módulos: el núcleo común y los dos caminos completos.",
    unitAmount: 390000,
    recurring: null,
  },
];

async function findProduct(name) {
  const found = await stripe.products.search({ query: `name:'${name}'`, limit: 1 });
  return found.data[0] ?? null;
}

async function findPrice(offer, unitAmount) {
  const found = await stripe.prices.search({
    query: `metadata['axr_offer']:'${offer}' AND active:'true'`,
    limit: 10,
  });
  return found.data.find((p) => p.unit_amount === unitAmount) ?? null;
}

const lines = [];
for (const item of CATALOG) {
  const existing = await findPrice(item.offer, item.unitAmount);
  if (existing) {
    console.log(`= ${item.offer.padEnd(18)} ya existe  ${existing.id}`);
    lines.push(`${item.env}=${existing.id}`);
    continue;
  }

  if (!WRITE) {
    console.log(
      `+ ${item.offer.padEnd(18)} se crearía  ${(item.unitAmount / 100).toFixed(2)} €` +
      (item.recurring ? " / mes ×3" : ""),
    );
    lines.push(`${item.env}=price_…`);
    continue;
  }

  let product = await findProduct(item.product);
  if (!product) {
    product = await stripe.products.create({
      name: item.product,
      description: item.description,
      metadata: { axr: "curso" },
    });
  }

  const price = await stripe.prices.create({
    product: product.id,
    currency: "eur",
    unit_amount: item.unitAmount,
    ...(item.recurring ? { recurring: item.recurring } : {}),
    ...(item.nickname ? { nickname: item.nickname } : {}),
    metadata: { axr_offer: item.offer },
  });
  console.log(`+ ${item.offer.padEnd(18)} creado      ${price.id}`);
  lines.push(`${item.env}=${price.id}`);
}

console.log("\n── Pega esto en .env.local ──────────────────────────────");
console.log(lines.join("\n"));
if (!WRITE) console.log("\n(simulación: vuelve a ejecutarlo con --write para crearlos)");
