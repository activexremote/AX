import { AjustesPublicaciones } from "@/components/admin/publicaciones/ajustes-publicaciones";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { publicSocialSettings } from "@/lib/social/settings";

export default async function AjustesPublicacionesPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const settings = await publicSocialSettings();

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.sTitle}</h1>
          <p>{copy.sSubtitle}</p>
        </div>
      </div>
      <AjustesPublicaciones settings={settings} copy={copy} locale={locale} />
    </div>
  );
}
