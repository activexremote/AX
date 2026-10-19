import Link from "next/link";

import { NuevaPublicacion } from "@/components/admin/publicaciones/nueva-publicacion";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { publicSocialSettings } from "@/lib/social/settings";

// Leer el enlace y escribir un artículo entero son dos llamadas lentas
// encadenadas: con los 15 s por defecto, la acción moriría a medias.
export const maxDuration = 180;

export default async function NuevaPublicacionPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const settings = await publicSocialSettings();
  const conClave = settings.deepseekSource !== "ninguna";

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.newTitle}</h1>
          <p>{copy.newSubtitle}</p>
        </div>
      </div>

      {!conClave ? (
        <div className="axr-pub-alert axr-pub-alert--error" style={{ marginBottom: "1.25rem" }}>
          <span>✕ {copy.noKey}</span>
          <Link href="/admin/publicaciones/ajustes" className="axr-btn axr-btn--ghost">
            {copy.tabSettings}
          </Link>
        </div>
      ) : null}

      <NuevaPublicacion copy={copy} defaultLanguage={locale} model={settings.deepseekModel} locale={locale} />
    </div>
  );
}
