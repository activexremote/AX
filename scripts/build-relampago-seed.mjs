// Genera la migración con el contenido de los cursos relámpago.
//
//   node --experimental-strip-types --import ./scripts/alias-loader.mjs \
//        scripts/build-relampago-seed.mjs
//
// El temario NO se escribe en SQL. Vive en src/lib/relampago/*.ts, que es lo
// que además pinta la landing pública y lo que se le pasa como contexto a la
// corrección automática. Este script sólo lo traduce a INSERTs.
//
// Así no hay dos copias del temario: si mañana una lección dura 11 minutos en
// vez de 9, se cambia en el TypeScript, se regenera y la landing y el campus
// dicen lo mismo. Con el temario escrito a mano en el SQL, eso dura una
// semana.

import { writeFileSync } from "node:fs";
import { WEB_ABC } from "@/lib/relampago/web-abc.ts";
import { lessonsOf } from "@/lib/relampago/types.ts";

const SALIDA = "supabase/migrations/0008_seed_web_abc.sql";

/** Los módulos relámpago van del 101 en adelante para no pelearse con el
 *  order_index del programa largo, que ocupa del 0 al 13. */
const BASE_ORDER = 100;

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (xs) => `array[${xs.map(q).join(", ")}]::text[]`;
const num = (v) => (v === null || v === undefined ? "null" : String(v));

/**
 * Baraja las opciones de forma determinista.
 *
 * En el TypeScript la correcta es siempre la primera, que es lo cómodo de
 * escribir y de revisar. Si se insertaran en ese orden, la respuesta correcta
 * sería siempre la de arriba y el test dejaría de medir nada.
 *
 * El barajado depende del slug, así que es estable: regenerar la migración
 * dos veces da exactamente el mismo SQL y el diff no se llena de ruido.
 */
