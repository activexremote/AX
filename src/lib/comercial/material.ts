// ══════════════════════════════════════════════════════════
//  El material de apoyo del equipo comercial
//
//  Los tres dosieres del curso que se mandan a los leads. Los genera
//  scripts/decks-comerciales.mts (PDF y portada) en private/comercial/, y el
//  panel los sirve sólo a quien vende. Sin imports a propósito: el script lo
//  lee con Node directamente.
// ══════════════════════════════════════════════════════════

export type MaterialId = "curso-completo" | "remote-professional" | "remote-founder";

export type Material = {
  id: MaterialId;
  titulo: string;
  /** Para quién es, en una línea. */
  paraQuien: string;
  descripcion: string;
  /** Fichero en private/comercial/. */
  pdf: string;
  portada: string;
  /** Nombre con el que se descarga. */
  descarga: string;
};

export const MATERIAL: Material[] = [
  {
    id: "curso-completo",
    titulo: "El curso completo",
    paraQuien: "Para quien aún no sabe qué camino elegir",
    descripcion: "Qué es ActiveXRemote, cómo son las clases y el campus, el núcleo común, los dos caminos, la acreditación de Deel, qué incluye la matrícula y la inversión.",
    pdf: "dosier-curso-completo.pdf",
    portada: "dosier-curso-completo.jpg",
    descarga: "ActiveXRemote-El-curso-completo.pdf",
  },
  {
    id: "remote-professional",
    titulo: "Remote Professional",
    paraQuien: "Para quien quiere un empleo remoto con empresas de fuera",
    descripcion: "El problema de las candidaturas internacionales, lo que paga cada mercado, los 14 módulos con lo que te llevas de cada uno, el campus, Deel e inversión.",
    pdf: "dosier-remote-professional.pdf",
    portada: "dosier-remote-professional.jpg",
    descarga: "ActiveXRemote-Remote-Professional.pdf",
  },
  {
    id: "remote-founder",
    titulo: "Remote Founder",
    paraQuien: "Para freelancers y founders que quieren vender fuera",
    descripcion: "El salto de vender horas a vender un sistema, los 14 módulos con lo que te llevas de cada uno, el campus, Deel e inversión.",
    pdf: "dosier-remote-founder.pdf",
    portada: "dosier-remote-founder.jpg",
    descarga: "ActiveXRemote-Remote-Founder.pdf",
  },
];

/** Lo que la ruta de descarga acepta servir, y con qué nombre y tipo. */
export function archivoMaterial(nombre: string): { tipo: string; descarga?: string } | null {
  for (const m of MATERIAL) {
    if (nombre === m.pdf) return { tipo: "application/pdf", descarga: m.descarga };
    if (nombre === m.portada) return { tipo: "image/jpeg" };
  }
  return null;
}
