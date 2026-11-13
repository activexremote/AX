"use client";

import { useId, useRef, useState, useTransition } from "react";

import { submitLead } from "@/app/bienvenida/actions";
import type { LandingCopy } from "@/app/bienvenida/copy";
import { getAttribution, pushLeadEvent } from "@/lib/analytics/atribucion";
import { trackLead } from "@/lib/analytics/events";

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

// ══════════════════════════════════════════════════════════
//  De dónde viene quien rellena el formulario
//
//  Sin esto, en Zoho todos los leads son iguales y no hay forma de saber qué
//  campaña los trajo: pagas anuncios a ciegas. Los `utm_*`, gclid y fbclid de
//  la visita que lo trajo y su página de entrada están guardados en el
//  navegador desde que llegó (lib/analytics/atribucion.ts); aquí se suman la
//  página en la que está, el identificador de clic de otras plataformas y el
//  dominio de procedencia, y viaja todo con el envío.
//
//  Se lee al enviar, no en el servidor: la página es común a los dos idiomas
//  y puede venir de caché, así que lo bueno es siempre lo que ve el navegador.
// ══════════════════════════════════════════════════════════
const OTROS_CLICK_IDS = ["wbraid", "gbraid", "msclkid", "ttclid"] as const;

function leerOrigen(): Record<string, string> {
  const q = new URLSearchParams(window.location.search);
  const a = getAttribution();

  let referrer = "";
  try {
    // Sólo el dominio. La URL completa de donde venga es un dato personal más
    // del que no necesitamos nada.
    if (document.referrer) referrer = new URL(document.referrer).host;
  } catch {
    // Un referrer que no es una URL válida no es un problema: se ignora.
  }
  if (referrer === window.location.host) referrer = "";

  const campos: Record<string, string | undefined> = {
    page: window.location.pathname,
    landing: a.landing_page,
    source: a.utm_source,
    medium: a.utm_medium,
    campaign: a.utm_campaign,
    term: a.utm_term,
    content: a.utm_content,
    gclid: a.gclid,
    fbclid: a.fbclid,
    clickId: a.gclid || a.fbclid || OTROS_CLICK_IDS.map((k) => (q.get(k) ?? "").trim().slice(0, 120)).find(Boolean),
    referrer,
  };

  return Object.fromEntries(Object.entries(campos).filter((e): e is [string, string] => Boolean(e[1])));
}

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
    for (const [k, v] of Object.entries(leerOrigen())) formData.set(`o_${k}`, v);
    startTransition(async () => {
      const result = await submitLead(formData);
      if ("error" in result) {
        setError(copy.errors[result.error as keyof FormCopy["errors"]] ?? copy.errors.db);
        return;
      }
      const courses = formData.getAll("courses").map(String);
      trackLead({ courses });
      pushLeadEvent({ courses });
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
