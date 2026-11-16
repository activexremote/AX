import { CampusHeader } from "@/components/campus-header";
import { ListaMisTareas, type MiTarea } from "@/components/campus/mis-tareas-lista";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { getMyAssignments } from "@/lib/data/assignments";
import { getI18n } from "@/lib/i18n/server";
import { campusV2CCopy } from "@/lib/i18n/campus-v2-c";
import { misTareasDeActividades, misTareasDeMaterial } from "@/lib/actividades/datos";
import { tx } from "@/lib/actividades/tipos";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { ZONA } from "@/lib/dry-run/tiempo";
import "@/app/(campus)/mis-tareas/tareas.scss";

// ══════════════════════════════════════════════════════════
//  Mis tareas
//
//  Lo urgente arriba: lo vencido, lo que vence en tres días, lo empezado y lo
//  pendiente; lo terminado, al final. El estado que se enseña es el de
//  verdad, no sólo el guardado: una tarea con la fecha pasada sale vencida
//  aunque el aviso nocturno aún no la haya marcado, y una con todas sus
//  lecciones hechas sale completada. Es el mismo criterio que el panel
//  (admin/tareas).
// ══════════════════════════════════════════════════════════

/** Hoy en Madrid, como AAAA-MM-DD: es la fecha con la que se mira el plazo. */
const hoyMadrid = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const DIA = 86_400_000;
const diasEntre = (desde: string, hasta: string) => Math.round((Date.parse(`${hasta}T00:00:00Z`) - Date.parse(`${desde}T00:00:00Z`)) / DIA);

const ORDEN: Record<MiTarea["estado"], number> = { vencida: 0, pronto: 1, en_curso: 2, pendiente: 3, programada: 4, completada: 5 };

