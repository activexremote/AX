"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { actualizarLead, apuntarContacto } from "@/app/admin/comercial/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { PLANTILLAS, rellenarPlantilla, type MarcaPlantilla } from "@/lib/comercial/plantillas";
import { TIPOS_CONTACTO, type EventoLead, type Lead, type TipoContacto } from "@/lib/comercial/tipos";
import type { ComercialCopy } from "@/lib/i18n/comercial";
import { rellenar } from "@/lib/i18n/dry-run";

// ══════════════════════════════════════════════════════════
//  Las piezas de la ficha de un lead
// ══════════════════════════════════════════════════════════

type C = ComercialCopy;

// ── Seguimiento: próxima acción, objeción y notas ─────────

export function Seguimiento({ lead, c }: { lead: Lead; c: C }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [estado, setEstado] = useState<{ ok: boolean; texto: string } | null>(null);

  return (
    <form
      className="axr-com-form"
      // La clave rehace el formulario con lo guardado cuando el servidor responde.
      key={`${lead.next_action}|${lead.next_action_at}|${lead.objection}|${lead.notes}`}
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        startTransition(async () => {
          const r = await actualizarLead(lead.id, {
            next_action: String(f.get("next_action") ?? ""),
            next_action_at: String(f.get("next_action_at") ?? ""),
            objection: String(f.get("objection") ?? ""),
            notes: String(f.get("notes") ?? ""),
          });
          setEstado(r.ok ? { ok: true, texto: c.saved } : { ok: false, texto: r.error });
          if (r.ok) router.refresh();
        });
      }}
      onChange={() => setEstado(null)}
    >
      <div className="axr-com-row2 axr-com-row2--next">
        <label>
          <span>{c.fNext}</span>
          <input name="next_action" defaultValue={lead.next_action ?? ""} placeholder={c.fNextPh} maxLength={200} />
        </label>
        <label>
          <span>{c.fNextAt}</span>
          <input name="next_action_at" type="date" defaultValue={lead.next_action_at ?? ""} />
        </label>
      </div>
      <label>
        <span>{c.fObjection}</span>
        <input name="objection" defaultValue={lead.objection ?? ""} placeholder={c.fObjectionPh} maxLength={200} />
      </label>
      <label>
        <span>{c.fNotes}</span>
        <textarea name="notes" rows={5} defaultValue={lead.notes ?? ""} placeholder={c.fNotesPh} maxLength={4000} />
      </label>
      <div className="axr-com-actions">
        <button type="submit" className="axr-btn" disabled={pending}>
          {c.save}
        </button>
        {estado ? (
          <span role="status" className={estado.ok ? "axr-com-ok" : "axr-com-err"}>
            {estado.texto}
          </span>
        ) : null}
      </div>
    </form>
  );
}

// ── Apuntar un contacto ──────────────────────────────────

export function NuevoContacto({ leadId, c }: { leadId: string; c: C }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tipo, setTipo] = useState<TipoContacto>("llamada");
  const [texto, setTexto] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="axr-com-form"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const r = await apuntarContacto(leadId, tipo, texto);
          if (r.ok) {
            setTexto("");
            setError(null);
            router.refresh();
          } else setError(r.error);
        });
      }}
    >
      <div className="axr-com-chips" role="radiogroup" aria-label={c.log}>
        {TIPOS_CONTACTO.map((k) => (
          <button key={k} type="button" role="radio" aria-checked={tipo === k} className={`axr-com-chip${tipo === k ? " is-on" : ""}`} onClick={() => setTipo(k)}>
            {c.logKinds[k]}
          </button>
        ))}
      </div>
      <textarea rows={3} value={texto} onChange={(e) => setTexto(e.currentTarget.value)} placeholder={c.logPh} aria-label={c.logPh} maxLength={4000} />
      <div className="axr-com-actions">
        <button type="submit" className="axr-btn" disabled={pending || !texto.trim()}>
          {c.logSave}
        </button>
        {error ? (
          <span role="alert" className="axr-com-err">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  );
}

