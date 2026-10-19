import { redirect } from "next/navigation";

import { PubTabs } from "@/components/admin/publicaciones/pub-tabs";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import "@/app/admin/publicaciones/publicaciones.scss";

// Toda la sección es sólo de administradores: publicar en nombre de la
// escuela es hablar por ella. El layout del panel ya deja fuera a los
// alumnos; esto deja fuera también a los profesores.
export default async function PublicacionesLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const copy = pubCopy[await getLocale()];

  return (
    <>
      <PubTabs
        tabs={[
          { href: "/admin/publicaciones", label: copy.tabSummary, exact: true },
          { href: "/admin/publicaciones/calendario", label: copy.tabCalendar },
          { href: "/admin/publicaciones/nevera", label: copy.tabFridge },
          { href: "/admin/publicaciones/nueva", label: `+ ${copy.tabNew}`, primary: true },
          { href: "/admin/publicaciones/ajustes", label: copy.tabSettings },
        ]}
      />
      {children}
    </>
  );
}
