import { createClient } from "@/lib/supabase/server";
import { CalculadoraMatriculas } from "@/components/lens/calculadora-matriculas";
import { normalizeScenario, type LensScenarioData } from "@/lib/lens/calculadora";

export default async function CalculadoraMatriculasPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lens_scenarios")
    .select("id, name, data, updated_at")
    .order("updated_at", { ascending: false });

  // Se normaliza aquí y no sólo al abrir uno: los escenarios guardados antes
  // de existir los dividendos no traen esos campos, y el primer render ya los
  // necesita completos.
  const savedScenarios = (
    (data ?? []) as { id: string; name: string; data: Partial<LensScenarioData>; updated_at: string }[]
  ).map((s) => ({ ...s, data: normalizeScenario(s.data) }));

  return (
    <div className="axr-lens-page axr-lens-page--wide">
      <div className="axr-lens-page__header">
        <div>
          <h1>Calculadora de matrículas</h1>
          <p>
            Configura a la izquierda y mira el resultado a la derecha. En el móvil, con las dos pestañas.
          </p>
        </div>
      </div>
      <CalculadoraMatriculas savedScenarios={savedScenarios} />
    </div>
  );
}
