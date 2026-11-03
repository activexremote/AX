import nodemailer from "nodemailer";

import { createAdminClient } from "@/lib/supabase/admin";

// ══════════════════════════════════════════════════════════
//  El envío de correos
//
//  Por SMTP con la cuenta de Google Workspace del equipo
//  (admin@activexremote.com) y una contraseña de aplicación. Los correos
//  salen de un buzón de verdad: quedan en «Enviados» y las respuestas llegan
//  a esa bandeja, que es lo que se quiere con un grupo pequeño de invitados.
//  Google deja unos 2.000 envíos al día por cuenta.
//
//  La configuración vive en `mail_settings` y se cambia desde el panel. La
//  contraseña no sale nunca del servidor: el panel sólo ve sus cuatro
//  últimos caracteres.
// ══════════════════════════════════════════════════════════

export type MailSettings = {
  enabled: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string | null;
  smtp_pass: string | null;
  from_name: string;
  from_email: string | null;
  reply_to: string | null;
};

export async function getMailSettings(): Promise<MailSettings | null> {
  const { data } = await createAdminClient().from("mail_settings").select("*").eq("id", true).maybeSingle();
  return (data as MailSettings | null) ?? null;
}

export const correoListo = (s: MailSettings | null): s is MailSettings & { smtp_user: string; smtp_pass: string } =>
  Boolean(s?.enabled && s.smtp_user && s.smtp_pass);

export type Mensaje = {
  to: string;
  toName?: string | null;
  subject: string;
  html: string;
  text: string;
  /** Enlace de baja: va en la cabecera List-Unsubscribe, que Gmail enseña como botón. */
  unsubscribeUrl?: string;
};

export type ResultadoEnvio = { ok: true; id: string } | { ok: false; error: string };

export async function enviarCorreo(m: Mensaje, ajustes?: MailSettings | null): Promise<ResultadoEnvio> {
  const s = ajustes === undefined ? await getMailSettings() : ajustes;
  if (!correoListo(s)) return { ok: false, error: "El envío de correo no está configurado." };

  const transporte = nodemailer.createTransport({
    host: s.smtp_host,
    port: s.smtp_port,
    secure: s.smtp_port === 465,
    auth: { user: s.smtp_user, pass: s.smtp_pass },
  });

  try {
    const info = await transporte.sendMail({
      from: { name: s.from_name, address: s.from_email || s.smtp_user },
      to: m.toName ? { name: m.toName, address: m.to } : m.to,
      replyTo: s.reply_to || undefined,
      subject: m.subject,
      html: m.html,
      text: m.text,
      headers: m.unsubscribeUrl ? { "List-Unsubscribe": `<${m.unsubscribeUrl}>` } : undefined,
    });
    return { ok: true, id: info.messageId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo enviar." };
  } finally {
    transporte.close();
  }
}
