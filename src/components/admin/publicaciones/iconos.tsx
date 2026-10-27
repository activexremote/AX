// Iconos de la sección de publicaciones: trazo de 1,6 en currentColor, en
// una rejilla de 24. Pocos y siempre los mismos, para que cada uno signifique
// una sola cosa en todas las pantallas.

const D = {
  inicio: <path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" />,
  // Menú del panel
  libro: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />,
  tareas: <path d="M9 4h6v3H9zM7 5.5H5V21h14V5.5h-2M8.5 13l2.5 2.5 4.5-5" />,
  birrete: <path d="M2 9l10-5 10 5-10 5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6" />,
  chat: <path d="M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5" />,
  tarjeta: <path d="M3 6h18v12H3zM3 10h18M7 15h4" />,
  usuarios: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 5.2a3.5 3.5 0 0 1 0 6.6M18.5 14.8c1.7.8 2.8 2.6 3 5.2" />
    </>
  ),
  almohadilla: <path d="M9 3L7 21M17 3l-2 18M4 8.5h17M3 15.5h17" />,
  megafono: <path d="M3 10v4h3l7 4V6L6 10zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />,
  manual: <path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5zM12 6.5V19.5" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  salir: <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />,
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
  buscar: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  imagen: (
    <>
      <path d="M4 5h16v14H4z" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M20 16l-5-5-8 8" />
    </>
  ),
  euro: <path d="M17 6.5A6 6 0 1 0 17 17.5M4 10h9M4 14h9" />,
  // Banners
  escudo: <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6zM8.5 12l2.5 2.5 4.5-5" />,
  descarga: <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  capas: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
  enchufe: <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />,
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  carpeta: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" />,
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
