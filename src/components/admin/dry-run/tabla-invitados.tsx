"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  actualizarInvitado,
  cambiarEstado,
  cambiarSeguimiento,
  crearInvitado,
  eliminarInvitado,
  guardarMensaje,
  importarInvitados,
  marcarCompartido,
} from "@/app/admin/dry-run/actions";
import {
  componerMensaje,
  enlacePersonal,
  MARCAS,
  MENSAJE_POR_DEFECTO,
  telefonoWhatsApp,
  urlCorreo,
  urlWhatsApp,
  type DatosMensaje,
  type Via,
} from "@/components/admin/dry-run/mensaje";
import type { DryRunCopy } from "@/lib/i18n/dry-run";
import { rellenar } from "@/lib/i18n/dry-run";
import { idInvitado, SEGUIMIENTOS, type DryRunGuest, type Seguimiento } from "@/lib/dry-run/tipos";

// ══════════════════════════════════════════════════════════
//  La tabla de invitados del dry run
//
//  La hoja de cálculo del equipo, dentro del panel: cada celda se edita en
//  su sitio y se guarda al salir de ella, el estado es un desplegable y cada
//  fila lleva su invitación lista para copiar o abrir en WhatsApp o en el
//  correo, con su enlace personal. La conversión de ese enlace (enviada,
//  abierta, plaza, preparación, opinión) se ve en la misma fila.
// ══════════════════════════════════════════════════════════

type T = DryRunCopy["t"];

export type FilaInvitado = Pick<
  DryRunGuest,
  | "id"
  | "seq"
  | "token"
  | "full_name"
  | "email"
  | "phone"
  | "country"
  | "inviter"
  | "profile"
  | "notes"
  | "tracking"
  | "status"
  | "user_id"
  | "visits"
  | "last_visit_at"
  | "shared_at"
  | "shared_via"
  | "registered_at"
  | "unsubscribed_at"
> & {
  prep: number | null;
  nps: number | null;
};

type Campo = "full_name" | "email" | "phone" | "country" | "inviter" | "profile" | "notes";

const CUANDO = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const cuando = (iso: string | null) => (iso ? CUANDO.format(new Date(iso)) : "");

async function alPortapapeles(texto: string) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}

// ── Una celda editable ───────────────────────────────────

function Celda({
  fila,
  campo,
  t,
  tipo = "text",
  lista,
  placeholder,
  multilinea,
}: {
  fila: FilaInvitado;
  campo: Campo;
  t: T;
  tipo?: "text" | "email" | "tel";
  lista?: string;
  placeholder?: string;
  multilinea?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const valor = fila[campo] ?? "";
  // La clave reinicia el campo cuando llega el valor guardado del servidor.
  const clave = `${fila.id}-${campo}-${valor}`;

  function guardar(el: HTMLInputElement | HTMLTextAreaElement) {
    const nuevo = el.value.trim();
    if (nuevo === valor) return setError(null);
    startTransition(async () => {
      const r = await actualizarInvitado(fila.id, campo, nuevo);
      if (r.ok) {
        setError(null);
        router.refresh();
      } else {
        setError(r.error);
      }
    });
  }

  const comun = {
    defaultValue: valor,
    placeholder: placeholder ?? "—",
    "aria-label": t.cols[campo === "full_name" ? "name" : campo],
    "aria-invalid": error ? true : undefined,
    title: error ?? (valor || undefined),
    disabled: pending,
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => guardar(e.currentTarget),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.currentTarget.value = valor;
        setError(null);
        e.currentTarget.blur();
      } else if (e.key === "Enter" && (!multilinea || e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        e.currentTarget.blur();
      }
    },
  };

  return (
    <div className={`axr-dri-cell${error ? " is-bad" : ""}${pending ? " is-saving" : ""}`}>
      {multilinea ? <textarea key={clave} rows={1} {...comun} /> : <input key={clave} type={tipo} list={lista} {...comun} />}
      {error ? <small role="alert">{error}</small> : null}
    </div>
  );
}

// ── El estado ────────────────────────────────────────────

