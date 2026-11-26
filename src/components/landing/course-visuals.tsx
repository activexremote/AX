import type { CourseSlug } from "@/app/cursos/copy";
import { Icon, type CourseIcon } from "@/components/landing/course-icons";

// ══════════════════════════════════════════════════════════
//  Ilustraciones de las landings de curso, todas en SVG propio y sin
//  animaciones sobre elementos SVG (el navegador no las compone). Son las
//  mismas piezas que los dosieres en PDF, adaptadas a pantalla: lo que en el
//  PDF era texto dentro del SVG aquí es HTML, para que se lea y se traduzca.
// ══════════════════════════════════════════════════════════

/** Colores de las fases de la hoja de ruta, en el orden de `roadmap.phases`. */
export const PHASE_COLORS: Record<CourseSlug, string[]> = {
  "remote-professional": ["#8b7bff", "#5b4bf5", "#ff6a3d", "#10b981"],
  "remote-founder": ["#ff8a3d", "#e4462f", "#c2185b", "#7c3aed"],
};

// ── Portada de «Lo que te llevas» ───────────────────────

function Globe() {
  return (
    <svg viewBox="0 0 520 520" className="axr-cv__art-svg" fill="none" aria-hidden focusable="false">
      <defs>
        <radialGradient id="cvGlobe" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#7a6bff" />
          <stop offset=".55" stopColor="#3b2aa8" />
          <stop offset="1" stopColor="#17104a" />
        </radialGradient>
        <linearGradient id="cvRoute" x1="0" x2="1">
          <stop offset="0" stopColor="#ff9a6b" />
          <stop offset="1" stopColor="#ff5ab0" />
        </linearGradient>
        <radialGradient id="cvHalo">
          <stop offset=".6" stopColor="#6d5cff" stopOpacity=".35" />
          <stop offset="1" stopColor="#6d5cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="265" r="250" fill="url(#cvHalo)" />
      <circle cx="260" cy="260" r="190" fill="url(#cvGlobe)" />
      <g stroke="#fff" strokeOpacity=".16" strokeWidth="1.2">
        <ellipse cx="260" cy="260" rx="190" ry="64" />
        <ellipse cx="260" cy="260" rx="190" ry="130" />
        <path d="M70 260h380" />
        <ellipse cx="260" cy="260" rx="64" ry="190" />
        <ellipse cx="260" cy="260" rx="130" ry="190" />
        <path d="M260 70v380" />
      </g>
      <g fill="#fff" fillOpacity=".12">
        <path d="M150 170c30-22 70-18 92 4 12 12 4 30-14 34-20 4-24 22-44 24-26 3-56-30-34-62z" />
        <path d="M290 150c36-8 80 6 96 34 10 18-8 30-26 26-22-5-34 16-58 10-24-6-40-60-12-70z" />
        <path d="M300 280c26-10 64 2 70 28 6 26-20 52-46 50-30-2-52-66-24-78z" />
        <path d="M170 300c20-6 40 8 38 30-2 26-26 48-44 40-20-10-18-62 6-70z" />
      </g>
      <g stroke="url(#cvRoute)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9">
        <path d="M190 210 C 240 120, 330 120, 360 190" />
        <path d="M190 210 C 200 300, 280 340, 330 310" />
        <path d="M360 190 C 420 240, 400 300, 330 310" />
      </g>
      {[
        [190, 210],
        [360, 190],
        [330, 310],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="13" fill="#ff6a3d" fillOpacity=".25" />
          <circle cx={x} cy={y} r="6" fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

function Staircase({ labels }: { labels: string[] }) {
  const steps = [
    [40, 300],
    [150, 230],
    [260, 160],
    [370, 90],
  ];
  return (
    <svg viewBox="0 0 500 440" className="axr-cv__art-svg" fill="none" aria-hidden focusable="false">
      <defs>
        <linearGradient id="cvStep" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff8a3d" stopOpacity=".25" />
          <stop offset="1" stopColor="#ff8a3d" stopOpacity=".9" />
        </linearGradient>
        <linearGradient id="cvArrow" x1="0" x2="1">
          <stop offset="0" stopColor="#ffb36b" />
          <stop offset="1" stopColor="#ff5a8a" />
        </linearGradient>
        <radialGradient id="cvGlow">
          <stop offset=".3" stopColor="#d61f9c" stopOpacity=".4" />
          <stop offset="1" stopColor="#d61f9c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="200" r="240" fill="url(#cvGlow)" />
      <g stroke="#fff" strokeOpacity=".08">
        {[80, 160, 240, 320].map((y) => (
          <path key={y} d={`M20 ${y}H480`} />
        ))}
      </g>
      {steps.map(([x, y], i) => {
        const words = (labels[i] ?? "").split(" ");
        const top = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const bottom = words.slice(Math.ceil(words.length / 2)).join(" ");
        return (
          <g key={x}>
            <rect x={x} y={y} width="100" height={400 - y} rx="10" fill="url(#cvStep)" />
            <text x={x + 50} y={y + 26} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff">
              {top}
            </text>
            {bottom ? (
              <text x={x + 50} y={y + 42} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#fff">
                {bottom}
              </text>
            ) : null}
          </g>
        );
      })}
      <path d="M60 280 C 160 250, 250 170, 440 50" stroke="url(#cvArrow)" strokeWidth="5" strokeLinecap="round" />
      <path d="M440 50 l-22 2 M440 50 l-8 20" stroke="#ff5a8a" strokeWidth="5" strokeLinecap="round" />
      <path d="M20 400H480" stroke="#fff" strokeOpacity=".25" strokeWidth="2" />
    </svg>
  );
}

/** El dibujo de «Lo que te llevas» con las tres tarjetas de hito flotando encima. */
export function PromiseArt({
  slug,
  cards,
  ladder,
}: {
  slug: CourseSlug;
  cards: { icon: CourseIcon; title: string; sub: string }[];
  ladder: string[];
}) {
  return (
    <div className="axr-cv__art" data-art={slug === "remote-professional" ? "globe" : "ladder"}>
      {slug === "remote-professional" ? <Globe /> : <Staircase labels={ladder} />}
      {cards.map((c, i) => (
        <div key={c.title} className="axr-cv__float" data-i={i + 1}>
          <span className="axr-cv__float-icon">
            <Icon name={c.icon} size={18} stroke={2.2} />
          </span>
          <span className="axr-cv__float-text">
            <strong>{c.title}</strong>
            <small>{c.sub}</small>
          </span>
          <span className="axr-cv__float-ok">
            <Icon name="check" size={13} stroke={3} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Semana tipo (donut) ─────────────────────────────────

const DONUT_COLORS: Record<CourseSlug, string[]> = {
  "remote-professional": ["#c9c1ff", "#8b7bff", "#ff6a3d", "#5b4bf5", "#10b981"],
  "remote-founder": ["#ffc2a8", "#ff8a3d", "#c2185b", "#e4462f", "#10b981"],
};

export function WeekDonut({
  slug,
  parts,
  total,
  perWeek,
  locale,
}: {
  slug: CourseSlug;
  parts: { h: number; label: string; icon: CourseIcon }[];
  total: string;
  perWeek: string;
  locale: string;
}) {
  const sum = parts.reduce((a, p) => a + p.h, 0);
  const R = 78;
  const C = 2 * Math.PI * R;
  const colors = DONUT_COLORS[slug];
  let acc = 0;
  const fmt = (h: number) => (locale === "es" ? String(h).replace(".", ",") : String(h));

  return (
    <div className="axr-cv__donut">
      <svg viewBox="0 0 200 200" className="axr-cv__donut-svg" fill="none" role="img" aria-label={`${total} ${perWeek}`}>
        {parts.map((p, i) => {
          const len = (p.h / sum) * C;
          const el = (
            <circle
              key={p.label}
              cx="100"
              cy="100"
              r={R}
              stroke={colors[i % colors.length]}
              strokeWidth="30"
              strokeDasharray={`${Math.max(len - 3, 1)} ${C - len + 3}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 100 100)"
            />
          );
          acc += len;
          return el;
        })}
        <text x="100" y="98" textAnchor="middle" fontSize="32" fontWeight="800" fill="currentColor" letterSpacing="-1">
          {total}
        </text>
        <text x="100" y="120" textAnchor="middle" fontSize="12" fontWeight="600" fill="#8a86a0">
          {perWeek}
        </text>
      </svg>
      <ul className="axr-cv__legend">
        {parts.map((p, i) => (
          <li key={p.label}>
            <i style={{ background: colors[i % colors.length] }} />
            <span>{p.label}</span>
            <b>{fmt(p.h)} h</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Clase en directo (120 min) ──────────────────────────
// HTML y no SVG: en móvil los segmentos estrechos no caben con su texto, y
// así las etiquetas pasan a una leyenda debajo sin dibujar dos versiones.

export function LiveBar({ slug, parts }: { slug: CourseSlug; parts: { min: number; label: string }[] }) {
  const colors =
    slug === "remote-professional"
      ? ["#c9c1ff", "#8b7bff", "#5b4bf5", "#10b981", "#ff6a3d", "#ffb199"]
      : ["#ffc2a8", "#ff8a3d", "#e4462f", "#10b981", "#c2185b", "#f9a8d4"];
  const light = new Set([0, 5]);
  return (
    <div className="axr-cv__live">
      <div className="axr-cv__live-bar">
        {parts.map((p, i) => (
          <span
            key={p.label}
            style={{ flexGrow: p.min, background: colors[i], color: light.has(i) ? "#161326" : "#fff" }}
            data-wide={p.min >= 20 ? "" : undefined}
            title={`${p.label} · ${p.min}′`}
          >
            <b>{p.label}</b>
          </span>
        ))}
      </div>
      <ol className="axr-cv__live-legend">
        {parts.map((p, i) => (
          <li key={p.label} data-wide={p.min >= 20 ? "" : undefined}>
            <i style={{ background: colors[i] }} />
            {p.label} <span>{p.min}′</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Pod / mastermind ────────────────────────────────────

export function PodArt({ slug }: { slug: CourseSlug }) {
  const colors =
    slug === "remote-professional"
      ? ["#5b4bf5", "#ff6a3d", "#10b981", "#8b7bff", "#f59e0b"]
      : ["#e4462f", "#ff8a3d", "#10b981", "#c2185b", "#7c3aed"];
  return (
    <svg viewBox="0 0 120 120" className="axr-cv__pod-svg" fill="none" aria-hidden focusable="false">
      <circle cx="60" cy="60" r="40" stroke="currentColor" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 5" />
      {colors.map((c, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = 60 + 40 * Math.cos(a);
        const y = 60 + 40 * Math.sin(a);
        return (
          <g key={c}>
            <circle cx={x} cy={y} r="13" fill={c} />
            <circle cx={x} cy={y - 3} r="4" fill="#fff" />
            <path d={`M${x - 7} ${y + 8}a7 6 0 0 1 14 0`} fill="#fff" />
          </g>
        );
      })}
      <circle cx="60" cy="60" r="11" fill="#161326" />
      <path d="M55 60l3.5 3.5L66 56" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
