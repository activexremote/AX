import type { Metadata, Viewport } from "next";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LocaleLink } from "@/components/locale-link";
import { HeroBackdrop } from "@/components/landing/hero-backdrop";
import { FlashCard, FlashSoonCard } from "@/components/landing/flash-card";
import { FlashThumb } from "@/components/landing/flash-thumb";
import { FlashBuyButton } from "@/components/landing/flash-buy-button";
import { GiftIcon, NinjaIcon } from "@/components/landing/flash-icons";
import { LoopRing, ScaleBars } from "@/components/landing/flash-diagrams";
import { flashCopy } from "@/app/cursos-relampago/copy";
import { FLASH_COURSES, featuredFlash, flashStats } from "@/lib/relampago/catalog";
import { formatAmount } from "@/lib/stripe/catalog";
import { stripeConfigured } from "@/lib/stripe/client";
import { getLocale } from "@/lib/i18n/server";
import { alternates, SITE_URL } from "@/lib/seo";
import { withLocale } from "@/lib/i18n/routing";
import "@/app/bienvenida/landing.scss";
import "@/app/cursos-relampago/relampago.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = flashCopy[locale];
  return {
    title: c.meta.title,
    description: c.meta.description,
    alternates: alternates(locale, "/cursos-relampago"),
    openGraph: { title: c.meta.title, description: c.meta.description, type: "website" },
  };
}

