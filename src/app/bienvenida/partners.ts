import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Partners
//
//  Empresas con las que hay acuerdo y que dan beneficios directos a los
//  alumnos del programa. No son «herramientas que se mencionan en clase»:
//  son acuerdos, y por eso la copy habla en primera persona del plural.
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
   * Dos, no once. El héroe no es el muestrario de partners —para eso está la
   * sección de más abajo, con los once y su beneficio—: es la primera línea
   * de confianza, y una fila larga de logos encogidos no da confianza, da
   * ruido. Con dos, cada logotipo entra grande y se lee de verdad.
   */
  hero?: true;
};

export const PARTNERS: readonly Partner[] = [
  { key: "deel",       name: "Deel",             logo: "deel.svg",            ratio: 78 / 27,   url: "https://www.deel.com", hero: true },
  { key: "remoteandtalent", name: "Remote & Talent", logo: "remoteandtalent.svg", ratio: 80 / 90, dark: true, url: "https://remoteandtalent.com", hero: true },
  // ⚠︎ SIN LOGO, y por un motivo que conviene saber: hiremo.com NO es la web
  // de la empresa, es un dominio aparcado y en venta («This domain may be for
  // sale»). Tampoco resuelven hiremo.io, .ai, .app, .co, .es, .tech ni
  // gethiremo.com. Hasta saber cuál es su dirección real, el nombre se compone
  // en nuestra tipografía y el enlace se deja fuera para no mandar a nadie a
  // una página de venta de dominios.
  { key: "hiremo",     name: "Hiremo",                                                            url: "" },
  { key: "safetywing", name: "SafetyWing",       logo: "safetywing.svg",      ratio: 120 / 24,  url: "https://safetywing.com" },
  { key: "wio",        name: "Wio Business",     logo: "wio.png",             ratio: 1,         url: "https://wio.io" },
  { key: "revolut",    name: "Revolut Business", logo: "revolut.svg",         ratio: 1,         url: "https://www.revolut.com/business" },
  { key: "factorial",  name: "Factorial",        logo: "factorial.svg",       ratio: 160 / 32,  url: "https://factorialhr.com" },
  { key: "vercel",     name: "Vercel",           logo: "vercel.svg",          ratio: 1,         url: "https://vercel.com" },
  { key: "stripe",     name: "Stripe",           logo: "stripe.svg",          ratio: 1,         url: "https://stripe.com" },
  { key: "delvy",      name: "Delvy",            logo: "delvy.svg",           ratio: 211.5 / 68, url: "https://delvy.es" },
  { key: "nomad",      name: "Nomad Capitalist", logo: "nomad.png",           ratio: 150 / 71,  url: "https://nomadcapitalist.com" },
];

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
    deel:            { area: "Global Hiring",       desc: "Contrata y paga talento en cualquier parte del mundo." },
    remoteandtalent: { area: "Remote Talent",       desc: "Encuentra talento preparado para trabajar en remoto." },
    hiremo:          { area: "AI Recruiting",       desc: "Automatiza la creación de equipos con inteligencia artificial." },
    safetywing:      { area: "Digital Nomads",      desc: "Seguro médico para trabajar y viajar por todo el mundo." },
    wio:             { area: "Business Banking",    desc: "Tu cuenta bancaria empresarial para operar internacionalmente." },
    revolut:         { area: "Business Finance",    desc: "Gestiona tu dinero y pagos internacionales desde un solo sitio." },
    factorial:       { area: "HR & People",         desc: "Gestiona personas, equipos y RRHH desde una sola plataforma." },
    vercel:          { area: "Web Infrastructure",  desc: "Publica y escala tus proyectos digitales en minutos." },
    stripe:          { area: "Payments",            desc: "Cobra online y crea sistemas de pago para tu negocio." },
    delvy:           { area: "International Legal", desc: "Asesoramiento legal para crear y operar negocios internacionales." },
    nomad:           { area: "Visas & Mobility",    desc: "Asesoramiento para residencia, visados y movilidad internacional." },
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
    deel:            { area: "Global Hiring",       desc: "Hire and pay talent anywhere in the world." },
    remoteandtalent: { area: "Remote Talent",       desc: "Find talent that is ready to work remotely." },
    hiremo:          { area: "AI Recruiting",       desc: "Build teams automatically, with AI doing the sifting." },
    safetywing:      { area: "Digital Nomads",      desc: "Health insurance for working and travelling worldwide." },
    wio:             { area: "Business Banking",    desc: "Your business bank account for operating internationally." },
    revolut:         { area: "Business Finance",    desc: "Run your money and international payments from one place." },
    factorial:       { area: "HR & People",         desc: "Manage people, teams and HR from a single platform." },
    vercel:          { area: "Web Infrastructure",  desc: "Ship and scale your digital projects in minutes." },
    stripe:          { area: "Payments",            desc: "Take payments online and build billing for your business." },
    delvy:           { area: "International Legal", desc: "Legal advice for setting up and running businesses abroad." },
    nomad:           { area: "Visas & Mobility",    desc: "Advice on residency, visas and international mobility." },
  },
  benefitLabel: "Student benefit",
  note: "Each brand belongs to its own company. Partners provide benefits and conditions for our students, but they do not accredit the programme or issue the diploma: ActiveXRemote issues it, listing the modules passed, and it is a private company certification, not an official qualification or a university degree.",
};

export const partnerCopy: Record<Locale, PartnerCopy> = { es, en };
