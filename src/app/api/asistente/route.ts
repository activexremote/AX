import { NextResponse, type NextRequest } from "next/server";

import { coursesFor, reply } from "@/lib/asistente/chat";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// POST /api/asistente   { question }
//
// Busca la pregunta en la base del asistente y devuelve la respuesta como
// JSON (ver `AssistantReply`). Cada pregunta queda registrada en
// `assistant_questions`: las que no encuentran nada son la lista de FAQs que
// le faltan al equipo.

/** Preguntas por hora para un alumno. No cuestan dinero, pero llenan el registro. */
const LIMITE_HORA = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "no-auth" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!profile) return NextResponse.json({ error: "no-auth" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { question?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 2000) : "";
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
    const result = await reply(question, await coursesFor(user.id, profile.role));

    const { error } = await admin.from("assistant_questions").insert({
      user_id: user.id,
      question,
      answer: result.answer ? `${result.answer.heading}\n\n${result.answer.content}`.slice(0, 4000) : null,
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
