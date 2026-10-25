import Link from "next/link";
import { notFound } from "next/navigation";

import { AccionesCampana } from "@/components/admin/banners/acciones-campana";
import { EditorBanner } from "@/components/admin/banners/editor-banner";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { BUCKET } from "@/lib/banners/imagen";
import { getLocale } from "@/lib/i18n/server";
import { banCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";
import { formatoUsd } from "@/lib/social/costes";
import { createAdminClient } from "@/lib/supabase/admin";
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

  // La referencia de un clon y las fotos viven en el bucket privado: enlaces
  // firmados de una hora. Las fotos las pinta el editor en el navegador.
  const bucket = createAdminClient().storage.from(BUCKET);
  const refUrl = c.reference_path ? (await bucket.createSignedUrl(c.reference_path, 3600)).data?.signedUrl ?? null : null;
  const rutas = lista.map((b) => b.image_path).filter((p): p is string => Boolean(p));
  const firmadas = rutas.length ? (await bucket.createSignedUrls(rutas, 3600)).data ?? [] : [];
  const urlDe = new Map(firmadas.filter((x) => x.signedUrl && x.path).map((x) => [x.path as string, x.signedUrl]));
  const a = c.reference_analysis;

  return (
    <div className="axr-admin-page axr-bancamp">
      <Link href="/admin/banners" className="axr-ban-back">
        {copy.back}
      </Link>
      <div className="axr-bancamp__head">
        <div>
          <h1>{c.name}</h1>
          <p>
            {copy.course[c.course]} · {copy.objective[c.objective]} · {c.bilingual ? copy.bilingual : c.language === "en" ? "English" : "Español"} ·{" "}
            {fill(copy.spent, formatoUsd(gasto, locale))}
          </p>
          {c.audience || c.notes ? <p className="axr-bancamp__brief">{[c.audience, c.notes].filter(Boolean).join(" · ")}</p> : null}
        </div>
        <AccionesCampana id={c.id} copy={copy} aprobadas={aprobadas} clon={c.kind === "clon"} />
      </div>

      {aviso ? <div className="axr-login__error" style={{ marginBottom: "1rem" }}>{aviso}</div> : null}

      {c.kind === "clon" ? (
        <details className="axr-pubcard axr-ban-ref" open={lista.length === 0}>
          <summary>
            <Icono n="capas" /> {copy.refTitle}
            {a?.summary ? <span className="axr-ban-ref__sum">{a.summary}</span> : null}
          </summary>
          <div className="axr-ban-ref__grid">
            {refUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- enlace firmado del bucket privado
              <img src={refUrl} alt={copy.refTitle} />
            ) : null}
            <dl>
              {c.reference_prompt ? (
                <div>
                  <dt>{copy.refPrompt}</dt>
                  <dd>{c.reference_prompt}</dd>
                </div>
              ) : null}
              {a
                ? (
                    [
                      [copy.refHook, a.hook],
                      [copy.refLayout, a.layout],
                      [copy.refScene, a.scene],
                      [copy.refMood, a.mood],
                    ] as const
                  ).map(([k, v]) =>
                    v ? (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ) : null,
                  )
                : null}
              {a
                ? (
                    [
                      [copy.refKeep, a.keep, "ok"],
                      [copy.refChange, a.change, "info"],
                      [copy.refAvoided, a.avoided, "error"],
                    ] as const
                  ).map(([k, v, icon]) =>
                    v?.length ? (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>
                          <ul className={`axr-ban-ref__list axr-ban-ref__list--${icon}`}>
                            {v.map((t) => (
                              <li key={t}>
                                <Icono n={icon} size={13} /> {t}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ) : null,
                  )
                : null}
            </dl>
          </div>
        </details>
      ) : null}

      <div className="axr-ban-list">
        {lista.map((b, i) => (
          <EditorBanner key={b.id} banner={b} campaign={c} n={i + 1} copy={copy} imagenUrl={b.image_path ? urlDe.get(b.image_path) ?? null : null} />
        ))}
      </div>
    </div>
  );
}
