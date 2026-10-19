import Link from "next/link";
import { redirect } from "next/navigation";

import { NOMBRE_CANAL } from "@/lib/social/canales";
import { deepseekConfigured } from "@/lib/social/settings";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost, SocialVariant } from "@/lib/supabase/types";
import "@/app/admin/publicaciones/publicaciones.scss";

export default async function PublicacionesPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const locale = await getLocale();
  const copy = pubCopy[locale];
  const supabase = await createClient();

  const [{ data: posts }, { data: variants }, conClave] = await Promise.all([
    supabase.from("social_posts").select("id, title, language, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("social_variants").select("post_id, channel, status, scheduled_at, published_at"),
    deepseekConfigured(),
  ]);

  type V = Pick<SocialVariant, "post_id" | "channel" | "status" | "scheduled_at" | "published_at">;
  const porPost = new Map<string, V[]>();
  for (const v of (variants ?? []) as V[]) {
    porPost.set(v.post_id, [...(porPost.get(v.post_id) ?? []), v]);
  }
  const todas = (variants ?? []) as V[];
  const cuenta = (s: V["status"]) => todas.filter((v) => v.status === s).length;

  const fecha = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Madrid" });
  const lista = (posts ?? []) as Pick<SocialPost, "id" | "title" | "language" | "created_at">[];

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link href="/admin/publicaciones/ajustes" className="axr-btn axr-btn--ghost">
            {copy.settings}
          </Link>
          <Link href="/admin/publicaciones/nueva" className="axr-btn">
            {copy.new}
          </Link>
        </div>
      </div>

      {!conClave ? <div className="axr-admin-card axr-admin-card--flag">{copy.noKey}</div> : null}

      <div className="axr-progress-kpis">
        {(
          [
            [copy.kpiDrafts, cuenta("borrador")],
            [copy.kpiScheduled, cuenta("programado")],
            [copy.kpiPublished, cuenta("publicado")],
            [copy.kpiErrors, cuenta("error")],
          ] as const
        ).map(([label, n]) => (
          <div className="axr-kpi" key={label}>
            <div className="axr-kpi__label">{label}</div>
            <div className="axr-kpi__value">{n}</div>
          </div>
        ))}
      </div>

      <div className="axr-admin-card">
        {lista.length === 0 ? (
          <p style={{ margin: 0, color: "var(--axr-text-helper)" }}>{copy.empty}</p>
        ) : (
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{copy.colPost}</th>
                <th>{copy.colChannels}</th>
                <th>{copy.colCreated}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/publicaciones/${p.id}`}>{p.title}</Link>{" "}
                    <span style={{ color: "var(--axr-text-helper)", fontSize: "0.75rem" }}>{p.language.toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="axr-pub-pills">
                      {(porPost.get(p.id) ?? []).map((v) => (
                        <span key={v.channel} className={`axr-pub-pill axr-pub-pill--${v.status}`}>
                          {NOMBRE_CANAL[v.channel]} · {copy[`status_${v.status}`]}
                          {v.status === "programado" && v.scheduled_at ? ` · ${fecha(v.scheduled_at)}` : null}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{fecha(p.created_at)}</td>
                  <td className="axr-admin-table__actions">
                    <Link href={`/admin/publicaciones/${p.id}`} className="axr-btn axr-btn--ghost">
                      {copy.open}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
