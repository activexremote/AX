// ══════════════════════════════════════════════════════════
//  Los dosieres del curso, para el equipo comercial
//
//  Tres PDF en 16:9 para mandar a los leads: el curso completo, Remote
//  Professional y Remote Founder. Cada uno con su portada en JPG para el
//  panel. Van a private/comercial/ (ver src/lib/comercial/material.ts).
//
//    node --experimental-strip-types scripts/decks-comerciales.mts [ruta-a-playwright]
//
//  Todo sale de lo que ya publica la web o vive en el campus:
//   · Módulos, descripciones y lecciones: scripts/decks/modulos.json, una
//     exportación de la tabla modules (vuelve a exportarla si cambian).
//   · Capturas del campus: scripts/decks/capturas/, el campus real con una
//     alumna de ejemplo.
//   · Embudo, cambio de modelo, sueldos, Deel y herramientas: los
//     mismos ficheros de copy que pintan las landings.
//   · Sin precios: se piden a admisiones (CONTACTO), que hace la propuesta.
//
//  Reglas que se cumplen aquí: sin testimonios ni cifras de alumnos (aún no
//  hay), sin docentes sin confirmar, «curso» y nunca «máster», los sellos de
//  Deel tal como los entrega Deel y sin «sin intereses» en un curso.
// ══════════════════════════════════════════════════════════

import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { MATERIAL, type MaterialId } from "../src/lib/comercial/material.ts";
import { DEEL_BADGES, deelCopy } from "../src/app/bienvenida/deel.ts";
import { CATEGORIES, COURSE_CATEGORIES, TOOLS } from "../src/app/bienvenida/tools.ts";
import { TOOL_ICONS } from "../src/components/landing/tool-icons.ts";
import { funnelCopy, modelCopy } from "../src/app/cursos/signature.ts";
import { adCopy } from "../src/app/trabajo-remoto/copy.ts";

const RAIZ = path.resolve(import.meta.dirname, "..");
const SALIDA = path.join(RAIZ, "private/comercial");

// ── Contacto que firma los dosieres ──────────────────────
const CONTACTO = { nombre: "Ainhoa", rol: "Admisiones", email: "ainhoa@activexremote.com", web: "www.activexremote.com" };

// ── Datos ────────────────────────────────────────────────
type Camino = "nucleo" | "professional" | "founder";
type Modulo = { n: number; camino: Camino; titulo: string; descripcion: string; lecciones: string[] };
const MODULOS: Modulo[] = JSON.parse(readFileSync(path.join(RAIZ, "scripts/decks/modulos.json"), "utf8"));
const de = (c: Camino) => MODULOS.filter((m) => m.camino === c).sort((a, b) => a.n - b.n);

// Lo que te llevas de cada módulo, en una línea (sale de su descripción).
const ENTREGABLE: Record<string, string> = {
  "nucleo-1": "Tu posición en la Matriz de Competencias Remotas y un sistema que hace visible tu trabajo.",
  "nucleo-2": "Tu neto real comparado en tu país y en otros dos, cada cifra con su fuente.",
  "nucleo-3": "Un destino elegido con criterio y una mudanza con precio y plan, de T-90 a D+30.",
  "nucleo-4": "Tu sistema operativo remoto: dashboard en Notion, dinero multidivisa y una tarea automatizada.",
  "nucleo-5": "Un agente de IA a medida para una tarea semanal real, con el tiempo que te ahorra medido.",
  "nucleo-6": "Tu Protocolo Life Ops de 7 días y unos límites que los demás conocen.",
  "nucleo-7": "Tu contrato auditado, una factura que se sostiene y tu calendario de obligaciones.",
  "professional-8": "Un CV remoto de una página y 20 empresas objetivo con la persona que decide en cada una.",
  "professional-9": "Un pipeline con IA que adapta cada candidatura y pasa el ATS sin inventar experiencia.",
  "professional-10": "LinkedIn y portfolio publicados, y un sistema de networking con nombres, canales y fechas.",
  "professional-11": "Un mock de entrevista de 3 minutos grabado, tus objeciones respondidas y tu simulador.",
  "professional-12": "Tu Salary Negotiation Playbook: guiones, paquete objetivo y contraoferta, con fuentes.",
  "professional-13": "Tu First 30 Days Strategy: Personal ReadMe, plan de 30 días y ruta de escalado.",
  "professional-14": "Tu Fractional Transition Blueprint y una primera conversación fraccional en marcha.",
  "founder-8": "Tu Freedom Business Canvas, una oferta mínima viable y su validación con compradores reales.",
  "founder-9": "Tu AI Agent Matrix y un circuito de marketing automatizado funcionando.",
  "founder-10": "Diez prospectos internacionales verificados, contactados y con su seguimiento en marcha.",
  "founder-11": "Tu oferta empaquetada con precio y una página publicada que cobra.",
  "founder-12": "Tus SOPs y un Client Delivery Hub que responde al cliente antes de que pregunte.",
  "founder-13": "Tu Founder Delegation Matrix y una cadena de back office con IA y control humano.",
  "founder-14": "Tu Corporate Entity Matrix, lo que pide un banco y el calendario que te mantiene en regla.",
};
const entregable = (m: Modulo) => ENTREGABLE[`${m.camino}-${m.n}`];

// Los módulos acreditados por Deel (bienvenida/deel.ts).
const DEEL = deelCopy.es;
const ACREDITADOS = new Set(["nucleo-2", "nucleo-3", "nucleo-7", "professional-12", "professional-13", "founder-13", "founder-14"]);
const acreditado = (m: Modulo) => ACREDITADOS.has(`${m.camino}-${m.n}`);

const num = (n: number) => String(n).padStart(2, "0");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── Imágenes, embebidas ──────────────────────────────────
const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml" };
const datos = (rel: string) => `data:${MIME[path.extname(rel)]};base64,${readFileSync(path.join(RAIZ, rel)).toString("base64")}`;
const IMG = {
  hero: datos("public/video/hero-lp.jpg"),
  skyline: datos("public/img/skyline-remoto.jpg"),
  clase: datos("public/video/clase-directo.jpg"),
  leccion: datos("scripts/decks/capturas/leccion-nucleo.jpg"),
  leccionPro: datos("scripts/decks/capturas/leccion-professional.jpg"),
  modulo: datos("scripts/decks/capturas/modulo.jpg"),
  movil: datos("scripts/decks/capturas/movil.jpg"),
  deel: DEEL_BADGES.map((b) => ({ src: datos(`public${b.src}`), alt: b.alt })),
  ilus: (n: string) => datos(`public/blog/${n}.svg`),
};
const MARCA = `<svg viewBox="0 0 46 28" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 2 L20 26 L2 26 Z"/><path d="M26 2 L44 2 L35 14 Z"/><path d="M26 26 L44 26 L35 14 Z"/></svg>`;

