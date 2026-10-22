import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { cargarBanners } from "@/lib/banners/panel";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";

export default async function BannersPage() {
  const locale = await getLocale();
  const copy = banCopy[locale];
  const { campanas } = await cargarBanners();

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head">
        <h1>{copy.title}</h1>
        <p>{copy.lead}</p>
      </div>

      <ol className="axr-ban-how">
        {copy.how.map(([t, d], i) => (
          <li key={t}>
            <span className="axr-ban-how__n">{i + 1}</span>
            <strong>{t}</strong>
            <span>{d}</span>
          </li>
        ))}
      </ol>

      {campanas.length === 0 ? (
        <div className="axr-pubcard axr-ban-empty">
          <Icono n="capas" size={28} />
          <strong>{copy.emptyTitle}</strong>
          <p>{copy.emptyBody}</p>
          <Link href="/admin/banners/nueva" className="axr-btn">
            <Icono n="chispa" /> {copy.new}
          </Link>
        </div>
      ) : (
        <ul className="axr-ban-grid">
          {campanas.map((c) => {
            const vivos = c.banners.filter((b) => b.status !== "descartado");
            const portada = vivos.find((b) => b.status === "aprobado") ?? vivos[0];
            const aprobadas = c.banners.filter((b) => b.status === "aprobado").length;
            return (
              <li key={c.id}>
                <Link href={`/admin/banners/${c.id}`} className="axr-ban-card">
                  <span className="axr-ban-card__thumb">
                    {portada ? (
                      // eslint-disable-next-line @next/next/no-img-element -- PNG generado al vuelo, privado
                      <img src={`/admin/banners/render/${portada.id}/vertical?v=${encodeURIComponent(portada.updated_at)}`} alt="" loading="lazy" />
                    ) : (
                      <Icono n="imagen" size={28} />
                    )}
                  </span>
                  <span className="axr-ban-card__body">
                    <strong>{c.name}</strong>
                    <small>
                      {copy.course[c.course]} · {copy.objective[c.objective]} · {c.language.toUpperCase()}
                    </small>
                    <span className="axr-ban-card__meta">
                      <span>{fill(copy.variants, vivos.length)}</span>
                      {aprobadas ? <span className="axr-ban-pill axr-ban-pill--ok">{fill(copy.approvedN, aprobadas)}</span> : null}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