function Estado({ fila, t }: { fila: FilaInvitado; t: T }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimista, setOptimista] = useState<Seguimiento | null>(null);
  const actual = optimista ?? fila.tracking;
  return (
    <select
      className="axr-dri-status"
      data-tone={actual}
      value={actual}
      disabled={pending}
      aria-label={t.cols.status}
      onChange={(e) => {
        const nuevo = e.target.value as Seguimiento;
        setOptimista(nuevo);
        startTransition(async () => {
          await cambiarSeguimiento(fila.id, nuevo);
          router.refresh();
          setOptimista(null);
        });
      }}
    >
      {SEGUIMIENTOS.map((s) => (
        <option key={s} value={s}>
          {t.tracking[s]}
        </option>
      ))}
    </select>
  );
}

// ── La conversión de su enlace ───────────────────────────

function Conversion({ fila, t, pasos }: { fila: FilaInvitado; t: T; pasos: number }) {
  const conPlaza = Boolean(fila.registered_at && fila.user_id && fila.status !== "baja");
  const etapas = [
    { k: "shared", on: Boolean(fila.shared_at) || fila.visits > 0 || conPlaza, label: t.steps.shared },
    { k: "opened", on: fila.visits > 0 || conPlaza, label: t.steps.opened },
    { k: "seat", on: conPlaza, label: t.steps.seat },
    { k: "prep", on: conPlaza && fila.prep !== null && fila.prep >= pasos, part: conPlaza && (fila.prep ?? 0) > 0, label: t.steps.prep },
    { k: "feedback", on: fila.nps !== null, label: t.steps.feedback },
  ];

  const texto =
    fila.nps !== null
      ? rellenar(t.stage.feedback, { n: fila.nps })
      : conPlaza && (fila.prep ?? 0) > 0
        ? rellenar(t.stage.prep, { a: fila.prep ?? 0, b: pasos })
        : conPlaza
          ? rellenar(t.stage.seat, { cuando: cuando(fila.registered_at) })
          : fila.visits > 0
            ? rellenar(t.stage.opened, { n: fila.visits, cuando: cuando(fila.last_visit_at) })
            : fila.shared_at
              ? rellenar(t.stage.shared, { via: t.via[fila.shared_via ?? "directo"] ?? fila.shared_via ?? "", cuando: cuando(fila.shared_at) })
              : t.stage.none;

  return (
    <div className="axr-dri-funnel">
      <ol aria-label={t.cols.funnel}>
        {etapas.map((e) => (
          <li key={e.k} data-on={e.on ? "si" : e.part ? "parte" : "no"} title={e.label}>
            <span className="axr-dri-sr">
              {e.label}: {e.on ? "✓" : "—"}
            </span>
          </li>
        ))}
      </ol>
      <small>
        {texto}
        {fila.unsubscribed_at ? ` · ${t.stage.unsub}` : ""}
      </small>
    </div>
  );
}

// ── Mandar la invitación ─────────────────────────────────

const WA = "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z";
const SOBRE = "M3 5.5h18v13H3zM3.5 6l8.5 7 8.5-7";

