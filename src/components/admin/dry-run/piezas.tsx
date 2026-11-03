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

export function FormEnlace({ runId, campana, copy }: { runId: string; campana: string; copy: DryRunCopy }) {
  const { pending, aviso, correr } = useAccion();
  const [clave, setClave] = useState(0);
  return (
    <form
      key={clave}
      className="axr-form axr-dra-linkform"
      action={(fd) =>
        correr(async () => {
          const r = await crearEnlace(runId, fd);
          if (r.ok) setClave((k) => k + 1);
          return r.ok ? null : { ok: false, texto: r.error };
        })
      }
    >
      <div className="axr-dra-linkform__grid">
        <div className="axr-form__row">
          <label htmlFor="l-label">{copy.lLabel}</label>
          <input id="l-label" name="label" placeholder={copy.lLabelPh} required maxLength={80} />
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-source">{copy.lSource}</label>
          <input id="l-source" name="utm_source" placeholder="linkedin" required list="dr-sources" />
          <datalist id="dr-sources">
            {["linkedin", "whatsapp", "instagram", "email", "newsletter", "slack", "telegram", "x", "facebook"].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-medium">{copy.lMedium}</label>
          <input id="l-medium" name="utm_medium" placeholder="social" required list="dr-mediums" />
          <datalist id="dr-mediums">
            {["social", "mensaje", "email", "referido", "organico", "paid_social"].map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-campaign">{copy.lCampaign}</label>
          <input id="l-campaign" name="utm_campaign" placeholder={campana} />
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-content">{copy.lContent}</label>
          <input id="l-content" name="utm_content" placeholder="post_1" />
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-term">{copy.lTerm}</label>
          <input id="l-term" name="utm_term" />
        </div>
        <div className="axr-form__row">
          <label htmlFor="l-code">{copy.lCode}</label>
          <input id="l-code" name="code" placeholder="linkedin-oriol" />
          <small>{copy.lCodeHint}</small>
        </div>
      </div>
      <Nota aviso={aviso} />
      <div className="axr-form__actions">
        <button type="submit" className="axr-btn" disabled={pending}>
          {copy.lAdd}
        </button>
      </div>
    </form>
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
