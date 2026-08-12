import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";

import "@/styles/globals.scss";
import { I18nProvider } from "@/lib/i18n/provider";
import { getI18n } from "@/lib/i18n/server";

// Texto y UI — tipografía del sistema de marca
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Sólo para contenido de código (bloques, textarea de lecciones)
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ActiveXRemote · Campus",
  description: "Plataforma interna de formación de ActiveXRemote.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, t } = await getI18n();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${plexMono.variable}`}
    >
      <body>
        <I18nProvider value={{ locale, t }}>{children}</I18nProvider>
      </body>
    </html>
  );
}
