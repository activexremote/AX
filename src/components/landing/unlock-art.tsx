// Ilustraciones de los cinco desbloqueos.
//
// Mismo sistema que el glosario público: fondo lavanda, una masa con
// degradado y encima una línea de tinta monolínea. Y con la MISMA paleta que
// el resto de la web —morado, magenta, turquesa, índigo—: llevaban naranja y
// verde de fuera del sistema, y en una fila de cinco se notaba. No son iconos: cada una
// dibuja LO QUE HAY DENTRO del material, para que se vean como cinco regalos
// distintos y no como cinco cajas con un número.
//
// 120×120, trazo 5 sobre esa caja. Los degradados llevan id propio por pieza
// porque en la misma página conviven las cinco y los ids de <defs> son
// globales al documento: repetirlos hace que todas hereden el primero.

const K = {
  fill: "none",
  stroke: "#161326",
  strokeWidth: 5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Marco({ id, from, to, children }: { id: string; from: string; to: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="axr-unlock-art" aria-hidden focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="20" fill="#f4f3fb" />
      {children}
    </svg>
  );
}

/** Template: los cimientos ya puestos, como capas apiladas. */
export function ArtTemplate() {
  return (
    <Marco id="ua-tpl" from="#7c5cff" to="#4f46e5">
      <path d="M26 78l34 18 34-18-34-18-34 18Z" fill="url(#ua-tpl)" opacity="0.9" />
      <path d="M26 60l34 18 34-18" {...K} />
      <path d="M26 42l34 18 34-18-34-18-34 18Z" {...K} />
    </Marco>
  );
}

/** Research: una lupa que en vez de cristal tiene una señal que se propaga. */
export function ArtResearch() {
  return (
    <Marco id="ua-res" from="#14b8c4" to="#2f6bff">
      <circle cx="52" cy="52" r="26" fill="url(#ua-res)" opacity="0.9" />
      <circle cx="52" cy="52" r="26" {...K} />
      <path d="M71 71l22 22" {...K} />
      <path d="M42 56c5-12 13-12 20 0s14 10 18 2" {...K} strokeWidth={4} />
    </Marco>
  );
}

/** Prompt pack: una baraja de fichas, la de delante con su texto. */
export function ArtPrompts() {
  return (
    <Marco id="ua-prm" from="#d61f9c" to="#7c5cff">
      <rect x="30" y="24" width="52" height="66" rx="8" fill="url(#ua-prm)" opacity="0.55" />
      <rect x="40" y="34" width="52" height="66" rx="8" fill="url(#ua-prm)" />
      <rect x="40" y="34" width="52" height="66" rx="8" {...K} />
      <path d="M52 54h28M52 66h28M52 78h16" {...K} strokeWidth={4} />
    </Marco>
  );
}

/** Perks: una etiqueta de precio con su ojal. */
export function ArtPerks() {
  return (
    <Marco id="ua-prk" from="#14b8c4" to="#2f6bff">
      <path d="M62 22H92a6 6 0 0 1 6 6v30L58 98 22 62 62 22Z" fill="url(#ua-prk)" opacity="0.9" />
      <path d="M62 22H92a6 6 0 0 1 6 6v30L58 98 22 62 62 22Z" {...K} />
      <circle cx="80" cy="40" r="7" {...K} />
    </Marco>
  );
}

/** Checklist: la lista con lo hecho marcado. */
export function ArtChecklist() {
  return (
    <Marco id="ua-chk" from="#7c5cff" to="#d61f9c">
      <rect x="26" y="22" width="68" height="76" rx="10" fill="url(#ua-chk)" opacity="0.9" />
      <rect x="26" y="22" width="68" height="76" rx="10" {...K} />
      <path d="M40 46l7 7 13-13" {...K} strokeWidth={5} />
      <path d="M40 72l7 7 13-13" {...K} strokeWidth={5} />
      <path d="M70 48h12M70 74h12" {...K} strokeWidth={4} />
    </Marco>
  );
}

/** Cada desbloqueo con su dibujo, por clave. */
export const UNLOCK_ART: Record<string, () => React.ReactElement> = {
  "web-abc-starter-template": ArtTemplate,
  "web-abc-research-hack": ArtResearch,
  "web-abc-prompt-pack": ArtPrompts,
  "web-abc-tool-perks": ArtPerks,
  "web-abc-ship-checklist": ArtChecklist,
};
