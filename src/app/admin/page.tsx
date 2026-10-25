import Link from "next/link";

import { Icono, type NombreIcono } from "@/components/admin/publicaciones/iconos";
import { firstName, getCurrentProfile } from "@/lib/data/profile";
import { adminACopy } from "@/lib/i18n/admin-v2-a";
import { fill } from "@/lib/i18n/publicaciones";
import { getI18n } from "@/lib/i18n/server";
import { contarPendientes } from "@/lib/social/panel";
import { createClient } from "@/lib/supabase/server";
import "@/app/admin/resumen.scss";

// ══════════════════════════════════════════════════════════
//  Resumen del panel
//
//  La primera pantalla responde a dos preguntas: ¿cómo está el campus? (las
//  cifras, cada una lleva a su sección) y ¿qué hay que hacer? (lo que espera
//  a alguien, sacado de los datos reales y con el botón que lo resuelve).
//  Si no hay nada pendiente, lo dice: «todo al día» también es información.
//
//  El profesorado ve sólo lo de formación: matrículas, publicaciones y
//  cuentas son del equipo (y la RLS tampoco se las dejaría leer).
//
//  Todas las consultas van a la vez y casi todas son recuentos (`head`): la
//  pantalla no descarga filas que no enseña.
// ══════════════════════════════════════════════════════════

type Pendiente = { key: string; icon: NombreIcono; tono: "bad" | "warn" | "info"; titulo: string; detalle: string; href: string; boton: string };

const CURSOS = ["core", "remote-professional", "remote-founder", "web-abc"] as const;

