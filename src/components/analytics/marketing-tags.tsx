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
//   2. GTM y gtag.js de Google Ads. Respetan Consent Mode solos: sin permiso
//      de marketing no escriben cookies ni identifican a nadie.
//   3. El píxel de Meta NO entiende Consent Mode, así que ni se descarga
//      hasta que hay permiso de marketing (componente MetaPixel).
// ══════════════════════════════════════════════════════════

const gtm = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`;

// `window.gtag` ya lo define ConsentDefaultScript sobre el mismo dataLayer.
const googleAds = `window.gtag('js', new Date());window.gtag('config', '${GOOGLE_ADS_ID}');`;

/** Va en el <head>: GTM y la etiqueta de Google piden estar lo más arriba posible. */
export function MarketingHead() {
  if (!IDS_VALID) return null;
  return (
    <>
      {/* IDs validados contra un patrón cerrado: no entra nada del usuario. */}
      <script id="axr-gtm" dangerouslySetInnerHTML={{ __html: gtm }} />
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} />
      <script id="axr-google-ads" dangerouslySetInnerHTML={{ __html: googleAds }} />
    </>
  );
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
