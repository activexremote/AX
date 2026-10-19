import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LandingNav } from "@/components/landing/landing-nav";
import { LandingFooter } from "@/components/landing/landing-footer";
import { getCurrentProfile } from "@/lib/data/profile";
import { articuloDesdeBlog, parseBlog } from "@/lib/social/blog";
import { diaMadrid } from "@/lib/social/calendario";
import { createClient } from "@/lib/supabase/server";
import type { SocialImage } from "@/lib/supabase/types";
import { ArticuloEnVivo } from "@/app/vista-previa/blog/articulo-en-vivo";
import "@/app/bienvenida/landing.scss";
import "@/app/blog/blog.scss";

// ══════════════════════════════════════════════════════════
//  Vista previa de un artículo del panel de publicaciones
//
//  La página del blog de verdad —menú, estilos, pie— con un artículo que
//  todavía no está publicado. Fuera de /admin a propósito: el layout del
//  panel le pondría su barra lateral y ya no sería la página del blog.
//
//  Se carga con la versión guardada y, dentro del iframe del editor, recibe
//  lo que se va escribiendo (ver vistas-previas.tsx).
//
//  Sólo administradores, y nunca en buscadores.
// ══════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: "Vista previa",
  robots: { index: false, follow: false },
};

export default async function VistaPreviaBlog({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const { v } = await searchParams;
  const supabase = await createClient();
  const { data } = v
    ? await supabase
        .from("social_variants")
        .select("body, social_posts(language, images)")
        .eq("id", v)
        .eq("channel", "blog")
        .maybeSingle()
    : { data: null };

  const post = (data?.social_posts ?? null) as unknown as { language: "es" | "en"; images: SocialImage[] } | null;
  const inicial = articuloDesdeBlog(parseBlog(data?.body), {
    locale: post?.language ?? "es",
    fecha: diaMadrid(new Date()),
    hero: post?.images?.[0] ?? null,
  });

  return (
    <main className="axr-lp axr-post">
      <LandingNav base="/bienvenida" />
      <ArticuloEnVivo inicial={inicial} />
      <LandingFooter base="/bienvenida" />
    </main>
  );
}
