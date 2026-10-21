import { CONSENT_COOKIE, parseConsent, type ConsentRecord } from "@/lib/consent/config";

/** Sólo en el navegador. La decisión guardada, o null si no hay (o no vale). */
export function readConsent(): ConsentRecord | null {
  return parseConsent(
    document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`))?.[1],
  );
}

/** ¿Hay permiso de marketing ahora mismo? */
export function marketingAllowed(): boolean {
  return readConsent()?.c.marketing === true;
}
