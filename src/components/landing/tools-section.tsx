import { SlackLogo } from "@/components/slack-logo";
import { ToolTooltip } from "@/components/landing/tool-tooltip";
import { TOOL_ICONS } from "@/components/landing/tool-icons";
import { getLocale } from "@/lib/i18n/server";
import {
  CATEGORIES,
  TOOLS,
  toolsCopy,
  type CategoryKey,
  type Tool,
} from "@/app/bienvenida/tools";

// Se exporta porque la banda del stack (stack-band.tsx) pinta los mismos
// logos en su marquesina: un segundo dibujante para los mismos logotipos
// acabaría divergiendo en tamaños y en el trato de los casos raros.
export function ToolLogo({ tool }: { tool: Tool }) {
  // Slack ya venía como componente en el repo.
  if (tool.logo === "slack") return <SlackLogo size={22} />;

  // Logos propios: las proporciones van de cuadradas a muy apaisadas, así
  // que se limitan por ancho y alto y el navegador escoge el lado que toca.
  if (tool.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/logos/${tool.logo}`} alt="" className="axr-tools__img" aria-hidden />
    );
  }

  // Sólo entran herramientas con logotipo: el listado de tools.ts no tiene
  // ninguna sin `icon` ni `logo`.
  const icon = tool.icon ? TOOL_ICONS[tool.icon] : undefined;
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden focusable="false">
      <path d={icon.path} fill={icon.hex} />
    </svg>
  );
}

type Props = {
  /** Las páginas de curso muestran sólo sus categorías. */
  only?: readonly CategoryKey[];
};

export async function ToolsSection({ only }: Props) {
  const locale = await getLocale();
  const c = toolsCopy[locale];

  const cats = only ? CATEGORIES.filter((cat) => only.includes(cat.key)) : CATEGORIES;

  // Una herramienta puede estar en varias categorías, pero se pinta una sola
  // vez: el filtro es CSS sobre data-cat, así que no hay rejillas duplicadas.
  const catsByTool = new Map<string, CategoryKey[]>();
  for (const cat of cats) {
    for (const id of cat.tools) {
      catsByTool.set(id, [...(catsByTool.get(id) ?? []), cat.key]);
    }
  }
  const shown = TOOLS.filter((t) => catsByTool.has(t.id));

  return (
    <section id="herramientas" className="axr-lp__tools axr-tools">
      <header className="axr-tools__head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{c.title}</h2>
        <p>{c.lead}</p>
      </header>

      {/* Filtro sin JavaScript: radios ocultos + :has() sobre el contenedor. */}
      <div className="axr-tools__filters" role="group" aria-label={c.eyebrow}>
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

        {cats.map((cat) => (
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
        {shown.map((tool) => {
          const desc = c.desc[tool.id] ?? "";
          return (
            <li
              key={tool.id}
              className="axr-tools__item"
              data-cat={catsByTool.get(tool.id)!.join(" ")}
            >
              <button
                type="button"
                className="axr-tools__chip"
                data-name={tool.name}
                data-desc={desc}
                aria-label={`${tool.name}. ${desc}`}
              >
                <ToolLogo tool={tool} />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="axr-tools__hint">{c.hint}</p>
      <ToolTooltip />
    </section>
  );
}
