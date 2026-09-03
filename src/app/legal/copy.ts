import type { Locale } from "@/lib/i18n/config";

import { ENTITY, EU_REP_ADDRESS } from "@/app/legal/entity";

// ══════════════════════════════════════════════════════════
//  Textos legales. ActiveX FZC LLC está constituida en Emiratos Árabes
//  Unidos: no le vincula la LSSI española (que obliga a prestadores
//  establecidos en España), pero sí el RGPD por el artículo 3.2, porque
//  ofrece el programa a personas que están en la Unión, en euros y en
//  español. De ahí el encuadre de estos textos.
//
//  Redactados sobre lo que la plataforma hace de verdad:
//  el formulario de captación (supabase/migrations/0005_leads.sql), el aviso
//  interno a Slack (src/lib/slack/notify.ts), la cookie de idioma
//  (src/lib/i18n/config.ts), la sesión del campus (Supabase Auth) y el
//  alojamiento en Vercel. Si cambia el tratamiento, cambian estos textos.
//
//  ⚠︎ No sustituyen a la revisión de un abogado ni al registro de
//  actividades de tratamiento: son la base redactada, no el visto bueno.
// ══════════════════════════════════════════════════════════

const E = {
  name: ENTITY.legalName,
  licence: ENTITY.licenceNo || "[Nº DE LICENCIA COMERCIAL]",
  addr: ENTITY.address,
  mail: ENTITY.email || "[CORREO DE CONTACTO]",
  domain: ENTITY.domain,
  country: ENTITY.country,
  rep: [ENTITY.euRepresentative, EU_REP_ADDRESS || "[DIRECCIÓN POSTAL EN LA UE — pendiente]"]
    .filter(Boolean)
    .join(", "),
};

export type LegalBlock =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "note"; text: string };

export type LegalSection = { h: string; blocks: LegalBlock[] };

export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
};

export type LegalSlug = "aviso-legal" | "privacidad" | "cookies" | "terminos";

/** Fecha de última revisión de los cuatro documentos. */
const UPDATED_ES = "18 de agosto de 2026";
const UPDATED_EN = "18 August 2026";

// ══════════════════════════════════════════════════════════
//  ESPAÑOL
// ══════════════════════════════════════════════════════════

const AVISO_ES: LegalDoc = {
  slug: "aviso-legal",
  title: "Aviso legal y condiciones de uso",
  summary:
    "Quién está detrás de este sitio, qué puedes hacer en él y qué no, y de quién es cada cosa que ves aquí.",
  updated: UPDATED_ES,
  sections: [
    {
      h: "1. Titularidad del sitio",
      blocks: [
        {
          t: "p",
          text: `El titular de este sitio web es ${E.name}, sociedad de zona franca constituida en ${E.country}, con licencia comercial nº ${E.licence} y domicilio en ${E.addr}. Su actividad declarada es la consultoría educativa. Puedes escribirnos a ${E.mail} para cualquier cuestión relacionada con el sitio o con los programas.`,
        },
        {
          t: "p",
          text: "Publicamos estos datos porque la normativa europea de consumo obliga a identificar al empresario de forma clara antes de contratar, y porque dirigimos nuestros programas a personas residentes en la Unión Europea. Al no estar establecidos en España, no nos resulta de aplicación la Ley 34/2002 de servicios de la sociedad de la información, pero sí las obligaciones de información y protección que la normativa de consumo de tu país de residencia impone a quien le dirige su actividad.",
        },
        {
          t: "p",
          text: `El nombre comercial bajo el que operamos es ${ENTITY.tradeName} y el dominio principal es ${E.domain}.`,
        },
      ],
    },
    {
      h: "2. Objeto",
      blocks: [
        {
          t: "p",
          text: "Este sitio tiene dos partes con propósitos distintos. La parte pública presenta los programas formativos de la escuela, sus contenidos, su calendario y sus condiciones, y permite solicitar información sin ningún compromiso. La parte privada —el campus virtual— es la plataforma donde el alumnado matriculado sigue el programa: lecciones, materiales, grabaciones, entregas y seguimiento.",
        },
        {
          t: "p",
          text: "Navegar por la parte pública no crea ninguna relación contractual. La relación nace cuando formalizas una matrícula, y entonces se rigen por las Condiciones de contratación.",
        },
      ],
    },
    {
      h: "3. Condiciones de acceso y uso",
      blocks: [
        {
          t: "p",
          text: "El acceso al sitio es libre y gratuito, salvo el coste de la conexión que te preste tu operador. Al usarlo te comprometes a hacerlo conforme a la ley, a la buena fe y a este aviso legal, y en particular a no:",
        },
        {
          t: "ul",
          items: [
            "Introducir o difundir contenidos ilícitos, difamatorios, discriminatorios o que vulneren derechos de terceros.",
            "Intentar acceder a áreas restringidas, cuentas ajenas o sistemas de información del titular sin autorización.",
            "Interferir en el funcionamiento del sitio: introducir código malicioso, provocar sobrecargas o alterar sus contenidos.",
            "Extraer de forma sistemática y masiva los contenidos del sitio, ya sea de forma manual o automatizada, para reutilizarlos.",
            "Suplantar la identidad de otras personas o de la propia escuela.",
          ],
        },
      ],
    },
    {
      h: "4. El campus virtual",
      blocks: [
        {
          t: "p",
          text: "El campus virtual es de acceso restringido al alumnado matriculado. Las credenciales son personales e intransferibles: eres responsable de custodiarlas y de la actividad que se realice con tu cuenta. Si detectas un uso no autorizado, avísanos de inmediato en la dirección indicada más arriba.",
        },
        {
          t: "p",
          text: "Compartir credenciales, descargar de forma masiva los materiales o difundir las grabaciones fuera del campus es motivo de suspensión del acceso, sin perjuicio de las acciones legales que correspondan.",
        },
      ],
    },
    {
      h: "5. Propiedad intelectual e industrial",
      blocks: [
        {
          t: "p",
          text: "Los contenidos del sitio y del campus —textos, materiales formativos, grabaciones, plantillas, frameworks, código, diseño, estructura de navegación y marca— son titularidad de la escuela o se usan con licencia bastante, y están protegidos por la normativa de propiedad intelectual e industrial.",
        },
        {
          t: "p",
          text: "La matrícula da derecho a una licencia de uso personal, no exclusiva e intransferible sobre los materiales, con la única finalidad de seguir el programa. No incluye el derecho a reproducirlos, distribuirlos, comunicarlos públicamente, transformarlos ni usarlos con fines comerciales o docentes propios.",
        },
        {
          t: "note",
          text: "Marcas de terceros. En la sección «El stack» se muestran los logotipos y nombres de las herramientas que se enseñan en el programa. Cada marca pertenece a su titular y aparece con una finalidad exclusivamente identificativa y descriptiva, al amparo del uso a título informativo de marca ajena. Su presencia no implica patrocinio, afiliación, colaboración ni respaldo de esas empresas hacia la escuela, salvo en el caso de las entidades certificadoras, cuya relación se describe expresamente en la sección de acreditación. Si eres titular de alguna de esas marcas y quieres que retiremos su logotipo, escríbenos y lo hacemos.",
        },
      ],
    },
    {
      h: "6. Enlaces a sitios de terceros",
      blocks: [
        {
          t: "p",
          text: "El sitio puede contener enlaces a páginas ajenas. No controlamos ni respondemos de sus contenidos, sus prácticas de privacidad ni su disponibilidad: el enlace es una comodidad para quien navega, no un respaldo. Al salir de nuestro dominio te aplican las condiciones y políticas del sitio de destino.",
        },
      ],
    },
    {
      h: "7. Responsabilidad",
      blocks: [
        {
          t: "p",
          text: "Trabajamos para que el sitio y el campus estén disponibles de forma continuada y para que su información sea exacta y esté actualizada, pero no podemos garantizar la ausencia de interrupciones, errores u omisiones. Nos reservamos el derecho a suspender temporalmente el acceso por mantenimiento, actualizaciones o causas de fuerza mayor, avisando cuando sea posible.",
        },
        {
          t: "p",
          text: "La información publicada sobre programas, calendarios y precios tiene carácter informativo y puede cambiar; las condiciones que rigen una matrícula son las vigentes en el momento de formalizarla y así se te comunican por escrito.",
        },
        {
          t: "p",
          text: "El programa forma y entrega herramientas y método. No garantiza la obtención de un empleo, de clientes, de un nivel de ingresos ni ningún otro resultado profesional concreto, porque el resultado depende de factores ajenos a la escuela: tu punto de partida, tu dedicación y el mercado.",
        },
      ],
    },
    {
      h: "8. Naturaleza de la certificación",
      blocks: [
        {
          t: "p",
          text: "El diploma que se entrega al terminar el programa es una certificación privada de empresa: detalla los módulos superados y lleva el sello de las entidades certificadoras en su respectiva área. No es un título oficial, no equivale a un grado universitario ni a ninguna titulación del sistema educativo, y no habilita para el ejercicio de profesiones reguladas.",
        },
      ],
    },
    {
      h: "9. Protección de datos",
      blocks: [
        {
          t: "p",
          text: "El tratamiento de datos personales se describe en detalle en la Política de privacidad, y el uso de cookies y tecnologías similares, en la Política de cookies. Ambas forman parte de este aviso legal.",
        },
      ],
    },
    {
      h: "10. Modificaciones",
      blocks: [
        {
          t: "p",
          text: "Podemos modificar este aviso legal para adaptarlo a cambios normativos, técnicos o de los propios servicios. La versión aplicable es la publicada en cada momento, con la fecha de última revisión que figura al principio del documento.",
        },
      ],
    },
    {
      h: "11. Ley aplicable y jurisdicción",
      blocks: [
        {
          t: "p",
          text: `Este aviso legal se rige por la legislación de ${E.country}, país de constitución de la sociedad, sin perjuicio de lo siguiente.`,
        },
        {
          t: "p",
          text: "Si eres consumidor y resides en la Unión Europea, esa elección de ley no puede privarte de la protección que te den las normas imperativas de tu país de residencia habitual, conforme al artículo 6 del Reglamento (CE) 593/2008 (Roma I). Podrás además demandar ante los tribunales de tu domicilio. Ninguna cláusula de este documento limita esos derechos.",
        },
      ],
    },
  ],
};

