import "server-only";

import { leer } from "@/lib/asistente/ia";
import { distribucion, indicadores, porTipologia } from "@/lib/comercial/analisis";
import type { FichaLead } from "@/lib/comercial/leads";
import { PREGUNTAS, textoOpcion, type Respuestas } from "@/lib/comercial/perfilado";
import { loadMeta, metaMissing } from "@/lib/kpis/fuentes/meta";
import { deepseekClient } from "@/lib/social/settings";
import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  La lectura con IA de los perfilados
//
//  DeepSeek recibe lo que ha apuntado el equipo comercial (sin nombres ni
//  correos: no le hacen falta), las cuentas del análisis, lo que dicen hoy
//  los banners aprobados y, si Meta está conectado, cómo van las campañas
//  en los últimos 30 días. Devuelve a quién apuntar, por qué los anuncios
//  no terminan de funcionar y qué cambiar. Se guarda en `lead_insights`.
// ══════════════════════════════════════════════════════════

export type Insight = {
  resumen: string;
  target: { perfil: string; porque: string };
  evitar: { perfil: string; porque: string }[];
  problemas: { titulo: string; explicacion: string; evidencia: string }[];
  acciones: { titulo: string; detalle: string }[];
  mensajes: { angulo: string; ejemplo: string }[];
  validar: string[];
  confianza: "baja" | "media" | "alta";
};

const SISTEMA = `Eres analista de marketing de captación de ActiveXRemote (The Remote Business School), una escuela online de pago que forma a profesionales para trabajar en remoto para empresas de cualquier país (programa Remote Professional) o montar su negocio remoto (programa Remote Founder). Los leads llegan sobre todo por anuncios de Meta (Instagram y Facebook) con formularios; una comercial les llama y apunta qué perfil son, qué buscaban, qué les pareció el precio, su interés real, etc.

Tu trabajo: a partir de esas fichas, decir a qué tipología de persona deberían apuntar las campañas, por qué lo que se está anunciando ahora no termina de funcionar (posibles motivos, con la evidencia de los datos) y qué cambiar.

Reglas:
- Básate SOLO en los datos de CONTEXTO. Cita números concretos (n, %, medias) como evidencia. Si una conclusión sale de pocos casos, dilo.
- Con menos de 10 fichas, confianza «baja»; 10–30, «media»; más, «alta».
- Sé concreto y accionable: segmentación, mensaje del anuncio, formulario, oferta, velocidad de llamada. Nada de generalidades.
- Los mensajes de ejemplo, en español, cortos, listos para un anuncio.
- No supongas el género de nadie.

Responde SOLO con un objeto JSON:
{"resumen": "3-4 frases con la conclusión principal",
 "target": {"perfil": "la tipología a la que apuntar", "porque": "por qué, con datos"},
 "evitar": [{"perfil": "...", "porque": "..."}],
 "problemas": [{"titulo": "posible motivo de que los anuncios no funcionen", "explicacion": "...", "evidencia": "datos que lo apoyan"}],
 "acciones": [{"titulo": "qué cambiar", "detalle": "cómo"}],
 "mensajes": [{"angulo": "nombre del ángulo", "ejemplo": "texto de anuncio"}],
 "validar": ["preguntas o pruebas para confirmar las hipótesis"],
 "confianza": "baja|media|alta"}`;

function lineaFicha(f: FichaLead, i: number): string {
  const r = f.answers as Respuestas;
  const partes = PREGUNTAS.filter((p) => r[p.k] !== undefined).map((p) => {
    const v = r[p.k];
    if (p.tipo === "escala") return `${p.k}=${v}/5`;
    return `${p.k}=${(Array.isArray(v) ? v : [String(v)]).map((x) => textoOpcion(p.k, x)).join(" + ")}`;
  });
  if (f.lead_status) partes.push(`estado_zoho=${f.lead_status}`);
  if (f.notes) partes.push(`notas="${f.notes.replace(/\s+/g, " ").slice(0, 600)}"`);
  return `#${i + 1}: ${partes.join("; ")}`;
}

async function anuncios(): Promise<string> {
  const admin = createAdminClient();
  const [{ data: aprobados }, { data: campanas }] = await Promise.all([
    admin.from("ad_banners").select("angle, copy, ad_campaigns(name, course, audience)").eq("status", "aprobado").order("updated_at", { ascending: false }).limit(15),
    admin.from("ad_campaigns").select("name, course, objective, audience, angles, notes").order("created_at", { ascending: false }).limit(8),
  ]);
  const l: string[] = [];
  for (const b of aprobados ?? []) {
    const c = (b.copy ?? {}) as Record<string, string>;
    const camp = (Array.isArray(b.ad_campaigns) ? b.ad_campaigns[0] : b.ad_campaigns) as { name?: string } | null;
    l.push(
      `- [${camp?.name ?? "campaña"} · ángulo ${b.angle}] ${[c.kicker, c.headline, c.sub, c.extra, c.chat, c.cta ? `CTA: ${c.cta}` : ""]
        .filter(Boolean)
        .join(" | ")
        .replace(/\s+/g, " ")}`,
    );
  }
  const camps = (campanas ?? []).map(
    (c) => `- ${c.name} (${c.course}, objetivo ${c.objective}; ángulos: ${(c.angles ?? []).join(", ")}${c.audience ? `; público: ${c.audience}` : ""})`,
  );
  return [
    `BANNERS APROBADOS (lo que se está anunciando):\n${l.length ? l.join("\n") : "(ninguno aprobado)"}`,
    `CAMPAÑAS DE BANNERS RECIENTES:\n${camps.join("\n") || "(ninguna)"}`,
  ].join("\n\n");
}

