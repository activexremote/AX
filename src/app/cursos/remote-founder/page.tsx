import type { Metadata } from "next";

import { CourseView } from "@/components/landing/course-view";
import { courseCopy } from "@/app/cursos/copy";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return courseCopy[locale]["remote-founder"].meta;
}

export default function RemoteFounderPage() {
  return <CourseView slug="remote-founder" />;
}
