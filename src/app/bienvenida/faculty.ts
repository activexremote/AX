import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Equipo docente.
//
//  ⚠︎ DEMO_FACULTY = true significa que los nombres y las fotos son de
//  muestra: los retratos vienen de Unsplash y las personas no existen. La
//  sección muestra un aviso visible mientras esta constante siga en true.
//
//  Antes de publicar: sustituye los datos y los ficheros de public/team por
//  los del profesorado real y pon la constante en false. Vender formación
//  con profesorado inventado es publicidad engañosa —quien compra elige
//  también por quién imparte— y la licencia de Unsplash no permite usar
//  personas identificables sugiriendo que respaldan un producto.
//
//  Las biografías describen la FUNCIÓN dentro del programa, no credenciales:
//  así, al cambiar la foto y el nombre, el texto sigue siendo cierto y no hay
//  que inventar méritos que nadie ha ganado.
// ══════════════════════════════════════════════════════════

export const DEMO_FACULTY = true;

export type FacultyMember = {
  id: string;
  /** Fichero en public/team. */
  photo: string;
  name: string;
  /** Marca a quien dirige los estudios: se destaca en la rejilla. */
  lead?: boolean;
  es: { role: string; area: string; bio: string; teaches: string[] };
  en: { role: string; area: string; bio: string; teaches: string[] };
};

export const FACULTY: readonly FacultyMember[] = [
  {
    id: "direccion",
    photo: "/team/direccion.jpg",
    name: "Martín Aguirre",
    lead: true,
    es: {
      role: "Jefe de estudios",
      area: "Dirección académica",
      bio: "Decide qué entra en el programa y qué se queda fuera. Revisa cada convocatoria con los entregables reales del alumnado y ajusta los módulos que no producen resultado.",
      teaches: ["Diseño del itinerario", "Evaluación de entregables", "Convocatorias"],
    },
    en: {
      role: "Head of studies",
      area: "Academic direction",
      bio: "Decides what goes into the program and what stays out. Reviews each cohort against the students' actual deliverables and reworks the modules that do not produce results.",
      teaches: ["Curriculum design", "Deliverable assessment", "Cohorts"],
    },
  },
  {
    id: "instruccional",
    photo: "/team/instruccional.jpg",
    name: "Lucía Ferrer",
    es: {
      role: "Diseño instruccional",
      area: "Núcleo común · Módulos 1 a 7",
      bio: "Convierte la experiencia del equipo en rutas y ejercicios que se pueden seguir en asíncrono. Es quien se asegura de que cada módulo termine con algo entregado, no con apuntes.",
      teaches: ["Trabajo asíncrono", "Documentación", "Anti-burnout"],
    },
    en: {
      role: "Instructional design",
      area: "Common core · Modules 1 to 7",
      bio: "Turns the team's experience into routes and exercises that work asynchronously. She is the one making sure every module ends with something delivered, not with lecture notes.",
      teaches: ["Async work", "Documentation", "Anti-burnout"],
    },
  },
  {
    id: "carrera",
    photo: "/team/carrera.jpg",
    name: "Diego Salas",
    es: {
      role: "Mentoría de carrera",
      area: "Camino Professional · Módulos 8 a 14",
      bio: "Acompaña las candidaturas de principio a fin: revisa currículums, prepara entrevistas en vídeo y ensaya la negociación antes de que llegue la oferta de verdad.",
      teaches: ["Job hacking", "ATS y candidatura", "Negociación"],
    },
    en: {
      role: "Career mentoring",
      area: "Professional path · Modules 8 to 14",
      bio: "Follows applications end to end: reviews CVs, prepares video interviews and rehearses the negotiation before the real offer arrives.",
      teaches: ["Job hacking", "ATS and applications", "Negotiation"],
    },
  },
  {
    id: "negocio",
    photo: "/team/negocio.jpg",
    name: "Nora Vidal",
    es: {
      role: "Mentoría de negocio",
      area: "Camino Founder · Módulos 8 a 14",
      bio: "Trabaja la oferta y la captación con cada alumno hasta que dejan de vender horas. Revisa precios, procesos y automatizaciones sobre casos reales, no sobre ejemplos.",
      teaches: ["Oferta productizada", "Clientes B2B", "Automatización"],
    },
    en: {
      role: "Business mentoring",
      area: "Founder path · Modules 8 to 14",
      bio: "Works on the offer and client acquisition with each student until they stop selling hours. Reviews pricing, processes and automations against real cases, not examples.",
      teaches: ["Productised offer", "B2B clients", "Automation"],
    },
  },
];

export const facultyCopy: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  teachesLabel: string;
  demoNotice: string;
}> = {
  es: {
    eyebrow: "Quién imparte",
    title: "Cuatro personas, no una plataforma.",
    lead: "El programa lo diseña e imparte un equipo pequeño que trabaja como enseña: en remoto, en asíncrono y con los mismos entregables que se te piden a ti.",
    teachesLabel: "Imparte",
    demoNotice:
      "Fotografías y nombres de muestra. El equipo docente definitivo de cada convocatoria se comunica antes de formalizar la matrícula.",
  },
  en: {
    eyebrow: "Who teaches",
    title: "Four people, not a platform.",
    lead: "The program is designed and taught by a small team that works the way it teaches: remotely, asynchronously and against the same deliverables asked of you.",
    teachesLabel: "Teaches",
    demoNotice:
      "Sample photographs and names. The final teaching team for each cohort is communicated before enrolment is formalised.",
  },
};
