import Image from "next/image";

import { getLocale } from "@/lib/i18n/server";
import { DEMO_FACULTY, FACULTY, facultyCopy } from "@/app/bienvenida/faculty";

// Equipo docente con cara. Sustituye a la rejilla de roles abstractos: quien
// paga un programa elige también por quién lo imparte, y tres tarjetas sin
// persona no responden a esa pregunta.
export async function FacultySection() {
  // Mientras los nombres y las fotos sean de muestra, la sección no se pinta.
  // Un aviso de "datos de ejemplo" bajo tres retratos de Unsplash no arregla
  // que se esté vendiendo formación con profesorado que no existe: lo que
  // arregla el problema es no enseñarlo hasta tener al equipo real.
  if (DEMO_FACULTY) return null;

  const locale = await getLocale();
  const c = facultyCopy[locale];

  return (
    <section id="equipo" className="axr-lp__faculty axr-fac">
      <header className="axr-fac__head">
        <span className="axr-lp__eyebrow">{c.eyebrow}</span>
        <h2>{c.title}</h2>
        <p>{c.lead}</p>
      </header>

      <div className="axr-fac__grid">
        {FACULTY.map((person) => {
          const p = person[locale];
          return (
            <article key={person.id} className="axr-fac__card" data-lead={person.lead}>
              <div className="axr-fac__photo">
                <Image
                  src={person.photo}
                  alt={`${person.name}, ${p.role}`}
                  width={600}
                  height={600}
                  sizes="(max-width: 640px) 40vw, (max-width: 1040px) 45vw, 260px"
                />
              </div>

              <div className="axr-fac__body">
                <span className="axr-fac__role">{p.role}</span>
                <h3>{person.name}</h3>
                <span className="axr-fac__area">{p.area}</span>
                <p>{p.bio}</p>

                <div className="axr-fac__teaches">
                  <span className="axr-fac__teaches-label">{c.teachesLabel}</span>
                  <ul>
                    {p.teaches.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Mientras las fotos sean de muestra, se dice. Ver faculty.ts. */}
      {DEMO_FACULTY && <p className="axr-fac__notice">{c.demoNotice}</p>}
    </section>
  );
}
