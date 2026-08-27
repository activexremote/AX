// ══════════════════════════════════════════════════════════
//  Logotipos de MAQUETA.
//
//  ⚠︎ PLACEHOLDER_LOGOS = true significa que estas ocho marcas NO EXISTEN.
//  Son wordmarks inventados para que la fila de logotipos tenga su sitio y su
//  peso visual mientras no haya empresas reales que enseñar. Mientras la
//  constante siga en true, la sección lo dice en pantalla.
//
//  No se ponen logotipos reales de empresas "donde trabajan nuestros
//  alumnos" hasta que sea verdad y esté por escrito: usar la marca de un
//  tercero para sugerir una relación que no existe no es una licencia de
//  marketing, es un problema (y la misma razón por la que faculty.ts y
//  flags.ts llevan sus propios interruptores).
//
//  Para publicarlos de verdad: sustituye MARKS por los SVG reales en
//  public/logos/alumni/ y pon la constante en false.
// ══════════════════════════════════════════════════════════

export const PLACEHOLDER_LOGOS = true;

type Mark = { name: string; glyph: React.ReactNode };

// Glifos geométricos, todos en una caja de 24 y a `currentColor`: en una fila
// a la misma altura óptica, un monograma bien dibujado pasa por un logotipo.
const MARKS: readonly Mark[] = [
  {
    name: "Northwind",
    glyph: <path d="M3 20V4l9 9 9-9v16" />,
  },
  {
    name: "Lumen Labs",
    glyph: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4v16" />
      </>
    ),
  },
  {
    name: "Cobalt",
    glyph: <path d="M12 3 21 12l-9 9-9-9z" />,
  },
  {
    name: "Fernweh",
    glyph: (
      <>
        <path d="M4 19 12 5l8 14z" />
        <path d="M8 19h8" />
      </>
    ),
  },
  {
    name: "Atlas Remote",
    glyph: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4c3 3 3 13 0 16-3-3-3-13 0-16" />
      </>
    ),
  },
  {
    name: "Kiona",
    glyph: (
      <>
        <path d="M5 4v16" />
        <path d="M19 4 7 12l12 8" />
      </>
    ),
  },
  {
    name: "Vantor",
    glyph: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M9 15V9l6 6V9" />
      </>
    ),
  },
  {
    name: "Solvay Grid",
    glyph: (
      <>
        <path d="M4 9h16M4 15h16M9 4v16M15 4v16" />
      </>
    ),
  },
];

export function PlaceholderLogos() {
  return (
    <>
      {MARKS.map((m) => (
        <span key={m.name} className="axr-ad__fakelogo" data-reveal>
          <svg
            viewBox="0 0 24 24"
            width={22}
            height={22}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinejoin="miter"
            aria-hidden
            focusable="false"
          >
            {m.glyph}
          </svg>
          {m.name}
        </span>
      ))}
    </>
  );
}
