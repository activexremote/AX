"use client";

import { useId, useRef, useState, useTransition } from "react";

import { submitLead } from "@/app/bienvenida/actions";
import type { LandingCopy } from "@/app/bienvenida/copy";

type FormCopy = LandingCopy["form"];

type Props = {
  copy: FormCopy;
  /** "hero" es compacto (va dentro del héroe); "panel" es el bloque grande previo al footer. */
  variant?: "hero" | "panel";
  /** Cursos ya marcados al cargar — las landings de curso marcan el suyo. */
  preselect?: string[];
  /** Texto alternativo del botón (los CTA de cada curso tienen su propia frase). */
  submitLabel?: string;
};

export function LeadForm({ copy, variant = "hero", preselect = [], submitLabel }: Props) {
  const uid = useId();
  // Instante en que se pintó el formulario. Viaja con el envío para que el
  // servidor sepa cuánto se ha tardado en rellenarlo: cinco campos en menos
  // de dos segundos y medio no los rellena una persona.
  const pintado = useRef(Date.now());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("t", String(pintado.current));
    startTransition(async () => {
      const result = await submitLead(formData);
      if ("error" in result) {
        setError(copy.errors[result.error as keyof FormCopy["errors"]] ?? copy.errors.db);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="axr-lead axr-lead--done" data-variant={variant} role="status">
        <span className="axr-lead__done-mark" aria-hidden>
          ✓
        </span>
        <strong>{copy.okTitle}</strong>
        <p>{copy.okBody}</p>
      </div>
    );
  }

  return (
    <form className="axr-lead" data-variant={variant} action={handleSubmit} noValidate>
      <div className="axr-lead__grid">
        {/* `--pair`: nombre y apellidos comparten fila en móvil. Son los dos
            campos de valor más corto del formulario, así que a media columna
            siguen siendo cómodos, y ahorrarse una fila es lo que hace que la
            tarjeta entera quepa en la pantalla de un teléfono. */}
        <div className="axr-lead__field axr-lead__field--pair">
          <label htmlFor={`${uid}-first`}>{copy.firstName}</label>
          <input
            id={`${uid}-first`}
            name="first_name"
            type="text"
            autoComplete="given-name"
            autoCapitalize="words"
            maxLength={60}
            required
          />
        </div>
        <div className="axr-lead__field axr-lead__field--pair">
          <label htmlFor={`${uid}-last`}>{copy.lastName}</label>
          <input
            id={`${uid}-last`}
            name="last_name"
            type="text"
            autoComplete="family-name"
            autoCapitalize="words"
            maxLength={60}
            required
          />
        </div>
        <div className="axr-lead__field">
          <label htmlFor={`${uid}-email`}>{copy.email}</label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={254}
            required
          />
        </div>
        <div className="axr-lead__field">
          <label htmlFor={`${uid}-phone`}>{copy.phone}</label>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={24}
            required
          />
        </div>
        <div className="axr-lead__field axr-lead__field--wide">
          <label htmlFor={`${uid}-city`}>{copy.city}</label>
          <input
            id={`${uid}-city`}
            name="city"
            type="text"
            autoComplete="address-level2"
            autoCapitalize="words"
            maxLength={80}
            required
          />
        </div>
      </div>

      <fieldset className="axr-lead__courses">
        <legend>
          {copy.courseLabel}
          <span>{copy.courseHint}</span>
        </legend>
        <div className="axr-lead__course-opts">
          {copy.courses.map((course) => (
            <label key={course.key} className="axr-lead__course">
              <input
                type="checkbox"
                name="courses"
                value={course.key}
                defaultChecked={preselect.includes(course.key)}
              />
              <span className="axr-lead__course-box" aria-hidden />
              <span className="axr-lead__course-text">
                <strong>{course.label}</strong>
                <em>{course.sub}</em>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot — oculto para personas, irresistible para bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="axr-lead__hp"
      />

      {error ? (
        <p className="axr-lead__error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="axr-lead__submit" disabled={pending}>
        {pending ? copy.sending : submitLabel ?? copy.submit}
        {!pending && <span aria-hidden>→</span>}
      </button>

      <p className="axr-lead__legal">{copy.legal}</p>
    </form>
  );
}
