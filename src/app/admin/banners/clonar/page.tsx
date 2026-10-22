import Link from "next/link";

import { Clonador } from "@/components/admin/banners/clonador";
import { publicAiSettings } from "@/lib/ai/settings";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";

// Mirar la referencia, escribir hasta 5 versiones y pintar sus fotos en
// paralelo: igual que una campaña nueva, necesita margen.
export const maxDuration = 300;

export default async function ClonarPage() {
  const locale = await getLocale();
  const copy = banCopy[locale];
  const ai = await publicAiSettings();
  const sinClave = ai.source === "ninguna" || ai.lastTestOk === false;

  return (
    <div className="axr-admin-page axr-pubnew-page">
      <div className="axr-pubpage-head">
        <h1>{copy.cloneTitle}</h1>
        <p>{copy.cloneLead}</p>
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

      <Clonador copy={copy} locale={locale} textModel={ai.model} />
    </div>
  );
}
