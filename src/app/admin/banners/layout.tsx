import { redirect } from "next/navigation";

import { PubHeader, type Chip } from "@/components/admin/publicaciones/pub-tabs";
import { cargarBanners } from "@/lib/banners/panel";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";
import { formatoUsd } from "@/lib/social/costes";
import "@/app/admin/publicaciones/publicaciones.scss";
import "@/app/admin/banners/banners.scss";

// Sólo administradores, como publicaciones: un anuncio habla por la escuela.
export default async function BannersLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const locale = await getLocale();
  const copy = banCopy[locale];
  const { ai, gastoMes, aprobados } = await cargarBanners();

  const sinClave = ai.source === "ninguna";
  const chips: Chip[] = [
    {
      tono: sinClave || ai.lastTestOk === false ? "mal" : ai.lastTestOk ? "ok" : "neutro",
      label: copy.chipAi,
      valor: sinClave ? copy.chipNoKey : ai.keyHint ?? copy.chipOk,
      href: "/admin/ia",
    },
    { tono: "neutro", label: copy.chipMonth, valor: formatoUsd(gastoMes, locale), href: "/admin/banners" },
    { tono: aprobados ? "ok" : "neutro", label: copy.chipApproved, valor: String(aprobados), href: "/admin/banners" },
  ];

  return (
    <div className="axr-pubsec axr-bansec">
      <PubHeader
        label={copy.nav}
        nueva={copy.new}
        nuevaHref="/admin/banners/nueva"
        estadoLabel={copy.statusLabel}
        chips={chips}
        tabs={[
          { href: "/admin/banners", label: copy.tabCampaigns, icon: "capas", exact: true },
          { href: "/admin/banners/normas", label: copy.tabRules, icon: "escudo" },
        ]}
      />
      {children}
    </div>
  );
}
