import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Deel
//
//  Deel acredita contenidos de los dos cursos y ActiveXRemote es Deel
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

export type Camino = "remote-professional" | "remote-founder";

// ── Formato 2.0 de las landings de curso ──────────────────
// Professional (8 semanas) y Founder (13) ya no comparten módulos. Cada área
// acreditada va a la semana donde ha ido a parar su contenido; el núcleo
// común (02, 03, 07) se reparte entre las dos.
// ⚠︎ Pendiente de que Deel confirme el nuevo reparto.
export type Curso = Camino;

const SEMANAS_DEEL: Record<Curso, Record<number, { es: string; en: string }>> = {
  "remote-professional": {
    4: { es: "Nómina y compensación global", en: "Global payroll and compensation" },
    5: { es: "Residencia fiscal · contractor o empleado", en: "Tax residency · contractor vs. employee" },
    6: { es: "Onboarding y RR. HH. en equipos distribuidos", en: "Onboarding and HR for distributed teams" },
    7: { es: "Inmigración y visados", en: "Immigration and visas" },
  },
  "remote-founder": {
    11: { es: "Contratar tus primeros contractors internacionales", en: "Hiring your first international contractors" },
    12: { es: "Employer of Record o entidad propia", en: "Employer of Record vs. own entity" },
  },
};

/** El área de Deel de una semana del formato 2.0, o null. */
export function deelWeek(curso: Curso, n: number, locale: Locale): string | null {
  return SEMANAS_DEEL[curso][n]?.[locale] ?? null;
}

/** Cuántas semanas, sumando los dos cursos, tocan contenido acreditado. */
const SEMANAS_ACREDITADAS = Object.keys(SEMANAS_DEEL["remote-professional"]).length + Object.keys(SEMANAS_DEEL["remote-founder"]).length;

/** Las semanas acreditadas de un curso, en orden. */
export function deelWeeks(curso: Curso): number[] {
  return Object.keys(SEMANAS_DEEL[curso]).map(Number).sort((a, b) => a - b);
}

export const deelCourseCopy: Record<Locale, { seal: (n: number) => string; title: string; lead: string; weekLabel: string; listTitle: string }> = {
  es: {
    seal: (n) => `${n} semanas con contenidos acreditados`,
    title: "Contenidos acreditados por Deel.",
    lead: "Deel, la plataforma con la que miles de empresas contratan, pagan y gestionan equipos en todo el mundo, ha revisado y acreditado lo que aprendes sobre contratos, fiscalidad, compensación y contratación internacional.",
    weekLabel: "Semana",
    listTitle: "Dónde lo trabajas",
  },
  en: {
    seal: (n) => `${n} weeks of accredited content`,
    title: "Content accredited by Deel.",
    lead: "Deel, the platform thousands of companies use to hire, pay and manage teams worldwide, has reviewed and accredited what you learn about contracts, tax, compensation and international hiring.",
    weekLabel: "Week",
    listTitle: "Where you cover it",
  },
};

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
  gainsTitle: string;
  gains: { title: string; body: string }[];
  note: string;
  /** Versión corta para páginas de un solo módulo (el dry run). */
  short: { title: string; body: string; cta: string };
};

