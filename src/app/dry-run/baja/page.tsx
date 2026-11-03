import type { Metadata } from "next";
import Link from "next/link";

import { darseDeBaja } from "@/app/dry-run/actions";
import { BrandMark } from "@/components/brand-mark";
import { createAdminClient } from "@/lib/supabase/admin";
import "@/app/dry-run/dry-run.scss";

export const metadata: Metadata = { title: "Correos del dry run · ActiveXRemote", robots: { index: false, follow: false } };

// /dry-run/baja?t=<token> — dejar de recibir los correos de un dry run.
// Pide confirmar con un botón: abrir el enlace no da de baja (ver darseDeBaja).

export default async function BajaDryRun({ searchParams }: { searchParams: Promise<{ t?: string; hecho?: string }> }) {
  const { t = "", hecho } = await searchParams;
  const valido = /^[a-f0-9]{32}$/.test(t);
  const guest = valido
    ? (await createAdminClient().from("dry_run_guests").select("email, unsubscribed_at").eq("token", t).maybeSingle()).data
    : null;

  return (
    <main className="axr-dr">
      <header className="axr-dr__bar">
        <Link href="/bienvenida" className="axr-dr__brand">
          <BrandMark size={20} />
          <span>ActiveXRemote</span>
        </Link>
      </header>
      <section className="axr-dr__narrow">
        <div className="axr-dr__card">
          {!guest ? (
            <>
              <h1>Enlace no válido</h1>
              <p>Este enlace no corresponde a ninguna invitación. Si quieres dejar de recibir correos, responde a cualquiera de ellos y te damos de baja a mano.</p>
            </>
          ) : hecho || guest.unsubscribed_at ? (
            <>
              <h1>Hecho</h1>
              <p>
                No te mandaremos más correos sobre este dry run a <strong>{guest.email}</strong>. Si tenías plaza, la conservas, y también el acceso al campus.
              </p>
            </>
          ) : (
            <form action={darseDeBaja}>
              <h1>¿Dejar de recibir estos correos?</h1>
              <p>
                Dejaremos de escribir a <strong>{guest.email}</strong> sobre este dry run. Si tienes plaza, la conservas, y también el acceso al campus.
              </p>
              <input type="hidden" name="t" value={t} />
              <button type="submit" className="axr-dr__cta">
                Sí, no quiero más correos
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
