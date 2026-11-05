import "server-only";

import { reply, type AssistantReply, type Hit } from "@/lib/asistente/chat";
import { docenteDe } from "@/lib/dry-run/docente";
import { PASOS } from "@/lib/dry-run/preparacion";
import { cuandoEs } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, leerAgenda, type DryRun } from "@/lib/dry-run/tipos";
import { deepseekClient } from "@/lib/social/settings";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CourseKey } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  El asistente con IA
//
//  DeepSeek entiende la pregunta (aunque esté mal escrita, en inglés o
//  dependa de lo que se dijo antes) y la contesta, pero sólo con lo que le
//  damos: todas las FAQs que puede ver el alumno, los trozos de documento
//  que encuentra el buscador y los datos reales de su dry run (fecha,
//  enlaces, agenda, lo que le falta de la preparación). Si la respuesta no
//  está ahí, lo dice: no se inventa fechas, precios ni enlaces.
//
//  Si DeepSeek no está configurado o falla, contesta el buscador de siempre.
// ══════════════════════════════════════════════════════════

export type Turno = { role: "user" | "assistant"; content: string };

/** Lo que cabe de FAQs en el contexto. Hoy son ~10.000 caracteres. */
const PRESUPUESTO_FAQS = 60_000;
const MAX_TURNOS = 6;

type Faq = { id: string; title: string; body: string };

async function faqsVisibles(cursos: CourseKey[]): Promise<Faq[]> {
  const admin = createAdminClient();
  const filtro = cursos.length ? `course.is.null,course.in.(${cursos.join(",")})` : "course.is.null";
  const { data } = await admin
    .from("kb_sources")
    .select("id, title, body, course")
    .eq("kind", "faq")
    .eq("active", true)
    .or(filtro)
    // Las del dry run y las generales primero: son las que más se preguntan.
    .order("course", { ascending: true, nullsFirst: true })
    .order("title");
  const lista: Faq[] = [];
  let usado = 0;
  for (const f of data ?? []) {
    usado += f.title.length + f.body.length;
    if (usado > PRESUPUESTO_FAQS) break;
    lista.push({ id: f.id, title: f.title, body: f.body });
  }
  return lista;
}

