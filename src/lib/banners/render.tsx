import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { ACENTO, FORMATOS, VERDE, type BannerCopy, type FormatoId, type Plantilla } from "@/lib/banners/formatos";
import type { AdCourse } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  La pieza final, compuesta con la marca
//
//  Lo pinta `next/og` (Satori): JSX con estilos en línea → PNG a tamaño
//  exacto. Satori sólo entiende flexbox: todo div con más de un hijo lleva
//  `display: flex`.
//
//  Tres plantillas (formatos.ts → Plantilla), las tres con:
//   · el lockup ΔX ACTIVEXREMOTE arriba a la izquierda (BRANDBOOK §1-2);
//   · el titular en Inter 800, tamaño según su longitud;
//   · la llamada a la acción en verde de acción, con flecha: es una etiqueta,
//     no imita ningún botón de la interfaz de Meta;
//   · todo lo importante dentro de la zona segura del formato.
//
//  Las fuentes van en el repositorio (fonts/, Inter estática: Satori no
//  entiende fuentes variables). next.config.ts las incluye en la función.
// ══════════════════════════════════════════════════════════

const FONTS_DIR = path.join(process.cwd(), "src/lib/banners/fonts");

let fontsCache: Promise<{ name: string; data: Buffer; weight: 500 | 700 | 800; style: "normal" }[]> | null = null;

export function fuentes() {
  fontsCache ??= Promise.all(
    ([500, 700, 800] as const).map(async (weight) => ({
      name: "Inter",
      data: await readFile(path.join(FONTS_DIR, `Inter-${weight}.ttf`)),
      weight,
      style: "normal" as const,
    })),
  );
  return fontsCache;
}

export type Pieza = {
  copy: BannerCopy;
  template: Plantilla;
  course: AdCourse;
  language: "es" | "en";
  formato: FormatoId;
  /** data: URL de la foto, o null. */
  imagen: string | null;
};

/** Tamaño del titular según cuánto texto lleva. */
function tamTitular(texto: string, plantilla: Plantilla, formato: FormatoId): number {
  const n = texto.length;
  const base = n <= 24 ? 104 : n <= 40 ? 92 : n <= 56 ? 80 : n <= 72 ? 70 : 60;
  const extra = plantilla === "marca" ? 10 : plantilla === "tarjeta" ? -14 : 0;
  // El formato cuadrado tiene menos alto: un punto menos de ambición.
  const ajuste = formato === "post" ? -6 : 0;
  return base + extra + ajuste;
}

function Lockup({ color, size = 34 }: { color: string; size?: number }) {
  const w = (size * 46) / 28;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width={w} height={size} viewBox="0 0 46 28" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="miter">
        <path d="M11 2 L20 26 L2 26 Z" />
        <path d="M26 2 L44 2 L35 14 Z" />
        <path d="M26 26 L44 26 L35 14 Z" />
      </svg>
      <span style={{ fontSize: size * 0.72, fontWeight: 700, letterSpacing: size * 0.72 * 0.14, color }}>ACTIVEXREMOTE</span>
    </div>
  );
}

function Cta({ texto, tam = 34 }: { texto: string; tam?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        alignSelf: "flex-start",
        background: VERDE,
        color: "#ffffff",
        fontSize: tam,
        fontWeight: 700,
        padding: `${tam * 0.55}px ${tam * 1.05}px`,
        borderRadius: 999,
      }}
    >
      <span>{texto}</span>
      <span>→</span>
    </div>
  );
}

function Kicker({ texto, fondo, color = "#ffffff" }: { texto: string; fondo: string; color?: string }) {
  if (!texto) return null;
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        background: fondo,
        color,
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: 2.6,
        textTransform: "uppercase",
        padding: "10px 20px",
        borderRadius: 999,
      }}
    >
      {texto}
    </div>
  );
}

function Fondo({ imagen, w, h }: { imagen: string; w: number; h: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Satori, no el navegador
    <img src={imagen} alt="" width={w} height={h} style={{ position: "absolute", top: 0, left: 0, width: w, height: h, objectFit: "cover" }} />
  );
}

