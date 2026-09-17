import { ImageResponse } from "next/og";

// Tarjeta que se ve al compartir cualquier URL del sitio. Se genera aquí en
// vez de subir un PNG para que no se quede desfasada al cambiar la marca, y
// porque hasta ahora se declaraba `summary_large_image` sin ninguna imagen
// detrás: el resultado era una tarjeta en blanco en WhatsApp y LinkedIn.

export const alt = "ActiveXRemote · The Remote Business School";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #161326 0%, #2b1d5e 55%, #5b3df5 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#fff",
              color: "#161326",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            ΔX
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2 }}>
              ACTIVEXREMOTE
            </span>
            <span style={{ fontSize: 18, opacity: 0.72 }}>The Remote Business School</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.05, maxWidth: 960 }}>
            Trabaja sin fronteras.
          </span>
          <span style={{ fontSize: 30, opacity: 0.78, maxWidth: 900 }}>
            14 módulos en directo · Remote Professional y Remote Founder
          </span>
        </div>

        <div style={{ display: "flex", gap: 28, fontSize: 22, opacity: 0.62 }}>
          <span>56 h en directo</span>
          <span>·</span>
          <span>7 fines de semana</span>
          <span>·</span>
          <span>2 cursos</span>
        </div>
      </div>
    ),
    size,
  );
}
