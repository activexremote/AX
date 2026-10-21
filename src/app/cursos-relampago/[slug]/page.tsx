import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LocaleLink } from "@/components/locale-link";
import { FlashBuy } from "@/components/landing/flash-buy";
import { FlashVideo } from "@/components/landing/flash-video";
import { GiftIcon, NinjaIcon } from "@/components/landing/flash-icons";
import { BuildChain, LoopRing } from "@/components/landing/flash-diagrams";
import { UNLOCK_ART } from "@/components/landing/unlock-art";
import { FlashBuyButton } from "@/components/landing/flash-buy-button";
import { flashCopy } from "@/app/cursos-relampago/copy";
import { checkoutCopy } from "@/app/matricula/copy";
import { FLASH_COURSES, flashBySlug, flashStats } from "@/lib/relampago/catalog";
import { lessonsOf } from "@/lib/relampago/types";
import { formatAmount } from "@/lib/stripe/catalog";
import { stripeConfigured } from "@/lib/stripe/client";
import { getLocale } from "@/lib/i18n/server";
import { alternates, SITE_URL, SITE_NAME } from "@/lib/seo";
import { withLocale } from "@/lib/i18n/routing";
import "@/app/bienvenida/landing.scss";
import "@/app/cursos-relampago/relampago.scss";

export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

// ══════════════════════════════════════════════════════════
//  Página de un curso relámpago.
//
//  Es una página de producto que recibe tráfico de anuncios, no un folleto.
//  Quien llega no sabe quiénes somos y decide en segundos, así que el orden
//  es el de una decisión, no el de un índice:
//
//    ve el producto → se reconoce en el problema → ve qué se lleva →
//    ve qué hay dentro → ve el precio → compra.
//
//  El temario completo —24 lecciones con su misión— está, pero PLEGADO. Es
//  lo que necesita quien ya está convencido y quiere comprobar que hay
//  chicha; desplegado, es un muro de texto que echa a quien todavía no lo
//  está.
// ══════════════════════════════════════════════════════════

// Los cursos son un puñado y no cambian solos: se prerenderizan todos.
export function generateStaticParams() {
  return FLASH_COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = flashBySlug(slug);
  if (!course) return {};
  const locale = await getLocale();
  const s = flashStats(course);
  const title = `${course.title} · ${course.claim} · Curso relámpago`;
  const description =
    locale === "en"
      ? `${s.hours} hours of video, ${s.lessons} lessons and ${s.missions} graded missions. Taught in Spanish. ${formatAmount(course.priceCents, locale)}, one payment.`
      : `${s.hours} h de vídeo, ${s.lessons} lecciones y ${s.missions} misiones corregidas. ${formatAmount(course.priceCents, locale)}, un solo pago.`;
  return {
    title,
    description,
    alternates: alternates(locale, `/cursos-relampago/${slug}`),
    openGraph: { title, description, type: "website" },
  };
}

