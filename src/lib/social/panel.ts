import "server-only";

import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { cobertura, diaMadrid, duracion, type Cobertura } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import { publicSocialSettings, saldoDeepseek, type PublicSocialSettings } from "@/lib/social/settings";
import { createClient } from "@/lib/supabase/server";
import type { SocialChannel, SocialStatus, SocialVariant } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Todo lo que enseña el resumen de publicaciones, calculado en un sitio
//
//  El resumen, el calendario y la nevera leen de aquí, así que las cifras
//  (cuántas hay, cuánto cuesta, hasta cuándo vamos cubiertos) son las mismas
//  en las tres pantallas.
// ══════════════════════════════════════════════════════════

export type VarianteConPost = Pick<
  SocialVariant,
  "id" | "post_id" | "channel" | "status" | "scheduled_at" | "published_at" | "updated_at"
> & { title: string };

export type Alerta = {
  nivel: "error" | "aviso";
  texto: string;
  accion?: { href: string; label: string };
};

export type Paso = { hecho: boolean; titulo: string; texto: string; href: string; boton: string };

export type Panel = {
  settings: PublicSocialSettings;
  variantes: VarianteConPost[];
  posts: { total: number; mes: number };
  porEstado: Record<SocialStatus, number>;
  gasto: { total: number; mes: number; llamadas: number; medioPorPost: number; porPost: Map<string, number> };
  saldo: number | null;
  cobertura: Record<SocialChannel, Cobertura>;
  cuota: { usadas: number; limite: number };
  alertas: Alerta[];
  pasos: Paso[];
};

