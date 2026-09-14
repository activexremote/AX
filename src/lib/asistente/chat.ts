import { createAdminClient } from "@/lib/supabase/admin";
import type { CourseKey, UserRole } from "@/lib/supabase/types";
import { ALL_COURSES } from "@/lib/asistente/courses";

// ══════════════════════════════════════════════════════════
//  Respuesta del asistente
//
//  Es un buscador, no una IA: devuelve la FAQ o el fragmento de documento
//  que mejor encaja con la pregunta, tal como lo escribió el equipo, y lo
//  que se parece de lejos lo ofrece como «preguntas relacionadas».
//
//  La ventaja, además del coste cero: nunca se inventa una fecha ni un
//  precio. Lo que dice el chat es exactamente lo que dice el material.
// ══════════════════════════════════════════════════════════

/**
 * Qué parte de las palabras de la pregunta tiene que aparecer en un trozo
 * para darlo como respuesta. Por debajo, se ofrece como relacionado y la
 * pregunta cuenta como no respondida.
 *
 * Con 0,5: «¿cuándo se entregan las misiones?» encuentra «¿Cuándo son las
 * entregas de las misiones?», pero «¿hay descuento para las misiones?» no se
 * contesta con ella sólo por compartir «misiones».
 */
const COBERTURA_MINIMA = 0.5;

export type Hit = {
  source_id: string;
  kind: "faq" | "documento";
  title: string;
  heading: string;
  content: string;
  coverage: number;
  rank: number;
};

export type AssistantReply = {
  answered: boolean;
  /** La FAQ o el fragmento que responde. */
  answer: { kind: Hit["kind"]; heading: string; content: string } | null;
  /** Otras FAQs parecidas, para preguntarlas con un clic. */
  related: string[];
  sourceIds: string[];
};

/**
 * Los cursos cuyo material puede ver quien pregunta.
 *
 * Replica `has_course_access` de la base: el núcleo común sólo lo abre una
 * matrícula de programa, y un relámpago abre su curso y nada más.
 */
export async function coursesFor(userId: string, role: UserRole): Promise<CourseKey[]> {
  if (role === "administrador" || role === "profesor") return [...ALL_COURSES];

  const { data } = await createAdminClient()
    .from("enrollments")
    .select("course")
    .eq("user_id", userId)
    .eq("active", true);

  const cursos = new Set((data ?? []).map((e) => e.course as CourseKey));
  if (cursos.has("remote-professional") || cursos.has("remote-founder")) cursos.add("core");
  return [...cursos];
}

export async function reply(question: string, cursos: CourseKey[]): Promise<AssistantReply> {
  const { data, error } = await createAdminClient().rpc("search_kb", {
    query: question.slice(0, 500),
    courses: cursos,
    match_count: 6,
  });
  if (error) throw new Error(error.message);

  const hits = (data ?? []) as Hit[];
  const best = hits[0];
  const answered = Boolean(best && best.coverage >= COBERTURA_MINIMA);

  // Sólo FAQs: su título es una pregunta que, al pulsarla, se encuentra a sí
  // misma. El título de un documento no respondería nada concreto.
  const resto = answered ? hits.filter((h) => h.source_id !== best.source_id) : hits;
  const related = [...new Set(resto.filter((h) => h.kind === "faq").map((h) => h.heading))].slice(0, 3);

  return {
    answered,
    answer: answered ? { kind: best.kind, heading: best.heading, content: best.content } : null,
    related,
    sourceIds: answered ? [best.source_id] : [],
  };
}
