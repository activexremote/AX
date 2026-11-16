import "server-only";

import { enviarCorreo, type ResultadoEnvio } from "@/lib/correo/envio";
import { LINK_URL } from "@/lib/seo";

// ══════════════════════════════════════════════════════════
//  «Tu profesor ha corregido…»
//
//  El correo que recibe el alumno cuando le corrigen una tarea: qué
//  actividad, si está aprobada o hay que rehacerla, la nota, el comentario
//  y el botón a la lección. Mismo aspecto que los correos del dry run.
// ══════════════════════════════════════════════════════════

const FUENTE = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
const TINTA = "#161616";
const GRIS = "#525252";
const SUAVE = "#6f6f6f";
const VERDE = "#038632";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type AvisoCorreccion = {
  to: string;
  nombre: string | null;
  actividad: string;
  leccion: string;
  devuelta: boolean;
  nota: number | null;
  rubrica: { criterio: string; nivel: number; texto: string }[];
  comentario: string | null;
  profesor: string | null;
  url: string;
};

export async function enviarAvisoCorreccion(a: AvisoCorreccion): Promise<ResultadoEnvio> {
  const nota = a.nota !== null ? `${String(a.nota).replace(".", ",")}/10` : null;
  const saludo = a.nombre ? `Hola, ${a.nombre.split(" ")[0]}:` : "Hola:";
  const titulo = a.devuelta ? "Tienes una tarea para rehacer" : "Tu tarea ya está corregida";
  const lead = a.devuelta
    ? `${a.profesor ?? "Tu profesor"} ha revisado «${a.actividad}» y te pide que la rehagas. Abajo tienes su comentario.`
    : `${a.profesor ?? "Tu profesor"} ha corregido «${a.actividad}».`;
  const asunto = `ActiveXRemote · ${a.devuelta ? "Para rehacer" : "Corregida"}: ${a.actividad}${nota && !a.devuelta ? ` (${nota})` : ""}`;
  const url = new URL(a.url, LINK_URL).toString();

  const filas: [string, string][] = [
    ["Actividad", a.actividad],
    ["Lección", a.leccion],
    ["Estado", a.devuelta ? "Para rehacer" : "Corregida"],
    ...(nota ? ([["Nota", nota]] as [string, string][]) : []),
    ...a.rubrica.map((r) => [r.criterio, `${r.nivel}/4 · ${r.texto}`] as [string, string]),
  ];
  const tabla = filas
    .map(
      ([k, v], i) =>
        `<tr><td valign="top" style="padding:10px 14px;${i < filas.length - 1 ? "border-bottom:1px solid #e0e0e0;" : ""}font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:${SUAVE};white-space:nowrap;width:1%;">${esc(k)}</td><td style="padding:10px 14px;${i < filas.length - 1 ? "border-bottom:1px solid #e0e0e0;" : ""}font-size:14px;line-height:1.5;color:${TINTA};">${esc(v)}</td></tr>`,
    )
    .join("");
  const comentario = a.comentario
    ? `<h2 style="margin:24px 0 10px 0;font-size:16px;font-weight:700;color:${TINTA};">El comentario de tu profesor</h2><p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${GRIS};white-space:pre-line;">${esc(a.comentario)}</p>`
    : "";

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(asunto)}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;"><tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;"><tr><td style="background-color:${TINTA};padding:0 6px 6px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid ${TINTA};">
<tr><td style="padding:36px 40px 28px 40px;font-family:${FUENTE};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr>
<td style="padding-right:12px;" valign="middle"><img src="${LINK_URL}/email/logo-axr.png" width="46" height="28" alt="ActiveXRemote" style="display:block;border:0;width:46px;height:28px;"></td>
<td valign="middle"><div style="font-size:15px;font-weight:700;letter-spacing:0.14em;color:${TINTA};">ACTIVEXREMOTE</div><div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SUAVE};padding-top:2px;">The Remote Business School</div></td>
</tr></table>
<h1 style="margin:0 0 16px 0;font-size:26px;line-height:1.2;font-weight:700;color:${TINTA};">${esc(titulo)}</h1>
<p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${GRIS};">${esc(saludo)}</p>
<p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:${GRIS};">${esc(lead)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;border:1px solid ${TINTA};">${tabla}</table>
${comentario}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:16px 0 20px 0;"><tr><td bgcolor="${VERDE}" style="background-color:${VERDE};"><a href="${esc(url)}" style="display:block;padding:16px 20px;font-family:${FUENTE};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${a.devuelta ? "Rehacer la tarea" : "Ver la corrección en el campus"} &nbsp;&rarr;</a></td></tr></table>
<div style="height:1px;line-height:1px;font-size:0;background-color:#e0e0e0;margin:24px 0 18px 0;">&nbsp;</div>
<p style="margin:0 0 4px 0;font-size:14px;color:${TINTA};font-weight:700;">ActiveXRemote</p>
<p style="margin:0;font-size:13px;line-height:1.55;color:${SUAVE};">¿Dudas sobre la corrección? Responde a este correo.</p>
</td></tr></table>
</td></tr></table>
</td></tr></table>
</body></html>`;

  const texto = [
    titulo,
    "",
    saludo,
    lead,
    "",
    ...filas.map(([k, v]) => `${k}: ${v}`),
    ...(a.comentario ? ["", "El comentario de tu profesor:", a.comentario] : []),
    "",
    `${a.devuelta ? "Rehacer la tarea" : "Ver la corrección"}: ${url}`,
    "",
    "—",
    "ActiveXRemote · ¿Dudas sobre la corrección? Responde a este correo.",
  ].join("\n");

  return enviarCorreo({ to: a.to, toName: a.nombre, subject: asunto, html, text: texto });
}
