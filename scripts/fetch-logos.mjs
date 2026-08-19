// Busca en svgl.app los logos de las marcas que no están en simple-icons y
// los guarda en public/logos/tools/. Se ejecuta a mano, no en el build:
//
//   node scripts/fetch-logos.mjs          (sólo lista lo que encuentra)
//   node scripts/fetch-logos.mjs --write  (descarga)
//
// Cada logo es propiedad de su marca. Se usan sólo para identificar las
// herramientas que se enseñan en el programa.
import fs from "node:fs";
import path from "node:path";

const WANTED = {
  chatgpt: "OpenAI", copilot: "Copilot", lovable: "Lovable", bolt: "bolt",
  teams: "Microsoft Teams", krisp: "Krisp", m365: "Microsoft Office",
  slite: "Slite", bardeen: "Bardeen", otter: "Otter", fireflies: "Fireflies",
  granola: "Granola", motion: "Motion", reclaim: "Reclaim", sunsama: "Sunsama",
  onedrive: "OneDrive", canva: "Canva", adobe: "Adobe", vscode: "Visual Studio Code",
  salesforce: "Salesforce", pipedrive: "Pipedrive", apollo: "Apollo",
  linkedin: "LinkedIn", remotecom: "Remote", authy: "Authy",
  readwise: "Readwise", ahrefs: "Ahrefs", crisp: "Crisp", donut: "Donut",
  lattice: "Lattice", cultureamp: "Culture Amp",
};

const all = await (await fetch("https://api.svgl.app")).json();
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const write = process.argv.includes("--write");
const outDir = "public/logos/tools";
if (write) fs.mkdirSync(outDir, { recursive: true });

const found = {};
for (const [id, title] of Object.entries(WANTED)) {
  const k = norm(title);
  const hit =
    all.find((l) => norm(l.title) === k) ||
    all.find((l) => norm(l.title).startsWith(k)) ||
    all.find((l) => norm(l.title).includes(k));
  if (!hit) { console.log(`MISS ${id.padEnd(12)} (${title})`); continue; }

  // `route` es una url o { light, dark }: nos quedamos con la variante clara,
  // que es la que se ve sobre la ficha blanca.
  const url = typeof hit.route === "string" ? hit.route : hit.route.light;
  console.log(`OK   ${id.padEnd(12)} -> ${hit.title}`);
  found[id] = { title: hit.title, url };

  if (write) {
    const svg = await (await fetch(url)).text();
    if (!svg.trim().startsWith("<svg")) { console.log(`     !! no es SVG: ${url}`); continue; }
    fs.writeFileSync(path.join(outDir, `${id}.svg`), svg);
  }
}
console.log(`\n${Object.keys(found).length}/${Object.keys(WANTED).length} encontrados`);