const PRIVACIDAD_ES: LegalDoc = {
  slug: "privacidad",
  title: "Política de privacidad",
  summary:
    "Qué datos tuyos tratamos, para qué, con qué amparo legal, cuánto los guardamos, quién más los ve y cómo puedes controlarlos.",
  updated: UPDATED_ES,
  sections: [
    {
      h: "1. Responsable del tratamiento",
      blocks: [
        {
          t: "p",
          text: `${E.name}, sociedad constituida en ${E.country} con licencia comercial nº ${E.licence} y domicilio en ${E.addr}, es la responsable del tratamiento de los datos personales que se recogen a través de este sitio y del campus virtual.`,
        },
        {
          t: "p",
          text: "Aunque estamos establecidos fuera de la Unión Europea, este tratamiento se rige por el Reglamento General de Protección de Datos (RGPD): su artículo 3.2.a lo aplica a quien ofrece servicios a personas que se encuentran en la Unión, y nuestros programas se comercializan en euros y en español y se dirigen a residentes en países de la Unión. Nos aplica además la normativa de protección de datos emiratí, en particular el Decreto-Ley Federal 45/2021. Cuando una y otra difieran, aplicamos la más protectora para ti.",
        },
        {
          t: "p",
          text: `Conforme al artículo 27 del RGPD hemos designado por escrito un representante en la Unión Europea, al que puedes dirigirte igual que a nosotros en todo lo relativo a este tratamiento: ${E.rep}.`,
        },
        {
          t: "p",
          text: `Para cualquier cuestión sobre privacidad, incluido el ejercicio de tus derechos, puedes escribir a ${E.mail}${ENTITY.dpo ? `. Nuestro delegado de protección de datos es ${ENTITY.dpo}` : ""}.`,
        },
      ],
    },
    {
      h: "2. Qué datos tratamos",
      blocks: [
        {
          t: "p",
          text: "Sólo tratamos los datos que necesitamos y que tú nos das, más los que genera tu propio uso de la plataforma. En concreto:",
        },
        {
          t: "table",
          head: ["Origen", "Datos"],
          rows: [
            [
              "Formulario de solicitud de información",
              "Nombre, apellidos, correo electrónico, teléfono, ciudad, curso o cursos que te interesan, idioma en el que navegabas y fecha de la solicitud.",
            ],
            [
              "Matrícula",
              "Datos identificativos y de facturación necesarios para formalizar el contrato y emitir la factura.",
            ],
            [
              "Cuenta del campus virtual",
              "Correo electrónico y credenciales de acceso, rol, progreso por módulo, entregas de ejercicios y comunicaciones dentro de la plataforma.",
            ],
            [
              "Datos técnicos",
              "Dirección IP, tipo de navegador y dispositivo, y registros de actividad del servidor, generados automáticamente al conectarte.",
            ],
            [
              "Cookies y almacenamiento local",
              "Preferencia de idioma, estado de tu consentimiento de cookies y sesión de acceso al campus. El detalle está en la Política de cookies.",
            ],
          ],
        },
        {
          t: "p",
          text: "No pedimos ni necesitamos categorías especiales de datos (salud, ideología, afiliación sindical, origen étnico, orientación sexual o biometría). Te pedimos que no los incluyas en los campos libres del formulario ni en las entregas del campus.",
        },
        {
          t: "note",
          text: "El formulario incluye un campo trampa oculto (honeypot) que las personas no ven y que sólo rellenan los robots. No recoge ningún dato tuyo: sirve para descartar envíos automáticos antes de guardarlos.",
        },
      ],
    },
    {
      h: "3. Para qué los usamos y con qué base legal",
      blocks: [
        {
          t: "p",
          text: "Cada finalidad se apoya en una base jurídica del artículo 6 del Reglamento General de Protección de Datos (RGPD). Ninguna se usa para algo distinto de lo que aquí se declara.",
        },
        {
          t: "table",
          head: ["Para qué", "Base legal"],
          rows: [
            [
              "Atender tu solicitud de información y enviarte el programa, el calendario y las condiciones del curso que has marcado.",
              "Tu consentimiento, que das al enviar el formulario (art. 6.1.a RGPD). Puedes retirarlo cuando quieras.",
            ],
            [
              "Contactarte para resolver dudas sobre esa solicitud, por correo o por teléfono.",
              "El mismo consentimiento, y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).",
            ],
            [
              "Gestionar tu matrícula, darte acceso al campus e impartir la formación contratada.",
              "Ejecución del contrato del que eres parte (art. 6.1.b RGPD).",
            ],
            [
              "Emitir facturas y cumplir con las obligaciones contables, fiscales y de conservación documental.",
              "Cumplimiento de una obligación legal (art. 6.1.c RGPD).",
            ],
            [
              "Mantener la seguridad del sitio y del campus, prevenir el fraude y el abuso, y conservar registros técnicos.",
              "Interés legítimo en proteger la plataforma y a quienes la usan (art. 6.1.f RGPD).",
            ],
            [
              "Enviarte información sobre convocatorias o programas propios similares a los que ya has solicitado o cursado.",
              "Interés legítimo en la comunicación comercial a clientes propios (art. 6.1.f RGPD y art. 21.2 LSSI-CE). Cada envío incluye un enlace de baja.",
            ],
            [
              "Medir el uso del sitio y mostrar publicidad, si activas esas categorías en el panel de cookies.",
              "Tu consentimiento específico por categoría (art. 6.1.a RGPD). Sin él, esas cookies no se instalan.",
            ],
          ],
        },
        {
          t: "p",
          text: "Todos los campos del formulario de solicitud son necesarios para poder atenderte: sin ellos no podemos enviarte la información ni contactarte. No hay campos recogidos «por si acaso».",
        },
      ],
    },
    {
      h: "4. Cuánto tiempo los conservamos",
      blocks: [
        {
          t: "table",
          head: ["Datos", "Plazo"],
          rows: [
            [
              "Solicitudes de información que no terminan en matrícula",
              "12 meses desde el último contacto. Pasado ese plazo se suprimen, salvo que nos pidas antes que lo hagamos.",
            ],
            [
              "Datos del alumnado matriculado",
              "Durante toda la relación formativa y, después, bloqueados durante los plazos de prescripción de las responsabilidades derivadas del contrato: 6 años por la normativa mercantil y 4 por la fiscal.",
            ],
            [
              "Facturación y documentación contable",
              "Los plazos que impone la normativa fiscal y mercantil aplicable en cada momento.",
            ],
            [
              "Registros técnicos y de seguridad",
              "12 meses como máximo.",
            ],
            [
              "Registro de tu consentimiento de cookies",
              "12 meses, tras los cuales se te vuelve a preguntar.",
            ],
          ],
        },
        {
          t: "p",
          text: "Cuando vence el plazo, los datos se suprimen o se anonimizan de forma que no se te pueda volver a identificar. Mientras están bloqueados sólo se conservan a disposición de jueces, tribunales y administraciones competentes.",
        },
      ],
    },
    {
      h: "5. Quién más accede a tus datos",
      blocks: [
        {
          t: "p",
          text: "No vendemos, alquilamos ni cedemos tus datos a terceros para sus propios fines. Sí trabajamos con proveedores que los tratan por cuenta nuestra, siguiendo nuestras instrucciones y con un contrato de encargado del tratamiento firmado (art. 28 RGPD):",
        },
        {
          t: "table",
          head: ["Proveedor", "Qué hace", "Dónde"],
          rows: [
            [
              "Supabase",
              "Base de datos donde se guardan las solicitudes y las cuentas del campus, y servicio de autenticación.",
              "Unión Europea / Estados Unidos según la región contratada.",
            ],
            [
              "Vercel",
              "Alojamiento del sitio y del campus, y entrega de contenidos.",
              "Unión Europea / Estados Unidos.",
            ],
            [
              "Slack",
              "Aviso interno al equipo cuando llega una nueva solicitud. El mensaje incluye tu nombre, correo, teléfono, ciudad y el curso que te interesa.",
              "Estados Unidos.",
            ],
          ],
        },
        {
          t: "p",
          text: "También pueden acceder, dentro de lo estrictamente necesario, nuestra asesoría contable y fiscal y los proveedores de pago que intervengan en la matrícula. Además, comunicaremos datos a las administraciones públicas, jueces y tribunales cuando exista una obligación legal de hacerlo.",
        },
        {
          t: "p",
          text: "Las entidades certificadoras reciben, en su caso, únicamente los datos imprescindibles para emitir y verificar el diploma de quienes completan el programa.",
        },
      ],
    },
    {
      h: "6. Transferencias internacionales",
      blocks: [
        {
          t: "p",
          text: "Aquí hay dos movimientos distintos y conviene no confundirlos.",
        },
        {
          t: "p",
          text: `El primero es hacia nosotros. Estamos establecidos en ${E.country}, un país sobre el que la Comisión Europea no ha adoptado una decisión de adecuación. Por tanto, el acceso a tus datos desde nuestra sede constituye una transferencia internacional que amparamos en las cláusulas contractuales tipo aprobadas por la Comisión Europea, suscritas con nuestro representante en la Unión, junto con las medidas adicionales que resulten de la evaluación de impacto de la transferencia: cifrado en tránsito y en reposo, control de accesos por roles y minimización de los datos que salen de la Unión. Cuando la transferencia sea necesaria para ejecutar el contrato de formación que has solicitado, se ampara además en el artículo 49.1.b del RGPD.`,
        },
        {
          t: "p",
          text: "El segundo es hacia los proveedores. Supabase, Vercel y Slack están establecidos en Estados Unidos o pueden acceder desde allí. Esas transferencias se amparan en la decisión de adecuación del Marco de Privacidad de Datos UE-EE. UU. cuando el proveedor está certificado en él, o en las cláusulas contractuales tipo con medidas adicionales cuando no lo está.",
        },
        {
          t: "p",
          text: `Puedes solicitarnos una copia de las garantías aplicadas escribiendo a ${E.mail}.`,
        },
      ],
    },
    {
      h: "7. Decisiones automatizadas y elaboración de perfiles",
      blocks: [
        {
          t: "p",
          text: "No tomamos decisiones basadas únicamente en tratamientos automatizados que produzcan efectos jurídicos sobre ti o te afecten significativamente de modo similar. No elaboramos perfiles para decidir tu admisión ni las condiciones que se te ofrecen.",
        },
      ],
    },
    {
      h: "8. Tus derechos",
      blocks: [
        {
          t: "p",
          text: "La normativa te reconoce un conjunto de derechos que puedes ejercer en cualquier momento, gratuitamente:",
        },
        {
          t: "ul",
          items: [
            "Acceso: saber qué datos tuyos tratamos y obtener una copia.",
            "Rectificación: corregir los que sean inexactos o completar los que estén incompletos.",
            "Supresión: pedir que los borremos cuando ya no sean necesarios o retires tu consentimiento.",
            "Oposición: oponerte a tratamientos basados en nuestro interés legítimo, incluida la publicidad.",
            "Limitación: pedir que los conservemos pero dejemos de usarlos mientras se resuelve una reclamación.",
            "Portabilidad: recibir en un formato estructurado y de uso común los datos que nos hayas facilitado, y transmitirlos a otro responsable.",
            "Retirar el consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior a la retirada.",
          ],
        },
        {
          t: "p",
          text: `Para ejercerlos, escribe a ${E.mail} indicando el derecho que quieres ejercer. Puede que te pidamos acreditar tu identidad si tenemos dudas razonables sobre quién hace la solicitud. Responderemos en el plazo de un mes, ampliable a dos más si la solicitud es compleja, avisándote del motivo.`,
        },
        {
          t: "p",
          text: "Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la autoridad de control de protección de datos del país de la Unión donde residas, donde trabajes o donde se haya producido el problema. Si resides en España, es la Agencia Española de Protección de Datos (C/ Jorge Juan 6, 28001 Madrid — www.aepd.es). Te agradeceríamos que nos dieras antes la oportunidad de resolverlo.",
        },
      ],
    },
    {
      h: "9. Seguridad",
      blocks: [
        {
          t: "p",
          text: "Aplicamos medidas técnicas y organizativas apropiadas al riesgo: cifrado de las comunicaciones, control de acceso por roles, seguridad a nivel de fila en la base de datos, autenticación de las cuentas del campus, copias de seguridad y registro de accesos. La tabla de solicitudes no es accesible desde el navegador: sólo se escribe desde el servidor y sólo la puede leer el personal autorizado.",
        },
        {
          t: "p",
          text: "Ningún sistema es infalible. Si se produjera una violación de seguridad que suponga un alto riesgo para tus derechos, te lo comunicaremos sin dilación indebida y lo notificaremos a la autoridad de control conforme a los artículos 33 y 34 del RGPD.",
        },
      ],
    },
    {
      h: "10. Personas menores de edad",
      blocks: [
        {
          t: "p",
          text: "Ni el sitio ni los programas están dirigidos a menores de 18 años, y no recogemos sus datos conscientemente. Si detectamos que hemos tratado datos de una persona menor sin la autorización que corresponda, los suprimiremos. Si eres su madre, padre o tutor y crees que ha ocurrido, escríbenos.",
        },
      ],
    },
    {
      h: "11. Cambios en esta política",
      blocks: [
        {
          t: "p",
          text: "Si cambia lo que hacemos con los datos, cambiará esta política. Publicaremos la nueva versión aquí con su fecha de revisión y, cuando el cambio sea sustancial y afecte a tratamientos basados en tu consentimiento, te lo comunicaremos y te pediremos uno nuevo.",
        },
      ],
    },
  ],
};

