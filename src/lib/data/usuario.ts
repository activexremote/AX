import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Quién está dentro, una sola vez por petición.
 *
 * Antes cada cargador de datos (perfil, matrículas, progreso, tareas…) hacía
 * su propio `auth.getUser()`, que es una llamada de red al servidor de
 * Supabase: una página del campus pagaba tres o cuatro idas y vueltas sólo
 * para saber quién era la misma persona.
 *
 * `getClaims()` verifica la firma del token (con las claves públicas del
 * proyecto, que se guardan en memoria) sin preguntar a nadie; si el proyecto
 * firmase con clave simétrica, la propia librería cae a `getUser()`. La
 * sesión ya la ha refrescado el proxy antes de llegar aquí. Y `cache` hace que
 * todo el árbol de la petición comparta el resultado.
 *
 * Sólo da el id: es lo único que necesitan las consultas. Las acciones que
 * cambian datos siguen usando `getUser()`.
 */
export const usuarioActual = cache(async (): Promise<{ id: string } | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims?.sub;
  return typeof id === "string" && id ? { id } : null;
});
