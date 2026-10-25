import Link from "next/link";

import "@/components/campus/pending-access.scss";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { campusACopy } from "@/lib/i18n/campus-v2-a";
import { fmt } from "@/lib/i18n/dictionaries";
import { getI18n } from "@/lib/i18n/server";
import { firstName } from "@/lib/data/profile";
import type { Profile } from "@/lib/supabase/types";

/**
 * Lo que ve un alumno con cuenta y sin matrícula activa.
 *
 * No es la cerradura: las políticas de modules y lessons (has_course_access)
 * ya le devuelven cero filas. Esto es para que no vea un campus vacío y crea
 * que algo está roto, sino qué le falta y cómo conseguirlo: dónde está (los
 * tres pasos, con el suyo marcado), el botón para matricularse y qué hacer si
 * ya ha pagado.
 */
export async function PendingAccess({ profile }: { profile: Profile }) {
  const { t, locale } = await getI18n();
  const p = t.pending;
  const c = campusACopy[locale];

  return (
    <main className="axr-page axr-pend">
      <div className="axr-pend__top">
        <span className="axr-pend__brand">
          <BrandMark size={20} />
          <span>ActiveXRemote</span>
        </span>
        <LocaleToggle />
      </div>

      <section className="axr-pend__card">
        <span className="axr-c-pill axr-c-pill--accent">
          <Icono n="usuarios" size={12} /> {fmt(c.pendingHello, { n: firstName(profile) })}
        </span>
        <h1>{p.title}</h1>
        <p className="axr-pend__lead">{p.lead}</p>

        <ol className="axr-pend__steps">
          {p.steps.map((step, i) => {
            const estado = i === 0 ? "done" : i === 1 ? "current" : "todo";
            return (
              <li key={step} data-state={estado}>
                <span className="axr-pend__mark" aria-hidden>
                  {estado === "done" ? <Icono n="ok" size={14} /> : i + 1}
                </span>
                <span>{step}</span>
              </li>
            );
          })}
        </ol>

        <div className="axr-pend__actions">
          <Link href="/matricula" className="axr-btn">
            {p.cta} <Icono n="flecha" />
          </Link>
          <form action="/auth/sign-out" method="post">
            <button type="submit" className="axr-btn axr-btn--ghost">
              <Icono n="salir" /> {p.signOut}
            </button>
          </form>
        </div>

        <div className="axr-c-note">
          <Icono n="info" />
          <span>
            <strong>{p.paidTitle}</strong> {p.paidBody}
          </span>
        </div>
      </section>
    </main>
  );
}
