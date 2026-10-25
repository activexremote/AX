import type { ReactNode } from "react";

import {
  ACENTO,
  ELEMENTOS_POR_DEFECTO,
  ETIQUETA_IA,
  FORMATOS,
  VERDE,
  puntos,
  type BannerCopy,
  type Elementos,
  type FormatoId,
  type Plantilla,
} from "@/lib/banners/formatos";
import type { AdCourse } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  La pieza, compuesta con la marca
//
//  Un solo componente para los dos sitios donde se pinta:
//
//   · el servidor (render.tsx → `next/og`, Satori): JSX con estilos en
//     línea → PNG a tamaño exacto. Es lo que se descarga.
//   · el editor, en el navegador: el mismo JSX a escala, con cada texto
//     editable al hacer clic (`texto`). Lo que se ve al editar es lo que se
//     descarga, sin esperar a que el servidor recomponga nada.
//
//  Por eso aquí sólo vale lo que entienden los dos: Satori sólo sabe de
//  flexbox, así que todo div con más de un hijo lleva `display: flex`; y no
//  entiende `inset`: una capa a sangre lleva top, left, width y height.
//
//  Tres plantillas (formatos.ts → Plantilla), las tres con:
//   · el lockup ΔX ACTIVEXREMOTE arriba a la izquierda (BRANDBOOK §1-2);
//   · el titular en Inter 800, tamaño según su longitud;
//   · la llamada a la acción en verde de acción, con flecha: es una etiqueta,
//     no imita ningún botón de la interfaz de Meta;
//   · todo lo importante dentro de la zona segura del formato.
//
//  Cada elemento se enciende y se apaga (formatos.ts → Elementos) sin tocar
//  la imagen: la foto la pinta la IA una vez y todo lo demás va encima.
// ══════════════════════════════════════════════════════════

export type CampoTexto = "kicker" | "headline" | "sub" | "extra" | "points" | "cta";

/** Cómo se pinta un texto. Por defecto, tal cual; el editor lo hace editable. */
export type PintarTexto = (campo: CampoTexto, valor: string, indice?: number) => ReactNode;

export type Pieza = {
  copy: BannerCopy;
  template: Plantilla;
  course: AdCourse;
  language: "es" | "en";
  formato: FormatoId;
  /** URL de la foto (data: en el servidor, firmada en el navegador), o null. */
  imagen: string | null;
  elementos?: Elementos;
  /** Familia tipográfica: «Inter» en Satori; la variable de la app en el navegador. */
  fuente?: string;
  texto?: PintarTexto;
  /** En el editor, un elemento encendido pero vacío se ve (para poder escribir en él). */
  editando?: boolean;
};

const tal = (_c: CampoTexto, v: string) => v;

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

function Cta({ children, tam = 34 }: { children: ReactNode; tam?: number }) {
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
      <span style={{ display: "flex" }}>{children}</span>
      <span>→</span>
    </div>
  );
}

function Kicker({ children, fondo, color = "#ffffff" }: { children: ReactNode; fondo: string; color?: string }) {
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
      {children}
    </div>
  );
}

/** La línea destacada: un dato con un punto del color del curso delante. */
function Extra({ children, acento, oscuro }: { children: ReactNode; acento: string; oscuro: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 14,
        fontSize: 30,
        fontWeight: 700,
        color: oscuro ? "#ffffff" : "#161326",
        border: `2px solid ${oscuro ? "rgba(255,255,255,0.5)" : "rgba(22,19,38,0.18)"}`,
        padding: "10px 22px",
        borderRadius: 14,
      }}
    >
      <div style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: acento }} />
      <span style={{ display: "flex" }}>{children}</span>
    </div>
  );
}

function Puntos({ items, acento, oscuro, pintar }: { items: string[]; acento: string; oscuro: boolean; pintar: (v: string, i: number) => ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, fontSize: 32, fontWeight: 500, lineHeight: 1.3, color: oscuro ? "rgba(255,255,255,0.92)" : "#3A3655" }}>
          <span style={{ display: "flex", color: acento, fontWeight: 800 }}>✓</span>
          <span style={{ display: "flex" }}>{pintar(t, i)}</span>
        </div>
      ))}
    </div>
  );
}

function EtiquetaIa({ texto, oscuro }: { texto: string; oscuro: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 20,
        fontWeight: 500,
        color: oscuro ? "rgba(255,255,255,0.86)" : "#514D69",
        background: oscuro ? "rgba(22,19,38,0.45)" : "rgba(255,255,255,0.85)",
        padding: "6px 14px",
        borderRadius: 999,
      }}
    >
      {texto}
    </div>
  );
}

function Fondo({ imagen, w, h }: { imagen: string; w: number; h: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Satori y vista previa, no una imagen de la web
    <img src={imagen} alt="" width={w} height={h} style={{ position: "absolute", top: 0, left: 0, width: w, height: h, objectFit: "cover" }} />
  );
}

