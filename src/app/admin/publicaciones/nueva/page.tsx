import Link from "next/link";
import { redirect } from "next/navigation";

import { NuevaPublicacion } from "@/components/admin/publicaciones/nueva-publicacion";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { deepseekConfigured } from "@/lib/social/settings";
import "@/app/admin/publicaciones/publicaciones.scss";

// Leer el enlace y escribir un artículo entero son dos llamadas lentas
// encadenadas: con los 15 s por defecto, la acción moriría a medias.
export const maxDuration = 180;

export default async function NuevaPublicacionPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const locale = await getLocale();
  const copy = pubCopy[locale];
  const conClave = await deepseekConfigured();

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <Link href="/admin/publicaciones" style={{ fontSize: "0.8125rem" }}>
            {copy.back}
          </Link>
          <h1>{copy.newTitle}</h1>
          <p>{copy.newSubtitle}</p>
        </div>
      </div>

      {!conClave ? <div className="axr-admin-card axr-admin-card--flag">{copy.noKey}</div> : null}

      <div className="axr-admin-card">
        <NuevaPublicacion copy={copy} defaultLanguage={locale} />
      </div>
    </div>
  );
}
