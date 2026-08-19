import type { MetadataRoute } from "next";

import { ENTITY } from "@/app/legal/entity";

// El campus virtual es privado y su contenido está tras autenticación: no
// tiene nada que indexar y sí URLs que ensucian el rastreo. Se bloquean de
// forma explícita en vez de dejar que el rastreador choque con el login.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/login",
          "/auth/",
          "/admin",
          "/cursos/*/leccion",
        ],
      },
    ],
    sitemap: `https://${ENTITY.domain}/sitemap.xml`,
    host: `https://${ENTITY.domain}`,
  };
}
