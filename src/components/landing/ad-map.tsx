"use client";

import { useEffect, useState } from "react";

import { CONSENT_CHANGED_EVENT } from "@/components/consent/consent-banner";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent/config";

// ══════════════════════════════════════════════════════════
//  El mapa de la sede
//
//  Un mapa de Google incrustado es una transferencia de datos a un tercero:
//  carga scripts, lee la IP y planta sus cookies. La primera regla del aviso
//  de esta web es que nada que requiera permiso se cargue antes de la
//  elección (ver la cabecera de lib/consent/config.ts), así que el iframe no
//  puede salir de serie.
//
//  Cómo se resuelve sin que la mayoría note nada:
//
//   · Si ya hay consentimiento de «preferencias» —la categoría de los
//     contenidos incrustados—, el mapa aparece solo. Quien acepta cookies ve
//     el mapa y ya está.
//   · Si no, sale una tarjeta con el pin y un botón. Pulsarlo ES el permiso
//     para esa carga concreta, y se avisa de lo que implica antes de pulsar.
//   · Y si alguien revoca el permiso, el mapa se retira en el acto: para eso
//     está el evento del banner. Revocar tiene que costar lo mismo que
//     conceder.
//
//  Efecto secundario que interesa: mientras nadie lo abre, esta sección no
//  hace ni una petición a Google, y va justo antes del formulario.
// ══════════════════════════════════════════════════════════

function tienePermiso(): boolean {
  const raw = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`),
  )?.[1];
  return parseConsent(raw)?.c.preferences === true;
}

export function AdMap({
  query,
  label,
  cta,
  notice,
}: {
  /** Lo que se busca en el mapa: la dirección postal. */
  query: string;
  label: string;
  cta: string;
  notice: string;
}) {
  // Consentido por la cookie, o abierto a mano en esta visita.
  const [consent, setConsent] = useState(false);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const leer = () => setConsent(tienePermiso());
    leer();
    window.addEventListener(CONSENT_CHANGED_EVENT, leer);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, leer);
  }, []);

  // Revocar retira también el que se abrió a mano: es la misma decisión.
  useEffect(() => {
    if (!consent) setManual(false);
  }, [consent]);

  if (consent || manual) {
    return (
      <iframe
        className="axr-ad__map"
        title={label}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="axr-ad__map axr-ad__map--off">
      {/* Pin dibujado: el hueco enseña de qué va aunque el mapa no esté. */}
      <svg viewBox="0 0 24 24" width={30} height={30} aria-hidden focusable="false">
        <path
          d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
        />
        <circle cx="12" cy="11" r="2.6" fill="currentColor" />
      </svg>
      <button type="button" onClick={() => setManual(true)}>
        {cta}
      </button>
      <p>{notice}</p>
    </div>
  );
}