function Enviar({ fila, t, datos, plantilla }: { fila: FilaInvitado; t: T; datos: DatosMensaje; plantilla: string | null }) {
  const router = useRouter();
  const [hecho, setHecho] = useState<string | null>(null);
  const [seguro, setSeguro] = useState(false);
  const [pending, startTransition] = useTransition();
  const menu = useRef<HTMLDetailsElement>(null);
  const tel = telefonoWhatsApp(fila.phone);
  const mensaje = (via: Via) => componerMensaje(plantilla, datos, fila, via);

  function marcar(via: Via) {
    startTransition(async () => {
      await marcarCompartido(fila.id, via);
      router.refresh();
    });
  }
  function aviso(texto: string) {
    setHecho(texto);
    setTimeout(() => setHecho(null), 1800);
  }

  return (
    <div className="axr-dri-send">
      <button
        type="button"
        className="axr-btn axr-btn--small"
        onClick={async () => {
          if (await alPortapapeles(mensaje("directo"))) {
            aviso(t.copied);
            marcar("directo");
          }
        }}
      >
        {hecho ?? t.copyInvite}
      </button>
      {tel ? (
        <a
          className="axr-dri-icon axr-dri-icon--wa"
          href={urlWhatsApp(tel, mensaje("whatsapp"))}
          target="_blank"
          rel="noreferrer"
          title={t.whatsapp}
          aria-label={t.whatsapp}
          onClick={() => marcar("whatsapp")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d={WA} />
          </svg>
        </a>
      ) : (
        <span className="axr-dri-icon is-off" title={t.noPhone} aria-hidden>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d={WA} />
          </svg>
        </span>
      )}
      {fila.email ? (
        <a
          className="axr-dri-icon"
          href={urlCorreo(fila.email, t.msgSubject, mensaje("email"))}
          title={t.email}
          aria-label={t.email}
          onClick={() => marcar("email")}
        >
          <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={SOBRE} />
          </svg>
        </a>
      ) : (
        <span className="axr-dri-icon is-off" title={t.noEmail} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d={SOBRE} />
          </svg>
        </span>
      )}
      <details className="axr-dri-more" ref={menu} onToggle={(e) => !e.currentTarget.open && setSeguro(false)}>
        <summary aria-label={t.more} title={t.more}>
          ⋯
        </summary>
        <div role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              if (await alPortapapeles(enlacePersonal(datos.slug, fila, "directo"))) {
                aviso(t.linkCopied);
                marcar("directo");
              }
              if (menu.current) menu.current.open = false;
            }}
          >
            {t.copyLink}
          </button>
          {fila.user_id && fila.status !== "baja" ? (
            <button
              type="button"
              role="menuitem"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await cambiarEstado(fila.id, "baja");
                  router.refresh();
                })
              }
            >
              {t.unseat}
            </button>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className="is-danger"
            disabled={pending}
            onClick={() => {
              if (!seguro) return setSeguro(true);
              startTransition(async () => {
                await eliminarInvitado(fila.id);
                router.refresh();
              });
            }}
          >
            {seguro ? t.removeSure : t.remove}
          </button>
        </div>
      </details>
    </div>
  );
}

// ── Añadir una fila ──────────────────────────────────────

function FilaNueva({ runId, t, yo, columnas }: { runId: string; t: T; yo: string; columnas: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [clave, setClave] = useState(0);
  const form = `dri-new-${runId}`;

  return (
    <tr className="axr-dri-new">
      <td>
        <form
          id={form}
          action={(fd) =>
            startTransition(async () => {
              const r = await crearInvitado(runId, Object.fromEntries([...fd.entries()].map(([k, v]) => [k, String(v)])));
              if (!r.ok) return setError(r.error);
              setError(null);
              setClave((k) => k + 1);
              router.refresh();
              requestAnimationFrame(() => document.getElementById(`${form}-name`)?.focus());
            })
          }
        />
        <span className="axr-dri-id">+</span>
      </td>
      <td className="axr-dri-sticky">
        <div className="axr-dri-cell">
          <input key={clave} id={`${form}-name`} form={form} name="full_name" placeholder={t.addName} aria-label={t.addName} />
        </div>
      </td>
      <td>
        <div className="axr-dri-cell">
          <input key={clave} form={form} name="email" type="email" placeholder={t.cols.email} aria-label={t.cols.email} />
        </div>
      </td>
      <td>
        <div className="axr-dri-cell">
          <input key={clave} form={form} name="phone" type="tel" placeholder="+34 …" aria-label={t.cols.phone} />
        </div>
      </td>
      <td>
        <div className="axr-dri-cell">
          <input key={clave} form={form} name="country" list="dri-paises" placeholder={t.cols.country} aria-label={t.cols.country} />
        </div>
      </td>
      <td>
        <div className="axr-dri-cell">
          <input key={clave} form={form} name="inviter" list="dri-invitadores" defaultValue={yo} aria-label={t.cols.inviter} />
        </div>
      </td>
      <td>
        <select key={clave} form={form} name="tracking" className="axr-dri-status" data-tone="pendiente" defaultValue="pendiente" aria-label={t.cols.status}>
          {SEGUIMIENTOS.map((s) => (
            <option key={s} value={s}>
              {t.tracking[s]}
            </option>
          ))}
        </select>
      </td>
      <td colSpan={columnas - 8}>{error ? <small className="axr-dri-err">{error}</small> : null}</td>
      <td>
        <button type="submit" form={form} className="axr-btn axr-btn--small" disabled={pending}>
          {pending ? t.saving : `+ ${t.add}`}
        </button>
      </td>
    </tr>
  );
}

// ── El mensaje de la sesión ──────────────────────────────

export function EditorMensaje({
  runId,
  plantilla,
  datos,
  ejemplo,
  t,
}: {
  runId: string;
  plantilla: string | null;
  datos: DatosMensaje;
  ejemplo: FilaInvitado | null;
  t: T;
}) {
  const router = useRouter();
  const [texto, setTexto] = useState(plantilla?.trim() || MENSAJE_POR_DEFECTO);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const caja = useRef<HTMLTextAreaElement>(null);
  const muestra = ejemplo ?? { token: "0".repeat(32), seq: 1, inviter: "Oriol", full_name: "Ana Pérez" };

  function insertar(marca: string) {
    const el = caja.current;
    if (!el) return;
    const [a, b] = [el.selectionStart, el.selectionEnd];
    const nuevo = `${texto.slice(0, a)}{${marca}}${texto.slice(b)}`;
    setTexto(nuevo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + marca.length + 2, a + marca.length + 2);
    });
  }

  return (
    <details className="axr-dri-msg">
      <summary>
        <strong>{t.msgTitle}</strong>
        <span>{t.msgLead}</span>
      </summary>
      <div className="axr-dri-msg__grid">
        <div>
          <div className="axr-dra-chips">
            {MARCAS.map((m) => (
              <button key={m} type="button" className="axr-dra-chip" onClick={() => insertar(m)}>
                {`{${m}}`}
              </button>
            ))}
          </div>
          <textarea ref={caja} value={texto} onChange={(e) => setTexto(e.target.value)} rows={12} maxLength={4000} aria-label={t.msgTitle} />
          <div className="axr-form__actions">
            <button
              type="button"
              className="axr-btn"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await guardarMensaje(runId, texto === MENSAJE_POR_DEFECTO ? "" : texto);
                  setAviso(r.ok ? { ok: true, texto: t.msgSaved } : { ok: false, texto: r.error });
                  router.refresh();
                })
              }
            >
              {t.msgSave}
            </button>
            <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setTexto(MENSAJE_POR_DEFECTO)}>
              {t.msgReset}
            </button>
          </div>
          {aviso ? <p className={`axr-adm-note axr-adm-note--${aviso.ok ? "ok" : "bad"}`}>{aviso.texto}</p> : null}
        </div>
        <div className="axr-dri-msg__preview">
          <span>
            {t.msgPreview} {muestra.full_name ?? idInvitado(muestra.seq)}
          </span>
          <p>{componerMensaje(texto, datos, muestra, "whatsapp")}</p>
        </div>
      </div>
    </details>
  );
}

