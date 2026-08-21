"use client";

import { useState, useTransition } from "react";

import { startDirectCheckout } from "@/app/matricula/actions";

// «Comprar» directo: de aquí a la pasarela, sin pantallas por medio.
//
// No manda importe ni curso: sólo la clave de la oferta. El precio lo resuelve
// el servidor contra su catálogo, así que nadie puede abrir el inspector y
// cambiarse el precio.
export function FlashBuyButton({
  offerKey,
  label,
  sending,
  errorLabel,
  className = "axr-lp__btn axr-lp__btn--solid",
}: {
  offerKey: string;
  label: string;
  sending: string;
  errorLabel: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function comprar() {
    setError(false);
    startTransition(async () => {
      const result = await startDirectCheckout(offerKey);
      if ("error" in result) {
        setError(true);
        return;
      }
      // Salida del sitio hacia la pasarela: navegación dura, no del router.
      window.location.assign(result.url);
    });
  }

  return (
    <span className="axr-buybtn">
      <button type="button" className={className} onClick={comprar} disabled={pending}>
        {pending ? sending : label}
        {!pending && <span aria-hidden>→</span>}
      </button>
      {/* Si falla, se dice aquí mismo y se deja el botón vivo para reintentar:
          mandar a otra pantalla a quien acaba de pulsar «comprar» es perderlo. */}
      {error && (
        <span className="axr-buybtn__error" role="alert">
          {errorLabel}
        </span>
      )}
    </span>
  );
}
