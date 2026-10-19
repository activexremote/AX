import Link from "next/link";
import { redirect } from "next/navigation";

import { AjustesPublicaciones } from "@/components/admin/publicaciones/ajustes-publicaciones";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { publicSocialSettings } from "@/lib/social/settings";
import "@/app/admin/publicaciones/publicaciones.scss";

export default async function AjustesPublicacionesPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const locale = await getLocale();
  const copy = pubCopy[locale];
  const settings = await publicSocialSettings();

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <Link href="/admin/publicaciones" style={{ fontSize: "0.8125rem" }}>
            {copy.back}
          </Link>
          <h1>{copy.sTitle}</h1>
          <p>{copy.sSubtitle}</p>
        </div>
      </div>
      <AjustesPublicaciones settings={settings} copy={copy} locale={locale} />
    </div>
  );
}
