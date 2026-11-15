import type { Metadata } from "next";
import Link from "next/link";

import { CampusHeader } from "@/components/campus-header";
import { PruebaEquipo } from "@/components/campus/dry-run/prueba-equipo";
import { getI18n } from "@/lib/i18n/server";
import { preparacionCopy } from "@/lib/i18n/preparacion";
import "@/app/(campus)/preparacion/preparacion.scss";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  return { title: `${preparacionCopy[locale].eqTitle} · ActiveXRemote` };
}

// La prueba de cámara, micrófono y conexión antes de la clase. Si todo
// funciona, marca el paso «equipo» de la lista de preparación.
export default async function EquipoPage() {
  const { locale } = await getI18n();
  const c = preparacionCopy[locale];
  return (
    <>
      <CampusHeader />
      <div className="axr-c-wrap axr-prep">
        <p>
          <Link href="/preparacion">{c.eqBack}</Link>
        </p>
        <section className="axr-c-card">
          <h1 className="axr-eq__title">{c.eqTitle}</h1>
          <p className="axr-prep__text">{c.eqLead}</p>
          <PruebaEquipo copy={c} />
          <p className="axr-prep__text">{c.eqTips}</p>
        </section>
      </div>
    </>
  );
}
