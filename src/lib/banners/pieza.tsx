import type { ReactNode } from "react";

import {
  ACENTO,
  ELEMENTOS_POR_DEFECTO,
  ETIQUETA_IA,
  FORMATOS,
  esNativo,
  lineasChat,
  BOTON_HEX,
  BOTON_POR_DEFECTO,
  puntos,
  type BannerCopy,
  type BotonEstilo,
  type Composicion,
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

export type CampoTexto = "kicker" | "headline" | "sub" | "extra" | "points" | "cta" | "chat";

/** Lo que entra por separado en el vídeo (video.tsx): cada texto, el logo, la tarjeta… */
export type Parte = "foto" | "logo" | "ia" | "tarjeta" | "kicker" | "headline" | "sub" | "points" | "extra" | "cta" | "chat";

/** Cómo está una parte en un instante del vídeo: cuánto se ve (0–1), cuánto se ha movido y, la foto, su zoom. */
export type Instante = { o: number; x?: number; y?: number; zoom?: number };

/** El instante de cada parte (y de cada mensaje o punto, por su índice). */
export type Animar = (parte: Parte, i?: number) => Instante;

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
  /** Dónde va cada cosa (formatos.ts → COMPOSICIONES). Por defecto, la clásica. */
  composicion?: Composicion;
  /** Cómo es el botón (formatos.ts → BotonEstilo). Por defecto, verde en pastilla. */
  boton?: BotonEstilo;
  /** Familia tipográfica: «Inter» en Satori; la variable de la app en el navegador. */
  fuente?: string;
  texto?: PintarTexto;
  /** En el editor, un elemento encendido pero vacío se ve (para poder escribir en él). */
  editando?: boolean;
  /** Un fotograma del vídeo: dónde está cada parte. Sin esto, la pieza quieta. */
  anim?: Animar;
};

const tal = (_c: CampoTexto, v: string) => v;

/** Un estilo sin las claves que no tienen valor: Satori revienta con `undefined`. */
const sin = <T extends Record<string, unknown>>(o: T): T => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;

/** Opacidad y desplazamiento de un instante del vídeo, con el giro que ya tuviera el elemento. */
function mover(m: Instante | undefined, giro?: number): { opacity?: number; transform?: string } {
  const tr = [m && (m.x || m.y) ? `translate(${Math.round(m.x ?? 0)}px, ${Math.round(m.y ?? 0)}px)` : "", giro ? `rotate(${giro}deg)` : ""].filter(Boolean).join(" ");
  return { ...(m && m.o < 1 ? { opacity: Math.max(0, Math.round(m.o * 1000) / 1000) } : {}), ...(tr ? { transform: tr } : {}) };
}

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

type Al = "flex-start" | "center" | "flex-end";

/** Sobre qué se pinta el botón: así un botón blanco no desaparece en un fondo claro. */
type FondoBoton = "oscuro" | "claro" | "acento";

function Cta({
  children,
  tam = 34,
  al = "flex-start",
  giro,
  b = BOTON_POR_DEFECTO,
  sobre = "oscuro",
  acento,
  mov,
}: {
  children: ReactNode;
  tam?: number;
  al?: Al;
  giro?: number;
  mov?: Instante;
  b?: BotonEstilo;
  sobre?: FondoBoton;
  /** El color de fondo cuando `sobre` es «acento». */
  acento?: string;
}) {
  // El color pedido, salvo que se confunda con lo que hay detrás.
  let hex = BOTON_HEX[b.color];
  if (sobre === "claro" && b.color === "blanco") hex = BOTON_HEX.negro;
  if (sobre === "oscuro" && b.color === "negro" && b.forma !== "pastilla" && b.forma !== "redondeado" && b.forma !== "recto" && b.forma !== "pegatina") hex = BOTON_HEX.blanco;
  if (sobre === "acento" && acento && hex.toLowerCase() === acento.toLowerCase()) hex = BOTON_HEX.blanco;
  const t = Math.round(tam * (b.tam === "s" ? 0.82 : b.tam === "l" ? 1.2 : 1));
  const tintaSobre = hex === BOTON_HEX.blanco || hex === BOTON_HEX.amarillo ? "#161326" : "#ffffff";
  const linea = b.forma === "contorno" || b.forma === "subrayado";
  const tinta = linea ? hex : tintaSobre;
  const radio = b.forma === "pastilla" || b.forma === "contorno" ? 999 : b.forma === "redondeado" ? Math.round(t * 0.4) : b.forma === "pegatina" ? 10 : 0;
  const giroFinal = giro ?? (b.forma === "pegatina" ? -3 : 0);
  const icono =
    b.icono === "ninguno" ? null : b.icono === "circulo" ? (
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: t * 1.15, height: t * 1.15, borderRadius: 999, background: tinta, color: linea ? "#161326" : hex, fontSize: t * 0.8 }}>→</span>
    ) : (
      <span>→</span>
    );
  return (
    <div
      style={sin({
        display: "flex",
        alignItems: "center",
        gap: t * 0.4,
        alignSelf: al,
        ...mover(mov, giroFinal),
        ...(linea ? {} : { background: hex }),
        ...(b.forma === "contorno" ? { border: `${Math.max(3, Math.round(t * 0.09))}px solid ${hex}` } : {}),
        ...(b.forma === "subrayado" ? { borderBottom: `${Math.max(3, Math.round(t * 0.1))}px solid ${hex}` } : {}),
        ...(b.forma === "pegatina" ? { boxShadow: "6px 6px 0 rgba(22,19,38,0.85)" } : {}),
        color: tinta,
        fontSize: t,
        fontWeight: b.forma === "recto" || b.forma === "pegatina" ? 800 : 700,
        ...(b.forma === "recto" ? { textTransform: "uppercase" as const, letterSpacing: t * 0.04 } : {}),
        padding: b.forma === "subrayado" ? `${t * 0.15}px 0` : b.icono === "circulo" ? `${t * 0.32}px ${t * 0.35}px ${t * 0.32}px ${t * 0.95}px` : `${t * 0.55}px ${t * 1.05}px`,
        borderRadius: radio,
      })}
    >
      <span style={{ display: "flex" }}>{children}</span>
      {icono}
    </div>
  );
}

