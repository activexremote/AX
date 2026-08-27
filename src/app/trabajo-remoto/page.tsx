import type { Metadata, Viewport } from "next";

import { AdLandingView } from "@/components/landing/ad-landing-view";
import { adCopy } from "@/app/trabajo-remoto/copy";
import { getLocale } from "@/lib/i18n/server";
import { absolute, OG_LOCALE, SITE_NAME } from "@/lib/seo";

const PATH = "/trabajo-remoto";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = adCopy[locale];

  return {
    title: { absolute: c.meta.title },
    description: c.meta.description,
    // ── noindex, follow ──
    // Es una landing de campaña: dice lo mismo que /bienvenida y que las dos
    // páginas de curso, con otras palabras. Dejarla indexar sería competir
    // contra nuestras propias URL por las mismas búsquedas y repartir la
    // señal entre tres páginas casi iguales. El tráfico aquí llega por
    // anuncio, no por buscador. `follow` sí: los enlaces legales y de marca
    // que salen de aquí siguen contando.
    robots: { index: false, follow: true },
    // Sin `alternates`: sin indexación no hay canónica que declarar ni grupo
    // hreflang que formar. Los dos idiomas existen (/trabajo-remoto y /en/trabajo-remoto) y cada
    // anuncio apunta al suyo.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      title: c.meta.title,
      description: c.meta.description,
      url: absolute(locale, PATH),
    },
    twitter: {
      card: "summary_large_image",
      title: c.meta.title,
      description: c.meta.description,
    },
  };
}

// El héroe y el cierre son mesh oscuro de borde a borde: `cover` deja que
// lleguen al borde de la pantalla y el contenido se aparta del notch con
// env(safe-area-inset-*) en ad-landing.scss.
export const viewport: Viewport = { themeColor: "#161326", viewportFit: "cover" };

export default function AdLandingPage() {
  return <AdLandingView />;
}
