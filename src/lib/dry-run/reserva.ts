/** Lo que viaja de la página del dry run a la confirmación, pasando por Google. */
export const COOKIE_RESERVA = "axr_dryrun";

export type CookieReserva = {
  slug: string;
  ref: string | null;
  inv: string | null;
  utm: Partial<Record<"source" | "medium" | "campaign" | "content" | "term", string>>;
};
