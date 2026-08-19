import { ConsentBanner } from "@/components/consent/consent-banner";
import { consentCopy } from "@/lib/consent/copy";
import { getLocale } from "@/lib/i18n/server";

// El aviso se monta en el layout raíz: cubre landing, cursos, legales y campus.
export async function ConsentMount() {
  const locale = await getLocale();
  return <ConsentBanner copy={consentCopy[locale]} />;
}
