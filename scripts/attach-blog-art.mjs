#!/usr/bin/env node
// Cuelga cada ilustración de su artículo, en los dos idiomas.
//
//   node scripts/attach-blog-art.mjs
//
// Cada tema tiene UNA ilustración y dos artículos (ES y EN): son el mismo
// texto en dos idiomas, así que compartir la imagen es lo correcto — y de paso
// hace que las dos versiones se reconozcan como la misma pieza.
//
// El `alt` no repite el titular: describe lo que se ve. Un lector de pantalla
// que ya ha oído el h1 no gana nada si la imagen se lo vuelve a leer.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const ART = [
  {
    key: "mercado-global",
    es: { slug: "trabajo-remoto-internacional-desde-espana", alt: "Diagrama: dos husos horarios unidos por un arco de trabajo que cruza la distancia." },
    en: { slug: "international-remote-jobs-from-europe", alt: "Diagram: two time zones joined by an arc of work spanning the distance." },
  },
  {
    key: "intermediario-legal",
    es: { slug: "como-trabajar-para-empresa-extranjera-legalmente", alt: "Diagrama: dos empresas en países distintos y el contrato que hace de puente entre ambas." },
    en: { slug: "employer-of-record-vs-contractor", alt: "Diagram: two companies in different countries and the contract bridging them." },
  },
  {
    key: "criba-candidatura",
    es: { slug: "cv-internacional-ats", alt: "Diagrama: un currículum atraviesa la ranura de un filtro y sale reducido a lo que la máquina sabe leer." },
    en: { slug: "ats-friendly-resume", alt: "Diagram: a resume passes through a filter slot and comes out as what the machine can read." },
  },
  {
    key: "umbral-dias",
    es: { slug: "residencia-fiscal-nomada-digital", alt: "Diagrama: rejilla de días del año con una línea de corte que separa los que cuentan de los que no." },
    en: { slug: "tax-residency-remote-workers", alt: "Diagram: a grid of days in the year with a threshold line separating those that count from those that don't." },
  },
  {
    key: "balanza",
    es: { slug: "negociar-salario-remoto-internacional", alt: "Diagrama: una balanza desequilibrada entre lo que se ofrece y lo que se pide." },
    en: { slug: "negotiating-remote-salary", alt: "Diagram: a scale tipped between what is offered and what is asked for." },
  },
  {
    key: "producto-cerrado",
    es: { slug: "de-freelance-a-negocio-productizado", alt: "Diagrama: horas sueltas de distinta longitud que se compactan en un único bloque cerrado." },
    en: { slug: "productised-service-business", alt: "Diagram: scattered hours of varying length compacted into a single closed block." },
  },
  {
    key: "fuga-cobro",
    es: { slug: "cobrar-clientes-extranjero", alt: "Diagrama: un canal de cobro del que se desvía una parte antes de llegar al destino." },
    en: { slug: "getting-paid-internationally", alt: "Diagram: a payment channel with a portion diverting away before it arrives." },
  },
  {
    key: "convergencia",
    es: { slug: "conseguir-clientes-b2b-internacionales", alt: "Diagrama: cinco contactos dispersos cuyas líneas convergen en un solo cliente." },
    en: { slug: "b2b-clients-without-network", alt: "Diagram: five scattered contacts whose lines converge on a single client." },
  },
  {
    key: "amplificador",
    es: { slug: "ia-para-buscar-trabajo-remoto", alt: "Diagrama: una señal entra en un amplificador triangular y salen cinco." },
    en: { slug: "ai-for-job-search", alt: "Diagram: one signal enters a triangular amplifier and five come out." },
  },
  {
    key: "bifurcacion",
    es: { slug: "curso-trabajo-remoto-cual-elegir", alt: "Diagrama: un camino que se bifurca en dos destinos distintos." },
  },
  {
    key: "etiqueta-erronea",
    en: { slug: "worker-misclassification-risk", alt: "Diagram: a triangular shape sitting inside a dashed outline meant for a circle." },
  },
  {
    key: "asincronia",
    es: { slug: "trabajo-asincrono-guia", alt: "Diagrama: dos jornadas en husos distintos que se relevan sin coincidir nunca." },
    en: { slug: "async-work-guide", alt: "Diagram: two working days in different time zones handing over without ever overlapping." },
  },
  {
    key: "solapamiento",
    es: { slug: "solapamiento-horario-ofertas-remotas", alt: "Diagrama: dos jornadas y la franja estrecha en la que de verdad se solapan." },
    en: { slug: "time-zone-overlap-explained", alt: "Diagram: two working days and the narrow band where they actually overlap." },
  },
  {
    key: "pila",
    es: { slug: "stack-remoto-imprescindible", alt: "Diagrama: cuatro capas apiladas, cada una más estrecha que la de abajo." },
    en: { slug: "remote-work-stack", alt: "Diagram: four stacked layers, each narrower than the one beneath it." },
  },
  {
    key: "muestrario",
    es: { slug: "portfolio-para-recruiters-internacionales", alt: "Diagrama: una rejilla de seis piezas de trabajo con una destacada sobre las demás." },
    en: { slug: "proof-of-work-portfolio", alt: "Diagram: a grid of six work samples with one standing out from the rest." },
  },
  {
    key: "requisitos",
    es: { slug: "visados-nomada-digital-comparativa", alt: "Diagrama: cinco barras de ingresos frente a la línea mínima que exige el visado." },
    en: { slug: "digital-nomad-visa-comparison", alt: "Diagram: five income bars against the minimum threshold a visa requires." },
  },
  {
    key: "pantalla-voz",
    es: { slug: "entrevista-remota-video-asincrona", alt: "Diagrama: una pantalla de vídeo junto a la onda de una respuesta grabada." },
    en: { slug: "async-interview-and-video-screening", alt: "Diagram: a video screen beside the waveform of a recorded answer." },
  },
  {
    key: "rampa",
    es: { slug: "primeros-90-dias-equipo-distribuido", alt: "Diagrama: tres tramos ascendentes que representan los tres primeros meses." },
    en: { slug: "first-90-days-remote-team", alt: "Diagram: three rising steps representing the first three months." },
  },
  {
    key: "onda-decreciente",
    es: { slug: "burnout-remoto-senales", alt: "Diagrama: una onda que pierde amplitud a partir de un punto marcado." },
    en: { slug: "remote-burnout-signals", alt: "Diagram: a wave losing amplitude from a marked point onwards." },
  },
  {
    key: "automatismo",
    es: { slug: "automatizar-negocio-sin-codigo", alt: "Diagrama: un disparador que encadena una tarea y ésta, dos más en paralelo." },
    en: { slug: "no-code-automation-for-solopreneurs", alt: "Diagram: a trigger chaining one task, which in turn branches into two more." },
  },
  {
    key: "procedimiento",
    es: { slug: "sop-documentar-procesos", alt: "Diagrama: tres pasos numerados que se convierten en un documento entregable." },
    en: { slug: "writing-sops-to-delegate", alt: "Diagram: three numbered steps turning into a handover document." },
  },
];

