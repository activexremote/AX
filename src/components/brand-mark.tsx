// Marca gráfica de ActiveX: triángulo (A) + reloj de arena (X).
// Contorno en currentColor para heredar el color del tema.
// `size` fija la altura; el ancho se calcula por la proporción del glifo.
const VIEW_W = 46;
const VIEW_H = 28;

export function BrandMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      height={size}
      width={(size * VIEW_W) / VIEW_H}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={className}
      role="img"
      aria-label="ActiveX"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="miter"
    >
      {/* A → triángulo */}
      <path d="M11 2 L20 26 L2 26 Z" />
      {/* X → reloj de arena (dos triángulos que se tocan en el centro) */}
      <path d="M26 2 L44 2 L35 14 Z" />
      <path d="M26 26 L44 26 L35 14 Z" />
    </svg>
  );
}