/** El dry run de quien pregunta, o el próximo abierto si es del equipo y no tiene plaza. */
async function contextoDryRun(userId: string, esEquipo: boolean): Promise<string | null> {
  const admin = createAdminClient();
  const { data: guests } = await admin
    .from("dry_run_guests")
    .select("dry_run_id, onboarding, status")
    .eq("user_id", userId)
    .in("status", CON_PLAZA);

  let run: DryRun | null = null;
  let hechos: Record<string, string> | null = null;
  if (guests?.length) {
    const { data } = await admin
      .from("dry_runs")
      .select("*")
      .in("id", guests.map((g) => g.dry_run_id))
      .order("starts_at", { ascending: true });
    const ahora = Date.now();
    const runs = (data ?? []) as DryRun[];
    run = runs.find((r) => new Date(r.ends_at).getTime() >= ahora) ?? runs.at(-1) ?? null;
    hechos = (guests.find((g) => g.dry_run_id === run?.id)?.onboarding ?? {}) as Record<string, string>;
  } else if (esEquipo) {
    const { data } = await admin
      .from("dry_runs")
      .select("*")
      .gte("ends_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    run = (data as DryRun | null) ?? null;
  }
  if (!run) return null;

  const { data: modulo } = await admin.from("modules").select("title, order_index").eq("id", run.module_id).maybeSingle();
  const docente = docenteDe(run.teacher_name);
  const terminado = new Date(run.ends_at).getTime() < Date.now();

  const l: string[] = [
    `Sesión: ${run.title}${modulo ? ` (Módulo ${modulo.order_index}: ${modulo.title})` : ""}`,
    `Cuándo: ${cuandoEs(run.starts_at, run.ends_at)}, hora de Madrid${terminado ? " (YA SE HA CELEBRADO)" : ""}`,
    `Docente: ${docente ? `${docente.name}, ${docente.es.role}. ${docente.es.bio} Perfil: ${docente.url}` : run.teacher_name}`,
    `Clase en Google Classroom: ${run.classroom_url || "el enlace aún no está publicado; estará en /preparacion"}`,
  ];
  if (run.classroom_code) l.push(`Código de Classroom: ${run.classroom_code}`);
  l.push(`Enlace de la videollamada: ${run.meet_url || "aún no está publicado; estará en /preparacion y en el correo de una hora antes"}`);
  const agenda = leerAgenda(run.agenda);
  if (agenda.length) l.push(`Agenda: ${agenda.map((a) => `${a.hora} ${a.que}`).join(" · ")}`);
  if (hechos) {
    const faltan = PASOS.filter((p) => !hechos[p.key]).map((p) => p.titulo);
    l.push(faltan.length ? `Pasos de su preparación que le faltan: ${faltan.join("; ")}` : "Ha completado todos los pasos de su preparación.");
  } else {
    l.push("Quien pregunta es del equipo (no tiene plaza): contesta como si fuera un invitado.");
  }
  return l.join("\n");
}

const SISTEMA = `Eres el asistente del campus de ActiveXRemote (The Remote Business School). Ahora mismo tu trabajo principal es acompañar a los invitados al DRY RUN del Módulo 1: una clase de prueba gratuita, en directo, para probar la dinámica de la clase y recoger feedback.

Reglas:
- Contesta SOLO con la información de CONTEXTO (los datos de su sesión, las FAQs y los fragmentos). Nunca inventes fechas, horas, precios, enlaces, nombres ni normas.
- Si el contexto no tiene la respuesta, dilo con naturalidad y sugiere escribir a admin@activexremote.com. Marca answered=false.
- Interpreta la intención aunque la pregunta esté mal escrita, sea coloquial o dependa de mensajes anteriores.
- Contesta SIEMPRE en el idioma de la última pregunta: si es en inglés, en inglés (traduce el contexto, que está en español). Tutea. Sé cálido, directo y breve: 2-6 frases o una lista corta. Markdown sencillo (negritas, listas, enlaces).
- No supongas el género de nadie: usa formas neutras («tienes plaza», no «estás apuntado/a»).
- Las rutas del campus (como /preparacion) se escriben como enlaces markdown: [tu preparación](/preparacion).
- Si los datos de su sesión dicen qué pasos le faltan y viene al caso, recuérdale el siguiente.

Devuelve SOLO un JSON: {"answer": "texto en markdown", "answered": true|false, "faq_ids": ["ids de las FAQs que has usado"], "related": ["hasta 3 títulos EXACTOS (copiados tal cual, en español) de otras FAQs útiles para seguir"]}`;

function contexto(faqs: Faq[], docs: Hit[], dryRun: string | null): string {
  const partes: string[] = [];
  if (dryRun) partes.push(`DATOS DE SU SESIÓN DE DRY RUN:\n${dryRun}`);
  partes.push(`FAQS:\n${faqs.map((f) => `[${f.id}] ${f.title}\n${f.body}`).join("\n\n")}`);
  if (docs.length) partes.push(`FRAGMENTOS DE DOCUMENTOS:\n${docs.map((d) => `[${d.title} · ${d.heading}]\n${d.content}`).join("\n\n")}`);
  return partes.join("\n\n---\n\n");
}

export type ReplyIA = AssistantReply & { ia: boolean };

export async function replyIA(
  question: string,
  historial: Turno[],
  cursos: CourseKey[],
  quien: { userId: string; esEquipo: boolean },
): Promise<ReplyIA> {
  const cfg = await deepseekClient();
  if (!cfg) return { ...(await reply(question, cursos)), ia: false };

  try {
    const admin = createAdminClient();
    const [faqs, dryRun, { data: hits }] = await Promise.all([
      faqsVisibles(cursos),
      contextoDryRun(quien.userId, quien.esEquipo),
      admin.rpc("search_kb", { query: question.slice(0, 500), courses: cursos, match_count: 6 }),
    ]);
    const docs = ((hits ?? []) as Hit[]).filter((h) => h.kind === "documento" && h.coverage >= 0.25).slice(0, 4);

    const res = await cfg.client.chat.completions.create({
      model: cfg.model,
      messages: [
        // El sistema y las FAQs van primero y no cambian entre preguntas:
        // DeepSeek los cobra casi gratis cuando los tiene en caché.
        { role: "system", content: `${SISTEMA}\n\nCONTEXTO:\n\n${contexto(faqs, docs, dryRun)}` },
        ...historial.slice(-MAX_TURNOS).map((t) => ({ role: t.role, content: t.content.slice(0, 2000) })),
        { role: "user", content: question },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 900,
      ...({ thinking: { type: "disabled" } } as object),
    });

    const json = JSON.parse(res.choices[0]?.message?.content ?? "") as {
      answer?: unknown;
      answered?: unknown;
      faq_ids?: unknown;
      related?: unknown;
    };
    const answer = typeof json.answer === "string" ? json.answer.trim() : "";
    if (!answer) throw new Error("respuesta vacía");

    const titulos = new Set(faqs.map((f) => f.title));
    const ids = new Set(faqs.map((f) => f.id));
    const related = (Array.isArray(json.related) ? json.related : [])
      .filter((r): r is string => typeof r === "string" && titulos.has(r))
      .slice(0, 3);
    const sourceIds = (Array.isArray(json.faq_ids) ? json.faq_ids : []).filter((x): x is string => typeof x === "string" && ids.has(x));

    return {
      answered: json.answered !== false,
      answer: { kind: "ia", heading: "", content: answer },
      related,
      sourceIds,
      ia: true,
    };
  } catch (err) {
    console.error(`[asistente] DeepSeek no ha contestado, va el buscador: ${err instanceof Error ? err.message : err}`);
    return { ...(await reply(question, cursos)), ia: false };
  }
}
