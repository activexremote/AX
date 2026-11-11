import Link from "next/link";
import { notFound } from "next/navigation";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { Historial, Mensajes, Seguimiento, NuevoContacto } from "@/components/admin/comercial/ficha-lead";
import { Desplegable } from "@/components/admin/comercial/tabla-leads";
import { exigirComercial } from "@/lib/comercial/acceso";
import { whatsappDe, type EventoLead, type Lead } from "@/lib/comercial/tipos";
import { diaLargo, horaMadrid } from "@/lib/dry-run/tiempo";
import { comCopy } from "@/lib/i18n/comercial";
import { getLocale } from "@/lib/i18n/server";
import { LINK_URL } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import "../../comercial.scss";

// ══════════════════════════════════════════════════════════
//  La ficha de un lead
//
//  Todo lo que hace falta para la siguiente conversación: sus datos y cómo
//  contactar, el seguimiento (estado, temperatura, próxima acción, objeción,
//  notas), apuntar lo que pasa, el historial y los mensajes del playbook
//  rellenos con su nombre, su curso y el enlace a la próxima clase de prueba.
// ══════════════════════════════════════════════════════════

type Params = { id: string };

export default async function LeadPage({ params }: { params: Promise<Params> }) {
  const [{ id }, yo, locale] = await Promise.all([params, exigirComercial(), getLocale()]);
  const c = comCopy[locale];
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const db = createAdminClient();
  const [{ data: fila }, { data: eventos }, { data: dryRun }] = await Promise.all([
    db
      .from("leads")
      .select("id, created_at, first_name, last_name, email, phone, city, courses, locale, status, notes, temperature, next_action, next_action_at, last_contact_at, owner_id, objection")
      .eq("id", id)
      .maybeSingle(),
    db.from("lead_events").select("*").eq("lead_id", id).order("created_at", { ascending: false }).limit(200),
    // La próxima clase de prueba con la inscripción abierta.
    db
      .from("dry_runs")
      .select("slug, starts_at, ends_at")
      .eq("registration_open", true)
      .gt("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(1)
      .maybeSingle(),
  ]);
  if (!fila) notFound();
  const lead = fila as Lead;
  const historial = (eventos ?? []) as EventoLead[];

  const ids = [...new Set([lead.owner_id, ...historial.map((e) => e.author_id)].filter(Boolean))] as string[];
  const { data: personas } = ids.length ? await db.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] };
  const nombre = new Map((personas ?? []).map((p) => [p.id as string, ((p.full_name as string) || (p.email as string) || "").split(" ")[0]]));

  const fecha = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium", timeStyle: "short" }) : c.dNever;
  const wa = whatsappDe(lead.phone);
  const curso = lead.courses.length ? lead.courses.map((k) => c.courses[k] ?? k).join(" y ") : "el curso";
  const enlaceDryRun = dryRun
    ? `${LINK_URL}/dry-run/${dryRun.slug}?utm_source=whatsapp&utm_medium=comercial&utm_campaign=${encodeURIComponent(dryRun.slug.replace(/-/g, "_"))}`
    : null;
  const cuandoDryRun = dryRun ? `${diaLargo(dryRun.starts_at)}, de ${horaMadrid(dryRun.starts_at)} a ${horaMadrid(dryRun.ends_at)} (hora de Madrid)` : null;

  return (
    <div className="axr-admin-page axr-com">
      <Link href="/admin/comercial/leads" className="axr-com-back">
        <Icono n="flecha" size={14} /> {c.back}
      </Link>

      <div className="axr-admin-page__header">
        <div>
          <h1>
            {lead.first_name} {lead.last_name}
          </h1>
          <p>
            {lead.city}
            {lead.courses.length ? ` · ${lead.courses.map((k) => c.courses[k] ?? k).join(" + ")}` : ` · ${c.noCourse}`}
          </p>
        </div>
        <div>
          <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`} className="axr-btn">
            <Icono n="telefono" size={16} /> {c.call}
          </a>
          {wa ? (
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="axr-btn axr-btn--ghost">
              <Icono n="chat" size={16} /> {c.whatsapp}
            </a>
          ) : null}
          <a href={`mailto:${lead.email}`} className="axr-btn axr-btn--ghost">
            <Icono n="correo" size={16} /> {c.email}
          </a>
        </div>
      </div>

      <div className="axr-com-ficha">
        <div className="axr-com-ficha__main">
          <section className="axr-admin-card">
            <div className="axr-com-row2">
              <label>
                <span>{c.fStatus}</span>
                <Desplegable lead={lead} campo="status" c={c} />
              </label>
              <label>
                <span>{c.fTemp}</span>
                <Desplegable lead={lead} campo="temperature" c={c} />
              </label>
            </div>
            <Seguimiento lead={lead} c={c} />
          </section>

          <section className="axr-admin-card">
            <h2>{c.log}</h2>
            <NuevoContacto leadId={lead.id} c={c} />
          </section>

          <section className="axr-admin-card">
            <h2>{c.history}</h2>
            <Historial eventos={historial.map((e) => ({ ...e, quien: e.author_id ? nombre.get(e.author_id) ?? "" : "", cuando: fecha(e.created_at) }))} c={c} />
          </section>
        </div>

        <aside className="axr-com-ficha__side">
          <section className="axr-admin-card">
            <h2>{c.data}</h2>
            <dl className="axr-com-dl">
              <div>
                <dt>{c.email}</dt>
                <dd>
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                </dd>
              </div>
              <div>
                <dt>{c.call}</dt>
                <dd>
                  <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>{lead.phone}</a>
                  {wa ? null : <small> · {c.noPhone}</small>}
                </dd>
              </div>
              <div>
                <dt>{c.dCity}</dt>
                <dd>{lead.city}</dd>
              </div>
              <div>
                <dt>{c.dLocale}</dt>
                <dd>{lead.locale === "en" ? "English" : "Español"}</dd>
              </div>
              <div>
                <dt>{c.dCreated}</dt>
                <dd>{fecha(lead.created_at)}</dd>
              </div>
              <div>
                <dt>{c.dLastContact}</dt>
                <dd>{fecha(lead.last_contact_at)}</dd>
              </div>
              <div>
                <dt>{c.dOwner}</dt>
                <dd>{lead.owner_id ? nombre.get(lead.owner_id) || c.none : c.none}</dd>
              </div>
            </dl>
          </section>

          <section className="axr-admin-card">
            <h2>{c.templates}</h2>
            <p className="axr-com-muted axr-com-small">{c.templatesLead}</p>
            <Mensajes
              leadId={lead.id}
              email={lead.email}
              whatsapp={wa}
              valores={{
                nombre: lead.first_name.trim().split(/\s+/)[0],
                comercial: (yo.full_name || yo.email || "").split(" ")[0],
                curso,
                ...(enlaceDryRun ? { dryrun: enlaceDryRun } : {}),
                ...(cuandoDryRun ? { dryrun_cuando: cuandoDryRun } : {}),
              }}
              c={c}
            />
          </section>
        </aside>
      </div>
    </div>
  );
}
