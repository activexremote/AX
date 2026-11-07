import {
  GOOGLE_ADS_ID,
  GTM_ID,
  IDS_VALID,
  META_PIXEL_ID,
} from "@/lib/analytics/config";
import { MetaPixel } from "@/components/analytics/meta-pixel";

// ══════════════════════════════════════════════════════════
//  Etiquetas de marketing de las páginas públicas.
//
//  Las pinta el layout raíz sólo cuando el proxy marca la petición como
//  pública (ver TRACKING_HEADER): el campus y el panel no llevan ninguna.
//
//  Orden, que importa:
//   1. ConsentDefaultScript (también en el <head>, antes que esto) deja
//      Consent Mode en «denied», o en lo que ya decidió la persona.
//   2. GTM y gtag.js de Google Ads, cuando la página ya ha cargado. Respetan
//      Consent Mode solos: sin permiso de marketing no escriben cookies ni
//      identifican a nadie.
//   3. El píxel de Meta NO entiende Consent Mode, así que ni se descarga
//      hasta que hay permiso de marketing (componente MetaPixel).
// ══════════════════════════════════════════════════════════

// Los eventos entran en el dataLayer desde el primer momento (gtm.start, la
// configuración de Ads y lo que empuje la página), pero los dos scripts de
// Google se descargan cuando la página ya ha cargado y el navegador está
// libre: en un móvil con 4G se llevaban el ancho de banda antes que el código
// de la propia página y la dejaban sin responder unos segundos. GTM y gtag.js
// leen al llegar todo lo que haya en la cola, así que no se pierde nada.
// `window.gtag` ya lo define ConsentDefaultScript sobre el mismo dataLayer.
const loader = `(function(w,d){
w.dataLayer=w.dataLayer||[];
w.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});
w.gtag('js',new Date());w.gtag('config','${GOOGLE_ADS_ID}');
function add(src){var j=d.createElement('script');j.async=true;j.src=src;d.head.appendChild(j);}
function go(){add('https://www.googletagmanager.com/gtm.js?id=${GTM_ID}');add('https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}');}
function idle(){(w.requestIdleCallback||function(f){setTimeout(f,1)})(go,{timeout:2500});}
if(d.readyState==='complete')idle();else w.addEventListener('load',idle,{once:true});
})(window,document);`;

/** Va en el <head>, después de ConsentDefaultScript. */
export function MarketingHead() {
  if (!IDS_VALID) return null;
  // IDs validados contra un patrón cerrado: no entra nada del usuario.
  return <script id="axr-marketing" dangerouslySetInnerHTML={{ __html: loader }} />;
}

/**
 * Va justo después de abrir <body>.
 *
 * Sólo el <noscript> de GTM. El del píxel de Meta (una imagen de 1×1) se deja
 * fuera a propósito: sin JavaScript no hay banner ni forma de dar permiso, y
 * esa imagen dispararía el seguimiento sin él.
 */
export function MarketingBody() {
  if (!IDS_VALID) return null;
  return (
    <>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      <MetaPixel id={META_PIXEL_ID} />
    </>
  );
}
