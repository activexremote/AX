import { Inicio } from "@/components/admin/publicaciones/inicio";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { cargarPanel } from "@/lib/social/panel";
import { createClient } from "@/lib/supabase/server";
import type { SocialPost } from "@/lib/supabase/types";

export default async function PublicacionesPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const panel = await cargarPanel(locale);
  const supabase = await createClient();
  const { data: recientes } = await supabase
    .from("social_posts")
    .select("id, title, language, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  const ultimas = (recientes ?? []) as Pick<SocialPost, "id" | "title" | "language" | "created_at">[];

  return <Inicio panel={panel} ultimas={ultimas} copy={copy} locale={locale} />;
}
