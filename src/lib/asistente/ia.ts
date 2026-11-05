import "server-only";

import { reply, type AssistantReply, type Hit } from "@/lib/asistente/chat";
import { conocimiento } from "@/lib/asistente/conocimiento";
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
//  damos: todas las FAQs que puede ver el alumno, el temario, el texto de
//  sus módulos, las herramientas y el claustro (conocimiento.ts), los trozos
//  de documento que encuentra el buscador y los datos reales de su dry run
//  (fecha, enlaces, agenda, lo que le falta de la preparación). Si la respuesta no
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

const SISTEMA = `Eres el asistente del campus de ActiveXRemote (The Remote Business School), una escuela online que forma a profesionales para trabajar en remoto para empresas de cualquier país o montar su propio negocio remoto. Ahora mismo acompañas sobre todo a los invitados al DRY RUN del Módulo 1: una clase de prueba gratuita y en directo para probar la dinámica de la clase y recoger feedback.

Sabes de: el contenido del curso (temario completo y el texto de los módulos a los que tiene acceso), quién da las clases, cómo funcionan las clases y el campus, las herramientas que se trabajan y la logística del dry run. Todo está en CONTEXTO.

Cómo contestar:
- Entiende la intención aunque la pregunta sea corta, coloquial, esté mal escrita o dependa de lo que se ha hablado antes («¿y eso qué es?», «digo el contenido»). Si alguien insiste o reformula, es que tu respuesta anterior no era lo que buscaba: cambia de enfoque.
- Responde exactamente a lo que pregunta. No cambies de tema ni contestes otra FAQ parecida.
- Puedes explicar con tus palabras, resumir y relacionar lo que dice el contenido del curso (por ejemplo, qué se aprende en el Módulo 1 o qué es la Matriz de Competencias), y enlazar a la lección donde se ve.
- Nunca inventes datos concretos que no estén en CONTEXTO: fechas, horas, precios, enlaces, nombres, normas ni contenidos de módulos que no aparecen. Si no está, dilo con naturalidad, di lo que sí sabes que se acerque y sugiere escribir a admin@activexremote.com. Entonces answered=false.
- Idioma: el de la última pregunta (si es en inglés, en inglés; el contexto está en español, tradúcelo).
- Tono: cálido, directo, tuteando. Breve: 2-6 frases o una lista corta; más solo si piden detalle. Markdown sencillo.
- No supongas el género de nadie: usa formas neutras («tienes plaza», no «estás apuntado/a»).
- Las rutas del campus van como enlaces markdown: [tu preparación](/preparacion), [la lección](/lecciones/…).
- Si viene al caso y sus datos dicen qué pasos de la preparación le faltan, recuérdale el siguiente.

Formato de salida, SIEMPRE, también en las respuestas que siguen a otras: un único objeto JSON
{"answer": "texto en markdown", "answered": true|false, "faq_ids": ["ids de las FAQs que has usado"], "related": ["hasta 3 títulos EXACTOS (copiados tal cual, en español) de otras FAQs útiles para seguir"]}`;

function contexto(faqs: Faq[], docs: Hit[], dryRun: string | null, curso: string): string {
  const partes: string[] = [];
  if (dryRun) partes.push(`DATOS DE SU SESIÓN DE DRY RUN:\n${dryRun}`);
  partes.push(`FAQS:\n${faqs.map((f) => `[${f.id}] ${f.title}\n${f.body}`).join("\n\n")}`);
  partes.push(curso);
  if (docs.length) partes.push(`FRAGMENTOS DE DOCUMENTOS:\n${docs.map((d) => `[${d.title} · ${d.heading}]\n${d.content}`).join("\n\n")}`);
  return partes.join("\n\n---\n\n");
}

export type ReplyIA = AssistantReply & { ia: boolean };

/**
 * Escapa los saltos de línea y tabuladores que van dentro de una cadena:
 * DeepSeek a veces escribe el markdown de `answer` con saltos reales, que
 * no son JSON válido.
 */
