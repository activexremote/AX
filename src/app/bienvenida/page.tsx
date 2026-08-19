import type { Metadata, Viewport } from "next";

import { LandingView } from "@/components/landing/landing-view";

export const metadata: Metadata = {
  title: "ActiveXRemote · The Remote Business School",
  description:
    "Consigue el empleo remoto internacional que mereces y aprende a construir tu propio negocio global. 14 módulos en directo, dos cursos: Remote Professional y Remote Founder.",
};

// La barra del ticker tiñe la UI de Safari; `cover` deja que el mesh y el
// footer lleguen al borde de la pantalla (el contenido se aparta del notch
// con env(safe-area-inset-*) en landing.scss).
export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export default function LandingPage() {
  return <LandingView />;
}
