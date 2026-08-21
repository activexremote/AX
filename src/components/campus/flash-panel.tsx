import Link from "next/link";

import { fmt } from "@/lib/i18n/dictionaries";
import { getFlashProgress, getUnlocks } from "@/lib/data/relampago";
import { FLASH_COURSES } from "@/lib/relampago/catalog";
import type { CourseKey } from "@/lib/supabase/types";

// Panel de un curso relámpago en la portada del campus: cuánto llevas y qué
// tienes por desbloquear.
//
// Los desbloqueos se enseñan SIEMPRE, ganados o no. Que se vea el premio
// cerrado es la mitad del incentivo; esconderlos hasta ganarlos convierte el
// final del curso en una sorpresa que nadie está persiguiendo.

type Copy = {
  title: string;
  lead: string;
  locked: string;
  earned: string;
  open: string;
  soon: string;
  progress: string;
};

export async function FlashPanel({ copy }: { copy: Copy }) {
  // Sólo se pinta lo que el alumno tiene comprado: `getFlashProgress` pasa por
  // RLS, así que un curso sin matrícula devuelve cero módulos y no aparece.
  const paneles = await Promise.all(
    FLASH_COURSES.map(async (curso) => {
      const progress = await getFlashProgress(curso.key as CourseKey);
      if (progress.modules.length === 0) return null;
      const unlocks = await getUnlocks(curso.key as CourseKey);
      return { curso, progress, unlocks };
    }),
  );

  const visibles = paneles.filter((p): p is NonNullable<typeof p> => p !== null);
  if (visibles.length === 0) return null;

  return (
    <>
      {visibles.map(({ curso, progress, unlocks }) => {
        const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
        return (
          <section key={curso.key} className="axr-flashpanel">
            <header className="axr-flashpanel__head">
              <span className="axr-section-tag">{curso.code}</span>
              <h2>{curso.title}</h2>
              <p>{curso.claim}</p>
            </header>

            <div className="axr-flashpanel__bar" role="img" aria-label={`${pct}%`}>
              <span style={{ width: `${pct}%` }} />
            </div>
            <p className="axr-flashpanel__nums">
              {fmt(copy.progress, {
                done: progress.done,
                total: progress.total,
                passed: progress.passed,
                submitted: progress.submitted,
              })}
            </p>

            <ol className="axr-flashpanel__modules">
              {progress.modules.map((m) => (
                <li key={m.id}>
                  <Link href={`/modulos/${m.slug}`}>
                    <span className="axr-flashpanel__module-code">{m.code}</span>
                    <span>{m.title}</span>
                  </Link>
                </li>
              ))}
            </ol>

            <div className="axr-flashpanel__unlocks">
              <h3>{copy.title}</h3>
              <p>{copy.lead}</p>
              <ul>
                {unlocks.map((u) => (
                  <li key={u.key} data-earned={u.earned}>
                    <span className="axr-flashpanel__unlock-state">
                      {u.earned ? copy.earned : copy.locked}
                    </span>
                    <strong>{u.title}</strong>
                    <span className="axr-flashpanel__unlock-desc">{u.description}</span>
                    {u.earned &&
                      (u.url ? (
                        <a href={u.url} className="axr-btn axr-btn--ghost">
                          {copy.open}
                        </a>
                      ) : (
                        // Ganado pero sin archivo todavía. Se dice, en vez de
                        // dejar un botón que no lleva a ninguna parte.
                        <span className="axr-flashpanel__unlock-soon">{copy.soon}</span>
                      ))}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </>
  );
}
