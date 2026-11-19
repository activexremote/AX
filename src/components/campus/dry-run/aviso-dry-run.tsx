import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { getMiDryRun } from "@/lib/dry-run/datos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { cuandoEs } from "@/lib/dry-run/tiempo";
import { fmt } from "@/lib/i18n/dictionaries";
import { dryRunCampusCopy } from "@/lib/i18n/dry-run-campus";
import { getLocale } from "@/lib/i18n/server";
import "@/app/(campus)/preparacion/preparacion.scss";

/**
 * En la portada del campus, para quien tiene plaza en un dry run: cuándo es,
 * cuánto lleva de la preparación y el enlace a ella. Después de la clase, el
 * enlace al feedback mientras no lo haya dejado.
 */
export async function AvisoDryRun() {
  const [mio, locale] = await Promise.all([getMiDryRun(), getLocale()]);
  if (!mio) return null;
  const c = dryRunCampusCopy[locale];
  const { run, guest } = mio;

  const terminado = new Date(run.ends_at).getTime() < Date.now();
  if (terminado && guest.feedback_at) return null;

  const hechos = PASOS.filter((p) => guest.onboarding[p.key]).length;
  const titulo = locale === "en" && run.title_en?.trim() ? run.title_en : run.title;
  const meet = !terminado ? run.meet_url : null;
  if (meet) {
    // Con la videollamada publicada, dos botones: entrar a la clase y la preparación.
    return (
      <div className="axr-dr-aviso">
        <Icono n="calendario" size={22} />
        <span className="axr-dr-aviso__text">
          <strong>{titulo}</strong>
          <span>
            {cuandoEs(run.starts_at, run.ends_at, locale)} · {fmt(c.bannerPrep, { a: hechos, b: PASOS.length })}
          </span>
        </span>
        <span className="axr-dr-aviso__btns">
          <a href={meet} className="axr-btn" target="_blank" rel="noreferrer">
            <Icono n="play" /> {c.bannerJoin}
          </a>
          <Link href="/preparacion" className="axr-btn axr-btn--ghost">
            {c.bannerPrepCta} <Icono n="flecha" />
          </Link>
        </span>
      </div>
    );
  }

  return (
    <Link href={terminado ? "/preparacion#feedback" : "/preparacion"} className="axr-dr-aviso">
      <Icono n="calendario" size={22} />
      <span className="axr-dr-aviso__text">
        <strong>{terminado ? c.bannerFeedbackTitle : titulo}</strong>
        <span>
          {terminado
            ? c.bannerFeedbackBody
            : `${cuandoEs(run.starts_at, run.ends_at, locale)} · ${fmt(c.bannerPrep, { a: hechos, b: PASOS.length })}`}
        </span>
      </span>
      <span className="axr-btn">
        {terminado ? c.bannerFeedbackCta : c.bannerPrepCta} <Icono n="flecha" />
      </span>
    </Link>
  );
}
