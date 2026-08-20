import { HeroGlobe } from "@/components/landing/hero-globe";

// Textura del héroe. Tres capas sobre el mesh, todas decorativas:
//
//  1. Focos de luz que derivan muy despacio. Son gradientes radiales movidos
//     con `transform`, no con `filter: blur()`: el desenfoque de un elemento
//     grande hunde el rendimiento en un iPhone y el gradiente ya nace suave.
//  2. Rejilla fina, que da la sensación de superficie y no de degradado plano.
//  3. Esfera de alambre girando. Va DENTRO de esta capa y no encima:
//     comparte el grano con el resto, así que se lee como parte de la textura
//     y no como un dibujo pegado.
//  4. Grano, generado con feTurbulence y embebido como data URI. Rompe el
//     bandeado del degradado, que en pantallas de móvil se ve a tiras.
//
// Todo es GPU-compositable —sólo `transform` y `opacity`, y ni una sola
// animación sobre un elemento SVG, que el navegador nunca compone— y se
// detiene entero con `prefers-reduced-motion`.
export function HeroBackdrop() {
  return (
    <div className="axr-lp__fx" aria-hidden>
      <span className="axr-lp__fx-glow" data-i="1" />
      <span className="axr-lp__fx-glow" data-i="2" />
      <span className="axr-lp__fx-glow" data-i="3" />
      <span className="axr-lp__fx-grid" />
      <HeroGlobe />
      <span className="axr-lp__fx-grain" />
    </div>
  );
}
