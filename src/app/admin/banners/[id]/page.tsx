import Link from "next/link";
import { notFound } from "next/navigation";

import { AccionesCampana } from "@/components/admin/banners/acciones-campana";
import { EditorBanner } from "@/components/admin/banners/editor-banner";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import { formatoUsd } from "@/lib/social/costes";
import { createClient } from "@/lib/supabase/server";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// Regenerar una imagen o reescribir una variante llama a OpenAI desde aquí.
export const maxDuration = 300;

export default async function CampanaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const locale = await getLocale();
  const copy = banCopy[locale];
  const supabase = await createClient();

  const { data: campaign } = await supabase.from("ad_campaigns").select("*").eq("id", id).maybeSingle();
  if (!campaign) notFound();
  const c = campaign as AdCampaign;

  const [{ data: banners }, { data: usos }] = await Promise.all([
    supabase.from("ad_banners").select("*").eq("campaign_id", id).order("position"),
    supabase.from("ad_usage").select("cost_usd").eq("campaign_id", id),
  ]);
  const lista = (banners ?? []) as AdBanner[];
  // Los descartados al final: siguen ahí por si se recuperan, pero no estorban.
  lista.sort((a, b) => Number(a.status === "descartado") - Number(b.status === "descartado") || a.position - b.position);
  const gasto = (usos ?? []).reduce((n, u) => n + Number(u.cost_usd ?? 0), 0);
  const aprobadas = lista.filter((b) => b.status === "aprobado").length;

  return (
    <div className="axr-admin-page axr-bancamp">
      <Link href="/admin/banners" className="axr-ban-back">
        {copy.back}
      </Link>
      <div className="axr-bancamp__head">
        <div>
          <h1>{c.name}</h1>
          <p>
            {copy.course[c.course]} · {copy.objective[c.objective]} · {c.language === "en" ? "English" : "Español"} ·{" "}
            {fill(copy.spent, formatoUsd(gasto, locale))}
          </p>
          {c.audience || c.notes ? <p className="axr-bancamp__brief">{[c.audience, c.notes].filter(Boolean).join(" · ")}</p> : null}
        </div>
        <AccionesCampana id={c.id} copy={copy} aprobadas={aprobadas} />
      </div>

      {aviso ? (
        <div className="axr-pubtask axr-pubtask--aviso axr-pubtask--solo">
          <Icono n="aviso" />
          <span className="axr-pubtask__text">{aviso}</span>
        </div>
      ) : null}

      <div className="axr-ban-list">
        {lista.map((b, i) => (
          <EditorBanner key={b.id} banner={b} campaign={c} n={i + 1} copy={copy} />
        ))}
      </div>
    </div>
  );
}