// ── Temas ────────────────────────────────────────────────
type Tema = { acento: string; suave: string; grad: string; mesh: string };
const MESH_BASE = "linear-gradient(160deg, #3a1f6e 0, #241246 100%)";
const TEMAS: Record<MaterialId, Tema> = {
  "curso-completo": {
    acento: "#5b4bf5",
    suave: "#efedff",
    grad: "linear-gradient(140deg, #6d5cff, #a855f7)",
    mesh: `radial-gradient(60% 85% at 12% 18%, #7b5cff 0, transparent 60%), radial-gradient(55% 75% at 88% 12%, #ff6a3d 0, transparent 55%), radial-gradient(65% 85% at 78% 88%, #d61f9c 0, transparent 58%), ${MESH_BASE}`,
  },
  "remote-professional": {
    acento: "#5b4bf5",
    suave: "#efedff",
    grad: "linear-gradient(140deg, #5b4bf5, #8f7dff)",
    mesh: `radial-gradient(60% 85% at 15% 20%, #6d5cff 0, transparent 60%), radial-gradient(55% 80% at 85% 85%, #2f6bff 0, transparent 58%), radial-gradient(50% 70% at 90% 10%, #a855f7 0, transparent 55%), ${MESH_BASE}`,
  },
  "remote-founder": {
    acento: "#e4462f",
    suave: "#fdeeea",
    grad: "linear-gradient(140deg, #ff7a3d, #e4462f)",
    mesh: `radial-gradient(60% 85% at 15% 20%, #ff6a3d 0, transparent 60%), radial-gradient(55% 80% at 85% 85%, #d61f9c 0, transparent 58%), radial-gradient(50% 70% at 90% 10%, #e4462f 0, transparent 55%), linear-gradient(160deg, #4a1630 0, #2a0f22 100%)`,
  },
};

// ── Piezas ───────────────────────────────────────────────
const kicker = (t: string) => `<p class="kicker">${t}</p>`;
const slide = (cuerpo: string, clase = "") => `<section class="slide ${clase}">${cuerpo}<footer class="pie"><span class="pie__marca">${MARCA}ActiveXRemote</span><span class="pie__n"></span></footer></section>`;
const navegador = (src: string, alt: string, extra = "") =>
  `<figure class="nav ${extra}"><div class="nav__barra"><i></i><i></i><i></i><span>activexremote.com</span></div><img src="${src}" alt="${esc(alt)}"></figure>`;
const etiquetaDeel = `<span class="tag-deel">Acreditado por Deel</span>`;

// ── Diapositivas compartidas ─────────────────────────────

function portada(id: MaterialId, titulo: string, sub: string, lema: string) {
  return `<section class="slide slide--portada" style="background:${TEMAS[id].mesh}">
    <img class="portada__foto" src="${IMG.hero}" alt="">
    <div class="portada__velo"></div>
    <div class="portada__marca">${MARCA}<span>ActiveXRemote</span></div>
    <div class="portada__txt">
      <span class="chip">Curso en directo · Cohorte de enero de 2027</span>
      <h1>${titulo}</h1>
      <p class="portada__sub">${sub}</p>
    </div>
    <div class="portada__pie"><span>${lema}</span><span>The Remote Business School</span></div>
  </section>`;
}

function manifiesto() {
  return `<section class="slide slide--foto" style="background-image:linear-gradient(90deg, rgba(20,10,40,.88) 0%, rgba(20,10,40,.55) 55%, rgba(20,10,40,.1) 100%), url(${IMG.skyline})">
    <div class="foto__txt">
      ${kicker("Por qué existimos")}
      <h2 class="h-xl">No es que te falte talento. Es que nadie te ha enseñado a trabajar sin fronteras.</h2>
      <p class="lead">El remoto no falla por la distancia. Falla cuando no sabemos adaptarnos a esta forma de trabajar. ActiveXRemote es la escuela especialista en Remote Business: formación práctica, en directo y al día para conseguir un empleo internacional o construir un negocio que vende fuera.</p>
    </div>
    <footer class="pie pie--claro"><span class="pie__marca">${MARCA}ActiveXRemote</span><span class="pie__n"></span></footer>
  </section>`;
}

function cifras(dos = false) {
  const items = dos
    ? [["21", "módulos: el núcleo común y los dos caminos"], ["84 h", "de clase, en directo o en grabación"], ["7", "fines de semana para el grupo"], ["25", "plazas por grupo"], ["∞", "acceso al campus sin caducidad"], ["7", "módulos acreditados por Deel"]]
    : [["14", "módulos, cada uno de 4 horas"], ["56 h", "de clase en directo"], ["7", "fines de semana, sábado y domingo"], ["25", "plazas por grupo"], ["∞", "acceso al campus sin caducidad"], ["0", "nivel previo necesario"]];
  return slide(`
    ${kicker("El curso en cifras")}
    <h2>Un curso intensivo, en directo y para un grupo pequeño.</h2>
    <div class="cifras">${items.map(([v, t]) => `<div><strong>${v}</strong><span>${t}</span></div>`).join("")}</div>
    <p class="nota">100 % online. Clases en español; materiales en español y en inglés.</p>`);
}

function calendario(resaltar?: "professional" | "founder") {
  const fines = [
    ["9–10 ene", [1, 2], "nucleo"],
    ["16–17 ene", [3, 4], "nucleo"],
    ["23–24 ene", [5, 6], "nucleo"],
    ["30–31 ene", [7, 8], "cruce"],
    ["6–7 feb", [9, 10], "esp"],
    ["13–14 feb", [11, 12], "esp"],
    ["20–21 feb", [13, 14], "esp"],
  ] as const;
  const esp = resaltar ? (resaltar === "professional" ? "Remote Professional" : "Remote Founder") : "Tu camino";
  return slide(`
    ${kicker("Cómo funciona")}
    <h2>Siete fines de semana. Un módulo cada sábado y cada domingo.</h2>
    <div class="cal">
      ${fines
        .map(
          ([f, ms, tipo], i) => `<div class="cal__fin cal__fin--${tipo}">
        <span class="cal__n">Fin de semana ${i + 1}</span>
        <strong>${f}</strong>
        <div class="cal__mods">${ms.map((m) => `<span class="${m <= 7 ? "m-nucleo" : "m-esp"}">${num(m)}</span>`).join("")}</div>
        ${tipo === "cruce" ? `<em>El cruce</em>` : ""}
      </div>`,
        )
        .join("")}
    </div>
    <div class="cal__leyenda">
      <div><span class="m-nucleo">01–07</span><p><strong>Núcleo común.</strong> Lo que necesita cualquiera que trabaje o venda en remoto: mercado, fiscalidad, reubicación, stack, IA, energía y legal.</p></div>
      <div><span class="m-esp">08–14</span><p><strong>${esp}.</strong> ${resaltar === "founder" ? "De vender horas a vender un sistema que capta y entrega sin ti delante." : resaltar === "professional" ? "Del primer filtro de una candidatura a la negociación y tus primeros 90 días." : "En el cuarto fin de semana eliges Remote Professional o Remote Founder. Es una decisión reversible."}</p></div>
    </div>
    <p class="nota">Del 9 de enero al 21 de febrero de 2027. Cada clase son 4 horas en directo, y queda grabada en el campus.</p>`);
}

