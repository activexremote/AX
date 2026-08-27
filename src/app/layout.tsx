import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";

import "@/styles/globals.scss";
import { I18nProvider } from "@/lib/i18n/provider";
import { ConsentDefaultScript } from "@/components/consent/consent-default-script";
import { ConsentMount } from "@/components/consent/consent-mount";
import { ExtensionNoiseScript } from "@/components/dev/extension-noise-script";
import { getI18n } from "@/lib/i18n/server";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

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

// `metadataBase` es lo que permite que el resto de páginas declaren rutas
// relativas (og:image, canónicas) y salgan como URL absolutas. Sin él, Next
// avisa en cada build y las tarjetas sociales se quedan sin imagen.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ActiveXRemote · The Remote Business School",
    template: "%s · ActiveXRemote",
  },
  description:
    "Formación en directo para trabajar y montar negocio sin fronteras. Dos caminos: Remote Professional y Remote Founder.",
  applicationName: SITE_NAME,
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
      {/* Las extensiones del navegador escriben atributos en <body> antes de
          que React hidrate —ColorZilla pone `cz-shortcut-listen`, Grammarly
          los suyos— y React lo denuncia como una diferencia entre servidor y
          cliente. No lo es: es la vía oficial de React para este caso y sólo
          calla los ATRIBUTOS de esta etiqueta, no lo que hay dentro. */}
      <body suppressHydrationWarning>
        {/* Antes que nada: deja todo denegado hasta que haya decisión. */}
        <ConsentDefaultScript />
        {/* Y calla a las extensiones del navegador, que en desarrollo tapan
            la pantalla con errores que no son de esta web. */}
        <ExtensionNoiseScript />
        <I18nProvider value={{ locale, t }}>{children}</I18nProvider>
        <ConsentMount />
      </body>
    </html>
  );
}
