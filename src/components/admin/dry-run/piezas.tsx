"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  activarEnlace,
  cambiarEstado,
  crearEnlace,
  enviarPrueba,
  guardarCorreo,
  invitar,
  probarCorreo,
  procesarAhora,
  reenviarInvitacion,
} from "@/app/admin/dry-run/actions";
import { CANALES, PAQUETE_BASICO, proponer, slugPersona, type Canal, type Propuesta } from "@/components/admin/dry-run/canales";
import { urlDeEnlace } from "@/components/admin/dry-run/valores";
import type { DryRunCopy } from "@/lib/i18n/dry-run";
import { rellenar } from "@/lib/i18n/dry-run";
import type { EstadoInvitado } from "@/lib/dry-run/tipos";

// Las piezas con estado del panel de dry run: formularios pequeños y botones
// que llaman a una acción y enseñan qué ha pasado.

type Aviso = { ok: boolean; texto: string } | null;

function useAccion() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [aviso, setAviso] = useState<Aviso>(null);
  function correr(fn: () => Promise<Aviso>) {
    setAviso(null);
    startTransition(async () => {
      setAviso(await fn());
      router.refresh();
    });
  }
  return { pending, aviso, correr };
}

function Nota({ aviso }: { aviso: Aviso }) {
  return aviso ? <p className={`axr-adm-note axr-adm-note--${aviso.ok ? "ok" : "bad"}`}>{aviso.texto}</p> : null;
}

// ── Enlaces ──────────────────────────────────────────────

type EnlaceExistente = { source: string; medium: string; content: string | null };

/**
 * El generador de enlaces: se elige el canal y quién lo comparte, y todo lo
 * demás (nombre, UTM, ref) se rellena solo. Al crearlo, la URL se copia al
 * portapapeles. Las UTM se pueden retocar a mano en «Ajustar».
 */
