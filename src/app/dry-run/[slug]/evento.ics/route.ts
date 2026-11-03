import { NextResponse, type NextRequest } from "next/server";

import { getSesionPublica } from "@/lib/dry-run/datos";
import { sello } from "@/lib/dry-run/tiempo";
import { SITE_URL } from "@/lib/seo";

// GET /dry-run/<slug>/evento.ics — la sesión para Outlook y Apple Calendar.

/** Escapado de texto de iCalendar (RFC 5545 §3.3.11). */
const ics = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sesion = await getSesionPublica(slug);
  if (!sesion) return new NextResponse("No existe", { status: 404 });
  const { run } = sesion;

  const descripcion = [
    `Clase de prueba de ActiveXRemote con ${run.teacher_name}.`,
    run.meet_url ? `Enlace de la clase: ${run.meet_url}` : "El enlace de la clase se publica en Google Classroom.",
    run.classroom_url ? `Google Classroom: ${run.classroom_url}` : null,
    `Tu preparación: ${SITE_URL}/preparacion`,
  ]
    .filter(Boolean)
    .join("\n");

  const cuerpo = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ActiveXRemote//Dry run//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:dry-run-${run.id}@activexremote.com`,
    `DTSTAMP:${sello(new Date())}`,
    `DTSTART:${sello(run.starts_at)}`,
    `DTEND:${sello(run.ends_at)}`,
    `SUMMARY:${ics(`ActiveXRemote · ${run.title}`)}`,
    `DESCRIPTION:${ics(descripcion)}`,
    `LOCATION:${ics(run.meet_url || run.classroom_url || "Online")}`,
    `URL:${SITE_URL}/preparacion`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Empieza el dry run",
    "TRIGGER:-PT30M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new NextResponse(cuerpo, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="activexremote-${run.slug}.ics"`,
      "cache-control": "no-store",
    },
  });
}
