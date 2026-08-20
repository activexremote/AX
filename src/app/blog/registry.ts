import type { Locale } from "@/lib/i18n/config";

import type { Article } from "@/app/blog/types";
import { article as esManifiesto } from "@/app/blog/articles/que-es-activexremote";
import { article as enManifiesto } from "@/app/blog/articles/what-is-activexremote";
import { article as esRemoteEspana } from "@/app/blog/articles/trabajo-remoto-internacional-desde-espana";
import { article as esEmpresaExtranjera } from "@/app/blog/articles/como-trabajar-para-empresa-extranjera-legalmente";
import { article as esCvAts } from "@/app/blog/articles/cv-internacional-ats";
import { article as esResidenciaFiscal } from "@/app/blog/articles/residencia-fiscal-nomada-digital";
import { article as esNegociarSalario } from "@/app/blog/articles/negociar-salario-remoto-internacional";
import { article as esProductizado } from "@/app/blog/articles/de-freelance-a-negocio-productizado";
import { article as enRemoteEurope } from "@/app/blog/articles/international-remote-jobs-from-europe";
import { article as enEorContractor } from "@/app/blog/articles/employer-of-record-vs-contractor";
import { article as enAtsResume } from "@/app/blog/articles/ats-friendly-resume";
import { article as enTaxResidency } from "@/app/blog/articles/tax-residency-remote-workers";
import { article as esCobrar } from "@/app/blog/articles/cobrar-clientes-extranjero";
import { article as esClientesB2B } from "@/app/blog/articles/conseguir-clientes-b2b-internacionales";
import { article as esIaTrabajo } from "@/app/blog/articles/ia-para-buscar-trabajo-remoto";
import { article as esElegirCurso } from "@/app/blog/articles/curso-trabajo-remoto-cual-elegir";
import { article as enNegotiating } from "@/app/blog/articles/negotiating-remote-salary";
import { article as enGettingPaid } from "@/app/blog/articles/getting-paid-internationally";
import { article as enProductised } from "@/app/blog/articles/productised-service-business";
import { article as enB2B } from "@/app/blog/articles/b2b-clients-without-network";
import { article as enAiJob } from "@/app/blog/articles/ai-for-job-search";
import { article as enMisclass } from "@/app/blog/articles/worker-misclassification-risk";
import { article as enAsync } from "@/app/blog/articles/async-work-guide";
import { article as enOverlap } from "@/app/blog/articles/time-zone-overlap-explained";
import { article as enStack } from "@/app/blog/articles/remote-work-stack";
import { article as enPortfolio } from "@/app/blog/articles/proof-of-work-portfolio";
import { article as enNomadVisa } from "@/app/blog/articles/digital-nomad-visa-comparison";
import { article as enAsyncInterview } from "@/app/blog/articles/async-interview-and-video-screening";
import { article as enFirst90 } from "@/app/blog/articles/first-90-days-remote-team";
import { article as enBurnout } from "@/app/blog/articles/remote-burnout-signals";
import { article as enNoCode } from "@/app/blog/articles/no-code-automation-for-solopreneurs";
import { article as enSops } from "@/app/blog/articles/writing-sops-to-delegate";
import { article as esAsync } from "@/app/blog/articles/trabajo-asincrono-guia";
import { article as esOverlap } from "@/app/blog/articles/solapamiento-horario-ofertas-remotas";
import { article as esPortfolio } from "@/app/blog/articles/portfolio-para-recruiters-internacionales";
import { article as esEntrevista } from "@/app/blog/articles/entrevista-remota-video-asincrona";
import { article as es90Dias } from "@/app/blog/articles/primeros-90-dias-equipo-distribuido";
import { article as esBurnout } from "@/app/blog/articles/burnout-remoto-senales";
import { article as esStack } from "@/app/blog/articles/stack-remoto-imprescindible";
import { article as esAutomatizar } from "@/app/blog/articles/automatizar-negocio-sin-codigo";
import { article as esSops } from "@/app/blog/articles/sop-documentar-procesos";
import { article as esVisados } from "@/app/blog/articles/visados-nomada-digital-comparativa";

// Registro de artículos escritos. El mapa de contenidos (content-map.ts)
// declara los 40 previstos; aquí sólo están los que existen de verdad, para
// que el sitemap y el listado nunca enlacen a una página que no hay.
const ALL: readonly Article[] = [
  esManifiesto,
  enManifiesto,
  esRemoteEspana,
  esEmpresaExtranjera,
  esCvAts,
  esResidenciaFiscal,
  esNegociarSalario,
  esProductizado,
  enRemoteEurope,
  enEorContractor,
  enAtsResume,
  enTaxResidency,
  esCobrar,
  esClientesB2B,
  esIaTrabajo,
  esElegirCurso,
  enNegotiating,
  enGettingPaid,
  enProductised,
  enB2B,
  enAiJob,
  enMisclass,
  enAsync,
  enOverlap,
  enStack,
  enPortfolio,
  enNomadVisa,
  enAsyncInterview,
  enFirst90,
  enBurnout,
  enNoCode,
  enSops,
  esAsync,
  esOverlap,
  esPortfolio,
  esEntrevista,
  es90Dias,
  esBurnout,
  esStack,
  esAutomatizar,
  esSops,
  esVisados,
];

export function articlesFor(locale: Locale): Article[] {
  return ALL.filter((a) => a.locale === locale).sort((a, b) =>
    b.published.localeCompare(a.published),
  );
}

export function getArticle(slug: string): Article | undefined {
  return ALL.find((a) => a.slug === slug);
}

export const ALL_ARTICLES = ALL;

/**
 * El post 1 de cada idioma: qué es ActiveXRemote.
 *
 * Va destacado en la portada del blog y en las landings. Se marca por slug y
 * no por fecha porque es el más antiguo: ordenando por fecha quedaría el
 * último, que es justo donde no sirve.
 */
const FEATURED: Record<Locale, string> = {
  es: "que-es-activexremote",
  en: "what-is-activexremote",
};

export function featuredArticle(locale: Locale): Article | undefined {
  return getArticle(FEATURED[locale]);
}

/** Los artículos del idioma SIN el destacado, para no repetirlo en la rejilla. */
export function articlesForList(locale: Locale): Article[] {
  return articlesFor(locale).filter((a) => a.slug !== FEATURED[locale]);
}
