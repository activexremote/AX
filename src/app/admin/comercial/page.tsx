import { redirect } from "next/navigation";

// La entrada del gestor comercial es el perfilado de los leads de Zoho.
export default function ComercialPage() {
  redirect("/admin/comercial/leads");
}
