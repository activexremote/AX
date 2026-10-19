import Link from "next/link";

import { NuevaPublicacion } from "@/components/admin/publicaciones/nueva-publicacion";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES } from "@/lib/social/canales";
import { publicSocialSettings } from "@/lib/social/settings";
import type { SocialChannel } from "@/lib/supabase/types";

// Leer el enlace y escribir un artículo entero son dos llamadas lentas
// encadenadas: con los 15 s por defecto, la acción moriría a medias.
export const maxDuration = 180;

export default async function NuevaPublicacionPage({ searchParams }: { searchParams: Promise<{ canal?: string }> }) {
  const { canal } = await searchParams;
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const settings = await publicSocialSettings();
  const conClave = settings.deepseekSource !== "ninguna";

  return (
    <div className="axr-admin-page axr-pubnew-page">
      <div className="axr-pubpage-head">
        <h1>{copy.newTitle}</h1>
        <p>{copy.uNewLead}</p>
      </div>

      {!conClave ? (
        <div className="axr-pubtask axr-pubtask--bloquea axr-pubtask--solo">
          <span className="axr-pubtask__text">
            <strong>{copy.noKey}</strong>
          </span>
          <Link href="/admin/publicaciones/ajustes#deepseek" className="axr-btn axr-btn--ghost">
            {copy.tabSettings}
          </Link>
        </div>
      ) : null}

      <NuevaPublicacion
        copy={copy}
        defaultLanguage={locale}
        model={settings.deepseekModel}
        locale={locale}
        canalInicial={CANALES.includes(canal as SocialChannel) ? (canal as SocialChannel) : undefined}
      />
    </div>
  );
}
