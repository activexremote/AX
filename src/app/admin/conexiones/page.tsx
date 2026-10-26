import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CopiarUrl } from "@/components/admin/copiar-url";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getCurrentProfile } from "@/lib/data/profile";
import { conCopy } from "@/lib/i18n/conexiones";
import { getLocale } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { revocarConexion } from "./actions";
import "./conexiones.scss";

// El conector de Claude: la dirección, cómo se añade y quién lo tiene
// conectado (con el botón de cortar). Sólo administradores.
export default async function ConexionesPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");
  const locale = await getLocale();
  const c = conCopy[locale];

  const h = await headers();
  const origen = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const url = `${origen}/api/mcp`;

  const admin = createAdminClient();
  const { data: tokens } = await admin
    .from("mcp_tokens")
    .select("id, client_id, user_id, created_at, last_used_at")
    .is("revoked_at", null)
    .gt("refresh_expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  const lista = tokens ?? [];
  const [{ data: clientes }, { data: perfiles }] = await Promise.all([
    lista.length ? admin.from("mcp_clients").select("id, name").in("id", [...new Set(lista.map((t) => t.client_id))]) : Promise.resolve({ data: [] }),
    lista.length ? admin.from("profiles").select("id, email, full_name").in("id", [...new Set(lista.map((t) => t.user_id))]) : Promise.resolve({ data: [] }),
  ]);
  const cliente = new Map((clientes ?? []).map((x) => [x.id as string, x.name as string]));
  const persona = new Map((perfiles ?? []).map((x) => [x.id as string, (x.full_name as string) || (x.email as string)]));
  const fecha = (iso: string | null) => (iso ? new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { timeZone: "Europe/Madrid", dateStyle: "medium", timeStyle: "short" }) : "—");

  return (
    <div className="axr-admin-page axr-conex">
      <header className="axr-admin-page__head">
        <h1>{c.title}</h1>
        <p>{c.lead}</p>
      </header>

      <section className="axr-admin-card axr-conex__url">
        <span className="axr-conex__label">{c.url}</span>
        <CopiarUrl url={url} copiar={c.copy} copiada={c.copied} />
      </section>

      <section className="axr-admin-card">
        <h2>{c.howTitle}</h2>
        <ol className="axr-conex__steps">
          {c.steps.map(([t, d]) => (
            <li key={t}>
              <strong>{t}</strong>
              <span>{d.replace("<dirección>", url).replace("<URL>", url)}</span>
            </li>
          ))}
        </ol>
        <div className="axr-adm-note">
          <Icono n="info" />
          <span>
            <strong>{c.whoTitle}. </strong>
            {c.who}
          </span>
        </div>
      </section>

      <section className="axr-admin-card">
        <h2>{c.examplesTitle}</h2>
        <ul className="axr-conex__examples">
          {c.examples.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section className="axr-admin-card">
        <h2>{c.activeTitle}</h2>
        {lista.length ? (
          <div className="axr-admin-scroll">
            <table className="axr-admin-table">
              <thead>
                <tr>
                  <th>{c.client}</th>
                  <th>{c.user}</th>
                  <th>{c.since}</th>
                  <th>{c.lastUse}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lista.map((t) => (
                  <tr key={t.id}>
                    <td>{cliente.get(t.client_id) ?? "—"}</td>
                    <td>{persona.get(t.user_id) ?? "—"}</td>
                    <td>{fecha(t.created_at)}</td>
                    <td>{fecha(t.last_used_at)}</td>
                    <td>
                      <form action={async () => { "use server"; await revocarConexion(t.id); }}>
                        <button type="submit" className="axr-btn axr-btn--ghost axr-btn--small" title={c.revokeHint}>
                          {c.revoke}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="axr-adm-empty">{c.none}</p>
        )}
      </section>
    </div>
  );
}
