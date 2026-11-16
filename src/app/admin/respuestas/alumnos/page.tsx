import { redirect } from "next/navigation";

// La lista de alumnos es una pestaña de Respuestas.
export default function AlumnosPage() {
  redirect("/admin/respuestas");
}
