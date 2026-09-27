import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "node_modules")],
    // "mixed-decls" ya no es una deprecación de Sass: seguir silenciándola
    // es justo lo que hacía saltar un aviso en cada .scss del proyecto.
    silenceDeprecations: ["global-builtin", "import"],
  },
  transpilePackages: ["@carbon/react", "@carbon/icons-react", "@carbon/styles"],
  // PDFKit lee sus fuentes base (los .afm de Helvetica) del disco, con rutas
  // relativas a su propio paquete. Empaquetarlo rompe esas rutas y el PDF
  // falla al escribir la primera letra: se deja fuera del bundle.
  //
  // unpdf (el texto de los PDF que se suben al asistente) trae su propio
  // PDF.js y lo carga con un import dinámico: fuera del bundle también.
  serverExternalPackages: ["pdfkit", "unpdf"],
  // Y además hay que llevarse sus .afm a la función.
  //
  // PDFKit abre las métricas de Helvetica con
  // `readFileSync(__dirname + "/data/Helvetica.afm")`. Esa ruta se construye
  // en tiempo de ejecución, así que el rastreador de ficheros de Next no la
  // ve y en producción la función se despliega sin los .afm: el PDF revienta
  // al escribir la primera letra, y sólo allí, nunca en local.
  outputFileTracingIncludes: {
    "/lens/calculadora-matriculas/pdf": ["./node_modules/pdfkit/js/data/**"],
  },
  experimental: {
    optimizePackageImports: ["@carbon/react", "@carbon/icons-react"],
    // Los documentos del asistente (/admin/asistente) se suben por server
    // action, y el límite por defecto es 1 MB: un PDF de calendario con
    // cuatro imágenes ya no entraba. 4 MB, que es lo que admite Vercel en el
    // cuerpo de una petición a una función.
    serverActions: {
      // 12 MB de archivo + el sobre de multipart. Lo sube el profesor al
      // crear una lección desde un PDF (ver lib/ingesta/formatos.ts).
      bodySizeLimit: "14mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzmllhwkplpfmjddqknh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
