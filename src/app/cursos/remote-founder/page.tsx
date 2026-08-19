import type { Metadata, Viewport } from "next";

import { CourseView } from "@/components/landing/course-view";
import { courseCopy } from "@/app/cursos/copy";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return courseCopy[locale]["remote-founder"].meta;
}

// La barra del ticker tiñe la UI de Safari; `cover` deja que el mesh y el
// footer lleguen al borde de la pantalla (el contenido se aparta del notch
// con env(safe-area-inset-*) en landing.scss).
export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export default function RemoteFounderPage() {
  return <CourseView slug="remote-founder" />;
}
