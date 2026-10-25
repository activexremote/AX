import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { getCurrentProfile } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { banCopy } from "@/lib/i18n/banners";
import { contarPendientes } from "@/lib/social/panel";
import "@/app/admin/admin.scss";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "administrador" && profile.role !== "profesor") {
    redirect("/");
  }
  const [{ t, locale }, pendientes] = await Promise.all([
    getI18n(),
    profile.role === "administrador" ? contarPendientes() : null,
  ]);
  const roleLabel = t.common[`role_${profile.role}` as const];
  const pc = pubCopy[locale];

  return (
    <div className="axr-admin">
      <aside className="axr-admin__sidebar">
        <Link href="/" className="axr-admin__logo">
          <BrandMark size={20} className="axr-admin__logo-mark" />
          ActiveXRemote
        </Link>
        <div className="axr-admin__role">{t.admin.panel} · {roleLabel}</div>
        <nav className="axr-admin__nav">
          <Link href="/admin">{t.admin.navSummary}</Link>
          <Link href="/admin/modulos">{t.admin.navModules}</Link>
          <Link href="/admin/tareas">{t.admin.navTasks}</Link>
          <Link href="/admin/asistente">{t.admin.navAssistant}</Link>
          <Link href="/admin/guia-profesores">{t.admin.navTeacherGuide}</Link>
          {profile.role === "administrador" ? (
            <>
              <Link href="/admin/matriculas">{t.admin.navOrders}</Link>
              <Link href="/admin/usuarios">{t.admin.navUsers}</Link>
              <Link href="/admin/slack">{t.admin.navSlack}</Link>
              {/* Sin clave en el diccionario general: la página es nueva y su
                  texto vive en lib/i18n/editor.ts. */}
              <Link href="/admin/ia">IA</Link>
              {/* Publicaciones lleva sus apartados a la vista, con lo que
                  espera en cada uno: nada de secciones escondidas. */}
              <Link href="/admin/publicaciones">{pc.nav}</Link>
              <div className="axr-admin__sub">
                <Link href="/admin/publicaciones/revisar">
                  {pc.uReview}
                  {pendientes!.revisar ? <span className="axr-admin__badge axr-admin__badge--alert">{pendientes!.revisar}</span> : null}
                </Link>
                <Link href="/admin/publicaciones/calendario">{pc.tabCalendar}</Link>
                <Link href="/admin/publicaciones/nevera">
                  {pc.tabFridge}
                  {pendientes!.nevera ? <span className="axr-admin__badge">{pendientes!.nevera}</span> : null}
                </Link>
                <Link href="/admin/publicaciones/nueva">+ {pc.new}</Link>
              </div>
              {/* Anuncios para Meta: misma forma que publicaciones. */}
              <Link href="/admin/banners">{banCopy[locale].nav}</Link>
              <div className="axr-admin__sub">
                <Link href="/admin/banners/clonar">{banCopy[locale].tabClone}</Link>
                <Link href="/admin/banners/normas">{banCopy[locale].tabRules}</Link>
                <Link href="/admin/banners/nueva">+ {banCopy[locale].new}</Link>
              </div>
            </>
          ) : null}
        </nav>
        <div className="axr-admin__back">
          <LocaleToggle tone="dark" />
          <Link href="/">← {t.admin.back}</Link>
        </div>
      </aside>
      <main className="axr-admin__main">{children}</main>
    </div>
  );
}
