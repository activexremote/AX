import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Deel
//
//  Deel acredita siete módulos del programa y ActiveXRemote es Deel
//  Platinum Partner y Deel Global Partner. Todo lo que se dice de Deel en
//  las landings sale de aquí, así que lo que dice una página y lo que dice
//  otra no se pueden separar.
//
//  ⚠︎ Reglas del Partner Marketing Toolkit de Deel (PDF de Deel, nov. 2026):
//   · Campaña «partner-led»: se usa el BADGE del nivel vigente, nunca el
//     logotipo corporativo de Deel suelto ni un lockup co-branded (ése
//     necesita aprobación de partnermarketing@deel.com).
//   · Los badges, tal cual: sin recolorear, sin recortar, sin fundirlos con
//     nuestro logo en un mismo icono. Los niveles se revisan cada 6 meses:
//     si bajamos de Platinum, el badge se retira el mismo día.
//   · «Quién es Deel» es su boilerplate aprobado. En inglés va literal; en
//     español es una traducción fiel, sin añadir ni quitar afirmaciones.
//   · Prohibido: hablar de precios de Deel, insinuar exclusividad, anunciar
//     productos suyos no publicados o meter «Deel» en el nombre de algo
//     nuestro.
//   · Todo enlace a deel.com lleva UTM. Cuando Deel nos dé la página de
//     partner (deel.com/partners/…), cambia DEEL_URL y listo.
// ══════════════════════════════════════════════════════════

export const DEEL_URL =
  "https://www.deel.com/?utm_source=activexremote&utm_medium=partner&utm_campaign=acreditacion";

export const DEEL_BADGES = [
  { key: "platinum", src: "/logos/partners/deel-platinum-partner.png", alt: "Deel Platinum Partner" },
  { key: "global", src: "/logos/partners/deel-global-partner.png", alt: "Deel Global Partner" },
] as const;

export type Camino = "core" | "remote-professional" | "remote-founder";

/** Los módulos acreditados, por camino y número, con el área de Deel que cubren. */
const ACREDITADOS: Record<Camino, Record<string, { es: string; en: string }>> = {
  core: {
    "02": { es: "Residencia fiscal · contractor o empleado", en: "Tax residency · contractor vs. employee" },
    "03": { es: "Inmigración y visados", en: "Immigration and visas" },
    "07": { es: "Gestión de contractors · mala clasificación", en: "Contractor management · misclassification" },
  },
  "remote-professional": {
    "12": { es: "Nómina y compensación global", en: "Global payroll and compensation" },
    "13": { es: "Onboarding y RR. HH. en equipos distribuidos", en: "Onboarding and HR for distributed teams" },
  },
  "remote-founder": {
    "13": { es: "Contratar tus primeros contractors internacionales", en: "Hiring your first international contractors" },
    "14": { es: "Employer of Record o entidad propia", en: "Employer of Record vs. own entity" },
  },
};

/**
 * El área de Deel de un módulo, o null si no está acreditado. Del 01 al 07
 * es el núcleo común, sea cual sea el camino que se pase.
 */
export function deelArea(camino: Camino, n: string, locale: Locale): string | null {
  const c: Camino = Number(n) <= 7 ? "core" : camino;
  return ACREDITADOS[c][n]?.[locale] ?? null;
}

// ── Copy ──────────────────────────────────────────────────

export type DeelCopy = {
  seal: { title: string; sub: string };
  tag: string;
  eyebrow: string;
  title: string;
  lead: string;
  badgesCaption: string;
  stats: { value: string; label: string }[];
  whoTitle: string;
  /** Boilerplate aprobado por Deel. No se edita. */
  who: string;
  whoCta: string;
  modulesTitle: string;
  groups: { camino: Camino; name: string; modules: { n: string; title: string }[] }[];
  gainsTitle: string;
  gains: { title: string; body: string }[];
  note: string;
  /** Versión corta para páginas de un solo módulo (el dry run). */
  short: { title: string; body: string; cta: string };
};

