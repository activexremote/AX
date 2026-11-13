// ══════════════════════════════════════════════════════════
//  Los mensajes del equipo comercial
//
//  Los mismos en el playbook (y su PDF) y en la ficha de cada lead, donde se
//  copian o se abren ya escritos en WhatsApp con los datos de la persona.
//  Sólo importa los precios, con la extensión .ts: así lo lee también el
//  script del PDF con Node, sin compilar.
//
//  Marcas: {nombre}, {comercial} y {curso}.
// ══════════════════════════════════════════════════════════

import { calcularPlazos, euros, PLAZOS_POR_DEFECTO, PRECIO_CONTADO, PRECIO_PLAZOS, resumenPlazos } from "./precios.ts";

const PAGO = `pago único de ${euros(PRECIO_CONTADO)}, o a plazos: ${euros(PRECIO_PLAZOS)} en total (${resumenPlazos(calcularPlazos(PRECIO_PLAZOS, PLAZOS_POR_DEFECTO, "2027-01-01"))})`;

export type Plantilla = {
  id: string;
  titulo: string;
  /** Cuándo se usa, en una línea. */
  cuando: string;
  canal: "whatsapp" | "email";
  asunto?: string;
  texto: string;
};

export const PLANTILLAS: Plantilla[] = [
  {
    id: "primer-contacto",
    titulo: "Primer contacto",
    cuando: "En las primeras horas después de la solicitud, si no coge la llamada.",
    canal: "whatsapp",
    texto: `Hola, {nombre}. Soy {comercial}, de ActiveXRemote.

Has pedido información sobre {curso}. Te he llamado hace un momento para contártelo en cinco minutos y resolver tus dudas.

¿Cuándo te viene bien que hablemos? Si prefieres, te lo cuento por aquí.`,
  },
  {
    id: "sin-respuesta",
    titulo: "No contesta (día 2 o 3)",
    cuando: "Segundo intento, sin presión y con algo útil.",
    canal: "whatsapp",
    texto: `Hola de nuevo, {nombre}.

Para que no se quede en el aire: el próximo grupo empieza el 9 de enero, son 7 fines de semana en directo y grupos de 25 personas.

Si me dices qué buscas (trabajar en remoto para empresas de fuera o montar tu propio negocio), te digo en dos líneas qué curso te encaja.`,
  },
  {
    id: "tras-llamada",
    titulo: "Resumen después de la llamada",
    cuando: "El mismo día de la llamada. Por escrito lo que se ha hablado.",
    canal: "email",
    asunto: "Lo que hemos hablado: {curso}",
    texto: `Hola, {nombre}:

Gracias por la conversación de hoy. Te dejo por escrito lo que hemos visto:

· Curso: {curso}.
· Fechas: del 9 de enero al 21 de febrero de 2027, 7 fines de semana, sábado y domingo, 4 horas en directo cada día.
· Grupo: 25 plazas, online.
· Incluye: 14 módulos en directo, el campus con las grabaciones sin caducidad, plantillas, un ejercicio con feedback en cada módulo, comunidad en Slack y el diploma de ActiveXRemote.

Cualquier duda, me escribes por aquí o por WhatsApp.

{comercial}
ActiveXRemote`,
  },
  {
    id: "duda",
    titulo: "Para quien «se lo está pensando»",
    cuando: "Unos días después de la llamada, si no ha decidido.",
    canal: "whatsapp",
    texto: `Hola, {nombre}. ¿Cómo lo llevas?

Una pregunta rápida para no hacerte perder el tiempo: ¿qué es lo que te frena ahora mismo? ¿Las fechas, el precio, o saber si es para ti?

Me dices y lo miramos juntos, sin compromiso.`,
  },
  {
    id: "cierre",
    titulo: "Siguiente paso para reservar",
    cuando: "Cuando dice que sí.",
    canal: "whatsapp",
    texto: `Genial, {nombre}.

Para reservar tu plaza en {curso} necesito confirmar contigo:
1. La forma de pago: ${PAGO}.
2. Tus datos para la factura.

En cuanto lo tenga te llega el enlace de pago seguro, con Stripe. Las plazas se asignan por orden de reserva.`,
  },
  {
    id: "despedida",
    titulo: "Cerrar con buen sabor de boca",
    cuando: "Cuando dice que no, o no es su momento.",
    canal: "whatsapp",
    texto: `Entendido, {nombre}, gracias por decírmelo.

Si más adelante te encaja, aquí me tienes. Te aviso cuando abramos el siguiente grupo, si te parece bien.

Mucha suerte con todo.`,
  },
];

export type MarcaPlantilla = "nombre" | "comercial" | "curso";

/** Rellena las marcas; las que no tengan valor se quedan tal cual, para verlas. */
export function rellenarPlantilla(texto: string, valores: Partial<Record<MarcaPlantilla, string>>) {
  return texto.replace(/\{(\w+)\}/g, (m, k: string) => valores[k as keyof typeof valores] || m);
}
