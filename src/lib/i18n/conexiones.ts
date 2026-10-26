import type { Locale } from "@/lib/i18n/config";

// Textos de Panel → Conexiones con Claude (el conector MCP).

const es = {
  title: "Conexiones con Claude",
  lead: "Conecta Claude (claude.ai, Claude Desktop o Claude Code) a los banners y las publicaciones del campus para gestionarlos desde una conversación: ver, crear, editar, aprobar, programar, mover a carpetas y descargar.",
  url: "Dirección del conector",
  copy: "Copiar",
  copied: "Copiada",
  howTitle: "Cómo se conecta",
  steps: [
    ["claude.ai o Claude Desktop", "Ajustes → Conectores → «Añadir conector personalizado». Pega la dirección, ponle de nombre «ActiveXRemote» y pulsa Conectar. Se abre el campus: entra con tu cuenta y pulsa «Permitir»."],
    ["Equipo (Claude Team o Enterprise)", "Quien administra la organización añade el conector una vez en Ajustes de la organización → Conectores. Después, cada persona pulsa Conectar y entra con su propia cuenta del campus."],
    ["Claude Code", "En la terminal: claude mcp add --transport http activexremote <dirección>. La primera vez, /mcp → activexremote → Autenticar."],
  ] as [string, string][],
  whoTitle: "Quién puede",
  who: "Sólo administradores del campus. Cada persona entra con su cuenta y lo que hace queda a su nombre. Lo que no se puede hacer desde el panel tampoco se puede desde Claude: las normas de Meta, los límites y la revisión son los mismos.",
  examplesTitle: "Para empezar, pídele a Claude",
  examples: [
    "«Enséñame las campañas de banners de esta semana y las imágenes de la última.»",
    "«Crea una campaña de 5 banners para Remote Founder, 2 en formato chat, en la carpeta Enero.»",
    "«Aprueba las variantes 1 y 3 y dame el enlace para descargarlas en story.»",
    "«¿Qué publicaciones hay por revisar? Programa la de LinkedIn en el próximo hueco.»",
  ],
  activeTitle: "Accesos activos",
  none: "Todavía nadie ha conectado Claude.",
  client: "Aplicación",
  user: "Cuenta",
  since: "Conectado",
  lastUse: "Último uso",
  revoke: "Revocar",
  revokeHint: "Corta ese acceso al momento: Claude tendrá que volver a conectar.",
};

const en: typeof es = {
  title: "Claude connections",
  lead: "Connect Claude (claude.ai, Claude Desktop or Claude Code) to the campus banners and posts to manage them from a conversation: view, create, edit, approve, schedule, move to folders and download.",
  url: "Connector URL",
  copy: "Copy",
  copied: "Copied",
  howTitle: "How to connect",
  steps: [
    ["claude.ai or Claude Desktop", "Settings → Connectors → “Add custom connector”. Paste the URL, name it “ActiveXRemote” and press Connect. The campus opens: sign in and press “Allow”."],
    ["Team (Claude Team or Enterprise)", "The organisation admin adds the connector once in Organisation settings → Connectors. Then each person presses Connect and signs in with their own campus account."],
    ["Claude Code", "In the terminal: claude mcp add --transport http activexremote <URL>. The first time, /mcp → activexremote → Authenticate."],
  ],
  whoTitle: "Who can",
  who: "Campus administrators only. Each person signs in with their account and their actions are recorded under it. Whatever the panel doesn't allow, Claude can't do either: the same Meta rules, limits and review apply.",
  examplesTitle: "To start, ask Claude",
  examples: [
    "“Show me this week's banner campaigns and the images of the latest one.”",
    "“Create a 5-banner campaign for Remote Founder, 2 as chats, in the January folder.”",
    "“Approve variants 1 and 3 and give me the link to download them as stories.”",
    "“Which posts are waiting for review? Schedule the LinkedIn one in the next slot.”",
  ],
  activeTitle: "Active connections",
  none: "Nobody has connected Claude yet.",
  client: "App",
  user: "Account",
  since: "Connected",
  lastUse: "Last used",
  revoke: "Revoke",
  revokeHint: "Cuts that access immediately: Claude will have to connect again.",
};

export const conCopy: Record<Locale, typeof es> = { es, en };
