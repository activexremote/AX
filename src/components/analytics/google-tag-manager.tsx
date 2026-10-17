// ══════════════════════════════════════════════════════════
//  Google Tag Manager, sólo en las landings públicas.
//
//  Va en cada landing y no en el layout raíz a propósito: el layout también
//  pinta el campus y el panel, y ahí no pinta nada una etiqueta de marketing.
//  La raíz «/» la cubre LandingView, que es lo que ve quien no tiene sesión.
//
//  El contenedor se carga siempre, pero NO puede medir ni hacer marketing sin
//  permiso: ConsentDefaultScript (layout raíz) ya ha dejado Consent Mode en
//  «denied» antes de que llegue esto, y el banner lo actualiza al decidir.
//  Las etiquetas de Google lo respetan solas; las de terceros (Meta, LinkedIn…)
//  hay que configurarlas en GTM con «Configuración de consentimiento», o se
//  dispararían igual. Eso se decide en GTM, no aquí.
//
//  Sin NEXT_PUBLIC_GTM_ID no se pinta nada: así el código puede estar en
//  producción antes de que exista el contenedor.
// ══════════════════════════════════════════════════════════

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";

/** Un ID con otra forma no se mete en un <script>: es lo único que va dentro. */
const VALID = /^GTM-[A-Z0-9]{4,12}$/.test(GTM_ID);

export function GoogleTagManager() {
  if (!VALID) return null;

  const snippet = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

  return (
    <>
      <script
        id="axr-gtm"
        // ID validado arriba contra un patrón cerrado: no entra nada del usuario.
        dangerouslySetInnerHTML={{ __html: snippet }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}
