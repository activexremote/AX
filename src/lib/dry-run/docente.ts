import { TEACHERS, type Teacher } from "@/app/trabajo-remoto/faculty";

/**
 * La ficha pública de quien da la sesión, a partir del nombre que se puso en
 * el panel («Isaac» o «Isaac R. Betanzos»). null si no hay ficha: entonces
 * sólo se enseña el nombre, sin foto ni biografía inventadas.
 */
export function docenteDe(nombre: string): Teacher | null {
  const n = nombre.trim().toLowerCase();
  if (!n) return null;
  return TEACHERS.find((t) => t.name.toLowerCase() === n || t.name.toLowerCase().split(/\s+/)[0] === n.split(/\s+/)[0]) ?? null;
}
