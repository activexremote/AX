import { LocaleLink } from "@/components/locale-link";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { CookieSettingsLink } from "@/components/consent/cookie-settings-link";
import { PaymentBadges } from "@/components/landing/payment-badges";
import { LeadForm } from "@/components/landing/lead-form";
import { SlackLogo } from "@/components/slack-logo";
import { TOOL_ICONS } from "@/components/landing/tool-icons";
import { AdClocks, AdFx, AdHeroVideo, AdLiveVideo, AdStickyBar } from "@/components/landing/ad-fx";
import { AdMap } from "@/components/landing/ad-map";
import { PLACEHOLDER_LOGOS, PlaceholderLogos } from "@/components/landing/ad-logos";
import { adCopy } from "@/app/trabajo-remoto/copy";
import { COHORT_START, STACK_TOOLS, WHATSAPP_NUMBER } from "@/app/trabajo-remoto/contact";
import { landingCopy } from "@/app/bienvenida/copy";
import { DEMO_FACULTY, FACULTY } from "@/app/bienvenida/faculty";
import { PARTNERS, partnerLogo } from "@/app/bienvenida/partners";
import { ENTITY } from "@/app/legal/entity";
import { TOOLS, type Tool } from "@/app/bienvenida/tools";
import { getLocale } from "@/lib/i18n/server";
import "@/app/trabajo-remoto/ad-landing.scss";

// ══════════════════════════════════════════════════════════
//  Landing de campaña — /trabajo-remoto
//
//  Es una SEGUNDA landing, no un rediseño de la portada: /bienvenida sigue
//  siendo la página de marca y ésta existe para el tráfico de pago. Por eso
//  vive en su propia ruta, con su propia copy y su propia hoja de estilos.
//
//  La disposición replica la de una landing de captación clásica —héroe con
//  formulario a la vista, datos y prueba al lado; frase; razones; salidas;
//  cronograma; encaje; temario plegado; logos; profesorado; formulario— y la
//  regla es una sección, una idea, ningún párrafo largo.
//
//  El movimiento vive en <AdFx/> (ver su cabecera): entradas en escena,
//  contadores, foco que sigue al cursor. Todo se apaga con
//  `prefers-reduced-motion` y nada de ello hace falta para leer la página.
//
//  Todo lo que se afirma sale de datos que la web ya sostiene. Lo que no
//  tenemos verificado va marcado como maqueta EN PANTALLA, no sólo en un
//  comentario: los rangos salariales de la referencia se han sustituido por
//  el entregable, los logotipos de empresa son inventados y lo dicen, y el
//  profesorado arrastra el aviso de faculty.ts.
// ══════════════════════════════════════════════════════════

const LOGO_H = { hero: 22 } as const;

function PartnerLogos({ size, eager }: { size: number; eager?: boolean }) {
  return (
    <>
      {PARTNERS.map((p) => {
        const src = partnerLogo(p);
        if (!src) {
          return (
            <span key={p.key} style={{ fontWeight: 700, fontSize: size * 0.55 }}>
              {p.name}
            </span>
          );
        }
        // El ancho sale de la altura y del ratio real del viewBox: así ninguno
        // se deforma y la fila queda a la misma altura óptica.
        const w = Math.round(size * (p.ratio ?? 1));
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={p.key}
            src={src}
            alt={p.name}
            width={w}
            height={size}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            decoding="async"
            className={`axr-ad__logo${p.dark ? " axr-ad__logo--dark" : ""}`}
            style={{ height: size, width: w }}
          />
        );
      })}
    </>
  );
}

