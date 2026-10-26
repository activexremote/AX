import { redirect } from "next/navigation";

import { MenuAdmin, type GrupoMenu } from "@/components/admin/menu-admin";
import { getCurrentProfile, userInitials } from "@/lib/data/profile";
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
  const admin = profile.role === "administrador";
  const [{ t, locale }, pendientes] = await Promise.all([getI18n(), admin ? contarPendientes() : null]);
  const pc = pubCopy[locale];
  const bc = banCopy[locale];
  const a = t.admin;

  // El profesorado ve lo suyo (formación); el resto es del equipo.
  const grupos: GrupoMenu[] = [
    { items: [{ href: "/admin", label: a.navSummary, icon: "inicio", exact: true }] },
    {
      label: a.navGroupTeaching,
      items: [
        { href: "/admin/manual", label: a.navManual, icon: "manual" },
        { href: "/admin/modulos", label: a.navModulesShort, icon: "libro" },
        { href: "/admin/tareas", label: a.navTasksShort, icon: "tareas" },
        { href: "/admin/guia-profesores", label: a.navTeacherGuideShort, icon: "birrete" },
        { href: "/admin/asistente", label: a.navAssistantShort, icon: "chat" },
      ],
    },
    ...(admin
      ? ([
          {
            label: a.navGroupStudents,
            items: [
              { href: "/admin/matriculas", label: a.navOrdersShort, icon: "tarjeta" },
              { href: "/admin/usuarios", label: a.navUsers, icon: "usuarios" },
            ],
          },
          {
            label: a.navGroupMarketing,
            items: [
              {
                href: "/admin/publicaciones",
                label: pc.nav,
                icon: "megafono",
                badge: pendientes?.revisar || undefined,
                tono: "alerta",
                sub: [
                  { href: "/admin/publicaciones", label: pc.tabSummary },
                  { href: "/admin/publicaciones/revisar", label: pc.uReview, badge: pendientes?.revisar || undefined, tono: "alerta" },
                  { href: "/admin/publicaciones/calendario", label: pc.tabCalendar },
                  { href: "/admin/publicaciones/nevera", label: pc.tabFridge, badge: pendientes?.nevera || undefined },
                  { href: "/admin/publicaciones/nueva", label: `+ ${pc.new}` },
                ],
              },
              {
                href: "/admin/banners",
                label: bc.nav,
                icon: "imagen",
                sub: [
                  { href: "/admin/banners", label: a.navCampaigns },
                  { href: "/admin/banners/galeria", label: bc.tabGallery },
                  { href: "/admin/banners/clonar", label: bc.tabClone },
                  { href: "/admin/banners/normas", label: bc.tabRules },
                  { href: "/admin/banners/nueva", label: `+ ${bc.new}` },
                ],
              },
            ],
          },
          {
            label: a.navGroupSettings,
            items: [
              { href: "/admin/ia", label: a.navAi, icon: "chispa" },
              { href: "/admin/conexiones", label: a.navConnections, icon: "enchufe" },
              { href: "/admin/slack", label: a.navSlackShort, icon: "almohadilla" },
            ],
          },
        ] satisfies GrupoMenu[])
      : []),
  ];

  return (
    <div className="axr-admin">
      <MenuAdmin
        grupos={grupos}
        persona={{ nombre: profile.full_name || profile.email || "—", rol: t.common[`role_${profile.role}` as const], iniciales: userInitials(profile) }}
        textos={{ open: a.navOpenMenu, close: a.navCloseMenu, viewCampus: a.navViewCampus, panel: a.panel }}
      />
      <main className="axr-admin__main">{children}</main>
    </div>
  );
}