// ── Historial ────────────────────────────────────────────

const ICONO: Record<EventoLead["kind"], "telefono" | "chat" | "correo" | "usuarios" | "manual" | "flecha"> = {
  llamada: "telefono",
  whatsapp: "chat",
  email: "correo",
  reunion: "usuarios",
  nota: "manual",
  estado: "flecha",
};

export function Historial({ eventos, c }: { eventos: (EventoLead & { quien: string; cuando: string })[]; c: C }) {
  if (!eventos.length) return <p className="axr-com-muted">{c.noHistory}</p>;
  return (
    <ol className="axr-com-history">
      {eventos.map((e) => (
        <li key={e.id} data-kind={e.kind}>
          <span className="axr-com-history__icon" aria-hidden>
            <Icono n={ICONO[e.kind]} size={14} />
          </span>
          <div>
            <p className="axr-com-history__meta">
              <strong>{e.kind === "estado" ? rellenar(c.changed, { a: e.from_status ? c.status[e.from_status] : "—", b: e.to_status ? c.status[e.to_status] : "—" }) : c.logKinds[e.kind]}</strong>
              <span>
                {e.cuando}
                {e.quien ? ` · ${e.quien}` : ""}
              </span>
            </p>
            {e.body ? <p className="axr-com-history__body">{e.body}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Mensajes del playbook ────────────────────────────────

export function Mensajes({
  leadId,
  email,
  whatsapp,
  valores,
  c,
}: {
  leadId: string;
  email: string;
  whatsapp: string | null;
  valores: Partial<Record<MarcaPlantilla, string>>;
  c: C;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState<string | null>(PLANTILLAS[0].id);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Abrir el mensaje en WhatsApp o en el correo ya cuenta como contacto.
  const apuntar = (tipo: "whatsapp" | "email", titulo: string) =>
    startTransition(async () => {
      const r = await apuntarContacto(leadId, tipo, `Mensaje enviado: «${titulo}»`);
      if (r.ok) router.refresh();
    });

  return (
    <div className="axr-com-msgs">
      {PLANTILLAS.map((p) => {
        const texto = rellenarPlantilla(p.texto, valores);
        const asunto = p.asunto ? rellenarPlantilla(p.asunto, valores) : "ActiveXRemote";
        const abiertoAqui = abierto === p.id;
        return (
          <div key={p.id} className={`axr-com-msg${abiertoAqui ? " is-open" : ""}`}>
            <button type="button" className="axr-com-msg__head" aria-expanded={abiertoAqui} onClick={() => setAbierto(abiertoAqui ? null : p.id)}>
              <span>
                <strong>{p.titulo}</strong>
                <small>{p.cuando}</small>
              </span>
              <Icono n={p.canal === "whatsapp" ? "chat" : "correo"} size={16} />
            </button>
            {abiertoAqui ? (
              <>
                <pre className="axr-com-msg__text">{texto}</pre>
                <div className="axr-com-actions">
                  <button
                    type="button"
                    className="axr-btn axr-btn--ghost axr-btn--small"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(p.asunto ? `${asunto}\n\n${texto}` : texto);
                        setCopiado(p.id);
                        setTimeout(() => setCopiado(null), 1800);
                      } catch {
                        setCopiado(null);
                      }
                    }}
                  >
                    {copiado === p.id ? c.copied : c.copy}
                  </button>
                  {p.canal === "whatsapp" && whatsapp ? (
                    <a
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(texto)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="axr-btn axr-btn--small"
                      onClick={() => apuntar("whatsapp", p.titulo)}
                    >
                      {c.openWa}
                    </a>
                  ) : null}
                  {p.canal === "email" ? (
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`}
                      className="axr-btn axr-btn--small"
                      onClick={() => apuntar("email", p.titulo)}
                    >
                      {c.openMail}
                    </a>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
