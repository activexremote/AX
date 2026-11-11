// ══════════════════════════════════════════════════════════
//  El playbook comercial
//
//  Todo lo que necesita quien vende el curso: qué vendemos, a quién, cómo
//  detectar el interés, cómo despertarlo en quien duda, las objeciones y lo
//  que nunca se dice. Se pinta en /admin/comercial/playbook y el mismo
//  contenido genera el PDF (scripts/playbook-comercial.mts).
//
//  Cada dato sale de lo publicado en la web y en las condiciones. Si algo
//  cambia (fechas, precios, docentes), se cambia aquí y se regenera el PDF.
//  Sólo importa los precios, con la extensión .ts: así lo lee también el
//  script del PDF con Node, sin compilar.
// ══════════════════════════════════════════════════════════

import { calcularPlazos, euros, PLAZOS_POR_DEFECTO, PRECIO_CONTADO, PRECIO_PLAZOS, resumenPlazos } from "./precios.ts";

const CONTADO = euros(PRECIO_CONTADO);
const APLAZADO = euros(PRECIO_PLAZOS);
const CUOTAS = resumenPlazos(calcularPlazos(PRECIO_PLAZOS, PLAZOS_POR_DEFECTO, "2027-01-01"));
const AHORRO = euros(PRECIO_PLAZOS - PRECIO_CONTADO);

export type Bloque =
  | { t: "p"; x: string }
  | { t: "lista"; x: string[] }
  | { t: "pasos"; x: { titulo: string; texto: string }[] }
  | { t: "tabla"; cab: string[]; filas: string[][] }
  | { t: "senales"; verde: string[]; ambar: string[]; rojo: string[] }
  | { t: "di"; si: string[]; no: string[] }
  | { t: "objeciones"; x: { dice: string; piensa: string; responde: string }[] }
  | { t: "cita"; x: string }
  | { t: "aviso"; x: string }
  | { t: "plantillas" };

export type Seccion = { id: string; titulo: string; entradilla: string; bloques: Bloque[] };

export const PLAYBOOK_VERSION = "Noviembre de 2026";

