"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { borrarPublicacion, crearVersionIdioma, desecharVariante } from "@/app/admin/publicaciones/actions";
import { Icono } from "@/components/admin/publicaciones/iconos";
import { fill, type PubCopy } from "@/lib/i18n/publicaciones";

/**
 * Desechar desde las listas (por revisar, nevera, todas) sin abrir la
 * publicación. `post` la borra entera con todos sus canales; `variante`,
 * sólo ese canal. Confirmación en línea: un `confirm()` del navegador
 * bloquea la pestaña.
 */
export function Desechar({ que, id, copy }: { que: "post" | "variante"; id: string; copy: PubCopy }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [armado, setArmado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!armado) {
    return (
      <button
        type="button"
        className="axr-btn axr-btn--ghost axr-pubdiscard"
        title={que === "post" ? copy.discardPostTitle : copy.discardVariantTitle}
        onClick={() => setArmado(true)}
      >
        <Icono n="papelera" size={14} /> {copy.discard}
      </button>
    );
  }

  return (
    <span className="axr-pubdiscard__confirm">
      {error ? <span className="axr-pubdiscard__error">{error}</span> : <span>{copy.discardSure}</span>}
      <button
        type="button"
        className="axr-btn axr-btn--danger"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const r = que === "post" ? await borrarPublicacion(id) : await desecharVariante(id);
            if (r.error) {
              setError(r.error);
              return;
            }
            setArmado(false);
            router.refresh();
          })
        }
      >
        {copy.discard}
      </button>
      <button type="button" className="axr-btn axr-btn--ghost" disabled={pending} onClick={() => setArmado(false)}>
        {copy.cancel}
      </button>
    </span>
  );
}

/** La pastilla de idioma, para distinguir en las listas las dos de una pareja. */
export function PildoraIdioma({ language }: { language: "es" | "en" }) {
  return <span className={`axr-publang axr-publang--${language}`}>{language.toUpperCase()}</span>;
}

/**
 * En el editor: el enlace a la misma publicación en el otro idioma o, si aún
 * no existe, el botón que la crea adaptando ésta.
 */
export function ParejaIdioma({
  postId,
  pairId,
  language,
  copy,
}: {
  postId: string;
  pairId: string | null;
  language: "es" | "en";
  copy: PubCopy;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const otro = language === "es" ? "en" : "es";
  const nombre = copy[`langName_${otro}`];

  if (pairId) {
    return (
      <Link href={`/admin/publicaciones/${pairId}`} className="axr-btn axr-btn--ghost">
        <PildoraIdioma language={otro} /> {fill(copy.pairLink, nombre)}
      </Link>
    );
  }
  return (
    <span className="axr-pubdiscard__confirm">
      {error ? <span className="axr-pubdiscard__error">{error}</span> : null}
      <button
        type="button"
        className="axr-btn axr-btn--ghost"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const r = await crearVersionIdioma(postId);
            if (r.id) router.push(`/admin/publicaciones/${r.id}${r.error ? `?aviso=${encodeURIComponent(r.error)}` : ""}`);
            else setError(r.error ?? "Error");
          })
        }
      >
        <Icono n="chispa" size={14} /> {pending ? copy.pairCreating : fill(copy.pairCreate, nombre)}
      </button>
    </span>
  );
}
