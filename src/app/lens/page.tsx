import Link from "next/link";

export default function LensHome() {
  return (
    <div className="axr-lens-page">
      <div className="axr-lens-page__header">
        <div>
          <h1>Lens</h1>
          <p>Herramientas de dirección: previsión de ingresos y rentabilidad del negocio.</p>
        </div>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        <Link href="/lens/calculadora-matriculas" className="axr-lens-tool-card">
          <h2>Calculadora de matrículas</h2>
          <p>Previsión de ingresos, costes, CAC, ROAS y LTV en función del volumen de alumnos.</p>
        </Link>
      </div>
    </div>
  );
}
