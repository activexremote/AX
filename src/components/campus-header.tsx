import Link from "next/link";

import "@/components/campus-header.scss";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { getCurrentProfile, firstName, userInitials } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";

export async function CampusHeader({
  active,
}: {
  active?: "home" | "progress" | "admin" | "tasks";
}) {
  const profile = await getCurrentProfile();
  const { t } = await getI18n();
  const isStaff = profile?.role === "administrador" || profile?.role === "profesor";
  const roleLabel = profile
    ? t.common[`role_${profile.role}` as const]
    : t.common.role_alumno;

  return (
    <header className="axr-header">
      <div className="axr-header__inner">
        <Link href="/" className="axr-header__logo">
          <BrandMark size={20} className="axr-header__logo-mark" />
          <span>ActiveXRemote</span>
        </Link>

        <nav className="axr-header__nav">
          <Link
            href="/"
            className={`axr-header__link ${active === "home" ? "is-active" : ""}`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/mis-tareas"
            className={`axr-header__link ${active === "tasks" ? "is-active" : ""}`}
          >
            {t.nav.myTasks}
          </Link>
          <Link
            href="/mi-progreso"
            className={`axr-header__link ${active === "progress" ? "is-active" : ""}`}
          >
            {t.nav.myProgress}
          </Link>
          {isStaff ? (
            <Link
              href="/admin"
              className={`axr-header__link ${active === "admin" ? "is-active" : ""}`}
            >
              {t.nav.admin}
            </Link>
          ) : null}
        </nav>

        <div className="axr-header__meta">
          <LocaleToggle />

          <details className="axr-header__user">
            <summary>
              <span className="axr-header__avatar">{userInitials(profile)}</span>
              <span className="axr-header__user-name">{firstName(profile)}</span>
            </summary>
            <div className="axr-header__menu">
              <div className="axr-header__menu-head">
                <strong>{profile?.full_name ?? profile?.email}</strong>
                <span>{profile?.email}</span>
                <span className="axr-header__role">{roleLabel}</span>
              </div>
              <Link href="/mi-progreso">{t.nav.myProgress}</Link>
              {isStaff ? <Link href="/admin">{t.nav.adminPanel}</Link> : null}
              <form action="/auth/sign-out" method="post">
                <button type="submit">{t.nav.logout}</button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
