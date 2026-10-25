import Link from "next/link";
import { notFound } from "next/navigation";

import { BorrarPublicacion, Estudio, ImagenesPublicacion, type CanalEstudio } from "@/components/admin/publicaciones/editor-publicacion";
import { ParejaIdioma, PildoraIdioma } from "@/components/admin/publicaciones/desechar";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, revisar } from "@/lib/social/canales";
import { formatoUsd } from "@/lib/social/costes";
import { cargarPanel } from "@/lib/social/panel";
import { createClient } from "@/lib/supabase/server";
import type { SocialChannel, SocialPost, SocialVariant } from "@/lib/supabase/types";

// Regenerar el artículo del blog, o adaptarlo al otro idioma, es una llamada
// larga a DeepSeek.
export const maxDuration = 300;

// ══════════════════════════════════════════════════════════
//  Una publicación
//
//  Un canal a la vista cada vez, con su pestaña (que dice si está lista o
//  qué le falta), el editor junto a cómo quedará publicado, y abajo una barra
//  fija con lo que se puede hacer: guardar, regenerar, nevera o programar.
//  El material de partida (tema, enlace, imágenes) va plegado arriba: se
//  consulta, no se trabaja en él.
// ══════════════════════════════════════════════════════════

export default async function PublicacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string; canal?: string }>;
}) {
  const { id } = await params;
  const { aviso, canal } = await searchParams;
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const supabase = await createClient();

  const [{ data: post }, { data: variants }, { data: usos }, panel] = await Promise.all([
    supabase.from("social_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("social_variants").select("*").eq("post_id", id),
    supabase.from("social_usage").select("cost_usd").eq("post_id", id),
    cargarPanel(locale),
  ]);
  if (!post) notFound();
  const coste = (usos ?? []).reduce((n, u) => n + Number(u.cost_usd), 0);

  const p = post as SocialPost;
  const porCanal = new Map(((variants ?? []) as SocialVariant[]).map((v) => [v.channel, v]));
  const canales: CanalEstudio[] = CANALES.map((c) => {
    const v = porCanal.get(c) ?? null;
    const avisos = v ? revisar(c, v.body) : [];
    const errores = avisos.filter((a) => a.nivel === "error").length;
    return { channel: c, variant: v, inicial: { errores, avisos: avisos.length - errores, dirty: false } };
  });

  // Se abre el canal pedido o, si no, el primero que necesita atención.
  const pedido = CANALES.includes(canal as SocialChannel) ? (canal as SocialChannel) : null;
  const atencion = canales.find((c) => c.variant && (c.variant.status === "error" || c.inicial.errores || c.variant.status === "borrador"));
  const inicial = pedido ?? atencion?.channel ?? canales.find((c) => c.variant)?.channel ?? "x";

  const cuentas = {
    x: panel.cuentas?.x.conectada ? panel.cuentas.x : null,
    linkedin: panel.cuentas?.linkedin.conectada ? panel.cuentas.linkedin : null,
  };

  return (
    <div className="axr-admin-page axr-pub-wide">
      <div className="axr-pubpost-head">
        <div>
          <Link href="/admin/publicaciones" className="axr-pubpost-head__back">
            {copy.back}
          </Link>
          <h1>{p.title}</h1>
          <div className="axr-pubpost-head__meta">
            <PildoraIdioma language={p.language} />
            <span>{fill(copy.uWrittenOn, new Date(p.created_at).toLocaleDateString(locale, { day: "numeric", month: "long" }))}</span>
            <span>
              <Icono n="euro" size={13} /> {fill(copy.uAiCost, formatoUsd(coste, locale))}
            </span>
          </div>
        </div>
        <div className="axr-pubpost-head__actions">
          <ParejaIdioma postId={p.id} pairId={p.pair_id} language={p.language} copy={copy} />
          <BorrarPublicacion postId={p.id} copy={copy} />
        </div>
      </div>

      {aviso ? <div className="axr-login__error" style={{ marginBottom: "1rem" }}>{aviso}</div> : null}

      <details className="axr-pubmaterial">
        <summary>
          <strong>{copy.uMaterial}</strong>
          <span>
            {[p.topic ? copy.topic : null, p.source_url ? copy.source : null, p.images.length ? fill(copy.uImagesN, p.images.length) : null]
              .filter(Boolean)
              .join(" · ") || copy.uNoMaterial}
          </span>
        </summary>
        <div className="axr-pubmaterial__body">
          {p.topic ? (
            <div>
              <strong>{copy.topic}</strong>
              <p>{p.topic}</p>
            </div>
          ) : null}
          {p.source_url ? (
            <div>
              <strong>{copy.source}</strong>
              <p>
                <a href={p.source_url} target="_blank" rel="noreferrer">
                  {p.source_title || p.source_url} ↗
                </a>
              </p>
            </div>
          ) : null}
          <div>
            <strong>{copy.images}</strong>
            <ImagenesPublicacion postId={p.id} images={p.images} copy={copy} />
          </div>
        </div>
      </details>

      <Estudio
        postId={p.id}
        canales={canales}
        inicial={inicial}
        images={p.images}
        language={p.language}
        copy={copy}
        locale={locale}
        proximoHueco={panel.proximoHueco}
        cuentas={cuentas}
      />
    </div>
  );
}
