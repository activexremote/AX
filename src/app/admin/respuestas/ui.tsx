import type { FilaRespuesta } from "@/lib/actividades/tipos";
import type { PanelRespuestasCopy } from "@/lib/i18n/panel-respuestas";

// Piezas pequeñas que comparten el panel, la ficha y la corrección.

export const TONO: Record<FilaRespuesta["status"], string> = { borrador: "warn", enviada: "info", revisada: "ok", devuelta: "bad" };

/** Iniciales con un color estable por persona. */
export function Avatar({ nombre, id, size = "md" }: { nombre: string; id: string; size?: "sm" | "md" | "lg" }) {
  const partes = nombre.split(/[\s@.]+/).filter(Boolean);
  const ini = ((partes[0]?.[0] ?? "?") + (partes[1]?.[0] ?? "")).toUpperCase();
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return (
    <span className={`axr-resp-av axr-resp-av--${size}`} style={{ background: `hsl(${h} 70% 92%)`, color: `hsl(${h} 45% 32%)` }} aria-hidden>
      {ini}
    </span>
  );
}

/** Barra fina con «a/b» al lado. */
export function Barra({ a, b, ancho = 80 }: { a: number; b: number; ancho?: number }) {
  if (!b) return <span className="axr-resp-muted">—</span>;
  const pct = Math.round((a / b) * 100);
  return (
    <span className={`axr-resp-bar${a >= b ? " is-done" : ""}`}>
      <span style={{ width: ancho }} aria-hidden>
        <span style={{ width: `${pct}%` }} />
      </span>
      <small>
        {a}/{b}
      </small>
    </span>
  );
}

/** «hace 3 h», «hace 2 d»… y la fecha a partir de una semana. */
export function haceCuanto(iso: string | null, k: PanelRespuestasCopy, locale: "es" | "en") {
  if (!iso) return "—";
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 2) return k.ago.now;
  if (min < 60) return k.ago.min.replace("{n}", String(min));
  if (min < 60 * 24) return k.ago.h.replace("{n}", String(Math.round(min / 60)));
  if (min < 60 * 24 * 7) return k.ago.d.replace("{n}", String(Math.round(min / 1440)));
  return new Date(iso).toLocaleDateString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", timeZone: "Europe/Madrid" });
}

export const fechaHora = (iso: string, locale: "es" | "en") =>
  new Date(iso).toLocaleString(locale === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

export const coma = (n: number) => String(n).replace(".", ",");