const COOKIES_ES: LegalDoc = {
  slug: "cookies",
  title: "Política de cookies",
  summary:
    "Qué guardamos en tu navegador, para qué sirve cada cosa y cómo decides tú, categoría a categoría.",
  updated: UPDATED_ES,
  sections: [
    {
      h: "1. Qué es una cookie",
      blocks: [
        {
          t: "p",
          text: "Una cookie es un pequeño fichero de texto que un sitio guarda en tu navegador cuando lo visitas. Sirve para recordar información entre páginas o entre visitas: desde el idioma que has elegido hasta si has iniciado sesión. Bajo el mismo paraguas legal entran otras tecnologías equivalentes, como el almacenamiento local del navegador, y todo lo que se dice aquí les aplica igual.",
        },
      ],
    },
    {
      h: "2. Quién las instala",
      blocks: [
        {
          t: "p",
          // ⚠︎ Esta frase decía «Hoy no cargamos ninguna cookie de terceros
          // por defecto». Dejó de ser cierta al poner el mapa de Google
          // visible de entrada en la landing de campaña, así que se ha
          // corregido en el mismo cambio. Si algún día vuelve a no cargarse
          // ningún tercero por defecto, esto se reescribe otra vez: una
          // política que describe una web que ya no existe no protege a
          // nadie, y es la primera cosa que mira una inspección.
          text: `Las cookies propias las instala ${E.name} desde el dominio ${E.domain}. De terceros hay una sola: la página del programa incrusta un mapa de Google Maps para enseñar dónde está la oficina, y Google instala sus propias cookies al cargarlo. Es la única que se carga sin haber elegido antes. Si rechazas la categoría «Preferencias» en el panel de configuración, ese mapa deja de cargarse y en su lugar aparece un botón para abrirlo sólo si tú quieres. Ningún otro servicio ajeno instala cookies en este sitio.`,
        },
      ],
    },
    {
      h: "3. Categorías que usamos",
      blocks: [
        {
          t: "table",
          head: ["Categoría", "Para qué sirve", "¿Necesita tu permiso?"],
          rows: [
            [
              "Estrictamente necesarias",
              "Permiten que el sitio funcione: mantener tu sesión iniciada en el campus, recordar tus decisiones sobre cookies y proteger el formulario frente a envíos automatizados.",
              "No. Sin ellas el servicio que has pedido no puede prestarse, así que están exentas del deber de consentimiento.",
            ],
            [
              "Preferencias",
              "Recuerdan elecciones que has hecho tú, como el idioma en el que quieres ver el sitio. En esta categoría entra también el mapa de Google Maps que muestra dónde está la oficina: rechazarla impide que se cargue.",
              "Sí, salvo que la preferencia sea imprescindible para prestar el servicio que has solicitado expresamente.",
            ],
            [
              "Analíticas",
              "Nos dirían cuánta gente entra, por dónde navega y qué páginas funcionan, de forma agregada, para mejorar el sitio.",
              "Sí. Desactivadas mientras no las actives.",
            ],
            [
              "Marketing",
              "Permitirían medir la eficacia de las campañas y mostrar anuncios ajustados a tus intereses en plataformas de terceros.",
              "Sí. Desactivadas mientras no las actives.",
            ],
          ],
        },
      ],
    },
    {
      h: "4. Cookies concretas que hay hoy",
      blocks: [
        {
          t: "table",
          head: ["Nombre", "Categoría", "Para qué", "Duración"],
          rows: [
            [
              "axr_consent",
              "Necesaria",
              "Guarda qué categorías has aceptado o rechazado, la versión del texto que se te mostró y la fecha, para poder acreditar tu decisión y no volver a preguntarte en cada página.",
              "12 meses",
            ],
            [
              "axr_locale",
              "Preferencias",
              "Recuerda si quieres el sitio en español o en inglés.",
              "12 meses",
            ],
            [
              "sb-…-auth-token",
              "Necesaria",
              "Sesión de acceso al campus virtual, gestionada por Supabase Auth. Sólo existe si has iniciado sesión.",
              "Sesión / hasta cerrar sesión",
            ],
          ],
        },
        {
          t: "p",
          text: "Si en el futuro incorporamos analítica o herramientas de medición publicitaria, actualizaremos esta tabla antes de activarlas y te volveremos a pedir consentimiento.",
        },
      ],
    },
    {
      h: "5. Cómo pedimos tu consentimiento",
      blocks: [
        {
          t: "p",
          text: "La primera vez que entras te mostramos un aviso con tres opciones igual de accesibles: aceptar todas, rechazar todas y configurar por categorías. Rechazar cuesta exactamente lo mismo que aceptar, un solo clic, y no se instala nada de lo que requiere permiso mientras no lo des.",
        },
        {
          t: "ul",
          items: [
            "No hay casillas premarcadas: las categorías que necesitan permiso empiezan desactivadas.",
            "Seguir navegando o desplazarte por la página no cuenta como aceptación.",
            "Puedes cambiar de opinión en cualquier momento desde el enlace «Configurar cookies» del pie de página.",
            "Guardamos la fecha y la versión del aviso que se te mostró, para poder acreditar cuándo y a qué dijiste que sí.",
          ],
        },
      ],
    },
    {
      h: "6. Señales de consentimiento a terceros",
      blocks: [
        {
          t: "p",
          text: "Tu decisión no se queda sólo en nuestro sitio: la trasladamos a las herramientas que pudieran cargarse, mediante señales de consentimiento estandarizadas. Antes de que elijas, todas las categorías que requieren permiso se envían como denegadas; cuando eliges, se actualizan al instante y en ambos sentidos.",
        },
        {
          t: "table",
          head: ["Señal", "Depende de la categoría"],
          rows: [
            ["analytics_storage", "Analíticas"],
            ["ad_storage", "Marketing"],
            ["ad_user_data", "Marketing"],
            ["ad_personalization", "Marketing"],
            ["functionality_storage", "Preferencias"],
            ["personalization_storage", "Preferencias"],
            ["security_storage", "Siempre concedida: es estrictamente necesaria"],
          ],
        },
      ],
    },
    {
      h: "7. Cómo gestionarlas desde tu navegador",
      blocks: [
        {
          t: "p",
          text: "Además de nuestro panel, tu navegador te permite ver, bloquear y borrar cookies. Ten en cuenta que si bloqueas las estrictamente necesarias, el campus virtual dejará de poder mantener tu sesión.",
        },
        {
          t: "ul",
          items: [
            "Safari: Ajustes › Safari › Bloquear todas las cookies, o Safari › Preferencias › Privacidad en escritorio.",
            "Chrome: Configuración › Privacidad y seguridad › Cookies y otros datos de sitios.",
            "Firefox: Ajustes › Privacidad y seguridad › Cookies y datos del sitio.",
            "Edge: Configuración › Cookies y permisos del sitio.",
          ],
        },
      ],
    },
    {
      h: "8. Cuánto dura tu decisión",
      blocks: [
        {
          t: "p",
          text: "Tu elección se conserva 12 meses. Pasado ese plazo volvemos a preguntarte, y también lo haremos antes si cambiamos las finalidades o incorporamos proveedores nuevos. Puedes revocarla cuando quieras sin ninguna consecuencia sobre el resto del servicio.",
        },
      ],
    },
    {
      h: "9. Cambios",
      blocks: [
        {
          t: "p",
          text: "Esta política se actualizará siempre que cambien las cookies utilizadas o la normativa aplicable. La fecha de la última revisión figura al principio del documento.",
        },
      ],
    },
  ],
};

