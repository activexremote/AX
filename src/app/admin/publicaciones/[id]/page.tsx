import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  BorrarPublicacion,
  EditorVariante,
  GenerarCanal,
  ImagenesPublicacion,
} from "@/components/admin/publicaciones/editor-publicacion";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES } from "@/lib/social/canales";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost, SocialVariant } from "@/lib/supabase/types";
import "@/app/admin/publicaciones/publicaciones.scss";

// Regenerar el artículo del blog es una llamada larga a DeepSeek.
export const maxDuration = 180;

export default async function PublicacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const { id } = await params;
  const { aviso } = await searchParams;
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const supabase = await createClient();

  const [{ data: post }, { data: variants }] = await Promise.all([
    supabase.from("social_posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("social_variants").select("*").eq("post_id", id),
  ]);
  if (!post) notFound();

  const p = post as SocialPost;
  const porCanal = new Map(((variants ?? []) as SocialVariant[]).map((v) => [v.channel, v]));

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <Link href="/admin/publicaciones" style={{ fontSize: "0.8125rem" }}>
            {copy.back}
          </Link>
          <h1>{p.title}</h1>
          <p>{p.language === "en" ? "English" : "Español"}</p>
        </div>
        <BorrarPublicacion postId={p.id} copy={copy} />
      </div>

      {aviso ? <div className="axr-login__error" style={{ marginBottom: "1.25rem" }}>{aviso}</div> : null}

      <div className="axr-admin-card">
        <div className="axr-pub-meta">
          {p.topic ? (
            <div>
              <strong>{copy.topic}:</strong> <span style={{ whiteSpace: "pre-wrap" }}>{p.topic}</span>
            </div>
          ) : null}
          {p.source_url ? (
            <div>
              <strong>{copy.source}:</strong>{" "}
              <a href={p.source_url} target="_blank" rel="noreferrer">
                {p.source_title || p.source_url}
              </a>
            </div>
          ) : null}
        </div>
        <h2>{copy.images}</h2>
        <ImagenesPublicacion postId={p.id} images={p.images} copy={copy} />
      </div>

      {CANALES.map((c) => {
        const v = porCanal.get(c);
        // La clave cambia cuando cambia el contenido guardado: así, tras
        // regenerar, el editor se vuelve a montar con el texto nuevo en vez
        // de quedarse con el que tenía en memoria.
        return v ? (
          <EditorVariante key={`${v.id}-${v.updated_at}`} variant={v} copy={copy} locale={locale} />
        ) : (
          <GenerarCanal key={c} postId={p.id} channel={c} copy={copy} />
        );
      })}
    </div>
  );
}
