// ══════════════════════════════════════════════════════════
//  Etiquetas de seguimiento: qué se carga y con qué identificadores.
//
//  Los identificadores son públicos (acaban escritos en el HTML de cualquier
//  web que los use), así que viven aquí y no en secretos. Se pueden pisar con
//  variables de entorno para probar contra otra cuenta sin tocar código.
//
//  Reparto:
//   · Google Tag Manager — el contenedor, para lo que se gestione desde GTM
//     (GA4, nuevas etiquetas…). Recibe en el dataLayer el consentimiento
//     (`axr_consent_update`) y los leads (`generate_lead`).
//   · Google Ads y el píxel de Meta — instalados en código, tal como pidió la
//     agencia. ⚠︎ NO se deben duplicar como etiquetas dentro de GTM: cada
//     conversión se contaría dos veces.
// ══════════════════════════════════════════════════════════

const pick = (env: string | undefined, fallback: string) => env?.trim() || fallback;

export const GTM_ID = pick(process.env.NEXT_PUBLIC_GTM_ID, "GTM-MQLQ25DC");

export const GOOGLE_ADS_ID = pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, "AW-18411611106");

/** Conversión «Submit lead form» de Google Ads: `AW-…/etiqueta`. */
export const GOOGLE_ADS_LEAD = `${GOOGLE_ADS_ID}/${pick(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  "6K8XCPCirIMdEOLHq8tE",
)}`;

export const META_PIXEL_ID = pick(process.env.NEXT_PUBLIC_META_PIXEL_ID, "2533991507119693");

/**
 * Sólo en producción. Las vistas previas y `next dev` cargarían las mismas
 * etiquetas contra las mismas cuentas, y cada prueba del formulario sería una
 * conversión falsa en Google Ads y en Meta. `TRACKING_FORCE=1` lo enciende en
 * local para depurar con Tag Assistant o el Pixel Helper.
 */
export const TRACKING_ENABLED =
  process.env.VERCEL_ENV === "production" || process.env.TRACKING_FORCE === "1";

/**
 * Los identificadores van dentro de <script>: se validan contra un patrón
 * cerrado para que ni una variable de entorno mal pegada pueda inyectar nada.
 */
export const IDS_VALID =
  /^GTM-[A-Z0-9]{4,12}$/.test(GTM_ID) &&
  /^AW-\d{6,14}\/[\w-]{6,40}$/.test(GOOGLE_ADS_LEAD) &&
  /^\d{8,20}$/.test(META_PIXEL_ID);
