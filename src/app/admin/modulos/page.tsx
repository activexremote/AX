import { ListaModulos, type FilaModulo } from "@/components/admin/lista-modulos";
import { NewModuleButton } from "@/components/admin/new-module-button";
import { listModulesWithCounts } from "@/lib/data/modules";
import { adminACopy } from "@/lib/i18n/admin-v2-a";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/modulos/modulos.scss";

export default async function AdminModulesPage({ searchParams }: { searchParams: Promise<{ nuevo?: string; estado?: string }> }) {
  const [modules, { locale }, sp] = await Promise.all([listModulesWithCounts(), getI18n(), searchParams]);
  const c = adminACopy[locale];

  // Sólo lo que pinta la lista: el resto del módulo no viaja al navegador.
  const filas: FilaModulo[] = modules.map((m) => ({
    id: m.id,
    slug: m.slug,
    code: m.code ?? null,
    title: m.title,
    course: m.course,
    available: m.available,
    order_index: m.order_index,
    lessons_count: m.lessons_count,
    estimated_minutes: m.estimated_minutes ?? null,
  }));

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.modTitle}</h1>
          <p>{c.modLead}</p>
        </div>
        {/* El atajo del resumen llega con ?nuevo=1 y abre directamente el formulario. */}
        <NewModuleButton abierto={sp.nuevo === "1"} />
      </div>

      <ListaModulos modulos={filas} copy={c} filtroInicial={sp.estado === "ocultos" ? "ocultos" : "todos"} />
    </div>
  );
}
