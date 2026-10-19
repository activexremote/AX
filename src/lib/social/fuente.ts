import "server-only";

// ══════════════════════════════════════════════════════════
//  Leer el enlace de origen
//
//  Cuando una publicación parte de un enlace, DeepSeek no navega: se le pasa
//  el texto de la página. Esto lo saca, sin librerías: el HTML pierde
//  scripts, estilos, menús y pies, y lo que queda se compacta.
//
//  No es un lector perfecto, y no hace falta que lo sea: la IA sólo necesita
//  de qué va la página para reinterpretarla con nuestra voz. Copiarla nunca
//  es el objetivo (ver las reglas en generar.ts).
//
//  Lo pide un administrador desde el panel, pero aun así sólo se aceptan
//  http(s) a nombres públicos: el servidor no tiene por qué ir a buscar nada
//  dentro de la red de Vercel ni de nadie.
// ══════════════════════════════════════════════════════════

/** Más texto no mejora la propuesta y sí el coste. */
const MAX_TEXTO = 15_000;
const TIEMPO = 12_000;

export type Fuente = { url: string; title: string; text: string };

function hostPrivado(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, "");
  return (
    h === "localhost" ||
    h.endsWith(".local") ||
    h.endsWith(".internal") ||
    /^(127|10|0)\./.test(h) ||
    /^192\.168\./.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
    /^169\.254\./.test(h) ||
    // IPv6: bucle local y direcciones únicas locales (fc00::/7).
    (h.includes(":") && (h === "::1" || /^f[cd]/.test(h))) ||
    (!h.includes(".") && !h.includes(":"))
  );
}

const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodificar(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTIDADES[n.toLowerCase()] ?? m);
}

export function textoDeHtml(html: string): { title: string; text: string } {
  const titulo =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ??
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ??
    "";

  // Si la página marca su contenido principal, sólo eso.
  const cuerpo =
    html.match(/<article[\s\S]*?<\/article>/i)?.[0] ??
    html.match(/<main[\s\S]*?<\/main>/i)?.[0] ??
    html;

  const text = decodificar(
    cuerpo
      .replace(/<(script|style|noscript|svg|nav|header|footer|aside|form|iframe)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<\/(p|div|h[1-6]|li|tr|section|article|blockquote)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();

  return { title: decodificar(titulo).trim(), text: text.slice(0, MAX_TEXTO) };
}

export async function leerFuente(raw: string): Promise<Fuente> {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("El enlace no es una URL válida.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Sólo se aceptan enlaces http o https.");
  if (hostPrivado(url.hostname)) throw new Error("Ese enlace apunta a una dirección privada.");

  const res = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(TIEMPO),
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; ActiveXRemoteBot/1.0; +https://activexremote.com)",
      Accept: "text/html,application/xhtml+xml",
    },
  }).catch(() => {
    throw new Error("No se pudo abrir el enlace (no responde o tarda demasiado).");
  });

  if (!res.ok) throw new Error(`El enlace responde con un error (${res.status}).`);
  if (hostPrivado(new URL(res.url).hostname)) throw new Error("El enlace redirige a una dirección privada.");
  const tipo = res.headers.get("content-type") ?? "";
  if (!tipo.includes("html") && !tipo.includes("text/plain")) throw new Error("El enlace no es una página web (¿un PDF o una imagen?).");

  const html = await res.text();
  const { title, text } = tipo.includes("html") ? textoDeHtml(html) : { title: "", text: html.slice(0, MAX_TEXTO) };
  if (text.length < 200) throw new Error("No se ha podido leer el texto de la página (puede que se cargue con JavaScript o pida iniciar sesión).");
  return { url: res.url, title, text };
}
