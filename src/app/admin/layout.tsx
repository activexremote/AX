import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { getCurrentProfile } from "@/lib/data/profile";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/admin.scss";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "administrador" && profile.role !== "profesor") {
    redirect("/");
  }
  const { t } = await getI18n();
  const roleLabel = t.common[`role_${profile.role}` as const];

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
          {profile.role === "administrador" ? (
            <>
              <Link href="/admin/usuarios">{t.admin.navUsers}</Link>
              <Link href="/admin/slack">{t.admin.navSlack}</Link>
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
