import { LocaleLink } from "@/components/locale-link";

import { BrandMark } from "@/components/brand-mark";
import { SlackLogo } from "@/components/slack-logo";
import { PartnerSection, PartnerStrip } from "@/components/landing/partners";
import { LandingNav } from "@/components/landing/landing-nav";
import { RatingBadges } from "@/components/landing/rating-badges";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LeadForm } from "@/components/landing/lead-form";
import { StackBand } from "@/components/landing/stack-band";
import { Roadmap } from "@/components/landing/roadmap";
import { GlossarySection } from "@/components/landing/glossary-section";
import { BlogSection } from "@/components/landing/blog-section";
import { HeroBackdrop } from "@/components/landing/hero-backdrop";
import { FacultySection } from "@/components/landing/faculty-section";
import { getLocale } from "@/lib/i18n/server";
import { landingCopy, type LandingCopy } from "@/app/bienvenida/copy";
import { PROTOTYPE_ALUMNI } from "@/app/bienvenida/flags";
import { FlashCard } from "@/components/landing/flash-card";
import { FLASH_COURSES } from "@/lib/relampago/catalog";
import { stripeConfigured } from "@/lib/stripe/client";
import "@/app/bienvenida/landing.scss";
// La tarjeta de curso relámpago se usa aquí y en /cursos-relampago, y sus
// estilos viven en su propio archivo justo por eso (ver la cabecera de esa
// hoja): sin este import salía sin formato en la home.
import "@/components/landing/flash-card.scss";