export function FormEnlace({
  runId,
  slug,
  campana,
  persona: personaInicial,
  personas,
  existentes,
  copy,
}: {
  runId: string;
  slug: string;
  campana: string;
  /** Quien está en el panel: lo normal es que el enlace sea suyo. */
  persona: string;
  /** Nombres que ya comparten enlaces, para elegirlos sin escribir. */
  personas: string[];
  existentes: EnlaceExistente[];
  copy: DryRunCopy;
}) {
  const { pending, aviso, correr } = useAccion();
  const [canalId, setCanalId] = useState<string>(CANALES[0].id);
  const [persona, setPersona] = useState(personaInicial);
  const [manual, setManual] = useState<Partial<Propuesta>>({});
  const [creada, setCreada] = useState<{ url: string; copiada: boolean } | null>(null);

  const canal = CANALES.find((c) => c.id === canalId) ?? CANALES[0];
  const propuesta = { ...proponer(canal, persona, campana), ...manual };
  const yaExiste = (c: Canal) =>
    existentes.some((e) => e.source === c.source && e.medium === c.medium && (e.content ?? "") === slugPersona(persona));
  const vista = urlDeEnlace(slug, {
    code: propuesta.code || "…",
    utm_source: propuesta.source,
    utm_medium: propuesta.medium,
    utm_campaign: propuesta.campaign,
    utm_content: propuesta.content || null,
    utm_term: null,
  });

  async function crear(p: Propuesta): Promise<{ ok: boolean; url?: string; error?: string }> {
    const fd = new FormData();
    fd.set("label", p.label);
    fd.set("utm_source", p.source);
    fd.set("utm_medium", p.medium);
    fd.set("utm_campaign", p.campaign);
    fd.set("utm_content", p.content);
    fd.set("code", p.code);
    const r = await crearEnlace(runId, fd);
    return r.ok ? { ok: true, url: r.url } : { ok: false, error: r.error };
  }

  async function copiar(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }

  const campo = (k: keyof Propuesta, etiqueta: string) => (
    <div className="axr-form__row">
      <label htmlFor={`l-${k}`}>{etiqueta}</label>
      <input
        id={`l-${k}`}
        value={propuesta[k]}
        onChange={(e) => setManual((m) => ({ ...m, [k]: e.target.value }))}
        maxLength={k === "code" ? 40 : 80}
      />
    </div>
  );

  return (
    <div className="axr-dra-linkform">
      <h3 className="axr-dra-linkform__title">{copy.lNew}</h3>

      <div className="axr-dra-linkform__step">
        <span>1</span>
        <div>
          <strong>{copy.lChannel}</strong>
          <div className="axr-dra-chips" role="radiogroup" aria-label={copy.lChannel}>
            {CANALES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={c.id === canalId}
                className={`axr-dra-chip${c.id === canalId ? " is-on" : ""}`}
                onClick={() => {
                  setCanalId(c.id);
                  setManual({});
                  setCreada(null);
                }}
              >
                {c.nombre}
                {yaExiste(c) ? <small> ✓</small> : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="axr-dra-linkform__step">
        <span>2</span>
        <div>
          <label htmlFor="l-persona">
            <strong>{copy.lWho}</strong>
          </label>
          <input
            id="l-persona"
            className="axr-dra-linkform__who"
            value={persona}
            list="dr-personas"
            placeholder={copy.lWhoPh}
            onChange={(e) => {
              setPersona(e.target.value);
              setManual({});
              setCreada(null);
            }}
          />
          <datalist id="dr-personas">
            {personas.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <small className="axr-dra-sub">{copy.lWhoHint}</small>
        </div>
      </div>

      <div className="axr-dra-linkform__preview">
        <strong>{propuesta.label}</strong>
        <code>{vista.replace(/^https:\/\//, "")}</code>
        {yaExiste(canal) ? <small className="axr-dra-sub">{copy.lExists}</small> : null}
      </div>

      <details className="axr-dra-linkform__adjust">
        <summary>{copy.lAdjust}</summary>
        <div className="axr-dra-linkform__grid">
          {campo("label", copy.lLabel)}
          {campo("source", copy.lSource)}
          {campo("medium", copy.lMedium)}
          {campo("campaign", copy.lCampaign)}
          {campo("content", copy.lContent)}
          {campo("code", copy.lCode)}
        </div>
      </details>

      <Nota aviso={aviso} />
      {creada ? (
        <p className="axr-dra-linkform__done">
          {creada.copiada ? copy.lDoneCopied : copy.lDone} <code>{creada.url.replace(/^https:\/\//, "")}</code>
          {creada.copiada ? null : <Copiar texto={creada.url} copy={copy} />}
        </p>
      ) : null}

      <div className="axr-form__actions">
        <button
          type="button"
          className="axr-btn"
          disabled={pending || !propuesta.label.trim() || !propuesta.source.trim() || !propuesta.medium.trim()}
          onClick={() =>
            correr(async () => {
              const r = await crear(propuesta);
              if (!r.ok || !r.url) return { ok: false, texto: r.error ?? "Error" };
              setCreada({ url: r.url, copiada: await copiar(r.url) });
              setManual({});
              return null;
            })
          }
        >
          {copy.lAdd}
        </button>
        <button
          type="button"
          className="axr-btn axr-btn--ghost"
          disabled={pending}
          onClick={() =>
            correr(async () => {
              const faltan = PAQUETE_BASICO.map((id) => CANALES.find((c) => c.id === id)!).filter((c) => !yaExiste(c));
              if (!faltan.length) return { ok: true, texto: copy.lPackNone };
              for (const c of faltan) {
                const r = await crear(proponer(c, persona, campana));
                if (!r.ok) return { ok: false, texto: r.error ?? "Error" };
              }
              setCreada(null);
              return { ok: true, texto: rellenar(copy.lPackDone, { n: faltan.length }) };
            })
          }
        >
          {copy.lPack}
        </button>
      </div>
    </div>
  );
}

export function Copiar({ texto, copy }: { texto: string; copy: DryRunCopy }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="axr-btn axr-btn--ghost axr-btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto);
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        } catch {
          /* sin permiso de portapapeles: se copia a mano */
        }
      }}
    >
      {ok ? copy.lCopied : copy.lCopy}
    </button>
  );
}

export function BotonEnlace({ runId, linkId, active, copy }: { runId: string; linkId: string; active: boolean; copy: DryRunCopy }) {
  const { pending, correr } = useAccion();
  return (
    <button
      type="button"
      className="axr-btn axr-btn--ghost axr-btn--small"
      disabled={pending}
      onClick={() =>
        correr(async () => {
          const r = await activarEnlace(runId, linkId, !active);
          return r.ok ? null : { ok: false, texto: r.error };
        })
      }
    >
      {active ? copy.lDisable : copy.lEnable}
    </button>
  );
}

// ── Invitar ──────────────────────────────────────────────

export function FormInvitar({ runId, enlaces, copy }: { runId: string; enlaces: { id: string; label: string }[]; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  const [clave, setClave] = useState(0);
  return (
    <form
      key={clave}
      className="axr-form"
      action={(fd) =>
        correr(async () => {
          const r = await invitar(runId, fd);
          if (!r.ok) return { ok: false, texto: r.error };
          setClave((k) => k + 1);
          return { ok: true, texto: [rellenar(copy.inviteDone, { n: r.nuevas }), r.repetidas ? rellenar(copy.inviteSkipped, { n: r.repetidas }) : ""].join(" ") };
        })
      }
    >
      <div className="axr-form__row">
        <textarea name="personas" rows={6} placeholder={"Ana Pérez <ana@correo.com>\nluis@empresa.com"} required />
      </div>
      <div className="axr-form__row">
        <label htmlFor="inv-link">{copy.inviteLink}</label>
        <select id="inv-link" name="link_id" defaultValue="">
          <option value="">{copy.inviteLinkNone}</option>
          {enlaces.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <Nota aviso={aviso} />
      <div className="axr-form__actions">
        <button type="submit" className="axr-btn" disabled={pending}>
          {copy.inviteSend}
        </button>
      </div>
    </form>
  );
}

// ── Personas ─────────────────────────────────────────────

const ESTADOS: EstadoInvitado[] = ["invitado", "registrado", "asistio", "no_asistio", "baja"];

export function AccionesPersona({ guestId, status, conCuenta, copy }: { guestId: string; status: EstadoInvitado; conCuenta: boolean; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  return (
    <div className="axr-dra-person">
      <select
        aria-label={copy.pStatus}
        value={status}
        disabled={pending}
        onChange={(e) => {
          const nuevo = e.target.value as EstadoInvitado;
          correr(async () => {
            const r = await cambiarEstado(guestId, nuevo);
            return r.ok ? null : { ok: false, texto: r.error };
          });
        }}
      >
        {ESTADOS.filter((s) => s !== "invitado" || status === "invitado" || !conCuenta).map((s) => (
          <option key={s} value={s}>
            {copy.statuses[s]}
          </option>
        ))}
      </select>
      {status === "invitado" ? (
        <button
          type="button"
          className="axr-btn axr-btn--ghost axr-btn--small"
          disabled={pending}
          onClick={() =>
            correr(async () => {
              const r = await reenviarInvitacion(guestId);
              return r.ok ? { ok: true, texto: "✓" } : { ok: false, texto: r.error };
            })
          }
        >
          {copy.pResend}
        </button>
      ) : null}
      <Nota aviso={aviso} />
    </div>
  );
}

// ── Correos ──────────────────────────────────────────────

export function BotonPrueba({ runId, kind, copy }: { runId: string; kind: string; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  return (
    <span className="axr-dra-test">
      <button
        type="button"
        className="axr-btn axr-btn--ghost axr-btn--small"
        disabled={pending}
        onClick={() =>
          correr(async () => {
            const r = await enviarPrueba(runId, kind);
            return r.ok ? { ok: true, texto: rellenar(copy.eTestSent, { n: r.a }) } : { ok: false, texto: r.error };
          })
        }
      >
        {copy.eTest}
      </button>
      <Nota aviso={aviso} />
    </span>
  );
}

export function BotonProcesar({ runId, copy }: { runId: string; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  return (
    <div className="axr-dra-run">
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        disabled={pending}
        onClick={() =>
          correr(async () => {
            const r = await procesarAhora(runId);
            return r.ok ? { ok: true, texto: rellenar(copy.eRunDone, { a: r.enviados, b: r.omitidos, c: r.errores }) } : { ok: false, texto: r.error };
          })
        }
      >
        {copy.eRun}
      </button>
      <Nota aviso={aviso} />
    </div>
  );
}

// ── Cuenta de envío ──────────────────────────────────────

export type CorreoPublico = {
  enabled: boolean;
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  from_name: string;
  from_email: string;
  reply_to: string;
  passHint: string | null;
};

export function FormCorreo({ ajustes, copy }: { ajustes: CorreoPublico; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  return (
    <form
      className="axr-form"
      action={(fd) =>
        correr(async () => {
          const r = await guardarCorreo(fd);
          return r.ok ? { ok: true, texto: copy.saved } : { ok: false, texto: r.error };
        })
      }
    >
      <label className="axr-ia-switch">
        <input type="checkbox" name="enabled" defaultChecked={ajustes.enabled} />
        <span className="axr-ia-switch__track" aria-hidden />
        <span>
          <strong>{copy.mEnabled}</strong>
        </span>
      </label>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="m-user">{copy.mUser}</label>
          <input id="m-user" name="smtp_user" type="email" defaultValue={ajustes.smtp_user} placeholder="admin@activexremote.com" autoComplete="off" />
        </div>
        <div className="axr-form__row">
          <label htmlFor="m-pass">{copy.mPass}</label>
          <input id="m-pass" name="smtp_pass" type="password" autoComplete="new-password" spellCheck={false} placeholder="xxxx xxxx xxxx xxxx" />
          <small>{ajustes.passHint ? rellenar(copy.mPassSaved, { n: ajustes.passHint }) : copy.mPassNone}</small>
        </div>
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="m-from-name">{copy.mFromName}</label>
          <input id="m-from-name" name="from_name" defaultValue={ajustes.from_name} />
        </div>
        <div className="axr-form__row">
          <label htmlFor="m-from">{copy.mFromEmail}</label>
          <input id="m-from" name="from_email" type="email" defaultValue={ajustes.from_email} />
          <small>{copy.mFromHint}</small>
        </div>
      </div>
      <div className="axr-form__cols">
        <div className="axr-form__row">
          <label htmlFor="m-host">{copy.mHost}</label>
          <input id="m-host" name="smtp_host" defaultValue={ajustes.smtp_host} />
        </div>
        <div className="axr-form__row">
          <label htmlFor="m-port">{copy.mPort}</label>
          <input id="m-port" name="smtp_port" type="number" defaultValue={ajustes.smtp_port} />
        </div>
      </div>
      <div className="axr-form__row">
        <label htmlFor="m-reply">{copy.mReplyTo}</label>
        <input id="m-reply" name="reply_to" type="email" defaultValue={ajustes.reply_to} />
      </div>
      <Nota aviso={aviso} />
      <div className="axr-form__actions">
        <button
          type="button"
          className="axr-btn axr-btn--ghost"
          disabled={pending}
          onClick={() =>
            correr(async () => {
              const r = await probarCorreo();
              return r.ok ? { ok: true, texto: rellenar(copy.eTestSent, { n: r.a }) } : { ok: false, texto: r.error };
            })
          }
        >
          {copy.mTest}
        </button>
        <button type="submit" className="axr-btn" disabled={pending}>
          {copy.save}
        </button>
      </div>
    </form>
  );
}