const TERMINOS_ES: LegalDoc = {
  slug: "terminos",
  title: "Condiciones de contratación",
  summary:
    "Qué contratas exactamente, cuánto cuesta, cómo se paga, cómo puedes desistir y qué obligaciones asumimos cada parte.",
  updated: UPDATED_ES,
  sections: [
    {
      h: "1. Identificación y objeto",
      blocks: [
        {
          t: "p",
          text: `Estas condiciones regulan la contratación de los programas formativos que ${E.name}, sociedad constituida en ${E.country} con licencia comercial nº ${E.licence} y domicilio en ${E.addr}, imparte bajo la marca ${ENTITY.tradeName}. Al formalizar una matrícula declaras haberlas leído y aceptado.`,
        },
        {
          t: "p",
          text: "Se aplican junto con el Aviso legal y la Política de privacidad. Dirigimos nuestra actividad a personas residentes en la Unión Europea, así que si contratas como consumidor conservas íntegramente la protección que te da la normativa de consumo de tu país de residencia habitual, con independencia de dónde estemos establecidos. En España, esa normativa es el Real Decreto Legislativo 1/2007, texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.",
        },
      ],
    },
    {
      h: "2. Qué incluye el programa",
      blocks: [
        {
          t: "p",
          text: "Cada curso consta de 14 módulos —7 de núcleo común y 7 de especialización según el camino elegido— impartidos en una sesión en directo de 4 horas por semana durante 14 semanas, 56 horas lectivas en total. La matrícula incluye:",
        },
        {
          t: "ul",
          items: [
            "Acceso al campus virtual con las grabaciones de las sesiones y el material narrado.",
            "Frameworks y plantillas descargables de cada módulo.",
            "Un ejercicio práctico por módulo, con feedback del equipo docente.",
            "Acompañamiento y seguimiento en el espacio de comunidad durante todo el programa.",
            "Diploma acreditativo de los módulos superados al completar el programa.",
          ],
        },
        {
          t: "p",
          text: "Los grupos son de 25 plazas. El calendario, los horarios concretos y el equipo docente de cada convocatoria se comunican por escrito antes de formalizar la matrícula.",
        },
      ],
    },
    {
      h: "3. Cómo se contrata",
      blocks: [
        {
          t: "ul",
          items: [
            "Envías la solicitud de información desde el sitio, indicando el curso o cursos que te interesan. Esta solicitud no obliga a nada.",
            "Te enviamos el programa completo, el calendario, los horarios, el precio vigente y estas condiciones.",
            "Si decides matricularte, confirmas por escrito y se te indica la forma de pago.",
            "Recibida la confirmación y el primer pago, se te reserva la plaza y se te da acceso al campus. El contrato queda perfeccionado en ese momento.",
          ],
        },
        {
          t: "p",
          text: "El idioma en el que se formaliza el contrato es el español, o el inglés si así se acuerda expresamente. Conservamos constancia documental de la contratación y te la facilitamos si la pides.",
        },
      ],
    },
    {
      h: "4. Precios y forma de pago",
      blocks: [
        {
          t: "table",
          head: ["Concepto", "Importe"],
          rows: [
            ["Un curso (Remote Professional o Remote Founder)", "2.400 €, en pago único o en 3 plazos de 800 € sin intereses."],
            ["Los dos cursos", "3.900 €."],
            ["Matrícula anticipada", "2.100 €, disponible hasta el 31 de octubre."],
          ],
        },
        {
          t: "p",
          text: "Los precios se expresan en euros. Los impuestos aplicables, si procede repercutirlos, se indican de forma desglosada antes de confirmar la matrícula. El precio vigente es el comunicado por escrito en el momento de contratar: los cambios posteriores de tarifa no afectan a matrículas ya formalizadas.",
        },
        {
          t: "p",
          text: "En el pago fraccionado, el impago de un plazo faculta a la escuela para suspender el acceso al campus previo aviso, y a reclamar las cantidades pendientes. Se emite factura por cada pago.",
        },
      ],
    },
    {
      h: "5. Derecho de desistimiento",
      blocks: [
        {
          t: "p",
          text: "Si contratas como consumidor residente en la Unión Europea, dispones de 14 días naturales desde la formalización del contrato para desistir sin dar ninguna explicación y sin penalización. Es un derecho que te reconoce la normativa de consumo de tu país, que traspone la Directiva 2011/83/UE, y que respetamos aunque estemos establecidos fuera de la Unión. Para ejercerlo basta con que nos comuniques tu decisión de forma inequívoca antes de que venza el plazo, por ejemplo escribiendo a " + E.mail + ". Devolveremos todos los pagos recibidos en un plazo máximo de 14 días naturales desde que recibamos tu comunicación, por el mismo medio de pago que usaste.",
        },
        {
          t: "note",
          text: "Importante. El contenido digital del campus se pone a tu disposición de forma inmediata. Si pides expresamente empezar a acceder a él dentro del plazo de desistimiento, deberás reconocer que sabes que pierdes el derecho a desistir una vez ejecutado por completo el suministro. Es la excepción prevista en la Directiva 2011/83/UE y en las normas que la trasponen, entre ellas el artículo 103.m del texto refundido español. Si prefieres conservar íntegro tu derecho de desistimiento, no accedas a los materiales hasta que hayan pasado los 14 días: la plaza queda igualmente reservada.",
        },
        {
          t: "p",
          text: "Si ya se han impartido sesiones en directo cuando desistes, se te descontará la parte proporcional al servicio efectivamente prestado hasta ese momento, tal y como prevé la misma normativa.",
        },
      ],
    },
    {
      h: "6. Licencia de uso de los materiales",
      blocks: [
        {
          t: "p",
          text: "La matrícula te concede una licencia personal, intransferible y no exclusiva para usar los materiales del programa con la única finalidad de formarte. El acceso al campus y a las grabaciones se mantiene tras finalizar el programa, salvo causa justificada que se te comunicaría por escrito con antelación razonable.",
        },
        {
          t: "p",
          text: "Queda prohibido compartir credenciales, grabar o redifundir las sesiones, y reproducir, distribuir o transformar los materiales fuera del uso personal descrito. El incumplimiento faculta a suspender el acceso sin derecho a devolución, sin perjuicio de las acciones legales que procedan.",
        },
      ],
    },
    {
      h: "7. Obligaciones del alumnado",
      blocks: [
        {
          t: "ul",
          items: [
            "Facilitar datos veraces y mantenerlos actualizados.",
            "Custodiar las credenciales de acceso y no cederlas a terceros.",
            "Respetar a compañeros y equipo docente en las sesiones y en los espacios de comunidad.",
            "No usar la plataforma ni la comunidad para promocionar servicios ajenos sin autorización.",
          ],
        },
      ],
    },
    {
      h: "8. Certificación",
      blocks: [
        {
          t: "p",
          text: "Al completar el programa se emite un diploma que detalla los módulos superados y lleva el sello de las entidades certificadoras en su respectiva área. Es una certificación privada de empresa: no es un título oficial, no equivale a un grado universitario y no habilita para profesiones reguladas. La emisión requiere haber seguido el programa y entregado los ejercicios en las condiciones que se comunican al inicio.",
        },
      ],
    },
    {
      h: "9. Cambios y cancelación por parte de la escuela",
      blocks: [
        {
          t: "p",
          text: "Podemos ajustar el calendario, los horarios o el equipo docente por causas justificadas, manteniendo el contenido, la carga lectiva y la calidad del programa, y comunicándolo con la mayor antelación posible.",
        },
        {
          t: "p",
          text: "Si tuviéramos que cancelar o aplazar una convocatoria, podrás elegir entre pasar a la siguiente o recuperar íntegramente lo pagado, a tu elección y sin coste alguno.",
        },
      ],
    },
    {
      h: "10. Garantías y responsabilidad",
      blocks: [
        {
          t: "p",
          text: "Nos comprometemos a impartir el programa con la carga lectiva, el contenido y los medios anunciados. No garantizamos la obtención de empleo, de clientes ni de un nivel de ingresos determinado: el resultado depende de factores que están fuera de nuestro control.",
        },
        {
          t: "p",
          text: "Nada en estas condiciones excluye ni limita la responsabilidad que no pueda excluirse legalmente, incluida la derivada de dolo o culpa grave, ni los derechos que la normativa de consumo reconoce a los consumidores.",
        },
      ],
    },
    {
      h: "11. Atención al cliente y reclamaciones",
      blocks: [
        {
          t: "p",
          text: `Para cualquier consulta, incidencia o reclamación puedes escribir a ${E.mail}. Contestamos en un plazo máximo de un mes y te damos acuse de recibo de la reclamación.`,
        },
        {
          t: "p",
          text: "Si eres consumidor residente en la Unión Europea y no quedas conforme con nuestra respuesta, puedes dirigirte a la autoridad de consumo o a la entidad de resolución alternativa de litigios de tu país, y en todo caso acudir a la vía judicial. La plataforma europea de resolución de litigios en línea dejó de estar operativa en julio de 2025, así que ya no es una vía disponible.",
        },
      ],
    },
    {
      h: "12. Ley aplicable y jurisdicción",
      blocks: [
        {
          t: "p",
          text: `Estas condiciones se rigen por la legislación de ${E.country}, país de constitución de la escuela.`,
        },
        {
          t: "p",
          text: "Si contratas como consumidor con residencia habitual en la Unión Europea, esa elección de ley no puede privarte de la protección de las normas imperativas de tu país (artículo 6 del Reglamento Roma I), y podrás demandarnos ante los tribunales de tu domicilio. En contrataciones entre empresas, las partes se someten a los tribunales del domicilio social de la escuela, con renuncia a cualquier otro fuero.",
        },
      ],
    },
  ],
};

