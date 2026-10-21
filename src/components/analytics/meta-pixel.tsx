"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { CONSENT_CHANGED_EVENT } from "@/components/consent/consent-banner";
import type { ConsentChoices } from "@/lib/consent/config";
import { marketingAllowed } from "@/lib/consent/client";

// ══════════════════════════════════════════════════════════
//  Píxel de Meta, atado al consentimiento.
//
//  Es el código oficial del píxel, pero ejecutado sólo cuando hay permiso de
//  marketing: Meta no entiende Consent Mode, y si fbevents.js se descargara
//  antes, ya habría enviado la visita. Sin permiso no se pide ni el archivo.
//
//  · Permiso al entrar (cookie ya guardada): se carga en el acto.
//  · Permiso dado ahora en el banner: se carga sin recargar la página.
//  · Permiso retirado: `fbq('consent', 'revoke')` y deja de enviar.
//  · Cambio de página dentro de la web (navegación de Next, sin recarga):
//    un PageView por cada una, como haría el píxel en una web clásica.
// ══════════════════════════════════════════════════════════

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function load(id: string) {
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  // Snippet oficial de Meta, el mismo de las instrucciones, con tipos.
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq!("consent", "grant");
  window.fbq!("init", id);
  window.fbq!("track", "PageView");
}

export function MetaPixel({ id }: { id: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (marketingAllowed()) load(id);

    const onChange = (e: Event) => {
      const choices = (e as CustomEvent<ConsentChoices>).detail;
      if (choices.marketing) load(id);
      else window.fbq?.("consent", "revoke");
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, [id]);

  // El PageView de la primera carga lo manda `load`. Éste cubre los cambios de
  // ruta posteriores, y sólo si el píxel está cargado y con permiso.
  useEffect(() => {
    const prev = lastPath.current;
    lastPath.current = pathname;
    if (prev === null || prev === pathname) return;
    if (window.fbq && marketingAllowed()) window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}
