import { Esqueleto } from "@/components/carga/esqueleto";

// La barra lateral ya está; esto ocupa el hueco mientras llega la sección.
export default function Cargando() {
  return (
    <div className="axr-admin-page">
      <Esqueleto />
    </div>
  );
}