// ══════════════════════════════════════════════════════════
//  ENGLISH
// ══════════════════════════════════════════════════════════

const AVISO_EN: LegalDoc = {
  slug: "aviso-legal",
  title: "Legal notice and terms of use",
  summary:
    "Who is behind this site, what you may and may not do on it, and who owns everything you see here.",
  updated: UPDATED_EN,
  sections: [
    {
      h: "1. Site ownership",
      blocks: [
        {
          t: "p",
          text: `This website is owned by ${E.name}, a free-zone company incorporated in the United Arab Emirates, trade licence no. ${E.licence}, registered at ${E.addr}. Its declared activity is educational consultancy. You can reach us at ${E.mail} for anything concerning the site or the programs.`,
        },
        {
          t: "p",
          text: "We publish these details because European consumer law requires the trader to be clearly identified before contracting, and because we direct our programs at people resident in the European Union. As we are not established in Spain, Spanish Act 34/2002 on information society services does not apply to us, but the information and protection duties that the consumer law of your country of residence imposes on traders targeting it do.",
        },
        {
          t: "p",
          text: `We trade under the name ${ENTITY.tradeName} and our main domain is ${E.domain}.`,
        },
      ],
    },
    {
      h: "2. Purpose",
      blocks: [
        {
          t: "p",
          text: "This site has two parts with different purposes. The public part presents the school's programs, their content, calendar and terms, and lets you request information with no commitment. The private part — the virtual campus — is where enrolled students follow the program: lessons, materials, recordings, submissions and follow-up.",
        },
        {
          t: "p",
          text: "Browsing the public part creates no contractual relationship. That relationship begins when you enrol, and is then governed by the Terms of enrolment.",
        },
      ],
    },
    {
      h: "3. Access and use",
      blocks: [
        {
          t: "p",
          text: "Access to the site is free, apart from whatever your provider charges for the connection. By using it you agree to do so lawfully, in good faith and in line with this notice, and in particular not to:",
        },
        {
          t: "ul",
          items: [
            "Post or spread unlawful, defamatory or discriminatory content, or content infringing third-party rights.",
            "Attempt to reach restricted areas, other people's accounts or our information systems without authorisation.",
            "Interfere with how the site works: inject malicious code, overload it or alter its content.",
            "Systematically extract the site's content, manually or automatically, in order to reuse it.",
            "Impersonate other people or the school itself.",
          ],
        },
      ],
    },
    {
      h: "4. The virtual campus",
      blocks: [
        {
          t: "p",
          text: "The virtual campus is restricted to enrolled students. Credentials are personal and non-transferable: you are responsible for keeping them safe and for the activity carried out with your account. If you spot unauthorised use, tell us immediately at the address above.",
        },
        {
          t: "p",
          text: "Sharing credentials, bulk-downloading materials or circulating recordings outside the campus are grounds for suspending access, without prejudice to any legal action.",
        },
      ],
    },
    {
      h: "5. Intellectual and industrial property",
      blocks: [
        {
          t: "p",
          text: "The content of the site and the campus — texts, training materials, recordings, templates, frameworks, code, design, navigation structure and brand — belongs to the school or is used under sufficient licence, and is protected by intellectual and industrial property law.",
        },
        {
          t: "p",
          text: "Enrolment grants a personal, non-exclusive, non-transferable licence to use the materials for the sole purpose of following the program. It does not include the right to reproduce, distribute, publicly communicate or transform them, nor to use them commercially or to teach.",
        },
        {
          t: "note",
          text: "Third-party trademarks. The \"stack\" section shows the logos and names of the tools taught in the program. Each brand belongs to its owner and appears purely to identify and describe the tool, as permitted for informational use of another party's trademark. Their presence implies no sponsorship, affiliation, partnership or endorsement of the school by those companies, except for the certifying bodies, whose relationship is described explicitly in the accreditation section. If you own one of those trademarks and want the logo removed, write to us and we will remove it.",
        },
      ],
    },
    {
      h: "6. Links to third-party sites",
      blocks: [
        {
          t: "p",
          text: "The site may link to external pages. We neither control nor answer for their content, privacy practices or availability: the link is a convenience, not an endorsement. Once you leave our domain, the destination site's terms and policies apply to you.",
        },
      ],
    },
    {
      h: "7. Liability",
      blocks: [
        {
          t: "p",
          text: "We work to keep the site and the campus continuously available and their information accurate and current, but we cannot guarantee the absence of interruptions, errors or omissions. We may suspend access temporarily for maintenance, updates or force majeure, giving notice where possible.",
        },
        {
          t: "p",
          text: "Published information about programs, calendars and prices is indicative and may change; the terms governing an enrolment are those in force when it is formalised, and they are communicated to you in writing.",
        },
        {
          t: "p",
          text: "The program provides training, tools and method. It does not guarantee a job, clients, a level of income or any other specific professional outcome, because the outcome depends on factors outside the school's control: your starting point, your commitment and the market.",
        },
      ],
    },
    {
      h: "8. Nature of the certification",
      blocks: [
        {
          t: "p",
          text: "The diploma issued on completion is a private corporate certification: it lists the modules completed and carries the seal of the certifying bodies in their respective areas. It is not an official qualification, is not equivalent to a university degree or to any qualification within the state education system, and does not license you to practise regulated professions.",
        },
      ],
    },
    {
      h: "9. Data protection",
      blocks: [
        {
          t: "p",
          text: "How we handle personal data is described in detail in the Privacy policy, and the use of cookies and similar technologies in the Cookie policy. Both form part of this legal notice.",
        },
      ],
    },
    {
      h: "10. Changes",
      blocks: [
        {
          t: "p",
          text: "We may amend this notice to reflect legal, technical or service changes. The applicable version is the one published at any given time, with the revision date shown at the top of the document.",
        },
      ],
    },
    {
      h: "11. Governing law and jurisdiction",
      blocks: [
        {
          t: "p",
          text: "This notice is governed by the law of the United Arab Emirates, the company's country of incorporation, subject to the following.",
        },
        {
          t: "p",
          text: "If you are a consumer resident in the European Union, that choice of law cannot deprive you of the protection afforded by the mandatory rules of your country of habitual residence, under article 6 of Regulation (EC) 593/2008 (Rome I). You may also bring proceedings before the courts of your domicile. Nothing in this document limits those rights.",
        },
      ],
    },
  ],
};

