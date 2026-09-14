"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { AssistantReply } from "@/lib/asistente/chat";
import { useI18n } from "@/lib/i18n/provider";
import "@/components/campus/assistant-chat.scss";

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; reply: AssistantReply };

/**
 * La conversación con el asistente del campus.
 *
 * Cada pregunta se busca por separado en el material del equipo: no hay IA
 * que recuerde el hilo. Vive sólo en el navegador —al recargar se empieza de
 * cero—; lo que se pregunta sí queda en el servidor para el equipo.
 */
export function AssistantChat({ onClose }: { onClose?: () => void }) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages, busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const history: Message[] = [...messages, { role: "user", content: question }];
    setMessages(history);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await res.json().catch(() => null)) as (AssistantReply & { error?: string }) | null;
      if (!res.ok || !data) {
        throw new Error(res.status === 429 && data?.error ? data.error : t.assistant.error);
      }
      setMessages([...history, { role: "assistant", reply: data }]);
    } catch (e) {
      // La pregunta se queda en el hilo; el error se enseña debajo.
      setError(e instanceof Error ? e.message : t.assistant.error);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section className="axr-assistant" aria-label={t.assistant.title}>
      <header className="axr-assistant__head">
        <div>
          <strong>{t.assistant.title}</strong>
          <span>{t.assistant.subtitle}</span>
        </div>
        <div className="axr-assistant__head-actions">
          {messages.length > 0 ? (
            <button type="button" onClick={() => { setMessages([]); setError(null); }} disabled={busy}>
              {t.assistant.reset}
            </button>
          ) : null}
          {onClose ? (
            <button type="button" onClick={onClose} aria-label={t.assistant.close}>✕</button>
          ) : null}
        </div>
      </header>

      <div className="axr-assistant__log" ref={scroller} aria-live="polite">
        <div className="axr-assistant__msg axr-assistant__msg--assistant">{t.assistant.welcome}</div>

        {messages.length === 0 ? (
          <div className="axr-assistant__suggestions">
            {t.assistant.suggestions.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        ) : null}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="axr-assistant__msg axr-assistant__msg--user">{m.content}</div>
          ) : (
            <div key={i} className="axr-assistant__reply">
              <div className="axr-assistant__msg axr-assistant__msg--assistant">
                {m.reply.answer ? (
                  <>
                    {m.reply.answer.kind === "documento" ? (
                      <span className="axr-assistant__source">{m.reply.answer.heading}</span>
                    ) : null}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{ a: (props) => <a {...props} target="_blank" rel="noreferrer" /> }}
                    >
                      {m.reply.answer.content}
                    </ReactMarkdown>
                  </>
                ) : (
                  <p>{m.reply.related.length > 0 ? t.assistant.noAnswerMaybe : t.assistant.noAnswer}</p>
                )}
              </div>
              {m.reply.related.length > 0 ? (
                <div className="axr-assistant__suggestions">
                  {m.reply.answer ? <span className="axr-assistant__related">{t.assistant.related}</span> : null}
                  {m.reply.related.map((q) => (
                    <button key={q} type="button" onClick={() => send(q)} disabled={busy}>{q}</button>
                  ))}
                </div>
              ) : null}
            </div>
          ),
        )}

        {busy ? <div className="axr-assistant__msg axr-assistant__msg--assistant is-thinking">{t.assistant.thinking}</div> : null}
        {error ? <div className="axr-assistant__error">{error}</div> : null}
      </div>

      <form
        className="axr-assistant__form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          rows={1}
          maxLength={2000}
          placeholder={t.assistant.placeholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send(input);
            }
          }}
        />
        <button type="submit" disabled={busy || !input.trim()}>
          {t.assistant.send}
        </button>
      </form>
      <p className="axr-assistant__disclaimer">{t.assistant.disclaimer}</p>
    </section>
  );
}

/** Botón flotante del campus que abre el chat. */
export function AssistantWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  // Una vez abierto se queda montado: cerrar el panel no puede borrar la
  // conversación, ni cortar una respuesta que todavía está llegando.
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="axr-assistant-widget">
      {started ? (
        <div className="axr-assistant-widget__panel" hidden={!open}>
          <AssistantChat onClose={() => setOpen(false)} />
        </div>
      ) : null}
      {!open ? (
        <button
          type="button"
          className="axr-assistant-widget__launcher"
          onClick={() => {
            setStarted(true);
            setOpen(true);
          }}
        >
          <span aria-hidden="true">?</span>
          {t.assistant.open}
        </button>
      ) : null}
    </div>
  );
}
