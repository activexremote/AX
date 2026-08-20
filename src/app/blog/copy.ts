import type { Locale } from "@/lib/i18n/config";

export const blogCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  readingLabel: (n: number) => string;
  updatedLabel: string;
  tocLabel: string;
  faqTitle: string;
  keyLabel: string;
  sourcesLabel: string;
  relatedLabel: string;
  termsLabel: string;
  backLabel: string;
  ctaTitle: string;
  ctaBody: string;
  ctaButton: string;
  emptyLabel: string;
  /** Textos de la sección de blog que aparece en las landings. */
  sectionTitle: string;
  sectionLead: string;
  sectionCta: string;
  featuredLabel: string;
  featuredCta: string;
  clusters: Record<string, string>;
}> = {
  es: {
    eyebrow: "Blog",
    title: "Trabajo remoto internacional, explicado sin humo",
    lead: "Guías sobre contratación, fiscalidad, candidaturas y negocio remoto. Escritas para resolver una duda concreta, no para rellenar.",
    sectionTitle: "Lo que enseñamos, por escrito y en abierto.",
    sectionLead: "Antes de pagar nada puedes leer cómo pensamos. Estas guías salen del mismo material del programa.",
    sectionCta: "Ver todas las guías",
    featuredLabel: "Empieza por aquí",
    featuredCta: "Leer el artículo",
    readingLabel: (n) => `${n} min de lectura`,
    updatedLabel: "Actualizado",
    tocLabel: "En esta guía",
    faqTitle: "Preguntas frecuentes",
    keyLabel: "En corto",
    sourcesLabel: "Fuentes",
    relatedLabel: "Seguir leyendo",
    termsLabel: "Términos que aparecen",
    backLabel: "Volver al blog",
    ctaTitle: "¿Quieres hacerlo con acompañamiento?",
    ctaBody: "El programa cubre esto módulo a módulo, con ejercicios sobre tu propio caso y feedback del equipo.",
    ctaButton: "Solicita información",
    emptyLabel: "Próximamente.",
    clusters: {
      empleo: "Empleo remoto",
      fiscalidad: "Fiscalidad y movilidad",
      legal: "Contratación y legal",
      negocio: "Negocio remoto",
      metodo: "Método de trabajo",
      herramientas: "Herramientas e IA",
    },
  },
  en: {
    eyebrow: "Blog",
    title: "International remote work, explained without the hype",
    lead: "Guides on hiring, tax, applications and remote business. Written to answer one concrete question, not to fill a page.",
    sectionTitle: "What we teach, written down and in the open.",
    sectionLead: "You can read how we think before paying for anything. These guides come from the program's own material.",
    sectionCta: "See all the guides",
    featuredLabel: "Start here",
    featuredCta: "Read the article",
    readingLabel: (n) => `${n} min read`,
    updatedLabel: "Updated",
    tocLabel: "In this guide",
    faqTitle: "Frequently asked questions",
    keyLabel: "In short",
    sourcesLabel: "Sources",
    relatedLabel: "Keep reading",
    termsLabel: "Terms that appear",
    backLabel: "Back to the blog",
    ctaTitle: "Want to do this with support?",
    ctaBody: "The program covers this module by module, with exercises on your own case and feedback from the team.",
    ctaButton: "Request information",
    emptyLabel: "Coming soon.",
    clusters: {
      empleo: "Remote jobs",
      fiscalidad: "Tax and mobility",
      legal: "Hiring and legal",
      negocio: "Remote business",
      metodo: "Ways of working",
      herramientas: "Tools and AI",
    },
  },
};
