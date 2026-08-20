// Bloque de confianza del pie: cifrado, tarjetas aceptadas y quién cobra.
//
// ── Dónde vive y por qué ──────────────────────────────────
// Dentro de la columna de marca, bajo el selector de idioma. Como franja
// aparte a lo ancho ocupaba media pantalla de pie para decir tres cosas; ahí
// dentro aprovecha el hueco que esa columna ya dejaba y el pie vuelve a
// caber de una vez.
//
// Las fichas van pequeñas a propósito. Una marca de aceptación no está para
// leerse: está para reconocerse de un vistazo, y a este tamaño se reconocen
// igual sin robarle el sitio a los enlaces.
//
// ── Sobre las marcas ──────────────────────────────────────
// Los SVG son las marcas de aceptación oficiales en color (ver
// scripts/build-payment-icons.mjs). Todas comparten la proporción 750×471, así
// que las ocho fichas son idénticas y la rejilla sale cuadrada sin trucos.
//
// ⚠︎ La aceptación real de American Express, Discover, JCB, Diners y UnionPay
// depende del país de la cuenta y del adquirente. Cuando la cuenta de Stripe
// esté activa, comprueba cuáles liquidan de verdad y quita del script las que
// no: enseñar una tarjeta que luego se rechaza en el checkout es peor que no
// enseñarla.

const CARDS = [
  { file: "visa", label: "Visa" },
  { file: "mastercard", label: "Mastercard" },
  { file: "amex", label: "American Express" },
  { file: "maestro", label: "Maestro" },
  { file: "discover", label: "Discover" },
  { file: "jcb", label: "JCB" },
  { file: "diners", label: "Diners Club" },
  { file: "unionpay", label: "UnionPay" },
] as const;

export function PaymentBadges({
  copy,
}: {
  copy: { secure: string; accepted: string; processor: string };
}) {
  return (
    <section className="axr-pay" aria-label={copy.accepted}>
      {/* Candado dibujado, no un emoji: el brandbook los prohíbe en material
          de marca, y así hereda el color del pie. */}
      <p className="axr-pay__secure">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden focusable="false">
          <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <rect x="4" y="10" width="16" height="11" rx="1" fill="currentColor" />
        </svg>
        <span>{copy.secure}</span>
      </p>

      <ul className="axr-pay__cards">
        {CARDS.map((card) => (
          <li key={card.file}>
            {/* Sin next/image: son ocho SVG de 1-9 kB que no se benefician
                del optimizador, y así el pie no arrastra ocho peticiones más. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/payment/${card.file}.svg`}
              alt={card.label}
              width={750}
              height={471}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>

      <p className="axr-pay__processor">
        <span>{copy.processor}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/payment/stripe.svg"
          alt="Stripe"
          width={512}
          height={214}
          loading="lazy"
          decoding="async"
        />
      </p>
    </section>
  );
}