export async function cargarPanel(locale: string): Promise<Panel> {
  const en = locale === "en";
  const supabase = await createClient();
  const ahora = new Date();
  const mesMadrid = diaMadrid(ahora).slice(0, 7);

  const [settings, saldo, { data: vs }, { data: ps }, { data: us }] = await Promise.all([
    publicSocialSettings(),
    saldoDeepseek(),
    supabase
      .from("social_variants")
      .select("id, post_id, channel, status, scheduled_at, published_at, updated_at, social_posts(title)")
      .order("scheduled_at", { ascending: true, nullsFirst: false }),
    supabase.from("social_posts").select("id, created_at"),
    supabase.from("social_usage").select("post_id, cost_usd, created_at"),
  ]);

  type Fila = Omit<VarianteConPost, "title"> & { social_posts: { title: string } | null };
  const variantes: VarianteConPost[] = ((vs ?? []) as unknown as Fila[]).map(({ social_posts, ...v }) => ({
    ...v,
    title: social_posts?.title ?? "—",
  }));

  // ── Publicaciones y estados ──
  const posts = (ps ?? []) as { id: string; created_at: string }[];
  const porEstado: Record<SocialStatus, number> = { borrador: 0, nevera: 0, programado: 0, publicado: 0, error: 0 };
  for (const v of variantes) porEstado[v.status]++;

  // ── Gasto ──
  const usos = (us ?? []) as { post_id: string | null; cost_usd: number; created_at: string }[];
  const porPost = new Map<string, number>();
  let total = 0;
  let mes = 0;
  for (const u of usos) {
    const c = Number(u.cost_usd);
    total += c;
    if (diaMadrid(u.created_at).startsWith(mesMadrid)) mes += c;
    if (u.post_id) porPost.set(u.post_id, (porPost.get(u.post_id) ?? 0) + c);
  }
  const conGasto = porPost.size;

  // ── Cobertura por canal ──
  const cob = {} as Record<SocialChannel, Cobertura>;
  for (const c of CANALES) {
    const dias = new Set(
      variantes
        .filter((v) => v.channel === c && (v.status === "programado" || v.status === "publicado"))
        .map((v) => diaMadrid((v.status === "publicado" ? v.published_at : v.scheduled_at) ?? v.updated_at)),
    );
    const nevera = variantes.filter((v) => v.channel === c && v.status === "nevera").length;
    cob[c] = cobertura(settings.ritmo[c], dias, nevera, ahora);
  }

  // ── Cuota de Upload-Post: X y LinkedIn de este mes, programadas o publicadas ──
  const usadas = variantes.filter((v) => {
    if (v.channel === "blog") return false;
    const cuando = v.status === "publicado" ? v.published_at : v.status === "programado" ? v.scheduled_at : null;
    return cuando ? diaMadrid(cuando).startsWith(mesMadrid) : false;
  }).length;
  const cuota = { usadas, limite: settings.monthlyQuota };

  // ── Alertas ──
  const alertas: Alerta[] = [];
  const conClave = settings.deepseekSource !== "ninguna";

  if (!conClave) {
    alertas.push({
      nivel: "error",
      texto: en ? "There is no DeepSeek key: nothing can be written until you add one." : "No hay clave de DeepSeek: no se puede escribir nada hasta que la añadas.",
      accion: { href: "/admin/publicaciones/ajustes", label: en ? "Add the key" : "Añadir la clave" },
    });
  } else if (saldo !== null && saldo <= 0) {
    alertas.push({
      nivel: "error",
      texto: en ? "DeepSeek has no balance left: generating will fail until you top up." : "DeepSeek se ha quedado sin saldo: generar fallará hasta que recargues.",
      accion: { href: "https://platform.deepseek.com/top_up", label: en ? "Top up" : "Recargar" },
    });
  } else if (saldo !== null && saldo < settings.minBalanceUsd) {
    alertas.push({
      nivel: "aviso",
      texto: en
        ? `DeepSeek balance is low: ${formatoUsd(saldo, locale)} left.`
        : `Queda poco saldo en DeepSeek: ${formatoUsd(saldo, locale)}.`,
      accion: { href: "https://platform.deepseek.com/top_up", label: en ? "Top up" : "Recargar" },
    });
  }

  for (const c of CANALES) {
    const k = cob[c];
    if (!k.activo) continue;
    const nombre = NOMBRE_CANAL[c];
    const fecha = k.primerVacio ? new Date(`${k.primerVacio}T12:00:00Z`).toLocaleDateString(locale, { day: "numeric", month: "long" }) : "";
    if (k.dias < settings.alertDays) {
      const vacia = k.dias === 0 || k.hasta === null;
      const texto = en
        ? `${nombre}: ${vacia ? "nothing scheduled for the next slot" : `covered for only ${duracion(k.dias, locale)}`} (first gap: ${fecha}).${k.nevera ? ` You have ${k.nevera} in the fridge to fill it.` : " The fridge is empty too."}`
        : `${nombre}: ${vacia ? "no hay nada programado para el próximo hueco" : `sólo vamos cubiertos ${duracion(k.dias, locale)}`} (primer hueco: ${fecha}).${k.nevera ? ` Tienes ${k.nevera} en la nevera para rellenarlo.` : " La nevera también está vacía."}`;
      alertas.push({
        nivel: vacia ? "error" : "aviso",
        texto,
        accion: k.nevera
          ? { href: "/admin/publicaciones/nevera", label: en ? "Fill gaps from the fridge" : "Rellenar huecos con la nevera" }
          : { href: "/admin/publicaciones/nueva", label: en ? "Create posts" : "Crear publicaciones" },
      });
    }
  }

  if (cuota.limite > 0 && cuota.usadas >= cuota.limite) {
    alertas.push({
      nivel: "error",
      texto: en
        ? `You have used all ${cuota.limite} Upload-Post posts this month: anything else on X or LinkedIn will not go out until next month.`
        : `Has gastado las ${cuota.limite} publicaciones de Upload-Post de este mes: lo que programes de más en X o LinkedIn no saldrá hasta el mes que viene.`,
      accion: { href: "/admin/publicaciones/ajustes", label: en ? "Review the plan" : "Revisar el plan" },
    });
  } else if (cuota.limite > 0 && cuota.usadas >= cuota.limite * 0.8) {
    alertas.push({
      nivel: "aviso",
      texto: en
        ? `${cuota.usadas} of ${cuota.limite} Upload-Post posts used this month.`
        : `Llevas ${cuota.usadas} de ${cuota.limite} publicaciones de Upload-Post este mes.`,
    });
  }

  const pendientes = porEstado.borrador;
  if (pendientes > 0) {
    alertas.push({
      nivel: "aviso",
      texto: en
        ? `${pendientes} version(s) waiting for review: schedule them or put them in the fridge.`
        : `${pendientes} versión(es) esperando revisión: prográmalas o guárdalas en la nevera.`,
      accion: { href: "/admin/publicaciones#por-revisar", label: en ? "Review" : "Revisar" },
    });
  }

  // ── Primeros pasos ──
  const pasos: Paso[] = [
    {
      hecho: conClave && (saldo === null || saldo > 0),
      titulo: en ? "Connect DeepSeek" : "Conecta DeepSeek",
      texto: en ? "The AI that writes the posts. Paste the key and make sure the account has balance." : "La IA que escribe las publicaciones. Pega la clave y comprueba que la cuenta tiene saldo.",
      href: "/admin/publicaciones/ajustes",
      boton: en ? "Open settings" : "Abrir ajustes",
    },
    {
      hecho: settings.ritmoGuardado,
      titulo: en ? "Choose your rhythm" : "Elige el ritmo",
      texto: en ? "Which days and at what time each channel posts. The calendar and the alerts work from it." : "Qué días y a qué hora publica cada canal. El calendario y las alertas salen de ahí.",
      href: "/admin/publicaciones/ajustes#ritmo",
      boton: en ? "Set the rhythm" : "Fijar el ritmo",
    },
    {
      hecho: posts.length > 0,
      titulo: en ? "Create your first post" : "Crea tu primera publicación",
      texto: en ? "A topic or a link is enough. The AI writes a version for X, LinkedIn and the blog." : "Basta con un tema o un enlace. La IA escribe una versión para X, LinkedIn y el blog.",
      href: "/admin/publicaciones/nueva",
      boton: en ? "New post" : "Nueva publicación",
    },
    {
      hecho: porEstado.programado + porEstado.publicado + porEstado.nevera > 0,
      titulo: en ? "Review and schedule it" : "Revísala y prográmala",
      texto: en ? "Read each version, adjust it and give it a date, or keep it in the fridge for later." : "Lee cada versión, ajústala y ponle fecha, o guárdala en la nevera para más adelante.",
      href: "/admin/publicaciones/calendario",
      boton: en ? "See the calendar" : "Ver el calendario",
    },
  ];

  return {
    settings,
    variantes,
    posts: { total: posts.length, mes: posts.filter((p) => diaMadrid(p.created_at).startsWith(mesMadrid)).length },
    porEstado,
    gasto: { total, mes, llamadas: usos.length, medioPorPost: conGasto ? total / conGasto : 0, porPost },
    saldo,
    cobertura: cob,
    cuota,
    alertas,
    pasos,
  };
}
