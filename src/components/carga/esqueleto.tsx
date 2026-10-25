import "./esqueleto.scss";

// ══════════════════════════════════════════════════════════
//  Lo que se ve mientras llega la página
//
//  Va en los `loading.tsx`. Con ellos, Next precarga y enseña al instante la
//  parte fija (barra lateral, cabecera) y este esqueleto en el hueco de la
//  página; sin ellos, un clic no hacía nada visible hasta que el servidor
//  terminaba, y la web parecía colgada.
// ══════════════════════════════════════════════════════════

export function Esqueleto({ variante = "panel" }: { variante?: "panel" | "lista" | "campus" }) {
  return (
    <div className={`axr-esq axr-esq--${variante}`} aria-busy="true" aria-live="polite">
      <span className="axr-esq__sr">Cargando…</span>
      <div className="axr-esq__titulo" />
      <div className="axr-esq__linea" />
      {variante === "lista" ? (
        <div className="axr-esq__filas">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="axr-esq__fila" />
          ))}
        </div>
      ) : (
        <div className="axr-esq__rejilla">
          {Array.from({ length: variante === "campus" ? 6 : 4 }, (_, i) => (
            <div key={i} className="axr-esq__tarjeta" />
          ))}
        </div>
      )}
    </div>
  );
}
