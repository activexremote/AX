import "server-only";

import { cache } from "react";

import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { cobertura, diaMadrid, duracion, huecos, instanteMadrid, sumarDias, type Cobertura } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import { cuentasUploadPost, publicSocialSettings, saldoDeepseek, type Cuentas, type PublicSocialSettings } from "@/lib/social/settings";
import { createClient } from "@/lib/supabase/server";
import type { SocialChannel, SocialStatus, SocialVariant } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Todo lo que enseña la sección de publicaciones, calculado en un sitio
//
//  La cabecera de la sección, el inicio, el calendario y la nevera leen de
//  aquí, así que las cifras (cuántas hay, hasta cuándo vamos cubiertos, qué
//  falta por hacer) son las mismas en todas las pantallas. Va envuelto en
//  `cache`: el layout y la página lo piden en la misma petición y sólo se
//  calcula una vez.
//
//  Lo más importante es `tareas`: TODO lo que alguien tiene que hacer, de lo
//  que bloquea a lo que mejora, cada cosa con su botón. Si la lista está
//  vacía, no hay nada que hacer.
// ══════════════════════════════════════════════════════════

export type VarianteConPost = Pick<
  SocialVariant,
  "id" | "post_id" | "channel" | "status" | "scheduled_at" | "published_at" | "updated_at" | "error"
> & { title: string };

export type Nivel = "bloquea" | "urgente" | "pendiente" | "mejora";

export type Tarea = {
  id: string;
  nivel: Nivel;
  titulo: string;
  texto: string;
  /** Un enlace, o `rellenar` para el botón que reparte la nevera. */
  accion: { href: string; label: string } | { rellenar: true; label: string };
};

export type Paso = { hecho: boolean; titulo: string; texto: string; href: string; boton: string };

export type DiaAgenda = { dia: string; items: VarianteConPost[]; huecos: SocialChannel[] };

export type Panel = {
  settings: PublicSocialSettings;
  cuentas: Cuentas | null;
  variantes: VarianteConPost[];
  posts: { total: number; mes: number };
  porEstado: Record<SocialStatus, number>;
  publicadasMes: number;
  gasto: { total: number; mes: number; llamadas: number; medioPorPost: number; porPost: Map<string, number> };
  saldo: number | null;
  cobertura: Record<SocialChannel, Cobertura>;
  /** Primer hueco libre de cada canal, con su hora: lo que se ofrece al programar. */
  proximoHueco: Record<SocialChannel, string | null>;
  agenda: DiaAgenda[];
  cuota: { usadas: number; limite: number };
  tareas: Tarea[];
  pasos: Paso[];
};

const ORDEN: Record<Nivel, number> = { bloquea: 0, urgente: 1, pendiente: 2, mejora: 3 };
export const DIAS_AGENDA = 14;