export const PLAYBOOK: Seccion[] = [
  {
    id: "bienvenida",
    titulo: "Bienvenida",
    entradilla: "Tu trabajo no es convencer a nadie. Es ayudar a cada persona a decidir bien, rápido y con información real.",
    bloques: [
      {
        t: "p",
        x: "Las personas que nos escriben ya han dado un paso: han dejado sus datos. Quieren algo concreto, trabajar para empresas de fuera o montar un negocio sin fronteras, y no saben si somos la forma de conseguirlo. Tu papel es descubrir qué buscan, enseñarles con honestidad si el curso les encaja y acompañarles hasta la decisión, sea cual sea.",
      },
      {
        t: "pasos",
        x: [
          { titulo: "Responde rápido", texto: "Prometemos contestar en menos de 24 horas laborables. Cuanto antes llamas, más fácil es que conteste, que se acuerde de qué pidió y que no haya hablado aún con otra escuela." },
          { titulo: "Escucha más de lo que hablas", texto: "La regla es 70/30: el 70 % de la llamada habla la otra persona. Nadie compra un temario; compran lo que el temario les resuelve." },
          { titulo: "Di siempre la verdad", texto: "Sin prisas inventadas, sin promesas de empleo, sin cifras que no podamos demostrar. La confianza es lo que vendemos." },
          { titulo: "Apúntalo todo", texto: "Cada llamada, mensaje y objeción va al gestor comercial. Si no está apuntado, no ha pasado." },
        ],
      },
    ],
  },
  {
    id: "que-vendemos",
    titulo: "Qué vendemos, en un minuto",
    entradilla: "Si solo pudieras decir una cosa: es un curso en directo para trabajar o emprender sin fronteras, y sales con entregables, no con apuntes.",
    bloques: [
      {
        t: "cita",
        x: "«No es que te falte talento. Es que nadie te ha enseñado a trabajar sin fronteras.» ActiveXRemote es la escuela especialista en Remote Business: un curso 100 % online y en directo, con grupos de 25 personas, para conseguir un empleo remoto internacional o construir tu propio negocio global.",
      },
      {
        t: "tabla",
        cab: ["", "Lo que tienes que saber"],
        filas: [
          ["Próximo grupo", "Del 9 de enero al 21 de febrero de 2027"],
          ["Ritmo", "7 fines de semana · sábado y domingo · 4 h en directo cada día"],
          ["Total", "14 módulos · 56 h en directo · 2 – 3 h de ejercicio a la semana"],
          ["Grupo", "25 plazas, online"],
          ["Idioma", "Clases en español · materiales en español e inglés"],
          ["Nivel previo", "Ninguno"],
          ["Si faltas a una clase", "Queda grabada en el campus, sin caducidad"],
          ["Precio de salida", `${CONTADO} en pago único · ${APLAZADO} a plazos (por ejemplo, ${CUOTAS})`],
          ["Pago", "Con tarjeta, por Stripe · factura por cada pago"],
          ["Desistimiento", "14 días naturales (ver «Lo que nunca decimos»)"],
        ],
      },
      {
        t: "aviso",
        x: `Los precios no están publicados en la web: se dan en la conversación, cuando la persona ya sabe qué le aporta el curso. Nunca los mandes en el primer mensaje sin contexto. A plazos se pagan ${AHORRO} más que al contado: nunca digas «sin intereses». Para calcular las cuotas y sus fechas, usa la calculadora del gestor. El precio de los dos cursos juntos lo confirma el equipo.`,
      },
      {
        t: "p",
        x: "Qué incluye la matrícula: 14 módulos en directo, el campus con grabaciones y audio narrado, frameworks y plantillas descargables, un ejercicio práctico con feedback en cada módulo, la comunidad y el seguimiento en Slack, y el diploma de ActiveXRemote con los módulos superados.",
      },
    ],
  },
  {
    id: "cursos",
    titulo: "Los dos cursos y cómo recomendar uno",
    entradilla: "Los 7 primeros módulos son comunes. En el cuarto fin de semana, cada persona elige su camino: Remote Professional o Remote Founder.",
    bloques: [
      {
        t: "tabla",
        cab: ["", "Remote Professional", "Remote Founder"],
        filas: [
          ["Para quién", "Empleados y contractors", "Founders, freelancers y solopreneurs"],
          ["Lo que consigue", "Un empleo remoto con empresas internacionales, mejor pagado", "Un negocio propio que vende fuera y no depende de sus horas"],
          ["Módulos 8 – 14", "Búsqueda de empleo remoto, candidaturas con IA, marca personal, entrevistas en vídeo, negociación salarial, onboarding en equipos distribuidos, carrera fractional", "Validación de mercado, operaciones y marketing con IA, captación B2B internacional, ofertas y landing pages, sistemas y SOPs, automatización y delegación, estructuras societarias"],
          ["Su ejercicio estrella", "Su Salary Negotiation Playbook y una lista de 20 empresas objetivo", "Entrevistar a 3 compradores y escribir a 10 clientes internacionales"],
        ],
      },
      {
        t: "p",
        x: "El núcleo común (módulos 1 – 7): mindset remoto y mercado global · geoposicionamiento y optimización fiscal · plan de reubicación internacional · stack de herramientas · IA para la productividad · energía y anti-burnout · legal y compliance entre países.",
      },
      {
        t: "pasos",
        x: [
          { titulo: "¿Quieres trabajar para una empresa o para ti?", texto: "Si la respuesta es «para una empresa», es Remote Professional. Si es «para mí» o «tengo clientes», es Remote Founder." },
          { titulo: "¿Cobras hoy por horas?", texto: "Si es freelance y cobra por horas, Founder le enseña a salir de ese techo. Si quiere estabilidad y nómina, Professional." },
          { titulo: "¿No lo tiene claro?", texto: "Tranquilidad: la elección llega en el cuarto fin de semana y es reversible. Empieza por el núcleo común y decide con más información." },
          { titulo: "¿Quiere los dos?", texto: "Se pueden hacer los dos caminos. El precio de los dos juntos lo confirma el equipo: pregúntalo antes de darlo." },
        ],
      },
    ],
  },
  {
    id: "argumentos",
    titulo: "Por qué nosotros: los argumentos",
    entradilla: "Elige los dos o tres que conecten con lo que te ha contado. Soltarlos todos seguidos no convence a nadie.",
    bloques: [
      {
        t: "pasos",
        x: [
          { titulo: "En directo, no un vídeo más", texto: "Cada módulo son 4 horas en vivo, con preguntas y ejercicio en clase. Y queda grabado, sin caducidad. Para quien ya ha abandonado algún curso online, es el argumento clave." },
          { titulo: "Sales con entregables, no con apuntes", texto: "Cada módulo termina en algo que usas al día siguiente: una lista de empresas objetivo, un guion de negociación, una página de servicios, un contrato de contractor." },
          { titulo: "Acreditado por Deel", texto: "ActiveXRemote es Deel Platinum Partner y Deel Global Partner. 7 módulos están acreditados por Deel, la plataforma de nóminas y RR. HH. presente en más de 150 países. La acreditación aparece en el diploma." },
          { titulo: "Lo enseña gente que lo hace", texto: "Isaac R. Betanzos fue EMEA Partner Growth Manager en Deel y Lead Partner Manager en Oyster, y vive en Dubái. Ha llevado proyectos en Reino Unido, Sudáfrica, Kenia, Grecia y Chequia." },
          { titulo: "Grupos de 25", texto: "No es un curso masivo. Te conocen por tu nombre y te corrigen el ejercicio." },
          { titulo: "La IA como ventaja", texto: "Se usa en todo el curso: para buscar empleo, preparar entrevistas, automatizar un negocio. Y el campus tiene un asistente con IA para las dudas." },
          { titulo: "Sin fronteras de verdad", texto: "Fiscalidad, visados, contratos entre países: lo que nadie te explica y que decide si el remoto te sale a cuenta." },
        ],
      },
      {
        t: "p",
        x: "Para quien busca empleo, un dato que abre los ojos: de cada 1.000 personas que ven una oferta remota, unas 240 se apuntan, 62 pasan el filtro automático, 14 reciben respuesta de una persona, 3 llegan a la entrevista final y 1 se lleva la oferta. Es el orden de magnitud habitual del sector, no una promesa: dilo así. El curso trabaja cada uno de esos filtros.",
      },
      {
        t: "p",
        x: "Para quien es freelance: «mientras cobres por horas, tu negocio tiene un techo con fecha». Remote Founder enseña a convertir el servicio en una oferta que se vende fuera y escala sin más horas.",
      },
    ],
  },
  {
    id: "detectar",
    titulo: "Cómo detectar a un alumno interesado",
    entradilla: "El interés no se pregunta: se escucha. Estas señales te dicen en qué punto está cada persona y cuánto tiempo dedicarle.",
    bloques: [
      {
        t: "senales",
        verde: [
          "Pregunta por fechas, plazas o cómo se paga",
          "Te cuenta su situación con detalle: trabajo, país, objetivo, plazo",
          "Tiene un motivo con fecha: «quiero cambiar antes del verano», «me mudo en marzo»",
          "Contesta rápido y propone él o ella la hora de la llamada",
          "Pregunta si se puede pagar a plazos",
          "Se apunta a la clase de prueba o abre varias veces el enlace",
          "Habla en primera persona del futuro: «cuando esté en el curso…»",
        ],
        ambar: [
          "«Me interesa, pero ahora no es buen momento»",
          "Compara con cursos gratis o con otras escuelas",
          "Pide «la información por escrito» y nada más",
          "Tiene interés pero decide con otra persona (pareja, empresa)",
          "Duda entre los dos cursos",
        ],
        rojo: [
          "Busca ingresos pasivos o un atajo para ganar dinero sin esfuerzo",
          "Necesita estudiar a su ritmo, sin clases en directo",
          "Espera que el diploma le abra puertas por sí solo",
          "No puede ninguno de los fines de semana del curso",
          "No contesta tras cuatro intentos en dos semanas",
        ],
      },
      {
        t: "tabla",
        cab: ["Temperatura", "Cómo reconocerla", "Qué haces"],
        filas: [
          ["Caliente", "Dos o más señales verdes y una necesidad concreta", "Llamada en el día. Precio, forma de pago y siguiente paso en la misma conversación."],
          ["Templado", "Interés real con alguna señal ámbar", "Invítale a la clase de prueba. Resuelve la duda concreta. Seguimiento en 3 – 5 días."],
          ["Frío", "Curiosidad sin motivo ni plazo, o señales rojas", "Un mensaje útil y a la lista de próximos grupos. No insistas."],
        ],
      },
      {
        t: "p",
        x: "En el gestor comercial marca la temperatura de cada lead después de cada conversación. La lista se ordena sola para que empieces el día por los calientes.",
      },
    ],
  },
  {
    id: "llamada",
    titulo: "La llamada de descubrimiento",
    entradilla: "Entre 15 y 20 minutos. Cinco pasos. El objetivo no es cerrar en la primera llamada: es saber si encaja y acordar el siguiente paso.",
    bloques: [
      {
        t: "pasos",
        x: [
          { titulo: "1 · Abre (1 min)", texto: "«Hola, {nombre}, soy Ainhoa, de ActiveXRemote. Pediste información sobre el curso. ¿Tienes quince minutos ahora?» Si no puede, agenda la hora y cuelga." },
          { titulo: "2 · Su situación (5 min)", texto: "«¿A qué te dedicas ahora?» «¿Desde dónde trabajas?» «¿Qué te hizo pedir información?» Deja que hable. Apunta sus palabras exactas: las vas a usar." },
          { titulo: "3 · Su objetivo y lo que le frena (5 min)", texto: "«¿Dónde te gustaría estar dentro de un año?» «¿Qué has probado hasta ahora?» «¿Qué crees que te falta?» Aquí está la venta: la distancia entre dónde está y dónde quiere estar." },
          { titulo: "4 · Cómo encaja (5 min)", texto: "Recomienda un curso y explícalo con SUS palabras: «Me has dicho que te descartan en el filtro automático; el módulo 9 trabaja justo eso». Dos o tres argumentos, no diez." },
          { titulo: "5 · Siguiente paso (2 min)", texto: "Nunca cuelgues sin acordar algo concreto: reservar plaza, ir a la clase de prueba, o una segunda llamada con fecha. Apúntalo como próxima acción en el gestor." },
        ],
      },
      {
        t: "di",
        si: ["¿Qué te hizo pedir información ahora?", "¿Qué pasaría si dentro de un año sigues igual?", "Por lo que me cuentas, te encaja más…", "¿Qué necesitarías saber para decidir?", "¿Lo hablamos el jueves a las 18:00?"],
        no: ["¿Te interesa el curso?", "Es una oportunidad única", "Quedan muy pocas plazas (si no es verdad)", "Te garantizo que encontrarás trabajo", "Te hago un descuento si te apuntas hoy"],
      },
    ],
  },
  {
    id: "dudas",
    titulo: "Cómo despertar el interés de quien duda",
    entradilla: "Quien duda no necesita más información: necesita certeza. Tu trabajo es quitarle riesgo a la decisión.",
    bloques: [
      {
        t: "pasos",
        x: [
          { titulo: "Encuentra la duda real", texto: "«Se lo está pensando» casi nunca es la duda real. Pregunta: «¿Qué es lo que te frena: las fechas, el precio o saber si es para ti?» Con la duda concreta, se puede trabajar." },
          { titulo: "Que lo pruebe gratis", texto: "La clase de prueba (dry run) es tu mejor herramienta: una clase real, en directo y gratis. Quien la vive deja de imaginar y decide. Usa el mensaje «Invitación a la clase de prueba»." },
          { titulo: "Conecta con su caso, no con el temario", texto: "Elige el módulo que resuelve su problema y cuéntaselo: «Me dijiste que te da miedo la fiscalidad si te vas a Portugal; el módulo 2 compara tu situación con tres destinos.»" },
          { titulo: "Haz visible el coste de no hacer nada", texto: "Sin dramatizar: «Si sigues buscando como hasta ahora, ¿cuánto tiempo más crees que tardarás?» Que lo diga la otra persona." },
          { titulo: "Quita riesgo", texto: `Pago a plazos (${CUOTAS}). Clases grabadas si falta a alguna. La elección de camino es reversible. 14 días de desistimiento según las condiciones.` },
          { titulo: "Dale espacio, con fecha", texto: "«Piénsalo con calma. ¿Te escribo el viernes y me dices?» Y escríbele el viernes. El seguimiento sin fecha se pierde." },
        ],
      },
      {
        t: "aviso",
        x: "Nunca inventes urgencia. Si quedan pocas plazas, dilo con el número real. Si no, la urgencia honesta es la fecha de inicio: el 9 de enero empieza el grupo, y el siguiente aún no tiene fecha.",
      },
    ],
  },
  {
    id: "objeciones",
    titulo: "Objeciones y cómo responderlas",
    entradilla: "Una objeción es una pregunta disfrazada. Primero valida («tiene sentido que lo preguntes»), luego responde corto, luego comprueba («¿eso te lo resuelve?»).",
    bloques: [
      {
        t: "objeciones",
        x: [
          { dice: "Es caro.", piensa: "No sé si me lo voy a devolver.", responde: `Compáralo con lo que busca: un sueldo internacional o el primer cliente de fuera. Son 56 h en directo con grupos de 25, entregables y acceso sin caducidad. Si el problema es pagarlo de golpe: a plazos, ${APLAZADO} en total (${CUOTAS}). Si puede pagarlo de una vez, ${CONTADO} y se ahorra ${AHORRO}.` },
          { dice: "No tengo tiempo.", piensa: "Me da miedo no poder seguirlo.", responde: "Son los fines de semana: 8 h de clase y 2 – 3 h de ejercicio por semana, durante 7 semanas. Si falta a una clase, queda grabada. ¿Qué fin de semana te preocupa?" },
          { dice: "Me lo pienso.", piensa: "Hay algo que no me has resuelto.", responde: "«Claro. ¿Qué es lo que más te hace dudar?» Y trabaja esa duda. Cierra con fecha: «¿Te escribo el viernes?»" },
          { dice: "Lo puedo aprender gratis en YouTube.", piensa: "No veo la diferencia.", responde: "Es verdad que la información está. Lo que no está es el orden, el feedback sobre tu ejercicio, las preguntas en directo y un grupo que avanza contigo. ¿Cuánto tiempo llevas aprendiendo así?" },
          { dice: "Mi inglés no es bueno.", piensa: "No voy a poder seguirlo.", responde: "Las clases son en español. Los materiales están en español y en inglés. Y parte del curso es justo cómo trabajar con empresas de fuera." },
          { dice: "No sé si tengo el nivel.", piensa: "No quiero hacer el ridículo.", responde: "No hace falta nivel previo. Lo que sí hace falta es dominar tu oficio: el curso te enseña a llevarlo al mercado internacional." },
          { dice: "¿Me garantizáis un trabajo?", piensa: "No quiero tirar el dinero.", responde: "No, y desconfía de quien lo garantice. Lo que garantizamos es lo que te llevas: los entregables de cada módulo, hechos con feedback. Encontrar el trabajo depende de ti; el curso te da el método." },
          { dice: "¿Es un máster? ¿Es un título oficial?", piensa: "¿Me sirve el diploma?", responde: "Es un curso. Al terminar recibes el diploma de ActiveXRemote, una certificación privada y verificable, con los módulos que has superado y los acreditados por Deel. No es un título universitario oficial." },
          { dice: "¿La empresa está en Dubái? ¿Es fiable?", piensa: "¿Y si pago y desaparecéis?", responde: "La escuela opera desde Emiratos y el curso es 100 % online. El pago va por Stripe (no vemos tu tarjeta), recibes factura de cada pago y tienes los derechos de consumidor de tu país, con 14 días de desistimiento. Y antes de pagar puedes venir gratis a la clase de prueba." },
          { dice: "¿Quiénes son los profesores?", piensa: "¿Saben de lo que hablan?", responde: "Isaac R. Betanzos (ex-Deel y ex-Oyster) da la primera clase. El equipo docente completo se comunica antes de formalizar la matrícula: si te lo preguntan, pásalo al equipo y no des nombres que no estén confirmados." },
          { dice: "¿Y si cancelan el curso?", piensa: "Riesgo.", responde: "Si la escuela cancela o aplaza un grupo, eliges entre pasar al siguiente o recuperar todo lo pagado. Está en las condiciones." },
          { dice: "Lo tengo que hablar con mi pareja o con mi empresa.", piensa: "No decido solo.", responde: "Perfecto. ¿Qué crees que te va a preguntar? Te mando un resumen por escrito para que lo veáis juntos. Y propón una llamada con las dos personas si hace falta." },
        ],
      },
    ],
  },
  {
    id: "seguimiento",
    titulo: "Seguimiento: la cadencia",
    entradilla: "Mucha gente decide en el tercer o cuarto contacto, no en el primero. La constancia, con respeto y con fecha, es la mitad del trabajo.",
    bloques: [
      {
        t: "tabla",
        cab: ["Cuándo", "Qué haces"],
        filas: [
          ["Día 0 (en menos de 24 h laborables)", "Llamada. Si no coge, WhatsApp «Primer contacto»."],
          ["Día 1", "Segunda llamada a otra hora del día."],
          ["Día 3", "WhatsApp «No contesta», con algo útil."],
          ["Día 7", "Último intento: llamada y correo corto."],
          ["Día 14", "Si no ha respondido: «Cerrar con buen sabor de boca» y descartado (motivo: sin respuesta)."],
          ["Tras una llamada", "El mismo día, el correo «Resumen después de la llamada». Próxima acción con fecha en el gestor."],
        ],
      },
      {
        t: "tabla",
        cab: ["Estado en el gestor", "Qué significa"],
        filas: [
          ["Nuevo", "Ha pedido información. Nadie ha hablado aún con esta persona."],
          ["Contactado", "Ya hemos hablado o escrito y contestado. Aún no sabemos si encaja."],
          ["Interesado", "Encaja, quiere el curso y estamos en el siguiente paso."],
          ["En duda", "Tiene interés, pero algo le frena. Apunta qué en «Objeción»."],
          ["Inscrito", "Ha reservado plaza. Pásalo al equipo para el pago y la matrícula."],
          ["Descartado", "No encaja, no es su momento o no responde. Apunta el motivo."],
        ],
      },
      {
        t: "p",
        x: `Cuando alguien dice sí: confirma el curso, la forma de pago (${CONTADO} en pago único o ${APLAZADO} a plazos, con las cuotas de la calculadora) y los datos de factura, márcalo como «Inscrito» y avisa al equipo, que le envía el enlace de pago seguro. La matrícula se cierra hablando con el equipo: hoy la web no vende directamente.`,
      },
    ],
  },
  {
    id: "mensajes",
    titulo: "Mensajes listos para usar",
    entradilla: "Personalízalos siempre con algo que te haya contado. En el gestor se rellenan solos con su nombre y su curso, y se abren ya escritos en WhatsApp.",
    bloques: [{ t: "plantillas" }],
  },
  {
    id: "nunca",
    titulo: "Lo que nunca decimos",
    entradilla: "Estas reglas protegen a quien nos compra y a la escuela. Algunas son ley; todas son la marca.",
    bloques: [
      {
        t: "di",
        si: [
          "«Curso». Siempre «curso».",
          "Cifras reales y con fuente: «56 h en directo», «grupos de 25».",
          "«Especialista en Remote Business».",
          "«Deel Platinum Partner y Deel Global Partner. 7 módulos acreditados por Deel.»",
          "«Queda grabada» y «acceso sin caducidad».",
          "Tú, siempre. Frases cortas.",
        ],
        no: [
          "«Máster» o «título oficial». Máster es una palabra protegida en España.",
          "Garantías de empleo, de clientes o de ingresos.",
          "Testimonios, valoraciones o número de alumnos: aún no tenemos datos publicables.",
          "Nombres de docentes que no estén confirmados.",
          "Precios de Deel, que Deel es exclusivo nuestro, o productos de Deel que no ha anunciado.",
          `Descuentos, becas u ofertas que no existan. Hay dos precios: ${CONTADO} y ${APLAZADO}.`,
          "«Sin intereses» al hablar de los plazos: a plazos se paga más.",
          "Urgencia falsa: «últimas plazas» sin el número real.",
          "«Líder», «el mejor», «número 1».",
        ],
      },
      {
        t: "aviso",
        x: "Desistimiento: la persona tiene 14 días naturales para desistir. Si pide acceso inmediato al contenido digital y lo recibe entero, pierde ese derecho; si ya se han dado clases, se descuenta la parte disfrutada. Explícalo así, sin interpretarlo. Ante cualquier duda legal, pásala al equipo.",
      },
    ],
  },
  {
    id: "herramientas",
    titulo: "Tus herramientas y tu primer día",
    entradilla: "Todo lo que necesitas está en el gestor comercial del campus. Entra con tu cuenta de Google de ActiveXRemote.",
    bloques: [
      {
        t: "pasos",
        x: [
          { titulo: "El gestor comercial", texto: "www.activexremote.com/admin/comercial. Todas las solicitudes de la web, con su estado, temperatura, próxima acción e historial. Los que tienen la próxima acción vencida salen arriba." },
          { titulo: "La ficha de cada lead", texto: "Botón de llamar y de WhatsApp, los mensajes de este playbook rellenos con sus datos, y el historial de todo lo hablado. Cada vez que cambias el estado queda registrado." },
          { titulo: "La calculadora de plazos", texto: "En el gestor y en la ficha de cada lead: eliges el número de cuotas y el día del primer cargo, y te da los importes, las fechas y el mensaje listo para mandar." },
          { titulo: "Este playbook", texto: "En el gestor, apartado «Playbook», siempre en su última versión, y en PDF." },
          { titulo: "La clase de prueba", texto: "El enlace de reserva del dry run está en la ficha de cada lead, dentro del mensaje de invitación." },
        ],
      },
      {
        t: "lista",
        x: [
          "Lee este playbook entero y la landing www.activexremote.com/bienvenida.",
          "Mira la página de la clase de prueba: www.activexremote.com/dry-run/modulo-1.",
          "Ensaya la llamada de descubrimiento en voz alta, dos veces.",
          "Abre el gestor y ordena los leads por fecha: empieza por los más recientes.",
          "Haz tus primeras 5 llamadas y apunta cada una.",
          "Al final del día, comparte con el equipo las dos preguntas que más te han hecho.",
        ],
      },
    ],
  },
];
