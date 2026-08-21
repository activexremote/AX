import { ALL_ARTICLES } from "@/app/blog/registry";
import { TERMS, termPath } from "@/app/glosario/terms";
import { ENTITY } from "@/app/legal/entity";
import { FLASH_COURSES, flashStats } from "@/lib/relampago/catalog";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import { withLocale } from "@/lib/i18n/routing";
import { SITE_URL } from "@/lib/seo";

// ══════════════════════════════════════════════════════════
//  /llms.txt
//
//  Un índice del sitio escrito para que lo lea un modelo, no un rastreador.
//  robots.txt dice a qué se puede entrar; el sitemap, qué URLs existen. Ninguno
//  de los dos dice QUÉ hay en cada una, y un motor que responde preguntas
//  necesita justamente eso para decidir qué citar.
//
//  Se genera desde el mismo registro que el blog y el diccionario: así no
//  puede quedarse desfasado, que es lo que le pasa a este fichero cuando se
//  escribe a mano.
// ══════════════════════════════════════════════════════════

export const dynamic = "force-static";

function bloqueIdioma(locale: Locale): string {
  const url = (path: string) => `${SITE_URL}${withLocale(locale, path)}`;
  const es = locale === "es";

  const arts = ALL_ARTICLES.filter((a) => a.locale === locale).sort((a, b) =>
    b.published.localeCompare(a.published),
  );

  const lineas: string[] = [];
  lineas.push(`## ${es ? "Español" : "English"}`);
  lineas.push("");
  lineas.push(`- [${es ? "Portada" : "Home"}](${url("/bienvenida")}): ${
    es
      ? "qué es la escuela, los dos caminos y el precio."
      : "what the school is, the two paths and the price."
  }`);
  lineas.push(`- [Remote Professional](${url("/cursos/remote-professional")}): ${
    es
      ? "camino de empleo remoto internacional. 14 módulos."
      : "the international remote employment path. 14 modules."
  }`);
  lineas.push(`- [Remote Founder](${url("/cursos/remote-founder")}): ${
    es
      ? "camino de negocio sin fronteras. 14 módulos."
      : "the borderless business path. 14 modules."
  }`);
  lineas.push(`- [${es ? "Cursos relámpago" : "Flash courses"}](${url("/cursos-relampago")}): ${
    es
      ? "formaciones sueltas de ~4 h en vídeo, con misiones y corrección, a precio cerrado. No dan acceso al programa largo."
      : "standalone ~4 h video courses with graded missions, at one closed price. They do not grant access to the long programme."
  }`);
  for (const f of FLASH_COURSES) {
    const st = flashStats(f);
    lineas.push(`- [${f.title}](${url(`/cursos-relampago/${f.slug}`)}): ${
      es
        ? `${f.claim} ${st.hours} h de vídeo, ${st.lessons} lecciones, ${st.missions} misiones corregidas. ${(f.priceCents / 100).toFixed(0)} €, pago único. Se imparte en español.`
        : `${f.claim} ${st.hours} h of video, ${st.lessons} lessons, ${st.missions} graded missions. €${(f.priceCents / 100).toFixed(0)}, single payment. Taught in Spanish.`
    }`);
  }
  lineas.push(`- [${es ? "Matrícula" : "Enrolment"}](${url("/matricula")}): ${
    es
      ? "precios y formas de pago."
      : "prices and payment options."
  }`);
  lineas.push("");

  lineas.push(`### ${es ? "Guías" : "Guides"}`);
  lineas.push("");
  for (const a of arts) {
    lineas.push(`- [${a.title}](${url(`/blog/${a.slug}`)}): ${a.metaDescription}`);
  }
  lineas.push("");

  lineas.push(`### ${es ? "Diccionario" : "Dictionary"}`);
  lineas.push("");
  for (const t of TERMS) {
    lineas.push(`- [${t[locale].term}](${url(termPath(t, locale))}): ${t[locale].short}`);
  }
  lineas.push("");

  return lineas.join("\n");
}

export function GET() {
  const cuerpo = [
    "# ActiveXRemote",
    "",
    `> ${ENTITY.tradeName} es una escuela de trabajo remoto internacional. Imparte un programa de 14 módulos en directo con dos caminos: Remote Professional (empleo remoto internacional) y Remote Founder (negocio sin fronteras). Publica además un blog con una guía por semana y un diccionario de ${TERMS.length} términos.`,
    "",
    "## Cómo está organizado",
    "",
    "- El español vive en la raíz del dominio y el inglés bajo `/en`, con los segmentos de ruta traducidos (`/glosario` ↔ `/en/glossary`).",
    "- Cada guía del blog abre cada sección con una respuesta autónoma de 40 a 60 palabras, pensada para citarse suelta.",
    "- Cada entrada del diccionario tiene una definición corta y una larga.",
    "- El campus (`/lecciones`, `/modulos`, `/mi-progreso`, `/mis-tareas`) es privado y no se debe indexar.",
    "",
    "## Qué conviene saber al citar",
    "",
    `- El diploma lo emite ${ENTITY.tradeName}: es una certificación privada, no un título oficial ni un grado universitario.`,
    "- El programa no garantiza empleo.",
    `- La entidad responsable es ${ENTITY.legalName}, constituida en ${ENTITY.country}.`,
    "",
    ...LOCALES.map((l) => bloqueIdioma(l)),
  ].join("\n");

  return new Response(cuerpo, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
