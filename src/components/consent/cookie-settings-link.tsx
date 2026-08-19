"use client";

import { CONSENT_OPEN_EVENT } from "@/components/consent/consent-banner";

// Revocación permanente: el aviso tiene que poder reabrirse desde cualquier
// página, sin plataforma de por medio. Se comunica por evento para no montar
// un contexto que envolvería toda la aplicación por un botón.
export function CookieSettingsLink({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className ? `axr-cookie-link ${className}` : "axr-cookie-link"}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      {label}
    </button>
  );
}