export default async function AdminHome() {
  const [profile, { locale }] = await Promise.all([getCurrentProfile(), getI18n()]);
  const c = adminACopy[locale];
  const admin = profile?.role === "administrador";
  const supabase = await createClient();
  const hoy = new Date().toISOString().slice(0, 10);
  const vacio = { count: 0, data: null };

  const [
    { data: modulos },
    { data: lecciones },
    { count: leccionesVacias },
    { count: intentos },
    { count: aprobados },
    { count: vencidas },
    { count: preguntas },
    { count: cuentas },
    { data: matriculas },
    { count: recuperar },
    social,
  ] = await Promise.all([
    supabase.from("modules").select("id, course, available"),
    supabase.from("lessons").select("module_id"),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .is("content_blocks", null)
      .or("content_md.is.null,content_md.eq."),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }),
    supabase.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("passed", true),
    supabase.from("assignments").select("id", { count: "exact", head: true }).lt("due_date", hoy).neq("status", "completada"),
    supabase.from("assistant_questions").select("id", { count: "exact", head: true }).eq("answered", false).eq("reviewed", false),
    admin ? supabase.from("profiles").select("id", { count: "exact", head: true }) : Promise.resolve(vacio),
    admin ? supabase.from("enrollments").select("user_id").eq("active", true) : Promise.resolve(vacio),
    admin
      ? supabase.from("orders").select("id", { count: "exact", head: true }).in("status", ["iniciado", "expirado"])
      : Promise.resolve(vacio),
    admin ? contarPendientes() : Promise.resolve(null),
  ]);

  const mods = (modulos ?? []) as { id: string; course: string; available: boolean }[];
  const ocultos = mods.filter((m) => !m.available).length;
  const cursoDe = new Map(mods.map((m) => [m.id, m.course]));
  const leccionesPorCurso = new Map<string, number>();
  for (const l of (lecciones ?? []) as { module_id: string }[]) {
    const k = cursoDe.get(l.module_id) ?? "core";
    leccionesPorCurso.set(k, (leccionesPorCurso.get(k) ?? 0) + 1);
  }
  const totalLecciones = (lecciones ?? []).length;
  const alumnos = new Set(((matriculas ?? []) as { user_id: string }[]).map((e) => e.user_id)).size;
  const pctAprobados = intentos ? Math.round(((aprobados ?? 0) / intentos) * 100) : null;

  // Lo que espera, de lo más urgente (rojo) a lo informativo (azul).
  const pendientes: Pendiente[] = [];
  if (social?.revisar) {
    pendientes.push({ key: "rev", icon: "revisar", tono: "warn", titulo: fill(c.todoReview, social.revisar), detalle: c.todoReviewHint, href: "/admin/publicaciones/revisar", boton: c.todoReviewBtn });
  }
  if (preguntas) {
    pendientes.push({ key: "faq", icon: "chat", tono: "bad", titulo: fill(c.todoQuestions, preguntas), detalle: c.todoQuestionsHint, href: "/admin/asistente", boton: c.todoQuestionsBtn });
  }
  if (vencidas) {
    pendientes.push({ key: "venc", icon: "reloj", tono: "bad", titulo: fill(c.todoOverdue, vencidas), detalle: c.todoOverdueHint, href: "/admin/tareas", boton: c.todoOverdueBtn });
  }
  if (recuperar) {
    pendientes.push({ key: "ord", icon: "tarjeta", tono: "warn", titulo: fill(c.todoOrders, recuperar), detalle: c.todoOrdersHint, href: "/admin/matriculas", boton: c.todoOrdersBtn });
  }
  if (leccionesVacias) {
    pendientes.push({ key: "vac", icon: "libro", tono: "info", titulo: fill(c.todoEmpty, leccionesVacias), detalle: c.todoEmptyHint, href: "/admin/modulos", boton: c.todoEmptyBtn });
  }
  if (ocultos) {
    pendientes.push({ key: "ocu", icon: "info", tono: "info", titulo: fill(c.todoHidden, ocultos), detalle: c.todoHiddenHint, href: "/admin/modulos?estado=ocultos", boton: c.todoHiddenBtn });
  }
  const orden = { bad: 0, warn: 1, info: 2 };
  pendientes.sort((a, b) => orden[a.tono] - orden[b.tono]);

  const atajos: { href: string; icon: NombreIcono; label: string }[] = [
    { href: "/admin/modulos?nuevo=1", icon: "libro", label: c.quickModule },
    { href: "/admin/tareas", icon: "tareas", label: c.quickTask },
    { href: "/admin/asistente", icon: "chat", label: c.quickFaq },
    ...(admin
      ? ([
          { href: "/admin/publicaciones/nueva", icon: "megafono", label: c.quickPost },
          { href: "/admin/banners/nueva", icon: "imagen", label: c.quickCampaign },
          { href: "/admin/usuarios", icon: "usuarios", label: c.quickUser },
        ] as const)
      : []),
  ];

  const fecha = new Date().toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="axr-admin-page axr-resumen">
      <div className="axr-admin-page__header">
        <div>
          <span className="axr-resumen__date">{fecha}</span>
          <h1>{fill(c.hello, firstName(profile))}</h1>
          <p>{c.helloLead}</p>
        </div>
      </div>

      <div className="axr-adm-stats">
        <Link href="/admin/modulos" className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="libro" /> {c.statModules}
          </span>
          <span className="axr-adm-stat__value">{mods.length}</span>
          <span className="axr-adm-stat__hint">{ocultos ? fill(c.statModulesHint, ocultos) : c.statModulesAllOn}</span>
        </Link>
        <Link href="/admin/modulos" className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="lista" /> {c.statLessons}
          </span>
          <span className="axr-adm-stat__value">{totalLecciones}</span>
          <span className="axr-adm-stat__hint">{leccionesVacias ? fill(c.statLessonsHint, leccionesVacias) : c.statLessonsAllOk}</span>
        </Link>
        {admin ? (
          <Link href="/admin/usuarios" className="axr-adm-stat">
            <span className="axr-adm-stat__label">
              <Icono n="usuarios" /> {c.statStudents}
            </span>
            <span className="axr-adm-stat__value">{alumnos}</span>
            <span className="axr-adm-stat__hint">{fill(c.statStudentsHint, cuentas ?? 0)}</span>
          </Link>
        ) : null}
        <div className="axr-adm-stat">
          <span className="axr-adm-stat__label">
            <Icono n="ok" /> {c.statAttempts}
          </span>
          <span className="axr-adm-stat__value">{intentos ?? 0}</span>
          <span className="axr-adm-stat__hint">{pctAprobados === null ? c.statAttemptsNone : fill(c.statAttemptsHint, pctAprobados)}</span>
        </div>
      </div>

      <div className="axr-resumen__grid">
        <section className="axr-admin-card axr-resumen__todo">
          <h2>
            {c.todoTitle}
            {pendientes.length ? <span className="axr-resumen__count">{pendientes.length}</span> : null}
          </h2>
          {pendientes.length ? (
            <ul className="axr-resumen__list">
              {pendientes.map((p) => (
                <li key={p.key} className={`axr-resumen__item axr-resumen__item--${p.tono}`}>
                  <span className="axr-resumen__icon">
                    <Icono n={p.icon} size={18} />
                  </span>
                  <span className="axr-resumen__text">
                    <strong>{p.titulo}</strong>
                    <small>{p.detalle}</small>
                  </span>
                  <Link href={p.href} className="axr-btn axr-btn--ghost axr-btn--small">
                    {p.boton} <Icono n="flecha" size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="axr-adm-empty">
              <Icono n="ok" size={28} />
              <strong>{c.todoNone}</strong>
              <span>{c.todoNoneHint}</span>
            </div>
          )}
        </section>

        <div className="axr-resumen__side">
          <section className="axr-admin-card">
            <h2>{c.quickTitle}</h2>
            <div className="axr-resumen__quick">
              {atajos.map((a) => (
                <Link key={a.href} href={a.href} className="axr-resumen__shortcut">
                  <Icono n={a.icon} size={18} />
                  <span>{a.label}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="axr-admin-card">
            <h2>{c.coursesTitle}</h2>
            <ul className="axr-resumen__courses">
              {CURSOS.map((k) => {
                const n = mods.filter((m) => m.course === k).length;
                if (!n) return null;
                return (
                  <li key={k}>
                    <span className={`axr-resumen__dot axr-resumen__dot--${k}`} aria-hidden />
                    <strong>{c.course[k]}</strong>
                    <span>
                      {fill(c.coursesModules, n)} · {fill(c.coursesLessons, leccionesPorCurso.get(k) ?? 0)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