export default async function FlashCoursePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cancelado?: string }>;
}) {
  const { slug } = await params;
  const course = flashBySlug(slug);
  if (!course) notFound();

  const [locale, sp] = await Promise.all([getLocale(), searchParams]);
  const c = flashCopy[locale];
  const cc = c.course;
  const s = flashStats(course);
  const price = formatAmount(course.priceCents, locale);
  const ready = stripeConfigured();
  const chk = checkoutCopy[locale];
  const video = course.lessons[0]?.video ?? course.demoVideo;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.lead,
    inLanguage: "es",
    url: `${SITE_URL}${withLocale(locale, `/cursos-relampago/${course.slug}`)}`,
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    teaches: course.modules.map((m) => m.result),
    coursePrerequisites: course.level,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${s.videoMinutes}M`,
      inLanguage: "es",
    },
    offers: {
      "@type": "Offer",
      price: (course.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      category: "Paid",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}${withLocale(locale, `/cursos-relampago/${course.slug}`)}#comprar`,
    },
    hasPart: course.lessons.map((l) => ({
      "@type": "Course",
      name: l.title,
      description: l.outcome,
      timeRequired: `PT${l.minutes}M`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cc.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="axr-lp axr-flash axr-flash--course">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <LandingNav base="/bienvenida" ticker={false} />

      {/* ══ 1. Cabecera: el vídeo manda ══════════════════ */}
      <section className="axr-fhero">
        <div className="axr-fhero__inner">
          <div className="axr-fhero__text">
            <LocaleLink href="/cursos-relampago" className="axr-fhero__back">
              ← {cc.backToIndex}
            </LocaleLink>
            <span className="axr-fhero__code">{course.code}</span>
            <h1>{course.title}</h1>
            <p className="axr-fhero__claim">{course.claim}</p>
            <p className="axr-fhero__lead">{course.lead}</p>

            <div className="axr-fhero__cta">
              {/* Compra directa: de aquí a Stripe. El formulario de abajo sigue
                  existiendo para quien prefiera dejar sus datos antes. */}
              {ready ? (
                <FlashBuyButton
                  offerKey={`relampago-${course.key}`}
                  label={`${cc.buyNow} · ${price}`}
                  sending={chk.sending}
                  errorLabel={chk.errors.stripe}
                  className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
                />
              ) : (
                <a href="#comprar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
                  {cc.buyNow} · {price} <span aria-hidden>→</span>
                </a>
              )}
              <span className="axr-fhero__cta-note">{cc.priceNote}</span>
            </div>

            <ul className="axr-fhero__facts">
              <li><strong>{s.hours} h</strong><span>{c.card.hours}</span></li>
              <li><strong>{s.lessons}</strong><span>{c.card.lessons}</span></li>
              <li><strong>{s.missions}</strong><span>{c.card.missions}</span></li>
            </ul>
          </div>

          <div className="axr-fhero__media">
            {video && <FlashVideo src={video} poster={course.poster} label={cc.watch} />}
            {course.demoNotice && (
              <p className="axr-fhero__demo">
                <span>{cc.demoLabel}</span>
                {course.demoNotice}
              </p>
            )}
            {c.languageNote && <p className="axr-fhero__lang">{c.languageNote}</p>}
          </div>
        </div>
      </section>

      {/* ══ 2. El problema ═══════════════════════════════ */}
      <section className="axr-flash__problem-band">
        <div className="axr-flash__problem-inner">
          <span className="axr-lp__eyebrow">{cc.problemLabel}</span>
          <blockquote>{course.problem}</blockquote>
        </div>
      </section>

      {/* ══ 3. Qué construyes ════════════════════════════ */}
      <section className="axr-flash__build">
        <div className="axr-flash__build-inner">
          <div>
            <span className="axr-lp__eyebrow">{cc.buildLabel}</span>
            <BuildChain steps={course.build} />
          </div>
          <div>
            <span className="axr-lp__eyebrow">{cc.stackLabel}</span>
            <ul className="axr-flash__stack">
              {course.stack.map((tool) => <li key={tool}>{tool}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 4. El regalo y el truco ══════════════════════ */}
      <section id="extras" className="axr-flash__extras">
        <header className="axr-flash__head">
          <h2>{cc.extrasTitle}</h2>
          <p>{cc.extrasLead}</p>
        </header>

        <div className="axr-flash__extras-grid">
          {([
            [course.gift, "gift", <GiftIcon key="g" size={30} />],
            [course.ninja, "ninja", <NinjaIcon key="n" size={30} />],
          ] as const).map(([extra, kind, icon]) => (
            <article key={kind} className="axr-xcard" data-kind={kind}>
              <span className="axr-xcard__icon">{icon}</span>
              <span className="axr-xcard__tag">{extra.tag}</span>
              <h3>{extra.title}</h3>
              <p>{extra.body}</p>
              <p className="axr-xcard__hook">{extra.hook}</p>
            </article>
          ))}
        </div>
        <p className="axr-flash__extras-note">{cc.extrasNote}</p>
      </section>

      {/* ══ 5. Qué hay dentro: seis bloques ══════════════ */}
      <section id="temario" className="axr-flash__syllabus">
        <header className="axr-flash__head">
          <h2>{cc.curriculumTitle}</h2>
          <p>{cc.curriculumLead}</p>
        </header>

        <ol className="axr-flash__mods">
          {course.modules.map((m) => {
            const ls = lessonsOf(course, m);
            return (
              <li key={m.slug} className="axr-flash__mod" style={{ ["--mod" as string]: m.accent }}>
                <span className="axr-flash__mod-n">{String(m.n).padStart(2, "0")}</span>
                <h3>{m.title}</h3>
                <p>{m.summary}</p>
                <p className="axr-flash__mod-result">{m.result}</p>
                <span className="axr-flash__mod-meta">
                  {ls.length} {cc.lessonsWord} · {ls.reduce((a, l) => a + l.minutes, 0)} {cc.minutes}
                </span>
              </li>
            );
          })}
        </ol>

        {/* Plegado: quien ya está convencido lo abre; a quien no, no le tapa
            la página con veinticuatro fichas. */}
        <details className="axr-flash__full">
          <summary>{cc.seeSyllabus}</summary>
          <div className="axr-flash__full-body">
            {course.modules.map((m) => (
              <div key={m.slug} className="axr-flash__full-mod">
                <h4>{m.code}</h4>
                <ol>
                  {lessonsOf(course, m).map((l) => (
                    <li key={l.slug}>
                      <details>
                        <summary>
                          <span className="axr-flash__lesson-n">{String(l.n).padStart(2, "0")}</span>
                          <span className="axr-flash__lesson-title">{l.title}</span>
                          <span className="axr-flash__lesson-min">{l.minutes} {cc.minutes}</span>
                        </summary>
                        <div className="axr-flash__lesson-body">
                          <p className="axr-flash__lesson-hook">«{l.hook}»</p>
                          <p className="axr-flash__lesson-outcome">{l.outcome}</p>
                          <ul className="axr-flash__terms">
                            {l.terms.map((t) => <li key={t}>{t}</li>)}
                          </ul>
                          <dl className="axr-flash__mission">
                            <dt>{cc.missionLabel}</dt>
                            <dd>{l.mission.brief} <em>({l.mission.minutes} {cc.minutes})</em></dd>
                            <dt>{cc.criterionLabel}</dt>
                            <dd>{l.mission.criterion}</dd>
                            <dt>{cc.evidenceLabel}</dt>
                            <dd>{l.mission.evidence}</dd>
                          </dl>
                        </div>
                      </details>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* ══ 6. El ciclo ══════════════════════════════════ */}
      <section id="como" className="axr-flash__loop">
        <header className="axr-flash__head">
          <h2>{c.loopTitle}</h2>
        </header>
        <div className="axr-flash__loop-inner">
          <LoopRing steps={c.loop} />
          <ol className="axr-flash__loop-list">
            {c.loop.map((step) => (
              <li key={step.step}>
                <span className="axr-flash__loop-step">{step.step}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 7. Los cinco desbloqueos ═════════════════════ */}
      {/* Cada uno con su dibujo y con lo que trae dentro. Cinco títulos
          seguidos no dicen si lo que hay vale algo: la diferencia está entre
          «Prompt Pack» y «nueve prompts para arquitectura, RLS y deploy». */}
      <section className="axr-flash__unlocks">
        <header className="axr-flash__head">
          <h2>{cc.unlockTitle}</h2>
          <p>{cc.unlockLead}</p>
        </header>

        <div className="axr-gifts">
          {course.unlocks.map((u, i) => {
            const Art = UNLOCK_ART[u.key];
            return (
              <article key={u.key} className="axr-gift">
                <div className="axr-gift__top">
                  {Art ? <Art /> : null}
                  <span className="axr-gift__n">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="axr-gift__kind">{u.kind}</span>
                <h3>{u.title}</h3>
                <p>{u.description}</p>
                <ul className="axr-gift__list">
                  {u.contains.map((x) => <li key={x}>{x}</li>)}
                </ul>
              </article>
            );
          })}
        </div>

        <p className="axr-flash__extras-note">{cc.extrasNote}</p>
      </section>

      {/* ══ 8. Precio y compra ═══════════════════════════ */}
      <section id="comprar" className="axr-flash__buy">
        <div className="axr-flash__buy-inner">
          <div className="axr-flash__buy-side">
            <span className="axr-lp__eyebrow">{cc.priceTitle}</span>
            <p className="axr-flash__buy-price">{price}</p>
            <p className="axr-flash__buy-note">{cc.priceNote}</p>
            <ul className="axr-flash__includes">
              {cc.includes.map((x) => <li key={x}>{x}</li>)}
            </ul>
            <p className="axr-flash__honest-line">
              <strong>{cc.notPromisedTitle}</strong> {course.notPromised}
            </p>
          </div>

          <div className="axr-flash__buy-card">
            <h2>{cc.buyTitle}</h2>
            <p>{cc.buyLead}</p>

            {sp.cancelado && (
              <p className="axr-flash__cancelled" role="status">{cc.cancelled}</p>
            )}

            {ready ? (
              <FlashBuy
                offerKey={`relampago-${course.key}`}
                price={price}
                copy={{
                  firstName: chk.firstName,
                  lastName: chk.lastName,
                  email: chk.email,
                  emailHint: chk.emailHint,
                  consent: chk.consent,
                  submit: chk.submit,
                  sending: chk.sending,
                  secure: chk.secure,
                  errors: chk.errors,
                }}
              />
            ) : (
              <p className="axr-flash__error">{chk.errors.not_configured}</p>
            )}
          </div>
        </div>
      </section>

      {/* ══ 9. FAQ ═══════════════════════════════════════ */}
      <section id="faq" className="axr-flash__faq">
        <header className="axr-flash__head">
          <h2>{cc.faqTitle}</h2>
        </header>
        <div className="axr-flash__faq-list">
          {cc.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        {/* Quien termina de leer las preguntas ya ha resuelto sus dudas: o
            compra, o lo que buscaba era otra cosa. Las dos salidas, aquí. */}
        <div className="axr-flash__afterfaq">
          <h3>{cc.afterFaq.title}</h3>
          {ready ? (
            <FlashBuyButton
              offerKey={`relampago-${course.key}`}
              label={`${cc.afterFaq.buy} · ${price}`}
              sending={chk.sending}
              errorLabel={chk.errors.stripe}
              className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg"
            />
          ) : (
            <a href="#comprar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
              {cc.afterFaq.buy} · {price} <span aria-hidden>→</span>
            </a>
          )}

          <p className="axr-flash__afterfaq-or">{cc.afterFaq.or}</p>
          <div className="axr-flash__afterfaq-alt">
            <LocaleLink href="/cursos/remote-professional" className="axr-lp__btn axr-lp__btn--ghost">
              {cc.afterFaq.professional} <span aria-hidden>→</span>
            </LocaleLink>
            <LocaleLink href="/cursos/remote-founder" className="axr-lp__btn axr-lp__btn--ghost">
              {cc.afterFaq.founder} <span aria-hidden>→</span>
            </LocaleLink>
          </div>
        </div>
      </section>

      <LandingFooter base="/bienvenida" />
    </main>
  );
}
