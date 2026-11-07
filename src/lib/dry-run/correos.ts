import { leerAgenda, type DryRun, type DryRunGuest } from "@/lib/dry-run/tipos";
import { cuandoEs, diaLargo, horaMadrid, sello } from "@/lib/dry-run/tiempo";
import { SITE_URL } from "@/lib/seo";

// ══════════════════════════════════════════════════════════
//  Los correos del dry run
//
//  Cada correo es una lista de bloques (párrafo, lista, pasos, datos, botón…)
//  que se pintan dos veces: en HTML de correo —tablas y estilos en línea,
//  lo único que entienden Gmail y Outlook— y en texto plano, que va en el
//  mismo envío para los clientes que no pintan HTML y para los filtros de
//  spam, que desconfían de un correo sin él.
//
//  El aspecto es el de los correos de acceso de Supabase (supabase/emails):
//  tarjeta blanca con borde de tinta y sombra dura, un solo botón verde.
//  Texto con **negrita** permitido; nada más.
// ══════════════════════════════════════════════════════════

export type TipoCorreo =
  | "invitacion"
  | "invitacion_recordatorio"
  | "bienvenida"
  | "tour"
  | "preparacion"
  | "checklist"
  | "manana"
  | "una_hora"
  | "gracias"
  | "feedback";

type Bloque =
  | { t: "p"; texto: string }
  | { t: "h"; texto: string }
  | { t: "lista"; items: string[] }
  | { t: "checks"; items: string[] }
  | { t: "pasos"; items: { titulo: string; texto: string }[] }
  | { t: "datos"; filas: [string, string][] }
  | { t: "agenda"; filas: { hora: string; que: string }[] }
  | { t: "boton"; texto: string; url: string }
  | { t: "enlaces"; items: { texto: string; url: string }[] }
  | { t: "nota"; texto: string };

export type Contexto = {
  run: DryRun;
  guest: Pick<DryRunGuest, "full_name" | "email" | "token">;
  modulo: { title: string; slug: string; numero: number; primeraLeccion: string | null };
  /** Las utm del enlace de la invitación (las del enlace elegido, o email/invitacion). */
  invitacion: { ref: string; source: string; medium: string; campaign: string; content?: string | null };
};

export type Correo = { asunto: string; preheader: string; html: string; texto: string };

// ── Enlaces ──────────────────────────────────────────────

/** Las utm de los correos de seguimiento: se sabe qué correo trajo cada visita. */
function conUtm(url: string, run: DryRun, kind: TipoCorreo) {
  const u = new URL(url, SITE_URL);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "dry-run");
  u.searchParams.set("utm_campaign", run.slug);
  u.searchParams.set("utm_content", kind);
  return u.toString();
}

export function enlaceLanding(ctx: Pick<Contexto, "run" | "guest" | "invitacion">) {
  const u = new URL(`/dry-run/${ctx.run.slug}`, SITE_URL);
  u.searchParams.set("ref", ctx.invitacion.ref);
  u.searchParams.set("inv", ctx.guest.token);
  u.searchParams.set("utm_source", ctx.invitacion.source);
  u.searchParams.set("utm_medium", ctx.invitacion.medium);
  u.searchParams.set("utm_campaign", ctx.invitacion.campaign);
  if (ctx.invitacion.content) u.searchParams.set("utm_content", ctx.invitacion.content);
  return u.toString();
}

