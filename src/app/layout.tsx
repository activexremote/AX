import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";

import "@/styles/globals.scss";
import { I18nProvider } from "@/lib/i18n/provider";
import { ConsentDefaultScript } from "@/components/consent/consent-default-script";
import { ConsentMount } from "@/components/consent/consent-mount";
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

// Sin maximumScale ni userScalable: el zoom con dos dedos debe seguir ahí.
// `viewportFit: cover` lo pide sólo la landing (ver bienvenida/page.tsx): es
// la única que aparta su contenido del notch con env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
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
        {/* Antes que nada: deja todo denegado hasta que haya decisión. */}
        <ConsentDefaultScript />
        <I18nProvider value={{ locale, t }}>{children}</I18nProvider>
        <ConsentMount />
      </body>
    </html>
  );
}
