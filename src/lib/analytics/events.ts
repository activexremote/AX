import { GOOGLE_ADS_LEAD } from "@/lib/analytics/config";
import { marketingAllowed } from "@/lib/consent/client";

/**
 * Conversión de lead: se llama una vez, cuando el formulario se ha guardado
 * de verdad (no al pulsar el botón). Hace las veces de la «Thank You Page» de
 * las instrucciones de la agencia: aquí el agradecimiento se pinta en el
 * mismo sitio en vez de en otra URL, así que el evento sale de aquí.
 *
 *  · GTM: `generate_lead` en el dataLayer, para lo que se monte allí.
 *  · Google Ads: la conversión «Submit lead form». Respeta Consent Mode sola.
 *  · Meta: `Lead`, sólo con permiso de marketing (sin él, el píxel ni existe).
 */
export function trackLead(detail: { courses?: string[] } = {}) {
  window.dataLayer?.push({ event: "generate_lead", axr_courses: detail.courses ?? [] });
  window.gtag?.("event", "conversion", { send_to: GOOGLE_ADS_LEAD });
  if (marketingAllowed()) window.fbq?.("track", "Lead");
}