function unaClase() {
  const m1 = de("nucleo")[0];
  const partes = [
    ["Antes", "Material previo", "Entre 1 y 2 horas, a tu ritmo y cuando te venga bien. Llegas con lo tuyo preparado."],
    ["Hora 1", "El marco", "La idea clave del módulo y el modelo que vas a usar, con casos reales."],
    ["Hora 2", "En directo", "El docente lo construye en pantalla, paso a paso, con herramientas de verdad."],
    ["Hora 3", "Tu ejercicio", "Lo haces sobre tu propio caso, en clase y con ayuda. Es el entregable."],
    ["Hora 4", "Preguntas y siguiente paso", "Tus dudas concretas, lo que toca esa semana y el puente al siguiente módulo."],
  ];
  return slide(`
    <div class="dos-col">
      <div>
        ${kicker("Una clase por dentro")}
        <h2>No es una charla. Es un taller de cuatro horas.</h2>
        <ol class="clase">${partes.map(([a, b, c]) => `<li><span>${a}</span><div><strong>${b}</strong><p>${c}</p></div></li>`).join("")}</ol>
        <p class="nota">Ejemplo real, módulo 01: «${esc(m1.lecciones[1])}».</p>
      </div>
      <figure class="foto-marco"><img src="${IMG.clase}" alt="Una clase en directo"><figcaption>En directo, con cámara y micro. Y grabado en el campus por si te pierdes una.</figcaption></figure>
    </div>`);
}

function rejillaModulos(ms: Modulo[], titulo: string, lead: string, tema: Tema, k: string) {
  return slide(`
    ${kicker(k)}
    <h2>${titulo}</h2>
    <p class="lead lead--corto">${lead}</p>
    <div class="mods">${ms
      .map(
        (m) => `<article class="mod">
        <span class="mod__n" style="background:${m.camino === "nucleo" ? "#161326" : tema.grad}">${num(m.n)}</span>
        <h3>${esc(m.titulo)}</h3>
        <p>${esc(entregable(m))}</p>
        ${acreditado(m) ? etiquetaDeel : ""}
      </article>`,
      )
      .join("")}</div>`);
}

function nucleo(tema: Tema) {
  return rejillaModulos(de("nucleo"), "El núcleo común: siete módulos para trabajar sin fronteras.", "Los cursa todo el mundo, sea cual sea su camino. Esto es lo que te llevas de cada uno.", tema, "Módulos 01 – 07");
}

function cruce() {
  const pro = de("professional");
  const fou = de("founder");
  const col = (nombre: string, sub: string, para: string, logra: string, ms: Modulo[], color: string) => `<div class="camino" style="--c:${color}">
    <span class="camino__tag">${sub}</span>
    <h3>${nombre}</h3>
    <p class="camino__para"><strong>Para:</strong> ${para}</p>
    <p class="camino__logra"><strong>Consigues:</strong> ${logra}</p>
    <ol>${ms.map((m) => `<li><span>${num(m.n)}</span>${esc(m.titulo)}</li>`).join("")}</ol>
  </div>`;
  return slide(`
    ${kicker("El cruce: dos caminos")}
    <h2>En el cuarto fin de semana eliges hacia dónde vas.</h2>
    <div class="caminos">
      ${col("Remote Professional", "Career Accelerator", "empleados y contractors.", "un empleo remoto con empresas internacionales, mejor pagado.", pro, "#5b4bf5")}
      ${col("Remote Founder", "Global Builder", "freelancers, founders y solopreneurs.", "un negocio propio que vende fuera y no depende de tus horas.", fou, "#e4462f")}
    </div>`);
}

function moduloDetalle(m: Modulo, tema: Tema, ilustracion?: string) {
  return slide(`
    <div class="detalle">
      <div class="detalle__txt">
        ${kicker(`Módulo ${num(m.n)} · ${m.camino === "professional" ? "Remote Professional" : m.camino === "founder" ? "Remote Founder" : "Núcleo común"}`)}
        <h2>${esc(m.titulo)}</h2>
        <p class="lead lead--corto">${esc(m.descripcion)}</p>
        <div class="detalle__sale" style="border-color:${tema.acento}"><span style="color:${tema.acento}">Te llevas</span>${esc(entregable(m))}</div>
        ${acreditado(m) ? `<div class="detalle__deel"><img src="${IMG.deel[0].src}" alt="${IMG.deel[0].alt}">Módulo acreditado por Deel</div>` : ""}
      </div>
      <div class="detalle__lado">
        ${ilustracion ? `<img class="detalle__ilus" src="${IMG.ilus(ilustracion)}" alt="">` : ""}
        <ol class="horas">${m.lecciones.map((l) => `<li>${esc(l)}</li>`).join("")}</ol>
      </div>
    </div>`);
}

function campus(capturaLeccion: string, pie: string) {
  return slide(`
    <div class="campus">
      <div class="campus__txt">
        ${kicker("El campus")}
        <h2>Todo el curso, en un solo sitio y para siempre.</h2>
        <ul class="check">
          <li>Cada lección escrita y con <strong>audio narrado</strong>, para repasar donde quieras.</li>
          <li>Las <strong>grabaciones</strong> de cada clase, sin caducidad.</li>
          <li>Plantillas y frameworks <strong>descargables</strong>.</li>
          <li>Un <strong>asistente con IA</strong> para tus dudas, a cualquier hora.</li>
          <li>Tu progreso, tus tareas y la comunidad en <strong>Slack</strong>.</li>
        </ul>
      </div>
      ${navegador(capturaLeccion, "Una lección en el campus", "nav--grande")}
    </div>
    <p class="nota nota--abajo">${pie}</p>`);
}

function campusMovil() {
  return slide(`
    <div class="campus2">
      ${navegador(IMG.modulo, "Un módulo en el campus")}
      <figure class="movil"><img src="${IMG.movil}" alt="El campus en el móvil"></figure>
      <div class="campus2__txt">
        ${kicker("En el ordenador y en el móvil")}
        <h3>Sabes siempre dónde estás y qué te toca.</h3>
        <p>Cada módulo con sus lecciones, su duración y tu progreso. Y en el móvil, la lección con su audio para repasar en un trayecto.</p>
      </div>
    </div>
    <p class="nota nota--abajo">Capturas del campus real, con una alumna de ejemplo.</p>`);
}

function deel(camino?: "professional" | "founder") {
  const grupos = DEEL.groups.filter((g) => !camino || g.camino === "core" || g.camino === `remote-${camino}`);
  return slide(`
    <div class="deel">
      <div>
        ${kicker("Acreditación")}
        <h2>${camino ? `${grupos.reduce((s, g) => s + g.modules.length, 0)} módulos de tu curso, acreditados por Deel.` : esc(DEEL.title)}</h2>
        <p class="lead lead--corto">${esc(DEEL.short.body)}</p>
        <div class="deel__ganas">${DEEL.gains.map((g) => `<div><strong>${esc(g.title)}</strong><p>${esc(g.body)}</p></div>`).join("")}</div>
      </div>
      <div class="deel__lado">
        <div class="deel__sellos">${IMG.deel.map((b) => `<img src="${b.src}" alt="${b.alt}">`).join("")}</div>
        ${grupos
          .map(
            (g) => `<div class="deel__grupo"><span>${esc(g.name)}</span><ul>${g.modules.map((m) => `<li><b>${m.n}</b>${esc(m.title)}</li>`).join("")}</ul></div>`,
          )
          .join("")}
      </div>
    </div>`);
}

