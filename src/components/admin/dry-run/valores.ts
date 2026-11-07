import type { ValoresSesion } from "@/components/admin/dry-run/form-sesion";
import { aCampoLocal } from "@/lib/dry-run/tiempo";
import type { DryRun, DryRunLink } from "@/lib/dry-run/tipos";
import { LINK_URL } from "@/lib/seo";

/** Los valores del formulario de la sesión a partir de su fila (fechas en hora de Madrid). */
export function valoresDe(r: DryRun): ValoresSesion {
  return {
    title: r.title,
    slug: r.slug,
    module_id: r.module_id,
    starts_at: aCampoLocal(r.starts_at),
    ends_at: aCampoLocal(r.ends_at),
    teacher_name: r.teacher_name,
    classroom_url: r.classroom_url ?? "",
    classroom_code: r.classroom_code ?? "",
    meet_url: r.meet_url ?? "",
    agenda: r.agenda,
    capacity: r.capacity ? String(r.capacity) : "",
    access_until: aCampoLocal(r.access_until),
    registration_open: r.registration_open,
  };
}

/** La dirección completa de un enlace de invitación, con su ref y sus utm. */
export function urlDeEnlace(slug: string, l: Pick<DryRunLink, "code" | "utm_source" | "utm_medium" | "utm_campaign" | "utm_content" | "utm_term">) {
  const u = new URL(`/dry-run/${slug}`, LINK_URL);
  u.searchParams.set("ref", l.code);
  u.searchParams.set("utm_source", l.utm_source);
  u.searchParams.set("utm_medium", l.utm_medium);
  u.searchParams.set("utm_campaign", l.utm_campaign);
  if (l.utm_content) u.searchParams.set("utm_content", l.utm_content);
  if (l.utm_term) u.searchParams.set("utm_term", l.utm_term);
  return u.toString();
}
