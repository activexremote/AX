// Diagramas de los cursos relámpago.
//
// Son diagramas, no adorno: cada uno dice algo que en una lista de texto se
// pierde. El ciclo es un ciclo —se dibuja redondo porque vuelve a empezar— y
// la comparación de duraciones es una proporción, que es justo lo que un
// número escrito no transmite.
//
// Ninguno lleva JavaScript: son SVG con animación CSS, así que llegan
// pintados desde el servidor y se paran solos con `prefers-reduced-motion`.

/**
 * El ciclo de una lección, en anillo.
 *
 * Seis nodos repartidos por una circunferencia y un punto que la recorre. El
 * punto es lo que convierte seis cajas en un ciclo: enseña que después del
 * paso 6 se vuelve al 1, que es exactamente cómo funciona el curso.
 */
export function LoopRing({ steps }: { steps: { step: string; title: string }[] }) {
  const R = 74;
  const C = 100;
  const n = steps.length;

  return (
    <svg
      className="axr-ring"
      viewBox="0 0 200 200"
      role="img"
      aria-label={steps.map((s) => s.title).join(" → ")}
    >
      {/* La pista. Discontinua para que el movimiento del punto se lea contra
          algo, en vez de sobre una línea lisa donde no se aprecia. */}
      <circle className="axr-ring__track" cx={C} cy={C} r={R} />

      {steps.map((s, i) => {
        // -90° para que el paso 01 quede arriba y no a la derecha.
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        const x = C + R * Math.cos(a);
        const y = C + R * Math.sin(a);
        return (
          <g key={s.step} className="axr-ring__node">
            <circle cx={x} cy={y} r="15" />
            <text x={x} y={y} dy="0.34em">{s.step}</text>
          </g>
        );
      })}

      {/* El punto que recorre el anillo. `offset-path` lo lleva por la
          circunferencia sin tener que calcular la posición en cada fotograma:
          lo resuelve el compositor. */}
      <circle className="axr-ring__runner" r="5" cx="0" cy="0" />
    </svg>
  );
}

/**
 * Cuánto dura un relámpago frente al programa.
 *
 * Dos barras a escala real: 4 horas contra 14 semanas de clases. El número
 * escrito no dice nada —«4 h» y «14 semanas» son dos etiquetas—; la
 * proporción dibujada se entiende sin leer, y es el argumento entero de la
 * sección.
 */
export function ScaleBars({
  flashLabel,
  flashValue,
  programLabel,
  programValue,
  note,
}: {
  flashLabel: string;
  flashValue: string;
  programLabel: string;
  programValue: string;
  note: string;
}) {
  // 4 h de vídeo contra 56 h en directo: la barra corta mide exactamente eso,
  // un 7 %. La cifra va FUERA de la barra, no dentro, porque «4 h de vídeo»
  // no cabe en el 7 % de nada y ensancharla para que quepa sería mentir con
  // el único elemento de la sección cuyo trabajo es no mentir.
  const filas = [
    { kind: "flash", label: flashLabel, value: flashValue, w: "7%" },
    { kind: "program", label: programLabel, value: programValue, w: "100%" },
  ] as const;

  return (
    <div className="axr-scale">
      {filas.map((f) => (
        <div key={f.kind} className="axr-scale__row" data-kind={f.kind}>
          <span className="axr-scale__label">{f.label}</span>
          <span className="axr-scale__track">
            <span className="axr-scale__fill" style={{ ["--w" as string]: f.w }} />
            <span className="axr-scale__val">{f.value}</span>
          </span>
        </div>
      ))}
      <p className="axr-scale__note">{note}</p>
    </div>
  );
}

/**
 * Lo que se construye, como cadena de piezas.
 *
 * El texto dice «landing → formulario → base de datos → auth → panel → CRUD →
 * deploy → dominio». Dibujarlo encadenado enseña de un vistazo que es UN
 * recorrido y no ocho temas sueltos, que es la diferencia entre este curso y
 * un índice de tutoriales.
 */
export function BuildChain({ steps }: { steps: string[] }) {
  return (
    <ol className="axr-chain" aria-label={steps.join(" → ")}>
      {steps.map((s, i) => (
        <li key={s} style={{ ["--i" as string]: String(i) }}>
          <span className="axr-chain__dot" aria-hidden />
          <span className="axr-chain__label">{s}</span>
        </li>
      ))}
    </ol>
  );
}