async function rendimientoMeta(): Promise<string> {
  if (metaMissing().length) return "RENDIMIENTO EN META: no conectado.";
  try {
    const hoy = new Date();
    const desde = new Date(hoy.getTime() - 30 * 86400000);
    const d = (x: Date) => x.toISOString().slice(0, 10);
    const m = await Promise.race([
      loadMeta({ since: d(desde), until: d(hoy) }),
      new Promise<never>((_, no) => setTimeout(() => no(new Error("tiempo")), 15000)),
    ]);
    const filas = m.campaigns
      .filter((c) => c.spendEur > 0)
      .map(
        (c) =>
          `- ${c.campaign}: gasto ${c.spendEur.toFixed(0)} €, ${c.impressions} impresiones, ${c.clicks} clics (CTR ${c.impressions ? ((c.clicks / c.impressions) * 100).toFixed(2) : 0} %), ${c.conversions} leads${c.conversions ? `, ${(c.spendEur / c.conversions).toFixed(1)} €/lead` : ""}`,
      );
    return `RENDIMIENTO EN META (últimos 30 días, por campaña):\n${filas.join("\n") || "(sin gasto)"}`;
  } catch (e) {
    return `RENDIMIENTO EN META: no se ha podido leer (${e instanceof Error ? e.message : e}).`;
  }
}

export async function analizarConIA(todas: FichaLead[], totalLeads: number): Promise<Insight> {
  const cfg = await deepseekClient();
  if (!cfg) throw new Error("Falta la clave de DeepSeek (Publicaciones → Ajustes).");

  const conDatos = todas.filter((f) => Object.keys(f.answers ?? {}).length || f.notes);
  const rs = conDatos.map((f) => f.answers as Respuestas);
  const ind = indicadores(rs);
  const tipos = porTipologia(rs);
  const dist = PREGUNTAS.map((p) => {
    const d = distribucion(rs, p.k);
    return `${p.titulo} (n=${d.total}): ${d.barras.filter((b) => b.n).map((b) => `${b.t} ${b.n} (${b.pct} %)`).join("; ") || "sin respuestas"}`;
  });

  const [ads, meta] = await Promise.all([anuncios(), rendimientoMeta()]);
  const contexto = [
    `LEADS EN ZOHO: ${totalLeads}. FICHAS CON DATOS: ${conDatos.length}.`,
    `INDICADORES: interés medio ${ind.interes ?? "—"}/5; encaje medio ${ind.encaje ?? "—"}/5; sólo escuchaban por educación ${ind.soloEducacion} %; el precio frena ${ind.precio} %; esperaban otra cosa ${ind.otraCosa} %; acaban en matrícula/seguimiento/info ${ind.positivo} %.`,
    `POR TIPOLOGÍA (puntuación 0-100 = interés, encaje y resultado):\n${tipos
      .map((t) => `- ${t.t}: n=${t.n}, interés ${t.interes ?? "—"}, encaje ${t.encaje ?? "—"}, positivo ${t.positivo} %, precio frena ${t.precio} %, esperaba otra cosa ${t.otraCosa} %, puntuación ${t.puntuacion}`)
      .join("\n")}`,
    `REPARTO DE CADA PREGUNTA:\n${dist.join("\n")}`,
    `FICHAS UNA A UNA:\n${conDatos.map(lineaFicha).join("\n")}`,
    ads,
    meta,
  ].join("\n\n---\n\n");

  let json: Record<string, unknown> = {};
  for (let i = 0; i < 2 && !json.resumen; i++) {
    const res = await cfg.client.chat.completions.create({
      model: cfg.model,
      messages: [
        { role: "system", content: SISTEMA },
        { role: "user", content: `CONTEXTO:\n\n${contexto}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 3000,
      ...({ thinking: { type: "disabled" } } as object),
    });
    json = leer(res.choices[0]?.message?.content ?? "") as Record<string, unknown>;
  }
  if (typeof json.resumen !== "string" || !json.resumen) throw new Error("La IA no ha devuelto un análisis válido. Prueba otra vez.");

  const arr = <T,>(v: unknown, f: (x: Record<string, unknown>) => T | null): T[] =>
    (Array.isArray(v) ? v : []).map((x) => (x && typeof x === "object" ? f(x as Record<string, unknown>) : null)).filter((x): x is T => x !== null).slice(0, 8);
  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const tg = (json.target ?? {}) as Record<string, unknown>;
  return {
    resumen: s(json.resumen),
    target: { perfil: s(tg.perfil), porque: s(tg.porque) },
    evitar: arr(json.evitar, (x) => (s(x.perfil) ? { perfil: s(x.perfil), porque: s(x.porque) } : null)),
    problemas: arr(json.problemas, (x) => (s(x.titulo) ? { titulo: s(x.titulo), explicacion: s(x.explicacion), evidencia: s(x.evidencia) } : null)),
    acciones: arr(json.acciones, (x) => (s(x.titulo) ? { titulo: s(x.titulo), detalle: s(x.detalle) } : null)),
    mensajes: arr(json.mensajes, (x) => (s(x.ejemplo) ? { angulo: s(x.angulo), ejemplo: s(x.ejemplo) } : null)),
    validar: (Array.isArray(json.validar) ? json.validar : []).filter((x): x is string => typeof x === "string").slice(0, 6),
    confianza: json.confianza === "alta" || json.confianza === "media" ? json.confianza : "baja",
  };
}
