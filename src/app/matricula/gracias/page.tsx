import type { Metadata, Viewport } from "next";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LocaleLink } from "@/components/locale-link";
import { checkoutCopy } from "@/app/matricula/copy";
import { getLocale } from "@/lib/i18n/server";
import { getOrderBySession } from "@/lib/data/orders";
import "@/app/bienvenida/landing.scss";
import "@/app/matricula/checkout.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: checkoutCopy[locale].thanks.title,
    robots: { index: false, follow: false },
  };
}

/**
 * Página de vuelta desde Stripe.
 *
 * Sólo informa: el acceso lo concede el webhook, nunca esta página. El
 * navegador puede no volver jamás y, al revés, esta URL la puede abrir
 * cualquiera; si de ella dependiera la matrícula, bastaría con adivinar el
 * enlace para entrar gratis.
 *
 * Como el webhook y esta redirección corren en paralelo, es normal llegar
 * aquí un segundo antes de que el pedido esté marcado: por eso hay un estado
 * "lo estamos confirmando" en vez de un error.
 */
export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const locale = await getLocale();
  const c = checkoutCopy[locale].thanks;

  const order = sessionId ? await getOrderBySession(sessionId) : null;
  const confirmed =
    order?.status === "pagado" ||
    order?.status === "en_plazos" ||
    order?.status === "completado";

  return (
    <main className="axr-lp axr-checkout">
      <LandingNav base="/bienvenida" />

      <div className="axr-checkout__inner axr-checkout__inner--narrow">
        <div className="axr-checkout__done">
          <span className="axr-checkout__done-mark" aria-hidden>
            {confirmed ? "✓" : "…"}
          </span>

          <h1>{confirmed ? c.title : c.pendingTitle}</h1>
          <p>{confirmed ? c.body : c.pendingBody}</p>

          {confirmed ? (
            <>
              <p className="axr-checkout__done-inbox">{c.inbox}</p>
              {order?.plan === "plazos" ? (
                <p className="axr-checkout__done-note">{c.instalmentsNote}</p>
              ) : null}
              <div className="axr-checkout__done-actions">
                <LocaleLink href="/login" className="axr-lp__btn axr-lp__btn--solid">
                  {c.campus}
                  <span aria-hidden>→</span>
                </LocaleLink>
                <LocaleLink href="/bienvenida" className="axr-lp__btn">
                  {c.home}
                </LocaleLink>
              </div>
            </>
          ) : (
            <div className="axr-checkout__done-actions">
              <LocaleLink href="/bienvenida" className="axr-lp__btn">
                {c.home}
              </LocaleLink>
            </div>
          )}
        </div>
      </div>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