function herramientas(camino?: "remote-professional" | "remote-founder") {
  const cats = camino ? COURSE_CATEGORIES[camino] : CATEGORIES.map((c) => c.key);
  const ids = [...new Set(CATEGORIES.filter((c) => cats.includes(c.key)).flatMap((c) => c.tools))];
  const tools = ids.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean).slice(0, 36) as typeof TOOLS[number][];
  const ficha = (t: (typeof TOOLS)[number]) => {
    const icono = t.icon ? TOOL_ICONS[t.icon] : undefined;
    let dibujo: string;
    if (icono) dibujo = `<svg viewBox="0 0 24 24" fill="${icono.hex}"><path d="${icono.path}"/></svg>`;
    else if (t.logo && t.logo.endsWith(".svg")) dibujo = `<img src="${datos(`public/logos/${t.logo}`)}" alt="">`;
    else dibujo = `<span class="mono">${esc(t.name.slice(0, 1))}</span>`;
    return `<div class="tool">${dibujo}<span>${esc(t.name)}</span></div>`;
  };
  return slide(`
    ${kicker("El stack")}
    <h2>Trabajas con las herramientas que usan los equipos remotos de verdad.</h2>
    <p class="lead lead--corto">${camino ? "Una selección de las que verás en tu camino." : `${TOOLS.length} herramientas reales en ${CATEGORIES.length} categorías, de la IA a los pagos internacionales. Aquí, una muestra.`}</p>
    <div class="tools">${tools.map(ficha).join("")}</div>
    <p class="nota nota--abajo">Cada marca pertenece a su dueño. Se muestran sólo para identificar las herramientas que se enseñan en el curso.</p>`);
}

// El profesorado, sin nombres ni caras: el equipo de cada grupo se presenta
// antes de formalizar la matrícula. La «terminal» enseña la idea central,
// un especialista por módulo, con módulos reales del dosier.
function profesores(ms: Modulo[]) {
  const total = ms.length;
  const filas = ms.slice(0, 9);
  const pilares = [
    ["Un especialista por módulo", "Nadie imparte catorce temas. Cada módulo lo da quien domina esa materia en su trabajo diario."],
    ["Técnicas en producción", "Solo se enseña lo que el docente aplica hoy con clientes, equipos o empresas reales. Nada de teoría de manual."],
    ["Demo en directo", "Pantalla compartida y herramienta real: ves el flujo completo, de la primera línea al resultado."],
    ["Feedback del sector", "Tu entregable lo revisa alguien que sabe cómo se evalúa ese trabajo fuera del aula."],
  ];
  return slide(`
    <div class="profes">
      <div>
        ${kicker("Quién da la clase")}
        <h2>Lo enseña quien lo usa en producción.</h2>
        <p class="lead lead--corto">Nuestro profesorado no vive de dar clase. Trabaja en remoto, contrata, negocia, factura y automatiza cada semana, y trae a clase exactamente eso: su forma real de trabajar, con sus herramientas abiertas en pantalla.</p>
        <div class="profes__pilares">${pilares.map(([a, b]) => `<div><strong>${a}</strong><p>${b}</p></div>`).join("")}</div>
      </div>
      <div class="term">
        <div class="term__barra"><i></i><i></i><i></i><span>docentes.sh</span></div>
        <div class="term__cuerpo">
          <p><span class="t-p">$</span> activexremote docentes --asignar por-modulo</p>
          <p class="t-dim"># 1 módulo · 1 especialista · experiencia en activo</p>
          ${filas.map((m) => `<p class="t-fila"><span class="t-ok">✓</span><span class="t-n">${num(m.n)}</span><span class="t-mod">${esc(m.titulo)}</span><span class="t-dim">→ especialista</span></p>`).join("")}
          ${total > filas.length ? `<p class="t-dim">  … y ${total - filas.length} módulos más</p>` : ""}
          <p class="t-fin"><span class="t-ok">✓</span> ${total}/${total} módulos con su especialista<span class="t-cursor"></span></p>
        </div>
      </div>
    </div>
    <p class="nota nota--abajo">El equipo docente de tu grupo se presenta, con nombre y trayectoria, antes de formalizar la matrícula.</p>`);
}

function incluye() {
  const items = [
    ["14 módulos en directo", "56 horas lectivas, dos clases de 4 horas cada fin de semana."],
    ["El campus, sin caducidad", "Grabaciones, lecciones con audio narrado y el asistente con IA."],
    ["Plantillas y frameworks", "Descargables, para usar en tu trabajo desde el día siguiente."],
    ["Ejercicio y feedback", "Un entregable práctico en cada módulo, con su corrección."],
    ["Comunidad en Slack", "Tu grupo, avisos y seguimiento durante todo el curso."],
    ["Diploma de ActiveXRemote", "Con los módulos superados y los acreditados por Deel."],
  ];
  return slide(`
    ${kicker("Qué incluye la matrícula")}
    <h2>Sales con entregables, no con apuntes.</h2>
    <div class="incluye">${items.map(([a, b]) => `<div><span class="ok">✓</span><strong>${a}</strong><p>${b}</p></div>`).join("")}</div>
    <p class="nota">El diploma es una certificación privada y verificable de ActiveXRemote: no es un título universitario oficial. Se obtiene siguiendo el curso y entregando los ejercicios.</p>`);
}

function paraQuien(camino?: "professional" | "founder") {
  const si =
    camino === "professional"
      ? ["Trabajas por cuenta ajena y quieres dar el salto a una empresa internacional en remoto.", "Ya eres contractor y quieres mejores clientes y mejor compensación.", "Te descartan sin saber por qué y quieres un método, no más candidaturas."]
      : camino === "founder"
        ? ["Eres freelance o consultor y tu agenda llena es tu techo.", "Quieres vender a clientes de otros países con un precio cerrado.", "Quieres montar o formalizar un negocio que no dependa de dónde vives."]
        : ["Quieres trabajar en remoto para empresas de fuera, o vender fuera tu propio servicio.", "Dominas tu oficio y te falta el método para llevarlo al mercado internacional.", "Puedes dedicar los fines de semana a clase y 2 – 3 horas a la semana a ejercicio."];
  const no = ["Buscas ingresos pasivos o un atajo para ganar dinero sin esfuerzo.", "Necesitas estudiar a tu ritmo, sin clases en directo.", "Esperas que el diploma te abra puertas por sí solo."];
  return slide(`
    ${kicker("Para quién es")}
    <h2>Es para ti si…</h2>
    <div class="paraquien">
      <div class="pq pq--si"><h3>Encaja si</h3><ul>${si.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <div class="pq pq--no"><h3>No encaja si</h3><ul>${no.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    </div>
    <p class="nota">No hace falta nivel previo. Lo que sí hace falta es dominar tu oficio: el curso te enseña a llevarlo al mercado internacional.</p>`);
}

// Sin importes a propósito: el precio se da en la conversación, con la
// propuesta de cada persona. El dosier dice qué opciones hay y a quién
// pedirlas.
function inversion() {
  const opcion = (tag: string, titulo: string, det: string) => `<div class="precio"><span class="precio__tag">${tag}</span><h3>${titulo}</h3><p>${det}</p></div>`;
  return slide(`
    ${kicker("Inversión")}
    <h2>Te preparamos una propuesta a tu medida.</h2>
    <div class="precios">
      ${opcion("Un curso", "Remote Professional o Remote Founder", "Con el núcleo común: 14 módulos en directo y el campus sin caducidad.")}
      ${opcion("Los dos cursos", "Los dos caminos completos", "El núcleo común y las dos especializaciones: 21 módulos.")}
      ${opcion("Forma de pago", "Pago único o a plazos", "Eliges cómo pagarlo. Cuotas mensuales con tarjeta, cada una con su factura.")}
    </div>
    <div class="consulta">
      <div><span>Precios y condiciones</span><strong>Consúltalos con ${CONTACTO.email}</strong></div>
      <p>Te respondemos en menos de 24 horas laborables con las opciones para tu caso.</p>
    </div>
    <div class="garantias">
      <span>Pago seguro con Stripe</span><span>Factura de cada pago</span><span>14 días de desistimiento, según las condiciones</span><span>Si se aplaza un grupo, cambias de grupo o recuperas lo pagado</span>
    </div>`);
}

