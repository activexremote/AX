// Pinta el ejemplo de cada línea visual del generador de banners
// (src/lib/banners/direcciones.ts) y lo deja en public/banners/lineas/<id>.webp.
//
//   set -a; source .env.local; set +a
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs scripts/build-banner-lineas.mjs [id …] [--force]
//
// Sin ids, pinta las que falten; con --force, las vuelve a pintar. Usa la
// clave de OpenAI del panel (ai_settings) o OPENAI_API_KEY, y el mismo prompt
// que una variante real: escena + estilo de la línea + normas de imagen.
// Cada ejemplo cuesta unos 0,05 $ (calidad media).
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import sharp from "sharp";

import { LINEAS } from "../src/lib/banners/direcciones.ts";
import { REGLAS_IMAGEN } from "../src/lib/banners/marca.ts";

const args = process.argv.slice(2);
const force = args.includes("--force");
const ids = args.filter((a) => !a.startsWith("--"));
const DIR = join(process.cwd(), "public/banners/lineas");
mkdirSync(DIR, { recursive: true });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: row } = await supabase.from("ai_settings").select("openai_api_key").eq("id", "default").maybeSingle();
const apiKey = (row?.openai_api_key || process.env.OPENAI_API_KEY || "").trim();
if (!apiKey) throw new Error("No hay clave de OpenAI (panel → IA u OPENAI_API_KEY).");
const client = new OpenAI({ apiKey });
const MODELOS = [process.env.OPENAI_IMAGE_MODEL, "gpt-image-2", "gpt-image-1.5", "gpt-image-1"].filter(Boolean);

const cola = LINEAS.filter((l) => (ids.length ? ids.includes(l.id) : true)).filter((l) => force || !existsSync(join(DIR, `${l.id}.webp`)));
console.log(`${cola.length} ejemplo(s) por pintar`);

// Para que la biblioteca no repita a la misma persona: si sale alguien, quién.
const PERSONAS = [
  "a man in his fifties with grey hair and glasses",
  "a young East Asian woman with straight black hair",
  "a Latino man in his thirties with a beard",
  "a South Asian woman in her forties",
  "a Black man in his twenties with short hair",
  "a red-haired woman in her thirties with freckles",
  "a Middle Eastern man in his forties",
  "a woman in her sixties with short white hair",
];

async function pintar(l) {
  const quien = PERSONAS[LINEAS.indexOf(l) % PERSONAS.length];
  // Los fondos van sin nadie: decirle quién saldría le invita a meter a alguien.
  const persona = l.familia === "fondos" ? "" : `\nIf a person appears, it is ${quien}.`;
  const prompt = `${l.escena}${persona}\n\n${l.estilo}\n\n${REGLAS_IMAGEN}`;
  for (const model of MODELOS) {
    try {
      const res = await client.images.generate({ model, prompt, size: "1024x1536", quality: "medium", output_format: "jpeg", n: 1 });
      const b64 = res.data?.[0]?.b64_json;
      if (!b64) throw new Error("sin imagen");
      const out = await sharp(Buffer.from(b64, "base64")).resize(400, 600).webp({ quality: 78 }).toBuffer();
      writeFileSync(join(DIR, `${l.id}.webp`), out);
      console.log(`✓ ${l.id} (${model}, ${Math.round(out.length / 1024)} KB)`);
      return;
    } catch (e) {
      if (e.status === 404 || (e.status === 400 && /model/i.test(e.message ?? "") && !/safety|moderation/i.test(e.message ?? ""))) continue;
      console.log(`✗ ${l.id}: ${e.message}`);
      return;
    }
  }
}

// De cuatro en cuatro: cada imagen tarda 20-40 s.
for (let i = 0; i < cola.length; i += 4) await Promise.all(cola.slice(i, i + 4).map(pintar));
