import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { Enrollment } from "@/lib/supabase/types";

/**
 * Matrículas activas de quien está dentro.
 *
 * El filtrado real de contenido lo hace la base de datos (`has_course_access`
 * en las políticas de modules y lessons), no esta función: si el acceso
 * dependiera de una comprobación en la aplicación, bastaría con una consulta
 * que se dejara el filtro para leer un curso sin pagarlo. Esto es sólo para
 * que la interfaz sepa qué contar.
 */
export const getMyEnrollments = cache(async (): Promise<Enrollment[]> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("active", true);

  return (data ?? []) as Enrollment[];
});
