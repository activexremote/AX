import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Quién da las clases
//
//  Una persona real, con nombre y apellidos, y por eso este archivo es
//  distinto de bienvenida/faculty.ts: aquel es la maqueta de cuatro perfiles
//  inventados que sigue usando la portada, con su aviso de «datos de muestra».
//  Aquí no hace falta ese aviso porque aquí no hay nada inventado.
//
//  ⚠︎ TODO lo que se afirma abajo está sacado de fuentes públicas y se puede
//  comprobar (el enlace a LinkedIn está en la propia ficha):
//
//   · Broadcom Aggregator Advisor — su cargo actual, el que da el título de
//     su perfil.
//   · EMEA Partner Growth Manager en Deel, y antes Lead Partner Manager en
//     Oyster — dos plataformas de contratación internacional que se estudian
//     en el curso, así que no es relleno de currículum: es exactamente la
//     materia.
//   · Basado en Dubái, que es además donde está la sede de la escuela.
//   · Goldsmiths, University of London.
//
//  Lo que NO se publica, de momento: hay fuentes que lo describen también
//  como autor de novela especializado en Quantum Psychology, con formación
//  en Psicología Clínica y un MRes en métodos de investigación. Encaja —el
//  partner Quantum Mindset Solutions apunta ahí—, pero los buscadores avisan
//  de que podría tratarse de un homónimo, y una credencial atribuida a una
//  persona con nombre y apellidos no se publica con un «probablemente».
//  Cuando él lo confirme, se añade.
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
      role: "Broadcom Aggregator Advisor · Fundador",
      bio: "Lleva años montando alianzas internacionales desde Dubái: hoy asesora a Broadcom a través de su agregador regional, y antes llevó el crecimiento de partners en EMEA en Deel y la gestión de partners en Oyster. Es decir, ha trabajado dentro de las plataformas con las que hoy se contrata talento remoto en cualquier país, que es justo lo que se enseña en el curso. Formado en Goldsmiths, University of London, y con proyectos en Reino Unido, Sudáfrica, Kenia, Grecia y Chequia.",
      tags: ["Contratación internacional", "Alianzas y partnerships", "Trabajo sin fronteras"],
    },
    en: {
      role: "Broadcom Aggregator Advisor · Founder",
      bio: "He has spent years building international partnerships out of Dubai: today he advises Broadcom through its regional aggregator, and before that he ran EMEA partner growth at Deel and partner management at Oyster. Which means he has worked inside the platforms companies now use to hire remote talent in any country — exactly what the course teaches. Educated at Goldsmiths, University of London, with projects across the UK, South Africa, Kenya, Greece and Czechia.",
      tags: ["International hiring", "Partnerships", "Working without borders"],
    },
  },
];

export const teacherCopy: Record<Locale, { linkLabel: string }> = {
  es: { linkLabel: "Ver perfil" },
  en: { linkLabel: "View profile" },
};
