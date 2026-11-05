import { NextResponse, type NextRequest } from "next/server";

import { coursesFor } from "@/lib/asistente/chat";
import { replyIA, type Turno } from "@/lib/asistente/ia";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// POST /api/asistente   { question, history? }
//
// Contesta con DeepSeek a partir de la base del asistente (o con el buscador
// si no hay IA) y devuelve la respuesta como JSON (ver `AssistantReply`).
// `history` son los últimos turnos del chat, para entender preguntas como
// «¿y a qué hora?». Cada pregunta queda registrada en
// `assistant_questions`: las que no encuentran nada son la lista de FAQs que
// le faltan al equipo.

/** Preguntas por hora para un alumno: cada una es una llamada a DeepSeek. */
const LIMITE_HORA = 40;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "no-auth" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "no-auth" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { question?: unknown; history?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 2000) : "";
  const history: Turno[] = (Array.isArray(body?.history) ? body.history : [])
    .filter(
      (t): t is Turno =>
        Boolean(t) && (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.trim() !== "",
    )
    .slice(-6);
  if (!question) return NextResponse.json({ error: "Falta la pregunta." }, { status: 400 });

  const admin = createAdminClient();
  const esEquipo = profile.role === "administrador" || profile.role === "profesor";

  if (!esEquipo) {
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("assistant_questions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", haceUnaHora);
    if ((count ?? 0) >= LIMITE_HORA) {
      return NextResponse.json(
        { error: "Has hecho muchas preguntas seguidas. Prueba de nuevo dentro de un rato." },
        { status: 429 },
      );
    }
  }

  try {
    const result = await replyIA(question, history, await coursesFor(user.id, profile.role), { userId: user.id, esEquipo });

    const { error } = await admin.from("assistant_questions").insert({
      user_id: user.id,
      question,
      answer: result.answer ? [result.answer.heading, result.answer.content].filter(Boolean).join("\n\n").slice(0, 4000) : null,
      answered: result.answered,
      source_ids: result.sourceIds,
    });
    if (error) console.error(`[asistente] no se pudo registrar la pregunta: ${error.message}`);

    return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    console.error(`[asistente] no se pudo responder: ${err}`);
    return NextResponse.json({ error: "El asistente no está disponible ahora mismo." }, { status: 500 });
  }
}
