// Extrae de simple-icons (CC0) sólo los iconos que usa la sección de
// herramientas y los vuelca en un módulo propio. Así el bundle no arrastra
// los 3.400 iconos del paquete y en producción no hay dependencia ninguna.
//
//   node scripts/build-tool-icons.mjs
//
// Marcas que NO están en simple-icons (sus dueños pidieron la retirada):
// Microsoft, OpenAI/ChatGPT, Slack, Adobe, Canva, LinkedIn, Salesforce…
// Esas se pintan con ficha de monograma, o con un SVG propio en
// public/logos si algún día tenemos permiso de uso.
import * as si from "simple-icons";
import fs from "node:fs";

const SLUGS = [
  "claude", "googlegemini", "perplexity", "cursor", "replit", "make", "n8n",
  "zoom", "googlemeet", "loom",
  "notion", "asana", "clickup", "linear", "trello", "jira", "confluence",
  "zapier", "airtable",
  "toggltrack", "clockify",
  "googledrive", "dropbox", "box",
  "figma", "framer",
  "github", "gitlab", "vercel", "supabase",
  "hubspot", "upwork", "fiverr",
  "stripe", "wise", "paypal", "revolut", "xero",
  "1password", "bitwarden", "nordvpn", "cloudflare",
  "google", "notebooklm", "feedly",
  "googleads", "googleanalytics", "googlesearchconsole", "semrush", "meta",
  "intercom", "zendesk", "helpscout",
  "calendly", "caldotcom", "googlecalendar",
  "miro",
];

const all = Object.values(si).filter((i) => i && i.slug);
const bySlug = new Map(all.map((i) => [i.slug, i]));

const missing = SLUGS.filter((s) => !bySlug.has(s));
if (missing.length) {
  console.error("Slugs inexistentes en simple-icons:", missing.join(", "));
  process.exit(1);
}

const entries = SLUGS.map((slug) => {
  const { path, hex, title } = bySlug.get(slug);
  return `  ${JSON.stringify(slug)}: { hex: "#${hex}", path: ${JSON.stringify(path)} }, // ${title}`;
}).join("\n");

const out = `// GENERADO por scripts/build-tool-icons.mjs — no editar a mano.
// Iconos de simple-icons (https://simpleicons.org), licencia CC0 1.0.
// Cada marca pertenece a su dueño; se usan sólo para identificar la
// herramienta que se enseña en el programa.

export type ToolIcon = { hex: string; path: string };

export const TOOL_ICONS: Record<string, ToolIcon> = {
${entries}
};
`;

fs.writeFileSync("src/components/landing/tool-icons.ts", out);
console.log(`Escritos ${SLUGS.length} iconos en src/components/landing/tool-icons.ts`);
