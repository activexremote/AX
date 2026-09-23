import { redirect } from "next/navigation";

import { AiConfig } from "@/components/admin/ai-config";
import { publicAiSettings } from "@/lib/ai/settings";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { editorCopy } from "@/lib/i18n/editor";

// La clave es de la escuela y la paga quien administra: un profesor usa la IA
// pero no entra aquí. El layout del panel ya deja fuera a los alumnos; esto
// cierra la página también a los profesores.
export default async function AdminAiPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const settings = await publicAiSettings();
  const locale = await getLocale();
  const copy = editorCopy[locale];

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.sTitle}</h1>
          <p>{copy.sSubtitle}</p>
        </div>
      </div>

      <div className="axr-admin-card">
        <AiConfig settings={settings} copy={copy} />
      </div>

      <div className="axr-admin-card">
        <h2>{copy.sWhere}</h2>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.8125rem", color: "var(--axr-text-secondary)", lineHeight: 1.7 }}>
          {copy.sWhereList.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)", marginBottom: 0 }}>{copy.sCost}</p>
      </div>
    </div>
  );
}
