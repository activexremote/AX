import { PLANTILLAS, rellenarPlantilla } from "@/lib/comercial/plantillas";
import type { Bloque } from "@/lib/comercial/playbook";
import type { ComercialCopy } from "@/lib/i18n/comercial";

// Cada tipo de bloque del playbook (lib/comercial/playbook.ts), pintado en el
// panel. El PDF tiene su propia versión en scripts/playbook-comercial.mts.
export function PiezaPlaybook({ b, c }: { b: Bloque; c: ComercialCopy }) {
  switch (b.t) {
    case "p":
      return <p>{b.x}</p>;
    case "cita":
      return <blockquote className="axr-pb-quote">{b.x}</blockquote>;
    case "aviso":
      return (
        <div className="axr-pb-note">
          <strong>{c.pbImportant}</strong>
          <p>{b.x}</p>
        </div>
      );
    case "lista":
      return (
        <ol className="axr-pb-list">
          {b.x.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
      );
    case "pasos":
      return (
        <div className="axr-pb-steps">
          {b.x.map((p) => (
            <div key={p.titulo}>
              <h4>{p.titulo}</h4>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      );
    case "tabla":
      return (
        <div className="axr-com-scroll">
          <table className="axr-pb-table">
            <thead>
              <tr>
                {b.cab.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.filas.map((f) => (
                <tr key={f[0]}>
                  {f.map((x, i) => (i === 0 ? <th key={i} scope="row">{x}</th> : <td key={i}>{x}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "senales":
      return (
        <div className="axr-pb-signals">
          {(["verde", "ambar", "rojo"] as const).map((k) => (
            <div key={k} data-tone={k}>
              <h4>{c.pbSignals[k]}</h4>
              <ul>
                {b[k].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "di":
      return (
        <div className="axr-pb-say">
          <div data-tone="si">
            <h4>{c.pbSay}</h4>
            <ul>
              {b.si.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div data-tone="no">
            <h4>{c.pbDont}</h4>
            <ul>
              {b.no.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "objeciones":
      return (
        <div className="axr-pb-objs">
          {b.x.map((o) => (
            <details key={o.dice}>
              <summary>«{o.dice}»</summary>
              <small>
                {c.pbBehind} {o.piensa}
              </small>
              <p>{o.responde}</p>
            </details>
          ))}
        </div>
      );
    case "plantillas":
      return (
        <div className="axr-pb-msgs">
          {PLANTILLAS.map((p) => (
            <div key={p.id}>
              <h4>
                {p.titulo} <span>{p.canal === "whatsapp" ? "WhatsApp" : c.email}</span>
              </h4>
              <small>{p.cuando}</small>
              <pre>{rellenarPlantilla(p.texto, {})}</pre>
            </div>
          ))}
        </div>
      );
  }
}