const PRIVACIDAD_EN: LegalDoc = {
  slug: "privacidad",
  title: "Privacy policy",
  summary:
    "What data of yours we process, why, on what legal basis, how long we keep it, who else sees it and how you stay in control.",
  updated: UPDATED_EN,
  sections: [
    {
      h: "1. Data controller",
      blocks: [
        {
          t: "p",
          text: `${E.name}, a company incorporated in the United Arab Emirates under trade licence no. ${E.licence}, registered at ${E.addr}, is the controller of the personal data collected through this site and the virtual campus.`,
        },
        {
          t: "p",
          text: "Although we are established outside the European Union, this processing is governed by the General Data Protection Regulation (GDPR): its article 3(2)(a) applies it to anyone offering services to people located in the Union, and our programs are sold in euros and in Spanish and aimed at residents of EU countries. UAE data protection law also applies to us, in particular Federal Decree-Law 45/2021. Where the two differ, we apply whichever protects you more.",
        },
        {
          t: "p",
          text: `Under article 27 GDPR we have designated a representative in the European Union in writing, whom you may address exactly as you would address us on anything concerning this processing: ${E.rep}.`,
        },
        {
          t: "p",
          text: `For anything privacy-related, including exercising your rights, write to ${E.mail}${ENTITY.dpo ? `. Our data protection officer is ${ENTITY.dpo}` : ""}.`,
        },
      ],
    },
    {
      h: "2. What data we process",
      blocks: [
        {
          t: "p",
          text: "We only process what we need and what you give us, plus what your own use of the platform generates. Specifically:",
        },
        {
          t: "table",
          head: ["Source", "Data"],
          rows: [
            [
              "Information request form",
              "First name, surname, email address, phone number, city, the course or courses you are interested in, the language you were browsing in, and the date of the request.",
            ],
            [
              "Enrolment",
              "Identification and billing details needed to formalise the contract and issue the invoice.",
            ],
            [
              "Campus account",
              "Email address and access credentials, role, progress per module, exercise submissions and in-platform communications.",
            ],
            [
              "Technical data",
              "IP address, browser and device type, and server activity logs, generated automatically when you connect.",
            ],
            [
              "Cookies and local storage",
              "Language preference, your cookie consent state and your campus session. Full detail in the Cookie policy.",
            ],
          ],
        },
        {
          t: "p",
          text: "We neither ask for nor need special categories of data (health, beliefs, union membership, ethnic origin, sexual orientation or biometrics). Please do not include them in free-text fields or campus submissions.",
        },
        {
          t: "note",
          text: "The form includes a hidden honeypot field that people never see and only bots fill in. It collects nothing about you: it exists to discard automated submissions before they are stored.",
        },
      ],
    },
    {
      h: "3. Why we use it and on what legal basis",
      blocks: [
        {
          t: "p",
          text: "Every purpose rests on a legal basis under article 6 of the General Data Protection Regulation (GDPR). None is used for anything other than what is declared here.",
        },
        {
          t: "table",
          head: ["Purpose", "Legal basis"],
          rows: [
            [
              "Answering your request and sending you the program, calendar and terms for the course you selected.",
              "Your consent, given when you submit the form (art. 6.1.a GDPR). You may withdraw it at any time.",
            ],
            [
              "Contacting you to resolve questions about that request, by email or phone.",
              "The same consent, and pre-contractual steps taken at your request (art. 6.1.b GDPR).",
            ],
            [
              "Managing your enrolment, granting campus access and delivering the training.",
              "Performance of the contract to which you are party (art. 6.1.b GDPR).",
            ],
            [
              "Issuing invoices and meeting accounting, tax and record-keeping obligations.",
              "Compliance with a legal obligation (art. 6.1.c GDPR).",
            ],
            [
              "Keeping the site and campus secure, preventing fraud and abuse, and retaining technical logs.",
              "Legitimate interest in protecting the platform and its users (art. 6.1.f GDPR).",
            ],
            [
              "Sending you information about our own cohorts or programs similar to those you requested or took.",
              "Legitimate interest in marketing to our own customers (art. 6.1.f GDPR and art. 21.2 LSSI-CE). Every message carries an unsubscribe link.",
            ],
            [
              "Measuring site usage and serving advertising, if you enable those categories in the cookie panel.",
              "Your specific per-category consent (art. 6.1.a GDPR). Without it, those cookies are not set.",
            ],
          ],
        },
        {
          t: "p",
          text: "Every field in the request form is necessary in order to reply to you: without them we cannot send the information or get in touch. Nothing is collected just in case.",
        },
      ],
    },
    {
      h: "4. How long we keep it",
      blocks: [
        {
          t: "table",
          head: ["Data", "Retention"],
          rows: [
            [
              "Information requests that do not lead to enrolment",
              "12 months from the last contact. After that they are deleted, unless you ask us to do it sooner.",
            ],
            [
              "Enrolled students' data",
              "Throughout the training relationship and, afterwards, blocked for the limitation periods applying to contractual liability: 6 years under commercial law and 4 under tax law.",
            ],
            [
              "Invoicing and accounting records",
              "The periods imposed by the tax and commercial legislation in force at the time.",
            ],
            ["Technical and security logs", "12 months at most."],
            [
              "Record of your cookie consent",
              "12 months, after which you are asked again.",
            ],
          ],
        },
        {
          t: "p",
          text: "Once the period ends, data is deleted or anonymised so that you can no longer be identified. While blocked, it is kept solely at the disposal of courts and competent authorities.",
        },
      ],
    },
    {
      h: "5. Who else accesses your data",
      blocks: [
        {
          t: "p",
          text: "We do not sell, rent or share your data with third parties for their own purposes. We do work with providers who process it on our behalf, on our instructions and under a signed processor agreement (art. 28 GDPR):",
        },
        {
          t: "table",
          head: ["Provider", "What it does", "Where"],
          rows: [
            [
              "Supabase",
              "Database holding requests and campus accounts, and the authentication service.",
              "European Union / United States depending on the contracted region.",
            ],
            [
              "Vercel",
              "Hosting and content delivery for the site and the campus.",
              "European Union / United States.",
            ],
            [
              "Slack",
              "Internal alert to the team when a new request arrives. The message includes your name, email, phone, city and the course you are interested in.",
              "United States.",
            ],
          ],
        },
        {
          t: "p",
          text: "Our accounting and tax advisers and the payment providers involved in enrolment may also access data, strictly as needed. We will also disclose data to public authorities and courts where a legal obligation requires it.",
        },
        {
          t: "p",
          text: "Certifying bodies receive, where applicable, only the data strictly required to issue and verify the diploma of those who complete the program.",
        },
      ],
    },
    {
      h: "6. International transfers",
      blocks: [
        {
          t: "p",
          text: "There are two distinct movements here and they should not be conflated.",
        },
        {
          t: "p",
          text: "The first is towards us. We are established in the United Arab Emirates, a country for which the European Commission has adopted no adequacy decision. Access to your data from our offices is therefore an international transfer, which we cover with the standard contractual clauses approved by the European Commission, signed with our EU representative, together with the additional measures arising from the transfer impact assessment: encryption in transit and at rest, role-based access control and minimisation of the data leaving the Union. Where the transfer is necessary to perform the training contract you requested, it is additionally covered by article 49(1)(b) GDPR.",
        },
        {
          t: "p",
          text: "The second is towards the providers. Supabase, Vercel and Slack are established in the United States or may access data from there. Those transfers rely on the EU-US Data Privacy Framework adequacy decision where the provider is certified under it, or on standard contractual clauses with additional measures where it is not.",
        },
        {
          t: "p",
          text: `You can request a copy of the safeguards applied by writing to ${E.mail}.`,
        },
      ],
    },
    {
      h: "7. Automated decisions and profiling",
      blocks: [
        {
          t: "p",
          text: "We take no decisions based solely on automated processing that produce legal effects concerning you or similarly significantly affect you. We do not profile you to decide on your admission or on the terms offered to you.",
        },
      ],
    },
    {
      h: "8. Your rights",
      blocks: [
        {
          t: "p",
          text: "The law grants you a set of rights you can exercise at any time, free of charge:",
        },
        {
          t: "ul",
          items: [
            "Access: know what data of yours we process and obtain a copy.",
            "Rectification: correct inaccurate data or complete incomplete data.",
            "Erasure: ask us to delete data when it is no longer needed or you withdraw consent.",
            "Objection: object to processing based on our legitimate interest, including marketing.",
            "Restriction: ask us to keep data but stop using it while a claim is resolved.",
            "Portability: receive the data you provided in a structured, commonly used format and transmit it to another controller.",
            "Withdraw consent at any time, without affecting the lawfulness of processing before withdrawal.",
          ],
        },
        {
          t: "p",
          text: `To exercise them, write to ${E.mail} stating which right you wish to exercise. We may ask you to prove your identity if we have reasonable doubts about who is making the request. We reply within one month, extendable by two more for complex requests, telling you why.`,
        },
        {
          t: "p",
          text: "If you believe we have not handled your request properly, you may complain to the data protection supervisory authority of the EU country where you live, where you work or where the problem arose. If you live in Spain, that is the Spanish Data Protection Agency (C/ Jorge Juan 6, 28001 Madrid — www.aepd.es). We would appreciate the chance to put it right first.",
        },
      ],
    },
    {
      h: "9. Security",
      blocks: [
        {
          t: "p",
          text: "We apply technical and organisational measures appropriate to the risk: encrypted communications, role-based access control, row-level security in the database, authentication for campus accounts, backups and access logging. The requests table is not reachable from the browser: it is written only from the server and can be read only by authorised staff.",
        },
        {
          t: "p",
          text: "No system is infallible. Should a security breach occur that poses a high risk to your rights, we will inform you without undue delay and notify the supervisory authority under articles 33 and 34 GDPR.",
        },
      ],
    },
    {
      h: "10. Minors",
      blocks: [
        {
          t: "p",
          text: "Neither the site nor the programs are aimed at people under 18, and we do not knowingly collect their data. If we find we have processed a minor's data without the appropriate authorisation, we will delete it. If you are a parent or guardian and believe this has happened, write to us.",
        },
      ],
    },
    {
      h: "11. Changes to this policy",
      blocks: [
        {
          t: "p",
          text: "If what we do with data changes, this policy changes. We will publish the new version here with its revision date and, where the change is substantial and affects consent-based processing, we will tell you and ask for fresh consent.",
        },
      ],
    },
  ],
};

