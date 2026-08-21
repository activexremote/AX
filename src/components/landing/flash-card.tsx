import { LocaleLink } from "@/components/locale-link";
import { GiftIcon, NinjaIcon } from "@/components/landing/flash-icons";
import { FlashThumb } from "@/components/landing/flash-thumb";
import { FlashBuyButton } from "@/components/landing/flash-buy-button";
import { flashStats, type FlashCourse } from "@/lib/relampago/catalog";
import { formatAmount } from "@/lib/stripe/catalog";
import type { Locale } from "@/lib/i18n/config";

// La tarjeta de un curso relámpago.
//
// Es la MISMA en la home y en el índice, a propósito: son el mismo objeto y
// tienen que reconocerse como tal. Cuando haya cuatro cursos, la home enseña
// los primeros y el índice todos, sin que nadie tenga que mantener dos
// diseños que se van pareciendo cada vez menos.
//
// Manda la miniatura del vídeo: es lo que dice «esto es un curso en vídeo»
// antes de leer nada, y es lo que diferencia una tarjeta de producto de una
// caja de texto más.

export type FlashCardCopy = {
  hours: string;
  lessons: string;
  missions: string;
  cta: string;
  buy: string;
  sending: string;
  buyError: string;
  gift: string;
  ninja: string;
};

export function FlashCard({
  course,
  locale,
  copy,
  tone = "light",
  canBuy = false,
  variant = "full",
}: {
  course: FlashCourse;
  locale: Locale;
  copy: FlashCardCopy;
  /** "dark" para cuando va sobre fondo de tinta. */
  tone?: "light" | "dark";
  /** Sin Stripe configurado, el botón de compra no se pinta. */
  canBuy?: boolean;
  /**
   * "strip" es la versión de una sola fila para la home: miniatura pequeña,
   * lo justo de texto y el precio con su botón. Ocupa un tercio de alto que
   * la completa, que es lo que necesita una home que ya es larga y donde
   * esto es una salida lateral, no el producto principal.
   */
  variant?: "full" | "strip";
}) {
  const s = flashStats(course);
  const price = formatAmount(course.priceCents, locale);
  const href = `/cursos-relampago/${course.slug}`;

  if (variant === "strip") {
    return (
      <article className="axr-fstrip" data-tone={tone}>
        {course.poster && (
          <LocaleLink href={href} className="axr-fstrip__media" aria-label={course.title}>
            <FlashThumb
              poster={course.poster}
              video={course.demoVideo}
              alt={course.title}
              badge={`${s.hours} h`}
            />
          </LocaleLink>
        )}

        <div className="axr-fstrip__body">
          <span className="axr-fstrip__code">{course.code}</span>
          <h3>
            <LocaleLink href={href}>{course.title}</LocaleLink>
          </h3>
          <p className="axr-fstrip__claim">{course.claim}</p>
          <p className="axr-fstrip__meta">
            {s.lessons} {copy.lessons} · {s.hours} h {copy.hours} · {s.missions} {copy.missions}
          </p>
        </div>

        <div className="axr-fstrip__buy">
          <span className="axr-fstrip__price">{price}</span>
          {canBuy ? (
            <>
              <FlashBuyButton
                offerKey={`relampago-${course.key}`}
                label={copy.buy}
                sending={copy.sending}
                errorLabel={copy.buyError}
                className="axr-lp__btn axr-lp__btn--solid"
              />
              {/* Comprar directo es para quien ya lo tiene claro. El resto
                  necesita ver el curso antes, y sin este enlace sólo se
                  llegaba al detalle pulsando el título. */}
              <LocaleLink href={href} className="axr-fstrip__detail">
                {copy.cta} →
              </LocaleLink>
            </>
          ) : (
            <LocaleLink href={href} className="axr-lp__btn axr-lp__btn--solid">
              {copy.cta} <span aria-hidden>→</span>
            </LocaleLink>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="axr-fcard" data-tone={tone}>
      {course.poster && (
        <LocaleLink href={href} className="axr-fcard__media" aria-label={course.title}>
          <FlashThumb
            poster={course.poster}
            video={course.demoVideo}
            alt={course.title}
            badge={`${s.hours} h`}
          />
        </LocaleLink>
      )}

      <div className="axr-fcard__body">
        <div className="axr-fcard__top">
          <span className="axr-fcard__code">{course.code}</span>
          <span className="axr-fcard__price">{price}</span>
        </div>

        <h3 className="axr-fcard__title">
          <LocaleLink href={href}>{course.title}</LocaleLink>
        </h3>
        <p className="axr-fcard__claim">{course.claim}</p>
        <p className="axr-fcard__lead">{course.lead}</p>

        <ul className="axr-fcard__facts">
          <li><strong>{s.hours} h</strong><span>{copy.hours}</span></li>
          <li><strong>{s.lessons}</strong><span>{copy.lessons}</span></li>
          <li><strong>{s.missions}</strong><span>{copy.missions}</span></li>
        </ul>

        {/* El regalo y el truco, en pequeño. En la tarjeta se nombran; el
            desarrollo está en la página del curso. */}
        <ul className="axr-fcard__extras">
          <li>
            <span className="axr-fcard__extra-icon" data-kind="gift"><GiftIcon size={16} /></span>
            <span><strong>{copy.gift}</strong> {course.gift.title}</span>
          </li>
          <li>
            <span className="axr-fcard__extra-icon" data-kind="ninja"><NinjaIcon size={16} /></span>
            <span><strong>{copy.ninja}</strong> {course.ninja.title}</span>
          </li>
        </ul>

        <div className="axr-fcard__actions">
          {canBuy && (
            <FlashBuyButton
              offerKey={`relampago-${course.key}`}
              label={`${copy.buy} · ${price}`}
              sending={copy.sending}
              errorLabel={copy.buyError}
              className="axr-lp__btn axr-lp__btn--solid"
            />
          )}
          <LocaleLink href={href} className="axr-fcard__detail">
            {copy.cta} →
          </LocaleLink>
        </div>
      </div>
    </article>
  );
}

/** Hueco para los cursos que están por venir. Cierra la rejilla sin mentir. */
export function FlashSoonCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="axr-fcard axr-fcard--soon">
      <div className="axr-fcard__body">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}