export function enlaceGoogleCalendar(run: DryRun) {
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", `ActiveXRemote · ${run.title}`);
  u.searchParams.set("dates", `${sello(run.starts_at)}/${sello(run.ends_at)}`);
  u.searchParams.set("ctz", "Europe/Madrid");
  u.searchParams.set(
    "details",
    [
      `Clase de prueba con ${run.teacher_name}.`,
      run.meet_url ? `Enlace de la clase: ${run.meet_url}` : null,
      run.classroom_url ? `Google Classroom: ${run.classroom_url}` : null,
      `Tu preparación: ${SITE_URL}/preparacion`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  u.searchParams.set("location", run.meet_url || run.classroom_url || "Online");
  return u.toString();
}

export const enlaceIcs = (run: DryRun) => `${SITE_URL}/dry-run/${run.slug}/evento.ics`;
export const enlaceBaja = (token: string) => `${SITE_URL}/dry-run/baja?t=${token}`;

// ── Pintado ──────────────────────────────────────────────

const FUENTE = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";
const TINTA = "#161616";
const GRIS = "#525252";
const SUAVE = "#6f6f6f";
const VERDE = "#038632";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fuerte = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, `<strong style="color:${TINTA};">$1</strong>`);
const plano = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1");

function bloqueHtml(b: Bloque): string {
  const p = `margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${GRIS};`;
  switch (b.t) {
    case "p":
      return `<p style="${p}">${fuerte(b.texto)}</p>`;
    case "h":
      return `<h2 style="margin:28px 0 10px 0;font-size:16px;line-height:1.3;font-weight:700;color:${TINTA};">${fuerte(b.texto)}</h2>`;
    case "nota":
      return `<p style="margin:0 0 16px 0;font-size:13px;line-height:1.55;color:${SUAVE};">${fuerte(b.texto)}</p>`;
    case "lista":
    case "checks": {
      const marca = b.t === "checks" ? "&#9744;" : "&#9632;";
      const filas = b.items
        .map(
          (i) =>
            `<tr><td valign="top" style="padding:0 10px 10px 0;font-size:${b.t === "checks" ? 16 : 9}px;line-height:${b.t === "checks" ? "22px" : "24px"};color:${b.t === "checks" ? TINTA : VERDE};">${marca}</td><td style="padding:0 0 10px 0;font-size:15px;line-height:1.55;color:${GRIS};">${fuerte(i)}</td></tr>`,
        )
        .join("");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">${filas}</table>`;
    }
    case "pasos": {
      const filas = b.items
        .map(
          (i, n) =>
            `<tr><td valign="top" style="padding:0 12px 14px 0;"><div style="width:24px;height:24px;line-height:24px;text-align:center;background-color:${TINTA};color:#ffffff;font-size:12px;font-weight:700;">${n + 1}</div></td><td style="padding:0 0 14px 0;font-size:15px;line-height:1.55;color:${GRIS};"><strong style="color:${TINTA};">${esc(i.titulo)}</strong><br>${fuerte(i.texto)}</td></tr>`,
        )
        .join("");
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px 0;">${filas}</table>`;
    }
    case "datos":
    case "agenda": {
      const filas = (b.t === "datos" ? b.filas.map(([k, v]) => ({ k, v })) : b.filas.map((f) => ({ k: f.hora, v: f.que })))
        .map(
          (f, i, todas) =>
            `<tr><td valign="top" style="padding:10px 14px;${i < todas.length - 1 ? "border-bottom:1px solid #e0e0e0;" : ""}font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:${SUAVE};white-space:nowrap;width:1%;">${esc(f.k)}</td><td style="padding:10px 14px;${i < todas.length - 1 ? "border-bottom:1px solid #e0e0e0;" : ""}font-size:14px;line-height:1.5;color:${TINTA};">${fuerte(f.v)}</td></tr>`,
        )
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;border:1px solid ${TINTA};">${filas}</table>`;
    }
    case "boton":
      // Tabla, no <a> con padding, para que Outlook lo pinte entero.
      return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 20px 0;"><tr><td bgcolor="${VERDE}" style="background-color:${VERDE};"><a href="${esc(b.url)}" style="display:block;padding:16px 20px;font-family:${FUENTE};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${esc(b.texto)} &nbsp;&rarr;</a></td></tr></table>`;
    case "enlaces":
      return `<p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:${GRIS};">${b.items
        .map((l) => `<a href="${esc(l.url)}" style="color:${TINTA};text-decoration:underline;">${esc(l.texto)}</a>`)
        .join(" &nbsp;·&nbsp; ")}</p>`;
  }
}

function bloqueTexto(b: Bloque): string {
  switch (b.t) {
    case "p":
    case "nota":
      return plano(b.texto);
    case "h":
      return plano(b.texto).toUpperCase();
    case "lista":
      return b.items.map((i) => `- ${plano(i)}`).join("\n");
    case "checks":
      return b.items.map((i) => `[ ] ${plano(i)}`).join("\n");
    case "pasos":
      return b.items.map((i, n) => `${n + 1}. ${i.titulo}: ${plano(i.texto)}`).join("\n");
    case "datos":
      return b.filas.map(([k, v]) => `${k}: ${plano(v)}`).join("\n");
    case "agenda":
      return b.filas.map((f) => `${f.hora ? `${f.hora}  ` : ""}${plano(f.que)}`).join("\n");
    case "boton":
      return `${b.texto}: ${b.url}`;
    case "enlaces":
      return b.items.map((l) => `${l.texto}: ${l.url}`).join("\n");
  }
}

function pintar(ctx: Contexto, asunto: string, preheader: string, titulo: string, bloques: Bloque[]): Correo {
  const baja = enlaceBaja(ctx.guest.token);
  const cuerpo = bloques.map(bloqueHtml).join("\n");
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(asunto)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;">
<div style="display:none;font-size:1px;color:#f4f4f4;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;">
<tr><td style="background-color:${TINTA};padding:0 6px 6px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid ${TINTA};">
<tr><td style="border-bottom:1px solid ${TINTA};padding:10px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font-family:${FUENTE};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${GRIS};">&#9632;&nbsp; Dry run / Módulo ${ctx.modulo.numero}</td>
<td align="right" style="font-family:${FUENTE};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SUAVE};">${esc(diaLargo(ctx.run.starts_at).replace(/^[^,]+, /, ""))}</td>
</tr></table>
</td></tr>
<tr><td style="padding:36px 40px 28px 40px;font-family:${FUENTE};">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr>
<td style="padding-right:12px;" valign="middle"><img src="${SITE_URL}/email/logo-axr.png" width="46" height="28" alt="ActiveXRemote" style="display:block;border:0;outline:none;width:46px;height:28px;"></td>
<td valign="middle" style="font-family:${FUENTE};"><div style="font-size:15px;font-weight:700;letter-spacing:0.14em;color:${TINTA};">ACTIVEXREMOTE</div><div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SUAVE};padding-top:2px;">The Remote Business School</div></td>
</tr></table>
<h1 style="margin:0 0 16px 0;font-size:26px;line-height:1.2;font-weight:700;color:${TINTA};">${esc(titulo)}</h1>
${cuerpo}
<div style="height:1px;line-height:1px;font-size:0;background-color:#e0e0e0;margin:24px 0 18px 0;">&nbsp;</div>
<p style="margin:0 0 4px 0;font-size:14px;line-height:1.5;color:${TINTA};font-weight:700;">Admin Team · ActiveXRemote</p>
<p style="margin:0;font-size:13px;line-height:1.55;color:${SUAVE};">¿Alguna duda? Responde a este correo: lo lee una persona del equipo.</p>
</td></tr>
<tr><td style="border-top:1px solid ${TINTA};padding:10px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font-family:${FUENTE};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SUAVE};">ActiveXRemote Campus</td>
<td align="right" style="font-family:${FUENTE};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${SUAVE};">activexremote.com</td>
</tr></table>
</td></tr>
</table>
</td></tr>
</table>
<p style="margin:20px 0 0 0;font-family:${FUENTE};font-size:11px;line-height:1.5;color:#8d8d8d;max-width:560px;">Recibes este correo en ${esc(ctx.guest.email ?? "")} por el dry run de ActiveXRemote. <a href="${esc(baja)}" style="color:#8d8d8d;text-decoration:underline;">No quiero recibir más correos de este dry run</a>.</p>
</td></tr>
</table>
</body>
</html>`;

  const texto = [
    titulo,
    "",
    bloques.map(bloqueTexto).join("\n\n"),
    "",
    "—",
    "Admin Team · ActiveXRemote",
    "¿Alguna duda? Responde a este correo: lo lee una persona del equipo.",
    "",
    `Darte de baja de los correos de este dry run: ${baja}`,
  ].join("\n");

  return { asunto, preheader, html, texto };
}

// ── Contenido ────────────────────────────────────────────

const nombre = (g: Contexto["guest"]) => g.full_name?.trim().split(/\s+/)[0] || "";
const saludo = (g: Contexto["guest"], resto: string) => (nombre(g) ? `${nombre(g)}, ${resto}` : resto.charAt(0).toUpperCase() + resto.slice(1));

function datosSesion(ctx: Contexto): Bloque {
  const { run, modulo } = ctx;
  return {
    t: "datos",
    filas: [
      ["Cuándo", cuandoEs(run.starts_at, run.ends_at)],
      ["Dónde", "En directo, online. La clase se organiza en Google Classroom"],
      ["Docente", run.teacher_name],
      ["Módulo", modulo.title],
      ["Precio", "Gratis"],
    ],
  };
}

function agenda(ctx: Contexto): Bloque[] {
  const filas = leerAgenda(ctx.run.agenda);
  return filas.length ? [{ t: "h", texto: "La agenda del día" }, { t: "agenda", filas }] : [];
}

/** El mejor botón para el día de la clase: la videollamada, si no Classroom, si no la preparación. */
function botonClase(ctx: Contexto, kind: TipoCorreo): Bloque {
  if (ctx.run.meet_url) return { t: "boton", texto: "Entrar a la clase", url: ctx.run.meet_url };
  if (ctx.run.classroom_url) return { t: "boton", texto: "Abrir Google Classroom", url: ctx.run.classroom_url };
  return { t: "boton", texto: "Ver mi preparación", url: conUtm("/preparacion", ctx.run, kind) };
}

function classroomLinea(ctx: Contexto): string {
  const codigo = ctx.run.classroom_code ? ` con el código **${ctx.run.classroom_code}**` : "";
  return `Únete a la clase de Google Classroom${codigo}: allí están las plantillas, se entregan las tareas y se publica el enlace de la sesión.`;
}

export function componer(kind: TipoCorreo, ctx: Contexto): Correo {
  const { run, guest, modulo } = ctx;
  const dia = diaLargo(run.starts_at);
  const diaCorto = dia.replace(/^[^,]+, /, "");
  const empieza = horaMadrid(run.starts_at);
  const leccion = modulo.primeraLeccion ? `/lecciones/${modulo.primeraLeccion}` : `/modulos/${modulo.slug}`;

  switch (kind) {
    case "invitacion":
      return pintar(ctx, `Te invitamos al dry run del Módulo ${modulo.numero} · ${dia}`, `Una clase de prueba gratuita de ActiveXRemote con ${run.teacher_name}. Plazas limitadas.`, saludo(guest, "te invitamos a probar la primera clase"), [
        { t: "p", texto: "Antes de abrir el programa a todo el mundo vamos a dar el primer módulo en una sesión de prueba —un **dry run**— y queremos que estés en ella." },
        { t: "p", texto: "Es gratis. A cambio te pedimos que vengas, participes y nos digas con sinceridad qué te ha parecido: la dinámica de la clase, el campus y el contenido." },
        datosSesion(ctx),
        { t: "h", texto: "Qué incluye" },
        {
          t: "lista",
          items: [
            `Acceso al campus de ActiveXRemote con todo el módulo **${modulo.title}**: lecciones, audios, plantillas y descargas.`,
            `La clase en directo con ${run.teacher_name}, con ejercicios en grupo.`,
            "Un asistente en el campus que responde dudas sobre el curso y el dry run.",
          ],
        },
        { t: "h", texto: "Qué te pedimos" },
        {
          t: "lista",
          items: [
            "Dedicar una o dos horas antes de la clase al material previo. Te guiamos paso a paso.",
            "Conectarte el día de la clase con cámara y micrófono.",
            "Contarnos al terminar qué te ha parecido, en un formulario de tres minutos.",
          ],
        },
        { t: "boton", texto: "Reservar mi plaza", url: enlaceLanding(ctx) },
        { t: "nota", texto: "Te registras con tu cuenta de Google en un clic. La plaza queda asociada a la cuenta con la que entres." },
      ]);

    case "invitacion_recordatorio":
      return pintar(ctx, `Quedan pocos días para el dry run del ${diaCorto}`, "Todavía tienes plaza: reserva y te da tiempo a ver el material previo con calma.", saludo(guest, "¿te guardamos la plaza?"), [
        { t: "p", texto: `El **${dia}** damos el primer módulo para un grupo reducido y todavía no te has apuntado. Si te apetece venir, resérvala ahora: así te da tiempo a ver el material previo con calma.` },
        datosSesion(ctx),
        { t: "boton", texto: "Reservar mi plaza", url: enlaceLanding(ctx) },
        { t: "nota", texto: "Si no te interesa, no pasa nada: con el enlace del final dejamos de escribirte sobre este dry run." },
      ]);

    case "bienvenida":
      return pintar(ctx, "Tu plaza está confirmada: ya puedes entrar al campus", `Nos vemos el ${dia} a las ${empieza}. Estos son tus primeros pasos.`, saludo(guest, "ya tienes plaza"), [
        { t: "p", texto: `Tu plaza para el dry run está confirmada y ya tienes acceso al campus con el módulo **${modulo.title}** completo.` },
        datosSesion(ctx),
        { t: "h", texto: "Tus primeros pasos (15 minutos)" },
        {
          t: "pasos",
          items: [
            { titulo: "Abre tu página de preparación", texto: "Tienes la lista de lo que conviene hacer antes de la clase y vas marcando lo que terminas." },
            { titulo: "Únete a Google Classroom", texto: classroomLinea(ctx) },
            { titulo: "Guarda la fecha", texto: "Añade la clase a tu calendario con los enlaces de abajo." },
            { titulo: "Empieza por «Antes de la clase»", texto: "Es la primera lección del módulo: el material previo, con el tiempo de cada pieza." },
          ],
        },
        { t: "boton", texto: "Ir a mi preparación", url: conUtm("/preparacion", run, kind) },
        { t: "enlaces", items: [{ texto: "Añadir a Google Calendar", url: enlaceGoogleCalendar(run) }, { texto: "Descargar evento (.ics)", url: enlaceIcs(run) }] },
        { t: "p", texto: "Una cosa importante: **esto es una prueba**. Queremos ver cómo funcionan la clase y el campus con gente real antes de abrir el curso, así que todo lo que notes —lo que funciona y lo que no— nos sirve." },
      ]);

    case "tour":
      return pintar(ctx, "Cómo sacarle partido al campus en diez minutos", "Lecciones, audios, plantillas, tu progreso y el asistente: dónde está cada cosa.", "Una vuelta rápida por el campus", [
        { t: "p", texto: "Para que no pierdas tiempo buscando, esto es lo que vas a encontrar al entrar:" },
        {
          t: "lista",
          items: [
            "**Las lecciones.** Cada una tiene el texto, un audio para escucharla y sus descargas. Al terminar, márcala como completada: tu progreso se guarda solo.",
            "**Antes de la clase.** El material previo, con tiempos orientativos. Si solo tienes una hora: ficha de presentación, Test de Punto de Partida y el estudio sobre la penalización del remoto.",
            "**Las cuatro horas.** Cada «Hora» del módulo cuenta lo que verás en directo, qué traer preparado y la tarea de esa hora.",
            "**Mi progreso.** Cuánto llevas del módulo, de un vistazo.",
            "**El asistente.** El chat de abajo a la derecha. Pregúntale lo que quieras sobre el campus, el dry run o el contenido.",
            "**Google Classroom.** Allí se entregan las tareas y están las plantillas del módulo.",
          ],
        },
        { t: "boton", texto: "Entrar al módulo", url: conUtm(`/modulos/${modulo.slug}`, run, kind) },
      ]);

    case "preparacion":
      return pintar(ctx, "Falta una semana: empieza por el material previo", `El ${dia} damos la clase. Con una hora de preparación llegas sabiendo de qué hablamos.`, "Una semana para la clase", [
        { t: "p", texto: `El **${dia} a las ${empieza}** damos el módulo. Las horas en directo no se usan para explicar teoría, sino para trabajar contigo, así que conviene llegar con el material previo hecho.` },
        { t: "h", texto: "Si solo tienes una hora" },
        {
          t: "lista",
          items: [
            "**Ficha de presentación** (10 min). El docente la lee antes de la clase para llamarte por tu nombre y conectar los ejemplos con tu caso.",
            "**Test de Punto de Partida** (20 min). 26 preguntas sobre tus condiciones para trabajar en remoto. No puntúa: responde por la vida que tienes, no por la que quieres.",
            "**El estudio sobre la penalización del remoto** (20 min). Con el apartado Results basta.",
          ],
        },
        { t: "p", texto: "Si te sobra tiempo: el pódcast con Nick Bloom (30 min), los diez modelos de trabajo remoto (15 min) y el informe State of Global Hiring (15 min). Todo está enlazado en la lección." },
        { t: "boton", texto: "Abrir el material previo", url: conUtm(leccion, run, kind) },
      ]);

    case "checklist":
      return pintar(ctx, `Tu checklist para el ${dia}`, "Classroom, ficha, test, plantillas y equipo: lo que conviene tener listo.", "Checklist para la clase", [
        { t: "p", texto: `Quedan dos días. Repasa esta lista y llegarás al **${dia}** con todo listo:` },
        {
          t: "checks",
          items: [
            run.classroom_code ? `Te has unido a la clase de Google Classroom (código **${run.classroom_code}**).` : "Te has unido a la clase de Google Classroom.",
            "Has enviado tu ficha de presentación y tienes una versión corta para presentarte en 60 segundos.",
            "Tienes el resultado de tu Test de Punto de Partida.",
            "Has descargado la plantilla de la hora 1 (está en la lección «Hora 1»).",
            "Cámara y micrófono funcionan: en la hora 3 hablas delante de tu grupo.",
            "Conexión estable, Chrome o Edge actualizado y un sitio tranquilo.",
          ],
        },
        ...agenda(ctx),
        { t: "boton", texto: "Ver mi preparación", url: conUtm("/preparacion", run, kind) },
      ]);

    case "manana":
      return pintar(ctx, `Mañana a las ${empieza}: dry run del Módulo ${modulo.numero}`, "Conéctate diez minutos antes para probar audio y vídeo con calma.", "Nos vemos mañana", [
        { t: "p", texto: `Mañana, **${dia}, a las ${empieza}** (hora de Madrid), empezamos con ${run.teacher_name}. Conéctate diez minutos antes para probar audio y vídeo con calma.` },
        {
          t: "datos",
          filas: [
            ["Clase", run.meet_url ? run.meet_url : "El enlace se publica en Google Classroom"],
            ...(run.classroom_url ? ([["Classroom", run.classroom_url]] as [string, string][]) : []),
          ],
        },
        ...agenda(ctx),
        { t: "p", texto: "Trae tu ficha de presentación, el resultado del test y las plantillas descargadas. Y ganas de participar: es una clase de trabajo, no de escuchar." },
        botonClase(ctx, kind),
      ]);

    case "una_hora":
      return pintar(ctx, "Empezamos en una hora", `A las ${empieza} abrimos la sesión con ${run.teacher_name}.`, "En una hora empezamos", [
        { t: "p", texto: `A las **${empieza}** abrimos la sesión con ${run.teacher_name}. Ten a mano cámara, micrófono y la plantilla de la hora 1.` },
        botonClase(ctx, kind),
        { t: "nota", texto: "¿Algún problema para entrar? Responde a este correo y te ayudamos." },
      ]);

    case "gracias":
      return pintar(ctx, "Gracias por venir. ¿Nos cuentas qué te ha parecido?", "Tres minutos de feedback que cambian la versión final del curso.", saludo(guest, "gracias por participar"), [
        { t: "p", texto: "Hoy has hecho algo que nos ayuda mucho: probar la clase antes que nadie. Ahora nos falta la otra mitad, **tu opinión sincera**." },
        { t: "p", texto: "Son tres minutos: una nota, cinco valoraciones rápidas y, si quieres, lo que cambiarías. Lo leemos todo, y lo que nos digas cambia la versión final del curso." },
        { t: "boton", texto: "Dejar mi feedback", url: conUtm("/preparacion#feedback", run, kind) },
        {
          t: "p",
          texto: `Sigues teniendo acceso al módulo en el campus${run.access_until ? ` hasta el **${diaLargo(run.access_until)}**` : ""}. Las tareas de la semana se entregan en Google Classroom.`,
        },
      ]);

    case "feedback":
      return pintar(ctx, "¿Nos regalas tres minutos? Tu opinión del dry run", "Nos falta tu feedback de la clase de prueba.", "Nos falta tu opinión", [
        { t: "p", texto: "Todavía no nos has contado qué te pareció la clase. Nos ayuda tanto lo bueno como lo malo: qué te sobró, qué echaste en falta, si el ritmo era el adecuado." },
        { t: "boton", texto: "Dejar mi feedback", url: conUtm("/preparacion#feedback", run, kind) },
        { t: "nota", texto: "Es el último correo que te mandamos sobre esto. Gracias por haber venido." },
      ]);
  }
}
