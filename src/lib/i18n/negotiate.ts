import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

// ══════════════════════════════════════════════════════════
//  Qué idioma quiere el navegador
//
//  Se separa del proxy porque es la única pieza con lógica de verdad —el resto
//  es enrutado— y así se puede probar sola con cabeceras reales.
// ══════════════════════════════════════════════════════════

/**
 * A dónde va quien no habla ninguno de los dos idiomas del sitio.
 *
 * Un navegador en francés o en alemán entiende antes una web en inglés que en
 * español. El español es el idioma por defecto del sitio porque es el mercado
 * principal, pero eso vale para quien no ha dicho nada, no para quien ha dicho
 * algo que no tenemos.
 */
const FALLBACK_EXTRANJERO: Locale = "en";

/**
 * Mejor idioma disponible según `Accept-Language`.
 *
 * La cabecera llega ordenada por preferencia y con pesos:
 *   `es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7`
 * Se respeta el peso, no el orden de aparición, porque no siempre coinciden.
 *
 * `es-419`, `es-MX` o `es-AR` cuentan como español: sólo importa la parte
 * anterior al guion. Un colombiano no tiene que ver la web en inglés porque
 * su navegador diga `es-CO`.
 *
 * Hay tres desenlaces y no conviene confundirlos:
 *
 *   · coincide `es` o `en`  → ese idioma;
 *   · la cabecera dice algo, pero ninguno de los dos (francés, alemán…)
 *     → inglés, que es el idioma franco de quien no habla ninguno;
 *   · no hay cabecera, o está vacía → `null`, «no sé». Quien llama decide.
 *     No es lo mismo no saber que saber que no coincide.
 */
export function negotiateLocale(header: string | null): Locale | null {
  if (!header) return null;

  const entradas = header
    .split(",")
    .map((parte) => {
      const [etiqueta, ...params] = parte.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const peso = q === undefined ? 1 : Number.parseFloat(q);
      return {
        base: etiqueta.trim().toLowerCase().split("-")[0],
        // Un `q` ilegible se toma como preferencia plena, no como rechazo.
        // Tratarlo como 0 haría que `en-US;q=abc` —una cabecera rota, pero de
        // alguien que lee inglés— acabara sirviendo español.
        peso: Number.isFinite(peso) ? peso : 1,
      };
    });

  if (entradas.length === 0) return null;

  // `q=0` no es «me da igual»: es «este idioma no». Se anota para no acabar
  // sirviéndole justo el que ha rechazado.
  const vetados = new Set(entradas.filter((e) => e.peso === 0).map((e) => e.base));

  const candidatos = entradas.filter((e) => e.peso > 0).sort((a, b) => b.peso - a.peso);

  for (const c of candidatos) {
    // "*" es «me vale cualquiera»: se le da el idioma principal del sitio.
    if (c.base === "*") return DEFAULT_LOCALE;
    if ((LOCALES as readonly string[]).includes(c.base)) return c.base as Locale;
  }

  // Pidió idiomas concretos y ninguno es de los nuestros. Va a inglés, salvo
  // que lo haya vetado: entonces le queda el otro que tenemos.
  if (vetados.has(FALLBACK_EXTRANJERO)) {
    return vetados.has(DEFAULT_LOCALE) ? null : DEFAULT_LOCALE;
  }
  return FALLBACK_EXTRANJERO;
}

/**
 * Rastreadores que NO deben ser redirigidos por idioma.
 *
 * ⚠︎ Esto no es una optimización, es lo que sostiene el SEO multilingüe.
 * Googlebot rastrea casi siempre con `Accept-Language: en`. Si se le redirige
 * como a una persona, nunca llega a la versión española y deja de indexarla —
 * y con ella se cae la mitad del hreflang. Un buscador tiene que recibir
 * exactamente la URL que ha pedido, siempre.
 */
const BOTS =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|headless|lighthouse|gptbot|claudebot|perplexity|ccbot|applebot|bytespider|embed|curl|wget|python-requests|node-fetch|axios/i;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true; // sin identificarse, se trata como máquina
  return BOTS.test(userAgent);
}
