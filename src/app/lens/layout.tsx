import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandMark } from "@/components/brand-mark";
import { getLensSession } from "@/lib/lens/auth";
import "@/app/lens/lens.scss";

export default async function LensLayout({ children }: { children: React.ReactNode }) {
  const session = await getLensSession();
  if (!session) redirect("/login");
  if (!session.isSuperAdmin) redirect("/");

  return (
    <div className="axr-lens">
      <aside className="axr-lens__sidebar">
        <Link href="/lens" className="axr-lens__logo">
          <BrandMark size={20} className="axr-lens__logo-mark" />
          Lens
        </Link>
        <div className="axr-lens__role">Panel de dirección · Superadmin</div>
        <nav className="axr-lens__nav">
          <Link href="/lens/calculadora-matriculas">Calculadora de matrículas</Link>
        </nav>
        <div className="axr-lens__back">
          <Link href="/admin">← Volver al admin</Link>
        </div>
      </aside>
      <main className="axr-lens__main">{children}</main>
    </div>
  );
}
