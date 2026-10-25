import { redirect } from "next/navigation";

import { AiConfig } from "@/components/admin/ai-config";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { publicAiSettings } from "@/lib/ai/settings";
import { getCurrentProfile } from "@/lib/data/profile";
import { adminCCopy } from "@/lib/i18n/admin-v2-c";
import { getLocale } from "@/lib/i18n/server";
import { editorCopy } from "@/lib/i18n/editor";
import "./ia.scss";

// La clave es de la escuela y la paga quien administra: un profesor usa la IA
// pero no entra aquí. El layout del panel ya deja fuera a los alumnos; esto
// cierra la página también a los profesores.
//
// Arriba, el estado en una línea (¿funciona o no?); después, el formulario; y
// al final, en qué partes del panel se gasta esta clave.
export default async function AdminAiPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const [settings, locale] = await Promise.all([publicAiSettings(), getLocale()]);
  const copy = editorCopy[locale];
  const c = adminCCopy[locale].ia;

  const estado: { tono: "ok" | "warn" | "bad" | "neutro"; label: string } = !settings.enabled
    ? { tono: "neutro", label: c.disabled }
    : settings.source === "ninguna"
      ? { tono: "bad", label: c.noKey }
      : settings.lastTestOk === null
        ? { tono: "warn", label: c.untested }
        : settings.lastTestOk
          ? { tono: "ok", label: c.connected }
          : { tono: "bad", label: c.failing };

  const clave =
    settings.source === "panel"
      ? c.keyPanel.replace("{hint}", settings.keyHint ?? "")
      : settings.source === "entorno"
        ? c.keyEnv.replace("{hint}", settings.keyHint ?? "")
        : c.keyNone;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.sTitle}</h1>
          <p>{copy.sSubtitle}</p>
        </div>
      </div>

      <section className={`axr-admin-card axr-ia-status axr-ia-status--${estado.tono}`}>
        <div className="axr-ia-status__main">
          <span className="axr-ia-status__icon" aria-hidden>
            <Icono n={estado.tono === "ok" ? "ok" : estado.tono === "bad" ? "error" : estado.tono === "warn" ? "aviso" : "info"} size={20} />
          </span>
          <div>
            <small>{c.statusTitle}</small>
            <strong>{estado.label}</strong>
          </div>
        </div>
        <dl className="axr-ia-status__facts">
          <div>
            <dt>{c.key}</dt>
            <dd>{clave}</dd>
          </div>
          <div>
            <dt>{c.model}</dt>
            <dd>{settings.model}</dd>
          </div>
          <div>
            <dt>{c.lastTest}</dt>
            <dd>
              {settings.lastTestAt
                ? `${new Date(settings.lastTestAt).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" })}${settings.lastTestDetail ? ` · ${settings.lastTestDetail}` : ""}`
                : c.never}
            </dd>
          </div>
        </dl>
      </section>

      <div className="axr-ia-grid">
        <section className="axr-admin-card">
          <h2>{c.configTitle}</h2>
          <AiConfig settings={settings} copy={copy} />
        </section>

        <section className="axr-admin-card">
          <h2>{c.whereTitle}</h2>
          <ul className="axr-ia-where">
            {c.where.map(([titulo, texto]) => (
              <li key={titulo}>
                <span aria-hidden>
                  <Icono n="chispa" />
                </span>
                <div>
                  <strong>{titulo}</strong>
                  <p>{texto}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="axr-ia-cost">{copy.sCost}</p>
        </section>
      </div>
    </div>
  );
}
