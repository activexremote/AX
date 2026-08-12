import type { Metadata } from "next";

import { LandingView } from "@/components/landing/landing-view";

export const metadata: Metadata = {
  title: "ActiveXRemote · The Remote Business School",
  description:
    "Consigue el empleo remoto internacional que mereces y aprende a construir tu propio negocio global. 14 módulos en directo, dos cursos: Remote Professional y Remote Founder.",
};

export default function LandingPage() {
  return <LandingView />;
}
