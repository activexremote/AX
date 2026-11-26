// Iconos de trazo (24×24) de las landings de curso. Son los mismos dibujos
// que los dosieres comerciales en PDF, para que web y PDF se reconozcan.
const PATHS = {
  brujula: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  iman: <><path d="M6 3v8a6 6 0 0 0 12 0V3" /><path d="M6 7h4M14 7h4M10 3v8a2 2 0 0 0 4 0V3" /></>,
  radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><path d="M12 12l6-6" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>,
  micro: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" /></>,
  contrato: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>,
  chispa: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></>,
  avion: <><path d="M3 13l18-8-6 16-3-7z" /><path d="M12 14l3-3" /></>,
  personas: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 20a6 6 0 0 1 12 0M14.5 20a5 5 0 0 1 7-4.5" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  reloj: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
  directo: <><circle cx="12" cy="12" r="2.5" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" /></>,
  libro: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M8 7h7" /></>,
  lapiz: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></>,
  test: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8l1.5 1.5L12 7M8 14l1.5 1.5L12 13M14 8h3M14 14h3" /></>,
  escudo: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  tarjeta: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
  correo: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  calendario: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  diploma: <><circle cx="12" cy="9" r="5" /><path d="M9 13.5L7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" /></>,
  maleta: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>,
  grafica: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  diana: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></>,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  paquete: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></>,
  cohete: <><path d="M12 3c4 2 6 6 6 10l-3 3H9l-3-3c0-4 2-8 6-10z" /><circle cx="12" cy="10" r="2" /><path d="M9 16l-2 5 3-2M15 16l2 5-3-2" /></>,
  megafono: <><path d="M3 10v4h4l8 5V5L7 10z" /><path d="M18 9a4 4 0 0 1 0 6" /></>,
  globo: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  apreton: <><path d="M3 11l4-4 5 3 5-3 4 4-9 8z" /><path d="M9 13l2 2M12 12l2 2" /></>,
  estrella: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  engranaje: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>,
  rayo: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  edificio: <><path d="M4 21V5l8-3v19M12 9l8 3v9M2 21h20" /><path d="M7 8h2M7 12h2M7 16h2M15 15h2" /></>,
  escalera: <><path d="M3 20h4v-4h4v-4h4V8h4V4h2" /><path d="M3 20h18" /></>,
  euro: <><path d="M17 6a7 7 0 1 0 0 12" /><path d="M4 10h9M4 14h9" /></>,
} as const;

export type CourseIcon = keyof typeof PATHS;

export function Icon({ name, size = 22, stroke = 1.9, className }: { name: CourseIcon; size?: number; stroke?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