let touched = 0;
let missing = [];

for (const topic of ART) {
  for (const locale of ["es", "en"]) {
    const entry = topic[locale];
    if (!entry) continue;

    const path = `src/app/blog/articles/${entry.slug}.ts`;
    if (!existsSync(path)) {
      missing.push(entry.slug);
      continue;
    }

    let src = readFileSync(path, "utf8");
    const line = `  hero: { file: "/blog/${topic.key}.svg", alt: ${JSON.stringify(entry.alt)} },`;

    if (src.includes("  hero: {")) {
      // Ya la tenía: se reescribe, para poder cambiar textos sin duplicar.
      src = src.replace(/^ {2}hero: \{[^\n]*\},$/m, line);
    } else {
      // El objeto del artículo termina en un "};" al principio de línea.
      const at = src.lastIndexOf("\n};");
      if (at === -1) {
        missing.push(`${entry.slug} (no se encontró el cierre del objeto)`);
        continue;
      }
      src = `${src.slice(0, at)}\n${line}${src.slice(at)}`;
    }

    writeFileSync(path, src, "utf8");
    touched++;
  }
}

console.log(`${touched} artículos con ilustración.`);
if (missing.length) {
  console.log(`\n⚠︎ sin resolver (${missing.length}):`);
  missing.forEach((m) => console.log(`   ${m}`));
  process.exitCode = 1;
}
