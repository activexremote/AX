import type { Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Secciones firma de cada curso.
//
//  Las dos landings compartían el mismo esqueleto con distinto texto, y eso
//  se nota: quien llega desde un anuncio no distingue en qué se ha metido.
//  Cada curso tiene aquí un bloque que el otro NO tiene, con su propia forma
//  visual, y que explica de un vistazo el problema concreto que resuelve.
//
//   · Remote Professional → el embudo real de una candidatura internacional.
//     Es el bloque que responde «¿por qué no me llaman?».
//   · Remote Founder → la matemática de vender horas frente a vender un
//     sistema. Es el bloque que responde «¿por qué no escalo?».
// ══════════════════════════════════════════════════════════

// ── Embudo (Remote Professional) ─────────────────────────
export type FunnelStage = {
  /** Cuántos quedan de los que empezaron. Es la cifra que se anima. */
  value: number;
  label: string;
  /** Qué pasa aquí y por qué se cae la gente. */
  desc: string;
  /** Qué módulo del programa ataca esta etapa. */
  fix: string;
};

export type FunnelCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  ofLabel: string;
  fixLabel: string;
  close: string;
  stages: FunnelStage[];
};

export const funnelCopy: Record<Locale, FunnelCopy> = {
  es: {
    eyebrow: "El problema real",
    title: "No te descartan por tu perfil. Te descartan antes de leerlo.",
    lead: "Así se comporta una vacante remota internacional con salario competitivo. Las cifras son el orden de magnitud habitual del sector, no una promesa: sirven para ver dónde se pierde una candidatura.",
    ofLabel: "de cada 1.000",
    fixLabel: "Dónde se ataca",
    close:
      "El programa no te enseña a escribir un currículum más bonito. Te enseña a no caer en ninguno de estos cinco puntos.",
    stages: [
      {
        value: 1000,
        label: "Personas ven la oferta",
        desc: "Una vacante remota internacional no compite con tu ciudad: compite con todos los husos horarios que encajan en su requisito de solapamiento.",
        fix: "Módulo 08 · Dónde están las vacantes que no se publican",
      },
      {
        value: 240,
        label: "Llegan a enviar la candidatura",
        desc: "La mayoría se autodescarta al leer requisitos que no entiende: solapamiento horario, tipo de contrato, país elegible.",
        fix: "Módulo 08 · Leer una oferta internacional sin autoexcluirte",
      },
      {
        value: 62,
        label: "Pasan el filtro del ATS",
        desc: "El sistema lee mal las plantillas creativas, las columnas y los PDF con tablas. No te rechaza por malo: te rechaza por ilegible.",
        fix: "Módulo 09 · Currículum legible por ATS y por humanos",
      },
      {
        value: 14,
        label: "Reciben una respuesta humana",
        desc: "Aquí decide el portfolio y la marca personal. Quien contrata desde otro continente no puede llamar a tu antiguo jefe.",
        fix: "Módulo 10 · Portfolio y marca personal internacional",
      },
      {
        value: 3,
        label: "Llegan a la entrevista final",
        desc: "La entrevista remota se gana en vídeo y en asíncrono, dos formatos que casi nadie ha practicado nunca.",
        fix: "Módulo 11 · Entrevista en vídeo y prueba asíncrona",
      },
      {
        value: 1,
        label: "Recibe y negocia la oferta",
        desc: "Y quien no sabe qué es la compensación global ni el salario ajustado por ubicación, firma la primera cifra que le dicen.",
        fix: "Módulo 12 · Negociación y compensación global",
      },
    ],
  },
  en: {
    eyebrow: "The real problem",
    title: "You are not rejected for your profile. You are rejected before it is read.",
    lead: "This is how a well-paid international remote opening behaves. The figures are the sector's usual order of magnitude, not a promise: they exist to show where an application is lost.",
    ofLabel: "of every 1,000",
    fixLabel: "Where it is tackled",
    close:
      "The program does not teach you to write a prettier CV. It teaches you not to fall at any of these five points.",
    stages: [
      {
        value: 1000,
        label: "People see the opening",
        desc: "An international remote opening does not compete with your city: it competes with every time zone that fits its overlap requirement.",
        fix: "Module 08 · Where the unpublished openings are",
      },
      {
        value: 240,
        label: "Actually apply",
        desc: "Most rule themselves out on requirements they do not understand: time zone overlap, contract type, eligible countries.",
        fix: "Module 08 · Reading an international posting without self-rejecting",
      },
      {
        value: 62,
        label: "Get through the ATS",
        desc: "The system misreads creative templates, columns and PDFs with tables. It does not reject you for being weak: it rejects you for being unreadable.",
        fix: "Module 09 · A CV readable by ATS and by humans",
      },
      {
        value: 14,
        label: "Get a human reply",
        desc: "Portfolio and personal brand decide here. Someone hiring from another continent cannot call your old manager.",
        fix: "Module 10 · International portfolio and personal brand",
      },
      {
        value: 3,
        label: "Reach the final interview",
        desc: "Remote interviews are won on video and async, two formats almost nobody has ever practised.",
        fix: "Module 11 · Video interview and async assignment",
      },
      {
        value: 1,
        label: "Receive and negotiate the offer",
        desc: "And whoever does not know what total compensation or location-based pay means signs the first figure they are given.",
        fix: "Module 12 · Negotiation and global compensation",
      },
    ],
  },
};