export function Banner(p: Pieza) {
  const f = FORMATOS[p.formato];
  const a = ACENTO[p.course];
  const { w, h, safe } = f;
  const c = p.copy;
  const plantilla: Plantilla = p.imagen ? p.template : "marca";
  const titular = tamTitular(c.headline, plantilla, p.formato);
  // Lo de arriba (logo) y lo de abajo (texto) respetan la zona segura.
  const pad = { top: safe.top, bottom: safe.bottom, side: safe.side + 12 };

  const raiz = {
    width: w,
    height: h,
    display: "flex",
    position: "relative" as const,
    fontFamily: "Inter",
    overflow: "hidden" as const,
  };

  const cabecera = (color: string) => (
    <div style={{ position: "absolute", top: pad.top, left: pad.side, right: pad.side, display: "flex", alignItems: "center" }}>
      <Lockup color={color} />
    </div>
  );

  // ── Foto a sangre ──
  if (plantilla === "foto" && p.imagen) {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        <Fondo imagen={p.imagen} w={w} h={h} />
        {/* Velo: oscuro arriba (logo) y desde la mitad hacia abajo (texto). */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: `linear-gradient(180deg, rgba(22,19,38,0.6) 0%, rgba(22,19,38,0) ${Math.round((pad.top / h) * 100) + 12}%, rgba(22,19,38,0) 28%, rgba(22,19,38,0.78) 54%, rgba(22,19,38,0.94) ${Math.round(((h - pad.bottom) / h) * 100)}%, rgba(22,19,38,0.96) 100%)`,
          }}
        />
        {cabecera("#ffffff")}
        <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 26 }}>
          <Kicker texto={c.kicker} fondo={a.accent} />
          <div style={{ display: "flex", fontSize: titular, fontWeight: 800, lineHeight: 1.04, letterSpacing: -titular * 0.025, color: "#ffffff", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>{c.headline}</div>
          {c.sub ? <div style={{ display: "flex", fontSize: 36, fontWeight: 500, lineHeight: 1.35, color: "rgba(255,255,255,0.9)", maxWidth: 900, textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}>{c.sub}</div> : null}
          {c.cta ? <div style={{ display: "flex", marginTop: 10 }}><Cta texto={c.cta} /></div> : null}
        </div>
      </div>
    );
  }

  // ── Foto con tarjeta blanca ──
  if (plantilla === "tarjeta" && p.imagen) {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        <Fondo imagen={p.imagen} w={w} h={h} />
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(22,19,38,0.5) 0%, rgba(22,19,38,0) 22%)" }} />
        {cabecera("#ffffff")}
        <div
          style={{
            position: "absolute",
            left: pad.side,
            right: pad.side,
            bottom: pad.bottom,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            background: "#ffffff",
            borderRadius: 26,
            padding: "48px 52px",
            boxShadow: "0 30px 80px rgba(20,16,40,0.35)",
          }}
        >
          <Kicker texto={c.kicker} fondo={a.accent} />
          <div style={{ display: "flex", fontSize: titular, fontWeight: 800, lineHeight: 1.06, letterSpacing: -titular * 0.025, color: "#161326" }}>{c.headline}</div>
          {c.sub ? <div style={{ display: "flex", fontSize: 32, fontWeight: 500, lineHeight: 1.4, color: "#514D69" }}>{c.sub}</div> : null}
          {c.cta ? <div style={{ display: "flex", marginTop: 6 }}><Cta texto={c.cta} tam={30} /></div> : null}
        </div>
      </div>
    );
  }

  // ── Marca: mesh del curso, sin foto ──
  const simbolo = Math.round(w * 0.95);
  return (
    <div style={{ ...raiz, backgroundImage: a.mesh, backgroundColor: "#241246" }}>
      {/* El símbolo enorme y casi transparente: textura de marca, no logo. */}
      <svg
        width={simbolo}
        height={(simbolo * 28) / 46}
        viewBox="0 0 46 28"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={0.6}
        style={{ position: "absolute", right: -simbolo * 0.22, top: h * 0.3 }}
      >
        <path d="M11 2 L20 26 L2 26 Z" />
        <path d="M26 2 L44 2 L35 14 Z" />
        <path d="M26 26 L44 26 L35 14 Z" />
      </svg>
      {cabecera("#ffffff")}
      <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 30 }}>
        <Kicker texto={c.kicker} fondo="rgba(255,255,255,0.16)" />
        <div style={{ display: "flex", fontSize: titular, fontWeight: 800, lineHeight: 1.02, letterSpacing: -titular * 0.03, color: "#ffffff" }}>{c.headline}</div>
        {c.sub ? <div style={{ display: "flex", fontSize: 38, fontWeight: 500, lineHeight: 1.35, color: "rgba(255,255,255,0.84)", maxWidth: 920 }}>{c.sub}</div> : null}
        {c.cta ? <div style={{ display: "flex", marginTop: 12 }}><Cta texto={c.cta} /></div> : null}
      </div>
    </div>
  );
}
