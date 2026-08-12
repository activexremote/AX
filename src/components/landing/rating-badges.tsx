import { PROTOTYPE_RATINGS } from "@/app/bienvenida/flags";

export type RatingItem = {
  /** "star" es nuestra valoración; "g2"/"trustpilot" van tras PROTOTYPE_RATINGS. */
  mark: "star" | "g2" | "trustpilot";
  score: string;
  label: string;
  href?: string;
};

// Estrella propia y estrella verde de reseñas. Las marcas de G2 y Trustpilot
// son una aproximación para el prototipo: al crear los perfiles hay que
// sustituirlas por su widget oficial.
function Star({ size = 22, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M12 2.6l2.72 5.98 6.53.72-4.86 4.4 1.32 6.43L12 16.9l-5.71 3.23 1.32-6.43-4.86-4.4 6.53-.72L12 2.6z"
        fill={color}
      />
    </svg>
  );
}

function G2Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <circle cx="12" cy="12" r="12" fill="#FF492C" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="var(--axr-sans)"
        fill="#fff"
      >
        G2
      </text>
    </svg>
  );
}

function Mark({ mark }: { mark: RatingItem["mark"] }) {
  if (mark === "g2") return <G2Mark />;
  if (mark === "trustpilot") return <Star color="#00B67A" />;
  return <Star color="#38d39f" />;
}

export function RatingBadges({ items }: { items: readonly RatingItem[] }) {
  const shown = items.filter((item) => item.mark === "star" || PROTOTYPE_RATINGS);
  if (!shown.length) return null;

  return (
    <div className="axr-lp__ratings">
      {shown.map((item) => (
        <span key={item.label} className="axr-lp__rating" data-mark={item.mark}>
          <span className="axr-lp__rating-mark">
            <Mark mark={item.mark} />
          </span>
          <strong>{item.score}</strong>
          <span className="axr-lp__rating-sep" aria-hidden />
          <span className="axr-lp__rating-label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
