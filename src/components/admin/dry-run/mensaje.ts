import { SITE_URL } from "@/lib/seo";

// ══════════════════════════════════════════════════════════
//  La invitación personal de la tabla de invitados
//
//  Cada fila tiene su enlace: el de la sesión con el token del invitado (así
//  la reserva cae en su fila aunque entre con otra cuenta de Google) y unas
//  utm que dicen por dónde se mandó, quién y a quién. El mensaje se compone
//  con la plantilla de la sesión y se copia, o se abre ya escrito en WhatsApp
//  o en el correo.
// ══════════════════════════════════════════════════════════

export type Via = "whatsapp" | "email" | "directo";

/** Lo que la plantilla necesita de la sesión, ya en texto. */
export type DatosMensaje = {
  slug: string;
  fecha: string;
  horario: string;
  docente: string;
  modulo: string;
};

export const MARCAS = ["nombre", "invitador", "fecha", "horario", "docente", "modulo", "enlace"] as const;

export const MENSAJE_POR_DEFECTO = `¡Hola, {nombre}! 👋

Soy {invitador}, de ActiveXRemote. El {fecha} hacemos un dry run gratuito de «{modulo}»: una clase en directo de {horario} (hora de Madrid) con {docente}, y me encantaría que vinieras.

No cuesta nada: solo te pedimos que participes y nos des tu opinión sincera al terminar.

Reserva tu plaza aquí, con tu cuenta de Google (es un minuto):
{enlace}

¡Te esperamos!`;

const aCodigo = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export function enlacePersonal(slug: string, g: { token: string; seq: number; inviter: string | null }, via: Via) {
  const u = new URL(`/dry-run/${slug}`, SITE_URL);
  u.searchParams.set("inv", g.token);
  u.searchParams.set("utm_source", via);
  u.searchParams.set("utm_medium", "invitacion_personal");
  u.searchParams.set("utm_campaign", slug.replace(/-/g, "_"));
  u.searchParams.set("utm_content", `alu_${String(g.seq).padStart(3, "0")}`);
  if (g.inviter) u.searchParams.set("utm_term", aCodigo(g.inviter));
  return u.toString();
}

export function componerMensaje(
  plantilla: string | null | undefined,
  datos: DatosMensaje,
  g: { token: string; seq: number; inviter: string | null; full_name: string | null },
  via: Via,
) {
  const valores: Record<(typeof MARCAS)[number], string> = {
    nombre: g.full_name?.trim().split(/\s+/)[0] || "",
    invitador: g.inviter?.trim() || "el equipo",
    fecha: datos.fecha,
    horario: datos.horario,
    docente: datos.docente,
    modulo: datos.modulo,
    enlace: enlacePersonal(datos.slug, g, via),
  };
  const texto = (plantilla?.trim() || MENSAJE_POR_DEFECTO).replace(/\{(\w+)\}/g, (m, k: string) =>
    k in valores ? valores[k as keyof typeof valores] : m,
  );
  // Sin nombre, «¡Hola, !» queda raro: se quita la coma suelta.
  return texto.replace(/,\s*([!.?])/g, "$1");
}

/** Para wa.me: sólo dígitos, con el prefijo del país y sin el 00. */
export function telefonoWhatsApp(tel: string | null | undefined) {
  const d = (tel ?? "").replace(/\D/g, "").replace(/^00/, "");
  return d.length >= 8 ? d : null;
}

export const urlWhatsApp = (tel: string, texto: string) => `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;

export const urlCorreo = (email: string, asunto: string, texto: string) =>
  `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;