// ── La tabla ─────────────────────────────────────────────

export function TablaInvitados({
  runId,
  filas,
  datos,
  plantilla,
  pasos,
  yo,
  t,
}: {
  runId: string;
  filas: FilaInvitado[];
  datos: DatosMensaje;
  plantilla: string | null;
  pasos: number;
  /** Quien está en el panel: el invitador por defecto de una fila nueva. */
  yo: string;
  t: T;
}) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [quien, setQuien] = useState<string | null>(null);
  const [estado, setEstado] = useState<Seguimiento | null>(null);
  const [pegado, setPegado] = useState("");
  const [importando, startImport] = useTransition();
  const [importado, setImportado] = useState<string | null>(null);

  const invitadores = useMemo(
    () => [...new Set([yo, ...filas.map((f) => f.inviter?.trim()).filter((x): x is string => Boolean(x))].filter(Boolean))].sort((a, b) => a.localeCompare(b, "es")),
    [filas, yo],
  );
  const paises = useMemo(() => [...new Set(filas.map((f) => f.country?.trim()).filter(Boolean))] as string[], [filas]);

  const q = busca.trim().toLowerCase();
  const visibles = filas.filter(
    (f) =>
      (quien === null || (quien === "" ? !f.inviter : f.inviter === quien)) &&
      (estado === null || f.tracking === estado) &&
      (!q ||
        [idInvitado(f.seq), f.full_name, f.email, f.phone, f.country, f.profile, f.notes, f.inviter].some((v) => v?.toLowerCase().includes(q))),
  );
  const cuenta = (s: Seguimiento) => filas.filter((f) => f.tracking === s).length;
  const COLUMNAS = 11;

  return (
    <div className="axr-dri">
      <div className="axr-dri-toolbar">
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={t.search} aria-label={t.search} />
        <div className="axr-dra-chips" aria-label={t.cols.inviter}>
          {[null, ...invitadores, ...(filas.some((f) => !f.inviter) ? [""] : [])].map((p) => (
            <button key={p ?? "*"} type="button" className={`axr-dra-chip${quien === p ? " is-on" : ""}`} onClick={() => setQuien(p)}>
              {p === null ? t.all : p === "" ? t.noInviter : p}{" "}
              <small>{p === null ? filas.length : filas.filter((f) => (p === "" ? !f.inviter : f.inviter === p)).length}</small>
            </button>
          ))}
        </div>
        <div className="axr-dra-chips" aria-label={t.cols.status}>
          {SEGUIMIENTOS.map((s) => (
            <button
              key={s}
              type="button"
              data-tone={s}
              className={`axr-dra-chip axr-dri-chip${estado === s ? " is-on" : ""}`}
              onClick={() => setEstado(estado === s ? null : s)}
            >
              {t.tracking[s]} <small>{cuenta(s)}</small>
            </button>
          ))}
        </div>
      </div>

      <datalist id="dri-invitadores">
        {invitadores.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <datalist id="dri-paises">
        {paises.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <div className="axr-admin-scroll axr-dri-scroll">
        <table className="axr-admin-table axr-dri-table">
          <thead>
            <tr>
              <th>{t.cols.id}</th>
              <th className="axr-dri-sticky">{t.cols.name}</th>
              <th>{t.cols.email}</th>
              <th>{t.cols.phone}</th>
              <th>{t.cols.country}</th>
              <th>{t.cols.inviter}</th>
              <th>{t.cols.status}</th>
              <th>{t.cols.funnel}</th>
              <th>{t.cols.profile}</th>
              <th>{t.cols.notes}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibles.map((f) => (
              <tr key={f.id} data-tracking={f.tracking}>
                <td>
                  <span className="axr-dri-id">{idInvitado(f.seq)}</span>
                </td>
                <td className="axr-dri-sticky">
                  <Celda fila={f} campo="full_name" t={t} placeholder={t.addName} />
                </td>
                <td>
                  <Celda fila={f} campo="email" t={t} tipo="email" />
                </td>
                <td>
                  <Celda fila={f} campo="phone" t={t} tipo="tel" />
                </td>
                <td>
                  <Celda fila={f} campo="country" t={t} lista="dri-paises" />
                </td>
                <td>
                  <Celda fila={f} campo="inviter" t={t} lista="dri-invitadores" />
                </td>
                <td>
                  <Estado fila={f} t={t} />
                </td>
                <td>
                  <Conversion fila={f} t={t} pasos={pasos} />
                </td>
                <td>
                  <Celda fila={f} campo="profile" t={t} />
                </td>
                <td className="axr-dri-notes">
                  <Celda fila={f} campo="notes" t={t} multilinea />
                </td>
                <td>
                  <Enviar fila={f} t={t} datos={datos} plantilla={plantilla} />
                </td>
              </tr>
            ))}
            {!visibles.length ? (
              <tr>
                <td colSpan={COLUMNAS} className="axr-dri-empty">
                  {t.empty}
                </td>
              </tr>
            ) : null}
            <FilaNueva runId={runId} t={t} yo={yo} columnas={COLUMNAS} />
          </tbody>
        </table>
      </div>

      <details className="axr-dri-import">
        <summary>{t.importTitle}</summary>
        <p className="axr-dra-lead">{t.importHint}</p>
        <textarea value={pegado} onChange={(e) => setPegado(e.target.value)} rows={5} placeholder={"Ana Pérez\tana@correo.com\t+34 600 000 000\tEspaña\tOriol\tPendiente"} />
        <div className="axr-form__actions">
          <button
            type="button"
            className="axr-btn"
            disabled={importando || !pegado.trim()}
            onClick={() =>
              startImport(async () => {
                const r = await importarInvitados(runId, pegado);
                if (!r.ok) return setImportado(r.error);
                setImportado([rellenar(t.importDone, { n: r.nuevas }), r.saltadas ? rellenar(t.importSkipped, { n: r.saltadas }) : ""].join(" "));
                setPegado("");
                router.refresh();
              })
            }
          >
            {t.importBtn}
          </button>
        </div>
        {importado ? <p className="axr-adm-note">{importado}</p> : null}
      </details>
    </div>
  );
}
