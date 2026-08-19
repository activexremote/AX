import { CONSENT_COOKIE, CONSENT_VERSION } from "@/lib/consent/config";

// Estado por defecto de Consent Mode. Tiene que ejecutarse antes que cualquier
// etiqueta de medición, así que va inline y sin `defer`: en cuanto el navegador
// lo encuentra, ya está `denied` todo lo que requiere permiso.
//
// Si hay cookie válida, actualiza en el mismo tick, para que una etiqueta que
// cargue después no llegue a ver el estado denegado de quien ya dijo que sí.
const script = `
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var DENIED = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  };
  gtag('consent', 'default', DENIED);

  try {
    var m = document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/);
    if (!m) return;
    var saved = JSON.parse(decodeURIComponent(m[1]));
    if (!saved || saved.v !== ${CONSENT_VERSION} || !saved.c) return;
    var g = function (on) { return on ? 'granted' : 'denied'; };
    gtag('consent', 'update', {
      ad_storage: g(saved.c.marketing),
      ad_user_data: g(saved.c.marketing),
      ad_personalization: g(saved.c.marketing),
      analytics_storage: g(saved.c.analytics),
      functionality_storage: g(saved.c.preferences),
      personalization_storage: g(saved.c.preferences),
      security_storage: 'granted'
    });
  } catch (e) {
    /* cookie corrupta: se queda todo denegado, que es el lado seguro */
  }
})();
`;

export function ConsentDefaultScript() {
  return (
    <script
      id="axr-consent-default"
      // Cadena fija generada en el servidor: no entra nada del usuario.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
