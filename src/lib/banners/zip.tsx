import "server-only";

import { strToU8, zipSync } from "fflate";
import { ImageResponse } from "next/og";

import { FORMATOS, leerBoton, leerComposicion, leerCopy, leerElementos, otroIdioma, type FormatoId, type Plantilla } from "@/lib/banners/formatos";
import { leerImagen } from "@/lib/banners/imagen";
import { Banner, fuentes } from "@/lib/banners/render";
import type { AdBanner, AdCampaign } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Variantes en un .zip
//
//  Ordenado como las carpetas del equipo (POST, POST VERTICAL, STORY), con
//  un textos.txt por campaña e idioma con lo que hay que pegar en el
//  Administrador de anuncios. Con variantes en los dos idiomas, una carpeta
//  por idioma (ES/, EN/). Con varias campañas (la galería), una carpeta por
//  campaña delante y, si se pide, la carpeta antes que la campaña.
// ══════════════════════════════════════════════════════════

export const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function armarZip(
  grupos: { campaign: AdCampaign; banners: AdBanner[]; carpeta?: string }[],
  opts: { formatos: FormatoId[]; ambos: boolean; porCampana: boolean },
): Promise<Uint8Array> {
  const fonts = await fuentes();
  const files: Record<string, Uint8Array> = {};
  const usadas = new Set<string>();

  for (const { campaign: c, banners, carpeta } of grupos) {
    // Dos campañas con el mismo nombre no se pisan la carpeta.
    let raiz = "";
    if (opts.porCampana) {
      const delante = carpeta !== undefined ? `${slug(carpeta) || "carpeta"}/` : "";
      const base = `${delante}${slug(c.name) || "campana"}`;
      let nombre = base;
      for (let k = 2; usadas.has(nombre); k++) nombre = `${base}-${k}`;
      usadas.add(nombre);
      raiz = `${nombre}/`;
    }
    const idiomas = opts.ambos ? ([c.language, otroIdioma(c.language)] as const) : ([c.language] as const);
    const bilingue = opts.ambos && banners.some((b) => b.copy_alt);
    const textos: Record<string, string[]> = Object.fromEntries(idiomas.map((l) => [l, [`${c.name} · ${l.toUpperCase()}\n${"=".repeat(c.name.length + 5)}\n`]]));

    for (const b of banners) {
      const imagen = b.image_path ? await leerImagen(b.image_path) : null;
      const elementos = leerElementos(b.elements);
      const n = b.position + 1;
      for (const lang of idiomas) {
        const raw = lang === c.language ? b.copy : b.copy_alt;
        if (!raw) continue;
        const copy = leerCopy(raw);
        const carpeta = `${raiz}${bilingue ? `${lang.toUpperCase()}/` : ""}`;
        for (const f of opts.formatos) {
          const { w, h, label, file } = FORMATOS[f];
          const res = new ImageResponse(
            <Banner
              copy={copy}
              template={b.template as Plantilla}
              course={c.course}
              language={lang}
              formato={f}
              imagen={imagen}
              elementos={elementos}
              composicion={leerComposicion(b.layout)}
              boton={leerBoton(b.cta_style)}
            />,
            { width: w, height: h, fonts },
          );
          files[`${carpeta}${label}/${file}_v${n}_${lang.toUpperCase()}.png`] = new Uint8Array(await res.arrayBuffer());
        }
        textos[lang].push(
          [
            `── Variante ${n} (${b.angle ?? "—"}) ──`,
            `Texto principal:\n${copy.primaryText}`,
            `Titular: ${copy.adHeadline}`,
            `Descripción: ${copy.description}`,
            `Botón: ${copy.cta}`,
            `Texto alternativo: ${copy.alt}`,
          ].join("\n"),
        );
      }
    }
    for (const lang of idiomas) {
      if (textos[lang].length > 1) files[`${raiz}${bilingue ? `${lang.toUpperCase()}/` : ""}textos.txt`] = strToU8(textos[lang].join("\n\n") + "\n");
    }
  }
  return zipSync(files, { level: 0 });
}

type ClienteSupabase = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Unas variantes cualesquiera (de la galería o del conector de Claude) en un
 * .zip: carpeta de banners («Sin carpeta» si no tienen) / campaña / formato.
 */
export async function zipDeVariantes(
  supabase: ClienteSupabase,
  ids: string[],
  opts: { formatos: FormatoId[]; ambos: boolean },
): Promise<{ zip: Uint8Array; n: number } | null> {
  const { data } = await supabase.from("ad_banners").select("*").in("id", ids).order("position");
  const banners = (data ?? []) as AdBanner[];
  if (!banners.length) return null;
  const { data: camps } = await supabase.from("ad_campaigns").select("*").in("id", [...new Set(banners.map((b) => b.campaign_id))]);
  const campanas = (camps ?? []) as AdCampaign[];
  const idsCarpeta = [...new Set(banners.map((b) => b.folder_id).filter((x): x is string => Boolean(x)))];
  const { data: carps } = idsCarpeta.length ? await supabase.from("ad_folders").select("id, name").in("id", idsCarpeta) : { data: [] };
  const nombreDe = new Map(((carps ?? []) as { id: string; name: string }[]).map((f) => [f.id, f.name]));

  const grupos = [null, ...idsCarpeta].flatMap((fid) =>
    campanas
      .map((campaign) => ({
        campaign,
        carpeta: fid ? nombreDe.get(fid) ?? "Carpeta" : "Sin carpeta",
        banners: banners.filter((b) => b.campaign_id === campaign.id && (b.folder_id ?? null) === fid),
      }))
      .filter((g) => g.banners.length),
  );
  return { zip: await armarZip(grupos, { ...opts, porCampana: true }), n: banners.length };
}
