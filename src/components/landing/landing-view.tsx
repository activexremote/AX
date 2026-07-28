import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { SlackLogo } from "@/components/slack-logo";
import { LocaleToggle } from "@/components/locale-toggle";
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
      {/* ── Nav ─────────────────────────────────────── */}
      <header className="axr-lp__nav">
        <div className="axr-lp__nav-inner">
          <Link href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
            <BrandMark size={22} className="axr-lp__brand-mark" />
            <span>ActiveXRemote</span>
          </Link>

          <nav className="axr-lp__nav-links">
            {c.nav.links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="axr-lp__nav-meta">
            <LocaleToggle />
            <Link href="/login" className="axr-lp__btn axr-lp__btn--solid">
              {c.nav.enter}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="axr-lp__hero">
        <div className="axr-lp__hero-inner">
          <span className="axr-section-tag">{c.hero.tag}</span>
          <h1 className="axr-lp__hero-title">
            <span className="axr-lp__hero-q">{c.hero.titleTop}</span>
            <span>{c.hero.titleBottom}</span>
          </h1>
          <p className="axr-lp__hero-lead">{c.hero.lead}</p>

          <div className="axr-lp__hero-cta">
            <Link href="/login" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
              {c.hero.ctaPrimary}
              <span aria-hidden>→</span>
            </Link>
            <a href="#metodo" className="axr-lp__btn axr-lp__btn--ghost axr-lp__btn--lg">
              {c.hero.ctaSecondary}
            </a>
          </div>

          <div className="axr-lp__hero-stats">
            {c.hero.stats.map((s) => (
              <div key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Frame de "producto" — mockup brutalista del campus */}
        <div className="axr-lp__frame" aria-hidden>
          <div className="axr-lp__frame-bar">
            <span className="axr-lp__frame-dot" />
            <span>campus.activexremote</span>
            <span className="axr-lp__frame-tag">ES · EN</span>
          </div>
          <div className="axr-lp__frame-body">
            <BrandMark size={40} className="axr-lp__frame-mark" />
            <div className="axr-lp__frame-lines">
              <span style={{ width: "72%" }} />
              <span style={{ width: "54%" }} />
              <span style={{ width: "63%" }} />
            </div>
            <div className="axr-lp__frame-grid">
              <span>RUTA 01</span>
              <span>RUTA 02</span>
              <span>RUTA 03</span>
            </div>
          </div>
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
            <article key={p.name} className="axr-lp__path" data-variant={i}>
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
              <Link href="/login" className="axr-lp__btn axr-lp__btn--invert axr-lp__path-cta">
                {c.paths.cta}
                <span aria-hidden>→</span>
              </Link>
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
        <p className="axr-lp__curriculum-note">
          <span aria-hidden>+</span> {c.curriculum.pathNote}
        </p>
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
            <ul className="axr-lp__plan-features">
              {c.access.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link href="/login" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-lp__plan-cta">
              {c.access.cta}
              <span aria-hidden>→</span>
            </Link>
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

      {/* ── CTA final ───────────────────────────────── */}
      <section className="axr-lp__final">
        <div className="axr-lp__final-inner">
          <h2>
            {c.finalCta.title}
            <br />
            <em>{c.finalCta.titleAccent}</em>
          </h2>
          <p>{c.finalCta.body}</p>
          <Link href="/login" className="axr-lp__btn axr-lp__btn--invert axr-lp__btn--lg">
            {c.finalCta.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="axr-lp__footer">
        <div className="axr-lp__footer-inner">
          <div className="axr-lp__footer-brand">
            <Link href="/" className="axr-lp__brand" aria-label="ActiveXRemote">
              <BrandMark size={22} className="axr-lp__brand-mark" />
              <span>ActiveXRemote</span>
            </Link>
            <p>{c.footer.tagline}</p>
            <div className="axr-lp__footer-locale">
              <LocaleToggle tone="dark" />
            </div>
          </div>

          <div className="axr-lp__footer-cols">
            {c.footer.cols.map((col) => (
              <div key={col.title} className="axr-lp__footer-col">
                <span className="axr-lp__eyebrow">{col.title}</span>
                {col.links.map((l) =>
                  l.href.startsWith("#") ? (
                    <a key={l.label} href={l.href}>{l.label}</a>
                  ) : (
                    <Link key={l.label} href={l.href}>{l.label}</Link>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="axr-lp__footer-bar">
          <span>{c.footer.access}</span>
          <span>v1.0</span>
        </div>
      </footer>
    </main>
  );
}