const es: DeelCopy = {
  seal: { title: "Deel Platinum Partner", sub: "Contenidos acreditados en los dos cursos" },
  tag: "Acreditado por Deel",
  eyebrow: "Acreditación Deel",
  title: "Contenidos de los dos cursos, acreditados por Deel.",
  lead: "Deel, la plataforma con la que miles de empresas contratan, pagan y gestionan equipos en todo el mundo, ha revisado y acreditado lo que aprendes sobre fiscalidad, reubicación, contratación internacional, compensación y compliance. Lo que aprendes ahí es cómo se hace de verdad.",
  badgesCaption: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner.",
  stats: [
    { value: String(SEMANAS_ACREDITADAS), label: "semanas con contenidos acreditados" },
    { value: "150+", label: "países donde opera Deel" },
    { value: "40.000+", label: "empresas confían en Deel" },
  ],
  whoTitle: "Quién es Deel",
  who: "El mundo del trabajo ha cambiado, y Deel ha construido el estándar que lo impulsa todo. Hace que contratar, gestionar, pagar y equipar a cualquier trabajador, en cualquier lugar, no cueste esfuerzo. Deel es una sola plataforma para nóminas, RR. HH., beneficios, movilidad, desempeño y gestión de dispositivos en más de 150 países. Construida sobre infraestructura propia, impulsada por IA y respaldada por miles de expertos locales, Deel ayuda a las empresas a escalar de forma más inteligente, más rápida y cumpliendo la normativa. Más de 40.000 clientes confían en ella, y nació para convertirse en una marca global que la gente quiera. Más información en deel.com.",
  whoCta: "Conoce Deel",
  modulesTitle: "Dónde lo trabajas",
  gainsTitle: "Qué significa para ti",
  gains: [
    { title: "Contenido revisado por quien lo hace a diario", body: "La parte fiscal, legal y de contratación internacional la ha validado la empresa que la resuelve para miles de compañías." },
    { title: "Deel abierto en clase", body: "No te lo cuentan en diapositivas: trabajas con la plataforma en pantalla, en ejercicios sobre tu propio caso." },
    { title: "Acreditación en tu diploma", body: "Tu diploma indica qué contenidos que has superado están acreditados por Deel." },
  ],
  note: "Deel y sus badges de partner son marcas de Deel y se usan con su permiso. Deel acredita los contenidos indicados; el diploma lo emite ActiveXRemote y es una certificación privada de empresa, no un título oficial ni un grado universitario.",
  short: {
    title: "Dos cursos con contenidos acreditados por Deel",
    body: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner. Lo que aprendes en Remote Professional y Remote Founder sobre fiscalidad, reubicación, compliance, compensación y contratación internacional está acreditado por Deel, la plataforma global de nóminas y RR. HH. presente en más de 150 países.",
    cta: "Ver los contenidos acreditados",
  },
};

const en: DeelCopy = {
  seal: { title: "Deel Platinum Partner", sub: "Accredited content in both courses" },
  tag: "Accredited by Deel",
  eyebrow: "Deel accreditation",
  title: "Content from both courses, accredited by Deel.",
  lead: "Deel, the platform thousands of companies use to hire, pay and manage teams worldwide, has reviewed and accredited what you learn about tax, relocation, international hiring, compensation and compliance. What you learn there is how it is really done.",
  badgesCaption: "ActiveXRemote is a Deel Platinum Partner and a Deel Global Partner.",
  stats: [
    { value: String(SEMANAS_ACREDITADAS), label: "weeks of accredited content" },
    { value: "150+", label: "countries Deel operates in" },
    { value: "40,000+", label: "companies trust Deel" },
  ],
  whoTitle: "Who Deel is",
  who: "The way the world works has changed—and Deel has built the standard to power it all. We make it effortless to hire, manage, pay, and equip any worker, anywhere. Deel is one platform for payroll, HR, benefits, mobility, performance, and device management across 150+ countries. Built on owned infrastructure, powered by AI, and supported by thousands of local experts, Deel helps businesses scale smarter, faster, and more compliantly. Trusted by 40,000+ customers, and created to become a global brand people love. Learn more at deel.com.",
  whoCta: "Discover Deel",
  modulesTitle: "Where you cover it",
  gainsTitle: "What it means for you",
  gains: [
    { title: "Reviewed by the people who do it every day", body: "The tax, legal and international hiring content has been validated by the company that solves it for thousands of businesses." },
    { title: "Deel open in class", body: "Not on slides: you work with the platform on screen, in exercises on your own case." },
    { title: "Accreditation on your diploma", body: "Your diploma shows which of the content you passed is accredited by Deel." },
  ],
  note: "Deel and its partner badges are trademarks of Deel, used with permission. Deel accredits the content listed; the diploma is issued by ActiveXRemote and is a private company certification, not an official qualification or a university degree.",
  short: {
    title: "Two courses with content accredited by Deel",
    body: "ActiveXRemote is a Deel Platinum Partner and a Deel Global Partner. What you learn in Remote Professional and Remote Founder about tax, relocation, compliance, compensation and international hiring is accredited by Deel, the global payroll and HR platform operating in 150+ countries.",
    cta: "See the accredited content",
  },
};

export const deelCopy: Record<Locale, DeelCopy> = { es, en };
