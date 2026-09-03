"use client";

import { useEffect, useState } from "react";

import { CONSENT_CHANGED_EVENT } from "@/components/consent/consent-banner";
import { CONSENT_COOKIE, parseConsent } from "@/lib/consent/config";

// ══════════════════════════════════════════════════════════
//  El mapa de la sede
//
//  El mapa se ve de entrada. Es una decisión tomada a propósito y tiene
//  consecuencias, así que quedan escritas:
//
//  Un mapa de Google incrustado es una transferencia de datos a un tercero:
//  carga sus scripts, le revela la IP de quien visita y planta sus cookies.
//  La primera versión de esto no lo cargaba hasta que alguien lo pedía, que
//  es lo que pide el RGPD en sentido estricto y lo que dice la cabecera de
//  lib/consent/config.ts.
//
//  Lo que se conserva de aquello: si alguien ha RECHAZADO expresamente las
//  cookies de preferencias, el mapa no se carga. Un «no» explícito se
//  respeta; no hacerlo sería, además de ilegal, una tomadura de pelo con el
//  panel de configuración que tiene la web.
//
//  Lo que cambia: quien no ha decidido todavía ve el mapa. Eso implica cargar
//  un tercero antes del consentimiento, y por eso se ha corregido a la vez la
//  política de cookies, que hasta hoy afirmaba que no se carga ninguna cookie
//  de terceros por defecto. Esa frase habría dejado de ser cierta.
//
//  `loading="lazy"` no es un detalle: el iframe sólo se pide cuando la
//  sección se acerca a la pantalla, así que quien no baja hasta aquí no llega
//  a tocar a Google.
// ══════════════════════════════════════════════════════════

/** `null` si no hay decisión; si la hay, qué se decidió sobre preferencias. */
function decisionPreferencias(): boolean | null {
  const raw = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`),
  )?.[1];
  const guardado = parseConsent(raw);
  return guardado ? guardado.c.preferences : null;
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
  // Se parte de "no bloqueado": en el servidor no hay cookies que leer y el
  // mapa es lo que se quiere enseñar. Si al montar resulta que hay un rechazo
  // expreso, se retira.
  const [bloqueado, setBloqueado] = useState(false);
  // Y si estando bloqueado alguien lo abre a mano, vale para esta visita.
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const leer = () => setBloqueado(decisionPreferencias() === false);
    leer();
    window.addEventListener(CONSENT_CHANGED_EVENT, leer);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, leer);
  }, []);

  // Volver a rechazar retira también el que se abrió a mano.
  useEffect(() => {
    if (bloqueado) setAbierto(false);
  }, [bloqueado]);

  if (!bloqueado || abierto) {
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
      <button type="button" onClick={() => setAbierto(true)}>
        {cta}
      </button>
      <p>{notice}</p>
    </div>
  );
}
