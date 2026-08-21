// Resolutor de `@/…` para los scripts que leen los módulos de la app con
// `node --experimental-strip-types`.
//
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs script.mjs
//
// Node no lee `paths` de tsconfig, así que sin esto cualquier archivo de src/
// que importe con alias revienta. Y como en el código de la app los imports
// van sin extensión —que es lo normal en TypeScript— aquí hay que probarlas:
// Node exige la extensión y TypeScript la prohíbe.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

const RAIZ = pathToFileURL(`${process.cwd()}/src/`).href;

register(
  `data:text/javascript,
   import { existsSync } from "node:fs";
   import { fileURLToPath } from "node:url";
   const RAIZ = ${JSON.stringify(RAIZ)};
   const EXT = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];
   export function resolve(spec, ctx, next) {
     if (!spec.startsWith("@/")) return next(spec, ctx);
     const base = RAIZ + spec.slice(2);
     for (const e of EXT) {
       const url = base + e;
       if (existsSync(fileURLToPath(url))) return next(url, ctx);
     }
     return next(base, ctx);
   }`,
  import.meta.url,
);