export const cargarPanel = cache(async (locale: string): Promise<Panel> => {
  const en = locale === "en";
  const supabase = await createClient();
  const ahora = new Date();
  const hoy = diaMadrid(ahora);
  const mesMadrid = hoy.slice(0, 7);
  const fechaCorta = (dia: string) => new Date(`${dia}T12:00:00Z`).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const [settings, saldo, cuentas, { data: vs }, { data: ps }, { data: us }] = await Promise.all([
    publicSocialSettings(),
    saldoDeepseek(),
    cuentasUploadPost(),
    supabase
      .from("social_variants")
      .select("id, post_id, channel, status, scheduled_at, published_at, updated_at, error, social_posts(title)")
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
  const publicadasMes = variantes.filter((v) => v.status === "publicado" && v.published_at && diaMadrid(v.published_at).startsWith(mesMadrid)).length;

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

  // ── Cobertura, próximo hueco y agenda ──
  const fechaDe = (v: VarianteConPost) => (v.status === "publicado" ? v.published_at : v.status === "programado" ? v.scheduled_at : null);
  const cob = {} as Record<SocialChannel, Cobertura>;
  const proximoHueco = {} as Record<SocialChannel, string | null>;
  const ocupados = {} as Record<SocialChannel, Set<string>>;
  for (const c of CANALES) {
    ocupados[c] = new Set(
      variantes
        .filter((v) => v.channel === c)
        .map(fechaDe)
        .filter((d): d is string => Boolean(d))
        .map(diaMadrid),
    );
    const nevera = variantes.filter((v) => v.channel === c && v.status === "nevera").length;
    cob[c] = cobertura(settings.ritmo[c], ocupados[c], nevera, ahora);
    const libre = huecos(settings.ritmo[c], ahora, 120).find((h) => !ocupados[c].has(h.dia));
    proximoHueco[c] = libre ? instanteMadrid(libre.dia, settings.ritmo[c].hour).toISOString() : null;
  }

  const agenda: DiaAgenda[] = [];
  for (let i = 0; i < DIAS_AGENDA; i++) {
    const dia = sumarDias(hoy, i);
    const items = variantes
      .filter((v) => {
        const f = fechaDe(v);
        return f ? diaMadrid(f) === dia : false;
      })
      .sort((a, b) => (fechaDe(a) ?? "").localeCompare(fechaDe(b) ?? ""));
    agenda.push({ dia, items, huecos: [] });
  }
  for (const c of CANALES) {
    for (const h of huecos(settings.ritmo[c], ahora, DIAS_AGENDA - 1)) {
      if (ocupados[c].has(h.dia)) continue;
      agenda.find((d) => d.dia === h.dia)?.huecos.push(c);
    }
  }

  // ── Cuota de Upload-Post: X y LinkedIn de este mes, programadas o publicadas ──
  const usadas = variantes.filter((v) => {
    if (v.channel === "blog") return false;
    const cuando = fechaDe(v);
    return cuando ? diaMadrid(cuando).startsWith(mesMadrid) : false;
  }).length;
  const cuota = { usadas, limite: settings.monthlyQuota };

  // ── Lo que hay que hacer ──
  const tareas: Tarea[] = [];
  const conClave = settings.deepseekSource !== "ninguna";
  const ajustes = "/admin/publicaciones/ajustes";
  const recargar = { href: "https://platform.deepseek.com/top_up", label: en ? "Top up" : "Recargar" };

  if (!conClave) {
    tareas.push({
      id: "clave",
      nivel: "bloquea",
      titulo: en ? "Connect DeepSeek" : "Conecta DeepSeek",
      texto: en ? "Without its key nothing can be written." : "Sin su clave no se puede escribir nada.",
      accion: { href: `${ajustes}#deepseek`, label: en ? "Add the key" : "Añadir la clave" },
    });
  } else if (saldo !== null && saldo <= 0) {
    tareas.push({
      id: "saldo",
      nivel: "bloquea",
      titulo: en ? "DeepSeek has no balance" : "DeepSeek no tiene saldo",
      texto: en ? "Generating will fail until you top up." : "Generar fallará hasta que recargues.",
      accion: recargar,
    });
  } else if (saldo !== null && saldo < settings.minBalanceUsd) {
    tareas.push({
      id: "saldo",
      nivel: "mejora",
      titulo: en ? "Low DeepSeek balance" : "Queda poco saldo en DeepSeek",
      texto: en ? `${formatoUsd(saldo, locale)} left.` : `Quedan ${formatoUsd(saldo, locale)}.`,
      accion: recargar,
    });
  }

  if (porEstado.error) {
    tareas.push({
      id: "errores",
      nivel: "bloquea",
      titulo: en ? `${porEstado.error} failed to publish` : `${porEstado.error} no ${porEstado.error === 1 ? "ha" : "han"} podido salir`,
      texto: en ? "See what went wrong and schedule them again." : "Mira qué ha fallado y vuelve a programarlas.",
      accion: { href: "/admin/publicaciones/revisar", label: en ? "See errors" : "Ver errores" },
    });
  }

  // Redes sin conectar: lo programado en ellas no tendría por dónde salir.
  if (cuentas) {
    for (const c of ["x", "linkedin"] as const) {
      const cuenta = cuentas[c];
      if (!cob[c].activo) continue;
      if (!cuenta.conectada || cuenta.reautorizar) {
        tareas.push({
          id: `cuenta-${c}`,
          nivel: cob[c].programadas ? "urgente" : "pendiente",
          titulo: cuenta.reautorizar
            ? en ? `Reconnect ${NOMBRE_CANAL[c]}` : `Vuelve a conectar ${NOMBRE_CANAL[c]}`
            : en ? `Connect ${NOMBRE_CANAL[c]}` : `Conecta ${NOMBRE_CANAL[c]}`,
          texto: en
            ? `It is not connected in Upload-Post: what you schedule there will not go out.`
            : `No está conectado en Upload-Post: lo que programes ahí no podrá salir.`,
          accion: { href: `${ajustes}#upload-post`, label: en ? "How to connect it" : "Cómo conectarlo" },
        });
      }
    }
  }

  const borradores = porEstado.borrador;
  if (borradores) {
    tareas.push({
      id: "revisar",
      nivel: "pendiente",
      titulo: en ? `${borradores} to review` : `${borradores} por revisar`,
      texto: en ? "Freshly written versions: schedule them or keep them in the fridge." : "Versiones recién escritas: prográmalas o guárdalas en la nevera.",
      accion: { href: "/admin/publicaciones/revisar", label: en ? "Review" : "Revisar" },
    });
  }

  for (const c of CANALES) {
    const k = cob[c];
    if (!k.activo || k.dias >= settings.alertDays || !k.primerVacio) continue;
    const pronto = k.dias <= 2;
    tareas.push({
      id: `hueco-${c}`,
      nivel: pronto ? "urgente" : "pendiente",
      titulo: en
        ? `${NOMBRE_CANAL[c]}: nothing on ${fechaCorta(k.primerVacio)}`
        : `${NOMBRE_CANAL[c]}: no sale nada el ${fechaCorta(k.primerVacio)}`,
      texto: k.nevera
        ? en ? `You have ${k.nevera} in the fridge to fill it.` : `Tienes ${k.nevera} en la nevera para taparlo.`
        : k.hasta
          ? en ? `Covered for ${duracion(k.dias, locale)} only, and the fridge is empty.` : `Sólo vamos cubiertos ${duracion(k.dias, locale)} y la nevera está vacía.`
          : en ? "Nothing is scheduled and the fridge is empty." : "No hay nada programado y la nevera está vacía.",
      accion: k.nevera
        ? { rellenar: true, label: en ? "Fill from the fridge" : "Rellenar con la nevera" }
        : { href: `/admin/publicaciones/nueva?canal=${c}`, label: en ? "Create one" : "Crear una" },
    });
  }

  if (cuota.limite > 0 && cuota.usadas >= cuota.limite) {
    tareas.push({
      id: "cuota",
      nivel: "urgente",
      titulo: en ? "Upload-Post quota used up" : "Cuota de Upload-Post agotada",
      texto: en
        ? `${cuota.usadas} of ${cuota.limite} this month: anything else on X or LinkedIn waits until next month.`
        : `${cuota.usadas} de ${cuota.limite} este mes: lo demás en X o LinkedIn espera al mes que viene.`,
      accion: { href: `${ajustes}#alertas`, label: en ? "Review the plan" : "Revisar el plan" },
    });
  } else if (cuota.limite > 0 && cuota.usadas >= cuota.limite * 0.8) {
    tareas.push({
      id: "cuota",
      nivel: "mejora",
      titulo: en ? "Upload-Post quota almost used" : "Cuota de Upload-Post casi agotada",
      texto: en ? `${cuota.usadas} of ${cuota.limite} this month.` : `${cuota.usadas} de ${cuota.limite} este mes.`,
      accion: { href: "/admin/publicaciones/calendario", label: en ? "See calendar" : "Ver calendario" },
    });
  }

  if (!settings.ritmoGuardado) {
    tareas.push({
      id: "ritmo",
      nivel: "pendiente",
      titulo: en ? "Confirm the rhythm" : "Confirma el ritmo",
      texto: en ? "Which days and at what time each channel posts. Gaps and alerts come from it." : "Qué días y a qué hora publica cada canal. Los huecos y las alertas salen de ahí.",
      accion: { href: `${ajustes}#ritmo`, label: en ? "Set the rhythm" : "Fijar el ritmo" },
    });
  }

  tareas.sort((a, b) => ORDEN[a.nivel] - ORDEN[b.nivel]);

  // ── Primeros pasos (sólo se enseñan mientras falte alguno) ──
  const pasos: Paso[] = [
    {
      hecho: conClave && (saldo === null || saldo > 0),
      titulo: en ? "Connect DeepSeek" : "Conecta DeepSeek",
      texto: en ? "The AI that writes." : "La IA que escribe.",
      href: `${ajustes}#deepseek`,
      boton: en ? "Settings" : "Ajustes",
    },
    {
      hecho: Boolean(cuentas && (cuentas.x.conectada || cuentas.linkedin.conectada)),
      titulo: en ? "Connect your networks" : "Conecta tus redes",
      texto: en ? "X and LinkedIn, in Upload-Post." : "X y LinkedIn, en Upload-Post.",
      href: `${ajustes}#upload-post`,
      boton: en ? "How" : "Cómo",
    },
    {
      hecho: posts.length > 0,
      titulo: en ? "Create a post" : "Crea una publicación",
      texto: en ? "A topic or a link is enough." : "Basta con un tema o un enlace.",
      href: "/admin/publicaciones/nueva",
      boton: en ? "Create" : "Crear",
    },
    {
      hecho: porEstado.programado + porEstado.publicado + porEstado.nevera > 0,
      titulo: en ? "Schedule it" : "Prográmala",
      texto: en ? "Give it a date or keep it in the fridge." : "Ponle fecha o guárdala en la nevera.",
      href: "/admin/publicaciones/revisar",
      boton: en ? "Review" : "Revisar",
    },
  ];

  return {
    settings,
    cuentas,
    variantes,
    posts: { total: posts.length, mes: posts.filter((p) => diaMadrid(p.created_at).startsWith(mesMadrid)).length },
    porEstado,
    publicadasMes,
    gasto: { total, mes, llamadas: usos.length, medioPorPost: porPost.size ? total / porPost.size : 0, porPost },
    saldo,
    cobertura: cob,
    proximoHueco,
    agenda,
    cuota,
    tareas,
    pasos,
  };
});

/**
 * Lo justo para los números del menú lateral: cuánto espera revisión y
 * cuánto hay en la nevera. Una consulta pequeña, porque va en todas las
 * páginas del panel.
 */
export const contarPendientes = cache(async (): Promise<{ revisar: number; nevera: number }> => {
  const supabase = await createClient();
  const { data } = await supabase.from("social_variants").select("status").in("status", ["borrador", "error", "nevera"]);
  const filas = (data ?? []) as { status: SocialStatus }[];
  return {
    revisar: filas.filter((f) => f.status !== "nevera").length,
    nevera: filas.filter((f) => f.status === "nevera").length,
  };
});