const es: DeelCopy = {
  seal: { title: "Deel Platinum Partner", sub: "7 módulos acreditados por Deel" },
  tag: "Acreditado por Deel",
  eyebrow: "Acreditación Deel",
  title: "Siete módulos del programa, acreditados por Deel.",
  lead: "Deel, la plataforma con la que miles de empresas contratan, pagan y gestionan equipos en todo el mundo, ha revisado y acreditado el contenido de los módulos sobre fiscalidad, reubicación, contratación internacional, compensación y compliance. Lo que aprendes ahí es cómo se hace de verdad.",
  badgesCaption: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner.",
  stats: [
    { value: "7", label: "módulos acreditados por Deel" },
    { value: "150+", label: "países donde opera Deel" },
    { value: "40.000+", label: "empresas confían en Deel" },
  ],
  whoTitle: "Quién es Deel",
  who: "El mundo del trabajo ha cambiado, y Deel ha construido el estándar que lo impulsa todo. Hace que contratar, gestionar, pagar y equipar a cualquier trabajador, en cualquier lugar, no cueste esfuerzo. Deel es una sola plataforma para nóminas, RR. HH., beneficios, movilidad, desempeño y gestión de dispositivos en más de 150 países. Construida sobre infraestructura propia, impulsada por IA y respaldada por miles de expertos locales, Deel ayuda a las empresas a escalar de forma más inteligente, más rápida y cumpliendo la normativa. Más de 40.000 clientes confían en ella, y nació para convertirse en una marca global que la gente quiera. Más información en deel.com.",
  whoCta: "Conoce Deel",
  modulesTitle: "Los módulos acreditados",
  groups: [
    {
      camino: "core",
      name: "Núcleo común · los dos caminos",
      modules: [
        { n: "02", title: "Geoposicionamiento y optimización fiscal" },
        { n: "03", title: "Blueprint de reubicación internacional" },
        { n: "07", title: "Legal y compliance transfronterizo" },
      ],
    },
    {
      camino: "remote-professional",
      name: "Remote Professional",
      modules: [
        { n: "12", title: "Negociación salarial y compensación global" },
        { n: "13", title: "Tus primeros 90 días en un equipo distribuido" },
      ],
    },
    {
      camino: "remote-founder",
      name: "Remote Founder",
      modules: [
        { n: "13", title: "Automatización, delegación y escala" },
        { n: "14", title: "Estructura corporativa borderless" },
      ],
    },
  ],
  gainsTitle: "Qué significa para ti",
  gains: [
    { title: "Contenido revisado por quien lo hace a diario", body: "La parte fiscal, legal y de contratación internacional la ha validado la empresa que la resuelve para miles de compañías." },
    { title: "Deel abierto en clase", body: "No te lo cuentan en diapositivas: trabajas con la plataforma en pantalla, en ejercicios sobre tu propio caso." },
    { title: "Acreditación en tu diploma", body: "Tu diploma indica qué módulos superados están acreditados por Deel." },
  ],
  note: "Deel y sus badges de partner son marcas de Deel y se usan con su permiso. Deel acredita el contenido de los módulos indicados; el diploma lo emite ActiveXRemote y es una certificación privada de empresa, no un título oficial ni un grado universitario.",
  short: {
    title: "Un programa con módulos acreditados por Deel",
    body: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner. Siete módulos del programa completo —fiscalidad, reubicación, compliance, compensación y contratación internacional— están acreditados por Deel, la plataforma global de nóminas y RR. HH. presente en más de 150 países.",
    cta: "Ver los módulos acreditados",
  },
};

const en: DeelCopy = {
  seal: { title: "Deel Platinum Partner", sub: "7 modules accredited by Deel" },
  tag: "Accredited by Deel",
  eyebrow: "Deel accreditation",
  title: "Seven modules of the programme, accredited by Deel.",
  lead: "Deel, the platform thousands of companies use to hire, pay and manage teams worldwide, has reviewed and accredited the modules on tax, relocation, international hiring, compensation and compliance. What you learn there is how it is really done.",
  badgesCaption: "ActiveXRemote is a Deel Platinum Partner and a Deel Global Partner.",
  stats: [
    { value: "7", label: "modules accredited by Deel" },
    { value: "150+", label: "countries Deel operates in" },
    { value: "40,000+", label: "companies trust Deel" },
  ],
  whoTitle: "Who Deel is",
  who: "The way the world works has changed—and Deel has built the standard to power it all. We make it effortless to hire, manage, pay, and equip any worker, anywhere. Deel is one platform for payroll, HR, benefits, mobility, performance, and device management across 150+ countries. Built on owned infrastructure, powered by AI, and supported by thousands of local experts, Deel helps businesses scale smarter, faster, and more compliantly. Trusted by 40,000+ customers, and created to become a global brand people love. Learn more at deel.com.",
  whoCta: "Discover Deel",
  modulesTitle: "The accredited modules",
  groups: [
    {
      camino: "core",
      name: "Common core · both paths",
      modules: [
        { n: "02", title: "Geo-positioning and tax optimisation" },
        { n: "03", title: "International relocation blueprint" },
        { n: "07", title: "Cross-border legal and compliance" },
      ],
    },
    {
      camino: "remote-professional",
      name: "Remote Professional",
      modules: [
        { n: "12", title: "Salary negotiation and global compensation" },
        { n: "13", title: "Your first 90 days in a distributed team" },
      ],
    },
    {
      camino: "remote-founder",
      name: "Remote Founder",
      modules: [
        { n: "13", title: "Automation, delegation and scale" },
        { n: "14", title: "Borderless corporate structure" },
      ],
    },
  ],
  gainsTitle: "What it means for you",
  gains: [
    { title: "Reviewed by the people who do it every day", body: "The tax, legal and international hiring content has been validated by the company that solves it for thousands of businesses." },
    { title: "Deel open in class", body: "Not on slides: you work with the platform on screen, in exercises on your own case." },
    { title: "Accreditation on your diploma", body: "Your diploma shows which of the modules you passed are accredited by Deel." },
  ],
  note: "Deel and its partner badges are trademarks of Deel, used with permission. Deel accredits the content of the modules listed; the diploma is issued by ActiveXRemote and is a private company certification, not an official qualification or a university degree.",
  short: {
    title: "A programme with modules accredited by Deel",
    body: "ActiveXRemote is a Deel Platinum Partner and a Deel Global Partner. Seven modules of the full programme (tax, relocation, compliance, compensation and international hiring) are accredited by Deel, the global payroll and HR platform operating in 150+ countries.",
    cta: "See the accredited modules",
  },
};

export const deelCopy: Record<Locale, DeelCopy> = { es, en };
