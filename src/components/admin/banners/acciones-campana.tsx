"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  anadirVariantes,
  borrarCampana,
  masClones,
} from "@/app/admin/banners/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { ANGULOS, type Angulo } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";
import { fill } from "@/lib/i18n/publicaciones";

export function AccionesCampana({
  id,
  copy,
  aprobadas,
  clon = false,
}: {
  id: string;
  copy: BanCopy;
  aprobadas: number;
  clon?: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [angles, setAngles] = useState<Angulo[]>([]);
  const [n, setN] = useState(3);
  const [indicacion, setIndicacion] = useState("");
  const [borrando, setBorrando] = useState(false);

  return (
    <div className="axr-bancamp__actions">
      {clon ? (
        // Un clon crece desde su referencia, no desde ángulos.
        <details className="axr-ban-pop">
          <summary className="axr-btn axr-btn--ghost">
            <Icono n="capas" /> {copy.moreClones}
          </summary>
          <div className="axr-ban-pop__body">
            <div
              className="axr-ban-count-pick"
              role="radiogroup"
              aria-label={copy.countLabel}
            >
              {[1, 2, 3, 4, 5].map((k) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={n === k}
                  className={n === k ? "is-on" : ""}
                  onClick={() => setN(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={indicacion}
              onChange={(e) => setIndicacion(e.target.value)}
              placeholder={copy.promptPh}
              maxLength={1500}
            />
            <button
              type="button"
              className="axr-btn"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  setError(null);
                  const r = await masClones(id, n, indicacion);
                  if (r.error) setError(r.error);
                  setIndicacion("");
                  router.refresh();
                })
              }
            >
              <Icono n="chispa" />{" "}
              {pending ? copy.generating : fill(copy.moreClonesGo, n)}
            </button>
          </div>
        </details>
      ) : null}
      {clon ? null : (
        <details className="axr-ban-pop">
          <summary className="axr-btn axr-btn--ghost">
            <Icono n="mas" /> {copy.addVariants}
          </summary>
          <div className="axr-ban-pop__body">
            {ANGULOS.map((a) => (
              <label key={a}>
                <input
                  type="checkbox"
                  checked={angles.includes(a)}
                  onChange={() =>
                    setAngles((p) =>
                      p.includes(a) ? p.filter((x) => x !== a) : [...p, a],
                    )
                  }
                />
                <span>
                  <strong>{copy.angle[a]}</strong>{" "}
                  <small>{copy.angleHint[a]}</small>
                </span>
              </label>
            ))}
            <button
              type="button"
              className="axr-btn"
              disabled={pending || !angles.length}
              onClick={() =>
                start(async () => {
                  setError(null);
                  const r = await anadirVariantes(id, angles);
                  if (r.error) setError(r.error);
                  setAngles([]);
                  router.refresh();
                })
              }
            >
              <Icono n="chispa" /> {pending ? copy.generating : copy.generate}
            </button>
          </div>
        </details>
      )}

      {aprobadas ? (
        <a href={`/admin/banners/${id}/zip`} className="axr-btn">
          <Icono n="descarga" /> {copy.downloadApproved}
        </a>
      ) : null}

      {borrando ? (
        <span className="axr-ban-confirm">
          <button
            type="button"
            className="axr-btn axr-btn--danger"
            disabled={pending}
            title={copy.confirmDelete}
            onClick={() =>
              start(async () => {
                const r = await borrarCampana(id);
                if (r.error) setError(r.error);
                else router.push("/admin/banners");
              })
            }
          >
            <Icono n="papelera" /> {copy.confirmDeleteShort}
          </button>
          <button type="button" className="axr-btn axr-btn--ghost" onClick={() => setBorrando(false)}>
            {copy.cancel}
          </button>
        </span>
      ) : (
        <button type="button" className="axr-btn axr-btn--ghost axr-ban-danger" disabled={pending} onClick={() => setBorrando(true)}>
          <Icono n="papelera" /> {copy.deleteCampaign}
        </button>
      )}
      {error ? <div className="axr-login__error">{error}</div> : null}
    </div>
  );
}

/** Borrar una campaña desde la lista, en dos pasos y sin salir de la lista. */
export function BorrarCampana({ id, copy }: { id: string; copy: BanCopy }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [armado, setArmado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!armado) {
    return (
      <button type="button" className="axr-ban-card__del" aria-label={copy.deleteCampaign} title={copy.deleteCampaign} onClick={() => setArmado(true)}>
        <Icono n="papelera" size={14} />
      </button>
    );
  }
  return (
    <span className="axr-ban-card__confirm" title={copy.confirmDelete}>
      <button
        type="button"
        className="axr-btn axr-btn--danger"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await borrarCampana(id);
            if (r.error) setError(r.error);
            else router.refresh();
          })
        }
      >
        {pending ? "…" : copy.confirmDeleteShort}
      </button>
      <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => setArmado(false)}>
        {copy.cancel}
      </button>
      {error ? <small className="axr-ban-card__err">{error}</small> : null}
    </span>
  );
}
