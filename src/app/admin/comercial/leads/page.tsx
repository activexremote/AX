import { TablaLeads } from "@/components/admin/comercial/tabla-leads";
import { exigirComercial } from "@/lib/comercial/acceso";
import { CERRADO, hoyMadrid, type Lead } from "@/lib/comercial/tipos";
import { comCopy } from "@/lib/i18n/comercial";
import { rellenar } from "@/lib/i18n/dry-run";
import { getLocale } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import "../comercial.scss";

// ══════════════════════════════════════════════════════════
//  Los leads de la web
//
//  Arriba, lo que pide atención hoy; debajo, la lista en el orden en que se
//  trabaja (ver `prioridad` en lib/comercial/tipos.ts).
// ══════════════════════════════════════════════════════════

export default async function LeadsPage() {
  await exigirComercial();
  const locale = await getLocale();
  const c = comCopy[locale];

  const db = createAdminClient();
  const { data } = await db
    .from("leads")
    .select("id, created_at, first_name, last_name, email, phone, city, courses, locale, status, notes, temperature, next_action, next_action_at, last_contact_at, owner_id, objection")
    .order("created_at", { ascending: false })
    .limit(2000);
  const leads = (data ?? []) as Lead[];

  const hoy = hoyMadrid();
  const abiertos = leads.filter((l) => !CERRADO.includes(l.status));
  const sinContactar = leads.filter((l) => l.status === "nuevo").length;
  const paraHoy = abiertos.filter((l) => l.next_action_at && l.next_action_at <= hoy).length;
  const calientes = abiertos.filter((l) => l.temperature === "caliente").length;
  const inscritos = leads.filter((l) => l.status === "inscrito").length;
  const pct = leads.length ? `${Math.round((inscritos / leads.length) * 100)} %` : "0 %";

  return (
    <div className="axr-admin-page axr-com">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </div>

      <div className="axr-adm-stats">
        <div className="axr-adm-stat" data-tone={sinContactar ? "warn" : undefined}>
          <span className="axr-adm-stat__label">{c.sNew}</span>
          <span className="axr-adm-stat__value">{sinContactar}</span>
          <span className="axr-adm-stat__hint">{c.sNewHint}</span>
        </div>
        <div className="axr-adm-stat" data-tone={paraHoy ? "warn" : undefined}>
          <span className="axr-adm-stat__label">{c.sDue}</span>
          <span className="axr-adm-stat__value">{paraHoy}</span>
          <span className="axr-adm-stat__hint">{c.sDueHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">{c.sHot}</span>
          <span className="axr-adm-stat__value">{calientes}</span>
          <span className="axr-adm-stat__hint">{c.sHotHint}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">{c.sWon}</span>
          <span className="axr-adm-stat__value">{inscritos}</span>
          <span className="axr-adm-stat__hint">{rellenar(c.sWonHint, { p: pct })}</span>
        </div>
      </div>

      <TablaLeads leads={leads} hoy={hoy} c={c} />
    </div>
  );
}
