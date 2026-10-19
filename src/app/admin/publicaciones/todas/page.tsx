import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { ZONA } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import { cargarPanel } from "@/lib/social/panel";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost, SocialStatus } from "@/lib/supabase/types";

// Todas las publicaciones, con un filtro por estado y un buscador por nombre.
// Una publicación entra en un filtro si ALGUNO de sus canales está en ese
// estado: «Programadas» enseña las que tienen algo con fecha.

const FILTROS: (SocialStatus | "todas")[] = ["todas", "borrador", "programado", "nevera", "publicado", "error"];

export default async function TodasPage({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string }> }) {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const { estado: e, q: rawQ } = await searchParams;
  const estado = FILTROS.includes(e as SocialStatus) ? (e as SocialStatus | "todas") : "todas";
  const q = (rawQ ?? "").trim().slice(0, 100);

  const panel = await cargarPanel(locale);
  const supabase = await createClient();
  let consulta = supabase.from("social_posts").select("id, title, language, created_at").order("created_at", { ascending: false }).limit(300);
  if (q) consulta = consulta.ilike("title", `%${q.replace(/[%_\\]/g, "\\$&")}%`);
  const { data } = await consulta;
  const posts = (data ?? []) as Pick<SocialPost, "id" | "title" | "language" | "created_at">[];

  const porPost = new Map<string, typeof panel.variantes>();
  for (const v of panel.variantes) porPost.set(v.post_id, [...(porPost.get(v.post_id) ?? []), v]);
  const lista = estado === "todas" ? posts : posts.filter((p) => (porPost.get(p.id) ?? []).some((v) => v.status === estado));

  const cuenta = (f: SocialStatus | "todas") =>
    f === "todas" ? panel.posts.total : new Set(panel.variantes.filter((v) => v.status === f).map((v) => v.post_id)).size;
  const href = (f: string) => {
    const p = new URLSearchParams();
    if (f !== "todas") p.set("estado", f);
    if (q) p.set("q", q);
    const s = p.toString();
    return s ? `?${s}` : "?";
  };
  const fechaCanal = (iso: string) => new Date(iso).toLocaleDateString(locale, { timeZone: ZONA, day: "numeric", month: "short" });

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head">
        <h1>{copy.uAll}</h1>
        <p>{copy.uAllLead}</p>
      </div>

      <div className="axr-pubfilters">
        <nav className="axr-pubfilters__chips" aria-label={copy.uFilter}>
          {FILTROS.map((f) => (
            <Link key={f} href={href(f)} className={`axr-pubfilters__chip${estado === f ? " is-active" : ""}`} aria-current={estado === f ? "true" : undefined}>
              {f === "todas" ? copy.uAllShort : copy[`status_${f}`]}
              <span>{cuenta(f)}</span>
            </Link>
          ))}
        </nav>
        <form className="axr-pubfilters__search" role="search">
          {estado !== "todas" ? <input type="hidden" name="estado" value={estado} /> : null}
          <input type="search" name="q" defaultValue={q} placeholder={copy.uSearch} aria-label={copy.uSearch} />
        </form>
      </div>

      <section className="axr-pubcard axr-pubcard--flush">
        {lista.length === 0 ? (
          <div className="axr-pubempty">
            <Icono n="lista" size={28} />
            <strong>{q ? fill(copy.uNoResults, q) : copy.uNoneInFilter}</strong>
          </div>
        ) : (
          <table className="axr-pubtable">
            <thead>
              <tr>
                <th>{copy.colPost}</th>
                {CANALES.map((c) => (
                  <th key={c}>
                    <span className={`axr-pub-dot axr-pub-dot--${c}`} /> {NOMBRE_CANAL[c]}
                  </th>
                ))}
                <th className="axr-pubtable__num">{copy.costPerPost}</th>
                <th className="axr-pubtable__num">{copy.colCreated}</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => {
                const vs = porPost.get(p.id) ?? [];
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/publicaciones/${p.id}`} className="axr-pubtable__title">
                        {p.title}
                      </Link>
                      <span className="axr-pubtable__lang">{p.language.toUpperCase()}</span>
                    </td>
                    {CANALES.map((c) => {
                      const v = vs.find((x) => x.channel === c);
                      const cuando = v?.status === "publicado" ? v.published_at : v?.status === "programado" ? v.scheduled_at : null;
                      return (
                        <td key={c}>
                          {v ? (
                            <Link href={`/admin/publicaciones/${p.id}?canal=${c}`} className={`axr-pubstate axr-pubstate--${v.status}`}>
                              {copy[`status_${v.status}`]}
                              {cuando ? <em>{fechaCanal(cuando)}</em> : null}
                            </Link>
                          ) : (
                            <span className="axr-pubtable__none">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="axr-pubtable__num">{formatoUsd(panel.gasto.porPost.get(p.id) ?? 0, locale)}</td>
                    <td className="axr-pubtable__num">{new Date(p.created_at).toLocaleDateString(locale, { day: "numeric", month: "short" })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
