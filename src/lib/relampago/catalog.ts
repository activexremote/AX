import { WEB_ABC } from "@/lib/relampago/web-abc";
import { missionMinutes, totalMinutes, type FlashCourse } from "@/lib/relampago/types";

// ══════════════════════════════════════════════════════════
//  Registro de cursos relámpago
//
//  Una sola lista. De aquí salen la landing índice, las landings de curso, la
//  sección de la home, el sitemap, el llms.txt y las ofertas de Stripe. Añadir
//  un relámpago nuevo es añadirlo aquí y añadir su clave al enum `course_key`
//  de Supabase; no hay que tocar rutas ni menús.
// ══════════════════════════════════════════════════════════

export const FLASH_COURSES: readonly FlashCourse[] = [WEB_ABC];

export function flashBySlug(slug: string): FlashCourse | undefined {
  return FLASH_COURSES.find((c) => c.slug === slug);
}

export function flashByKey(key: string): FlashCourse | undefined {
  return FLASH_COURSES.find((c) => c.key === key);
}

export function isFlashKey(v: unknown): v is string {
  return typeof v === "string" && FLASH_COURSES.some((c) => c.key === v);
}

/**
 * El que se destaca en la home.
 *
 * Es el primero de la lista y no un campo `destacado: true` porque con un
 * campo se puede marcar ninguno o marcar dos, y entonces la home no sabe qué
 * pintar. El orden de la lista siempre tiene una primera posición.
 */
export function featuredFlash(): FlashCourse {
  return FLASH_COURSES[0];
}

/** Cifras derivadas, para no recalcularlas en cada plantilla. */
export function flashStats(course: FlashCourse) {
  const video = totalMinutes(course);
  return {
    /** "4 h" — se redondea a la media hora, que es como se anuncia. */
    hours: (Math.round((video / 60) * 2) / 2).toFixed(1).replace(".0", "").replace(".", ","),
    videoMinutes: video,
    lessons: course.lessons.length,
    modules: course.modules.length,
    missions: course.lessons.length,
    missionMinutes: missionMinutes(course),
    unlocks: course.unlocks.length,
    questions: course.lessons.length,
  };
}

export type { FlashCourse };