// ── Modelo de negocio (Remote Founder) ───────────────────
export type ModelColumn = {
  tag: string;
  title: string;
  desc: string;
  /** Rasgos del modelo, en el mismo orden en las dos columnas para comparar. */
  rows: string[];
  /** Techo del modelo, expresado en una frase. */
  ceiling: string;
  /** 0-100: cuánto crece el ingreso sin añadir horas. Mueve la barra. */
  leverage: number;
};

export type ModelCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  rowLabels: string[];
  leverageLabel: string;
  ceilingLabel: string;
  close: string;
  before: ModelColumn;
  after: ModelColumn;
};

export const modelCopy: Record<Locale, ModelCopy> = {
  es: {
    eyebrow: "El cambio de modelo",
    title: "Mientras cobres por horas, tu negocio tiene un techo con fecha.",
    lead: "No es una cuestión de tarifas. Es una cuestión de qué vendes: si vendes tiempo, cada euro más exige una hora más. Este es el salto que se construye durante las siete semanas de especialización.",
    rowLabels: [
      "Qué vendes",
      "Cómo se fija el precio",
      "Quién entrega",
      "Qué pasa si te vas dos semanas",
      "Qué mejora con la repetición",
    ],
    leverageLabel: "Ingreso que no depende de tus horas",
    ceilingLabel: "El techo",
    close:
      "Los siete módulos de Remote Founder son el recorrido de la columna izquierda a la derecha, en este orden: oferta, clientes, entrega, sistema, automatización y estructura.",
    before: {
      tag: "Punto de partida",
      title: "Vendes horas",
      desc: "El modelo con el que empieza casi todo el mundo: un cliente, un presupuesto a medida y una agenda que se llena.",
      rows: [
        "Tu tiempo y tu presencia",
        "Por hora o por proyecto, negociado cada vez",
        "Sólo tú",
        "El ingreso se para",
        "Nada: cada proyecto empieza de cero",
      ],
      ceiling: "Las horas que caben en una semana, menos las que necesitas para vivir.",
      leverage: 8,
    },
    after: {
      tag: "Adónde vas",
      title: "Vendes un sistema",
      desc: "Una oferta productizada, un proceso documentado y una captación que funciona cuando no estás delante.",
      rows: [
        "Un resultado con alcance y plazo cerrados",
        "Precio fijo, publicado, sin negociación por caso",
        "Tú, un proceso documentado y automatizaciones",
        "El sistema sigue entregando y captando",
        "Todo: cada repetición afina el proceso",
      ],
      ceiling: "La demanda de tu mercado, no las horas de tu semana.",
      leverage: 74,
    },
  },
  en: {
    eyebrow: "The model shift",
    title: "As long as you bill by the hour, your business has a ceiling with a date on it.",
    lead: "It is not a question of rates. It is a question of what you sell: if you sell time, every extra euro demands an extra hour. This is the jump built during the seven weeks of specialisation.",
    rowLabels: [
      "What you sell",
      "How price is set",
      "Who delivers",
      "What happens if you take two weeks off",
      "What improves with repetition",
    ],
    leverageLabel: "Income that does not depend on your hours",
    ceilingLabel: "The ceiling",
    close:
      "The seven Remote Founder modules are the journey from the left column to the right one, in this order: offer, clients, delivery, system, automation and structure.",
    before: {
      tag: "Starting point",
      title: "You sell hours",
      desc: "The model almost everyone starts with: one client, a bespoke quote and a calendar that fills up.",
      rows: [
        "Your time and your presence",
        "Hourly or per project, negotiated every time",
        "Only you",
        "Income stops",
        "Nothing: every project starts from scratch",
      ],
      ceiling: "The hours that fit in a week, minus the ones you need to live.",
      leverage: 8,
    },
    after: {
      tag: "Where you are going",
      title: "You sell a system",
      desc: "A productised offer, a documented process and client acquisition that works when you are not there.",
      rows: [
        "An outcome with fixed scope and timeline",
        "Fixed, published price, no case-by-case haggling",
        "You, a documented process and automations",
        "The system keeps delivering and acquiring",
        "Everything: each repetition sharpens the process",
      ],
      ceiling: "Your market's demand, not the hours in your week.",
      leverage: 74,
    },
  },
};
