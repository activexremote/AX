// Previsualización de los correos en local.
//
//   node scripts/preview-emails.mjs [puerto]
//
// Sirve supabase/emails/*.html en el navegador para poder mirarlos sin mandar
// ningún correo. Dos sustituciones al vuelo, sólo aquí:
//
//   · El logo apunta al dominio público, que todavía no tiene el PNG
//     desplegado. En la vista previa se lee del propio proyecto, del
//     localhost:3000 que sirve /public.
//   · Los marcadores de Supabase ({{ .ConfirmationURL }}, {{ .Email }}) no
//     los sustituye nadie fuera de Supabase, así que aquí se rellenan con un
//     ejemplo para ver el correo como lo verá quien lo reciba.
//
// Los archivos de supabase/emails NO se tocan: la sustitución vive en memoria.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const DIR = new URL("../supabase/emails/", import.meta.url);
const PORT = Number(process.argv[2] ?? 4600);
const CAMPUS = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const EJEMPLO = {
  "{{ .ConfirmationURL }}": `${CAMPUS}/auth/callback?code=ejemplo-de-enlace-magico`,
  "{{ .Email }}": "alumno@ejemplo.com",
  "{{ .Token }}": "123456",
};

function plantillas() {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".html")).sort();
}

function servir(nombre) {
  let html = fs.readFileSync(new URL(nombre, DIR), "utf8");
  html = html.replaceAll("https://activexremote.com/email/logo-axr.png", `${CAMPUS}/email/logo-axr.png`);
  for (const [marca, valor] of Object.entries(EJEMPLO)) html = html.replaceAll(marca, valor);
  return html;
}

const indice = () => `<!doctype html>
<meta charset="utf-8"><title>Correos del campus</title>
<body style="font:15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;background:#f4f4f4;margin:0;padding:48px 24px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #161616;box-shadow:6px 6px 0 #161616;padding:32px;">
  <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#6f6f6f;">Vista previa · no se envía nada</div>
  <h1 style="font-size:24px;margin:.4em 0 1em;color:#161616;">Correos del campus</h1>
  <ul style="padding-left:1.1em;color:#525252;">
    ${plantillas().map((f) => `<li style="margin-bottom:.5em;"><a href="/${f}" style="color:#161616;">${f}</a></li>`).join("\n    ")}
  </ul>
  <p style="font-size:13px;color:#6f6f6f;margin-bottom:0;">Los enlaces del botón llevan a un ejemplo, no a un acceso real.</p>
</div>
</body>`;

http
  .createServer((req, res) => {
    const nombre = path.basename(decodeURIComponent(req.url.split("?")[0]));
    try {
      const html = nombre.endsWith(".html") ? servir(nombre) : indice();
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(html);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("No existe esa plantilla");
    }
  })
  .listen(PORT, () => {
    console.log(`Correos en http://localhost:${PORT}`);
    for (const f of plantillas()) console.log(`  · http://localhost:${PORT}/${f}`);
  });
