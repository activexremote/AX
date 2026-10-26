import Link from "next/link";

import { NuevaCampana } from "@/components/admin/banners/nueva-campana";
import { publicAiSettings } from "@/lib/ai/settings";
import { cargarCarpetas } from "@/lib/banners/panel";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";

// Escribir las variantes y pintar una foto por cada una, en paralelo: con
// los 15 s por defecto la acción moriría a medias.
export const maxDuration = 300;

export default async function NuevaCampanaPage() {
  const locale = await getLocale();
  const copy = banCopy[locale];
  const [ai, carpetas] = await Promise.all([publicAiSettings(), cargarCarpetas()]);
  const sinClave = ai.source === "ninguna" || ai.lastTestOk === false;

  return (
    <div className="axr-admin-page axr-pubnew-page">
      <div className="axr-pubpage-head">
        <h1>{copy.newTitle}</h1>
        <p>{copy.newLead}</p>
      </div>

      {sinClave ? (
        <div className="axr-pubtask axr-pubtask--bloquea axr-pubtask--solo">
          <span className="axr-pubtask__text">
            <strong>{copy.noKey}</strong>
          </span>
          <Link href="/admin/ia" className="axr-btn axr-btn--ghost">
            {copy.goKey}
          </Link>
        </div>
      ) : null}

      <NuevaCampana copy={copy} locale={locale} textModel={ai.model} carpetas={carpetas} />
    </div>
  );
}
