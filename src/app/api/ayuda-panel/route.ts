import { NextResponse, type NextRequest } from "next/server";

import type { Turno } from "@/lib/asistente/ia";
import { ayudaPanel } from "@/lib/ayuda-panel/ia";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

// POST /api/ayuda-panel   { question, history?, ruta?, titulo? }
//
// La ayuda del panel (ver lib/ayuda-panel/ia.ts). Sólo para el equipo:
// administración, profesorado y comercial. Devuelve lo mismo que el
// asistente del campus (`AssistantReply`), así el chat es el mismo.

const EQUIPO: UserRole[] = ["administrador", "profesor", "comercial"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "no-auth" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role, full_name, email").eq("id", user.id).maybeSingle();
  const rol = profile?.role as UserRole | undefined;
  if (!rol || !EQUIPO.includes(rol)) return NextResponse.json({ error: "no-auth" }, { status: 403 });

  const body = (await request.json().catch(() => null)) as { question?: unknown; history?: unknown; ruta?: unknown; titulo?: unknown } | null;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 2000) : "";
  if (!question) return NextResponse.json({ error: "Falta la pregunta." }, { status: 400 });
  const history: Turno[] = (Array.isArray(body?.history) ? body.history : [])
    .filter(
      (t): t is Turno =>
        Boolean(t) && (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.trim() !== "",
    )
    .slice(-8);
  const ruta = typeof body?.ruta === "string" && body.ruta.startsWith("/admin") ? body.ruta.slice(0, 200) : null;
  const titulo = typeof body?.titulo === "string" ? body.titulo.slice(0, 160) : null;

  const result = await ayudaPanel(question, history, {
    rol,
    nombre: (profile?.full_name as string) || (profile?.email as string) || "—",
    ruta,
    titulo,
  });
  return NextResponse.json(result, { headers: { "cache-control": "no-store" } });
}