function repararCadenas(texto: string): string {
  let fuera = "";
  let dentro = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (dentro && c === "\\") {
      fuera += c + (texto[i + 1] ?? "");
      i++;
      continue;
    }
    if (c === '"') dentro = !dentro;
    fuera += dentro && c === "\n" ? "\\n" : dentro && c === "\r" ? "" : dentro && c === "\t" ? "\\t" : c;
  }
  return fuera;
}

type Salida = { answer?: unknown; answered?: unknown; faq_ids?: unknown; related?: unknown };

/**
 * El JSON de la respuesta, aunque venga envuelto en ``` o con saltos de
 * línea sin escapar. Si no hay forma de leerlo, el texto suelto se toma como
 * respuesta: mejor eso que nada.
 */
export function leer(texto: string): Salida {
  const limpio = texto.trim().replace(/^```(?:json)?\s*|\s*```$/g, "");
  const candidatos = [limpio, limpio.match(/\{[\s\S]*\}/)?.[0]].filter((x): x is string => Boolean(x));
  for (const c of candidatos) {
    for (const t of [c, repararCadenas(c)]) {
      try {
        const j = JSON.parse(t);
        if (j && typeof j === "object") return j as Salida;
      } catch {
        /* el siguiente */
      }
    }
  }
  return limpio && !limpio.startsWith("{") ? { answer: limpio } : {};
}

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
    const [faqs, dryRun, curso, { data: hits }] = await Promise.all([
      faqsVisibles(cursos),
      contextoDryRun(quien.userId, quien.esEquipo),
      conocimiento(quien.userId, cursos, quien.esEquipo),
      admin.rpc("search_kb", { query: question.slice(0, 500), courses: cursos, match_count: 6 }),
    ]);
    const docs = ((hits ?? []) as Hit[]).filter((h) => h.kind === "documento" && h.coverage >= 0.25).slice(0, 4);

    const mensajes = [
      // El sistema y el contexto van primero y casi no cambian entre
      // preguntas: DeepSeek cobra casi gratis la parte que tiene en caché.
      { role: "system" as const, content: `${SISTEMA}\n\nCONTEXTO:\n\n${contexto(faqs, docs, dryRun, curso)}` },
      // Las respuestas anteriores vuelven en el mismo JSON que se le pide:
      // si se le devuelven en texto, a partir de la segunda pregunta imita
      // el texto y deja de mandar JSON.
      ...historial.slice(-MAX_TURNOS).map((t) =>
        t.role === "assistant"
          ? { role: "assistant" as const, content: JSON.stringify({ answer: t.content.slice(0, 2000) }) }
          : { role: "user" as const, content: t.content.slice(0, 2000) },
      ),
      { role: "user" as const, content: question },
    ];

    let json: Salida = {};
    for (let intento = 0; intento < 2 && !json.answer; intento++) {
      const res = await cfg.client.chat.completions.create({
        model: cfg.model,
        messages: mensajes,
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1200,
        ...({ thinking: { type: "disabled" } } as object),
      });
      json = leer(res.choices[0]?.message?.content ?? "");
    }

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
    // El buscador no contesta por su cuenta: con una pregunta abierta
    // («¿qué voy a aprender?») devolvía la FAQ que compartía una palabra, y
    // eso es peor que reconocer el fallo. Sólo sugiere preguntas.
    console.error(`[asistente] DeepSeek no ha contestado: ${err instanceof Error ? err.message : err}`);
    const r = await reply(question, cursos).catch(() => null);
    return {
      answered: false,
      answer: { kind: "ia", heading: "", content: "Perdona, ahora mismo no he podido pensar bien la respuesta. Prueba otra vez en un momento o elige una de estas preguntas." },
      related: r ? [...new Set([...(r.answer ? [r.answer.heading] : []), ...r.related])].slice(0, 3) : [],
      sourceIds: [],
      ia: false,
    };
  }
}