function siguientesPasos(tema: Tema) {
  return `<section class="slide slide--cierre" style="background:${tema.mesh}">
    <div class="cierre">
      ${kicker("Siguientes pasos")}
      <h2 class="h-xl">Empezamos el 9 de enero. Grupos de 25.</h2>
      <ol class="pasos">
        <li><span>1</span><div><strong>Hablamos</strong><p>Resolvemos tus dudas y vemos qué camino te encaja.</p></div></li>
        <li><span>2</span><div><strong>Reservas tu plaza</strong><p>Eliges la forma de pago y recibes el enlace de pago seguro.</p></div></li>
        <li><span>3</span><div><strong>Entras al campus</strong><p>Con el material previo del módulo 01 y tu grupo en Slack.</p></div></li>
      </ol>
      <div class="contacto">
        <div><span>Tu contacto</span><strong>${CONTACTO.nombre} · ${CONTACTO.rol}</strong></div>
        <div><span>Correo</span><strong>${CONTACTO.email}</strong></div>
        <div><span>Web</span><strong>${CONTACTO.web}</strong></div>
      </div>
    </div>
    <div class="cierre__marca">${MARCA}</div>
  </section>`;
}

// ── Diapositivas propias de cada camino ──────────────────

function embudo() {
  const f = funnelCopy.es;
  const max = f.stages[0].value;
  return slide(`
    ${kicker(f.eyebrow)}
    <h2>${esc(f.title)}</h2>
    <div class="embudo">${f.stages
      .map(
        (s) => `<div class="embudo__fila">
        <strong>${s.value.toLocaleString("es-ES")}</strong>
        <div class="embudo__barra"><i style="width:${Math.max(3, Math.sqrt(s.value / max) * 100)}%"></i></div>
        <div class="embudo__txt"><b>${esc(s.label)}</b><span>${esc(s.fix)}</span></div>
      </div>`,
      )
      .join("")}</div>
    <p class="nota">${esc(f.lead)}</p>`);
}

function sueldos() {
  const j = (adCopy as unknown as { es: { jobs: { title: string; lead: string; salaryLabel: string; markets: string[]; roles: { name: string; pay: { v: string }[] }[] } } }).es.jobs;
  return slide(`
    <div class="dos-col dos-col--ancha">
      <div>
        ${kicker("A dónde lleva")}
        <h2>${esc(j.title)}</h2>
        <p class="lead lead--corto">La misma silla, tres países. Es el argumento entero del trabajo remoto internacional en una tabla.</p>
        <img class="ilus-peq" src="${IMG.ilus("mercado-global")}" alt="">
      </div>
      <div>
        <table class="tabla"><thead><tr><th>${esc(j.salaryLabel)}</th>${j.markets.map((m) => `<th>${m}</th>`).join("")}</tr></thead>
        <tbody>${j.roles.map((r) => `<tr><th>${esc(r.name)}</th>${r.pay.map((p) => `<td>${p.v}</td>`).join("")}</tr>`).join("")}</tbody></table>
        <p class="nota">Medias públicas de Glassdoor en el sitio de cada país, consultadas en septiembre de 2026, en moneda local. Son sueldos de mercado, no una promesa de lo que vas a ganar.</p>
      </div>
    </div>`);
}

function modelo() {
  const m = modelCopy.es;
  return slide(`
    ${kicker(m.eyebrow)}
    <h2>${esc(m.title)}</h2>
    <div class="modelo">
      <div class="modelo__etq">${m.rowLabels.map((r) => `<span>${esc(r)}</span>`).join("")}<span>${esc(m.ceilingLabel)}</span></div>
      ${[m.before, m.after]
        .map(
          (c, i) => `<div class="modelo__col${i ? " modelo__col--despues" : ""}">
        <span class="modelo__tag">${esc(c.tag)}</span><h3>${esc(c.title)}</h3>
        ${c.rows.map((r) => `<span>${esc(r)}</span>`).join("")}<span class="modelo__techo">${esc(c.ceiling)}</span>
        <div class="modelo__lev"><i style="width:${c.leverage}%"></i></div><small>${esc(m.leverageLabel)}: ${c.leverage} %</small>
      </div>`,
        )
        .join("")}
    </div>
    <p class="nota">${esc(m.close)}</p>`);
}

function resumenCamino(c: "professional" | "founder", tema: Tema) {
  const ms = de(c);
  return rejillaModulos(
    ms,
    c === "professional" ? "Remote Professional: del filtro a la oferta firmada." : "Remote Founder: de vender horas a vender un sistema.",
    c === "professional" ? "Siete módulos que atacan, uno a uno, los puntos donde se pierde una candidatura internacional." : "Siete módulos en el orden en que se construye: oferta, clientes, entrega, sistema, automatización y estructura.",
    tema,
    "Módulos 08 – 14",
  );
}

// Para el curso completo: tres del núcleo y tres de cada camino, variados.
const muestraCompleta = () => {
  const elige = (c: Camino, ns: number[]) => de(c).filter((m) => ns.includes(m.n));
  const vista = [...elige("nucleo", [2, 5, 7]), ...elige("professional", [9, 11, 12]), ...elige("founder", [8, 10, 13])];
  return [...vista, ...MODULOS.filter((m) => !vista.includes(m))];
};

// ── Los tres dosieres ────────────────────────────────────

const ILUS_PRO = ["criba-candidatura", "convergencia", "amplificador", "pantalla-voz", "balanza", "asincronia", "bifurcacion"];
const ILUS_FOU = ["requisitos", "automatismo", "mercado-global", "producto-cerrado", "procedimiento", "pila", "intermediario-legal"];

