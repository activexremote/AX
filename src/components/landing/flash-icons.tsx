// Iconos de los cursos relámpago.
//
// Dibujados a mano y no emoji: 🎁 y 🥷 los pinta cada sistema operativo a su
// manera —en Windows salen planos, en Android son otro dibujo— y encima
// arrastran su propio color, que se pelea con el naranja de la marca. Estos
// son monolínea, heredan `currentColor` y se ven igual en todas partes.
//
// Trazo de 1,5 sobre una caja de 24, que es la proporción del resto de
// iconografía del sitio.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Regalo: caja con lazo. */
export function GiftIcon({ size = 24 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="3" y="9.5" width="18" height="11.5" rx="1.5" />
      <path d="M2 9.5h20M12 9.5V21" />
      {/* Los dos lóbulos del lazo, uno a cada lado del eje. */}
      <path d="M12 9.5S10.8 4.6 8.4 4.6a2.4 2.4 0 0 0 0 4.9Z" />
      <path d="M12 9.5s1.2-4.9 3.6-4.9a2.4 2.4 0 0 1 0 4.9Z" />
    </svg>
  );
}

/**
 * Ninja: capucha con la franja de los ojos.
 *
 * Deliberadamente simple. La primera versión llevaba también el extremo
 * suelto de la banda y los ojos como trazos, y a 18 px —que es como sale en
 * las tarjetas— todo eso se juntaba en una mancha. Aquí quedan tres formas:
 * la capucha, la franja y dos ojos RELLENOS, que a tamaño pequeño se leen
 * cuando un trazo fino ya no.
 */
export function NinjaIcon({ size = 24 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size}>
      {/* La capucha. */}
      <path d="M12 2.8c4.6 0 7.7 3.1 7.7 7.6 0 5.4-3.5 10.8-7.7 10.8S4.3 15.8 4.3 10.4C4.3 5.9 7.4 2.8 12 2.8Z" />
      {/* La franja de la tela: la línea que lo hace reconocible de un vistazo. */}
      <path d="M4.5 13.2h15" strokeWidth="1.8" />
      {/* Los ojos, rellenos. */}
      <circle cx="9.5" cy="10.2" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="10.2" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Play: el triángulo del vídeo, dentro de su círculo. */
export function PlayIcon({ size = 24 }: { size?: number }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.6 15.4 12 10 15.4V8.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
