export const RESEARCH_HACK = `# The Research Hack

Cómo investigar desde el navegador y convertir lo que encuentras en contexto
que la IA pueda usar de verdad.

El problema que resuelve: le pides a Claude que construya algo y te devuelve
lo genérico, lo de siempre. No es que no sepa — es que no le has contado nada
que no supiera ya. Este flujo es cómo se le cuenta.

---

## Regla de partida

Investigar no es leer. Investigar es **capturar en un formato que puedas
pegar**. Si lees veinte pestañas y no anotas nada, no has investigado: has
pasado la tarde.

Abre un archivo, \`research.md\`, y vas escribiendo ahí. Todo va a ese archivo.

---

## Las cuatro pasadas

### 1. El producto que quieres construir

Busca tres productos que ya hagan algo parecido a lo tuyo. No para copiarlos:
para saber qué da por hecho la gente que ya usa esto.

De cada uno anota:

- **Qué promete** en su portada, con sus palabras exactas.
- **Cuál es la primera pantalla** después de registrarse. Esto vale oro: es lo
  que ellos han decidido que es lo primero que importa.
- **Qué te pide** antes de dejarte hacer nada.
- **Qué NO tiene** y te esperabas encontrar.

Regístrate de verdad en uno. Media hora usándolo enseña más que dos horas
leyendo sobre él.

### 2. La documentación de tu stack

Para cada herramienta que vayas a usar, busca **tres páginas concretas**:

- la de *empezar* (qué instala, qué configura),
- la de la funcionalidad exacta que necesitas,
- **la de límites y precios**.

La tercera es la que nadie mira y la que decide proyectos. Un límite de plan
gratuito que no viste el primer día es una migración de urgencia el día que
funciona.

Copia al \`research.md\` los **fragmentos de código** de la documentación
oficial, no los de un tutorial de hace tres años. Las APIs cambian; los
tutoriales, no.

### 3. Los problemas que vas a tener

Busca el error o la limitación **antes** de encontrártela:

\`\`\`
[herramienta] + [lo que quieres hacer] + limitation
[herramienta] + common mistakes
[herramienta] vs [alternativa]
\`\`\`

Los hilos donde alguien explica por qué se cambió de herramienta valen más que
cualquier comparativa: ahí está el motivo real, no el de la página de marketing.

### 4. Comprueba lo que has entendido

Antes de pegar nada, escribe en tres frases qué has aprendido. Si no puedes,
todavía no lo tienes: vuelve al punto que falle.

---

## El paso que casi todo el mundo se salta

Ahora **conviertes las notas en contexto**. No pegues el \`research.md\` entero:
un volcado de veinte pestañas es tan inútil como no dar nada.

Pega esto:

\`\`\`
CONTEXTO DEL PROYECTO

Qué construyo: [una frase]
Para quién: [una frase]
Qué tiene que poder hacer en la primera versión: [tres o cuatro puntos]

STACK Y POR QUÉ
- [herramienta]: para [qué]. Límite a tener en cuenta: [cuál].
- [herramienta]: para [qué]. Límite a tener en cuenta: [cuál].

LO QUE HE APRENDIDO INVESTIGANDO
- [producto parecido] resuelve [esto] así: [cómo]. Me interesa porque [por qué].
- La documentación de [herramienta] dice que [detalle concreto que cambia la implementación].
- Un problema conocido: [cuál] y cómo se suele evitar: [cómo].

RESTRICCIONES
- No quiero [qué].
- Tiene que funcionar con [qué].

Con esto, dame un plan de implementación. No escribas código todavía.
\`\`\`

---

## Por qué funciona

Un modelo te da la respuesta media de lo que ha visto. Si tu pregunta es
genérica, la respuesta media es lo genérico.

Cada dato concreto que le das —un límite real, cómo lo resuelve un producto que
ya existe, un problema conocido— es una restricción que descarta miles de
respuestas mediocres. **La calidad de lo que recibes es la calidad de lo que
das.**

Y hay un efecto secundario que no es menor: al terminar esta investigación, tú
también entiendes tu proyecto mejor que antes de empezarla.
`;
