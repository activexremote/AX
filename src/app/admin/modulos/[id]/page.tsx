import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ModuleForm } from "@/components/admin/module-form";
import { ManageLessons } from "@/components/admin/manage-lessons";
import { DeleteButton } from "@/components/admin/delete-button";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { deleteModule } from "@/app/admin/modulos/actions";
import { createClient } from "@/lib/supabase/server";
import { adminACopy } from "@/lib/i18n/admin-v2-a";
import { fill } from "@/lib/i18n/publicaciones";
import { getI18n } from "@/lib/i18n/server";
import { aiConfigured } from "@/lib/ai/settings";
import type { Lesson, Module } from "@/lib/supabase/types";
import "@/components/content/content.scss";
import "@/components/admin/block-editor.scss";
import "@/app/admin/modulos/modulos.scss";

export default async function AdminModuleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  // Todo a la vez: nada de esto depende de lo anterior. Sin clave de OpenAI
  // la caja de arrastrar lo dice y deja el camino a mano.
  const [{ t, locale }, { data: module }, { data: lessons }, iaLista] = await Promise.all([
    getI18n(),
    supabase.from("modules").select("*").eq("id", id).maybeSingle(),
    supabase.from("lessons").select("*").eq("module_id", id).order("order_index"),
    aiConfigured(),
  ]);
  if (!module) notFound();
  const m = module as Module;
  const c = adminACopy[locale];
  const lista = (lessons ?? []) as Lesson[];
  const minutos = lista.reduce((n, l) => n + (l.duration_min ?? 0), 0);

  return (
    <div className="axr-admin-page axr-moddetail">
      <div className="axr-admin-page__header">
        <div>
          <nav className="axr-moddetail__crumbs" aria-label="Breadcrumb">
            <Link href="/admin/modulos">{c.crumbModules}</Link>
            <span aria-hidden>/</span>
            <span>{m.code ?? m.slug}</span>
          </nav>
          <h1>{m.title}</h1>
          <div className="axr-moddetail__pills">
            <span className="axr-adm-pill axr-adm-pill--accent">{c.course[m.course] ?? m.course}</span>
            <span className={`axr-adm-pill axr-adm-pill--${m.available ? "ok" : "warn"}`}>{m.available ? c.modAvailable : c.modHidden}</span>
            <span className="axr-adm-pill">{fill(c.modLessons, lista.length)}</span>
            <span className="axr-adm-pill">{fill(c.modMinutes, m.estimated_minutes ?? minutos)}</span>
          </div>
        </div>
        <div className="axr-moddetail__actions">
          <Link href={`/modulos/${m.slug}`} className="axr-btn axr-btn--ghost">
            <Icono n="enlace" size={15} /> {c.detailView}
          </Link>
          <DeleteButton action={deleteModuleAction.bind(null, id)} label={t.adminForm.deleteModule} confirmLabel={t.admin.confirmDelete} />
        </div>
      </div>

      <div className="axr-moddetail__grid">
        <section className="axr-admin-card">
          <div className="axr-moddetail__cardhead">
            <div>
              <h2>{c.detailLessons}</h2>
              <p>{c.detailLessonsHint}</p>
            </div>
          </div>
          <ManageLessons moduleId={id} lessons={lista} aiReady={iaLista} />
        </section>

        <section className="axr-admin-card">
          <div className="axr-moddetail__cardhead">
            <div>
              <h2>{c.detailData}</h2>
              <p>{c.detailDataHint}</p>
            </div>
          </div>
          <ModuleForm module={m} />
        </section>
      </div>
    </div>
  );
}

async function deleteModuleAction(id: string) {
  "use server";
  await deleteModule(id);
  // Sin esto, el botón refrescaba la página de un módulo que ya no existe y
  // se quedaba en un 404.
  redirect("/admin/modulos");
}