function dosier(id: MaterialId): string[] {
  const t = TEMAS[id];
  if (id === "curso-completo") {
    return [
      portada(id, "Trabaja y emprende<br><em>sin fronteras.</em>", "El curso en directo para conseguir un empleo remoto internacional o construir tu propio negocio global.", "Dosier del curso completo"),
      manifiesto(),
      cifras(),
      calendario(),
      unaClase(),
      nucleo(t),
      cruce(),
      resumenCamino("professional", TEMAS["remote-professional"]),
      resumenCamino("founder", TEMAS["remote-founder"]),
      campus(IMG.leccion, "Captura del campus real: una lección del módulo 01, con su índice, su audio y el asistente."),
      campusMovil(),
      deel(),
      herramientas(),
      profesores(muestraCompleta()),
      paraQuien(),
      incluye(),
      inversion(),
      siguientesPasos(t),
    ];
  }
  const c = id === "remote-professional" ? "professional" : "founder";
  const ilus = c === "professional" ? ILUS_PRO : ILUS_FOU;
  return [
    c === "professional"
      ? portada(id, "Remote<br><em>Professional</em>", "Consigue el empleo remoto internacional que mereces: del primer filtro a la oferta negociada.", "Career Accelerator")
      : portada(id, "Remote<br><em>Founder</em>", "Construye un negocio que vende fuera y no depende de tus horas.", "Global Builder"),
    c === "professional" ? embudo() : modelo(),
    paraQuien(c),
    calendario(c),
    unaClase(),
    nucleo(t),
    resumenCamino(c, t),
    ...de(c).map((m, i) => moduloDetalle(m, t, ilus[i])),
    ...(c === "professional" ? [sueldos()] : []),
    campus(c === "professional" ? IMG.leccionPro : IMG.leccion, c === "professional" ? "Captura del campus real: una lección del módulo 12, Negociación salarial y compensación global." : "Captura del campus real: una lección del módulo 01, con su índice, su audio y el asistente."),
    campusMovil(),
    deel(c),
    herramientas(id),
    profesores([...de("nucleo"), ...de(c)].filter((m) => m.camino !== "nucleo" || [2, 5, 7].includes(m.n)).concat(de("nucleo").filter((m) => ![2, 5, 7].includes(m.n)))),
    incluye(),
    inversion(),
    siguientesPasos(t),
  ];
}

