import { AjustesPublicaciones } from "@/components/admin/publicaciones/ajustes-publicaciones";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { cuentasUploadPost, publicSocialSettings } from "@/lib/social/settings";

export default async function AjustesPublicacionesPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const [settings, cuentas] = await Promise.all([publicSocialSettings(), cuentasUploadPost()]);

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head">
        <h1>{copy.sTitle}</h1>
        <p>{copy.sSubtitle}</p>
      </div>
      <AjustesPublicaciones settings={settings} cuentas={cuentas} copy={copy} locale={locale} />
    </div>
  );
}