export default async function FlashIndexPage() {
  const locale = await getLocale();
  const c = flashCopy[locale];
  const ready = stripeConfigured();

  // El destacado y el resto. Hoy hay uno, así que la rejilla de abajo sólo
  // lleva el hueco de «vienen más»; cuando haya cuatro, el destacado sigue
  // arriba y los otros tres caen en la rejilla sin tocar nada.
  const destacado = featuredFlash();
  const resto = FLASH_COURSES.filter((f) => f.slug !== destacado.slug);
  const ds = flashStats(destacado);

  // ItemList: le dice al buscador que esto es un catálogo y cuántos cursos
  // tiene, en vez de dejarle adivinarlo de las tarjetas.
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: c.title,
    description: c.meta.description,
    numberOfItems: FLASH_COURSES.length,
    itemListElement: FLASH_COURSES.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}${withLocale(locale, `/cursos-relampago/${f.slug}`)}`,
      name: f.title,
    })),
  };

  return (
    <main className="axr-lp axr-flash">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LandingNav base="/bienvenida" ticker={false} />

      {/* ── Cabecera: titular, una línea y los cuatro rasgos. Nada más. ── */}
      <section className="axr-lp__hero axr-flash__hero axr-flash__hero--index">
        <HeroBackdrop />
        <div className="axr-lp__hero-inner axr-flash__hero-inner">
          <span className="axr-lp__eyebrow">{c.eyebrow}</span>
          <h1 className="axr-lp__hero-title">{c.title}</h1>
          <p className="axr-lp__hero-lead">{c.lead}</p>
          {c.languageNote && <p className="axr-flash__lang">{c.languageNote}</p>}

          {/* La cabecera tenía cuatro cajas de texto y ni un botón: quien
              llegaba convencido no tenía dónde pulsar y se iba a buscarlo. */}
          <div className="axr-flash__hero-cta">
            {ready && (
              <FlashBuyButton
                offerKey={`relampago-${destacado.key}`}
                label={`${c.cta.heroBuy} · ${formatAmount(destacado.priceCents, locale)}`}
                sending={c.card.sending}
                errorLabel={c.card.buyError}
                className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
              />
            )}
            <LocaleLink
              href={`/cursos-relampago/${destacado.slug}`}
              className="axr-lp__btn axr-lp__btn--invert"
            >
              {c.cta.heroSee} <span aria-hidden>→</span>
            </LocaleLink>
          </div>

          <ul className="axr-flash__traits">
            {c.traits.map((t, i) => (
              <li key={t.title}>
                <span className="axr-flash__trait-n">{String(i + 1).padStart(2, "0")}</span>
                <strong>{t.title}</strong>
                <span>{t.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── El destacado ── */}
      <section id="catalogo" className="axr-feat">
        <div className="axr-feat__inner">
          <div className="axr-feat__media">
            {destacado.poster && (
              <LocaleLink
                href={`/cursos-relampago/${destacado.slug}`}
                aria-label={destacado.title}
              >
                <FlashThumb
                  poster={destacado.poster}
                  video={destacado.demoVideo}
                  alt={destacado.title}
                  badge={`${ds.hours} h`}
                />
              </LocaleLink>
            )}
          </div>

          <div className="axr-feat__text">
            <span className="axr-feat__badge">{c.featuredLabel}</span>
            <span className="axr-feat__code">{destacado.code}</span>
            <h2>{destacado.title}</h2>
            <p className="axr-feat__claim">{destacado.claim}</p>
            <p className="axr-feat__lead">{destacado.lead}</p>

            <ul className="axr-feat__extras">
              <li>
                <span className="axr-feat__extra-icon" data-kind="gift"><GiftIcon size={18} /></span>
                <span><strong>{c.card.gift}</strong> {destacado.gift.title}</span>
              </li>
              <li>
                <span className="axr-feat__extra-icon" data-kind="ninja"><NinjaIcon size={18} /></span>
                <span><strong>{c.card.ninja}</strong> {destacado.ninja.title}</span>
              </li>
            </ul>

            <div className="axr-feat__actions">
              {ready && (
                <FlashBuyButton
                  offerKey={`relampago-${destacado.key}`}
                  label={`${c.card.buy} · ${formatAmount(destacado.priceCents, locale)}`}
                  sending={c.card.sending}
                  errorLabel={c.card.buyError}
                  className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
                />
              )}
              <LocaleLink
                href={`/cursos-relampago/${destacado.slug}`}
                className="axr-feat__detail"
              >
                {c.featuredCta} →
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      {/* ── El resto del catálogo ──
          Mientras sólo haya un curso, montar aquí una sección con su titular
          para enseñar una caja de puntos sería anunciar un catálogo que no
          existe. Se degrada a una banda de una línea; en cuanto haya un
          segundo curso, vuelve la rejilla. */}
      {resto.length > 0 ? (
        <section className="axr-flash__list">
          <header className="axr-flash__head">
            <h2>{c.listTitle}</h2>
            <p>{c.listLead}</p>
          </header>
          <div className="axr-flash__cards">
            {resto.map((f) => (
              <FlashCard key={f.slug} course={f} locale={locale} copy={c.card} canBuy={ready} />
            ))}
            <FlashSoonCard title={c.soonTitle} body={c.soonBody} />
          </div>
        </section>
      ) : (
        <section className="axr-flash__soon-band">
          <p>
            <strong>{c.soonTitle}</strong> {c.soonBody}
          </p>
        </section>
      )}

      {/* ── El ciclo, en seis pasos cortos ── */}
      <section id="como" className="axr-flash__loop">
        <header className="axr-flash__head">
          <h2>{c.loopTitle}</h2>
        </header>
        <div className="axr-flash__loop-inner">
          <LoopRing steps={c.loop} />
          <ol className="axr-flash__loop-list">
            {c.loop.map((s) => (
              <li key={s.step}>
                <span className="axr-flash__loop-step">{s.step}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="axr-flash__section-cta">
          {ready ? (
            <FlashBuyButton
              offerKey={`relampago-${destacado.key}`}
              label={`${c.cta.afterLoop} · ${formatAmount(destacado.priceCents, locale)}`}
              sending={c.card.sending}
              errorLabel={c.card.buyError}
              className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
            />
          ) : null}
          <LocaleLink href={`/cursos-relampago/${destacado.slug}#temario`} className="axr-flash__cta-alt">
            {c.cta.orSee} →
          </LocaleLink>
        </div>
      </section>

      {/* ── Relámpago o programa ── */}
      <section className="axr-flash__vs">
        <header className="axr-flash__head">
          <h2>{c.vsTitle}</h2>
          <p>{c.vsLead}</p>
        </header>
        <ScaleBars
          flashLabel={c.scale.flash}
          flashValue={c.scale.flashValue}
          programLabel={c.scale.program}
          programValue={c.scale.programValue}
          note={c.scale.note}
        />

        <div className="axr-flash__vs-grid">
          <div className="axr-flash__vs-col" data-kind="flash">
            <h3>{c.flashLabel}</h3>
            <ul>{c.vs.flash.map((x) => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="axr-flash__vs-col" data-kind="program">
            <h3>{c.programLabel}</h3>
            <ul>{c.vs.program.map((x) => <li key={x}>{x}</li>)}</ul>
            <LocaleLink href="/bienvenida" className="axr-flash__vs-link">
              {locale === "en" ? "See the programme" : "Ver el programa"} →
            </LocaleLink>
          </div>
        </div>

        <div className="axr-flash__section-cta">
          {ready && (
            <FlashBuyButton
              offerKey={`relampago-${destacado.key}`}
              label={`${c.cta.afterVs} · ${formatAmount(destacado.priceCents, locale)}`}
              sending={c.card.sending}
              errorLabel={c.card.buyError}
              className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
            />
          )}
        </div>
      </section>

      {/* ── El cierre ──
          Una landing sin CTA final deja ir a quien ha leído hasta abajo, que
          es justo el que estaba más cerca de comprar. */}
      <section id="empezar" className="axr-flash__final">
        <div className="axr-flash__final-inner">
          <span className="axr-lp__eyebrow">{c.cta.finalEyebrow}</span>
          <h2>{c.cta.finalTitle}</h2>
          <p>{c.cta.finalLead}</p>

          <div className="axr-flash__final-cta">
            {ready ? (
              <FlashBuyButton
                offerKey={`relampago-${destacado.key}`}
                label={`${c.cta.heroBuy} · ${formatAmount(destacado.priceCents, locale)}`}
                sending={c.card.sending}
                errorLabel={c.card.buyError}
                className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
              />
            ) : (
              <LocaleLink
                href={`/cursos-relampago/${destacado.slug}#comprar`}
                className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
              >
                {c.cta.heroBuy} <span aria-hidden>→</span>
              </LocaleLink>
            )}
            <LocaleLink
              href={`/cursos-relampago/${destacado.slug}`}
              className="axr-lp__btn axr-lp__btn--invert axr-lp__btn--lg"
            >
              {c.cta.heroSee} <span aria-hidden>→</span>
            </LocaleLink>
          </div>

          <p className="axr-flash__final-note">{c.cta.finalNote}</p>
        </div>
      </section>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
