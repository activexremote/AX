import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

// El campus virtual es privado y su contenido está tras autenticación: no
// tiene nada que indexar y sí URLs que ensucian el rastreo.
//
// ⚠︎ La lista anterior bloqueaba "/cursos/*/leccion", una ruta que no existe
// en el proyecto, y dejaba sueltas las que sí: el campus vive en /lecciones,
// /modulos, /mi-progreso y /mis-tareas. La raíz "/" no se bloquea porque a
// quien no tiene sesión le sirve la landing pública.
export default function robots(): MetadataRoute.Robots {
  // Rutas privadas del campus. Se repiten para cada regla porque robots.txt
  // no hereda: un agente con su propio bloque ignora por completo el de "*".
  const privadas = [
    "/api/",
    "/auth/",
    "/login",
    "/admin",
    "/lecciones/",
    "/modulos/",
    "/mi-progreso",
    "/mis-tareas",
    "/es/",
  ];

  // Rastreadores de los buscadores conversacionales. Se listan uno a uno y se
  // les deja entrar A PROPÓSITO: el contenido está escrito para que lo citen
  // —cada sección abre con una respuesta autónoma— y bloquearlos sería
  // renunciar a aparecer justo donde la gente ha empezado a preguntar.
  // Google-Extended y Applebot-Extended son opt-out: sin regla ya estarían
  // dentro, pero se declaran para que la intención quede escrita.
  const motoresIA = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "meta-externalagent",
    "Bytespider",
  ];

  return {
    rules: [
      ...motoresIA.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: privadas,
      })),
      {
        userAgent: "*",
        allow: "/",
        // El español vive en la raíz. Si algo enlaza /es/… el proxy redirige,
        // pero mejor no gastar rastreo en descubrirlo.
        disallow: privadas,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
