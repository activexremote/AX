import { GuiaDocente, type GrupoGuia, type TipoRecurso } from "@/components/admin/guia-docente";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { adminCCopy } from "@/lib/i18n/admin-v2-c";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { localize } from "@/lib/data/localize";
import type { Module } from "@/lib/supabase/types";
import "./guia.scss";

// ══════════════════════════════════════════════════════════
//  Guía para profesores
//
//  Lo que el alumno NO debe ver: solucionarios, guiones de diapositivas, kits
//  de preguntas, tests con respuestas y las diapositivas de la clase. Vive en
//  el bucket privado `teacher-guides` y se abre por abrir/[id], que firma el
//  enlace en el momento (una hora) y exige sesión de profesor.
//
//  El panel ya exige rol de profesor o administrador (admin/layout.tsx), y la
//  tabla y el bucket lo vuelven a exigir por RLS: si alguien llegara aquí sin
//  serlo, no recibiría ni una fila.
// ══════════════════════════════════════════════════════════

const SECTION_ORDER = ["general", "preclase", "hora-1", "hora-2", "hora-3", "hora-4", "rubricas"];

const COPY = {
  es: {
    title: "Guía para profesores",
    lead: "Material de apoyo para impartir cada módulo: diapositivas, guiones, kits de preguntas, tests y solucionarios. Sólo lo ve el equipo docente; los enlaces caducan en una hora.",
    empty: "Todavía no hay material cargado.",
    sections: {
      general: "General",
      preclase: "Pre-clase",
      "hora-1": "Hora 1",
      "hora-2": "Hora 2",
      "hora-3": "Hora 3",
      "hora-4": "Hora 4",
      rubricas: "Rúbricas y tareas",
    } as Record<string, string>,
    course: { core: "Núcleo común", "remote-professional": "Remote Professional", "remote-founder": "Remote Founder" } as Record<string, string>,
  },
  en: {
    title: "Teacher guide",
    lead: "Support material to teach each module: slides, scripts, question kits, tests and answer keys. Only the teaching team can see it; links expire after one hour.",
    empty: "No material has been loaded yet.",
    sections: {
      general: "General",
      preclase: "Pre-class",
      "hora-1": "Hour 1",
      "hora-2": "Hour 2",
      "hora-3": "Hour 3",
      "hora-4": "Hour 4",
      rubricas: "Rubrics and assignments",
    } as Record<string, string>,
    course: { core: "Common core", "remote-professional": "Remote Professional", "remote-founder": "Remote Founder" } as Record<string, string>,
  },
};

type Resource = { id: string; module_id: string | null; section: string; label: string; path: string; lang: string | null; order_index: number };

/** El tipo de archivo, por la extensión. */
function tipoDe(path: string): TipoRecurso {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["ppt", "pptx", "key", "odp"].includes(ext)) return "slides";
  if (["doc", "docx", "odt", "rtf"].includes(ext)) return "doc";
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "sheet";
  if (["md", "markdown", "txt"].includes(ext)) return "md";
  if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(ext)) return "image";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  return "other";
}

export default async function TeacherGuidePage() {
  const supabase = await createClient();
  const { locale } = await getI18n();
  const c = COPY[locale];
  const g = adminCCopy[locale].guia;

  // Supabase devuelve como mucho 1.000 filas por consulta y hay más de 1.200
  // recursos: con una sola consulta, los últimos módulos desaparecían sin
  // avisar. Se piden por tramos, a la vez, y se juntan.
  const TRAMO = 1000;
  const { count } = await supabase.from("teacher_resources").select("id", { count: "exact", head: true });
  const tramos = Math.max(1, Math.ceil((count ?? 0) / TRAMO));
  const [{ data: modulesRaw }, ...partes] = await Promise.all([
    supabase.from("modules").select("id, slug, title, title_en, code, course, order_index").order("order_index"),
    ...Array.from({ length: tramos }, (_, i) =>
      supabase
        .from("teacher_resources")
        .select("id, module_id, section, label, path, lang, order_index")
        .order("order_index")
        .order("id")
        .range(i * TRAMO, i * TRAMO + TRAMO - 1),
    ),
  ]);

  const modules = ((modulesRaw ?? []) as Module[]).map((m) => localize(m, locale));
  const resources = partes.flatMap((p) => (p.data ?? []) as Resource[]);
  const item = (r: Resource) => ({ id: r.id, label: r.label, section: r.section, lang: r.lang, tipo: tipoDe(r.path) });

  const general = resources.filter((r) => !r.module_id);
  const grupos: GrupoGuia[] = [
    ...(general.length ? [{ key: "general", title: c.sections.general, code: null, course: null, items: general.map(item) }] : []),
    ...modules
      .map((m) => ({ key: m.id, title: m.title, code: m.code ?? null, course: m.course ?? null, items: resources.filter((r) => r.module_id === m.id).map(item) }))
      .filter((x) => x.items.length),
  ];

  const porTipo = Object.entries(
    resources.reduce<Record<string, number>>((acc, r) => {
      const t = tipoDe(r.path);
      acc[t] = (acc[t] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </div>

      {!resources.length ? (
        <div className="axr-admin-card">
          <div className="axr-adm-empty">
            <Icono n="birrete" size={26} />
            <span>{c.empty}</span>
          </div>
        </div>
      ) : (
        <>
          <div className="axr-adm-stats">
            <div className="axr-adm-stat">
              <span className="axr-adm-stat__label">
                <Icono n="libro" /> {g.statModules}
              </span>
              <span className="axr-adm-stat__value">{grupos.filter((x) => x.key !== "general").length}</span>
            </div>
            <div className="axr-adm-stat">
              <span className="axr-adm-stat__label">
                <Icono n="capas" /> {g.statResources}
              </span>
              <span className="axr-adm-stat__value">{resources.length.toLocaleString(locale)}</span>
            </div>
            <div className="axr-adm-stat axr-guia-stat-types">
              <span className="axr-adm-stat__label">
                <Icono n="lista" /> {g.statTypes}
              </span>
              <span className="axr-guia-stat-types__list">
                {porTipo.map(([t, n]) => (
                  <span key={t} className={`axr-guia-type axr-guia-type--${t}`}>
                    {g.types[t]} · {n}
                  </span>
                ))}
              </span>
            </div>
          </div>

          <p className="axr-adm-note">
            <Icono n="escudo" /> {g.linkNote}
          </p>

          <GuiaDocente grupos={grupos} copy={g} secciones={c.sections} cursos={c.course} />
        </>
      )}
    </div>
  );
}
