import { redirect } from "next/navigation";

import { PubHeader, type Chip } from "@/components/admin/publicaciones/pub-tabs";
import { getCurrentProfile } from "@/lib/data/profile";
import { getLocale } from "@/lib/i18n/server";
import { pubCopy } from "@/lib/i18n/publicaciones";
import { CANALES, NOMBRE_CANAL } from "@/lib/social/canales";
import { duracion } from "@/lib/social/calendario";
import { formatoUsd } from "@/lib/social/costes";
import { cargarPanel } from "@/lib/social/panel";
import "@/app/admin/publicaciones/publicaciones.scss";

// Toda la sección es sólo de administradores: publicar en nombre de la
// escuela es hablar por ella. El layout del panel ya deja fuera a los
// alumnos; esto deja fuera también a los profesores.
export default async function PublicacionesLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "administrador") redirect("/admin");

  const locale = await getLocale();
  const copy = pubCopy[locale];
  // La misma carga que usa la página: `cargarPanel` va en `cache`.
  const panel = await cargarPanel(locale);
  const { settings, cobertura, cuentas, cuota, saldo, porEstado, tareas } = panel;

  const chips: Chip[] = CANALES.map((c) => {
    const k = cobertura[c];
    const cuenta = c === "blog" ? null : cuentas?.[c];
    if (!k.activo) return { tono: "neutro", label: NOMBRE_CANAL[c], valor: copy.uNoRhythm, href: "/admin/publicaciones/ajustes#ritmo", canal: c };
    if (cuenta && (!cuenta.conectada || cuenta.reautorizar)) {
      return { tono: "mal", label: NOMBRE_CANAL[c], valor: copy.uNotConnected, href: "/admin/publicaciones/ajustes#upload-post", canal: c };
    }
    const tono = k.dias >= settings.alertDays ? "ok" : k.dias > 2 ? "aviso" : "mal";
    return { tono, label: NOMBRE_CANAL[c], valor: k.hasta ? duracion(k.dias, locale) : copy.uEmpty, href: "/admin/publicaciones/calendario", canal: c };
  });

  const sinClave = settings.deepseekSource === "ninguna";
  chips.push({
    tono: sinClave || (saldo !== null && saldo <= 0) ? "mal" : saldo !== null && saldo < settings.minBalanceUsd ? "aviso" : saldo === null ? "neutro" : "ok",
    label: copy.uAi,
    valor: sinClave ? copy.uNoKey : saldo === null ? "—" : formatoUsd(saldo, locale),
    href: sinClave ? "/admin/publicaciones/ajustes#deepseek" : "https://platform.deepseek.com/top_up",
    externo: !sinClave,
  });
  if (cuota.limite) {
    chips.push({
      tono: cuota.usadas >= cuota.limite ? "mal" : cuota.usadas >= cuota.limite * 0.8 ? "aviso" : "ok",
      label: copy.uQuota,
      valor: `${cuota.usadas}/${cuota.limite}`,
      href: "/admin/publicaciones/calendario",
    });
  }

  const configPendiente = tareas.some((t) => t.id === "clave" || t.id === "ritmo" || t.id.startsWith("cuenta-"));

  return (
    <div className="axr-pubsec">
      <PubHeader
        nueva={copy.new}
        estadoLabel={copy.uStatus}
        chips={chips}
        tabs={[
          { href: "/admin/publicaciones", label: copy.uHome, icon: "inicio", exact: true },
          { href: "/admin/publicaciones/revisar", label: copy.uReview, icon: "revisar", badge: porEstado.borrador + porEstado.error, tono: "alerta" },
          { href: "/admin/publicaciones/calendario", label: copy.tabCalendar, icon: "calendario", badge: porEstado.programado },
          { href: "/admin/publicaciones/nevera", label: copy.tabFridge, icon: "nevera", badge: porEstado.nevera },
          { href: "/admin/publicaciones/todas", label: copy.uAll, icon: "lista" },
          { href: "/admin/publicaciones/ajustes", label: copy.tabSettings, icon: "ajustes", punto: configPendiente },
        ]}
      />
      {children}
    </div>
  );
}
