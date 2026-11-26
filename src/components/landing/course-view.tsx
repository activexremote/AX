import { PartnerStrip } from "@/components/landing/partners";
import { DeelCourse, DeelSeal, DeelTag } from "@/components/landing/deel";
import { deelCourseCopy, deelCopy, deelWeek, deelWeeks } from "@/app/bienvenida/deel";
import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { BlogSection } from "@/components/landing/blog-section";
import { LeadForm } from "@/components/landing/lead-form";
import { HeroBackdrop } from "@/components/landing/hero-backdrop";
import { CourseFunnel } from "@/components/landing/course-funnel";
import { CourseModel } from "@/components/landing/course-model";
import { Icon } from "@/components/landing/course-icons";
import { LiveBar, PHASE_COLORS, PodArt, PromiseArt, WeekDonut } from "@/components/landing/course-visuals";
import { landingCopy } from "@/app/bienvenida/copy";
import { courseCopy, type CourseSlug } from "@/app/cursos/copy";
import { funnelCopy, modelCopy } from "@/app/cursos/signature";
import { getLocale } from "@/lib/i18n/server";
import "@/app/bienvenida/landing.scss";
import "@/app/cursos/course.scss";

// Landing de curso, formato 2.0 (8 semanas Professional, 13 Founder). Es el
// mismo recorrido que el dosier comercial en PDF, pensado para quien llega
// decidido: botón de reserva arriba, hoja de ruta con hitos, cómo se
// aprende, por qué funciona, reserva y formulario.
//
// Anclajes que usa el nav compartido: #modulos, #metodo, #faq, #solicitar.
// Sin precios, a petición del equipo: los botones de reserva bajan a
// #solicitar, que lleva el curso marcado, y admisiones da precio y plazos.
export async function CourseView({ slug }: { slug: CourseSlug }) {
  const locale = await getLocale();
  const c = courseCopy[locale][slug];
  const form = landingCopy[locale].form;
  const phaseColors = PHASE_COLORS[slug];
  const deelK = deelCourseCopy[locale];
  const deelTag = deelCopy[locale].tag;
  const accredited = deelWeeks(slug).map((n) => ({
    n,
    title: c.roadmap.weeks.find((w) => w.n === n)?.title ?? "",
    area: deelWeek(slug, n, locale) ?? "",
  }));

  return (
    <main className="axr-lp axr-cp axr-cv" data-course={slug}>
      <LandingNav />

      {/* ── Hero ────────────────────────────────────── */}
      <section className="axr-lp__hero">
        <HeroBackdrop />

        <div className="axr-lp__hero-inner axr-cv__hero">
          <span className="axr-cv__chip">{c.hero.eyebrow}</span>
          <h1 className="axr-cp__title">
            {c.hero.title} <em>{c.hero.titleHighlight}</em>
          </h1>
          <p className="axr-lp__hero-lead">{c.hero.lead}</p>

          <div className="axr-cv__ctas">
            <a href="#precio" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg">
              {c.hero.ctaPrimary}
              <span aria-hidden>→</span>
            </a>
            <a href="#modulos" className="axr-cv__btn-ghost">
              {c.hero.ctaSecondary}
            </a>
          </div>

          <p className="axr-cv__commit">
            <Icon name="reloj" size={16} stroke={2.2} />
            {c.hero.commitment}
          </p>

          <ul className="axr-cv__facts">
            {c.hero.facts.map((f) => (
              <li key={f.label}>
                <Icon name={f.icon} size={20} />
                <strong>{f.value}</strong>
                <span>{f.label}</span>
              </li>
            ))}
          </ul>

          <DeelSeal sub={deelK.seal(accredited.length)} />
        </div>

        {/* Formulario de captación — primer punto de conversión de la página. */}
        <div className="axr-lp__hero-form">
          <span className="axr-lp__eyebrow">{form.eyebrow}</span>
          <h2 className="axr-lp__hero-form-title">{c.hero.formTitle}</h2>
          <LeadForm copy={form} variant="hero" preselect={[slug]} />
        </div>

        <PartnerStrip tone="dark" full />
      </section>

      {/* ── Lo que te llevas ────────────────────────── */}
      <section className="axr-cv__promise">
        <div className="axr-cv__promise-text">
          <span className="axr-lp__eyebrow">{c.promise.eyebrow}</span>
          <h2>{c.promise.title}</h2>
          <p>{c.promise.lead}</p>
          <p className="axr-cv__note">{c.promise.note}</p>
        </div>
        <PromiseArt slug={slug} cards={c.promise.cards} ladder={c.promise.ladder ?? []} />
      </section>

      {/* ── Hoja de ruta ────────────────────────────── */}
      <section id="modulos" className="axr-cv__roadmap">
        <header className="axr-cp__head">
          <span className="axr-lp__eyebrow">{c.roadmap.eyebrow}</span>
          <h2>{c.roadmap.title}</h2>
          <p>{c.roadmap.lead}</p>
        </header>

        <p className="axr-cv__week0">
          <Icon name="personas" size={18} stroke={2.1} />
          <span>
            <b>{c.roadmap.week0.label}</b> {c.roadmap.week0.body}
          </span>
        </p>

        {/* Leyenda de fases y, debajo, las semanas en una sola rejilla: en
            el PDF son dos filas de cuatro; aquí se reparten solas según el
            ancho. Cada tarjeta lleva el color y el nombre de su fase. */}
        <ol className="axr-cv__phases">
          {c.roadmap.phases.map((phase, pi) => (
            <li key={phase.name} style={{ ["--c" as string]: phaseColors[pi] }}>
              <span className="axr-cv__phase-n">{String(pi + 1).padStart(2, "0")}</span>
              <strong>{phase.name}</strong>
              <span className="axr-cv__phase-weeks">{phase.weeks}</span>
            </li>
          ))}
        </ol>

        <ol className="axr-cv__weeks">
          {c.roadmap.weeks.map((w) => {
            const area = deelWeek(slug, w.n, locale);
            return (
              <li key={w.n} className="axr-cv__week" style={{ ["--c" as string]: phaseColors[w.phase] }}>
                <div className="axr-cv__week-top">
                  <span className="axr-cv__week-icon">
                    <Icon name={w.icon} size={22} stroke={2} />
                  </span>
                  <span className="axr-cv__week-n">
                    {c.roadmap.weekLabel} {w.n}
                    <small>{c.roadmap.phases[w.phase]?.name}</small>
                  </span>
                </div>
                {area ? <DeelTag label={deelTag} area={area} /> : null}
                <h3>{w.title}</h3>
                <p className="axr-cv__milestone">
                  <span>
                    <Icon name="check" size={12} stroke={3.2} />
                  </span>
                  {w.milestone}
                </p>
                <p className="axr-cv__week-lead">{w.lead}</p>
                <details className="axr-cv__keeps">
                  <summary>
                    {c.roadmap.keepsLabel}
                    <span className="axr-lp__faq-sign" aria-hidden />
                  </summary>
                  <ul>
                    {w.keeps.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
          {c.roadmap.demo ? (
            <li className="axr-cv__week axr-cv__week--demo" style={{ ["--c" as string]: phaseColors[phaseColors.length - 1] }}>
              <div className="axr-cv__week-top">
                <span className="axr-cv__week-icon">
                  <Icon name="estrella" size={22} stroke={2} />
                </span>
              </div>
              <h3>{c.roadmap.demo.title}</h3>
              <p className="axr-cv__week-lead">{c.roadmap.demo.body}</p>
            </li>
          ) : null}
        </ol>

        <div className="axr-cv__finish">
          <span className="axr-cv__finish-icon">
            <Icon name="diploma" size={24} stroke={2} />
          </span>
          <p>
            <b>{c.roadmap.finish.title}</b> {c.roadmap.finish.body}
          </p>
          <a href="#precio" className="axr-lp__btn axr-lp__btn--solid">
            {c.roadmap.finish.cta}
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* ── Cómo aprendes ───────────────────────────── */}
      <section id="metodo" className="axr-cv__learn">
        <header className="axr-cp__head">
          <span className="axr-lp__eyebrow">{c.learn.eyebrow}</span>
          <h2>{c.learn.title}</h2>
          <p>{c.learn.lead}</p>
        </header>

        <div className="axr-cv__learn-grid">
          <article className="axr-cv__box">
            <h3>
              <Icon name="reloj" size={18} stroke={2.2} />
              {c.learn.week.title}
            </h3>
            <WeekDonut slug={slug} parts={c.learn.week.parts} total={c.learn.week.total} perWeek={c.learn.week.perWeek} locale={locale} />
            <p className="axr-cv__note">{c.learn.week.note}</p>

            <h3 className="axr-cv__box-sep">
              <Icon name="video" size={18} stroke={2.2} />
              {c.learn.videos.title}
            </h3>
            <ol className="axr-cv__videos">
              {c.learn.videos.items.map((v, i) => (
                <li key={v}>
                  <b>{i + 1}</b>
                  {v}
                </li>
              ))}
            </ol>
          </article>

          <div className="axr-cv__learn-col">
            <article className="axr-cv__box">
              <h3>
                <Icon name="directo" size={18} stroke={2.2} />
                {c.learn.live.title}
              </h3>
              <LiveBar slug={slug} parts={c.learn.live.parts} />
              <p className="axr-cv__note">{c.learn.live.note}</p>
            </article>

            <article className="axr-cv__box axr-cv__box--dark">
              <h3>
                <Icon name="chispa" size={18} stroke={2.2} />
                {c.learn.ai.title}
              </h3>
              <ol className="axr-cv__ai">
                {c.learn.ai.items.map((t, i) => (
                  <li key={t}>
                    <b>{i + 1}</b>
                    {t}
                  </li>
                ))}
              </ol>
              <p className="axr-cv__note">{c.learn.ai.note}</p>
            </article>

            {c.learn.clinics ? (
              <article className="axr-cv__box axr-cv__box--soft">
                <h3>
                  <Icon name="personas" size={18} stroke={2.2} />
                  {c.learn.clinics.title}
                </h3>
                <ul className="axr-cv__clinics">
                  {c.learn.clinics.weeks.map((w) => (
                    <li key={w}>
                      <b>
                        {c.roadmap.weekLabel} {w}
                      </b>
                      <span>{c.learn.clinics!.length}</span>
                    </li>
                  ))}
                </ul>
                <p className="axr-cv__note">{c.learn.clinics.note}</p>
              </article>
            ) : null}
          </div>
        </div>

        <div className="axr-cv__pod">
          <PodArt slug={slug} />
          <div>
            <h3>{c.learn.pod.title}</h3>
            <p>{c.learn.pod.body}</p>
          </div>
          <ul>
            {c.learn.pod.items.map((t) => (
              <li key={t}>
                <Icon name="check" size={14} stroke={3} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Kit + sueldos / flujos de IA ─────────────── */}
      <section className="axr-cv__proof">
        <article className="axr-cv__box">
          <h3>
            <Icon name="maleta" size={18} stroke={2.2} />
            {c.kit.title}
          </h3>
          <p className="axr-cv__box-lead">{c.kit.lead}</p>
          <ul className="axr-cv__kit">
            {c.kit.items.map((k) => (
              <li key={k.label}>
                <Icon name={k.icon} size={18} stroke={2} />
                <span>{k.label}</span>
              </li>
            ))}
          </ul>
        </article>

        {c.salaries ? (
          <article className="axr-cv__box axr-cv__box--soft">
            <h3>
              <Icon name="avion" size={18} stroke={2.2} />
              {c.salaries.title}
            </h3>
            <div className="axr-cv__table-wrap">
              <table className="axr-cv__salaries">
                <thead>
                  <tr>
                    {c.salaries.cols.map((col) => (
                      <th key={col} scope="col">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.salaries.rows.map(([role, ...vals]) => (
                    <tr key={role}>
                      <th scope="row">{role}</th>
                      {vals.map((v, i) => (
                        <td key={`${role}-${i}`}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="axr-cv__note">{c.salaries.note}</p>
          </article>
        ) : null}

        {c.flows ? (
          <article className="axr-cv__box axr-cv__box--soft">
            <h3>
              <Icon name="rayo" size={18} stroke={2.2} />
              {c.flows.title}
            </h3>
            <p className="axr-cv__box-lead">{c.flows.lead}</p>
            {c.flows.items.map((f, fi) => (
              <div key={f.title} className="axr-cv__flow" style={{ ["--c" as string]: phaseColors[fi + 1] }}>
                <span className="axr-cv__flow-title">{f.title}</span>
                <ol>
                  {f.nodes.map((n) => (
                    <li key={n.label}>
                      <i>
                        <Icon name={n.icon} size={16} stroke={2} />
                      </i>
                      {n.label}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <p className="axr-cv__note">{c.flows.note}</p>
          </article>
        ) : null}
      </section>

      {/* ── Bloque firma del curso ──────────────────── */}
      {slug === "remote-professional" ? (
        <section className="axr-cp__signature axr-cp__signature--funnel">
          <header className="axr-cp__head">
            <span className="axr-lp__eyebrow">{funnelCopy[locale].eyebrow}</span>
            <h2>{funnelCopy[locale].title}</h2>
            <p>{funnelCopy[locale].lead}</p>
          </header>
          <CourseFunnel copy={funnelCopy[locale]} />
          <p className="axr-cp__signature-close">{funnelCopy[locale].close}</p>
        </section>
      ) : (
        <section className="axr-cp__signature axr-cp__signature--model">
          <header className="axr-cp__head">
            <span className="axr-lp__eyebrow">{modelCopy[locale].eyebrow}</span>
            <h2>{modelCopy[locale].title}</h2>
            <p>{modelCopy[locale].lead}</p>
          </header>
          <CourseModel copy={modelCopy[locale]} />
        </section>
      )}

      {/* ── ¿Para quién es? ─────────────────────────── */}
      <section id="para-quien" className="axr-cp__audience">
        <header className="axr-cp__head">
          <span className="axr-lp__eyebrow">{c.audience.eyebrow}</span>
          <h2>{c.audience.title}</h2>
          <p>{c.audience.lead}</p>
        </header>
        <div className="axr-cp__audience-grid axr-cv__audience">
          {c.audience.items.map((item, i) => (
            <article key={item.name} className="axr-cp__audience-card">
              <span className="axr-cp__audience-n">{String(i + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Deel ────────────────────────────────────── */}
      <DeelCourse weeks={accredited} />

      {/* ── Precio y reserva ────────────────────────── */}
      <section id="precio" className="axr-cv__pricing">
        <div className="axr-cv__pricing-inner">
          <div className="axr-cv__pricing-text">
            <span className="axr-lp__eyebrow">{c.pricing.eyebrow}</span>
            <h2>{c.pricing.title}</h2>
            <p>{c.pricing.lead}</p>
            <ul className="axr-cv__includes">
              {c.pricing.includes.map((t) => (
                <li key={t}>
                  <Icon name="check" size={15} stroke={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="axr-cv__plans">
            <a href="#solicitar" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg axr-cv__plan-cta">
              {c.pricing.cta}
              <span aria-hidden>→</span>
            </a>

            <ul className="axr-cv__guarantees">
              {c.pricing.guarantees.map((g) => (
                <li key={g.label}>
                  <Icon name={g.icon} size={15} stroke={2} />
                  {g.label}
                </li>
              ))}
            </ul>

            <a href="#solicitar" className="axr-cv__help">
              <Icon name="correo" size={20} stroke={2} />
              <span>
                <small>{c.pricing.help.lead}</small>
                <b>{c.pricing.help.cta} →</b>
              </span>
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

      {/* ── Blog ────────────────────────────────────── */}
      <BlogSection course={slug} />

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
