import Link from "next/link";

import { Icono } from "@/components/admin/publicaciones/iconos";
import { getMiDryRun } from "@/lib/dry-run/datos";
import { PASOS } from "@/lib/dry-run/preparacion";
import { cuandoEs } from "@/lib/dry-run/tiempo";
import "@/app/(campus)/preparacion/preparacion.scss";

/**
 * En la portada del campus, para quien tiene plaza en un dry run: cuándo es,
 * cuánto lleva de la preparación y el enlace a ella. Después de la clase, el
 * enlace al feedback mientras no lo haya dejado.
 */
export async function AvisoDryRun() {
  const mio = await getMiDryRun();
  if (!mio) return null;
  const { run, guest } = mio;

  const terminado = new Date(run.ends_at).getTime() < Date.now();
  if (terminado && guest.feedback_at) return null;

  const hechos = PASOS.filter((p) => guest.onboarding[p.key]).length;
  return (
    <Link href={terminado ? "/preparacion#feedback" : "/preparacion"} className="axr-dr-aviso">
      <Icono n="calendario" size={22} />
      <span className="axr-dr-aviso__text">
        <strong>{terminado ? "¿Qué te pareció el dry run?" : run.title}</strong>
        <span>{terminado ? "Déjanos tu feedback: son tres minutos." : `${cuandoEs(run.starts_at, run.ends_at)} · Preparación: ${hechos} de ${PASOS.length}`}</span>
      </span>
      <span className="axr-btn">
        {terminado ? "Dejar mi feedback" : "Ir a mi preparación"} <Icono n="flecha" />
      </span>
    </Link>
  );
}