function barajar(opciones, semilla) {
  let h = 2166136261;
  for (const c of semilla) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const xs = opciones.map((label, i) => ({ label, correcta: i === 0 }));
  for (let i = xs.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    const j = h % (i + 1);
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
}

function seed(curso) {
  const out = [];
  const p = (s = "") => out.push(s);

  p(`-- Contenido de «${curso.title}» — ${curso.claim}`);
  p("--");
  p("-- ⚠︎ GENERADO. No editar a mano: se sobrescribe.");
  p(`-- Fuente: src/lib/relampago/web-abc.ts · Generador: scripts/build-relampago-seed.mjs`);
  p("--");
  p(`-- ${curso.modules.length} módulos · ${curso.lessons.length} lecciones · ${curso.unlocks.length} desbloqueos.`);
  p("-- Es idempotente: se puede volver a ejecutar tras regenerarlo y actualiza");
  p("-- en vez de duplicar. El progreso de los alumnos no se toca, porque las");
  p("-- lecciones se identifican por (módulo, slug) y conservan su id.");
  p("");
  p("begin;");
  p("");

  // ── Módulos ──
  p("-- ── Módulos ──────────────────────────────────────────");
  for (const m of curso.modules) {
    const mins = lessonsOf(curso, m).reduce((a, l) => a + l.minutes, 0);
    p(`insert into public.modules (slug, order_index, code, title, description, icon, accent, available, estimated_minutes, course) values`);
    p(`  (${q(m.slug)}, ${BASE_ORDER + m.n}, ${q(m.code)}, ${q(m.title)}, ${q(m.summary)}, ${q(m.icon)}, ${q(m.accent)}, true, ${mins}, 'web-abc')`);
    p(`on conflict (slug) do update set`);
    p(`  order_index = excluded.order_index, code = excluded.code, title = excluded.title,`);
    p(`  description = excluded.description, icon = excluded.icon, accent = excluded.accent,`);
    p(`  estimated_minutes = excluded.estimated_minutes, course = excluded.course;`);
    p("");
  }

  // ── Lecciones ──
  p("-- ── Lecciones ────────────────────────────────────────");
  for (const m of curso.modules) {
    for (const [i, l] of lessonsOf(curso, m).entries()) {
      p(`-- ${String(l.n).padStart(2, "0")} · ${l.title}`);
      const video = l.video ?? curso.demoVideo ?? null;
      p(`insert into public.lessons (module_id, slug, order_index, title, subtitle, duration_min, content_md, hook, outcome, terms, mission_md, mission_minutes, mission_criterion, evidence_hint, video_url, video_provider) values (`);
      p(`  (select id from public.modules where slug = ${q(m.slug)}),`);
      p(`  ${q(l.slug)}, ${i + 1}, ${q(l.title)}, ${q(l.outcome)}, ${l.minutes},`);
      p(`  ${q(l.reading)},`);
      p(`  ${q(l.hook)}, ${q(l.outcome)}, ${arr(l.terms)},`);
      p(`  ${q(l.mission.brief)}, ${num(l.mission.minutes)}, ${q(l.mission.criterion)}, ${q(l.mission.evidence)},`);
      // "propio" o "demo": así se ve de un vistazo en la base de datos cuántas
      // lecciones siguen con el vídeo de muestra y cuántas están grabadas.
      p(`  ${q(video)}, ${q(video ? (l.video ? "propio" : "demo") : null)}`);
      p(`) on conflict (module_id, slug) do update set`);
      p(`  order_index = excluded.order_index, title = excluded.title, subtitle = excluded.subtitle,`);
      p(`  duration_min = excluded.duration_min, content_md = excluded.content_md, hook = excluded.hook,`);
      p(`  outcome = excluded.outcome, terms = excluded.terms, mission_md = excluded.mission_md,`);
      p(`  mission_minutes = excluded.mission_minutes, mission_criterion = excluded.mission_criterion,`);
      p(`  evidence_hint = excluded.evidence_hint, video_url = excluded.video_url,`);
      p(`  video_provider = excluded.video_provider;`);
      p("");
    }
  }

  // ── Tests ──
  p("-- ── Tests ────────────────────────────────────────────");
  p("-- Tres preguntas por lección, como pide el máster plan: una conceptual,");
  p("-- una de aplicación y una de discriminación entre herramientas.");
  p("--");
  p("-- Con tres y un umbral del 80 % hay que acertar las tres. Es duro a");
  p("-- propósito y no penaliza: el test se repite tantas veces como haga falta,");
  p("-- porque el objetivo es dominar el concepto, no filtrar gente.");
  p("");
  for (const l of curso.lessons) {
    p(`-- ${String(l.n).padStart(2, "0")} · ${l.title}`);
    // El slug de una lección sólo es único DENTRO de su módulo, así que se
    // filtra por curso: si mañana el programa largo tiene una lección llamada
    // "dashboard", este select devolvería dos filas y la migración reventaría.
    // El slug de una lección sólo es único DENTRO de su módulo, así que se
    // filtra por curso: si mañana el programa largo tuviera una lección
    // llamada "dashboard", este select devolvería dos filas y reventaría.
    //
    // Las preguntas se borran y se reescriben enteras en cada pasada (el CTE
    // `limpia`). Sus ids cambian, y da igual: `quiz_attempts` guarda la nota
    // contra el QUIZ, que sí conserva el suyo. El progreso no se toca.
    p(`with lec as (`);
    p(`       select l.id from public.lessons l`);
    p(`       join public.modules m on m.id = l.module_id`);
    p(`       where l.slug = ${q(l.slug)} and m.course = ${q(curso.key)}`);
    p(`     ),`);
    p(`     qz as (`);
    p(`       insert into public.quizzes (lesson_id, pass_score)`);
    p(`       select id, 0.80 from lec`);
    p(`       on conflict (lesson_id) do update set pass_score = excluded.pass_score`);
    p(`       returning id`);
    p(`     ),`);
    p(`     limpia as (delete from public.quiz_questions where quiz_id in (select id from qz) returning 1),`);
    p(`     preg as (`);
    p(`       insert into public.quiz_questions (quiz_id, order_index, prompt)`);
    p(`       select qz.id, v.i, v.prompt from qz, (values`);
    p(l.quiz.map((pr, i) => `         (${i + 1}, ${q(pr.prompt)})`).join(",\n"));
    p(`       ) as v(i, prompt)`);
    p(`       returning id, order_index`);
    p(`     )`);
    p(`insert into public.quiz_options (question_id, order_index, label, is_correct)`);
    p(`select preg.id, v.i, v.label, v.ok from preg join (values`);
    p(
      l.quiz
        .flatMap((pr, qi) =>
          // La semilla mezcla slug y número de pregunta: cada una se baraja
          // distinto, y el resultado es estable entre ejecuciones para que
          // regenerar el seed no llene el diff de ruido.
          barajar(pr.options, `${l.slug}#${qi}`).map(
            (o, i) => `  (${qi + 1}, ${i + 1}, ${q(o.label)}, ${o.correcta})`,
          ),
        )
        .join(",\n"),
    );
    p(`) as v(preg_i, i, label, ok) on v.preg_i = preg.order_index;`);
    p("");
  }

  // ── Desbloqueos ──
  p("-- ── Desbloqueos ──────────────────────────────────────");
  p("-- La URL apunta a una página del campus, no a un archivo de public/: lo");
  p("-- que se sirve como estático lo puede pedir cualquiera que adivine la");
  p("-- dirección, y esto es justamente lo que se gana terminando el curso.");
  p("-- /desbloqueos/<key> comprueba la matrícula Y que esté ganado antes de");
  p("-- enseñar nada. El contenido vive en src/lib/relampago/unlocks/.");
  p("");
  for (const [i, u] of curso.unlocks.entries()) {
    p(`insert into public.unlocks (key, course, order_index, title, description, icon, url) values`);
    p(`  (${q(u.key)}, ${q(curso.key)}, ${i + 1}, ${q(u.title)}, ${q(u.description)}, ${q(u.icon)}, ${q(`/desbloqueos/${u.key}`)})`);
    p(`on conflict (key) do update set course = excluded.course, order_index = excluded.order_index,`);
    p(`  title = excluded.title, description = excluded.description, icon = excluded.icon,`);
    p(`  url = excluded.url;`);
    p("");
  }

  p("commit;");
  p("");
  return out.join("\n");
}

writeFileSync(SALIDA, seed(WEB_ABC));
const n = WEB_ABC;
console.log(`${SALIDA}: ${n.modules.length} módulos, ${n.lessons.length} lecciones, ${n.lessons.length} tests, ${n.unlocks.length} desbloqueos.`);
