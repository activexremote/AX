import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { SlackLogo } from "@/components/slack-logo";
import { AccreditationRow, AccreditationSection } from "@/components/landing/accreditation";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LeadForm } from "@/components/landing/lead-form";
import { getLocale } from "@/lib/i18n/server";
import { landingCopy } from "@/app/bienvenida/copy";
import "@/app/bienvenida/landing.scss";

// Mockups brutalistas del campus — hacen de "captura de producto" sin
// depender de fotos externas. Uno por feature (índice 0-2).
function FeatureMockup({ index }: { index: number }) {
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
          <span className="axr-mock__badge">RUTA 02 · 3/5</span>
          <span className="axr-mock__pct">62%</span>
        </div>
        <div className="axr-mock__bar">
          <span style={{ width: "62%" }} />
        </div>
        <ul className="axr-mock__steps">
          <li data-done="true">Comunicar en asíncrono</li>
          <li data-done="true">Escribir para decidir</li>
          <li data-done="false">Proteger tu foco</li>
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
          <p>Nueva lección disponible en tu ruta · Ruta 03</p>
          <span className="axr-mock__msg-cta">Abrir en el campus →</span>
        </div>
      </div>
    </div>
  );
}

export async function LandingView() {
  const locale = await getLocale();
  const c = landingCopy[locale];

  return (
    <main className="axr-lp">
      <LandingNav />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="axr-lp__hero">
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

          <div className="axr-lp__hero-stats">
            {c.hero.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <AccreditationRow
            label={c.accreditation.heroLabel}
            partners={c.accreditation.partners}
            tone="dark"
          />
        </div>

        {/* Formulario de captación — primer punto de conversión de la página. */}
        <div className="axr-lp__hero-form">
          <span className="axr-lp__eyebrow">{c.form.eyebrow}</span>
          <h2 className="axr-lp__hero-form-title">{c.form.title}</h2>
          <LeadForm copy={c.form} variant="hero" />
        </div>
      </section>

      {/* ── Proof strip ─────────────────────────────── */}
      <section className="axr-lp__proof">
        <p className="axr-lp__proof-title">{c.proof.title}</p>
        <div className="axr-lp__proof-track">
          {[...c.proof.chips, ...c.proof.chips].map((chip, i) => (
            <span key={i} className="axr-lp__chip">
              {chip}
            </span>
          ))}
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
              <FeatureMockup index={i} />
            </div>
          </article>
        ))}
      </section>

      {/* ── Integración Slack ───────────────────────── */}
      <section className="axr-lp__integration">
        <div className="axr-lp__integration-inner">
          <SlackLogo size={40} />
          <div>
            <span className="axr-lp__eyebrow">{c.integration.eyebrow}</span>
            <h3>{c.integration.title}</h3>
            <p>{c.integration.body}</p>
          </div>
        </div>
      </section>

      {/* ── Bento stats ─────────────────────────────── */}
      <section className="axr-lp__bento">
        <div className="axr-lp__bento-num">
          <strong>{c.bento.stat1.value}</strong>
          <span>{c.bento.stat1.label}</span>
        </div>
        <blockquote className="axr-lp__bento-quote">
          <p>{c.bento.quote}</p>
          <cite>{c.bento.quoteBy}</cite>
        </blockquote>
        <div className="axr-lp__bento-num axr-lp__bento-num--dark">
          <strong>{c.bento.stat2.value}</strong>
          <span>{c.bento.stat2.label}</span>
        </div>
      </section>

      {/* ── Caminos ─────────────────────────────────── */}
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
                <Link href={p.href} className="axr-lp__path-detail">
                  {c.paths.detail}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Currículo (14 módulos) ──────────────────── */}
      <section id="modulos" className="axr-lp__curriculum">
        <header className="axr-lp__curriculum-head">
          <span className="axr-lp__eyebrow">{c.curriculum.eyebrow}</span>
          <h2>{c.curriculum.title}</h2>
          <p>{c.curriculum.lead}</p>
        </header>
        <div className="axr-lp__curriculum-phase">
          <span className="axr-lp__phase-tag">{c.curriculum.coreTag}</span>
          <h3>{c.curriculum.coreName}</h3>
        </div>
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
              <Link href={track.href} className="axr-lp__track-cta">
                {c.curriculum.trackCta}
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ── Acreditación ────────────────────────────── */}
      <AccreditationSection copy={c.accreditation} />

      {/* ── Alumni (placeholder: ver nota en copy.ts) ─── */}
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

      {/* ── Equipo ──────────────────────────────────── */}
      <section id="equipo" className="axr-lp__team">
        <header className="axr-lp__team-head">
          <span className="axr-lp__eyebrow">{c.team.eyebrow}</span>
          <h2>{c.team.title}</h2>
          <p>{c.team.lead}</p>
        </header>
        <div className="axr-lp__team-grid">
          {c.team.roles.map((r) => (
            <article key={r.role} className="axr-lp__role">
              <span className="axr-lp__role-tag">{r.tag}</span>
              <BrandMark size={28} className="axr-lp__role-mark" />
              <h3>{r.role}</h3>
              <p>{r.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Acceso / plan ───────────────────────────── */}
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
            <a href="#solicitar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-lp__plan-cta">
              {c.access.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Cómo funciona ───────────────────────────── */}
      <section id="como" className="axr-lp__steps">
        <header className="axr-lp__steps-head">
          <span className="axr-lp__eyebrow">{c.steps.eyebrow}</span>
          <h2>{c.steps.title}</h2>
        </header>
        <ol className="axr-lp__steps-grid">
          {c.steps.items.map((s) => (
            <li key={s.n} className="axr-lp__step">
              <span className="axr-lp__step-n">{s.n}</span>
              <strong>{s.title}</strong>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

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
