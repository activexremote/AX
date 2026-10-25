import Link from "next/link";

import "@/components/campus-header.scss";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { contarMisTareasAbiertas } from "@/lib/data/assignments";
import { getCurrentProfile, firstName, userInitials } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";

// ══════════════════════════════════════════════════════════
//  La cabecera del campus (v2)
//
//  Tres sitios y nada más: Inicio, Mis tareas (con el número de las que
//  esperan) y Mi progreso. El equipo tiene además el acceso al panel. En el
//  móvil la navegación baja a una barra fija abajo, al alcance del pulgar,
//  como en cualquier aplicación.
// ══════════════════════════════════════════════════════════

export async function CampusHeader({
  active,
}: {
  active?: "home" | "progress" | "admin" | "tasks";
}) {
  const [profile, { t }, abiertas] = await Promise.all([getCurrentProfile(), getI18n(), contarMisTareasAbiertas()]);
  const isStaff = profile?.role === "administrador" || profile?.role === "profesor";
  const roleLabel = profile ? t.common[`role_${profile.role}` as const] : t.common.role_alumno;

  const links = [
    { key: "home", href: "/", label: t.nav.home, icon: "inicio" as const },
    { key: "tasks", href: "/mis-tareas", label: t.nav.myTasks, icon: "tareas" as const, badge: abiertas },
    { key: "progress", href: "/mi-progreso", label: t.nav.myProgress, icon: "calendario" as const },
  ];

  return (
    <header className="axr-header">
      <div className="axr-header__inner">
        <Link href="/" className="axr-header__logo">
          <BrandMark size={20} className="axr-header__logo-mark" />
          <span>ActiveXRemote</span>
        </Link>

        <nav className="axr-header__nav" aria-label="Campus">
          {links.map((l) => (
            <Link key={l.key} href={l.href} className={`axr-header__link${active === l.key ? " is-active" : ""}`} aria-current={active === l.key ? "page" : undefined}>
              <Icono n={l.icon} size={18} />
              <span>{l.label}</span>
              {l.badge ? <span className="axr-header__badge">{l.badge}</span> : null}
            </Link>
          ))}
          {isStaff ? (
            <Link href="/admin" className={`axr-header__link axr-header__link--panel${active === "admin" ? " is-active" : ""}`}>
              <Icono n="ajustes" size={18} />
              <span>{t.nav.admin}</span>
            </Link>
          ) : null}
        </nav>

        <div className="axr-header__meta">
          <LocaleToggle />

          <details className="axr-header__user">
            <summary aria-label={firstName(profile)}>
              <span className="axr-header__avatar">{userInitials(profile)}</span>
              <span className="axr-header__user-name">{firstName(profile)}</span>
            </summary>
            <div className="axr-header__menu">
              <div className="axr-header__menu-head">
                <span className="axr-header__avatar axr-header__avatar--big">{userInitials(profile)}</span>
                <span>
                  <strong>{profile?.full_name ?? profile?.email}</strong>
                  <small>{profile?.email}</small>
                  <span className="axr-header__role">{roleLabel}</span>
                </span>
              </div>
              <Link href="/mi-progreso">
                <Icono n="calendario" /> {t.nav.myProgress}
              </Link>
              {isStaff ? (
                <Link href="/admin">
                  <Icono n="ajustes" /> {t.nav.adminPanel}
                </Link>
              ) : null}
              <form action="/auth/sign-out" method="post">
                <button type="submit">
                  <Icono n="salir" /> {t.nav.logout}
                </button>
              </form>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
