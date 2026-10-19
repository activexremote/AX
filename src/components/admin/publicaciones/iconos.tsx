// Iconos de la sección de publicaciones: trazo de 1,6 en currentColor, en
// una rejilla de 24. Pocos y siempre los mismos, para que cada uno signifique
// una sola cosa en todas las pantallas.

const D = {
  inicio: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  revisar: (
    <>
      <path d="M4 5h16v14H4z" />
      <path d="M4 13h5l1.5 2h3L15 13h5" />
    </>
  ),
  calendario: (
    <>
      <path d="M4 6h16v14H4z" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </>
  ),
  nevera: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5" />,
  lista: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  ajustes: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
  mas: <path d="M12 5v14M5 12h14" />,
  ok: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  aviso: <path d="M12 4l9 16H3zM12 10v4M12 17h.01" />,
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  reloj: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  chispa: <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  papelera: <path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" />,
  enlace: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  imagen: (
    <>
      <path d="M4 5h16v14H4z" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M20 16l-5-5-8 8" />
    </>
  ),
  euro: <path d="M17 6.5A6 6 0 1 0 17 17.5M4 10h9M4 14h9" />,
};

export type NombreIcono = keyof typeof D;

export function Icono({ n, size = 16, className }: { n: NombreIcono; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {D[n]}
    </svg>
  );
}
