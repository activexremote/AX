import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { hechaPor, materialDe, seguimiento } from "@/lib/actividades/seguimiento";
import { actividadesCopy } from "@/lib/i18n/actividades";
import { getI18n } from "@/lib/i18n/server";
import "@/app/admin/respuestas/respuestas.scss";

// ══════════════════════════════════════════════════════════
//  Seguimiento por alumno
//
//  Una fila por alumno con lo esencial de un vistazo: la preparación del dry
//  run, las lecciones completadas, el material abierto lección a lección y
//  las actividades obligatorias enviadas. El detalle, al entrar en cada uno.
// ══════════════════════════════════════════════════════════

export default async function SeguimientoPage() {
  const [{ locale }, datos] = await Promise.all([getI18n(), seguimiento()]);
  const c = actividadesCopy[locale];
  const { lecciones, actividades, alumnos } = datos;
  const obligatorias = actividades.filter((a) => a.obligatoria);
  const conMaterial = lecciones.filter((l) => l.recursos.length);

  return (
    <div className="axr-admin-page axr-resp">
      <p>
        <Link href="/admin/respuestas">{c.aBack}</Link>
      </p>
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.aByStudent}</h1>
          <p>{c.aByStudentLead}</p>
        </div>
      </div>

      {alumnos.length ? (
        <div className="axr-resp__table">
          <table className="axr-admin-table">
            <thead>
              <tr>
                <th>{c.aStudent}</th>
                <th>{c.aPrep}</th>
                <th>{c.aLessons}</th>
                <th>{c.aMaterial}</th>
                <th>{c.aActivities}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {alumnos.map((a) => {
                const hechas = obligatorias.filter((x) => hechaPor(x, a)).length;
                return (
                  <tr key={a.id}>
                    <td>
                      <strong>{a.nombre}</strong>
                      <br />
                      <small>{a.email}</small>
                    </td>
                    <td>{a.preparacion ? `${a.preparacion.hechos}/${a.preparacion.total}` : "—"}</td>
                    <td>
                      {lecciones.filter((l) => a.completadas.has(l.id)).length}/{lecciones.length}
                    </td>
                    <td>
                      {conMaterial.map((l) => {
                        const m = materialDe(l, a);
                        const tono = m.abiertos >= m.total ? "ok" : m.abiertos ? "warn" : "bad";
                        return (
                          <span key={l.id} className={`axr-adm-pill axr-adm-pill--${tono}`} title={l.title} style={{ marginRight: 4 }}>
                            {c.aLessons.slice(0, 1)}
                            {l.orden} · {m.abiertos}/{m.total}
                          </span>
                        );
                      })}
                    </td>
                    <td>
                      <span className={`axr-adm-pill axr-adm-pill--${hechas >= obligatorias.length ? "ok" : hechas ? "warn" : "bad"}`}>
                        {hechas}/{obligatorias.length}
                      </span>
                    </td>
                    <td>
                      <Link href={`/admin/respuestas/alumnos/${a.id}`} className="axr-btn axr-btn--small">
                        {c.aSee}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="axr-adm-empty">
          <Icono n="usuarios" size={28} />
          <strong>{c.aNoStudents}</strong>
        </div>
      )}
    </div>
  );
}
