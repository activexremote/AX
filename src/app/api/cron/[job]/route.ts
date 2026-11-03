import { NextResponse, type NextRequest } from "next/server";

import {
  runAssignmentReminders,
  runStudentProgressDigest,
  runTeacherComplianceDigest,
} from "@/lib/slack/digests";
import { procesarCola } from "@/lib/dry-run/cola";

// Endpoints de cron protegidos por CRON_SECRET.
// Uso:  GET /api/cron/<job>   con  Authorization: Bearer <CRON_SECRET>
//       o  ?secret=<CRON_SECRET>
// Jobs: reminders | digest-students | digest-teachers | correos | all
//
// «correos» manda la cola de correos de los dry run. No está en vercel.json:
// lo llama pg_cron cada cinco minutos (migración 0031), que es más a menudo
// de lo que dejan los crons de Vercel.

export const maxDuration = 120;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ job: string }> },
) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET no configurado" }, { status: 500 });
  }

  const auth = request.headers.get("authorization");
  const qsSecret = request.nextUrl.searchParams.get("secret");
  const provided = auth?.startsWith("Bearer ") ? auth.slice(7) : qsSecret;
  if (provided !== secret) {
    return NextResponse.json({ error: "no autorizado" }, { status: 401 });
  }

  const { job } = await params;
  const result: Record<string, unknown> = { job };

  try {
    if (job === "reminders" || job === "all") {
      result.reminders = await runAssignmentReminders();
    }
    if (job === "digest-students" || job === "all") {
      result.studentDigest = await runStudentProgressDigest();
    }
    if (job === "digest-teachers" || job === "all") {
      result.teacherDigest = await runTeacherComplianceDigest();
    }
    if (job === "correos" || job === "all") {
      result.correos = await procesarCola();
    }
    if (Object.keys(result).length === 1) {
      return NextResponse.json({ error: `job desconocido: ${job}` }, { status: 400 });
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 500 },
    );
  }
}
