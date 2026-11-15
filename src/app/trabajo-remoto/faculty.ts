import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Quién da las clases
//
//  Una persona real, con nombre y apellidos, y por eso este archivo es
//  distinto de bienvenida/faculty.ts: aquel es la maqueta de cuatro perfiles
//  inventados que sigue usando la portada, con su aviso de «datos de muestra».
//  Aquí no hace falta ese aviso porque aquí no hay nada inventado.
//
//  ⚠︎ Lo que se afirma abajo es la bio que dio la escuela (oct. 2026),
//  contrastada con su perfil público:
//
//   · Más de 12 años levantando ecosistemas de venta directa y de canal en
//     tecnología, en seis continentes: Broadcom (hoy), Deel y Rossum AI.
//   · Basado en Dubái, experto en nomadismo digital.
//   · Viene de la psicología y es autor publicado sobre Psicología Cuántica.
//
//  Nunca trabajó en Oyster: los buscadores le atribuían una publicación de
//  otro perfil. No lo pongas. Tampoco Goldsmiths ni la lista de países, que
//  no tienen fuente.
// ══════════════════════════════════════════════════════════

export type Teacher = {
  id: string;
  /** Fichero en public/team. */
  photo: string;
  name: string;
  /** Perfil público, para que todo lo de arriba sea comprobable. */
  url: string;
  es: { role: string; bio: string; tags: string[] };
  en: { role: string; bio: string; tags: string[] };
};

export const TEACHERS: readonly Teacher[] = [
  {
    id: "isaac-betanzos",
    photo: "/team/isaac-betanzos.jpg",
    name: "Isaac R. Betanzos",
    url: "https://ae.linkedin.com/in/isaacrbetanzos",
    es: {
      role: "Cofundador · Negocio y alianzas",
      bio: "Más de 12 años levantando ecosistemas de venta directa y de canal en empresas de tecnología, en seis continentes: Broadcom, Deel o Rossum AI, entre otras. Es decir, ha trabajado dentro de las plataformas con las que hoy se contrata talento remoto en cualquier país, como Deel, que es justo lo que se enseña en el curso. Vive en Dubái, donde ejerce como experto en nomadismo digital, y viene de la psicología: es autor publicado sobre Psicología Cuántica.",
      tags: ["Contratación internacional", "Alianzas y partnerships", "Trabajo sin fronteras"],
    },
    en: {
      role: "Co-founder · Business & partnerships",
      bio: "12+ years building direct and channel sales ecosystems at technology companies across six continents — Broadcom, Deel and Rossum AI among them. Which means he has worked inside the platforms companies now use to hire remote talent in any country, Deel included — exactly what the course teaches. Based in Dubai as a digital-nomad expert, with a background in psychology and published work on Quantum Psychology.",
      tags: ["International hiring", "Partnerships", "Working without borders"],
    },
  },
];

export const teacherCopy: Record<Locale, { linkLabel: string }> = {
  es: { linkLabel: "Ver perfil" },
  en: { linkLabel: "View profile" },
};