// Mockups brutalistas del campus — hacen de "captura de producto" sin
// depender de fotos externas. Uno por feature (índice 0-2).
function FeatureMockup({ index, copy }: { index: number; copy: LandingCopy["mock"] }) {
  if (index === 0) {
    // Rejilla de módulos
    return (
      <div className="axr-mock axr-mock--modules" aria-hidden>
        {["MOD-01", "MOD-02", "MOD-03", "MOD-04"].map((code, i) => (
          <div key={code} className="axr-mock__module">
            <span className="axr-mock__module-code">{code}</span>
            <span className="axr-mock__module-line" style={{ width: `${70 - i * 8}%` }} />
            <span className="axr-mock__module-dot" data-on={i < 2} />
          </div>
        ))}
      </div>
    );
  }
  if (index === 1) {
    // Progreso / lección
    return (
      <div className="axr-mock axr-mock--progress" aria-hidden>
        <div className="axr-mock__row">
          <span className="axr-mock__badge">{copy.trackBadge}</span>
          <span className="axr-mock__pct">62%</span>
        </div>
        <div className="axr-mock__bar">
          <span style={{ width: "62%" }} />
        </div>
        <ul className="axr-mock__steps">
          {copy.steps.map((step, i) => (
            <li key={step} data-done={String(i < 2)}>
              {step}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // Notificación de Slack
  return (
    <div className="axr-mock axr-mock--slack" aria-hidden>
      <div className="axr-mock__msg">
        <span className="axr-mock__avatar">
          <BrandMark size={16} />
        </span>
        <div className="axr-mock__msg-body">
          <span className="axr-mock__msg-head">
            ActiveXRemote <em>APP</em>
          </span>
          <p>{copy.slackMsg}</p>
          <span className="axr-mock__msg-cta">{copy.slackCta} →</span>
        </div>
      </div>
    </div>
  );
}

export async function LandingView() {
  const locale = await getLocale();
  const c = landingCopy[locale];
  // Sin claves de Stripe no se pinta un botón de compra que va a reventar.
  const puedeComprar = stripeConfigured();


  return (
    <main className="axr-lp" data-snap>
      <LandingNav />

      {/* ── Hero ────────────────────────────────────── */}
      {/* Tres bloques y no dos: promesa, formulario y prueba social van por
          separado para poder reordenarlos. En móvil el formulario sube justo
          detrás del titular —es la única acción de la página— y la prueba
          social baja a reforzar. En escritorio vuelven a su sitio. */}
      <section className="axr-lp__hero">
        <HeroBackdrop />

        <div className="axr-lp__hero-inner">
          <div className="axr-lp__hero-brand">
            <BrandMark size={30} className="axr-lp__hero-mark" />
            <span className="axr-lp__hero-brand-name">{c.hero.brand}</span>
            <span className="axr-lp__hero-brand-sub">{c.hero.tagline}</span>
          </div>

          <h1 className="axr-lp__hero-title">
            <span className="axr-lp__hero-q">{c.hero.titleTop}</span>
            <span>{c.hero.titleBottom}</span>
          </h1>
          <p className="axr-lp__hero-lead">{c.hero.lead}</p>

          {/* Dos puertas, una por público. Es la primera decisión que tiene
              que tomar quien llega y ahora se puede tomar sin scroll: cada
              tarjeta lleva directa a la landing de su curso. */}
          <div className="axr-lp__hero-choose">
            <span className="axr-lp__hero-choose-label">{c.hero.chooseLabel}</span>
            <div className="axr-lp__hero-choose-opts">
              {c.hero.choose.map((opt) => (
                <LocaleLink key={opt.href} href={opt.href} className="axr-lp__hero-choice">
                  <strong>{opt.title}</strong>
                  <span>
                    {opt.name}
                    <span aria-hidden> →</span>
                  </span>
                </LocaleLink>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario de captación — primer punto de conversión de la página. */}
        <div className="axr-lp__hero-form">
          <span className="axr-lp__eyebrow">{c.form.eyebrow}</span>
          <h2 className="axr-lp__hero-form-title">{c.form.title}</h2>
          <LeadForm copy={c.form} variant="hero" />
        </div>

        <div className="axr-lp__hero-proof">
          <div className="axr-lp__hero-stats">
            {c.hero.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <RatingBadges items={c.ratings} />

          <PartnerStrip tone="dark" />
        </div>
      </section>

      {/* ── Proof strip ─────────────────────────────── */}
      {/* ── Todo lo que cubre el programa ─────────────── */}
      {/* Los temas, las herramientas y el aviso del stack real iban en tres
          secciones repartidas por la página y decían lo mismo. Aquí van
          juntas y justo detrás del héroe, que es donde esa idea sirve: acaba
          de leer la promesa y lo siguiente que necesita es saber de qué
          tamaño es lo que se le ofrece. */}
      <StackBand />

      <section id="caminos" className="axr-lp__paths">
        <header className="axr-lp__paths-head">
          <span className="axr-lp__eyebrow">{c.paths.eyebrow}</span>
          <h2>{c.paths.title}</h2>
          <p>{c.paths.lead}</p>
        </header>
        <div className="axr-lp__paths-grid">
          {c.paths.items.map((p, i) => (
            <article
              key={p.name}
              id={i === 0 ? "curso-professional" : "curso-founder"}
              className="axr-lp__path"
              data-variant={i}
            >
              <span className="axr-lp__path-tag">{p.tag}</span>
              <h3 className="axr-lp__path-name">{p.name}</h3>
              <span className="axr-lp__path-sub">{p.sub}</span>
              <p className="axr-lp__path-for">{p.forWho}</p>
              <p className="axr-lp__path-desc">{p.desc}</p>
              <ul className="axr-lp__path-list">
                {p.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <div className="axr-lp__path-actions">
                <a href="#solicitar" className="axr-lp__btn axr-lp__btn--invert axr-lp__path-cta">
                  {c.paths.cta}
                  <span aria-hidden>→</span>
                </a>
                <LocaleLink href={p.href} className="axr-lp__path-detail">
                  {c.paths.detail}
                  <span aria-hidden>→</span>
                </LocaleLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Cursos relámpago ────────────────────────── */}
      {/* Una banda, no una sección: dos líneas de texto y una tira con el
          curso debajo. Es una salida lateral para quien no está listo para
          un programa de 14 semanas, y una salida lateral no puede ocupar
          una pantalla entera en medio de la página que vende el programa.

          Todo lo demás —qué es un relámpago, el ciclo, la comparación— está
          en /cursos-relampago, que es a donde lleva. */}
      <section id="relampago" className="axr-lp__flash">
        <div className="axr-lp__flash-inner">
          <div className="axr-lp__flash-head">
            <div>
              <span className="axr-lp__eyebrow">{c.flash.eyebrow}</span>
              <h2>{c.flash.title}</h2>
            </div>
            <p>{c.flash.lead}</p>
          </div>

          <div className="axr-lp__flash-cards">
            {FLASH_COURSES.map((f) => (
              <FlashCard
                key={f.slug}
                course={f}
                locale={locale}
                copy={c.flash.card}
                tone="dark"
                variant="strip"
                canBuy={puedeComprar}
              />
            ))}
          </div>

          <LocaleLink href="/cursos-relampago" className="axr-lp__flash-all">
            {c.flash.allCta} →
          </LocaleLink>
        </div>
      </section>

      {/* ── Statement ───────────────────────────────── */}
      <section className="axr-lp__statement">
        <h2>
          {c.statement.top}
          <br />
          <em>{c.statement.bottom}</em>
        </h2>
      </section>

      {/* ── Features ────────────────────────────────── */}
      <section id="metodo" className="axr-lp__features">
        {c.features.map((f, i) => (
          <article key={f.title} className="axr-lp__feature" data-flip={i % 2 === 1}>
            <div className="axr-lp__feature-text">
              <span className="axr-lp__eyebrow">{f.eyebrow}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <ul className="axr-lp__feature-points">
                {f.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="axr-lp__feature-visual">
              <span className="axr-lp__feature-index">{String(i + 1).padStart(2, "0")}</span>
              <FeatureMockup index={i} copy={c.mock} />
            </div>
          </article>
        ))}
      </section>

      {/* ── Acceso / plan ───────────────────────────── */}
      {/* El precio, antes de pedir nada. Vivía en la sección 14 y dentro de
          una pregunta del FAQ: esconderlo en un producto de pago genera más
          fricción de la que evita. */}
      <section id="acceso" className="axr-lp__access">
        <div className="axr-lp__access-inner">
          <div className="axr-lp__access-text">
            <span className="axr-lp__eyebrow">{c.access.eyebrow}</span>
            <h2>{c.access.title}</h2>
            <p>{c.access.lead}</p>
          </div>
          <div className="axr-lp__plan">
            <div className="axr-lp__plan-head">
              <span className="axr-lp__plan-name">{c.access.planName}</span>
              <div className="axr-lp__plan-price">
                <strong>{c.access.planPrice}</strong>
                <span>{c.access.planNote}</span>
              </div>
            </div>
            <p className="axr-lp__plan-start">{c.access.planStart}</p>
            <ul className="axr-lp__plan-features">
              {c.access.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <p className="axr-lp__plan-bundle">{c.access.planBundle}</p>
            <LocaleLink
              href="/matricula"
              className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-lp__plan-cta"
            >
              {c.access.buyCta}
              <span aria-hidden>→</span>
            </LocaleLink>
            <a href="#solicitar" className="axr-lp__plan-alt">
              {c.access.infoCta}
            </a>
          </div>
        </div>
      </section>

      {/* ── Currículo (14 módulos) ──────────────────── */}
      <section id="modulos" className="axr-lp__curriculum">
        <header className="axr-lp__curriculum-head">
          <span className="axr-lp__eyebrow">{c.curriculum.eyebrow}</span>
          <h2>{c.curriculum.title}</h2>
          <p>{c.curriculum.lead}</p>
        </header>
        {/* Los 14 módulos desplegados eran varias pantallas de scroll en
            mitad del embudo. Se ve la estructura —dos fases, siete y siete— y
            el detalle se despliega quien lo quiera. <details> lo resuelve sin
            JavaScript, y el contenido sigue estando en el HTML para quien lo
            lee sin abrirlo: un buscador o un lector de pantalla. */}
        <details className="axr-lp__curriculum-fold">
          {/* <summary> sólo admite contenido de frase y un encabezado: de ahí
              que el tag y el enlace sean <span> y el título un <h3> suelto,
              en vez de envolverlo todo en un <div>. */}
          <summary>
            <span className="axr-lp__phase-tag">{c.curriculum.coreTag}</span>
            <h3>{c.curriculum.coreName}</h3>
            <span className="axr-lp__curriculum-more">
              {c.curriculum.coreToggle}
              <span className="axr-lp__faq-sign" aria-hidden />
            </span>
          </summary>
          <ol className="axr-lp__curriculum-grid">
            {c.curriculum.modules.map((m) => (
              <li key={m.n} className="axr-lp__module">
                <span className="axr-lp__module-n">{m.n}</span>
                <div>
                  <strong>{m.title}</strong>
                  <p>{m.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>

        {/* Fase 2: los 7 módulos propios de cada curso. */}
        <div className="axr-lp__curriculum-phase axr-lp__curriculum-phase--tracks">
          <span className="axr-lp__phase-tag">{c.curriculum.tracksTag}</span>
          <h3>{c.curriculum.tracksTitle}</h3>
        </div>
        <div className="axr-lp__tracks">
          {c.curriculum.tracks.map((track, i) => (
            <article key={track.name} className="axr-lp__track" data-variant={i}>
              <header className="axr-lp__track-head">
                <span className="axr-lp__track-tag">{track.tag}</span>
                <h4>{track.name}</h4>
              </header>
              <details className="axr-lp__curriculum-fold">
                <summary>
                  <span className="axr-lp__curriculum-more">
                    {c.curriculum.trackToggle}
                    <span className="axr-lp__faq-sign" aria-hidden />
                  </span>
                </summary>
                <ol className="axr-lp__track-modules">
                  {track.modules.map((m) => (
                    <li key={m.n}>
                      <span className="axr-lp__track-n">{m.n}</span>
                      <div>
                        <strong>{m.title}</strong>
                        <p>{m.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </details>
              <LocaleLink href={track.href} className="axr-lp__track-cta">
                {c.curriculum.trackCta}
                <span aria-hidden>→</span>
              </LocaleLink>
            </article>
          ))}
        </div>
      </section>

      {/* ── Acreditación ────────────────────────────── */}
      <PartnerSection />

      {/* ── Integración Slack ───────────────────────── */}
      {/* ── Cómo funciona: cronograma de la convocatoria ─ */}
      <section id="como" className="axr-lp__steps">
        <header className="axr-lp__steps-head">
          <span className="axr-lp__eyebrow">{c.steps.eyebrow}</span>
          <h2>{c.steps.title}</h2>
          <p>{c.steps.lead}</p>
        </header>
        <Roadmap copy={c.steps} />
      </section>

      {/* ── Alumni ──────────────────────────────────── */}
      {/* Cifras, testimonios y logos son de maqueta: la sección entera vive
          tras PROTOTYPE_ALUMNI y no se pinta hasta que los datos sean reales. */}
      {PROTOTYPE_ALUMNI && (
      <section id="alumni" className="axr-lp__social">
        <header className="axr-lp__social-head">
          <span className="axr-lp__eyebrow">{c.social.eyebrow}</span>
          <h2>{c.social.title}</h2>
          <p>{c.social.lead}</p>
          <div className="axr-lp__social-stats">
            {c.social.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </header>

        <div className="axr-lp__social-grid">
          {c.social.items.map((t) => (
            <figure key={t.name} className="axr-lp__testimonial">
              <blockquote>{t.quote}</blockquote>
              <figcaption>
                <span className="axr-lp__testimonial-avatar" aria-hidden>
                  {t.name.charAt(0)}
                </span>
                <span>
                  <strong>{t.name}</strong>
                  <em>{t.role}</em>
                </span>
                <span className="axr-lp__testimonial-course">{t.course}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="axr-lp__social-logos-title">{c.social.logosTitle}</p>
        <div className="axr-lp__social-logos">
          {c.social.logos.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </section>
      )}

      {/* ── Equipo docente ──────────────────────────── */}
      <FacultySection />

      {/* ── FAQ ─────────────────────────────────────── */}
      <section id="faq" className="axr-lp__faq">
        <header className="axr-lp__faq-head">
          <span className="axr-lp__eyebrow">{c.faq.eyebrow}</span>
          <h2>{c.faq.title}</h2>
        </header>
        <div className="axr-lp__faq-list">
          {c.faq.items.map((item, i) => (
            <details key={item.q} className="axr-lp__faq-item" open={i === 0}>
              <summary>
                <span>{item.q}</span>
                <span className="axr-lp__faq-sign" aria-hidden />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Fuera del embudo ────────────────────────── */}
      {/* Manifiesto, blog y diccionario van después del FAQ y antes del cierre:
          son contenido de marca y posicionamiento, no de venta, así que no
          interrumpen el camino hacia el CTA. Pero la página no termina en
          ellos — termina siempre en el formulario. */}
      {/* ── Bento stats ─────────────────────────────── */}
      <section className="axr-lp__bento">
        {/* "+320 profesionales formados" es la misma cifra inventada de la
            sección de alumni: mismo interruptor. */}
        {PROTOTYPE_ALUMNI && (
          <div className="axr-lp__bento-num">
            <strong>{c.bento.stat1.value}</strong>
            <span>{c.bento.stat1.label}</span>
          </div>
        )}
        <blockquote className="axr-lp__bento-quote">
          <p>{c.bento.quote}</p>
          <cite>{c.bento.quoteBy}</cite>
        </blockquote>
        <div className="axr-lp__bento-num axr-lp__bento-num--dark">
          <strong>{c.bento.stat2.value}</strong>
          <span>{c.bento.stat2.label}</span>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────── */}
      <BlogSection />

      {/* ── Diccionario ─────────────────────────────── */}
      {/* En la portada, una selección: los doce términos que más deciden en un
          proceso remoto internacional. Los 34 están en /glosario, y así la
          portada no duplica el hub entero. */}
      <GlossarySection
        only={[
          "employer-of-record",
          "contractor-internacional",
          "residencia-fiscal",
          "visado-nomada-digital",
          "solapamiento-horario",
          "trabajo-asincrono",
          "ats",
          "compensacion-global",
          "geo-pay",
          "negocio-borderless",
          "oferta-productizada",
          "stack-remoto",
        ]}
      />

      {/* ── Formulario final (destino de todos los CTA) ─ */}
      <section id="solicitar" className="axr-lp__final">
        <div className="axr-lp__final-inner">
          <div className="axr-lp__final-text">
            <span className="axr-lp__eyebrow">{c.form.eyebrow}</span>
            <h2>
              {c.finalCta.title}
              <br />
              <em>{c.finalCta.titleAccent}</em>
            </h2>
            <p>{c.finalCta.body}</p>
          </div>
          <LeadForm copy={c.form} variant="panel" />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
