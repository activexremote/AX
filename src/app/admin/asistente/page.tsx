import { KbQuestionActions, KbRowActions, KbSourceButton } from "@/components/admin/kb-source-editor";
import { AssistantChat } from "@/components/campus/assistant-chat";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AssistantQuestion, KbSource } from "@/lib/supabase/types";

export default async function AdminAssistantPage() {
  const supabase = await createClient();
  const { t, locale } = await getI18n();

  const cols = "id, kind, course, title, file_name, active, chunks_count, created_at";
  const [{ data: faqRows }, { data: docRows }, { data: unanswered }, { data: recent }] = await Promise.all([
    supabase.from("kb_sources").select(`${cols}, body`).eq("kind", "faq").order("created_at", { ascending: false }),
    // Sin `body`: un documento puede ser un PDF de cientos de páginas. El
    // formulario lo pide al abrirse, en vez de mandarlo entero en cada visita.
    supabase.from("kb_sources").select(cols).eq("kind", "documento").order("created_at", { ascending: false }),
    supabase
      .from("assistant_questions")
      .select("id, question, answer, created_at, profiles(full_name, email)")
      .eq("answered", false)
      .eq("reviewed", false)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("assistant_questions")
      .select("id, question, answered, created_at, profiles(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  type Row = Omit<KbSource, "body"> & { body?: string };
  const faqs = (faqRows ?? []) as KbSource[];
  const docs = (docRows ?? []) as Row[];
  const chunks = [...faqs, ...docs].filter((s) => s.active).reduce((acc, s) => acc + s.chunks_count, 0);

  type WithAuthor = { profiles: { full_name: string | null; email: string } | null };
  const pending = (unanswered ?? []) as unknown as (Pick<AssistantQuestion, "id" | "question" | "answer" | "created_at"> & WithAuthor)[];
  const latest = (recent ?? []) as unknown as (Pick<AssistantQuestion, "id" | "question" | "answered" | "created_at"> & WithAuthor)[];

  const date = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "short", timeStyle: "short" });
  const author = (q: WithAuthor) => q.profiles?.full_name ?? q.profiles?.email ?? "—";

  const muted = { textAlign: "center", color: "var(--axr-text-helper)" } as const;

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.kb.title}</h1>
          <p>{t.kb.subtitle}</p>
        </div>
      </div>

      <div className="axr-progress-kpis">
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.kb.kpiFaqs}</div>
          <div className="axr-kpi__value">{faqs.length}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.kb.kpiDocs}</div>
          <div className="axr-kpi__value">{docs.length}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.kb.kpiChunks}</div>
          <div className="axr-kpi__value">{chunks}</div>
        </div>
        <div className="axr-kpi">
          <div className="axr-kpi__label">{t.kb.kpiUnanswered}</div>
          <div className="axr-kpi__value">{pending.length}</div>
        </div>
      </div>

      {pending.length > 0 ? (
        <div className="axr-admin-card">
          <h2>{t.kb.unansweredTitle}</h2>
          <p style={{ fontSize: "0.8125rem", color: "var(--axr-text-helper)", marginTop: 0 }}>{t.kb.unansweredHint}</p>
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{t.kb.colQuestion}</th>
                <th>{t.admin.colStudent}</th>
                <th>{t.kb.colDate}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>{q.question}</strong>
                    {q.answer ? (
                      <details style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--axr-text-secondary)" }}>
                        <summary>{t.kb.botSaid}</summary>
                        <p style={{ whiteSpace: "pre-wrap", margin: "0.25rem 0 0" }}>{q.answer}</p>
                      </details>
                    ) : null}
                  </td>
                  <td>{author(q)}</td>
                  <td>{date(q.created_at)}</td>
                  <td><KbQuestionActions id={q.id} question={q.question} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="axr-admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ flex: 1 }}>{t.kb.faqsTitle}</h2>
          <KbSourceButton kind="faq" label={`+ ${t.kb.newFaq}`} />
        </div>
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.kb.colQuestion}</th>
              <th>{t.kb.colCourse}</th>
              <th>{t.kb.colActive}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {faqs.length === 0 ? <tr><td colSpan={4} style={muted}>{t.kb.noFaqs}</td></tr> : null}
            {faqs.map((s) => (
              <tr key={s.id} style={s.active ? undefined : { opacity: 0.55 }}>
                <td>
                  <strong>{s.title}</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--axr-text-secondary)", marginTop: "0.25rem" }}>
                    {s.body.length > 160 ? `${s.body.slice(0, 160)}…` : s.body}
                  </div>
                </td>
                <td>{s.course ?? t.kb.allCourses}</td>
                <td>{s.active ? "✓" : "—"}</td>
                <td><KbRowActions source={s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="axr-admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem" }}>
          <h2 style={{ flex: 1 }}>{t.kb.docsTitle}</h2>
          <KbSourceButton kind="documento" label={`+ ${t.kb.newDoc}`} />
        </div>
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.kb.colTitle}</th>
              <th>{t.kb.colCourse}</th>
              <th>{t.kb.colChunks}</th>
              <th>{t.kb.colActive}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 ? <tr><td colSpan={5} style={muted}>{t.kb.noDocs}</td></tr> : null}
            {docs.map((s) => (
              <tr key={s.id} style={s.active ? undefined : { opacity: 0.55 }}>
                <td>
                  <strong>{s.title}</strong>
                  {s.file_name ? (
                    <div style={{ fontSize: "0.75rem", color: "var(--axr-text-helper)" }}>{s.file_name}</div>
                  ) : null}
                </td>
                <td>{s.course ?? t.kb.allCourses}</td>
                <td>{s.chunks_count}</td>
                <td>{s.active ? "✓" : "—"}</td>
                <td><KbRowActions source={s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="axr-admin-card">
        <h2>{t.kb.tryTitle}</h2>
        <p style={{ fontSize: "0.8125rem", color: "var(--axr-text-helper)", marginTop: 0 }}>{t.kb.tryHint}</p>
        <div className="axr-assistant-inline">
          <AssistantChat />
        </div>
      </div>

      <div className="axr-admin-card">
        <h2>{t.kb.recentTitle}</h2>
        <table className="axr-admin-table">
          <thead>
            <tr>
              <th>{t.kb.colQuestion}</th>
              <th>{t.admin.colStudent}</th>
              <th>{t.kb.colAnswered}</th>
              <th>{t.kb.colDate}</th>
            </tr>
          </thead>
          <tbody>
            {latest.length === 0 ? <tr><td colSpan={4} style={muted}>{t.kb.noQuestions}</td></tr> : null}
            {latest.map((q) => (
              <tr key={q.id}>
                <td>{q.question}</td>
                <td>{author(q)}</td>
                <td>{q.answered ? "✓" : "—"}</td>
                <td>{date(q.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