// ── Iconos de los cuatro pilares ──────────────────────────
// Dibujados a mano y no de una librería: son cuatro trazos, y meter un
// paquete de iconos entero en una landing de anuncios por esto no sale a
// cuenta. Todos en caja de 24 y a `currentColor`.
const PILLAR_PATHS = {
  // Entregable: un documento con su visto bueno.
  deliver: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 14.5l2 2 4-4.5" />
    </>
  ),
  // Grupo reducido: tres personas, no una multitud.
  group: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.6a3 3 0 0 1 0 5.8" />
      <path d="M17.5 14.4A5.5 5.5 0 0 1 20.5 19" />
    </>
  ),
  // Sede y alcance: un globo con su meridiano.
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18-2.6-2.7-2.6-15.3 0-18" />
    </>
  ),
  // Capas del stack.
  stack: (
    <>
      <path d="M12 3l9 4.5-9 4.5-9-4.5z" />
      <path d="M3 12l9 4.5 9-4.5" />
      <path d="M3 16.5L12 21l9-4.5" />
    </>
  ),
} as const;

function PillarIcon({ name }: { name: keyof typeof PILLAR_PATHS }) {
  return (
    <svg
      className="axr-ad__pillar-icon"
      viewBox="0 0 24 24"
      width={26}
      height={26}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {PILLAR_PATHS[name]}
    </svg>
  );
}

// ── Iconos de "cómo se cursa" ─────────────────────────────
const HOW_PATHS = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.7 2.6 15.3 0 18-2.6-2.7-2.6-15.3 0-18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  replay: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3 4v4.5h4.5" />
      <path d="M11 9.8l4.2 2.2-4.2 2.2z" />
    </>
  ),
  chat: (
    <>
      <path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H8l-4 3.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5z" />
      <path d="M8.5 10.5h7M8.5 13.5h4" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.3l2.7 2.7L16 9.7" />
    </>
  ),
} as const;

function HowIcon({ name }: { name: keyof typeof HOW_PATHS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {HOW_PATHS[name]}
    </svg>
  );
}

// ── Iconos de la marquesina ───────────────────────────────
// Los logotipos van dos veces (las dos mitades del bucle), y los trazos de
// simple-icons son largos: repetirlos engordaba el HTML unos 50 kB. Se
// definen UNA vez en un <symbol> y las dos copias los referencian con <use>.
function MarqueeSprite({ tools }: { tools: readonly Tool[] }) {
  return (
    <svg className="axr-ad__sprite" aria-hidden focusable="false">
      <defs>
        {tools.map((t) => {
          const icon = t.icon ? TOOL_ICONS[t.icon] : undefined;
          if (!icon) return null;
          return (
            <symbol key={t.id} id={`ad-t-${t.id}`} viewBox="0 0 24 24">
              <path d={icon.path} fill={icon.hex} />
            </symbol>
          );
        })}
      </defs>
    </svg>
  );
}

function MarqueeIcon({ tool }: { tool: Tool }) {
  if (tool.logo === "slack") return <SlackLogo size={22} />;
  if (tool.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/logos/${tool.logo}`} alt="" aria-hidden loading="lazy" decoding="async" />;
  }
  if (!tool.icon || !TOOL_ICONS[tool.icon]) return null;
  return (
    <svg width={22} height={22} aria-hidden focusable="false">
      <use href={`#ad-t-${tool.id}`} />
    </svg>
  );
}

