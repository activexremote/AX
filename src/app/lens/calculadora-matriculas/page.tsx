import { createClient } from "@/lib/supabase/server";
import { CalculadoraMatriculas } from "@/components/lens/calculadora-matriculas";
import type { LensScenarioData } from "@/lib/lens/calculadora";

export default async function CalculadoraMatriculasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lens_scenarios")
    .select("id, name, data, updated_at")
    .order("updated_at", { ascending: false });

  const savedScenarios = (data ?? []) as { id: string; name: string; data: LensScenarioData; updated_at: string }[];

  return (
    <div className="axr-lens-page">
      <div className="axr-lens-page__header">
        <div>
          <h1>Calculadora de matrículas</h1>
          <p>Ajusta precios, canales de captación y costes para ver el impacto en la rentabilidad al instante.</p>
        </div>
      </div>
      <CalculadoraMatriculas savedScenarios={savedScenarios} />
    </div>
  );
}
