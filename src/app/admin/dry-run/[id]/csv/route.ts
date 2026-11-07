import { NextResponse, type NextRequest } from "next/server";

import { PASOS } from "@/lib/dry-run/preparacion";
import { idInvitado, type DryRunGuest, type DryRunLink } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /admin/dry-run/<id>/csv — la tabla de invitados con su origen, su
// preparación y su feedback, para abrir en una hoja de cálculo.

const celda = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  // Las fórmulas no se ejecutan al abrir el CSV (=, +, -, @ al principio).
  const seguro = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n;]/.test(seguro) ? `"${seguro.replace(/"/g, '""')}"` : seguro;
};

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") return new NextResponse("No autorizado", { status: 403 });
  const { id } = await params;

  const admin = createAdminClient();
  const [{ data: run }, { data: guests }, { data: links }] = await Promise.all([
    admin.from("dry_runs").select("slug").eq("id", id).maybeSingle(),
    admin.from("dry_run_guests").select("*").eq("dry_run_id", id).order("seq"),
    admin.from("dry_run_links").select("*").eq("dry_run_id", id),
  ]);
  if (!run) return new NextResponse("No existe", { status: 404 });
  const linkDe = new Map(((links ?? []) as DryRunLink[]).map((l) => [l.id, l]));

  const cabecera = [
    "id", "nombre", "email", "telefono", "pais", "invitador", "seguimiento", "perfil", "notas",
    "invitacion_enviada", "enviada_por", "visitas", "ultima_visita", "estado", "enlace", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "invitado", "apuntado", "preparacion", ...PASOS.map((p) => `paso_${p.key}`),
    "nps", "clase", "ritmo", "contenido", "docente", "campus", "lo_haria", "lo_que_sirvio", "cambiaria", "comentario", "sin_correos",
  ];
  const filas = ((guests ?? []) as DryRunGuest[]).map((g) => {
    const l = g.link_id ? linkDe.get(g.link_id) : null;
    const f = g.feedback;
    return [
      idInvitado(g.seq), g.full_name, g.email, g.phone, g.country, g.inviter, g.tracking, g.profile, g.notes,
      g.shared_at, g.shared_via, g.visits, g.last_visit_at, g.status, l?.label,
      g.utm?.source ?? l?.utm_source, g.utm?.medium ?? l?.utm_medium, g.utm?.campaign ?? l?.utm_campaign, g.utm?.content ?? l?.utm_content, g.utm?.term ?? l?.utm_term,
      g.invited_at, g.registered_at, PASOS.filter((p) => g.onboarding?.[p.key]).length, ...PASOS.map((p) => (g.onboarding?.[p.key] ? 1 : 0)),
      f?.nps, f?.clase, f?.ritmo, f?.contenido, f?.docente, f?.campus, f?.pagaria, f?.gusto, f?.cambiaria, f?.comentario, g.unsubscribed_at ? 1 : 0,
    ];
  });

  // BOM para que Excel lea bien las tildes.
  const csv = "﻿" + [cabecera, ...filas].map((r) => r.map(celda).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="dry-run-${run.slug}.csv"`,
      "cache-control": "no-store",
    },
  });
}