// ── Estilos ──────────────────────────────────────────────
const css = (t: Tema) => `
@page { size: 1280px 720px; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; color: #161326; counter-reset: diapo; }
h1, h2, h3, h4, p { margin: 0; }
.slide { position: relative; width: 1280px; height: 720px; overflow: hidden; padding: 60px 72px 70px; background: #fff; break-after: page; counter-increment: diapo; display: flex; flex-direction: column; justify-content: center; }
.kicker { font-size: 13px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${t.acento}; margin-bottom: 14px; }
h2 { font-size: 40px; line-height: 1.08; letter-spacing: -.03em; font-weight: 800; max-width: 1000px; text-wrap: balance; }
.h-xl { font-size: 54px; }
h3 { font-size: 19px; letter-spacing: -.01em; font-weight: 750; line-height: 1.2; }
.lead { margin-top: 18px; font-size: 19px; line-height: 1.5; color: #514d69; max-width: 860px; }
.lead--corto { font-size: 17px; margin-top: 14px; }
.nota { margin-top: 18px; font-size: 13px; line-height: 1.5; color: #8a86a0; max-width: 980px; }
.nota--abajo { position: absolute; left: 72px; bottom: 44px; margin: 0; }
.pie { position: absolute; left: 72px; right: 72px; bottom: 22px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #a3a0b8; letter-spacing: .04em; }
.pie__marca { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em; }
.pie__marca svg { height: 11px; }
.pie__n::after { content: counter(diapo); font-variant-numeric: tabular-nums; }
.pie--claro { color: rgba(255,255,255,.6); }
.chip { display: inline-block; padding: 7px 14px; border: 1px solid rgba(255,255,255,.4); border-radius: 99px; font-size: 13px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #fff; background: rgba(255,255,255,.08); }

/* Portada */
.slide--portada { color: #fff; padding: 56px 72px; }
.portada__foto { position: absolute; right: -40px; top: 0; height: 100%; width: 62%; object-fit: cover; opacity: .55; mix-blend-mode: screen; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 45%); mask-image: linear-gradient(90deg, transparent 0, #000 45%); }
.portada__velo { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(20,8,40,.55) 0, rgba(20,8,40,0) 60%); }
.portada__marca { position: relative; display: flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; font-size: 14px; }
.portada__marca svg { height: 18px; }
.portada__txt { position: relative; margin-top: auto; margin-bottom: auto; max-width: 760px; }
.portada__txt h1 { font-size: 88px; line-height: .98; letter-spacing: -.045em; font-weight: 800; margin: 26px 0 22px; }
.portada__txt h1 em { font-style: normal; color: #ffc2a8; }
.portada__sub { font-size: 22px; line-height: 1.45; color: rgba(255,255,255,.86); max-width: 640px; }
.portada__pie { position: relative; display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,.25); padding-top: 14px; font-size: 13px; color: rgba(255,255,255,.75); letter-spacing: .04em; }

/* Foto a sangre */
.slide--foto { background-size: cover; background-position: center; color: #fff; justify-content: center; }
.slide--foto .kicker { color: #ffc2a8; }
.foto__txt { max-width: 760px; }
.slide--foto .lead { color: rgba(255,255,255,.85); }

/* Cifras */
.cifras { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 40px; }
.cifras div { padding: 30px 30px; border-radius: 20px; background: ${t.suave}; }
/* Color liso: el texto con degradado sale con un recuadro al imprimir. */
.cifras strong { display: block; font-size: 62px; font-weight: 800; letter-spacing: -.04em; line-height: 1; color: ${t.acento}; }
.cifras span { display: block; margin-top: 12px; font-size: 17px; color: #514d69; }

/* Calendario */
.cal { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; margin-top: 34px; }
.cal__fin { position: relative; padding: 22px 16px 24px; border-radius: 18px; border: 1px solid #e7e4f5; background: #fff; }
.cal__fin--cruce { border-color: ${t.acento}; box-shadow: 0 0 0 2px ${t.acento} inset; }
.cal__n { display: block; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #8a86a0; }
.cal__fin strong { display: block; margin: 8px 0 16px; font-size: 22px; letter-spacing: -.01em; }
.cal__mods { display: flex; gap: 6px; }
.cal__mods span, .cal__leyenda span { display: inline-grid; place-items: center; min-width: 42px; height: 34px; padding: 0 10px; border-radius: 9px; font-weight: 800; font-size: 15px; white-space: nowrap; }
.cal__leyenda span { flex: none; min-width: 74px; }
.m-nucleo { background: #161326; color: #fff; }
.m-esp { background: ${t.grad}; color: #fff; }
.cal__fin em { position: absolute; top: -11px; left: 12px; padding: 2px 10px; border-radius: 99px; background: ${t.acento}; color: #fff; font-style: normal; font-size: 11px; font-weight: 700; letter-spacing: .04em; }
.cal__leyenda { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 36px; }
.cal__leyenda div { display: flex; gap: 14px; align-items: flex-start; }
.cal__leyenda p { font-size: 17px; line-height: 1.5; color: #514d69; }
.cal__leyenda strong { color: #161326; }

/* Una clase */
.dos-col { display: grid; grid-template-columns: 1.05fr .95fr; gap: 48px; align-items: center; height: 100%; }
.dos-col--ancha { grid-template-columns: .8fr 1.2fr; }
.clase { list-style: none; padding: 0; margin: 26px 0 0; display: grid; gap: 10px; }
.clase li { display: grid; grid-template-columns: 74px 1fr; gap: 14px; align-items: start; }
.clase li > span { display: inline-block; padding: 5px 0; border-radius: 8px; text-align: center; font-size: 12px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; background: ${t.suave}; color: ${t.acento}; }
.clase strong { font-size: 16px; }
.clase p { font-size: 14px; color: #514d69; line-height: 1.45; margin-top: 2px; }
.foto-marco { margin: 0; }
.foto-marco img { width: 100%; height: 400px; object-fit: cover; border-radius: 22px; box-shadow: 0 30px 70px -30px rgba(20,8,60,.55); }
.foto-marco figcaption { margin-top: 12px; font-size: 13px; color: #8a86a0; }

/* Módulos en rejilla */
.mods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-top: 26px; }
.mod { position: relative; padding: 18px 18px 20px; border: 1px solid #e7e4f5; border-radius: 16px; background: #fff; }
.mod__n { display: inline-grid; place-items: center; width: 40px; height: 30px; border-radius: 8px; color: #fff; font-weight: 800; font-size: 14px; margin-bottom: 10px; }
.mod h3 { font-size: 17px; margin-bottom: 8px; }
.mod p { font-size: 14px; line-height: 1.45; color: #514d69; }
.tag-deel { display: inline-block; margin-top: 10px; padding: 3px 9px; border-radius: 99px; background: #ecfdf5; color: #047857; font-size: 11px; font-weight: 700; }

/* Los dos caminos */
.caminos { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 26px; }
.camino { padding: 24px 26px; border-radius: 20px; border: 1px solid #e7e4f5; border-top: 6px solid var(--c); }
.camino__tag { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--c); }
.camino h3 { font-size: 26px; margin: 4px 0 10px; }
.camino__para, .camino__logra { font-size: 14px; color: #514d69; line-height: 1.45; }
.camino ol { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 6px; }
.camino li { display: flex; gap: 10px; font-size: 14px; }
.camino li span { flex: none; width: 26px; font-weight: 800; color: var(--c); }

/* Módulo en detalle */
.detalle { display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; height: 100%; }
.detalle__txt { display: flex; flex-direction: column; justify-content: center; }
.detalle h2 { font-size: 42px; }
.detalle__sale { margin-top: 22px; padding: 16px 20px; border-left: 4px solid; border-radius: 0 14px 14px 0; background: #f7f6fc; font-size: 16px; line-height: 1.45; font-weight: 600; }
.detalle__sale span { display: block; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 4px; }
.detalle__deel { display: flex; align-items: center; gap: 12px; margin-top: 16px; font-size: 14px; font-weight: 600; color: #047857; }
.detalle__deel img { width: 46px; height: 46px; border-radius: 8px; }
.detalle__lado { display: flex; flex-direction: column; justify-content: center; gap: 18px; }
.detalle__ilus { width: 100%; height: 200px; object-fit: cover; border-radius: 18px; }
.horas { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; counter-reset: h; }
.horas li { padding: 11px 14px; border: 1px solid #e7e4f5; border-radius: 12px; font-size: 14px; line-height: 1.35; }
.horas li:first-child { background: #f7f6fc; color: #514d69; font-style: italic; }

/* Campus */
.campus { display: grid; grid-template-columns: .78fr 1.22fr; gap: 40px; align-items: center; height: 100%; }
.check { list-style: none; padding: 0; margin: 24px 0 0; display: grid; gap: 11px; }
.check li { position: relative; padding-left: 28px; font-size: 16px; line-height: 1.45; color: #36324d; }
.check li::before { content: "✓"; position: absolute; left: 0; top: 0; width: 19px; height: 19px; border-radius: 50%; background: ${t.suave}; color: ${t.acento}; font-size: 12px; font-weight: 800; display: grid; place-items: center; }
.nav { margin: 0; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 0 34px 80px -30px rgba(20,8,60,.5), 0 0 0 1px #e7e4f5; }
.nav__barra { display: flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; background: #f1f0f6; }
.nav__barra i { width: 9px; height: 9px; border-radius: 50%; background: #d4d1e3; }
.nav__barra span { margin-left: 10px; padding: 2px 12px; border-radius: 6px; background: #fff; font-size: 11px; color: #8a86a0; }
.nav img { display: block; width: 100%; }
.campus2 { display: grid; grid-template-columns: 1fr 200px .62fr; gap: 30px; align-items: center; height: 100%; }
.movil { margin: 0; padding: 10px; border-radius: 34px; background: #161326; box-shadow: 0 30px 60px -24px rgba(20,8,60,.6); }
.movil img { display: block; width: 100%; height: 400px; object-fit: cover; object-position: top; border-radius: 24px; }
.campus2__txt h3 { font-size: 24px; margin-bottom: 12px; }
.campus2__txt p { font-size: 15px; line-height: 1.5; color: #514d69; }

/* Deel */
.deel { display: grid; grid-template-columns: 1.15fr .85fr; gap: 44px; height: 100%; align-items: center; }
.deel h2 { font-size: 36px; }
.deel__ganas { display: grid; gap: 12px; margin-top: 22px; }
.deel__ganas strong { font-size: 15px; }
.deel__ganas p { font-size: 14px; color: #514d69; line-height: 1.45; }
.deel__lado { padding: 26px; border-radius: 22px; background: linear-gradient(160deg, #241246, #3a1f6e); color: #fff; }
.deel__sellos { display: flex; gap: 14px; margin-bottom: 18px; }
.deel__sellos img { width: 96px; height: 96px; border-radius: 12px; background: #fff; }
.deel__grupo { margin-top: 12px; }
.deel__grupo > span { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.deel__grupo ul { list-style: none; padding: 0; margin: 6px 0 0; display: grid; gap: 4px; }
.deel__grupo li { font-size: 14px; display: flex; gap: 10px; }
.deel__grupo b { color: #6ee7b7; width: 22px; }

/* Herramientas */
.tools { display: grid; grid-template-columns: repeat(9, 1fr); gap: 10px; margin-top: 26px; }
.tool { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px 6px; border: 1px solid #eeecfa; border-radius: 14px; }
.tool svg, .tool img { width: 30px; height: 30px; }
.tool .mono { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 8px; background: #161326; color: #fff; font-weight: 800; }
.tool > span:last-child { font-size: 11px; text-align: center; color: #514d69; line-height: 1.2; }

/* Profesorado */
.profes { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: center; height: 100%; }
.profes h2 { font-size: 38px; }
.profes__pilares { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 22px; }
.profes__pilares div { padding: 14px 16px; border-radius: 14px; background: ${t.suave}; }
.profes__pilares strong { display: block; font-size: 14.5px; color: #161326; margin-bottom: 4px; }
.profes__pilares p { font-size: 13px; line-height: 1.45; color: #514d69; }
.term { border-radius: 16px; overflow: hidden; background: #0f0c1d; box-shadow: 0 34px 80px -30px rgba(20,8,60,.7), 0 0 0 1px rgba(255,255,255,.06); font-family: "JetBrains Mono", ui-monospace, monospace; }
.term__barra { display: flex; align-items: center; gap: 6px; height: 32px; padding: 0 14px; background: #1b1730; }
.term__barra i { width: 10px; height: 10px; border-radius: 50%; background: #3a3555; }
.term__barra i:nth-child(1) { background: #ff5f57; } .term__barra i:nth-child(2) { background: #febc2e; } .term__barra i:nth-child(3) { background: #28c840; }
.term__barra span { margin-left: 12px; font-size: 11px; color: #8c86ad; }
.term__cuerpo { padding: 18px 20px 20px; font-size: 13px; line-height: 1.75; color: #e9e6ff; }
.term__cuerpo p { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-p { color: ${t.acento === "#e4462f" ? "#ff8a5c" : "#a79bff"}; margin-right: 8px; }
.t-dim { color: #7f79a3; }
.t-fila { display: grid; grid-template-columns: 18px 30px 1fr auto; gap: 8px; }
.t-ok { color: #4ade80; }
.t-n { color: ${t.acento === "#e4462f" ? "#ff8a5c" : "#a79bff"}; font-weight: 600; }
.t-mod { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.t-fin { margin-top: 6px; color: #fff; font-weight: 600; }
.t-cursor { display: inline-block; width: 8px; height: 15px; margin-left: 6px; vertical-align: -2px; background: #e9e6ff; }

/* Para quién */
.paraquien { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 30px; }
.pq { padding: 26px 28px; border-radius: 20px; }
.pq h3 { margin-bottom: 14px; }
.pq ul { margin: 0; padding-left: 20px; display: grid; gap: 12px; font-size: 18px; line-height: 1.45; }
.pq--si { background: #ecfdf5; border: 1px solid #a7f3d0; } .pq--si h3 { color: #047857; }
.pq--no { background: #fef2f2; border: 1px solid #fecaca; } .pq--no h3 { color: #b91c1c; }

/* Incluye */
.incluye { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 30px; }
.incluye div { padding: 22px 22px 24px; border-radius: 18px; border: 1px solid #e7e4f5; }
.incluye .ok { display: inline-grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: ${t.grad}; color: #fff; font-weight: 800; margin-bottom: 12px; }
.incluye strong { display: block; font-size: 17px; margin-bottom: 6px; }
.incluye p { font-size: 15px; color: #514d69; line-height: 1.45; }

/* Inversión, sin importes */
.precios { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 30px; }
.precio { padding: 24px 26px; border-radius: 20px; border: 1px solid #e7e4f5; background: #fff; }
.precio__tag { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: ${t.acento}; }
.precio h3 { margin: 10px 0 8px; font-size: 21px; }
.precio p { font-size: 15px; line-height: 1.45; color: #514d69; }
.consulta { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-top: 18px; padding: 24px 28px; border-radius: 20px; background: ${t.grad}; color: #fff; box-shadow: 0 30px 60px -30px ${t.acento}; }
.consulta span { display: block; font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; opacity: .8; }
.consulta strong { display: block; margin-top: 4px; font-size: 28px; font-weight: 800; letter-spacing: -.02em; }
.consulta p { max-width: 320px; font-size: 15px; line-height: 1.45; opacity: .9; }
.garantias { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.garantias span { padding: 9px 16px; border-radius: 99px; background: #f4f3fb; font-size: 14px; color: #514d69; }

/* Cierre */
.slide--cierre { color: #fff; justify-content: center; }
.slide--cierre .kicker { color: #ffc2a8; }
.cierre { position: relative; max-width: 900px; }
.pasos { list-style: none; padding: 0; margin: 30px 0 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.pasos li { display: flex; gap: 14px; padding: 18px; border-radius: 16px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); }
.pasos li > span { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #fff; color: #161326; font-weight: 800; }
.pasos strong { font-size: 16px; }
.pasos p { font-size: 14px; color: rgba(255,255,255,.8); margin-top: 3px; line-height: 1.4; }
.contacto { display: flex; gap: 36px; margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.25); }
.contacto span { display: block; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.6); }
.contacto strong { font-size: 17px; }
.cierre__marca { position: absolute; right: -60px; bottom: -40px; width: 520px; color: rgba(255,255,255,.07); }

/* Embudo */
.embudo { display: grid; gap: 9px; margin-top: 28px; }
.embudo__fila { display: grid; grid-template-columns: 90px 1fr 430px; gap: 18px; align-items: center; }
.embudo__fila strong { font-size: 28px; font-weight: 800; letter-spacing: -.03em; text-align: right; color: ${t.acento}; font-variant-numeric: tabular-nums; }
.embudo__barra { height: 30px; border-radius: 8px; background: #f4f3fb; overflow: hidden; }
.embudo__barra i { display: block; height: 100%; border-radius: 8px; background: ${t.grad}; }
.embudo__txt b { display: block; font-size: 15px; }
.embudo__txt span { font-size: 12.5px; color: #8a86a0; }

/* Sueldos */
.ilus-peq { width: 100%; height: 180px; object-fit: cover; border-radius: 18px; margin-top: 24px; }
.tabla { width: 100%; border-collapse: collapse; font-size: 16px; }
.tabla th, .tabla td { padding: 14px 12px; border-bottom: 1px solid #eeecfa; text-align: left; }
.tabla thead th { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #8a86a0; font-weight: 700; }
.tabla tbody th { font-weight: 700; }
.tabla td { font-variant-numeric: tabular-nums; font-weight: 600; }
.tabla td:last-child { color: ${t.acento}; }

/* Modelo (Founder) */
.modelo { display: grid; grid-template-columns: 220px 1fr 1fr; gap: 14px; margin-top: 26px; }
/* Alineadas con las filas de las columnas: 17 px de borde y relleno, 18 de la etiqueta y 46 del título. */
.modelo__etq { display: grid; grid-template-rows: repeat(6, 44px); padding-top: 81px; }
.modelo__etq span { display: flex; align-items: center; font-size: 13px; font-weight: 600; color: #8a86a0; }
.modelo__col { display: grid; grid-template-rows: 18px 46px repeat(6, 44px) auto auto; padding: 16px 20px; border-radius: 18px; border: 1px solid #e7e4f5; }
.modelo__col--despues { background: ${t.suave}; border-color: transparent; }
.modelo__tag { font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #8a86a0; }
.modelo__col h3 { font-size: 22px; align-self: center; }
.modelo__col > span:not(.modelo__tag) { display: flex; align-items: center; font-size: 14px; border-top: 1px solid rgba(22,19,38,.07); }
.modelo__techo { font-weight: 700; }
.modelo__lev { height: 10px; margin-top: 10px; border-radius: 99px; background: rgba(22,19,38,.08); overflow: hidden; }
.modelo__lev i { display: block; height: 100%; background: ${t.grad}; }
.modelo__col small { margin-top: 6px; font-size: 12px; color: #8a86a0; }
`;

