import { Calculadora } from "@/components/admin/comercial/calculadora";
import { exigirComercial } from "@/lib/comercial/acceso";
import { hoyMadrid } from "@/lib/comercial/tipos";
import { comCopy } from "@/lib/i18n/comercial";
import { getLocale } from "@/lib/i18n/server";
import "../comercial.scss";

// La calculadora de plazos, suelta: para una llamada en la que aún no hay
// ficha, o para tenerla abierta al lado.
export default async function CalculadoraPage() {
  await exigirComercial();
  const c = comCopy[await getLocale()];

  return (
    <div className="axr-admin-page axr-com">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.calcTitle}</h1>
          <p>{c.calcLead}</p>
        </div>
      </div>
      <section className="axr-admin-card axr-com-calcpage">
        <Calculadora hoy={hoyMadrid()} c={c} />
      </section>
    </div>
  );
}
