import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Partners
//
//  Empresas con las que hay acuerdo y que dan beneficios directos a los
//  alumnos del programa. No son «herramientas que se mencionan en clase»:
//  son acuerdos, y por eso la copy habla en primera persona del plural.
//
//  ⚠︎ Aquí SÓLO entra quien tenga acuerdo firmado. Una marca en esta sección
//  dice "trabajamos con ellos y te dan algo", que es una afirmación sobre un
//  tercero: si el acuerdo no existe, no es una exageración de marketing, es
//  un problema. Las herramientas que se estudian en clase van en tools.ts,
//  que es otra cosa y así lo dice el aviso legal.
//
//  ⚠︎ Los logos son propiedad de cada marca. Se guardan en
//  public/logos/partners/ sin recolorear —recolorear un logo lo invalida y
//  casi todas las guías de marca lo prohíben— y a la misma ALTURA óptica,
//  que es como se unifica una fila de logotipos: nunca al mismo ancho, o los
//  wordmarks largos aplastan a los monogramas.
//
//  `ratio` es ancho/alto del viewBox. Con él se calcula el ancho a partir de
//  la altura y ninguno sale deformado.
// ══════════════════════════════════════════════════════════

export type Partner = {
  key: string;
  name: string;
  /** Archivo en public/logos/partners. Sin él se compone el nombre en nuestra
   *  tipografía, que en una fila a la misma altura no desentona. */
  logo?: string;
  ratio?: number;
  /** El logo es claro y necesita una pastilla oscura detrás. */
  dark?: boolean;
  /** Sitio oficial, para que el nombre sea comprobable. */
  url: string;
  /**
   * Sale en la tira del héroe.
   *
   * Hoy salen los dos que hay, así que la tira del héroe y la sección de
   * abajo enseñan lo mismo. La bandera se queda igualmente: el día que haya
   * un tercer acuerdo, el héroe no debe crecer con él. Ahí caben dos o tres
   * logotipos grandes; una fila larga de marcas encogidas no da confianza,
   * da ruido.
   */
  hero?: true;
};

export const PARTNERS: readonly Partner[] = [
  { key: "remoteandtalent", name: "Remote & Talent", logo: "remoteandtalent.svg", ratio: 80 / 90, dark: true, url: "https://remoteandtalent.com", hero: true },
  { key: "quantum",         name: "Quantum Mindset Solutions", logo: "quantum.png", ratio: 1,     url: "https://quantummindsetsolutions.com", hero: true },
];

// ⚠︎ Deel está RETIRADO, no borrado. Vuelve entrando esta línea en la lista:
//
//   { key: "deel", name: "Deel", logo: "deel.svg", ratio: 78 / 27,
//     url: "https://www.deel.com", hero: true },
//
// Su SVG sigue en public/logos/partners/. Se quitó a petición del equipo
// mientras se aclara el acuerdo, y esta lista es la única fuente: afecta a
// la portada y a la landing de campaña a la vez, que es como tiene que ser.
// Un partner no puede estar anunciado en una página y no en la otra: es una
// afirmación sobre un tercero, y o es cierta en las dos o no lo es en
// ninguna.

// Aquí vivía un código de color por familia (talento / dinero / legal /
// producto) que pintaba el borde y la categoría de cada pastilla del héroe.
// Con la tira reducida a dos logotipos a una tinta ya no hay nada que
// colorear, y un mapa de colores que no usa nadie sólo sirve para que dentro
// de seis meses alguien lo dé por vivo. La categoría de cada partner sigue
// estando donde importa: en `items[].area` de la copy, que es lo que lee la
// sección de abajo.

export function partnerLogo(p: Partner): string | null {
  return p.logo ? `/logos/partners/${p.logo}` : null;
}

// ── Copy ──────────────────────────────────────────────────

export type PartnerCopy = {
  heroLabel: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** Categoría y beneficio de cada uno, por clave. */
  items: Record<string, { area: string; desc: string }>;
  benefitLabel: string;
  note: string;
};

const es: PartnerCopy = {
  heroLabel: "Partners con beneficios para alumnos",
  eyebrow: "Partners",
  title: "Aprende y benefíciate junto a ellos.",
  lead: "Acuerdos con las plataformas que sostienen el trabajo remoto internacional. No son sólo herramientas que se estudian: cada una da beneficios directos y exclusivos a nuestros alumnos dentro del programa.",
  items: {
    remoteandtalent: { area: "Remote Talent",       desc: "Encuentra talento preparado para trabajar en remoto." },
    quantum:         { area: "Mindset & Performance", desc: "Entrena la cabeza para sostener el cambio, no sólo la técnica." },
  },
  benefitLabel: "Beneficio para alumnos",
  // El diploma sigue siendo lo que es, y eso no lo cambia tener acuerdos:
  // ninguno de estos partners acredita el programa ni lo certifica.
  note: "Cada marca es propiedad de su compañía. Los partners aportan beneficios y condiciones para nuestros alumnos, pero no acreditan el programa ni emiten el diploma: lo emite ActiveXRemote detallando los módulos superados, y es una certificación privada de empresa, no un título oficial ni un grado universitario.",
};

const en: PartnerCopy = {
  heroLabel: "Partners with student benefits",
  eyebrow: "Partners",
  title: "Learn with them, and get the perks.",
  lead: "Agreements with the platforms that hold up international remote work. They aren't just tools you study: each one gives our students direct, exclusive benefits inside the programme.",
  items: {
    remoteandtalent: { area: "Remote Talent",       desc: "Find talent that is ready to work remotely." },
    quantum:         { area: "Mindset & Performance", desc: "Trains the head to sustain the change, not just the technique." },
  },
  benefitLabel: "Student benefit",
  note: "Each brand belongs to its own company. Partners provide benefits and conditions for our students, but they do not accredit the programme or issue the diploma: ActiveXRemote issues it, listing the modules passed, and it is a private company certification, not an official qualification or a university degree.",
};

export const partnerCopy: Record<Locale, PartnerCopy> = { es, en };
