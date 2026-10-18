// Parte de commits para Telegram: uno por commit, con autor, mensaje entero,
// ficheros tocados y líneas añadidas/quitadas. Lo lanza el workflow
// telegram-commits.yml en cada push.
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
// Tema del grupo (foro) donde publicar. Sin él, va a la conversación general.
const threadId = Number(process.env.TELEGRAM_THREAD_ID) || undefined;
if (!token || !chatId) {
  console.log("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID: no se envía nada.");
  process.exit(0);
}

const event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
const repo = event.repository.full_name;
const branch = (event.ref ?? "").replace("refs/heads/", "");
const pusher = event.pusher?.name ?? event.sender?.login ?? "alguien";

// Un push con cientos de commits (un rebase, una importación) inundaría el
// canal: se mandan los últimos y se dice cuántos se han saltado.
const MAX_COMMITS = 15;
const MAX_FILES = 25;
// Telegram corta en 4096 caracteres por mensaje; se deja margen.
const MAX_LEN = 3900;

// `distinct: false` = el commit ya llegó antes en otra rama. Al fusionar una
// PR, GitHub vuelve a mandar los commits de la rama junto al merge; sin este
// filtro el canal recibiría cada parte dos veces.
const commits = (event.commits ?? []).filter((c) => c.distinct !== false);
if (event.deleted || commits.length === 0) {
  console.log("Push sin commits nuevos (rama borrada o sólo etiquetas).");
  process.exit(0);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });

const STATUS = { A: "🟢", M: "🟡", D: "🔴", R: "🔵", C: "🔵", T: "🟡" };

function fileChanges(sha) {
  // numstat da las líneas; name-status, si el fichero es nuevo, borrado o renombrado.
  // En un merge se compara con el primer padre: lo que entra con la fusión.
  const parent = `${sha}^1`;
  let numstat = "", namestatus = "";
  try {
    numstat = git("diff", "--numstat", "-M", parent, sha);
    namestatus = git("diff", "--name-status", "-M", parent, sha);
  } catch {
    // Primer commit del repo: no tiene padre.
    numstat = git("show", "--numstat", "--format=", sha);
    namestatus = git("show", "--name-status", "--format=", sha);
  }
  const status = new Map();
  for (const line of namestatus.trim().split("\n").filter(Boolean)) {
    const [code, ...paths] = line.split("\t");
    status.set(paths.at(-1), code[0]);
  }
  return numstat.trim().split("\n").filter(Boolean).map((line) => {
    const [add, del, ...rest] = line.split("\t");
    // Los renombrados salen como "dir/{viejo => nuevo}" o "viejo => nuevo".
    const raw = rest.join("\t");
    const path = raw.includes("=>") ? raw.replace(/\{?[^{}]*? => ([^{}]*)\}?/, "$1").replace(/\/\//g, "/") : raw;
    const binary = add === "-";
    return { path, add: binary ? 0 : Number(add), del: binary ? 0 : Number(del), binary, code: status.get(path) ?? "M" };
  });
}

function report(c) {
  const sha = c.id;
  const isMerge = git("rev-list", "--parents", "-n", "1", sha).trim().split(" ").length > 2;
  const files = fileChanges(sha);
  const adds = files.reduce((n, f) => n + f.add, 0);
  const dels = files.reduce((n, f) => n + f.del, 0);

  const [title, ...body] = c.message.split("\n");
  const bodyText = body.join("\n").trim()
    // Las líneas de coautoría no aportan nada en el canal.
    .replace(/^Co-Authored-By:.*$/gim, "").trim();

  const when = new Date(c.timestamp).toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "short", timeStyle: "short" });

  const lines = [
    `${isMerge ? "🔀" : "📝"} <b>${esc(title)}</b>`,
    `<code>${repo}</code> · <b>${esc(branch)}</b> · <a href="${c.url}">${sha.slice(0, 7)}</a>`,
    `👤 ${esc(c.author?.name ?? pusher)} · 🕒 ${when}`,
    `📊 ${files.length} fichero(s) · <b>+${adds}</b> / <b>−${dels}</b>`,
  ];

  if (bodyText) lines.push("", `<blockquote expandable>${esc(bodyText)}</blockquote>`);

  if (files.length) {
    lines.push("", "<b>Ficheros</b>");
    const shown = [...files].sort((a, b) => b.add + b.del - (a.add + a.del)).slice(0, MAX_FILES);
    for (const f of shown) {
      const delta = f.binary ? "binario" : `+${f.add} −${f.del}`;
      lines.push(`${STATUS[f.code] ?? "⚪"} <code>${esc(f.path)}</code> ${delta}`);
    }
    if (files.length > shown.length) lines.push(`… y ${files.length - shown.length} más`);
  }

  let text = lines.join("\n");
  if (text.length > MAX_LEN) {
    // Se recorta por líneas para no partir una etiqueta HTML por la mitad.
    const kept = [];
    for (const l of lines) {
      if ([...kept, l, "…"].join("\n").length > MAX_LEN) break;
      kept.push(l);
    }
    // Un blockquote recortado quedaría sin cerrar: fuera.
    text = [...kept.filter((l) => !l.startsWith("<blockquote")), "…"].join("\n");
  }
  return text;
}

async function send(text) {
  // TELEGRAM_DRY_RUN=1 enseña el mensaje sin mandarlo: para probarlo en local.
  if (process.env.TELEGRAM_DRY_RUN) return void console.log(`${text}\n${"─".repeat(40)}`);
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_thread_id: threadId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
  });
  const data = await res.json();
  // 429: Telegram pide esperar. Se respeta una vez y se reintenta.
  if (data.error_code === 429 && data.parameters?.retry_after) {
    await new Promise((r) => setTimeout(r, (data.parameters.retry_after + 1) * 1000));
    return send(text);
  }
  if (!data.ok) throw new Error(`Telegram: ${data.description}`);
}

const skipped = Math.max(0, commits.length - MAX_COMMITS);
const toSend = commits.slice(-MAX_COMMITS);

if (commits.length > 1) {
  const compare = event.compare ? ` · <a href="${event.compare}">ver cambios</a>` : "";
  await send(`🚀 <b>${esc(pusher)}</b> ha subido ${commits.length} commit(s) a <b>${esc(branch)}</b>${compare}${skipped ? `\n(se muestran los ${MAX_COMMITS} últimos)` : ""}`);
}

for (const c of toSend) {
  await send(report(c));
  // Telegram admite unos 20 mensajes por minuto en un mismo grupo o canal.
  await new Promise((r) => setTimeout(r, 1200));
}
console.log(`Enviados ${toSend.length} parte(s) a Telegram.`);
