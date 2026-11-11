import { PiezaPlaybook } from "@/components/admin/comercial/pieza-playbook";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { exigirComercial } from "@/lib/comercial/acceso";
import { PLAYBOOK, PLAYBOOK_VERSION } from "@/lib/comercial/playbook";
import { comCopy } from "@/lib/i18n/comercial";
import { getLocale } from "@/lib/i18n/server";
import "../comercial.scss";

// ══════════════════════════════════════════════════════════
//  El playbook comercial, en el panel
//
//  El mismo contenido que el PDF (lib/comercial/playbook.ts), con índice
//  para saltar a la sección que haga falta antes de una llamada.
// ══════════════════════════════════════════════════════════

export default async function PlaybookPage() {
  await exigirComercial();
  const c = comCopy[await getLocale()];

  return (
    <div className="axr-admin-page axr-com axr-pb">
      <div className="axr-admin-page__header">
        <div>
          <h1>{c.pbTitle}</h1>
          <p>
            {c.pbLead} · {PLAYBOOK_VERSION}
          </p>
        </div>
        <div>
          <a href="/admin/comercial/playbook/pdf" className="axr-btn">
            <Icono n="descarga" size={16} /> {c.pbPdf}
          </a>
        </div>
      </div>

      <div className="axr-pb-layout">
        <nav className="axr-pb-toc" aria-label={c.pbContents}>
          <strong>{c.pbContents}</strong>
          <ol>
            {PLAYBOOK.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span> {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="axr-pb-body">
          {PLAYBOOK.map((s, i) => (
            <section key={s.id} id={s.id} className="axr-admin-card axr-pb-sec">
              <span className="axr-pb-num">{String(i + 1).padStart(2, "0")}</span>
              <h2>{s.titulo}</h2>
              <p className="axr-pb-lead">{s.entradilla}</p>
              {s.bloques.map((b, j) => (
                <PiezaPlaybook key={j} b={b} c={c} />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
