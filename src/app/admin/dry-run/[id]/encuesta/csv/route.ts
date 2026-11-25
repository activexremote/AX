import { NextResponse, type NextRequest } from "next/server";

import { PREGUNTAS, textoTema, valorLegible } from "@/lib/dry-run/encuesta";
import type { RespuestaEncuesta } from "@/lib/dry-run/encuesta-datos";
import type { InformeEncuesta } from "@/lib/dry-run/encuesta-ia";
import { idInvitado } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /admin/dry-run/<id>/encuesta/csv — las respuestas de la encuesta, una
// fila por persona, con la clasificación de la última lectura con IA.

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
  const [{ data: run }, { data: filas }, { data: guests }, { data: ultimo }] = await Promise.all([
    admin.from("dry_runs").select("slug").eq("id", id).maybeSingle(),
    admin.from("dry_run_surveys").select("*").eq("dry_run_id", id).order("submitted_at"),
    admin.from("dry_run_guests").select("id, seq").eq("dry_run_id", id),
    admin.from("dry_run_survey_reports").select("content").eq("dry_run_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!run) return new NextResponse("No existe", { status: 404 });
  const seqDe = new Map((guests ?? []).map((g) => [g.id as string, g.seq as number]));
  const clasif = new Map(((ultimo?.content as InformeEncuesta | undefined)?.respuestas ?? []).map((c) => [c.id, c]));

  const cabecera = ["invitado", "nombre", "email", "origen", "respondida", ...PREGUNTAS.map((p) => p.k), "ia_sentimiento", "ia_intencion", "ia_temas", "ia_resumen"];
  const lineas = ((filas ?? []) as RespuestaEncuesta[]).map((r) => {
    const c = clasif.get(r.id);
    const seq = r.guest_id ? seqDe.get(r.guest_id) : undefined;
    return [
      seq ? idInvitado(seq) : "fuera de la lista",
      r.full_name,
      r.email,
      r.source,
      r.updated_at,
      // Los números van solos (para poder sumar en la hoja); el resto, con su texto.
      ...PREGUNTAS.map((p) => (typeof r.answers[p.k] === "number" ? r.answers[p.k] : valorLegible(p.k, r.answers[p.k]))),
      c?.sentimiento,
      c?.intencion,
      c?.temas.map(textoTema).join(" + "),
      c?.resumen,
    ];
  });

  // BOM para que Excel lea bien las tildes.
  const csv = "﻿" + [cabecera, ...lineas].map((l) => l.map(celda).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="encuesta-${run.slug}.csv"`,
      "cache-control": "no-store",
    },
  });
}
