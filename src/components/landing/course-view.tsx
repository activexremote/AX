import { BrandMark } from "@/components/brand-mark";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LeadForm } from "@/components/landing/lead-form";
import { landingCopy } from "@/app/bienvenida/copy";
import { courseCopy, type CourseSlug } from "@/app/cursos/copy";
import { getLocale } from "@/lib/i18n/server";
import "@/app/bienvenida/landing.scss";
import "@/app/cursos/course.scss";

// Landing de curso. Misma estructura para los dos cursos: todo el contenido
// vive en cursos/copy.ts. Mantiene los anclajes del nav compartido
// (#modulos, #metodo, #faq, #solicitar) y los dos formularios: uno al entrar
// y otro en el último componente antes del footer.
export async function CourseView({ slug }: { slug: CourseSlug }) {
  const locale = await getLocale();
  const c = courseCopy[locale][slug];
  const form = landingCopy[locale].form;

  return (
    <main className="axr-lp axr-cp" data-course={slug}>
      <LandingNav />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="axr-lp__hero">
        <div className="axr-lp__hero-inner">
          <div className="axr-lp__hero-brand">
            <BrandMark size={26} className="axr-lp__hero-mark" />
            <span className="axr-lp__hero-brand-name">{c.hero.eyebrow}</span>
          </div>

          <h1 className="axr-cp__title">{c.hero.title}</h1>
          <p className="axr-cp__subtitle">{c.hero.subtitle}</p>
          <p className="axr-lp__hero-lead">{c.hero.lead}</p>

          <div className="axr-cp__hero-body">
            {c.hero.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="axr-lp__hero-stats axr-cp__facts">
            {c.hero.facts.map((f) => (
              <div key={f.label}>
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <a href="#solicitar" className="axr-lp__btn axr-lp__btn--invert axr-lp__btn--lg">
            {c.hero.cta}
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* Formulario de captación — primer punto de conversión de la página. */}
        <div className="axr-lp__hero-form">
          <span className="axr-lp__eyebrow">{form.eyebrow}</span>
          <h2 className="axr-lp__hero-form-title">{c.hero.formTitle}</h2>
          <LeadForm copy={form} variant="hero" preselect={[slug]} />
        </div>
      </section>

      {/* ── El cambio de contexto ───────────────────── */}
      <section className="axr-cp__shift">
        <div className="axr-cp__shift-inner">
          <div className="axr-cp__shift-text">
            <h2>{c.shift.title}</h2>
            {c.shift.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="axr-cp__shift-list">
            <span className="axr-lp__eyebrow">{c.shift.listLead}</span>
            <ul>
              {c.shift.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className="axr-cp__shift-close">{c.shift.close}</p>
          </div>
        </div>
      </section>

      {/* ── Enfoque ─────────────────────────────────── */}
      <section className="axr-cp__contrast">
        <div className="axr-cp__contrast-inner">
          <h2>{c.contrast.title}</h2>
          <p className="axr-cp__contrast-lead">{c.contrast.lead}</p>
          {c.contrast.highlight ? (
            <p className="axr-cp__contrast-highlight">{c.contrast.highlight}</p>
          ) : null}
          <div className="axr-cp__contrast-items">
            {c.contrast.items.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿Para quién es? ─────────────────────────── */}
      <section id="para-quien" className="axr-cp__audience">
        <header className="axr-cp__head">
          <h2>{c.audience.title}</h2>
          <p>{c.audience.lead}</p>
        </header>
        <div className="axr-cp__audience-grid">
          {c.audience.items.map((item, i) => (
            <article key={item.name} className="axr-cp__audience-card">
              <span className="axr-cp__audience-n">{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Lo que vas a construir ──────────────────── */}
      <section className="axr-cp__build">
        <header className="axr-cp__head">
          <h2>{c.build.title}</h2>
          <p>{c.build.lead}</p>
        </header>
        <ul className="axr-cp__build-grid">
          {c.build.items.map((item) => (
            <li key={item.name} className="axr-cp__build-card">
              <strong>{item.name}</strong>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── El programa (14 módulos) ────────────────── */}
      <section id="modulos" className="axr-cp__program">
        <header className="axr-cp__head">
          <span className="axr-lp__eyebrow">{c.program.eyebrow}</span>
          <h2>{c.program.title}</h2>
          <p>{c.program.lead}</p>
        </header>

        {c.program.phases.map((phase) => (
          <div key={phase.tag} className="axr-cp__phase">
            <header className="axr-cp__phase-head">
              <span className="axr-cp__phase-tag">{phase.tag}</span>
              <h3>{phase.name}</h3>
              {phase.lead ? <p>{phase.lead}</p> : null}
            </header>

            <ol className="axr-cp__modules">
              {phase.modules.map((m) => (
                <li key={m.n} className="axr-cp__module">
                  <span className="axr-cp__module-n">{m.n}</span>
                  <div className="axr-cp__module-body">
                    <strong>{m.title}</strong>
                    <p>{m.lead}</p>
                    <ul className="axr-cp__module-points">
                      {m.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                    {m.exercise ? (
                      <p className="axr-cp__module-exercise">
                        <span>{locale === "es" ? "Ejercicio" : "Exercise"}</span>
                        {m.exercise}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {/* ── Metodología ─────────────────────────────── */}
      <section id="metodo" className="axr-cp__method">
        <header className="axr-cp__head">
          <span className="axr-lp__eyebrow">{c.method.eyebrow}</span>
          <h2>{c.method.title}</h2>
          <p>{c.method.lead}</p>
        </header>
        <ol className="axr-cp__method-grid">
          {c.method.items.map((item) => (
            <li key={item.n} className="axr-cp__method-card">
              <span className="axr-cp__method-n">{item.n}</span>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>
        {c.method.note ? <p className="axr-cp__method-note">{c.method.note}</p> : null}
      </section>

      {/* ── El sistema (cadena) ─────────────────────── */}
      <section className="axr-cp__system">
        <div className="axr-cp__system-inner">
          <h2>{c.system.title}</h2>
          {c.system.lead.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ol className="axr-cp__chain">
            {c.system.chain.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="axr-cp__system-close">{c.system.close}</p>
        </div>
      </section>

      {/* ── Resultados ──────────────────────────────── */}
      <section className="axr-cp__outcomes">
        <header className="axr-cp__head">
          <h2>{c.outcomes.title}</h2>
        </header>
        <div className="axr-cp__outcomes-grid">
          {c.outcomes.items.map((item) => (
            <article key={item.title} className="axr-cp__outcome">
              <BrandMark size={22} className="axr-cp__outcome-mark" />
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Convocatoria y precio ───────────────────── */}
      <section id="convocatoria" className="axr-cp__enroll">
        <div className="axr-cp__enroll-inner">
          <div className="axr-cp__enroll-text">
            <span className="axr-lp__eyebrow">{c.enroll.eyebrow}</span>
            <h2>{c.enroll.title}</h2>
            <p>{c.enroll.lead}</p>
            <p className="axr-cp__enroll-bundle">{c.enroll.bundle}</p>
          </div>

          <div className="axr-lp__plan">
            <div className="axr-lp__plan-head">
              <span className="axr-lp__plan-name">{c.hero.title}</span>
              <div className="axr-lp__plan-price">
                <strong>{c.enroll.price}</strong>
                <span>{c.enroll.priceNote}</span>
              </div>
            </div>
            <ul className="axr-lp__plan-features">
              {c.enroll.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <a href="#solicitar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-lp__plan-cta">
              {c.enroll.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section id="faq" className="axr-lp__faq">
        <header className="axr-lp__faq-head">
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
            <span className="axr-lp__eyebrow">{form.eyebrow}</span>
            <h2>{c.closing.title}</h2>
            {c.closing.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <LeadForm copy={form} variant="panel" preselect={[slug]} submitLabel={c.closing.cta} />
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
