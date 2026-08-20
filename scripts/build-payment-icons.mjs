#!/usr/bin/env node
// Copia a public/logos/payment/ las marcas de pago del pie.
//
//   node scripts/build-payment-icons.mjs
//
// ── Por qué no salen de simple-icons ──────────────────────
// simple-icons dibuja siluetas de un solo color. Sirve para los iconos de
// herramientas, pero no para las tarjetas: Mastercard quedaba como una mancha
// roja en vez de sus dos círculos, y de Stripe salía la «S» en vez de su
// logotipo. Una marca de pago mal dibujada resta confianza en lugar de darla,
// que es justo lo contrario de lo que hace ahí abajo.
//
// Estas vienen del paquete `payment-icons` (MPL-2.0), que son las marcas de
// aceptación oficiales en color. Todas comparten viewBox 750×471 —la
// proporción estándar de la ficha de tarjeta—, así que la fila sale simétrica
// sin tener que recortar nada.
//
// ── Sobre el logotipo de Stripe ───────────────────────────
// public/logos/payment/stripe.svg es el logotipo (la palabra «stripe», no la
// «S») y NO se genera aquí: está guardado en el repositorio para que la
// compilación no dependa de la red. Su uso se rige por las normas de marca de
// Stripe, que permiten expresamente el distintivo «Powered by Stripe» a quien
// cobra con ellos. Si algún día se quiere ser estricto, se sustituye por el
// fichero de stripe.com/newsroom/brand-assets, que es el mismo dibujo.

import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "node_modules/payment-icons/min/flat";
const OUT = join("public", "logos", "payment");

// Las ocho redes que Stripe procesa con el método `card`. Ocho encaja en
// 4×2 y en 2×4: cualquiera de las dos rejillas queda cuadrada.
//
// No están Visa Electron ni Cartes Bancaires: Electron es débito de Visa y se
// procesa bajo su marca, y de CB el paquete no trae arte oficial.
const CARDS = [
  "visa",
  "mastercard",
  "amex",
  "maestro",
  "discover",
  "jcb",
  "diners",
  "unionpay",
];

mkdirSync(OUT, { recursive: true });

const faltan = [];
for (const card of CARDS) {
  const src = join(SRC, `${card}.svg`);
  if (!existsSync(src)) {
    faltan.push(card);
    continue;
  }
  copyFileSync(src, join(OUT, `${card}.svg`));
  console.log(`+ public/logos/payment/${card}.svg`);
}

if (!existsSync(join(OUT, "stripe.svg"))) {
  faltan.push("stripe (ver la nota de arriba: va versionado, no se genera)");
}

if (faltan.length) {
  console.error(`\n⚠︎ faltan: ${faltan.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`\n${CARDS.length} marcas de tarjeta + el logotipo de Stripe.`);
}
