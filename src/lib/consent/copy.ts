import type { Locale } from "@/lib/i18n/config";

import type { OptionalCategory } from "@/lib/consent/config";

type CategoryCopy = { name: string; desc: string };

export type ConsentCopy = {
  title: string;
  body: string;
  more: string;
  acceptAll: string;
  rejectAll: string;
  configure: string;
  save: string;
  back: string;
  close: string;
  panelTitle: string;
  panelBody: string;
  necessary: CategoryCopy;
  necessaryTag: string;
  categories: Record<OptionalCategory, CategoryCopy>;
  settingsLink: string;
  reopened: string;
};

export const consentCopy: Record<Locale, ConsentCopy> = {
  es: {
    title: "Tú decides qué guardamos",
    body:
      "Usamos cookies propias necesarias para que el sitio funcione. Las de preferencias, medición y marketing sólo se activan si nos das permiso, y puedes cambiar de idea cuando quieras.",
    more: "Leer la política de cookies",
    acceptAll: "Aceptar todas",
    rejectAll: "Rechazar todas",
    configure: "Configurar",
    save: "Guardar mi elección",
    back: "Volver",
    close: "Cerrar",
    panelTitle: "Configura las cookies",
    panelBody:
      "Activa sólo lo que quieras. Nada de lo que requiere permiso se carga hasta que lo guardes, y rechazar no limita el acceso a ningún contenido.",
    necessary: {
      name: "Estrictamente necesarias",
      desc: "Mantienen tu sesión del campus, recuerdan esta misma decisión y protegen el formulario frente a envíos automáticos. Sin ellas el sitio no puede funcionar, así que no requieren consentimiento.",
    },
    necessaryTag: "Siempre activas",
    categories: {
      preferences: {
        name: "Preferencias",
        desc: "Recuerdan elecciones tuyas, como el idioma en el que quieres ver el sitio, para no tener que repetirlas en cada visita.",
      },
      analytics: {
        name: "Medición",
        desc: "Nos dicen de forma agregada cuánta gente entra y qué páginas funcionan, para mejorar el sitio. No se usan para identificarte.",
      },
      marketing: {
        name: "Marketing",
        desc: "Permiten medir la eficacia de nuestras campañas y mostrar anuncios ajustados a tus intereses en plataformas de terceros.",
      },
    },
    settingsLink: "Configurar cookies",
    reopened: "Puedes cambiar tu elección aquí cuando quieras.",
  },
  en: {
    title: "You decide what we store",
    body:
      "We use first-party cookies that are necessary for the site to work. Preference, measurement and marketing cookies only switch on if you allow them, and you can change your mind at any time.",
    more: "Read the cookie policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    configure: "Customise",
    save: "Save my choice",
    back: "Back",
    close: "Close",
    panelTitle: "Cookie settings",
    panelBody:
      "Turn on only what you want. Nothing requiring permission loads until you save, and refusing does not restrict access to any content.",
    necessary: {
      name: "Strictly necessary",
      desc: "They keep your campus session open, remember this very decision and protect the form against automated submissions. The site cannot work without them, so they need no consent.",
    },
    necessaryTag: "Always on",
    categories: {
      preferences: {
        name: "Preferences",
        desc: "They remember your choices, such as the language you want the site in, so you don't have to repeat them on every visit.",
      },
      analytics: {
        name: "Measurement",
        desc: "They tell us, in aggregate, how many people arrive and which pages work, so we can improve the site. They are not used to identify you.",
      },
      marketing: {
        name: "Marketing",
        desc: "They let us measure how our campaigns perform and show you ads matched to your interests on third-party platforms.",
      },
    },
    settingsLink: "Cookie settings",
    reopened: "You can change your choice here whenever you like.",
  },
};
