// Plantillas de correo de Supabase con la marca del campus.
//
//   node scripts/build-emails.mjs
//
// Se generan desde un único armazón para que las tres no se separen con el
// tiempo: lo que cambia de una a otra es el titular, el párrafo y el texto
// del botón, nunca la caja. El resultado va a supabase/emails/*.html y se
// pega tal cual en Authentication → Emails del panel de Supabase.
//
// Reglas de correo, que no son las de la web:
//   · Todo en tablas y con estilos en línea. Gmail tira el <style> del <head>
//     en la vista móvil y Outlook renderiza con el motor de Word.
//   · Nada de SVG: el símbolo ΔX viaja como PNG alojado en el sitio
//     (scripts/build-email-logo.mjs).
//   · La imagen puede estar bloqueada: si sólo se ven las palabras, el correo
//     tiene que seguir entendiéndose y el botón seguir siendo pulsable.
//   · Colores explícitos en cada celda, para que el modo oscuro de algunos
//     clientes no repinte medio correo.
import fs from "node:fs";

const OUT = new URL("../supabase/emails/", import.meta.url);

// ── Sistema Campus (docs/BRANDBOOK.md §4) ────────────────
const INK = "#161616";
const BODY = "#525252";
const HELPER = "#6f6f6f";
const BORDER = "#e0e0e0";
const LAYER = "#f4f4f4";
const GO = "#038632"; // verde de acción: entrar
const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Helvetica, Arial, sans-serif";

// El logo se sirve desde el dominio público: en el correo no hay build ni
// rutas relativas que valgan.
const LOGO = "https://activexremote.com/email/logo-axr.png";

/**
 * @param {{ preheader: string, bar: string, title: string, lead: string,
 *           cta: string, note: string, small: string[] }} copy
 */
