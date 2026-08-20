// Esfera de alambre del héroe.
//
// ── Qué es y qué no ───────────────────────────────────────
// Es textura, no ilustración. Vive dentro de la capa de efectos del héroe,
// entre la rejilla y el grano, y su trabajo es sugerir «esto pasa en todo el
// mundo» sin robarle un segundo a nadie.
//
// ── Por qué esta versión es 3D de verdad ──────────────────
// La anterior fingía el giro: seis elipses SVG que se estrechaban con un
// `scaleX` cada una a su ritmo. Tenía dos problemas y los dos eran graves.
//
//   · No se leía como una esfera. Con el eje de giro perpendicular a la
//     pantalla los meridianos se cierran sobre una línea recta, nunca se ve
//     el polo, y el resultado son curvas sueltas cruzando el fondo. Y al
//     darle a cada meridiano una velocidad distinta se rompía lo único que
//     ata unas líneas a un cuerpo sólido: que giran todas juntas.
//
//   · Iba a tirones. Una animación CSS sobre un elemento SVG NO la compone la
//     GPU: se resuelve en el hilo principal y obliga a rasterizar el SVG
//     entero en cada fotograma. Con la esfera a sangre eso son ~1.800 px de
//     lado, seis veces por fotograma, más ocho puntos parpadeando y dos arcos
//     con `stroke-dashoffset` —que tampoco se compone nunca—, todo ello bajo
//     una `mask-image` que forzaba una superficie de render aparte.
//
// Ahora hay una sola animación, sobre un solo elemento HTML: el contenedor
// gira en 3D y la GPU transforma las capas ya rasterizadas. Los meridianos son
// círculos CSS girados en Y dentro de un `preserve-3d`; cada uno se rasteriza
// una vez y no se vuelve a tocar.
//
// ── La geometría ──────────────────────────────────────────
// Sin `perspective`: proyección ortográfica, que es como se ve una esfera de
// lejos y, de paso, hace que los paralelos sean elipses exactas y se puedan
// dibujar planos en SVG.
//
// El eje va inclinado dos veces:
//   · EJE (rotateZ) lo tumba en el plano de la pantalla — la inclinación de la
//     Tierra. De paso evita que los meridianos queden paralelos a la rejilla
//     del fondo, que es cuando las dos texturas se pelean y se ve moaré.
//   · INCL (rotateX) acerca el polo norte al observador. Es el que hace el
//     trabajo: sin él los paralelos son rectas y el polo cae en el borde;
//     con 24° los paralelos se abren en elipses y los meridianos convergen en
//     un punto DENTRO del disco. Eso es lo que se lee como «bola».
//
// ⚠︎ EJE e INCL están duplicados en landing.scss (@keyframes axr-globe-spin y
// .axr-globe__spin). Los paralelos de aquí y los meridianos de allí comparten
// el mismo espacio 3D: si se cambia un número hay que cambiar los dos o la
// retícula deja de encajar consigo misma.

/** Inclinación del eje en el plano de la pantalla, en grados. */
const EJE = -23;

/** Cuánto se acerca el polo norte al observador, en grados. */
const INCL = 24;

/**
 * Longitud de cada anillo, en grados.
 *
 * Son anillos completos, no semicírculos: cada uno dibuja dos meridianos —el
 * de delante y el de detrás—, así que seis anillos dan una retícula de 30°.
 * Esa transparencia de ver también la cara oculta es media lectura de esfera.
 */
const MERIDIANOS = [0, 30, 60, 90, 120, 150];

/** Latitudes de los paralelos, en grados. Cada 20°, hasta casi el polo. */
const PARALELOS = [0, 20, -20, 40, -40, 60, -60, 80, -80];

const rad = (g: number) => (g * Math.PI) / 180;

export function HeroGlobe() {
  // Un paralelo a latitud φ es una circunferencia de radio R·cos φ a la altura
  // R·sin φ. Al inclinar la esfera INCL grados, esa circunferencia se proyecta
  // como una elipse de semiejes (R·cos φ, R·cos φ·sen INCL) centrada a
  // R·sin φ·cos INCL del centro. Como el giro es sobre el eje polar, los
  // paralelos no se mueven nunca: se dibujan planos y no cuestan un fotograma.
  const achatado = Math.sin(rad(INCL));
  const escorzo = Math.cos(rad(INCL));

  return (
    <span className="axr-lp__fx-globe" aria-hidden>
      {/* Cuerpo: el limbo y el sombreado que convierten la retícula en volumen.
          Sin esto son líneas curvas; con esto es una bola. */}
      <span className="axr-globe__ball" />

      {/* viewBox de 200 con R=100: el radio coincide con el 50 % de la caja,
          o sea con el limbo de la bola de arriba. `non-scaling-stroke` deja el
          trazo en 1 px de pantalla pase lo que pase con el tamaño — es lo que
          hace que esto sea responsive sin tener que reajustar grosores. */}
      <svg className="axr-globe__parallels" viewBox="0 0 200 200" focusable="false">
        <g transform={`rotate(${EJE} 100 100)`}>
          {PARALELOS.map((lat) => {
            const rx = 100 * Math.cos(rad(lat));
            return (
              <ellipse
                key={lat}
                cx={100}
                cy={100 - 100 * Math.sin(rad(lat)) * escorzo}
                rx={rx}
                ry={rx * achatado}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
      </svg>

      {/* Lo único que se mueve en todo el héroe aparte de los focos: un
          `transform` en un elemento, que el compositor resuelve solo. */}
      <span className="axr-globe__spin">
        {MERIDIANOS.map((lon) => (
          <span
            key={lon}
            className="axr-globe__meridian"
            style={{ transform: `rotateY(${lon}deg)` }}
          />
        ))}
      </span>
    </span>
  );
}
