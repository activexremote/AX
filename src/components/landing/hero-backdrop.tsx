// Textura del héroe. Tres capas sobre el mesh, todas decorativas:
//
//  1. Focos de luz que derivan muy despacio. Son gradientes radiales movidos
//     con `transform`, no con `filter: blur()`: el desenfoque de un elemento
//     grande hunde el rendimiento en un iPhone y el gradiente ya nace suave.
//  2. Rejilla fina, que da la sensación de superficie y no de degradado plano.
//  3. Grano, generado con feTurbulence y embebido como data URI. Rompe el
//     bandeado del degradado, que en pantallas de móvil se ve a tiras.
//
// Todo es GPU-compositable (sólo transform y opacity) y se detiene entero con
// `prefers-reduced-motion`.
export function HeroBackdrop() {
  return (
    <div className="axr-lp__fx" aria-hidden>
      <span className="axr-lp__fx-glow" data-i="1" />
      <span className="axr-lp__fx-glow" data-i="2" />
      <span className="axr-lp__fx-glow" data-i="3" />
      <span className="axr-lp__fx-grid" />
      <span className="axr-lp__fx-grain" />
    </div>
  );
}
