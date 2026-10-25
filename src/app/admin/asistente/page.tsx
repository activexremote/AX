import { FaqLista } from "@/components/admin/faq-lista";
import { KbQuestionActions, KbRowActions, KbSourceButton } from "@/components/admin/kb-source-editor";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { AssistantChat } from "@/components/campus/assistant-chat";
import { adminCCopy } from "@/lib/i18n/admin-v2-c";
import { fill } from "@/lib/i18n/publicaciones";
import { getI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";
import type { AssistantQuestion, KbSource } from "@/lib/supabase/types";
import "./asistente.scss";

// ══════════════════════════════════════════════════════════
//  Asistente del campus
//
//  Arriba, lo que pide trabajo: las preguntas que el chat no supo contestar,
//  como una bandeja (cada una es una FAQ que falta). Después, lo que el chat
//  sabe (FAQs y documentos) y, al final, dónde probarlo y lo último que se
//  ha preguntado.
// ══════════════════════════════════════════════════════════

export default async function AdminAssistantPage() {
  const supabase = await createClient();
  const { t, locale } = await getI18n();
  const c = adminCCopy[locale].asistente;

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

  return (
    <div className="axr-admin-page">
      <div className="axr-admin-page__header">
        <div>
          <h1>{t.kb.title}</h1>
          <p>{t.kb.subtitle}</p>
        </div>
        <div>
          <KbSourceButton kind="documento" label={t.kb.newDoc} variant="ghost" />
          <KbSourceButton kind="faq" label={`+ ${t.kb.newFaq}`} />
        </div>
      </div>

      <div className="axr-adm-stats">
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="chat" /> {t.kb.kpiFaqs}
          </span>
          <span className="axr-adm-stat__value">{faqs.length}</span>
          <span className="axr-adm-stat__hint">{fill(c.statActive, faqs.filter((f) => f.active).length)}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="libro" /> {t.kb.kpiDocs}
          </span>
          <span className="axr-adm-stat__value">{docs.length}</span>
          <span className="axr-adm-stat__hint">{fill(c.statActiveDocs, docs.filter((d) => d.active).length)}</span>
        </div>
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="capas" /> {t.kb.kpiChunks}
          </span>
          <span className="axr-adm-stat__value">{chunks}</span>
          <span className="axr-adm-stat__hint">{c.statIndexed}</span>
        </div>
        <a href="#bandeja" className={`axr-adm-stat${pending.length ? " axr-kb-stat--warn" : ""}`}>
          <span className="axr-adm-stat__label">
            <Icono n={pending.length ? "aviso" : "ok"} /> {t.kb.kpiUnanswered}
          </span>
          <span className="axr-adm-stat__value">{pending.length}</span>
          <span className="axr-adm-stat__hint">{c.statInbox}</span>
        </a>
      </div>

      {/* ── La bandeja ── */}
      <section id="bandeja" className="axr-admin-card">
        <h2>{c.inboxTitle}</h2>
        {pending.length ? (
          <>
            <p className="axr-kb-lead">{t.kb.unansweredHint}</p>
            <ul className="axr-kb-inbox">
              {pending.map((q) => (
                <li key={q.id}>
                  <span className="axr-kb-inbox__icon" aria-hidden>
                    <Icono n="chat" />
                  </span>
                  <div className="axr-kb-inbox__main">
                    <strong>{q.question}</strong>
                    <small>{c.askedBy.replace("{who}", author(q)).replace("{when}", date(q.created_at))}</small>
                    {q.answer ? (
                      <details>
                        <summary>{t.kb.botSaid}</summary>
                        <p>{q.answer}</p>
                      </details>
                    ) : null}
                  </div>
                  <KbQuestionActions id={q.id} question={q.question} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="axr-adm-empty">
            <Icono n="ok" size={26} />
            <span>{c.inboxEmpty}</span>
          </div>
        )}
      </section>

      {/* ── FAQs ── */}
      <section className="axr-admin-card">
        <div className="axr-kb-head">
          <h2>{t.kb.faqsTitle}</h2>
          <KbSourceButton kind="faq" label={`+ ${t.kb.newFaq}`} variant="ghost" small />
        </div>
        <FaqLista faqs={faqs} copy={c} allCourses={t.kb.allCourses} empty={t.kb.noFaqs} />
      </section>

      {/* ── Documentos ── */}
      <section className="axr-admin-card">
        <div className="axr-kb-head">
          <h2>{t.kb.docsTitle}</h2>
          <KbSourceButton kind="documento" label={`+ ${t.kb.newDoc}`} variant="ghost" small />
        </div>
        {docs.length ? (
          <ul className="axr-kb-list">
            {docs.map((s) => (
              <li key={s.id} className={s.active ? undefined : "is-off"}>
                <span className="axr-kb-doc" aria-hidden>
                  {(s.file_name?.split(".").pop() ?? "txt").slice(0, 4).toUpperCase()}
                </span>
                <div className="axr-kb-list__main">
                  <strong>{s.title}</strong>
                  {s.file_name ? <p>{s.file_name}</p> : null}
                  <div className="axr-kb-list__meta">
                    <span className={`axr-adm-pill${s.active ? " axr-adm-pill--ok" : ""}`}>{s.active ? c.activeDoc : c.inactiveDoc}</span>
                    <span className="axr-adm-pill">{s.course ?? t.kb.allCourses}</span>
                    <span className="axr-adm-pill axr-adm-pill--accent">{fill(c.chunks, s.chunks_count)}</span>
                  </div>
                </div>
                <KbRowActions source={s} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="axr-adm-empty">
            <Icono n="libro" size={26} />
            <span>{t.kb.noDocs}</span>
          </div>
        )}
      </section>

      <div className="axr-kb-grid">
        <section className="axr-admin-card">
          <h2>{t.kb.tryTitle}</h2>
          <p className="axr-kb-lead">{t.kb.tryHint}</p>
          <div className="axr-assistant-inline">
            <AssistantChat enfocar={false} />
          </div>
        </section>

        <section className="axr-admin-card">
          <h2>{t.kb.recentTitle}</h2>
          {latest.length ? (
            <ul className="axr-kb-recent">
              {latest.map((q) => (
                <li key={q.id}>
                  <div>
                    <span>{q.question}</span>
                    <small>
                      {author(q)} · {date(q.created_at)}
                    </small>
                  </div>
                  <span className={`axr-adm-pill axr-adm-pill--${q.answered ? "ok" : "warn"}`}>{q.answered ? c.answered : c.unanswered}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="axr-adm-empty">
              <Icono n="chat" size={26} />
              <span>{t.kb.noQuestions}</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