// ── Imprimir ─────────────────────────────────────────────
const playwrightRuta = process.argv[2];
const { chromium } = await import(playwrightRuta ? pathToFileURL(playwrightRuta).href : "playwright");
const navegadorPw = await chromium.launch({ channel: "chrome" });
mkdirSync(SALIDA, { recursive: true });

for (const m of MATERIAL) {
  const diapos = dosier(m.id);
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>${esc(m.titulo)} · ActiveXRemote</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"><style>${css(TEMAS[m.id])}</style></head>
<body>${diapos.join("\n")}</body></html>`;
  const pagina = await navegadorPw.newPage({ viewport: { width: 1280, height: 720 } });
  await pagina.setContent(html, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.pdf({ path: path.join(SALIDA, m.pdf), width: "1280px", height: "720px", printBackground: true, preferCSSPageSize: true });
  // La portada, para la tarjeta del panel.
  await pagina.screenshot({ path: path.join(SALIDA, m.portada), type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  if (process.env.DECKS_HTML) {
    const { writeFileSync } = await import("node:fs");
    writeFileSync(path.join(process.env.DECKS_HTML, `${m.id}.html`), html);
  }
  await pagina.close();
  console.log(`${m.pdf}: ${diapos.length} diapositivas`);
}
await navegadorPw.close();
