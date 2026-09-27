import Link from "next/link";
import { notFound } from "next/navigation";

import { ModuleForm } from "@/components/admin/module-form";
import { ManageLessons } from "@/components/admin/manage-lessons";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteModule } from "@/app/admin/modulos/actions";
import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
import { aiConfigured } from "@/lib/ai/settings";
import type { Lesson, Module } from "@/lib/supabase/types";
import "@/components/content/content.scss";
import "@/components/admin/block-editor.scss";

export default async function AdminModuleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { t } = await getI18n();
  const { data: module } = await supabase.from("modules").select("*").eq("id", id).maybeSingle();
  if (!module) notFound();
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", id)
    .order("order_index");
  // Sin clave de OpenAI la caja de arrastrar lo dice y deja el camino a mano.
  const iaLista = await aiConfigured();

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{(module as Module).title}</h1>
          <p><Link href="/admin/modulos">← {t.adminForm.allModules}</Link></p>
        </div>
        <DeleteButton
          action={deleteModuleAction.bind(null, id)}
          label={t.adminForm.deleteModule}
          confirmLabel={t.admin.confirmDelete}
        />
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.moduleData}</h2>
        <ModuleForm module={module as Module} />
      </div>

      <div className="axr-admin-card">
        <h2>{t.adminForm.lessons}</h2>
        <ManageLessons moduleId={id} lessons={(lessons ?? []) as Lesson[]} aiReady={iaLista} />
      </div>
    </div>
  );
}

async function deleteModuleAction(id: string) {
  "use server";
  await deleteModule(id);
}
