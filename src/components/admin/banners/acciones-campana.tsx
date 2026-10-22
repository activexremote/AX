"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { anadirVariantes, borrarCampana } from "@/app/admin/banners/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { ANGULOS, type Angulo } from "@/lib/banners/formatos";
import type { BanCopy } from "@/lib/i18n/banners";

export function AccionesCampana({ id, copy, aprobadas }: { id: string; copy: BanCopy; aprobadas: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [angles, setAngles] = useState<Angulo[]>([]);

  return (
    <div className="axr-bancamp__actions">
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
                onChange={() => setAngles((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]))}
              />
              <span>
                <strong>{copy.angle[a]}</strong> <small>{copy.angleHint[a]}</small>
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

      {aprobadas ? (
        <a href={`/admin/banners/${id}/zip`} className="axr-btn">
          <Icono n="descarga" /> {copy.downloadApproved}
        </a>
      ) : null}

      <button
        type="button"
        className="axr-btn axr-btn--ghost axr-ban-danger"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(copy.confirmDelete)) return;
          start(async () => {
            const r = await borrarCampana(id);
            if (r.error) setError(r.error);
            else router.push("/admin/banners");
          });
        }}
      >
        <Icono n="papelera" /> {copy.deleteCampaign}
      </button>
      {error ? <div className="axr-login__error">{error}</div> : null}
    </div>
  );
}
