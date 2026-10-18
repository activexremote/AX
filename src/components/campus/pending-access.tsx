import Link from "next/link";

import "@/app/login/login.scss";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { getI18n } from "@/lib/i18n/server";
import { firstName } from "@/lib/data/profile";
import type { Profile } from "@/lib/supabase/types";

/**
 * Lo que ve un alumno con cuenta y sin matrícula activa.
 *
 * No es la cerradura: las políticas de modules y lessons (has_course_access)
 * ya le devuelven cero filas. Esto es para que no vea un campus vacío y crea
 * que algo está roto, sino qué le falta y cómo conseguirlo.
 */
export async function PendingAccess({ profile }: { profile: Profile }) {
  const { t } = await getI18n();
  const p = t.pending;

  return (
    <main className="axr-login">
      <div className="axr-login__frame axr-pending">
        <header className="axr-login__bar">
          <span className="axr-login__bar-left">
            <span className="axr-login__bar-dot" aria-hidden /> {p.bar}
          </span>
          <span className="axr-login__bar-meta">
            <LocaleToggle />
          </span>
        </header>

        <div className="axr-pending__body">
          <div className="axr-login__brand">
            <BrandMark size={26} />
            <div>
              <div className="axr-login__wordmark">ActiveXRemote</div>
              <div className="axr-login__eyebrow">{p.eyebrow} · {firstName(profile)}</div>
            </div>
          </div>

          <h1 className="axr-login__headline">{p.title}</h1>
          <p className="axr-login__lead">{p.lead}</p>

          <ol className="axr-pending__steps">
            {p.steps.map((step, i) => (
              <li key={step} className={i === 0 ? "is-done" : i === 1 ? "is-current" : undefined}>
                <span className="axr-pending__mark" aria-hidden>{i === 0 ? "✓" : String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="axr-pending__actions">
            <Link href="/matricula" className="axr-login__submit axr-pending__cta">
              {p.cta} <span aria-hidden>→</span>
            </Link>
            <form action="/auth/sign-out" method="post">
              <button type="submit" className="axr-login__ghost">{p.signOut}</button>
            </form>
          </div>

          <div className="axr-pending__note">
            <strong>{p.paidTitle}</strong>
            <span>{p.paidBody}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
