import type { CourseKey } from "@/lib/supabase/types";

/**
 * Los cursos a los que se puede asignar un contenido del asistente.
 *
 * Aparte de knowledge.ts para que el formulario del panel, que es de cliente,
 * no arrastre el SDK de OpenAI al navegador.
 */
export const ALL_COURSES: readonly CourseKey[] = ["core", "remote-professional", "remote-founder", "web-abc"];