function render(copy) {
  const small = copy.small
    .map(
      (line) =>
        `<p style="margin:0 0 8px 0;font-size:12px;line-height:1.55;color:${HELPER};">${line}</p>`,
    )
    .join("\n              ");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${copy.title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${LAYER};">
    <!-- Línea de vista previa: lo que se lee en la bandeja antes de abrir. -->
    <div style="display:none;font-size:1px;color:${LAYER};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${copy.preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${LAYER};">
      <tr>
        <td align="center" style="padding:40px 16px;">

          <!-- Sombra dura de marca: banda de tinta a la derecha y abajo. -->
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;">
            <tr>
              <td style="background-color:${INK};padding:0 6px 6px 0;">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border:1px solid ${INK};">

                  <!-- Cinta superior -->
                  <tr>
                    <td style="border-bottom:1px solid ${INK};padding:10px 16px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-family:${FONT};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${BODY};">&#9632;&nbsp; ${copy.bar}</td>
                          <td align="right" style="font-family:${FONT};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${HELPER};">Formación interna</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Cuerpo -->
                  <tr>
                    <td style="padding:36px 40px 32px 40px;font-family:${FONT};">

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                        <tr>
                          <td style="padding-right:12px;" valign="middle">
                            <img src="${LOGO}" width="46" height="28" alt="" style="display:block;border:0;outline:none;width:46px;height:28px;" />
                          </td>
                          <td valign="middle" style="font-family:${FONT};">
                            <div style="font-size:15px;font-weight:700;letter-spacing:0.14em;color:${INK};">ACTIVEXREMOTE</div>
                            <div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${HELPER};padding-top:2px;">Campus de formación</div>
                          </td>
                        </tr>
                      </table>

                      <h1 style="margin:0 0 14px 0;font-size:26px;line-height:1.2;font-weight:700;color:${INK};">${copy.title}</h1>
                      <p style="margin:0 0 28px 0;font-size:15px;line-height:1.6;color:${BODY};">${copy.lead}</p>

                      <!-- Botón: tabla, no <a> con padding, para que Outlook lo pinte entero -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td bgcolor="${GO}" style="background-color:${GO};">
                            <a href="{{ .ConfirmationURL }}" style="display:block;padding:16px 20px;font-family:${FONT};font-size:15px;font-weight:500;color:#ffffff;text-decoration:none;">${copy.cta} &nbsp;&rarr;</a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:24px 0 6px 0;font-size:12px;line-height:1.55;color:${HELPER};">${copy.note}</p>
                      <p style="margin:0;font-size:12px;line-height:1.6;word-break:break-all;"><a href="{{ .ConfirmationURL }}" style="color:${INK};text-decoration:underline;">{{ .ConfirmationURL }}</a></p>

                      <div style="height:1px;line-height:1px;font-size:0;background-color:${BORDER};margin:28px 0 20px 0;">&nbsp;</div>

                      ${small}
                    </td>
                  </tr>

                  <!-- Cinta inferior -->
                  <tr>
                    <td style="border-top:1px solid ${INK};padding:10px 16px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="font-family:${FONT};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${HELPER};">ActiveXRemote Campus</td>
                          <td align="right" style="font-family:${FONT};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${HELPER};">activexremote.com</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

          <p style="margin:20px 0 0 0;font-family:${FONT};font-size:11px;line-height:1.5;color:#8d8d8d;max-width:560px;">
            Este correo se ha enviado a {{ .Email }} porque alguien pidió acceso al campus de ActiveXRemote.
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

const CADUCIDAD = "El enlace caduca en una hora y sólo se puede usar una vez.";
const MISMO_NAVEGADOR =
  "Ábrelo en el mismo navegador desde el que lo pediste: es ahí donde se canjea.";
const NO_FUISTE_TU =
  "Si no has sido tú, no hagas nada: sin abrir el enlace no ocurre nada y nadie entra en tu nombre.";

const TEMPLATES = {
  // Authentication → Emails → Magic Link
  "magic-link.html": {
    preheader: "Tu enlace de acceso al campus. Caduca en una hora.",
    bar: "Campus / Acceso",
    title: "Tu enlace de acceso",
    lead: "Aquí no hay contraseñas que recordar. Pulsa el botón y entras directo al campus.",
    cta: "Entrar al campus",
    note: "¿El botón no hace nada? Copia esta dirección en tu navegador:",
    small: [CADUCIDAD, MISMO_NAVEGADOR, NO_FUISTE_TU],
  },

  // Authentication → Emails → Confirm signup
  "confirm-signup.html": {
    preheader: "Confirma tu cuenta y entra en el campus de ActiveXRemote.",
    bar: "Campus / Alta",
    title: "Bienvenido. Confirma tu cuenta",
    lead: "Tu cuenta está creada. Pulsa el botón para confirmarla y entrar: no hace falta contraseña, ni ahora ni después.",
    cta: "Confirmar y entrar",
    small: [CADUCIDAD, MISMO_NAVEGADOR, NO_FUISTE_TU],
    note: "¿El botón no hace nada? Copia esta dirección en tu navegador:",
  },

  // Authentication → Emails → Reset Password.
  // Es el correo que sale al confirmarse una matrícula (lib/data/orders.ts):
  // aquí no restablece ninguna contraseña, abre el acceso al curso pagado.
  "acceso-matricula.html": {
    preheader: "Tu matrícula está confirmada. Este es tu acceso al campus.",
    bar: "Campus / Matrícula",
    title: "Tu matrícula está confirmada",
    lead: "Ya tienes acceso a tu formación. Pulsa el botón para entrar en el campus: se abre con este enlace, sin contraseña.",
    cta: "Entrar en mi formación",
    note: "¿El botón no hace nada? Copia esta dirección en tu navegador:",
    small: [
      CADUCIDAD,
      "Si caduca antes de que llegues a usarlo, pide otro desde la pantalla de acceso con este mismo correo.",
      "¿Alguna duda con tu matrícula? Responde a este correo y te contestamos.",
    ],
  },
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, copy] of Object.entries(TEMPLATES)) {
  fs.writeFileSync(new URL(name, OUT), render(copy));
  console.log(`✓ supabase/emails/${name}`);
}
