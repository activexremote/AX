import Link from "next/link";

import { AlProximoHueco } from "@/components/admin/publicaciones/al-proximo-hueco";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { RellenarHuecos } from "@/components/admin/publicaciones/rellenar-huecos";
import { getLocale } from "@/lib/i18n/server";
import { fill, pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { duracion } from "@/lib/social/calendario";
import { cargarPanel } from "@/lib/social/panel";

// ══════════════════════════════════════════════════════════
//  La nevera, canal a canal
//
//  Una columna por red, con lo que hay guardado y cuánto alarga la
//  cobertura. Arriba, lo que importa en una frase y el botón que lo reparte
//  todo por los huecos libres.
// ══════════════════════════════════════════════════════════

export default async function NeveraPage() {
  const locale = await getLocale();
  const copy = pubCopy[locale];
  const panel = await cargarPanel(locale);
  const nevera = panel.variantes.filter((v) => v.status === "nevera").sort((a, b) => a.updated_at.localeCompare(b.updated_at));
  const fecha = (iso: string) => new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "short" });

  return (
    <div className="axr-admin-page">
      <div className="axr-pubpage-head axr-pubpage-head--row">
        <div>
          <h1>{copy.fridgeTitle}</h1>
          <p>{copy.uFridgeLead}</p>
        </div>
        {nevera.length ? <RellenarHuecos copy={copy} label={fill(copy.uFillAll, nevera.length)} /> : null}
      </div>

      <div className="axr-pubboard">
        {CANALES.map((c) => {
          const k = panel.cobertura[c];
          const items = nevera.filter((v) => v.channel === c);
          return (
            <section key={c} className={`axr-pubboard__col axr-pubboard__col--${c}`}>
              <header className="axr-pubboard__head">
                <span className={`axr-pub-dot axr-pub-dot--${c}`} />
                <strong>{NOMBRE_CANAL[c]}</strong>
                <span className="axr-pubboard__n">{items.length}</span>
              </header>
              <p className="axr-pubboard__cover">
                {!k.activo
                  ? copy.uNoRhythm
                  : items.length
                    ? fill(copy.uFridgeExtends, `${k.hasta ? duracion(k.dias, locale) : copy.uEmpty} → ${duracion(k.diasConNevera, locale)}`)
                    : fill(copy.uFridgeCovered, k.hasta ? duracion(k.dias, locale) : copy.uEmpty)}
              </p>
              {items.length ? (
                <ul className="axr-pubboard__list">
                  {items.map((v) => (
                    <li key={v.id}>
                      <Link href={`/admin/publicaciones/${v.post_id}?canal=${c}`} className="axr-pubboard__title">
                        {v.title}
                      </Link>
                      <div className="axr-pubboard__foot">
                        <span>{fill(copy.uSavedOn, fecha(v.updated_at))}</span>
                        <AlProximoHueco id={v.id} copy={copy} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="axr-pubboard__empty">
                  <span>{copy.uFridgeColEmpty}</span>
                  <Link href={`/admin/publicaciones/nueva?canal=${c}`} className="axr-btn axr-btn--ghost">
                    <Icono n="mas" /> {copy.uCreate}
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <p className="axr-pubtip">
        <Icono n="info" /> {copy.fridgeTip}
      </p>
    </div>
  );
}