function Kicker({ children, fondo, color = "#ffffff", al = "flex-start", giro, mov }: { children: ReactNode; fondo: string; color?: string; al?: Al; giro?: number; mov?: Instante }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: al,
        ...mover(mov, giro),
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
function Extra({ children, acento, oscuro, al = "flex-start", mov }: { children: ReactNode; acento: string; oscuro: boolean; al?: Al; mov?: Instante }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        alignSelf: al,
        gap: 14,
        fontSize: 30,
        fontWeight: 700,
        color: oscuro ? "#ffffff" : "#161326",
        border: `2px solid ${oscuro ? "rgba(255,255,255,0.5)" : "rgba(22,19,38,0.18)"}`,
        padding: "10px 22px",
        borderRadius: 14,
        ...mover(mov),
      }}
    >
      <div style={{ display: "flex", width: 14, height: 14, borderRadius: 999, background: acento }} />
      <span style={{ display: "flex" }}>{children}</span>
    </div>
  );
}

function Puntos({
  items,
  acento,
  oscuro,
  pintar,
  al = "flex-start",
  mov,
}: {
  items: string[];
  acento: string;
  oscuro: boolean;
  pintar: (v: string, i: number) => ReactNode;
  al?: Al;
  mov?: (i: number) => Instante | undefined;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignSelf: al }}>
      {items.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, fontSize: 32, fontWeight: 500, lineHeight: 1.3, color: oscuro ? "rgba(255,255,255,0.92)" : "#3A3655", ...mover(mov?.(i)) }}>
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

function Fondo({ imagen, w, h, mov }: { imagen: string; w: number; h: number; mov?: Instante }) {
  // En el vídeo, la foto se acerca despacio: más grande que su caja y centrada
  // (la caja recorta), sin `transform`, que Satori no escala bien.
  const z = mov?.zoom ?? 1;
  const [zw, zh] = [Math.round(w * z), Math.round(h * z)];
  const [left, top] = [Math.round((w - zw) / 2 + (mov?.x ?? 0)), Math.round((h - zh) / 2 + (mov?.y ?? 0))];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- Satori y vista previa, no una imagen de la web
    <img src={imagen} alt="" width={zw} height={zh} style={{ position: "absolute", top, left, width: zw, height: zh, objectFit: "cover" }} />
  );
}