export function Banner(p: Pieza) {
  const f = FORMATOS[p.formato];
  const a = ACENTO[p.course];
  const { w, h, safe } = f;
  const c = p.copy;
  const el = p.elementos ?? ELEMENTOS_POR_DEFECTO;
  const pintar = p.texto ?? tal;
  const plantilla: Plantilla = p.imagen ? p.template : "marca";
  const titular = tamTitular(c.headline, plantilla, p.formato);
  // Lo de arriba (logo, etiqueta de IA) y lo de abajo (texto) respetan la zona segura.
  const pad = { top: safe.top, bottom: safe.bottom, side: safe.side + 12 };

  // Se ve si está encendido y tiene texto; en el editor, aunque esté vacío.
  const ve = (k: CampoTexto) => el[k] && (Boolean(c[k].trim()) || Boolean(p.editando));
  // Al editar, las líneas tal cual (también la que se acaba de añadir vacía);
  // en el PNG, sólo las que tienen texto.
  const crudas = c.points.split("\n").slice(0, 3);
  const items = p.editando ? (crudas.length ? crudas : [""]) : puntos(c);

  const raiz = {
    width: w,
    height: h,
    display: "flex",
    position: "relative" as const,
    fontFamily: p.fuente ?? "Inter",
    overflow: "hidden" as const,
  };

  const cabecera = (color: string, oscuro: boolean) =>
    el.logo || (el.aiLabel && p.imagen) ? (
      <div style={{ position: "absolute", top: pad.top, left: pad.side, right: pad.side, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {el.logo ? <Lockup color={color} /> : <div style={{ display: "flex" }} />}
        {el.aiLabel && p.imagen ? <EtiquetaIa texto={ETIQUETA_IA[p.language]} oscuro={oscuro} /> : <div style={{ display: "flex" }} />}
      </div>
    ) : null;

  /** El bloque de texto, igual en las tres plantillas salvo los colores. */
  const textos = (o: { oscuro: boolean; kickerFondo: string; titularColor: string; titularLh: number; titularLs: number; sombra?: string; sub: { size: number; color: string; maxWidth?: number; sombra?: string }; cta: number }) => [
    ve("kicker") ? (
      <Kicker key="k" fondo={o.kickerFondo}>
        {pintar("kicker", c.kicker)}
      </Kicker>
    ) : null,
    ve("headline") ? (
      <div key="h" style={{ display: "flex", fontSize: titular, fontWeight: 800, lineHeight: o.titularLh, letterSpacing: -titular * o.titularLs, color: o.titularColor, textShadow: o.sombra }}>
        {pintar("headline", c.headline)}
      </div>
    ) : null,
    ve("sub") ? (
      <div key="s" style={{ display: "flex", fontSize: o.sub.size, fontWeight: 500, lineHeight: 1.35, color: o.sub.color, maxWidth: o.sub.maxWidth, textShadow: o.sub.sombra }}>
        {pintar("sub", c.sub)}
      </div>
    ) : null,
    el.points && items.length ? <Puntos key="p" items={items} acento={a.accent} oscuro={o.oscuro} pintar={(v, i) => pintar("points", v, i)} /> : null,
    ve("extra") ? (
      <Extra key="e" acento={a.accent} oscuro={o.oscuro}>
        {pintar("extra", c.extra)}
      </Extra>
    ) : null,
    ve("cta") ? (
      <div key="c" style={{ display: "flex", marginTop: 8 }}>
        <Cta tam={o.cta}>{pintar("cta", c.cta)}</Cta>
      </div>
    ) : null,
  ];

  // ── Foto a sangre ──
  if (plantilla === "foto" && p.imagen) {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        <Fondo imagen={p.imagen} w={w} h={h} />
        {/* Velo: oscuro arriba (logo) y desde la mitad hacia abajo (texto). */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: w,
            height: h,
            display: "flex",
            backgroundImage: `linear-gradient(180deg, rgba(22,19,38,0.6) 0%, rgba(22,19,38,0) ${Math.round((pad.top / h) * 100) + 12}%, rgba(22,19,38,0) 28%, rgba(22,19,38,0.78) 54%, rgba(22,19,38,0.94) ${Math.round(((h - pad.bottom) / h) * 100)}%, rgba(22,19,38,0.96) 100%)`,
          }}
        />
        {cabecera("#ffffff", true)}
        <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 26 }}>
          {textos({
            oscuro: true,
            kickerFondo: a.accent,
            titularColor: "#ffffff",
            titularLh: 1.04,
            titularLs: 0.025,
            sombra: "0 2px 24px rgba(0,0,0,0.35)",
            sub: { size: 36, color: "rgba(255,255,255,0.9)", maxWidth: 900, sombra: "0 1px 12px rgba(0,0,0,0.4)" },
            cta: 34,
          })}
        </div>
      </div>
    );
  }

  // ── Foto con tarjeta blanca ──
  if (plantilla === "tarjeta" && p.imagen) {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        <Fondo imagen={p.imagen} w={w} h={h} />
        <div style={{ position: "absolute", top: 0, left: 0, width: w, height: h, display: "flex", backgroundImage: "linear-gradient(180deg, rgba(22,19,38,0.5) 0%, rgba(22,19,38,0) 22%)" }} />
        {cabecera("#ffffff", true)}
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
          {textos({
            oscuro: false,
            kickerFondo: a.accent,
            titularColor: "#161326",
            titularLh: 1.06,
            titularLs: 0.025,
            sub: { size: 32, color: "#514D69" },
            cta: 30,
          })}
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
      {cabecera("#ffffff", true)}
      <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 30 }}>
        {textos({
          oscuro: true,
          kickerFondo: "rgba(255,255,255,0.16)",
          titularColor: "#ffffff",
          titularLh: 1.02,
          titularLs: 0.03,
          sub: { size: 38, color: "rgba(255,255,255,0.84)", maxWidth: 920 },
          cta: 34,
        })}
      </div>
    </div>
  );
}
