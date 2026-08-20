"use client";

import { useId, useState, useTransition } from "react";

import { startCheckout } from "@/app/matricula/actions";
import type { checkoutCopy } from "@/app/matricula/copy";
import { LocaleLink } from "@/components/locale-link";

type Copy = (typeof checkoutCopy)["es"];

export type OfferView = {
  key: string;
  courses: 1 | 2;
  amount: string;
  total: string;
  charges: number;
  early: boolean;
};

type Props = {
  copy: Copy;
  offers: OfferView[];
  /** Preselección desde la landing: ?curso=…&oferta=… */
  initialCourse?: string;
  initialOffer?: string;
};

export function CheckoutForm({ copy, offers, initialCourse, initialOffer }: Props) {
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [offer, setOffer] = useState(
    () => offers.find((o) => o.key === initialOffer)?.key ?? offers[0]?.key ?? "",
  );
  const [course, setCourse] = useState(initialCourse ?? "remote-professional");

  const selected = offers.find((o) => o.key === offer);
  // El pack ya incluye los dos: preguntar el camino ahí sólo confunde.
  const needsCourse = selected?.courses === 1;

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
    <form className="axr-checkout__form" action={handleSubmit} noValidate>
      <fieldset className="axr-checkout__block">
        <legend>{copy.offerLabel}</legend>
        <div className="axr-checkout__offers">
          {offers.map((o) => {
            const c = copy.offers[o.key as keyof Copy["offers"]];
            return (
              <label key={o.key} className="axr-checkout__offer" data-on={o.key === offer}>
                <input
                  type="radio"
                  name="offer"
                  value={o.key}
                  checked={o.key === offer}
                  onChange={() => setOffer(o.key)}
                />
                <span className="axr-checkout__offer-body">
                  <span className="axr-checkout__offer-head">
                    <strong>{c.name}</strong>
                    {o.early && <em className="axr-checkout__badge">{copy.earlyBadge}</em>}
                  </span>
                  <span className="axr-checkout__offer-price">
                    {o.amount}
                    {o.charges > 1 && <i> × {o.charges}</i>}
                  </span>
                  <span className="axr-checkout__offer-detail">{c.detail}</span>
                  {c.note && <span className="axr-checkout__offer-note">{c.note}</span>}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {needsCourse ? (
        <fieldset className="axr-checkout__block">
          <legend>
            {copy.courseLabel}
            <span>{copy.courseHint}</span>
          </legend>
          <div className="axr-checkout__courses">
            {copy.courses.map((c) => (
              <label key={c.key} className="axr-checkout__course" data-on={c.key === course}>
                <input
                  type="radio"
                  name="course"
                  value={c.key}
                  checked={c.key === course}
                  onChange={() => setCourse(c.key)}
                />
                <span>
                  <strong>{c.name}</strong>
                  <em>{c.sub}</em>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="axr-checkout__both">{copy.bothCourses}</p>
      )}

      <fieldset className="axr-checkout__block">
        <legend>{copy.dataLabel}</legend>
        <div className="axr-checkout__grid">
          <div className="axr-checkout__field">
            <label htmlFor={`${uid}-first`}>{copy.firstName}</label>
            <input id={`${uid}-first`} name="first_name" type="text" autoComplete="given-name" required />
          </div>
          <div className="axr-checkout__field">
            <label htmlFor={`${uid}-last`}>{copy.lastName}</label>
            <input id={`${uid}-last`} name="last_name" type="text" autoComplete="family-name" required />
          </div>
          <div className="axr-checkout__field axr-checkout__field--wide">
            <label htmlFor={`${uid}-email`}>{copy.email}</label>
            <input id={`${uid}-email`} name="email" type="email" autoComplete="email" required />
            <small>{copy.emailHint}</small>
          </div>
        </div>
      </fieldset>

      <label className="axr-checkout__consent">
        <input type="checkbox" name="consent" value="1" />
        <span>
          {copy.consent}{" "}
          <LocaleLink href="/legal/terminos">/legal/terminos</LocaleLink>
          {" · "}
          <LocaleLink href="/legal/privacidad">/legal/privacidad</LocaleLink>
        </span>
      </label>

      {selected && (
        <p className="axr-checkout__total">
          <span>{copy.totalLabel}</span>
          <strong>{selected.total}</strong>
        </p>
      )}

      {error && (
        <p className="axr-checkout__error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="axr-lp__btn axr-lp__btn--solid axr-lp__btn--lg" disabled={pending}>
        {pending ? copy.sending : copy.submit}
        {!pending && <span aria-hidden>→</span>}
      </button>

      <p className="axr-checkout__secure">{copy.secure}</p>
    </form>
  );
}
