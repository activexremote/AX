"use client";

import { useId, useState, useTransition } from "react";

import { startCheckout } from "@/app/matricula/actions";
import { LocaleLink } from "@/components/locale-link";

// Compra de un curso relámpago.
//
// Deliberadamente NO reutiliza el checkout del programa. Ahí hay que elegir
// oferta, elegir camino y entender qué incluye cada plan; aquí hay un producto,
// un precio y tres campos. Meter una compra de 75 € por impulso en una pantalla
// que empieza preguntando entre tres modalidades de 2.400 € es la forma más
// segura de perderla.
//
// El importe NO se manda: va en la clave de la oferta (`relampago-web-abc`) y
// el servidor lo resuelve contra su catálogo. Lo que llega del navegador nunca
// decide lo que se cobra.

export type FlashBuyCopy = {
  firstName: string;
  lastName: string;
  email: string;
  emailHint: string;
  consent: string;
  submit: string;
  sending: string;
  secure: string;
  errors: Record<string, string>;
};

type Props = {
  offerKey: string;
  price: string;
  copy: FlashBuyCopy;
};

export function FlashBuy({ offerKey, price, copy }: Props) {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await startCheckout(formData);
      if ("error" in result) {
        setError(copy.errors[result.error] ?? copy.errors.stripe);
        return;
      }
      // Salida del sitio hacia la pasarela: navegación dura, no del router.
      window.location.assign(result.url);
    });
  }

  return (
    <form className="axr-flash__buy-form" action={handleSubmit} noValidate>
      <input type="hidden" name="offer" value={offerKey} />

      <div className="axr-flash__buy-grid">
        <div className="axr-flash__field">
          <label htmlFor={`${uid}-first`}>{copy.firstName}</label>
          <input id={`${uid}-first`} name="first_name" type="text" autoComplete="given-name" required />
        </div>
        <div className="axr-flash__field">
          <label htmlFor={`${uid}-last`}>{copy.lastName}</label>
          <input id={`${uid}-last`} name="last_name" type="text" autoComplete="family-name" required />
        </div>
        <div className="axr-flash__field axr-flash__field--wide">
          <label htmlFor={`${uid}-email`}>{copy.email}</label>
          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required />
          <small>{copy.emailHint}</small>
        </div>
      </div>

      <label className="axr-flash__consent">
        <input type="checkbox" name="consent" value="1" />
        <span>
          {copy.consent}{" "}
          <LocaleLink href="/legal/terminos">/legal/terminos</LocaleLink>
          {" · "}
          <LocaleLink href="/legal/privacidad">/legal/privacidad</LocaleLink>
        </span>
      </label>

      {error && (
        <p className="axr-flash__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg" disabled={pending}>
        {pending ? copy.sending : `${copy.submit} · ${price}`}
        {!pending && <span aria-hidden>→</span>}
      </button>

      <p className="axr-flash__secure">{copy.secure}</p>
    </form>
  );
}
