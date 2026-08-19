# Logos de herramientas

Marcas de las herramientas que se enseñan en el programa. Se muestran en la
sección "El stack" (`src/components/landing/tools-section.tsx`) para
identificar cada producto: no hay patrocinio, afiliación ni respaldo por su
parte, y cada logotipo pertenece a su titular.

## De dónde salen

| Origen | Cuántos | Cómo se regeneran |
| --- | --- | --- |
| [simple-icons](https://simpleicons.org) (CC0 1.0) | 57 | `npm run tools:icons` → `src/components/landing/tool-icons.ts` |
| [svgl.app](https://svgl.app) | 15 (esta carpeta) | `npm run tools:logos` |
| Propios del repo | Slack (componente), Deel (`../deel.svg`) | a mano |
| Sin logotipo redistribuible | 16 | ficha con las iniciales de la marca |

Las 16 sin logotipo son marcas pequeñas que no están en ninguna colección
libre (Krisp, Slite, Bardeen, Otter.ai, Fireflies.ai, Reclaim, Sunsama,
Pipedrive, Remote, Authy, Readwise, Crisp, Donut, Lattice, Culture Amp,
Motion). Para sustituir cualquiera por su SVG oficial: deja el fichero aquí y
cambia `hex` por `logo: "tools/<id>.svg"` en `src/app/bienvenida/tools.ts`.

Microsoft, OpenAI, Adobe, Canva, LinkedIn, Salesforce y Slack pidieron en su
día que se retirasen sus iconos de simple-icons; los suyos vienen de svgl.
Si alguna marca pide que se retire el suyo, basta con borrar el fichero y
volver a poner `hex`.
