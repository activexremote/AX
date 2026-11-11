import { redirect } from "next/navigation";

// La entrada del gestor comercial es la lista de leads.
export default function ComercialPage() {
  redirect("/admin/comercial/leads");
}