export function Banner(p: Pieza) {
  const f = FORMATOS[p.formato];
  const a = ACENTO[p.course];
  const { w, h, safe } = f;
  const c = p.copy;
  const el = p.elementos ?? ELEMENTOS_POR_DEFECTO;
  const pintar = p.texto ?? tal;
  const boton = p.boton ?? BOTON_POR_DEFECTO;
  // En el vídeo, el instante de cada parte; quieta, nada.
  const ins = (parte: Parte, i = 0) => p.anim?.(parte, i);
  const mov = (parte: Parte, i = 0) => mover(ins(parte, i));
  const plantilla: Plantilla = p.imagen ? p.template : "marca";
  const titular = tamTitular(c.headline, plantilla, p.formato);
  // Lo de arriba (logo, etiqueta de IA) y lo de abajo (texto) respetan la zona segura.
  const pad = { top: safe.top, bottom: safe.bottom, side: safe.side + 12 };

  // Se ve si está encendido y tiene texto; en el editor, aunque esté vacío.
  const ve = (k: Exclude<CampoTexto, "chat">) => el[k] && (Boolean(c[k].trim()) || Boolean(p.editando));
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
        {el.logo ? (
          <div style={{ display: "flex", ...mov("logo") }}>
            <Lockup color={color} />
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
        {el.aiLabel && p.imagen ? (
          <div style={{ display: "flex", ...mov("ia") }}>
            <EtiquetaIa texto={ETIQUETA_IA[p.language]} oscuro={oscuro} />
          </div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
      </div>
    ) : null;

  /** El bloque de texto, igual en las tres plantillas salvo los colores. */
  const textos = (o: {
    oscuro: boolean;
    kickerFondo: string;
    kickerColor?: string;
    titularColor: string;
    titularLh: number;
    titularLs: number;
    sombra?: string;
    sub: { size: number; color: string; maxWidth?: number; sombra?: string };
    cta: number;
    /** Alineación de todo el bloque (las composiciones centradas). */
    al?: Al;
    /** Tamaño del titular, si la composición pide otro. */
    tam?: number;
    mayus?: boolean;
    sinCta?: boolean;
    sinKicker?: boolean;
    sinTitular?: boolean;
  }) => {
    const al = o.al ?? "flex-start";
    const alinear = al === "center" ? ("center" as const) : al === "flex-end" ? ("right" as const) : undefined;
    const tam = o.tam ?? titular;
    return [
      ve("kicker") && !o.sinKicker ? (
        <Kicker key="k" fondo={o.kickerFondo} color={o.kickerColor} al={al} mov={ins("kicker")}>
          {pintar("kicker", c.kicker)}
        </Kicker>
      ) : null,
      ve("headline") && !o.sinTitular ? (
        <div
          key="h"
          style={sin({
            display: "flex",
            justifyContent: al,
            ...(alinear ? { textAlign: alinear } : {}),
            fontSize: tam,
            fontWeight: 800,
            lineHeight: o.titularLh,
            letterSpacing: -tam * o.titularLs,
            ...(o.mayus ? { textTransform: "uppercase" as const } : {}),
            color: o.titularColor,
            textShadow: o.sombra,
            ...mov("headline"),
          })}
        >
          {pintar("headline", c.headline)}
        </div>
      ) : null,
      ve("sub") ? (
        <div key="s" style={sin({ display: "flex", justifyContent: al, ...(alinear ? { textAlign: alinear } : {}), alignSelf: al, fontSize: o.sub.size, fontWeight: 500, lineHeight: 1.35, color: o.sub.color, maxWidth: o.sub.maxWidth, textShadow: o.sub.sombra, ...mov("sub") })}>
          {pintar("sub", c.sub)}
        </div>
      ) : null,
      el.points && items.length ? <Puntos key="p" items={items} acento={a.accent} oscuro={o.oscuro} al={al} pintar={(v, i) => pintar("points", v, i)} mov={(i) => ins("points", i)} /> : null,
      ve("extra") ? (
        <Extra key="e" acento={a.accent} oscuro={o.oscuro} al={al} mov={ins("extra")}>
          {pintar("extra", c.extra)}
        </Extra>
      ) : null,
      ve("cta") && !o.sinCta ? (
        <div key="c" style={{ display: "flex", marginTop: 8, justifyContent: al, ...mov("cta") }}>
          <Cta tam={o.cta} al={al} b={boton} sobre={o.oscuro ? "oscuro" : "claro"}>
            {pintar("cta", c.cta)}
          </Cta>
        </div>
      ) : null,
    ];
  };

  const composicion = p.composicion ?? "clasica";

  // ══ Las composiciones que no son la clásica ══
  // Con la plantilla «marca» no hay foto aunque la variante tenga una.
  const foto = plantilla === "marca" ? null : p.imagen;
  // Ojo con Satori: un estilo con valor `undefined` revienta el PNG. Lo que
  // es opcional va con `...(x ? { prop: x } : {})`.
  // La imagen (o, sin imagen, el mesh del curso) en una caja: a sangre o en un hueco.
  const imagenEn = (x: number, y: number, iw: number, ih: number, extra?: { radio?: number; giro?: number; sombra?: string; borde?: string }) => (
    <div
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: iw,
        height: ih,
        display: "flex",
        overflow: "hidden",
        borderRadius: extra?.radio ?? 0,
        // Satori no acepta `transform`, `boxShadow` ni `border` sin valor: o
        // los lleva o no están.
        ...(extra?.giro ? { transform: `rotate(${extra.giro}deg)` } : {}),
        ...(extra?.sombra ? { boxShadow: extra.sombra } : {}),
        ...(extra?.borde ? { border: extra.borde } : {}),
        ...(foto ? {} : { backgroundImage: a.mesh }),
        backgroundColor: "#241246",
      }}
    >
      {foto ? <Fondo imagen={foto} w={iw} h={ih} mov={ins("foto")} /> : null}
    </div>
  );
  const capa = (fondo: string, opacidad = 1) => (
    <div style={{ position: "absolute", top: 0, left: 0, width: w, height: h, display: "flex", ...(fondo.includes("gradient") ? { backgroundImage: fondo } : { backgroundColor: fondo }), opacity: opacidad }} />
  );
  const etiquetaIa = (oscuro: boolean, top = pad.top, right = pad.side) =>
    el.aiLabel && foto ? (
      <div style={{ position: "absolute", top, right, display: "flex", ...mov("ia") }}>
        <EtiquetaIa texto={ETIQUETA_IA[p.language]} oscuro={oscuro} />
      </div>
    ) : null;
  const logoEn = (color: string, estilo: Record<string, number | string>, size?: number) =>
    el.logo ? (
      <div style={{ position: "absolute", display: "flex", ...estilo, ...mov("logo") }}>
        <Lockup color={color} size={size} />
      </div>
    ) : null;
  const claro = { oscuro: false, kickerFondo: a.accent, titularColor: "#161326", titularLh: 1.05, titularLs: 0.025, sub: { size: 32, color: "#514D69" }, cta: 30 };
  const oscuro = {
    oscuro: true,
    kickerFondo: a.accent,
    titularColor: "#ffffff",
    titularLh: 1.04,
    titularLs: 0.025,
    sombra: "0 2px 24px rgba(0,0,0,0.35)",
    sub: { size: 34, color: "rgba(255,255,255,0.9)", maxWidth: 900, sombra: "0 1px 12px rgba(0,0,0,0.4)" },
    cta: 32,
  };
  const alto = h - pad.top - pad.bottom; // lo que queda dentro de la zona segura

  // ══ Los nativos: capturas de chat, correo, tuit… ══
  // No llevan foto ni etiqueta de IA. Sin `chat`, se arman con el titular y
  // la línea de apoyo para que nunca salgan vacíos.
  if (esNativo(composicion)) {
    const es = p.language === "es";
    const conChat = lineasChat(c);
    const msgs = conChat.length ? conChat : [c.headline, c.sub].filter(Boolean).map((t, i) => ({ yo: i % 2 === 0, t }));
    // Quien escribe es siempre la marca: una etiqueta («ROMPE LA BARRERA») como
    // nombre de contacto no tendría sentido.
    const marca = "ActiveXRemote";
    const linea = (t: string, i: number) => pintar("chat", t, i);
    const avatar = (d: number, fondo = a.mesh) => (
      <div style={{ display: "flex", width: d, height: d, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundImage: fondo, backgroundColor: "#241246", flexShrink: 0 }}>
        <svg width={d * 0.5} height={(d * 0.5 * 28) / 46} viewBox="0 0 46 28" fill="none" stroke="#ffffff" strokeWidth={2.4}>
          <path d="M11 2 L20 26 L2 26 Z" />
          <path d="M26 2 L44 2 L35 14 Z" />
          <path d="M26 26 L44 26 L35 14 Z" />
        </svg>
      </div>
    );
    const ctaNativo = (sobre: "oscuro" | "claro" = "claro", al: Al = "center") =>
      ve("cta") ? (
        <div style={{ display: "flex", justifyContent: al === "center" ? "center" : "flex-start", marginTop: 12, ...mov("cta") }}>
          <Cta tam={34} b={boton} sobre={sobre} al={al}>
            {pintar("cta", c.cta)}
          </Cta>
        </div>
      ) : null;
    const horas = ["09:41", "09:42", "09:42", "09:44", "09:45", "09:45", "09:47", "09:48"];

    if (composicion === "whatsapp" || composicion === "telegram") {
      const wa = composicion === "whatsapp";
      const cab = pad.top + 110;
      return (
        <div style={{ ...raiz, ...(wa ? { background: "#EFE7DD" } : { backgroundImage: "linear-gradient(160deg, #A9D3A0 0%, #D7E6B0 50%, #9CCBB5 100%)" }) }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: w, height: cab, display: "flex", alignItems: "flex-end", background: wa ? "#075E54" : "#ffffff", padding: `0 ${pad.side}px 22px`, ...(wa ? {} : { boxShadow: "0 2px 10px rgba(0,0,0,0.12)" }) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <span style={{ display: "flex", fontSize: 46, color: wa ? "#ffffff" : "#3390EC" }}>‹</span>
              {avatar(76)}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ display: "flex", fontSize: 36, fontWeight: 700, color: wa ? "#ffffff" : "#161326" }}>{marca}</span>
                <span style={{ display: "flex", fontSize: 24, color: wa ? "rgba(255,255,255,0.8)" : "#3390EC" }}>{es ? "en línea" : "online"}</span>
              </div>
            </div>
          </div>
          <div style={{ position: "absolute", top: cab + 34, left: pad.side - 20, right: pad.side - 20, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 16 }}>
            {ve("headline") ? (
              <div style={{ display: "flex", alignSelf: "center", maxWidth: "86%", background: wa ? "#FFF3C4" : "rgba(40,60,40,0.42)", color: wa ? "#54470F" : "#ffffff", fontSize: 26, fontWeight: 500, padding: "10px 22px", borderRadius: 14, textAlign: "center", marginBottom: 6, ...mov("headline") }}>
                {pintar("headline", c.headline)}
              </div>
            ) : null}
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.yo ? "flex-end" : "flex-start", ...mov("chat", i) }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "80%",
                    background: m.yo ? (wa ? "#D9FDD3" : "#EEFFDE") : "#ffffff",
                    borderRadius: 22,
                    ...(m.yo ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 }),
                    padding: "16px 24px 10px",
                    boxShadow: "0 1px 1px rgba(0,0,0,0.12)",
                  }}
                >
                  <div style={{ display: "flex", fontSize: 36, lineHeight: 1.3, color: "#111B21" }}>{conChat.length ? linea(m.t, i) : m.t}</div>
                  <div style={{ display: "flex", alignSelf: "flex-end", fontSize: 20, color: m.yo && !wa ? "#4FAE4E" : "#667781", marginTop: 4 }}>
                    {horas[i % horas.length]}
                    {m.yo ? (wa ? " ✓✓" : " ✓✓") : ""}
                  </div>
                </div>
              </div>
            ))}
            {ctaNativo("claro")}
          </div>
        </div>
      );
    }

    if (composicion === "email") {
      return (
        <div style={{ ...raiz, background: "#ffffff" }}>
          <div style={{ position: "absolute", top: pad.top, left: pad.side, right: pad.side, display: "flex", alignItems: "center", gap: 20, background: "#EEF1F6", borderRadius: 999, padding: "20px 30px" }}>
            {/* Inter no tiene ☰ ni ⋯: los iconos van dibujados. */}
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            <span style={{ display: "flex", fontSize: 28, color: "#5F6368" }}>{es ? "Buscar en el correo" : "Search mail"}</span>
          </div>
          <div style={{ position: "absolute", top: pad.top + 140, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 26 }}>
            {ve("headline") ? (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, ...mov("headline") }}>
                <span style={{ display: "flex", fontSize: 50, fontWeight: 700, lineHeight: 1.15, color: "#1F1F1F" }}>{pintar("headline", c.headline)}</span>
                <span style={{ display: "flex", fontSize: 22, color: "#444746", background: "#E8EAED", borderRadius: 6, padding: "4px 12px" }}>{es ? "Recibidos" : "Inbox"}</span>
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 20, ...mov("tarjeta") }}>
              {avatar(72)}
              <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#1F1F1F" }}>{marca}</span>
                  <span style={{ display: "flex", fontSize: 24, color: "#5F6368" }}>09:41</span>
                </div>
                <span style={{ display: "flex", fontSize: 24, color: "#5F6368" }}>{es ? "para mí" : "to me"}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: 38, lineHeight: 1.45, color: "#1F1F1F" }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: "flex", ...mov("chat", i) }}>
                  {conChat.length ? linea(m.t, i) : m.t}
                </div>
              ))}
            </div>
            {ctaNativo("claro", "flex-start")}
          </div>
        </div>
      );
    }

    if (composicion === "tweet") {
      return (
        <div style={{ ...raiz, backgroundImage: a.mesh, backgroundColor: "#241246" }}>
          {logoEn("#ffffff", { top: pad.top, left: pad.side })}
          <div style={{ position: "absolute", top: pad.top + 90, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 26, background: "#ffffff", borderRadius: 28, padding: "44px 46px", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", ...mov("tarjeta") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {avatar(84)}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", fontSize: 32, fontWeight: 800, color: "#0F1419" }}>{marca}</span>
                  <span style={{ display: "flex", fontSize: 26, color: "#536471" }}>The Remote Business School</span>
                </div>
              </div>
              {ve("headline") ? <div style={{ display: "flex", fontSize: 46, fontWeight: 700, lineHeight: 1.25, color: "#0F1419", ...mov("headline") }}>{pintar("headline", c.headline)}</div> : null}
              {conChat.length ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 38, lineHeight: 1.35, color: "#0F1419" }}>
                  {conChat.map((m, i) => (
                    <div key={i} style={{ display: "flex", ...mov("chat", i) }}>
                      {linea(m.t, i)}
                    </div>
                  ))}
                </div>
              ) : null}
              <div style={{ display: "flex", fontSize: 24, color: "#536471", borderTop: "1px solid #EFF3F4", paddingTop: 20 }}>09:41 · {es ? "9 ene" : "Jan 9"}</div>
            </div>
            {ctaNativo("oscuro")}
          </div>
        </div>
      );
    }

    if (composicion === "notas") {
      return (
        <div style={{ ...raiz, background: "#FBF8EF" }}>
          <div style={{ position: "absolute", top: pad.top, left: pad.side, right: pad.side, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#D99A00", fontSize: 32, fontWeight: 500 }}>
            <span style={{ display: "flex" }}>‹ {es ? "Notas" : "Notes"}</span>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#D99A00"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
          </div>
          <div style={{ position: "absolute", top: pad.top + 110, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 26 }}>
            <span style={{ display: "flex", fontSize: 24, color: "#9A9488", alignSelf: "center" }}>{es ? "9 de enero · 09:41" : "January 9 · 09:41"}</span>
            {ve("headline") ? <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1.1, color: "#1C1A16", ...mov("headline") }}>{pintar("headline", c.headline)}</div> : null}
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, fontSize: 42, lineHeight: 1.3, color: "#1C1A16", ...mov("chat", i) }}>
                <div style={{ display: "flex", width: 44, height: 44, borderRadius: 999, flexShrink: 0, alignItems: "center", justifyContent: "center", ...(i < msgs.length - 1 ? { background: "#D99A00", color: "#ffffff" } : { border: "3px solid #C9C2B4" }), fontSize: 28 }}>
                  {i < msgs.length - 1 ? "✓" : ""}
                </div>
                <div style={{ display: "flex", ...(i < msgs.length - 1 ? { color: "#6F6A60" } : {}) }}>{conChat.length ? linea(m.t, i) : m.t}</div>
              </div>
            ))}
            {ctaNativo("claro", "flex-start")}
          </div>
        </div>
      );
    }

    if (composicion === "buscador") {
      return (
        <div style={{ ...raiz, background: "#F6F7FB" }}>
          {logoEn("#161326", { top: pad.top, left: 0, width: w, justifyContent: "center" }, 30)}
          <div style={{ position: "absolute", top: pad.top + 110, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: 34, boxShadow: "0 8px 30px rgba(22,19,38,0.12)", overflow: "hidden", ...mov("headline") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 34px", borderBottom: "1px solid #ECECF1" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#5F6368" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                <span style={{ display: "flex", fontSize: 38, color: "#1F1F1F" }}>{ve("headline") ? pintar("headline", c.headline) : c.headline}</span>
                <span style={{ display: "flex", width: 3, height: 44, background: a.accent }} />
              </div>
              {conChat.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 34px", fontSize: 32, color: "#3C4043", ...mov("chat", i) }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9AA0A6" strokeWidth="2.4"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                  <span style={{ display: "flex" }}>{linea(m.t, i)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#ffffff", borderRadius: 24, padding: "30px 34px", boxShadow: "0 2px 10px rgba(22,19,38,0.06)", ...mov("sub") }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {avatar(44)}
                <span style={{ display: "flex", fontSize: 26, color: "#4D5156" }}>activexremote.com</span>
              </div>
              {ve("sub") ? <div style={{ display: "flex", fontSize: 38, fontWeight: 500, lineHeight: 1.25, color: "#1A0DAB" }}>{pintar("sub", c.sub)}</div> : null}
              {ve("extra") ? <div style={{ display: "flex", fontSize: 28, color: "#4D5156" }}>{pintar("extra", c.extra)}</div> : null}
            </div>
            {ctaNativo("claro", "flex-start")}
          </div>
        </div>
      );
    }

    if (composicion === "calendario") {
      return (
        <div style={{ ...raiz, backgroundImage: a.mesh, backgroundColor: "#241246" }}>
          {logoEn("#ffffff", { top: pad.top, left: pad.side })}
          <div style={{ position: "absolute", top: pad.top + 90, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
            <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", ...mov("tarjeta") }}>
              <div style={{ display: "flex", height: 18, background: a.accent }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "40px 46px 46px" }}>
                <span style={{ display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: a.accent }}>{es ? "Invitación" : "Invitation"}</span>
                {ve("headline") ? <div style={{ display: "flex", fontSize: 54, fontWeight: 800, lineHeight: 1.1, color: "#161326", ...mov("headline") }}>{pintar("headline", c.headline)}</div> : null}
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34, color: "#3A3655", ...mov("chat", i) }}>
                    <div style={{ display: "flex", width: 16, height: 16, borderRadius: 4, background: i === 0 ? a.accent : "#C9C6D6", flexShrink: 0 }} />
                    <span style={{ display: "flex" }}>{conChat.length ? linea(m.t, i) : m.t}</span>
                  </div>
                ))}
              </div>
            </div>
            {ctaNativo("oscuro")}
          </div>
        </div>
      );
    }

    // billete
    const [desde, hasta] = [msgs[0]?.t ?? (es ? "Tu casa" : "Home"), msgs[1]?.t ?? (es ? "El mundo" : "The world")];
    return (
      <div style={{ ...raiz, backgroundImage: a.mesh, backgroundColor: "#241246" }}>
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        <div style={{ position: "absolute", top: pad.top + 90, left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
          <div style={{ display: "flex", flexDirection: "column", background: "#ffffff", borderRadius: 30, boxShadow: "0 30px 80px rgba(0,0,0,0.35)", ...mov("tarjeta") }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "30px 44px", background: "#161326", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
              <span style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#ffffff" }}>{es ? "TARJETA DE EMBARQUE" : "BOARDING PASS"}</span>
              <span style={{ display: "flex", fontSize: 24, fontWeight: 700, color: a.accent === "#5B4BF5" ? "#B9B2FF" : "#FFB59E" }}>AXR · 2027</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "40px 44px 26px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "40%", ...mov("chat", 0) }}>
                <span style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "#8A86A0" }}>{es ? "DESDE" : "FROM"}</span>
                <span style={{ display: "flex", fontSize: 44, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase", color: "#161326" }}>{conChat.length ? linea(desde, 0) : desde}</span>
              </div>
              <svg width="70" height="70" viewBox="0 0 24 24" fill={a.accent}><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: "40%", alignItems: "flex-end", ...mov("chat", 1) }}>
                <span style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 3, color: "#8A86A0" }}>{es ? "HASTA" : "TO"}</span>
                <span style={{ display: "flex", fontSize: 44, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase", textAlign: "right", color: a.accent }}>{conChat.length > 1 ? linea(hasta, 1) : hasta}</span>
              </div>
            </div>
            <div style={{ display: "flex", margin: "0 44px", borderTop: "4px dashed #DAD7E6" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "30px 44px 40px" }}>
              {ve("headline") ? <div style={{ display: "flex", fontSize: 44, fontWeight: 800, lineHeight: 1.12, color: "#161326", ...mov("headline") }}>{pintar("headline", c.headline)}</div> : null}
              <div style={{ display: "flex", gap: 40 }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", fontSize: 20, fontWeight: 700, letterSpacing: 3, color: "#8A86A0" }}>{es ? "SALIDA" : "DEPARTS"}</span>
                  <span style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#161326" }}>{ve("extra") ? pintar("extra", c.extra) : es ? "9 ENE" : "JAN 9"}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ display: "flex", fontSize: 20, fontWeight: 700, letterSpacing: 3, color: "#8A86A0" }}>{es ? "PUERTA" : "GATE"}</span>
                  <span style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#161326" }}>14</span>
                </div>
              </div>
            </div>
          </div>
          {ctaNativo("oscuro")}
        </div>
      </div>
    );
  }


  if (composicion === "centrado") {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        {imagenEn(0, 0, w, h)}
        {capa("rgba(22,19,38,0.58)")}
        {logoEn("#ffffff", { top: pad.top, left: 0, width: w, justifyContent: "center" })}
        {etiquetaIa(true)}
        <div style={{ position: "absolute", top: pad.top + 80, left: pad.side, width: w - pad.side * 2, height: alto - 80, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28 }}>
          {textos({ ...oscuro, al: "center", tam: titular + 6, sub: { ...oscuro.sub, maxWidth: 860 } })}
        </div>
      </div>
    );
  }

  if (composicion === "arriba") {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        {imagenEn(0, 0, w, h)}
        {capa("linear-gradient(180deg, rgba(22,19,38,0.92) 0%, rgba(22,19,38,0.75) 38%, rgba(22,19,38,0) 62%, rgba(22,19,38,0) 78%, rgba(22,19,38,0.55) 100%)")}
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        {etiquetaIa(true)}
        <div style={{ position: "absolute", top: pad.top + 90, left: pad.side, right: pad.side, display: "flex", flexDirection: "column", gap: 24 }}>
          {textos({ ...oscuro, sinCta: true })}
        </div>
        {ve("cta") ? (
          <div style={{ position: "absolute", bottom: pad.bottom, left: pad.side, display: "flex", ...mov("cta") }}>
            <Cta tam={34} b={boton}>{pintar("cta", c.cta)}</Cta>
          </div>
        ) : null}
      </div>
    );
  }

  if (composicion === "panel") {
    const color = p.course === "remote-founder" ? "#2A0F2C" : "#161326";
    if (p.formato === "post") {
      const corte = Math.round(w * 0.52);
      return (
        <div style={{ ...raiz, background: color }}>
          {imagenEn(corte, 0, w - corte, h)}
          <div style={{ position: "absolute", top: 0, left: corte - 8, width: 8, height: h, display: "flex", background: a.accent }} />
          {logoEn("#ffffff", { top: pad.top, left: pad.side }, 28)}
          {etiquetaIa(true)}
          <div style={{ position: "absolute", top: pad.top + 80, left: pad.side, width: corte - pad.side * 2, height: alto - 80, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
            {textos({ ...oscuro, sombra: undefined, tam: Math.round(titular * 0.72), sub: { size: 28, color: "rgba(255,255,255,0.82)" }, cta: 28 })}
          </div>
        </div>
      );
    }
    // Vertical: imagen arriba y bloque abajo. Historia: al revés, porque abajo
    // lo tapa la interfaz.
    const historia = p.formato === "story";
    const corte = Math.round(h * (historia ? 0.6 : 0.5));
    return (
      <div style={{ ...raiz, background: color }}>
        {historia ? imagenEn(0, corte, w, h - corte) : imagenEn(0, 0, w, corte)}
        <div style={{ position: "absolute", top: corte - 4, left: 0, width: w, height: 8, display: "flex", background: a.accent }} />
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        {etiquetaIa(true, historia ? corte + 30 : pad.top)}
        <div
          style={{
            position: "absolute",
            left: pad.side,
            right: pad.side,
            top: historia ? pad.top + 100 : corte + 56,
            bottom: historia ? h - corte + 50 : pad.bottom,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {textos({ ...oscuro, sombra: undefined, tam: Math.round(titular * 0.86), sub: { size: 32, color: "rgba(255,255,255,0.82)" } })}
        </div>
      </div>
    );
  }

  if (composicion === "marco") {
    const papel = "#F4F1EA";
    const iw = w - pad.side * 2 - 40;
    // La foto se queda con lo que no necesita el texto, que va debajo.
    const ih = Math.round(Math.min(iw * 0.95, alto - 90 - (p.formato === "post" ? 430 : 480)));
    const y = pad.top + 90;
    return (
      <div style={{ ...raiz, background: papel }}>
        {logoEn("#161326", { top: pad.top, left: pad.side })}
        {imagenEn(pad.side + 20, y, iw, ih, { radio: 6, giro: -2, sombra: "0 24px 60px rgba(22,19,38,0.28)", borde: "14px solid #ffffff" })}
        {etiquetaIa(true, y + 30, pad.side + 40)}
        <div style={{ position: "absolute", top: y + ih + 56, left: pad.side, right: pad.side, display: "flex", flexDirection: "column", gap: 18 }}>
          {textos({ ...claro, tam: Math.round(titular * 0.74) })}
        </div>
      </div>
    );
  }

  if (composicion === "cinta") {
    const y = pad.top + Math.round(alto * 0.34);
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        {imagenEn(0, 0, w, h)}
        {capa("linear-gradient(180deg, rgba(22,19,38,0.5) 0%, rgba(22,19,38,0) 25%, rgba(22,19,38,0) 55%, rgba(22,19,38,0.85) 100%)")}
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        {etiquetaIa(true)}
        {ve("kicker") ? (
          <div style={{ position: "absolute", top: y - 90, left: pad.side + 20, display: "flex" }}>
            <Kicker fondo="#ffffff" color="#161326" giro={-6} mov={ins("kicker")}>
              {pintar("kicker", c.kicker)}
            </Kicker>
          </div>
        ) : null}
        {ve("headline") ? (
          <div
            style={{
              position: "absolute",
              top: y,
              left: -60,
              width: w + 120,
              display: "flex",
              ...mover(ins("headline"), -6),
              background: a.accent,
              padding: `38px ${pad.side + 80}px`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", fontSize: Math.round(titular * 0.84), fontWeight: 800, lineHeight: 1.04, letterSpacing: -titular * 0.02, color: "#ffffff" }}>{pintar("headline", c.headline)}</div>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 22 }}>
          {textos({ ...oscuro, sinKicker: true, sinTitular: true })}
        </div>
      </div>
    );
  }

  if (composicion === "gigante") {
    return (
      <div style={{ ...raiz, background: a.accent }}>
        {imagenEn(0, 0, w, h)}
        {capa(a.accent, 0.82)}
        {capa("linear-gradient(180deg, rgba(22,19,38,0) 55%, rgba(22,19,38,0.55) 100%)")}
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        {etiquetaIa(true)}
        <div style={{ position: "absolute", top: pad.top + 100, left: pad.side, right: pad.side, display: "flex", flexDirection: "column", gap: 22 }}>
          {textos({ ...oscuro, kickerFondo: "#161326", sombra: undefined, mayus: true, titularLh: 0.98, titularLs: 0.035, tam: Math.round(titular * 1.28), sinCta: true, sub: { size: 34, color: "#ffffff", maxWidth: 880 } })}
        </div>
        {ve("cta") ? (
          <div style={{ position: "absolute", bottom: pad.bottom, right: pad.side, display: "flex", ...mov("cta") }}>
            <Cta tam={34} b={boton} sobre="acento" acento={a.accent}>{pintar("cta", c.cta)}</Cta>
          </div>
        ) : null}
      </div>
    );
  }

  if (composicion === "bocadillo") {
    const y = pad.top + 110;
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        {imagenEn(0, 0, w, h)}
        {capa("linear-gradient(180deg, rgba(22,19,38,0.45) 0%, rgba(22,19,38,0) 20%, rgba(22,19,38,0) 62%, rgba(22,19,38,0.8) 100%)")}
        {logoEn("#ffffff", { top: pad.top, left: pad.side })}
        {etiquetaIa(true)}
        {ve("headline") ? (
          <div style={{ position: "absolute", top: y, left: pad.side, width: Math.round(w * 0.8), display: "flex", flexDirection: "column", ...mov("headline") }}>
            <div style={{ display: "flex", background: "#ffffff", borderRadius: 44, padding: "44px 48px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
              <div style={{ display: "flex", fontSize: Math.round(titular * 0.78), fontWeight: 800, lineHeight: 1.06, letterSpacing: -titular * 0.02, color: "#161326" }}>{pintar("headline", c.headline)}</div>
            </div>
            {/* El pico del bocadillo. */}
            <div style={{ display: "flex", width: 56, height: 56, background: "#ffffff", marginTop: -30, marginLeft: 90, transform: "rotate(45deg)" }} />
          </div>
        ) : null}
        {ve("kicker") ? (
          <div style={{ position: "absolute", top: y - 44, left: pad.side + 30, display: "flex" }}>
            <Kicker fondo="#FFD84D" color="#161326" giro={-4} mov={ins("kicker")}>
              {pintar("kicker", c.kicker)}
            </Kicker>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: pad.side, right: pad.side, bottom: pad.bottom, display: "flex", flexDirection: "column", gap: 20 }}>
          {textos({ ...oscuro, sinKicker: true, sinTitular: true, sinCta: true })}
          {ve("cta") ? (
            <div style={{ display: "flex", justifyContent: "flex-end", ...mov("cta") }}>
              <Cta tam={34} giro={-3} b={boton}>
                {pintar("cta", c.cta)}
              </Cta>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (composicion === "revista") {
    const m = 30;
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        {imagenEn(0, 0, w, h)}
        {capa("linear-gradient(180deg, rgba(22,19,38,0.55) 0%, rgba(22,19,38,0) 22%, rgba(22,19,38,0) 48%, rgba(22,19,38,0.9) 100%)")}
        <div style={{ position: "absolute", top: m, left: m, width: w - m * 2, height: h - m * 2, display: "flex", border: "4px solid rgba(255,255,255,0.9)" }} />
        {logoEn("#ffffff", { top: pad.top + 10, left: 0, width: w, justifyContent: "center" }, 46)}
        {ve("kicker") ? (
          <div style={{ position: "absolute", top: pad.top + 90, left: 0, width: w, display: "flex", justifyContent: "center", ...mov("kicker") }}>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase", color: "#ffffff", borderTop: "2px solid #ffffff", borderBottom: "2px solid #ffffff", padding: "8px 18px" }}>{pintar("kicker", c.kicker)}</div>
          </div>
        ) : null}
        {etiquetaIa(true, pad.top + 14, m + 24)}
        <div style={{ position: "absolute", left: pad.side + 20, right: pad.side + 20, bottom: pad.bottom + 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          {textos({ ...oscuro, al: "center", sinKicker: true, sub: { ...oscuro.sub, maxWidth: 820 } })}
        </div>
      </div>
    );
  }

  // ── Foto a sangre ──
  if (plantilla === "foto" && p.imagen) {
    return (
      <div style={{ ...raiz, background: "#161326" }}>
        <Fondo imagen={p.imagen} w={w} h={h} mov={ins("foto")} />
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
        <Fondo imagen={p.imagen} w={w} h={h} mov={ins("foto")} />
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
            ...mov("tarjeta"),
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