const COOKIES_EN: LegalDoc = {
  slug: "cookies",
  title: "Cookie policy",
  summary:
    "What we store in your browser, what each item is for, and how you decide, category by category.",
  updated: UPDATED_EN,
  sections: [
    {
      h: "1. What a cookie is",
      blocks: [
        {
          t: "p",
          text: "A cookie is a small text file a site stores in your browser when you visit. It remembers information between pages or between visits: from the language you chose to whether you are signed in. Equivalent technologies such as browser local storage fall under the same legal umbrella, and everything said here applies to them too.",
        },
      ],
    },
    {
      h: "2. Who sets them",
      blocks: [
        {
          t: "p",
          text: `First-party cookies are set by ${E.name} from the ${E.domain} domain. Third-party cookies would be set by external services, and on this site they can only ever be set if you enable their category in the settings panel. Today we load no third-party cookies by default.`,
        },
      ],
    },
    {
      h: "3. Categories we use",
      blocks: [
        {
          t: "table",
          head: ["Category", "What it does", "Needs your permission?"],
          rows: [
            [
              "Strictly necessary",
              "Make the site work: keep your campus session open, remember your cookie decisions and protect the form against automated submissions.",
              "No. Without them the service you asked for cannot be provided, so they are exempt from the consent requirement.",
            ],
            [
              "Preferences",
              "Remember choices you made, such as the language you want the site in.",
              "Yes, unless the preference is essential to deliver a service you expressly requested.",
            ],
            [
              "Analytics",
              "Would tell us, in aggregate, how many people arrive, where they go and which pages work, so we can improve the site.",
              "Yes. Off until you turn them on.",
            ],
            [
              "Marketing",
              "Would let us measure campaign performance and show you ads matched to your interests on third-party platforms.",
              "Yes. Off until you turn them on.",
            ],
          ],
        },
      ],
    },
    {
      h: "4. The specific cookies in place today",
      blocks: [
        {
          t: "table",
          head: ["Name", "Category", "Purpose", "Lifetime"],
          rows: [
            [
              "axr_consent",
              "Necessary",
              "Stores which categories you accepted or refused, the version of the notice shown to you and the date, so your decision can be evidenced and you are not asked again on every page.",
              "12 months",
            ],
            [
              "axr_locale",
              "Preferences",
              "Remembers whether you want the site in Spanish or English.",
              "12 months",
            ],
            [
              "sb-…-auth-token",
              "Necessary",
              "Campus sign-in session, handled by Supabase Auth. Only exists once you have signed in.",
              "Session / until sign-out",
            ],
          ],
        },
        {
          t: "p",
          text: "If we later add analytics or advertising measurement tools, we will update this table before switching them on and ask for your consent again.",
        },
      ],
    },
    {
      h: "5. How we ask for consent",
      blocks: [
        {
          t: "p",
          text: "The first time you arrive we show a notice with three equally accessible options: accept all, reject all, and configure by category. Refusing takes exactly as much effort as accepting — one click — and nothing requiring permission is set until you give it.",
        },
        {
          t: "ul",
          items: [
            "No pre-ticked boxes: categories that need permission start switched off.",
            "Continuing to browse or scrolling does not count as acceptance.",
            "You can change your mind at any time from the \"Cookie settings\" link in the footer.",
            "We store the date and the version of the notice shown, so we can evidence when and to what you said yes.",
          ],
        },
      ],
    },
    {
      h: "6. Consent signals to third parties",
      blocks: [
        {
          t: "p",
          text: "Your decision does not stop at our site: we pass it to any tools that might load, through standardised consent signals. Before you choose, every category requiring permission is sent as denied; once you choose, the signals update instantly, in both directions.",
        },
        {
          t: "table",
          head: ["Signal", "Depends on category"],
          rows: [
            ["analytics_storage", "Analytics"],
            ["ad_storage", "Marketing"],
            ["ad_user_data", "Marketing"],
            ["ad_personalization", "Marketing"],
            ["functionality_storage", "Preferences"],
            ["personalization_storage", "Preferences"],
            ["security_storage", "Always granted: strictly necessary"],
          ],
        },
      ],
    },
    {
      h: "7. Managing them from your browser",
      blocks: [
        {
          t: "p",
          text: "Besides our panel, your browser lets you view, block and delete cookies. Note that if you block strictly necessary ones, the virtual campus will no longer be able to keep you signed in.",
        },
        {
          t: "ul",
          items: [
            "Safari: Settings › Safari › Block All Cookies, or Safari › Preferences › Privacy on desktop.",
            "Chrome: Settings › Privacy and security › Third-party cookies.",
            "Firefox: Settings › Privacy & Security › Cookies and Site Data.",
            "Edge: Settings › Cookies and site permissions.",
          ],
        },
      ],
    },
    {
      h: "8. How long your decision lasts",
      blocks: [
        {
          t: "p",
          text: "Your choice is kept for 12 months. After that we ask again, and we will also ask sooner if we change purposes or add new providers. You can revoke it whenever you like with no consequence for the rest of the service.",
        },
      ],
    },
    {
      h: "9. Changes",
      blocks: [
        {
          t: "p",
          text: "This policy is updated whenever the cookies used or the applicable rules change. The last revision date appears at the top of the document.",
        },
      ],
    },
  ],
};

