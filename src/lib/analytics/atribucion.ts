// ══════════════════════════════════════════════════════════
//  De dónde viene cada visita, guardado en el navegador
//
//  Quien llega por un anuncio casi nunca rellena el formulario en la primera
//  página: entra en /trabajo-remoto?utm_…, lee, pasa a la ficha del curso y
//  se inscribe allí, en una URL que ya no lleva nada. Por eso los `utm_*` y
//  los identificadores de clic se guardan en localStorage al cargar cada
//  página pública (<CapturaAtribucion/> en el layout raíz), junto con la
//  página de entrada, y el formulario los lee al enviar.
//
//  Atribución a última interacción con parámetros: una visita nueva con
//  `utm_*` o clic de anuncio sustituye a la anterior; una sin ellos no borra
//  nada. Caduca a los 90 días, como la ventana de conversión de los anuncios.
//
//  Sólo en el navegador. Si localStorage no está (modo privado, bloqueado),
//  se lee la URL de la página actual y listo.
// ══════════════════════════════════════════════════════════

export const PARAMS_ATRIBUCION = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

type Param = (typeof PARAMS_ATRIBUCION)[number];

export type Atribucion = Partial<Record<Param, string>> & {
  /** Ruta de la primera página de la visita que trajo estos parámetros. */
  landing_page?: string;
  /** Cuándo se guardó, en ISO. */
  captured_at?: string;
};

const CLAVE = "axr_atribucion";
const DURA_MS = 90 * 24 * 60 * 60 * 1000;

function deLaUrl(): Atribucion {
  const q = new URLSearchParams(window.location.search);
  const valores: Atribucion = {};
  for (const p of PARAMS_ATRIBUCION) {
    // Tope de longitud: una URL de anuncio puede traer parámetros larguísimos
    // y los campos de texto de Zoho no son infinitos.
    const v = (q.get(p) ?? "").trim().slice(0, 255);
    if (v) valores[p] = v;
  }
  return valores;
}

function leerGuardada(): Atribucion | null {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return null;
    const a = JSON.parse(crudo) as Atribucion;
    if (a.captured_at && Date.now() - Date.parse(a.captured_at) > DURA_MS) return null;
    return a;
  } catch {
    return null;
  }
}

/** Al cargar una página pública: guarda los parámetros de la URL, si los trae. */
export function captureAttribution(): void {
  const nuevos = deLaUrl();
  const guardada = leerGuardada();
  // Sin parámetros y con algo guardado: se queda lo que había. Sin nada
  // guardado, al menos la página de entrada (tráfico directo u orgánico).
  if (!Object.keys(nuevos).length && guardada) return;
  const a: Atribucion = { ...nuevos, landing_page: window.location.pathname, captured_at: new Date().toISOString() };
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(a));
  } catch {
    // Almacenamiento bloqueado: el formulario tirará de la URL actual.
  }
}

/** Lo que el formulario manda con el lead. */
export function getAttribution(): Atribucion {
  return leerGuardada() ?? { ...deLaUrl(), landing_page: window.location.pathname };
}

/**
 * El envío correcto del formulario, para Tag Manager: `lead_form_submit` es
 * el evento que espera el activador del contenedor.
 */
export function pushLeadEvent(detail: { courses?: string[] } = {}): void {
  const a = leerGuardada();
  window.dataLayer?.push({
    event: "lead_form_submit",
    axr_courses: detail.courses ?? [],
    utm_source: a?.utm_source,
    utm_medium: a?.utm_medium,
    utm_campaign: a?.utm_campaign,
  });
}