export async function AdLandingView() {
  const locale = await getLocale();
  const c = adCopy[locale];
  // Las etiquetas del formulario y sus mensajes de error se reutilizan de la
  // portada: son los mismos campos y el mismo Server Action. Duplicarlos aquí
  // sólo garantizaría que un día digan cosas distintas.
  const form = landingCopy[locale].form;
  // El pie es el mismo que el de la portada, así que su texto también.
  const foot = landingCopy[locale].footer;

  // El mismo stack en la marquesina y en las fichas del programa: una lista,
  // una resolución, cero forma de que las dos se separen.
  const stack = STACK_TOOLS.map((id) => TOOLS.find((t) => t.id === id)).filter(
    (t): t is Tool => Boolean(t),
  );

  const wa = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.whatsapp.message)}`
    : null;

  return (
    <main className="axr-ad">
      <AdFx />

      {/* ── Barra ─────────────────────────────────────── */}
      <header className="axr-ad__bar">
        <div className="axr-ad__bar-inner">
          {/* Dos líneas: quiénes somos y qué se está mirando. Con la marca
              sola, quien llega desde un anuncio no sabe si esto es una
              escuela, una consultora o una bolsa de empleo. */}
          <LocaleLink href="/bienvenida" className="axr-ad__bar-brand">
            <BrandMark size={20} />
            <span className="axr-ad__bar-lockup">
              <strong>ACTIVEXREMOTE</strong>
              <em>{c.nav.school}</em>
            </span>
          </LocaleLink>
          <span className="axr-ad__bar-course">{c.nav.course}</span>
          <a href="#solicitar" className="axr-ad__bar-cta axr-ad__buzz">
            {c.nav.cta}
          </a>
        </div>
      </header>

      {/* ── Héroe: promesa + formulario + datos ───────── */}
      <section id="axr-ad-hero" className="axr-ad__hero">
        {/* Vídeo, retícula, órbitas y grano. Puramente decorativo y fuera del
            flujo: ni ocupa espacio ni lo lee nadie con un lector de pantalla.
            El orden importa —vídeo, velo, retícula, órbitas, barrido— porque
            es el orden en que se apilan. */}
        <div className="axr-ad__hero-fx" aria-hidden>
          <AdHeroVideo src="/video/hero-lp.mp4" poster="/video/hero-lp.jpg" />
          <span className="axr-ad__hero-veil" />
          <span className="axr-ad__hero-grid" />
          <span className="axr-ad__hero-orb axr-ad__hero-orb--1" />
          <span className="axr-ad__hero-orb axr-ad__hero-orb--2" />
          <span className="axr-ad__hero-orb axr-ad__hero-orb--3" />
          <span className="axr-ad__hero-scan" />
        </div>

        {/* Dos columnas y no tres: el texto a la izquierda y la única acción
            a la derecha. Con las tres tarjetas de la referencia apiladas bajo
            el titular, el héroe medía metro y medio y en un portátil había
            que hacer scroll para ver el formulario. */}
        <div className="axr-ad__hero-inner">
          {/* Tres bloques y no dos: en el móvil el formulario tiene que subir
              justo detrás del titular —es la única acción de la página— y los
              datos bajan a reforzar. En escritorio vuelven a su sitio, texto y
              datos en la columna izquierda. Con `grid-template-areas` el
              cambio de orden no toca el HTML, así que el lector de pantalla
              siempre oye promesa → acción → detalle. */}
          <div className="axr-ad__hero-copy">
            <span className="axr-ad__hero-badge">
              <span className="axr-ad__pulse" aria-hidden />
              {c.hero.badge}
            </span>
            <h1>
              {c.hero.titleTop}
              <em>{c.hero.titleBottom}</em>
            </h1>
            <p className="axr-ad__hero-lead">{c.hero.lead}</p>
          </div>

          <div className="axr-ad__form-card">
            <h2>{c.hero.formTitle}</h2>
            <p>{c.hero.formLead}</p>
            <LeadForm copy={form} variant="hero" />
          </div>

          <div className="axr-ad__hero-meta">
            <dl className="axr-ad__facts">
              {c.hero.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className="axr-ad__hero-foot">
              <div className="axr-ad__hero-partners">
                <span className="axr-ad__hero-partners-label">{c.hero.partnersLabel}</span>
                <div className="axr-ad__hero-partners-logos">
                  <PartnerLogos size={LOGO_H.hero} eager />
                </div>
              </div>
              <AdClocks label={c.hero.clocksLabel} cities={c.hero.clocks} />
            </div>
          </div>
        </div>
      </section>

      {/* ── El stack, en marquesina ───────────────────── */}
      {/* Los logotipos van duplicados a propósito: son las dos mitades de un
          bucle sin costura. La segunda copia se oculta a los lectores. */}
      <section className="axr-ad__marquee" aria-label={c.marquee.label}>
        <span className="axr-ad__marquee-label">{c.marquee.label}</span>
        <MarqueeSprite tools={stack} />
        {/* La pista se recorta en SU caja, no en la de la sección: si no, la
            fila en movimiento pasa por debajo de la etiqueta y se lee encima
            de los logotipos. */}
        <div className="axr-ad__marquee-view">
          <div className="axr-ad__marquee-track">
            {[0, 1].map((copyIndex) => (
              <div className="axr-ad__marquee-run" key={copyIndex} aria-hidden={copyIndex === 1}>
                {stack.map((tool) => (
                  <span key={`${copyIndex}-${tool.id}`} className="axr-ad__marquee-item">
                    <MarqueeIcon tool={tool} />
                    {tool.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── La frase ──────────────────────────────────── */}
      <section className="axr-ad__statement">
        <p data-reveal>
          {c.statement.top} <em>{c.statement.bottom}</em>
        </p>
      </section>

      {/* ── Cómo funciona y a dónde llegas ──────────── */}
      {/* Antes eran dos secciones de tarjetas —cuatro razones y cuatro
          salidas— y entre las dos ocupaban dos pantallas de texto plano.
          Ahora es una sola: cuatro iconos arriba y, debajo, el mismo
          contenido DIBUJADO. Un núcleo que se bifurca en dos caminos explica
          la estructura del programa sin un solo párrafo, y de cada salida se
          queda lo comprobable: el rol y el entregable. */}
      <section className="axr-ad__how axr-ad__section axr-ad__wrap">
        {/* Arriba, la clase; debajo, las cuatro razones. Van juntas porque
            dicen lo mismo con dos lenguajes: el vídeo enseña cómo es una
            sesión y los cuatro iconos la resumen. Y van AQUÍ y no al final de
            la página, donde el vídeo estaba tan abajo que casi nadie llegaba
            a verlo. */}
        <div className="axr-ad__live" data-reveal>
          <div className="axr-ad__live-frame">
            <AdLiveVideo
              src="/video/clase-directo.mp4"
              poster="/video/clase-directo.jpg"
              label={c.live.videoLabel}
            />
            <span className="axr-ad__live-badge">
              <span className="axr-ad__pulse" aria-hidden />
              {c.live.badge}
            </span>
          </div>

          <div className="axr-ad__live-text">
            <h2>{c.live.title}</h2>
            <p>{c.live.body}</p>
            <dl>
              {c.live.points.map((pt) => (
                <div key={pt.k}>
                  <dt>{pt.k}</dt>
                  <dd>{pt.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <ul className="axr-ad__pillars">
          {c.pillars.map((p, i) => (
            <li key={p.title} data-reveal style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <PillarIcon name={p.icon} />
              <strong>{p.title}</strong>
              <span>{p.body}</span>
            </li>
          ))}
        </ul>

      </section>

      {/* ── Empleos y sectores ────────────────────────── */}
      {/* La única sección de la página con imagen de fondo, y a sangre. Es
          donde se habla de a dónde lleva esto, así que la ilustración —dos
          personas trabajando, un amanecer y un anochecer en la misma línea de
          costa— dice el argumento entero antes de que nadie lea una palabra.

          Sobre una ilustración tan clara en el centro no basta el velo del
          brandbook: aquí va más cargado, y el texto en blanco y peso 600 o
          más, como manda la sección 7. */}
      <section className="axr-ad__jobs axr-ad__defer" style={{ containIntrinsicSize: "auto 680px" }}>
        {/* La ilustración va EN EL FLUJO, no de fondo con `cover`. Con cover,
            la altura de la sección mandaba y el navegador ampliaba la imagen
            para taparla: de ahí el pixelado. Aquí manda la imagen —su
            proporción fija el alto de la banda— y nunca se pinta por encima
            de sus 2000 px reales. */}
        <div className="axr-ad__jobs-band">
          <picture className="axr-ad__jobs-bg">
            {/* Un móvil no tiene por qué bajarse los 2000 px: la versión corta
                pesa una tercera parte y a ese ancho se ve idéntica. */}
            <source media="(max-width: 780px)" srcSet="/img/skyline-remoto-sm.jpg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/skyline-remoto.jpg"
              alt=""
              width={2000}
              height={694}
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="axr-ad__jobs-veil" aria-hidden />

          {/* Sobre la banda a partir de tablet; debajo en un móvil, donde la
              banda mide 135 px y ahí no cabe un titular. */}
          <header className="axr-ad__jobs-head axr-ad__wrap" data-reveal>
            <span className="axr-ad__eyebrow axr-ad__eyebrow--light">{c.jobs.eyebrow}</span>
            <h2>{c.jobs.title}</h2>
            <p>{c.jobs.lead}</p>
          </header>
        </div>

        <div className="axr-ad__wrap axr-ad__jobs-inner">
          <div className="axr-ad__pay" data-reveal>
            <span className="axr-ad__pay-label">{c.jobs.salaryLabel}</span>
            <ul className="axr-ad__pay-grid">
              {c.jobs.roles.map((r, i) => (
                <li key={r.name} data-reveal style={{ "--d": `${120 + i * 80}ms` } as React.CSSProperties}>
                  <a href={r.url} target="_blank" rel="noopener nofollow">
                    <strong>{r.range}</strong>
                    <span>{r.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="axr-ad__pay-note">{c.jobs.salaryNote}</p>
          </div>

          <div className="axr-ad__sectors" data-reveal>
            <span className="axr-ad__pay-label">{c.jobs.sectorsLabel}</span>
            <ul>
              {c.jobs.sectors.map((it, i) => (
                <li key={it} style={{ "--d": `${i * 45}ms` } as React.CSSProperties}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── El diagrama de salidas ────────────────────── */}
      <section className="axr-ad__fork-band axr-ad__section axr-ad__defer" style={{ containIntrinsicSize: "auto 520px" }}>
        <div className="axr-ad__wrap axr-ad__fork" data-reveal>
          <h2 className="axr-ad__h2">{c.outcomes.title}</h2>

          <div className="axr-ad__fork-core">
            <span className="axr-ad__fork-core-tag">{c.outcomes.coreTag}</span>
            <strong>{c.outcomes.coreName}</strong>
            <span className="axr-ad__fork-core-note">{c.outcomes.coreNote}</span>
          </div>

          {/* El conector es CSS puro: un tallo, una barra y dos bajadas, cada
              uno creciendo con su retardo. Un SVG habría hecho lo mismo con
              más piezas y sin adaptarse al ancho de las columnas. */}
          <div className="axr-ad__fork-link" aria-hidden>
            <span />
            <span />
          </div>

          <div className="axr-ad__fork-lanes">
            {c.outcomes.paths.map((lane, i) => (
              <article key={lane.name} className="axr-ad__lane" data-variant={i}>
                <header>
                  <span className="axr-ad__lane-tag">{lane.tag}</span>
                  <h3>{lane.name}</h3>
                </header>
                <ul>
                  {lane.items.map((it) => (
                    <li key={it.role} data-spot>
                      <strong>{it.role}</strong>
                      <span>{c.outcomes.takeLabel}</span>
                      <em>{it.take}</em>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Temario, plegado ──────────────────────────── */}
      {/* Los catorce módulos caben, pero desplegados son tres pantallas de
          scroll en mitad del embudo. <details> enseña la estructura y deja el
          detalle a un clic, sin JavaScript y sin sacar nada del HTML. */}
      <section id="temario" className="axr-ad__program axr-ad__section axr-ad__wrap">
        <div className="axr-ad__program-grid">
          <div className="axr-ad__program-text" data-reveal>
            <span className="axr-ad__eyebrow">{c.program.eyebrow}</span>
            <h2 className="axr-ad__h2">{c.program.title}</h2>
            <p>{c.program.lead}</p>

            {/* La logística, que era una tarjeta en una sección aparte. En
                rejilla de iconos ocupa un tercio y se barre de un vistazo, que
                es todo lo que se le pide a un dato de formato. */}
            <span className="axr-ad__program-label">{c.program.howLabel}</span>
            <dl className="axr-ad__how-grid">
              {c.program.how.map((h) => (
                <div key={h.k}>
                  <HowIcon name={h.icon} />
                  <dt>{h.k}</dt>
                  <dd>{h.v}</dd>
                </div>
              ))}
            </dl>

            {/* Con su logotipo, no con su nombre escrito en una píldora: un
                logotipo se reconoce sin leerlo. */}
            <span className="axr-ad__program-label">{c.program.toolsLabel}</span>
            <ul className="axr-ad__program-tools">
              {stack.map((t) => (
                <li key={t.id}>
                  <MarqueeIcon tool={t} />
                  <span>{t.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <div className="axr-ad__program-panel" data-spot>
              {c.program.groups.map((g, i) => (
                <details key={g.name} className="axr-ad__fold" open={i === 0}>
                  <summary>
                    <span>
                      <em>{g.tag}</em>
                      <strong>{g.name}</strong>
                    </span>
                    <span className="axr-ad__fold-sign" aria-hidden />
                  </summary>
                  <ol>
                    {g.modules.map((m) => (
                      <li key={m.n}>
                        <span>{m.n}</span>
                        {m.title}
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
            <a href="#solicitar" className="axr-ad__program-cta axr-ad__buzz">
              {c.program.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Cronograma ────────────────────────────────── */}
      {/* Cinco hitos sobre una línea que se dibuja al entrar. Es la forma más
          corta de contestar "¿en qué me estoy metiendo?" sin un párrafo. */}
      <section className="axr-ad__timeline axr-ad__section axr-ad__defer" style={{ containIntrinsicSize: "auto 320px" }}>
        <div className="axr-ad__wrap">
          <h2 className="axr-ad__h2" data-reveal>
            {c.timeline.title}
          </h2>
          {/* Cada hito lleva su propio `data-reveal`: antes lo llevaba la
              lista entera y los cinco aparecían de golpe, que es exactamente
              lo mismo que no animar nada. Ahora entran uno detrás de otro,
              detrás del trazo, y el orden de lectura se lee solo. */}
          <ol className="axr-ad__rail" data-reveal>
            {c.timeline.items.map((t, i) => (
              <li
                key={t.n}
                data-reveal
                style={{ "--d": `${300 + i * 110}ms` } as React.CSSProperties}
              >
                <span className="axr-ad__rail-node" aria-hidden />
                <em>{t.when}</em>
                <strong>{t.title}</strong>
                <p>{t.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── La sede ───────────────────────────────────── */}
      {/* Antes del formulario a propósito: quien va a dejar sus datos quiere
          saber a quién se los deja y cuándo le cogen el teléfono.

          Sin mapa incrustado: un iframe de Google carga scripts de terceros,
          pide consentimiento de cookies y frena la página. Con la dirección y
          el horario escritos se contesta lo mismo y se puede pulsar para
          abrirlo en el mapa que cada uno tenga. */}
      <section className="axr-ad__office axr-ad__section axr-ad__defer" style={{ containIntrinsicSize: "auto 320px" }}>
        <div className="axr-ad__wrap axr-ad__office-grid" data-reveal>
          <div className="axr-ad__office-text">
            <span className="axr-ad__eyebrow">{c.office.eyebrow}</span>
            <h2 className="axr-ad__h2">{c.office.title}</h2>
            <p>{c.office.note}</p>
          </div>

          <div className="axr-ad__office-card" data-spot>
            {/* El mapa manda y los datos van debajo: una dirección de Dubái
                con número de oficina y planta no la sitúa nadie leyéndola. */}
            <AdMap
              query={ENTITY.address}
              label={c.office.mapLabel}
              cta={c.office.mapCta}
              notice={c.office.mapNotice}
            />
            <dl>
              <div>
                <dt>{c.office.addressLabel}</dt>
                <dd>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENTITY.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ENTITY.address}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{c.office.hoursLabel}</dt>
                <dd>{c.office.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ── Cierre: prueba y formulario ───────────────── */}
      {/* Empresas, profesorado y formulario eran tres secciones seguidas y
          entre las tres ocupaban dos pantallas y media al final de la página,
          que es justo donde ya no queda paciencia. Aquí van juntas y en
          blanco: a la izquierda la prueba —quién imparte y dónde acaba la
          gente—, a la derecha la única acción. Es la última pantalla, así que
          tiene que caber en una. */}
      <section id="solicitar" className="axr-ad__final axr-ad__section">
        <div className="axr-ad__wrap axr-ad__final-grid">
          <div className="axr-ad__final-text" data-reveal>
            <span className="axr-ad__eyebrow">{form.eyebrow}</span>
            <h2>{c.final.title}</h2>
            <p>{c.final.body}</p>

            <span className="axr-ad__proof-label">{c.faculty.title}</span>
            <ul className="axr-ad__team">
              {FACULTY.map((m) => (
                <li key={m.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photo} alt="" width={36} height={36} loading="lazy" decoding="async" />
                  <span>
                    <strong>{m.name}</strong>
                    <em>{m[locale].role}</em>
                  </span>
                </li>
              ))}
            </ul>

            <span className="axr-ad__proof-label">{c.alumni.title}</span>
            <div className="axr-ad__alumni-row">
              <PlaceholderLogos />
            </div>

            {/* Un solo aviso para los dos datos de maqueta de la sección. */}
            {(PLACEHOLDER_LOGOS || DEMO_FACULTY) && (
              <p className="axr-ad__flag">{c.faculty.notice}</p>
            )}
          </div>

          <div data-reveal>
            <LeadForm copy={form} variant="panel" />
          </div>
        </div>
      </section>

      {/* ── Pie ───────────────────────────────────────── */}
      {/* El mismo que el de la portada: columnas de enlaces, selector de
          idioma, tarjetas aceptadas y quién cobra. No se reutiliza
          <LandingFooter/> porque sus estilos viven en landing.scss y esta
          página no la carga; lo que sí se reutiliza es lo que importa —la
          copy y <PaymentBadges/>, que es el bloque de confianza entero—, así
          que las marcas de tarjeta no se escriben en dos sitios.

          Las anclas del pie (#metodo, #modulos, #faq) apuntan a secciones que
          existen en /bienvenida y no aquí, así que van con la ruta delante o
          no harían nada al pulsarlas. */}
      <footer className="axr-ad__foot">
        <div className="axr-ad__foot-inner">
          <div className="axr-ad__foot-brand">
            <LocaleLink href="/bienvenida" className="axr-ad__foot-mark" aria-label="ActiveXRemote">
              <BrandMark size={22} />
              <span>ActiveXRemote</span>
            </LocaleLink>
            <p>{foot.tagline}</p>
            <div className="axr-ad__foot-locale">
              <LocaleToggle tone="dark" />
            </div>
            <PaymentBadges copy={foot.pay} />
          </div>

          <div className="axr-ad__foot-cols">
            {foot.cols.map((col) => (
              <div key={col.title} className="axr-ad__foot-col">
                <span className="axr-ad__eyebrow">{col.title}</span>
                {col.links.map((l) => (
                  <LocaleLink
                    key={l.label}
                    href={l.href.startsWith("#") ? `/bienvenida${l.href}` : l.href}
                  >
                    {l.label}
                  </LocaleLink>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="axr-ad__foot-bar">
          <p className="axr-ad__foot-note">{c.footer.note}</p>
          <div className="axr-ad__foot-bar-row">
            <span>{foot.access}</span>
            {/* Revocar el consentimiento tiene que ser tan fácil como darlo. */}
            <CookieSettingsLink label={foot.cookieSettings} />
          </div>
        </div>
      </footer>

      {/* ── Barra inferior fija ───────────────────────── */}
      <AdStickyBar
        note={c.sticky.note}
        cta={c.sticky.cta}
        units={c.sticky.units}
        target={COHORT_START}
      />

      {/* ── Insignia de WhatsApp ──────────────────────── */}
      {/* Sube por encima de la barra inferior cuando ésta aparece: si no, se
          quedaba justo detrás y no se podía pulsar en el móvil. */}
      {wa && (
        <a
          className="axr-ad__wa"
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.whatsapp.label}
          title={c.whatsapp.label}
        >
          <svg viewBox="0 0 24 24" width={26} height={26} fill="currentColor" aria-hidden focusable="false">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.83 9.83 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.502-8.45" />
          </svg>
        </a>
      )}
    </main>
  );
}
