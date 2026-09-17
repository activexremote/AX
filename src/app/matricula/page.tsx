import type { Metadata, Viewport } from "next";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { CheckoutForm, type OfferView } from "@/components/landing/checkout-form";
import { LocaleLink } from "@/components/locale-link";
import { CHECKOUT_OPEN } from "@/app/bienvenida/flags";
import { checkoutCopy } from "@/app/matricula/copy";
import { getLocale } from "@/lib/i18n/server";
import { alternates } from "@/lib/seo";
import { stripeConfigured } from "@/lib/stripe/client";
import { availableOffers, formatAmount, totalAmount } from "@/lib/stripe/catalog";
import "@/app/bienvenida/landing.scss";
import "@/app/matricula/checkout.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = checkoutCopy[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: alternates(locale, "/matricula"),
    // Es un paso del embudo, no una página que deba competir en buscadores.
    robots: { index: false, follow: true },
  };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ curso?: string; oferta?: string; cancelado?: string }>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const c = checkoutCopy[locale];

  // Sin claves de Stripe no se enseña un botón de pago que va a reventar.
  const ready = stripeConfigured();

  // Con la matrícula cerrada no se calcula ni se envía al navegador ningún
  // importe: tampoco en el HTML ni en los datos de la página.
  const offers: OfferView[] = !CHECKOUT_OPEN ? [] : availableOffers().map((o) => ({
    key: o.key,
    courses: o.courses,
    amount: formatAmount(o.unitAmount, locale),
    total: formatAmount(totalAmount(o), locale),
    charges: o.charges,
    early: o.plan === "anticipada",
  }));

  return (
    <main className="axr-lp axr-checkout">
      <LandingNav base="/bienvenida" />

      <div className="axr-checkout__inner">
        <header className="axr-checkout__head">
          <span className="axr-lp__eyebrow">{c.eyebrow}</span>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </header>

        {/* Vuelta desde Stripe sin pagar. No se le regaña ni se le esconde el
            camino de salida: sus datos ya están guardados, así que basta con
            decirle que no se ha cobrado nada y dejar el pago a un clic. */}
        {sp.cancelado && CHECKOUT_OPEN ? (
          <div className="axr-checkout__notice" role="status">
            <strong>{c.cancelled.title}</strong>
            <p>{c.cancelled.body}</p>
            <p className="axr-checkout__notice-help">{c.cancelled.help}</p>
          </div>
        ) : null}

        {/* Matrícula cerrada (ver CHECKOUT_OPEN): ni ofertas ni precios, sólo
            el camino al formulario de información. */}
        {!CHECKOUT_OPEN ? (
          <div className="axr-checkout__notice" role="status">
            <strong>{c.closed.title}</strong>
            <p>{c.closed.body}</p>
            <LocaleLink
              href="/bienvenida#solicitar"
              className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-checkout__closed-cta"
            >
              {c.closed.cta}
              <span aria-hidden>→</span>
            </LocaleLink>
          </div>
        ) : ready ? (
          <CheckoutForm
            copy={c}
            offers={offers}
            initialCourse={sp.curso}
            initialOffer={sp.oferta}
          />
        ) : (
          <div className="axr-checkout__notice" role="status">
            <strong>{c.unavailable.title}</strong>
            <p>{c.unavailable.body}</p>
          </div>
        )}
      </div>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
