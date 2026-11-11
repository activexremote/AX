import { redirect } from "next/navigation";

import { PanelKpis } from "@/components/admin/kpis/panel-kpis";
import { RUTA_COMERCIAL } from "@/lib/comercial/acceso";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import "../comercial.scss";
import "./kpis.scss";

// KPIs de ventas. Sólo administración: lleva inversión, ingresos y coste por
// alumno, y el rol comercial sí entra en /admin/comercial.
export default async function KpisPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "administrador") redirect(RUTA_COMERCIAL);
  return <PanelKpis locale={await getLocale()} />;
}
