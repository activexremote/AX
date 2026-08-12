export type RatingItem = {
  /** "star" pinta la estrella propia; "g2"/"trustpilot" esperan su widget oficial. */
  mark: "star" | "g2" | "trustpilot";
  score: string;
  label: string;
  href?: string;
};

function Star({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        d="M12 2.6l2.72 5.98 6.53.72-4.86 4.4 1.32 6.43L12 16.9l-5.71 3.23 1.32-6.43-4.86-4.4 6.53-.72L12 2.6z"
        fill="currentColor"
      />
    </svg>
  );
}

// Fila de valoraciones del héroe.
//
// Sólo se pintan valoraciones propias. Para añadir G2 o Trustpilot hace falta
// un perfil real: ambos exigen usar su widget/API oficial y prohíben mostrar
// una puntuación inventada o desactualizada — en la UE, además, es práctica
// comercial prohibida. Cuando existan, se añade un item con mark "g2" o
// "trustpilot" apuntando al perfil y se incrusta aquí su script.
export function RatingBadges({ items }: { items: readonly RatingItem[] }) {
  const shown = items.filter((item) => item.mark === "star");
  if (!shown.length) return null;

  return (
    <div className="axr-lp__ratings">
      {shown.map((item) => (
        <span key={item.label} className="axr-lp__rating">
          <span className="axr-lp__rating-mark" aria-hidden>
            <Star />
          </span>
          <strong>{item.score}</strong>
          <span className="axr-lp__rating-sep" aria-hidden />
          <span className="axr-lp__rating-label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
