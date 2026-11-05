import Link from "next/link";
import { redirect } from "next/navigation";

import { FormSesion, type ValoresSesion } from "@/components/admin/dry-run/form-sesion";
import { FormCorreo } from "@/components/admin/dry-run/piezas";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { correoListo, getMailSettings } from "@/lib/correo/envio";
import { cuandoEs } from "@/lib/dry-run/tiempo";
import { CON_PLAZA, type DryRun } from "@/lib/dry-run/tipos";
import { getCurrentProfile } from "@/lib/data/profile";
import { drCopy, rellenar } from "@/lib/i18n/dry-run";
import { getI18n } from "@/lib/i18n/server";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/admin/ia/ia.scss";
import "@/app/admin/dry-run/dry-run.scss";

// ══════════════════════════════════════════════════════════
//  Dry run: la lista de sesiones, el alta y la cuenta de envío
// ══════════════════════════════════════════════════════════

/** La agenda de partida del Módulo 1: cuatro horas de clase y una pausa. */
const AGENDA_M1 = [
  "09:30 | Bienvenida y hora 1 · Del sitio donde trabajas al resultado que entregas",
  "10:30 | Hora 2 · El Motor de Visibilidad",
  "11:30 | Pausa",
  "12:00 | Hora 3 · La actualización de impacto",
  "13:00 | Hora 4 · Q&A abierto y puente al módulo 02",
  "14:00 | Cierre",
].join("\n");

export default async function DryRunsPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const admin = createAdminClient();
  const [{ locale }, { data: runs }, { data: modulos }, ajustes] = await Promise.all([
    getI18n(),
    admin.from("dry_runs").select("*").order("starts_at", { ascending: false }),
    admin.from("modules").select("id, title, course, order_index").order("course").order("order_index"),
    getMailSettings(),
  ]);
  const copy = drCopy[locale];
  const lista = (runs ?? []) as DryRun[];

  const [{ data: guests }, { data: links }] = lista.length
    ? await Promise.all([
        admin.from("dry_run_guests").select("dry_run_id, status, feedback_at").in("dry_run_id", lista.map((r) => r.id)),
        admin.from("dry_run_links").select("dry_run_id, visits").in("dry_run_id", lista.map((r) => r.id)),
      ])
    : [{ data: [] }, { data: [] }];

  const opciones = (modulos ?? []).map((m) => ({ id: m.id, label: `${m.course} · ${m.order_index} · ${m.title}` }));
  const m1 = (modulos ?? []).find((m) => m.course === "core" && m.order_index === 1) ?? modulos?.[0];
  const nuevo: ValoresSesion = {
    title: "Dry run · Módulo 1",
    slug: lista.some((r) => r.slug === "modulo-1") ? "" : "modulo-1",
    module_id: m1?.id ?? "",
    starts_at: "2026-11-21T09:30",
    ends_at: "2026-11-21T14:00",
    teacher_name: "Isaac",
    classroom_url: "",
    classroom_code: "",
    meet_url: "",
    agenda: AGENDA_M1,
    capacity: "",
    access_until: "",
    registration_open: true,
  };

  const listo = correoListo(ajustes);
  const ahora = Date.now();

  return (
    <div className="axr-admin-page axr-dra">
      <div className="axr-admin-page__header">
        <div>
          <h1>{copy.title}</h1>
          <p>{copy.lead}</p>
        </div>
        <div>
          <span className={`axr-adm-pill axr-adm-pill--${listo ? "ok" : "warn"}`}>
            <Icono n="enlace" size={12} /> {copy.mailTitle}: {listo ? copy.mOk : copy.mOff}
          </span>
        </div>
      </div>

      {lista.length ? (
        <div className="axr-dra-runs">
          {lista.map((r) => {
            const suyos = (guests ?? []).filter((g) => g.dry_run_id === r.id);
            const conPlaza = suyos.filter((g) => CON_PLAZA.includes(g.status)).length;
            const visitas = (links ?? []).filter((l) => l.dry_run_id === r.id).reduce((a, l) => a + l.visits, 0);
            const pasado = new Date(r.ends_at).getTime() < ahora;
            return (
              <Link key={r.id} href={`/admin/dry-run/${r.id}`} className="axr-admin-card axr-dra-run-card">
                <span className={`axr-adm-pill axr-adm-pill--${pasado ? "info" : r.registration_open ? "ok" : "warn"}`}>
                  {pasado ? copy.past : r.registration_open ? copy.open : copy.closed}
                </span>
                <strong>{r.title}</strong>
                <span className="axr-dra-run-card__when">{cuandoEs(r.starts_at, r.ends_at)}</span>
                <span className="axr-dra-run-card__nums">
                  <span>{r.capacity ? rellenar(copy.places, { a: conPlaza, b: r.capacity }) : rellenar(copy.placesNoCap, { n: conPlaza })}</span>
                  <span>
                    {copy.visits}: {visitas}
                  </span>
                  <span>
                    {copy.feedback}: {suyos.filter((g) => g.feedback_at).length}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="axr-adm-note">{copy.empty}</p>
      )}

      <details className="axr-admin-card axr-dra-new" open={!lista.length}>
        <summary>
          <h2>+ {copy.new}</h2>
        </summary>
        <FormSesion id={null} valores={nuevo} modulos={opciones} copy={copy} />
      </details>

      <section className="axr-admin-card">
        <h2>{copy.mailTitle}</h2>
        <p className="axr-dra-lead">{copy.mailLead}</p>
        <FormCorreo
          copy={copy}
          ajustes={{
            enabled: ajustes?.enabled ?? false,
            smtp_host: ajustes?.smtp_host ?? "smtp.gmail.com",
            smtp_port: ajustes?.smtp_port ?? 465,
            smtp_user: ajustes?.smtp_user ?? "admin@activexremote.com",
            from_name: ajustes?.from_name ?? "ActiveXRemote",
            from_email: ajustes?.from_email ?? "",
            reply_to: ajustes?.reply_to ?? "",
            passHint: ajustes?.smtp_pass ? ajustes.smtp_pass.slice(-4) : null,
          }}
        />
      </section>
    </div>
  );
}