const TERMINOS_EN: LegalDoc = {
  slug: "terminos",
  title: "Terms of enrolment",
  summary:
    "Exactly what you are buying, what it costs, how it is paid, how you can withdraw, and what each party commits to.",
  updated: UPDATED_EN,
  sections: [
    {
      h: "1. Identification and purpose",
      blocks: [
        {
          t: "p",
          text: `These terms govern enrolment in the training programs delivered by ${E.name}, a company incorporated in the United Arab Emirates under trade licence no. ${E.licence}, registered at ${E.addr}, under the ${ENTITY.tradeName} brand. By enrolling you confirm you have read and accepted them.`,
        },
        {
          t: "p",
          text: "They apply alongside the Legal notice and the Privacy policy. We direct our activity at people resident in the European Union, so if you contract as a consumer you keep in full the protection given by the consumer law of your country of habitual residence, regardless of where we are established. In Spain, that law is Royal Legislative Decree 1/2007, the consolidated Consumer Protection Act.",
        },
      ],
    },
    {
      h: "2. What the program includes",
      blocks: [
        {
          t: "p",
          text: "Each course comprises 14 modules — 7 common core and 7 specialisation modules for your chosen path — delivered in one 4-hour live session per week over 14 weeks, 56 teaching hours in total. Enrolment includes:",
        },
        {
          t: "ul",
          items: [
            "Access to the virtual campus with session recordings and narrated material.",
            "Downloadable frameworks and templates for every module.",
            "One hands-on exercise per module, with feedback from the teaching team.",
            "Support and follow-up in the community space throughout the program.",
            "A diploma certifying the modules completed at the end of the program.",
          ],
        },
        {
          t: "p",
          text: "Groups are capped at 25 seats. The calendar, exact schedule and teaching team for each cohort are provided in writing before enrolment is formalised.",
        },
      ],
    },
    {
      h: "3. How enrolment works",
      blocks: [
        {
          t: "ul",
          items: [
            "You send the information request from the site, indicating the course or courses you are interested in. This request commits you to nothing.",
            "We send you the full program, calendar, schedule, current price and these terms.",
            "If you decide to enrol, you confirm in writing and we set out the payment method.",
            "Once confirmation and the first payment are received, your seat is reserved and campus access is granted. The contract is concluded at that point.",
          ],
        },
        {
          t: "p",
          text: "The contract is concluded in Spanish, or in English where expressly agreed. We keep documentary evidence of the contract and provide it on request.",
        },
      ],
    },
    {
      h: "4. Prices and payment",
      blocks: [
        {
          t: "table",
          head: ["Item", "Price"],
          rows: [
            ["One course (Remote Professional or Remote Founder)", "€2,400, in a single payment or 3 interest-free instalments of €800."],
            ["Both courses", "€3,900."],
            ["Early-bird enrolment", "€2,100, available until 31 October."],
          ],
        },
        {
          t: "p",
          text: "Prices are in euros. Applicable taxes, where they must be charged, are itemised before you confirm. The price in force is the one communicated in writing at the time of contracting: later tariff changes do not affect enrolments already formalised.",
        },
        {
          t: "p",
          text: "Where payment is in instalments, missing one entitles the school to suspend campus access after notice, and to claim the outstanding amounts. An invoice is issued for each payment.",
        },
      ],
    },
    {
      h: "5. Right of withdrawal",
      blocks: [
        {
          t: "p",
          text: "If you contract as a consumer resident in the European Union, you have 14 calendar days from the conclusion of the contract to withdraw without giving any reason and without penalty. It is a right granted by your country's consumer law, which transposes Directive 2011/83/EU, and we honour it even though we are established outside the Union. To exercise it, simply tell us your decision unambiguously before the deadline, for example by writing to " + E.mail + ". We refund all payments received within 14 calendar days of receiving your notice, using the same payment method you used.",
        },
        {
          t: "note",
          text: "Important. The campus's digital content is made available to you immediately. If you expressly ask to start accessing it within the withdrawal period, you must acknowledge that you lose the right to withdraw once supply has been fully performed. This is the exception set out in Directive 2011/83/EU and the national rules transposing it, including article 103.m of the Spanish consolidated Act. If you would rather keep your withdrawal right intact, do not access the materials until the 14 days have passed: your seat stays reserved either way.",
        },
        {
          t: "p",
          text: "If live sessions have already been delivered when you withdraw, an amount proportionate to the service actually provided up to that point is deducted, as the same rules provide.",
        },
      ],
    },
    {
      h: "6. Licence to use the materials",
      blocks: [
        {
          t: "p",
          text: "Enrolment grants you a personal, non-transferable, non-exclusive licence to use the program materials for the sole purpose of your own training. Access to the campus and the recordings continues after the program ends, save for justified cause notified to you in writing with reasonable notice.",
        },
        {
          t: "p",
          text: "Sharing credentials, recording or redistributing the sessions, and reproducing, distributing or transforming the materials beyond the personal use described are prohibited. Breach entitles us to suspend access with no refund, without prejudice to any legal action.",
        },
      ],
    },
    {
      h: "7. Student obligations",
      blocks: [
        {
          t: "ul",
          items: [
            "Provide accurate details and keep them up to date.",
            "Keep access credentials safe and never pass them to third parties.",
            "Treat classmates and the teaching team respectfully in sessions and community spaces.",
            "Not use the platform or the community to promote outside services without authorisation.",
          ],
        },
      ],
    },
    {
      h: "8. Certification",
      blocks: [
        {
          t: "p",
          text: "On completing the program a diploma is issued listing the modules completed and carrying the seal of the certifying bodies in their respective areas. It is a private corporate certification: not an official qualification, not equivalent to a university degree, and it does not license you to practise regulated professions. Issuance requires having followed the program and submitted the exercises under the conditions communicated at the start.",
        },
      ],
    },
    {
      h: "9. Changes and cancellation by the school",
      blocks: [
        {
          t: "p",
          text: "We may adjust the calendar, schedule or teaching team for justified reasons, keeping the content, teaching load and quality of the program intact, and giving as much notice as possible.",
        },
        {
          t: "p",
          text: "Should we have to cancel or postpone a cohort, you may choose between moving to the next one or a full refund, at your discretion and at no cost.",
        },
      ],
    },
    {
      h: "10. Warranties and liability",
      blocks: [
        {
          t: "p",
          text: "We commit to delivering the program with the teaching load, content and resources advertised. We do not guarantee a job, clients or any level of income: the outcome depends on factors beyond our control.",
        },
        {
          t: "p",
          text: "Nothing in these terms excludes or limits liability that cannot lawfully be excluded, including liability for wilful misconduct or gross negligence, nor the rights consumer law grants to consumers.",
        },
      ],
    },
    {
      h: "11. Customer service and complaints",
      blocks: [
        {
          t: "p",
          text: `For any query, issue or complaint, write to ${E.mail}. We reply within one month at most and acknowledge receipt of complaints.`,
        },
        {
          t: "p",
          text: "If you are a consumer resident in the European Union and our answer does not satisfy you, you can turn to the consumer authority or the alternative dispute resolution body in your country, and in any case go to court. The European online dispute resolution platform ceased operating in July 2025, so it is no longer an available route.",
        },
      ],
    },
    {
      h: "12. Governing law and jurisdiction",
      blocks: [
        {
          t: "p",
          text: "These terms are governed by the law of the United Arab Emirates, the school's country of incorporation.",
        },
        {
          t: "p",
          text: "If you contract as a consumer habitually resident in the European Union, that choice of law cannot deprive you of the protection of your country's mandatory rules (article 6 of the Rome I Regulation), and you may sue us before the courts of your domicile. In business-to-business contracts, the parties submit to the courts of the school's registered office, waiving any other jurisdiction.",
        },
      ],
    },
  ],
};

export const legalDocs: Record<Locale, Record<LegalSlug, LegalDoc>> = {
  es: {
    "aviso-legal": AVISO_ES,
    privacidad: PRIVACIDAD_ES,
    cookies: COOKIES_ES,
    terminos: TERMINOS_ES,
  },
  en: {
    "aviso-legal": AVISO_EN,
    privacidad: PRIVACIDAD_EN,
    cookies: COOKIES_EN,
    terminos: TERMINOS_EN,
  },
};

export const LEGAL_SLUGS: readonly LegalSlug[] = [
  "aviso-legal",
  "privacidad",
  "cookies",
  "terminos",
];

/** Navegación entre los cuatro documentos y etiquetas para el pie. */
export const legalNav: Record<Locale, {
  eyebrow: string;
  updatedLabel: string;
  indexLabel: string;
  cookieSettings: string;
  warning: string;
  warningRep: string;
  labels: Record<LegalSlug, string>;
}> = {
  es: {
    eyebrow: "Legal",
    updatedLabel: "Última revisión",
    indexLabel: "Documentos legales",
    cookieSettings: "Configurar cookies",
    warning:
      "Faltan datos identificativos obligatorios. Rellena src/app/legal/entity.ts antes de publicar: sin número de licencia comercial y correo de contacto, estos documentos no identifican al empresario como exige la normativa europea de consumo.",
    warningRep:
      "Falta el representante en la Unión Europea. Al estar la sociedad constituida fuera de la UE y dirigir el programa a residentes en ella, el artículo 27 del RGPD obliga a designar uno por escrito y a publicar su nombre y dirección aquí.",
    labels: {
      "aviso-legal": "Aviso legal",
      privacidad: "Privacidad",
      cookies: "Cookies",
      terminos: "Condiciones",
    },
  },
  en: {
    eyebrow: "Legal",
    updatedLabel: "Last revised",
    indexLabel: "Legal documents",
    cookieSettings: "Cookie settings",
    warning:
      "Mandatory identifying details are missing. Fill in src/app/legal/entity.ts before publishing: without a trade licence number and a contact email these documents do not identify the trader as European consumer law requires.",
    warningRep:
      "The EU representative is missing. As the company is incorporated outside the Union and directs the program at residents of it, article 27 GDPR requires appointing one in writing and publishing their name and address here.",
    labels: {
      "aviso-legal": "Legal notice",
      privacidad: "Privacy",
      cookies: "Cookies",
      terminos: "Terms",
    },
  },
};
