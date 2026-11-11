"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { actualizarLead } from "@/app/admin/comercial/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { ESTADOS_LEAD, prioridad, TEMPERATURAS, whatsappDe, type EstadoLead, type Lead } from "@/lib/comercial/tipos";
import type { ComercialCopy } from "@/lib/i18n/comercial";

// ══════════════════════════════════════════════════════════
//  La lista de leads
//
//  En el orden en que se trabaja el día, con el estado y la temperatura
//  editables en la propia fila y los botones para llamar, escribir por
//  WhatsApp o por correo. El nombre abre la ficha, con el historial y los
//  mensajes del playbook.
// ══════════════════════════════════════════════════════════

type C = ComercialCopy;
type Filtro = "todos" | EstadoLead;

const FECHA = new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "numeric", month: "short" });

/** «hoy», «ayer», «hace 5 d», «hace 3 sem». */
function hace(iso: string, ahora: number) {
  const dias = Math.floor((ahora - Date.parse(iso)) / 86_400_000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 14) return `hace ${dias} d`;
  if (dias < 60) return `hace ${Math.floor(dias / 7)} sem`;
  return FECHA.format(new Date(iso));
}

export function Desplegable({ lead, campo, c }: { lead: Lead; campo: "status" | "temperature"; c: C }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const valor = campo === "status" ? lead.status : (lead.temperature ?? "");

  return (
    <select
      className="axr-com-select"
      data-tone={valor || "none"}
      value={valor}
      disabled={pending}
      aria-label={campo === "status" ? c.fStatus : c.fTemp}
      aria-invalid={error ? true : undefined}
      title={error ?? undefined}
      onChange={(e) => {
        const v = e.currentTarget.value;
        startTransition(async () => {
          const r = await actualizarLead(lead.id, campo === "status" ? { status: v } : { temperature: v || null });
          if (r.ok) {
            setError(null);
            router.refresh();
          } else setError(r.error);
        });
      }}
    >
      {campo === "status"
        ? ESTADOS_LEAD.map((k) => (
            <option key={k} value={k}>
              {c.status[k]}
            </option>
          ))
        : [
            <option key="" value="">
              {c.tempNone}
            </option>,
            ...TEMPERATURAS.map((k) => (
              <option key={k} value={k}>
                {c.temp[k]}
              </option>
            )),
          ]}
    </select>
  );
}

export function TablaLeads({ leads, hoy, c }: { leads: Lead[]; hoy: string; c: C }) {
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [q, setQ] = useState("");
  // El «ahora» de la carga: así «hace 3 d» no cambia entre servidor y navegador.
  const [ahora] = useState(() => Date.parse(`${hoy}T12:00:00Z`));

  const cuenta = useMemo(() => {
    const m = new Map<Filtro, number>([["todos", leads.length]]);
    for (const l of leads) m.set(l.status, (m.get(l.status) ?? 0) + 1);
    return m;
  }, [leads]);

  const filas = useMemo(() => {
    const n = q.trim().toLowerCase();
    return leads
      .filter((l) => filtro === "todos" || l.status === filtro)
      .filter((l) => !n || [l.first_name, l.last_name, l.email, l.phone, l.city, l.notes ?? ""].some((x) => x.toLowerCase().includes(n)))
      .map((l) => ({ l, p: prioridad(l, hoy) }))
      .sort((a, b) => a.p[0] - b.p[0] || a.p[1] - b.p[1])
      .map(({ l }) => l);
  }, [leads, filtro, q, hoy]);

  return (
    <div className="axr-admin-card axr-com-list">
      <div className="axr-com-tools">
        <label className="axr-com-search">
          <Icono n="buscar" size={16} />
          <input type="search" value={q} onChange={(e) => setQ(e.currentTarget.value)} placeholder={c.search} aria-label={c.search} />
        </label>
        <div className="axr-com-chips" role="group" aria-label={c.fStatus}>
          {(["todos", ...ESTADOS_LEAD] as Filtro[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`axr-com-chip${filtro === k ? " is-on" : ""}`}
              data-tone={k}
              aria-pressed={filtro === k}
              onClick={() => setFiltro(k)}
            >
              {k === "todos" ? c.all : c.status[k]} <span>{cuenta.get(k) ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {filas.length ? (
        <div className="axr-com-scroll">
          <table className="axr-com-table">
            <thead>
              <tr>
                <th>{c.cols.name}</th>
                <th>{c.cols.contact}</th>
                <th>{c.cols.course}</th>
                <th>{c.cols.status}</th>
                <th>{c.cols.temp}</th>
                <th>{c.cols.next}</th>
                <th>{c.cols.age}</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((l) => {
                const wa = whatsappDe(l.phone);
                const vencida = l.next_action_at && l.next_action_at < hoy;
                const deHoy = l.next_action_at === hoy;
                return (
                  <tr key={l.id} className={l.status === "descartado" ? "is-quiet" : undefined}>
                    <td>
                      <Link href={`/admin/comercial/leads/${l.id}`} className="axr-com-name">
                        {l.first_name} {l.last_name}
                      </Link>
                      <small>{l.city}</small>
                    </td>
                    <td>
                      <div className="axr-com-contact">
                        <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} title={`${c.call} · ${l.phone}`} aria-label={`${c.call} ${l.phone}`}>
                          <Icono n="telefono" size={16} />
                        </a>
                        {wa ? (
                          <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" title={c.whatsapp} aria-label={c.whatsapp}>
                            <Icono n="chat" size={16} />
                          </a>
                        ) : (
                          <span aria-disabled title={c.noPhone}>
                            <Icono n="chat" size={16} />
                          </span>
                        )}
                        <a href={`mailto:${l.email}`} title={`${c.email} · ${l.email}`} aria-label={`${c.email} ${l.email}`}>
                          <Icono n="correo" size={16} />
                        </a>
                        <span className="axr-com-phone">{l.phone}</span>
                      </div>
                    </td>
                    <td>
                      {l.courses.length ? (
                        l.courses.map((k) => (
                          <span key={k} className="axr-com-course" data-course={k}>
                            {(c.courses[k] ?? k).replace("Remote ", "")}
                          </span>
                        ))
                      ) : (
                        <span className="axr-com-muted">{c.noCourse}</span>
                      )}
                    </td>
                    <td>
                      <Desplegable lead={l} campo="status" c={c} />
                    </td>
                    <td>
                      <Desplegable lead={l} campo="temperature" c={c} />
                    </td>
                    <td className="axr-com-next">
                      {l.next_action || l.next_action_at ? (
                        <>
                          {l.next_action_at ? (
                            <span className={`axr-adm-pill${vencida ? " axr-adm-pill--bad" : deHoy ? " axr-adm-pill--warn" : ""}`}>
                              {vencida ? `${c.overdue} · ` : ""}
                              {deHoy ? c.today : FECHA.format(new Date(`${l.next_action_at}T12:00:00Z`))}
                            </span>
                          ) : null}
                          <span>{l.next_action}</span>
                        </>
                      ) : (
                        <span className="axr-com-muted">{c.none}</span>
                      )}
                    </td>
                    <td className="axr-com-muted" title={new Date(l.created_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid" })}>
                      {hace(l.created_at, ahora)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="axr-adm-empty">
          <Icono n="maletin" size={28} />
          <strong>{c.noLeads}</strong>
          <span>{c.noLeadsHint}</span>
        </div>
      )}
    </div>
  );
}
