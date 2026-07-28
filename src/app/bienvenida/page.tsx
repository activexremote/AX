import type { Metadata } from "next";

import { LandingView } from "@/components/landing/landing-view";

export const metadata: Metadata = {
  title: "ActiveXRemote · Campus de formación",
  description:
    "El campus interno donde el equipo de ActiveXRemote aprende a comunicar, colaborar y liderar en remoto.",
};

export default function LandingPage() {
  return <LandingView />;
}
