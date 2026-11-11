import { redirect } from "next/navigation";

// La entrada del gestor comercial es el material de apoyo (los leads se
// llevan en Zoho).
export default function ComercialPage() {
  redirect("/admin/comercial/material");
}
