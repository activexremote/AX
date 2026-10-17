import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { localize } from "@/lib/data/localize";
import type { Module } from "@/lib/supabase/types";

// ══════════════════════════════════════════════════════════
//  Guía para profesores
//
//  Lo que el alumno NO debe ver: solucionarios, guiones de diapositivas, kits
//  de preguntas, tests con respuestas y las diapositivas de la clase. Vive en
//  el bucket privado `teacher-guides` y se sirve con URL firmada de una hora:
//  un enlace que se reenvía a un alumno deja de abrir esa misma tarde.
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

export default async function TeacherGuidePage() {
  const supabase = await createClient();
  const { locale } = await getI18n();
  const c = COPY[locale];

  const [{ data: modulesRaw }, { data: resRaw }] = await Promise.all([
    supabase.from("modules").select("id, slug, title, title_en, code, course, order_index").order("order_index"),
    supabase.from("teacher_resources").select("*").order("order_index"),
  ]);

  const modules = ((modulesRaw ?? []) as Module[]).map((m) => localize(m, locale));
  const resources = (resRaw ?? []) as Resource[];

  // Una sola llamada para todas las URLs firmadas.
  const signed = resources.length
    ? (await supabase.storage.from("teacher-guides").createSignedUrls(resources.map((r) => r.path), 3600)).data ?? []
    : [];
  const urlOf = new Map(signed.map((s) => [s.path, s.signedUrl]));

  const general = resources.filter((r) => !r.module_id);
  const byModule = modules
    .map((m) => ({ module: m, items: resources.filter((r) => r.module_id === m.id) }))
    .filter((g) => g.items.length);

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </div>

      {!resources.length ? <div className="axr-admin-card">{c.empty}</div> : null}

      {general.length ? <Group title={c.sections.general} items={general} urlOf={urlOf} c={c} /> : null}

      {byModule.map(({ module, items }) => (
        <Group
          key={module.id}
          title={`${module.code ? `${module.code} · ` : ""}${module.title}`}
          meta={c.course[module.course] ?? module.course}
          items={items}
          urlOf={urlOf}
          c={c}
        />
      ))}
    </div>
  );
}

function Group({
  title,
  meta,
  items,
  urlOf,
  c,
}: {
  title: string;
  meta?: string;
  items: Resource[];
  urlOf: Map<string | null, string | null>;
  c: (typeof COPY)["es"];
}) {
  const sections = SECTION_ORDER.filter((s) => items.some((r) => r.section === s)).concat(
    [...new Set(items.map((r) => r.section))].filter((s) => !SECTION_ORDER.includes(s)),
  );

  return (
    <details className="axr-admin-card">
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>
        {title}
        {meta ? <span style={{ marginLeft: "0.5rem", fontWeight: 400, color: "var(--axr-text-helper)" }}>· {meta}</span> : null}
        <span style={{ marginLeft: "0.5rem", fontWeight: 400, color: "var(--axr-text-helper)" }}>({items.length})</span>
      </summary>
      {sections.map((s) => (
        <div key={s} style={{ marginTop: "1rem" }}>
          <h3 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.4rem" }}>
            {c.sections[s] ?? s}
          </h3>
          <table className="axr-admin-table">
            <tbody>
              {items
                .filter((r) => r.section === s)
                .map((r) => (
                  <tr key={r.id}>
                    <td>{r.label}</td>
                    <td style={{ width: "4rem", color: "var(--axr-text-helper)" }}>{r.lang?.toUpperCase() ?? ""}</td>
                    <td className="axr-admin-table__actions">
                      {urlOf.get(r.path) ? (
                        <a className="axr-btn axr-btn--ghost" href={urlOf.get(r.path) ?? undefined} target="_blank" rel="noopener noreferrer">
                          ↓
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </details>
  );
}