export default async function MisTareasPage() {
  const { t, locale } = await getI18n();
  const [assignments, actividades, material] = await Promise.all([getMyAssignments(), misTareasDeActividades(locale), misTareasDeMaterial(locale)]);
  const copy = campusV2CCopy[locale];
  const ac = actividadesCopy[locale];
  const hoy = hoyMadrid();
  const diaMadrid = (iso: string) => new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date(iso));
  const venceEn = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "es-ES", {
    timeZone: ZONA,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const abreEl = (iso: string | null) => (iso ? ac.mtOpensOn.replace("{d}", venceEn.format(new Date(iso))) : null);

  // Cada actividad del campus es una tarea con su plazo y su enlace directo.
  // Las de las horas de clase, antes de la clase, salen como «se abre en
  // clase»: se ven, pero no cuentan como pendientes.
  const deActividades: MiTarea[] = actividades.map((x) => {
    const dias = x.plazo ? diasEntre(hoy, diaMadrid(x.plazo)) : null;
    const vencida = x.plazo ? Date.now() > new Date(x.plazo).getTime() : false;
    const st = x.fila?.status;
    const estado: MiTarea["estado"] = x.hecha
      ? "completada"
      : x.abre
        ? "programada"
        : vencida
        ? "vencida"
        : dias !== null && dias <= 3
          ? "pronto"
          : st === "borrador" || st === "devuelta" || (x.fila && x.actividad.tipo === "test")
            ? "en_curso"
            : "pendiente";
    const etiqueta = st === "devuelta" ? ac.status.devuelta : x.hecha ? ac.status[st === "revisada" ? "revisada" : "enviada"] : copy.tStatus[estado];
    return {
      id: `act-${x.actividad.key}`,
      module_title: x.moduleTitle,
      module_slug: "",
      total: 0,
      done: 0,
      due_date: x.plazo ? diaMadrid(x.plazo) : null,
      completed_at: x.hecha ? (x.fila?.submitted_at ?? null) : null,
      dias,
      note: st === "devuelta" || st === "revisada" ? (x.fila?.feedback ?? null) : null,
      estado,
      actividad: {
        titulo: tx(x.actividad.titulo, locale),
        donde: `${x.moduleTitle} · ${x.lessonTitle}`,
        href: `/lecciones/${x.lessonId}#act-${x.actividad.key}`,
        vence: x.plazo ? venceEn.format(new Date(x.plazo)) : null,
        etiqueta,
        cta: x.hecha ? ac.mtSee : st === "devuelta" ? ac.mtRedo : ac.mtDo,
        nivel: x.actividad.obligatoria ? ac.required : x.actividad.tipo === "juego" ? ac.optional : ac.recommended,
        resumen: `${ac.minutes.replace("{n}", String(x.actividad.minutos))} · ${x.actividad.plazo === "antes-clase" ? ac.mtBeforeClass : ac.mtWeek}`,
        abre: abreEl(x.abre),
      },
    };
  });

  // El material de cada lección (lecturas, vídeos, descargas): una tarea
  // por lección, hecha cuando se ha abierto cada enlace.
  const deMaterial: MiTarea[] = material.map((x) => {
    const hecha = x.abiertos >= x.total;
    const dias = x.plazo ? diasEntre(hoy, diaMadrid(x.plazo)) : null;
    const vencida = x.plazo ? Date.now() > new Date(x.plazo).getTime() : false;
    const estado: MiTarea["estado"] = hecha
      ? "completada"
      : x.abre
        ? "programada"
        : vencida
          ? "vencida"
          : dias !== null && dias <= 3
            ? "pronto"
            : x.abiertos > 0
              ? "en_curso"
              : "pendiente";
    return {
      id: `mat-${x.lessonId}`,
      module_title: x.moduleTitle,
      module_slug: "",
      total: x.total,
      done: x.abiertos,
      due_date: x.plazo ? diaMadrid(x.plazo) : null,
      completed_at: null,
      dias,
      note: null,
      estado,
      actividad: {
        titulo: ac.mtMaterial.replace("{l}", x.lessonTitle),
        donde: x.moduleTitle,
        href: `/lecciones/${x.lessonId}`,
        vence: x.plazo ? venceEn.format(new Date(x.plazo)) : null,
        etiqueta: copy.tStatus[estado],
        cta: ac.mtOpenLesson,
        nivel: ac.required,
        resumen: ac.mtMaterialSummary.replace("{a}", String(x.abiertos)).replace("{b}", String(x.total)),
        abre: abreEl(x.abre),
      },
    };
  });

  const tareas: MiTarea[] = assignments
    .map((a): MiTarea => {
      const dias = a.due_date ? diasEntre(hoy, a.due_date) : null;
      const terminada = a.status === "completada" || (a.module_lessons > 0 && a.lessons_done >= a.module_lessons);
      const estado: MiTarea["estado"] = terminada
        ? "completada"
        : dias !== null && dias < 0
          ? "vencida"
          : dias !== null && dias <= 3
            ? "pronto"
            : a.status === "en_curso" || a.lessons_done > 0
              ? "en_curso"
              : "pendiente";
      return {
        id: a.id,
        module_title: a.module_title,
        module_slug: a.module_slug,
        total: a.module_lessons,
        done: Math.min(a.lessons_done, a.module_lessons),
        due_date: a.due_date,
        completed_at: a.completed_at,
        dias,
        note: a.note,
        estado,
      };
    })
    .concat(deMaterial, deActividades)
    .sort((x, y) => ORDEN[x.estado] - ORDEN[y.estado] || (x.dias ?? 9999) - (y.dias ?? 9999));

  const n = (e: MiTarea["estado"][]) => tareas.filter((x) => e.includes(x.estado)).length;

  return (
    <>
      <CampusHeader active="tasks" />
      <div className="axr-c-wrap axr-mt">
        <header className="axr-c-head">
          <div>
            <h1>{t.tasks.title}</h1>
            <p>{t.tasks.subtitle}</p>
          </div>
        </header>

        {tareas.length ? (
          <div className="axr-c-stats">
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="tareas" /> {copy.tOpen}
              </span>
              <span className="axr-c-stat__value">{n(["pendiente", "en_curso", "pronto", "vencida"])}</span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="reloj" /> {copy.tSoon}
              </span>
              <span className="axr-c-stat__value" style={n(["pronto"]) ? { color: "var(--cmp-warn)" } : undefined}>
                {n(["pronto"])}
              </span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="aviso" /> {copy.tOverdue}
              </span>
              <span className="axr-c-stat__value" style={n(["vencida"]) ? { color: "var(--cmp-bad)" } : undefined}>
                {n(["vencida"])}
              </span>
            </div>
            <div className="axr-c-stat">
              <span className="axr-c-stat__label">
                <Icono n="ok" /> {copy.tDone}
              </span>
              <span className="axr-c-stat__value">{n(["completada"])}</span>
            </div>
          </div>
        ) : null}

        <ListaMisTareas tareas={tareas} copy={copy} locale={locale} />
      </div>
    </>
  );
}
