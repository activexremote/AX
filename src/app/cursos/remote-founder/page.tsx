import type { Metadata, Viewport } from "next";

import { CourseView } from "@/components/landing/course-view";
import { CourseSchema, courseMetadata } from "@/app/cursos/seo";
import { getLocale } from "@/lib/i18n/server";

const SLUG = "remote-founder" as const;

export async function generateMetadata(): Promise<Metadata> {
  return courseMetadata(await getLocale(), SLUG);
}

// La barra del ticker tiñe la UI de Safari; `cover` deja que el mesh y el
// footer lleguen al borde de la pantalla (el contenido se aparta del notch
// con env(safe-area-inset-*) en landing.scss).
export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export default async function RemoteFounderPage() {
  const locale = await getLocale();
  return (
    <>
      <CourseSchema locale={locale} slug={SLUG} />
      <CourseView slug={SLUG} />
    </>
  );
}
