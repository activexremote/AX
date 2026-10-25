import { ManualProfesor } from "@/components/admin/manual-profesor";
import { getLocale } from "@/lib/i18n/server";
import { manualCopy } from "@/lib/i18n/manual";
import { MANUAL } from "@/lib/manual/contenido";
import "./manual.scss";

// El manual del profesorado. Lo ve todo el equipo (profesores y
// administradores): el layout del panel ya deja fuera a los alumnos.
export default async function ManualPage() {
  const locale = await getLocale();
  const copy = manualCopy[locale];

  return (
    <div className="axr-admin-page axr-admin-page--wide">
      <div className="axr-admin-page__header">
        <div>
          <span className="axr-man-eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>
      </div>
      <ManualProfesor capitulos={MANUAL} copy={copy} />
    </div>
  );
}
