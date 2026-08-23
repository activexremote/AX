// ══════════════════════════════════════════════════════════
//  Ruido de las extensiones del navegador
// ══════════════════════════════════════════════════════════
//
//  "Failed to connect to MetaMask" no es un fallo de esta web. MetaMask (y
//  cualquier cartera cripto) inyecta su `inpage.js` en TODAS las páginas que
//  visitas, intenta hablar con la extensión y, si no puede, lanza una promesa
//  rechazada. En este proyecto no hay una sola línea de web3: el error viene
//  entero de `chrome-extension://…` y ocurre igual en cualquier otra web.
//
//  Lo que sí es problema nuestro es que el overlay de errores de Next se
//  pone delante de la pantalla en desarrollo por culpa de eso, y tapa el
//  trabajo. Así que se silencian —sólo en desarrollo— los errores cuya pila
//  apunta a una extensión. No se silencia nada más: si el fallo tiene una
//  línea de código nuestro, pasa de largo y el overlay salta como siempre.
//
//  Va como <script> suelto y no como efecto de React a propósito: un script
//  clásico en el <body> se ejecuta antes que los módulos del cliente, y por
//  tanto antes de que Next registre sus propios escuchadores. Sólo así
//  `stopImmediatePropagation` llega a tiempo de que el overlay ni se entere.
const script = `
(function () {
  if (window.__axrExtNoise) return;
  window.__axrExtNoise = true;

  var EXTENSION = /(chrome|moz|safari-web|ms-browser)-extension:\\/\\//;

  function deExtension(texto) {
    return typeof texto === "string" && EXTENSION.test(texto);
  }

  function callar(e) {
    e.stopImmediatePropagation();
    if (e.cancelable) e.preventDefault();
  }

  window.addEventListener("error", function (e) {
    var pila = e.error && e.error.stack;
    if (deExtension(e.filename) || deExtension(pila)) callar(e);
  }, true);

  window.addEventListener("unhandledrejection", function (e) {
    var r = e.reason;
    var pila = (r && (r.stack || r.message)) || String(r || "");
    if (deExtension(pila)) callar(e);
  }, true);
})();
`;

/** Sólo en desarrollo: en producción no hay overlay que tapar. */
export function ExtensionNoiseScript() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <script
      id="axr-extension-noise"
      // Cadena fija escrita aquí: no entra nada del usuario.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
