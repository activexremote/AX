import { SlackLogo } from "@/components/slack-logo";
import { ToolLogo } from "@/components/landing/tools-section";
import { ToolTooltip } from "@/components/landing/tool-tooltip";
import { getLocale } from "@/lib/i18n/server";
import { landingCopy } from "@/app/bienvenida/copy";
import { CATEGORIES, TOOLS, toolsCopy } from "@/app/bienvenida/tools";

// ══════════════════════════════════════════════════════════
//  La banda del stack
//
//  Une en un solo bloque lo que antes eran TRES secciones repartidas por la
//  home: los temas que se cubren, el aviso de que se aprende con herramientas
//  reales, y la rejilla de las 75 herramientas.
//
//  Iban en tres sitios distintos y decían lo mismo —«esto cubre mucho»—, así
//  que se estorbaban: la rejilla de 75 logos ocupaba una pantalla entera a
//  mitad de página, donde ya nadie la miraba.
//
//  Aquí van juntas, justo debajo del héroe, que es donde esa idea sirve de
//  algo: alguien acaba de leer la promesa y lo siguiente que necesita es
//  saber de qué tamaño es lo que se le ofrece.
//
//  ── Por qué dos marquesinas ──────────────────────────────
//  Una lista de 32 temas y otra de 75 logos, quietas, son dos muros. En
//  movimiento y en direcciones opuestas ocupan cuatro renglones y transmiten
//  «esto no se acaba», que es exactamente el argumento. Y se pueden leer sin
//  esfuerzo porque nadie tiene que leerlas enteras.
//
//  La rejilla completa con su filtro sigue ahí, dentro de un <details>: quien
//  quiera comprobar que están de verdad las abre; a quien no le interesa, no
//  le ocupa media pantalla.
// ══════════════════════════════════════════════════════════
export async function StackBand() {
  const locale = await getLocale();
  const c = toolsCopy[locale];
  const lp = landingCopy[locale];

  const catsByTool = new Map<string, string[]>();
  for (const cat of CATEGORIES) {
    for (const id of cat.tools) {
      catsByTool.set(id, [...(catsByTool.get(id) ?? []), cat.key]);
    }
  }
  const shown = TOOLS.filter((t) => catsByTool.has(t.id));

  return (
    <section id="herramientas" className="axr-stack">
      <div className="axr-stack__head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{lp.proof.title}</h2>
      </div>

      {/* ── Los temas ──
          La lista va dos veces para que el bucle no dé un salto al reiniciar.
          La copia es decorativa: se esconde a los lectores de pantalla, y con
          `prefers-reduced-motion` la cinta se para y los chips se reparten en
          varias filas, así que con una sola lista basta. */}
      <div className="axr-stack__rail" data-dir="left">
        <div className="axr-stack__track">
          {lp.proof.chips.map((chip) => (
            <span key={chip} className="axr-stack__chip">{chip}</span>
          ))}
          {lp.proof.chips.map((chip) => (
            <span key={`d-${chip}`} className="axr-stack__chip" data-dup aria-hidden>{chip}</span>
          ))}
        </div>
      </div>

      {/* ── Las herramientas ──
          En sentido contrario a los temas: dos cintas en la misma dirección
          se leen como una sola cosa moviéndose y el efecto se pierde. */}
      <div className="axr-stack__rail" data-dir="right">
        <div className="axr-stack__track">
          {shown.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className="axr-stack__tool"
              data-name={tool.name}
              data-desc={c.desc[tool.id] ?? ""}
              aria-label={`${tool.name}. ${c.desc[tool.id] ?? ""}`}
            >
              <ToolLogo tool={tool} />
            </button>
          ))}
          {shown.map((tool) => (
            <span key={`d-${tool.id}`} className="axr-stack__tool" data-dup aria-hidden>
              <ToolLogo tool={tool} />
            </span>
          ))}
        </div>
      </div>

      <p className="axr-stack__note">
        <SlackLogo size={18} />
        <span>{lp.integration.body}</span>
      </p>

      {/* La rejilla entera, plegada. Quien quiera comprobar que están de
          verdad la abre; a quien no le interesa no le ocupa media pantalla. */}
      <details className="axr-stack__all">
        <summary>{c.seeAll}</summary>

        <div className="axr-stack__filters" role="group" aria-label={c.eyebrow}>
          <span className="axr-tools__filter">
            <input
              type="radio"
              name="axr-tools-cat"
              id="axr-tools-all"
              className="axr-tools__radio"
              defaultChecked
            />
            <label htmlFor="axr-tools-all">{c.all}</label>
          </span>
          {CATEGORIES.map((cat) => (
            <span key={cat.key} className="axr-tools__filter">
              <input
                type="radio"
                name="axr-tools-cat"
                id={`axr-tools-${cat.key}`}
                className="axr-tools__radio"
              />
              <label htmlFor={`axr-tools-${cat.key}`}>{c.categories[cat.key]}</label>
            </span>
          ))}
        </div>

        <ul className="axr-tools__grid">
          {shown.map((tool) => (
            <li
              key={tool.id}
              className="axr-tools__item"
              data-cat={catsByTool.get(tool.id)!.join(" ")}
            >
              <button
                type="button"
                className="axr-tools__chip"
                data-name={tool.name}
                data-desc={c.desc[tool.id] ?? ""}
                aria-label={`${tool.name}. ${c.desc[tool.id] ?? ""}`}
              >
                <ToolLogo tool={tool} />
              </button>
            </li>
          ))}
        </ul>
        <p className="axr-tools__hint">{c.hint}</p>
      </details>

      <ToolTooltip />
    </section>
  );
}
