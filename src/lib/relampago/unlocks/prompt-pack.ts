export const PROMPT_PACK = `# AI Builder Prompt Pack

Prompts para las nueve situaciones que se repiten construyendo un producto web.

Todos siguen la misma forma, y esa forma es lo que de verdad te llevas:

> **contexto → objetivo → restricciones → qué quiero de vuelta**

Un prompt sin contexto produce código genérico. Un prompt sin restricciones
produce código que rompe cosas. Un prompt sin decir qué esperas de vuelta
produce cuatrocientas líneas cuando querías una opinión.

Cambia lo que va \`entre corchetes\`.

---

## 1. Antes de tocar nada: entender el proyecto

\`\`\`
Este proyecto es [qué hace, en una frase]. Usa [framework] y [servicio de datos].

Antes de cambiar nada: recorre el proyecto y dime
 1. qué carpetas hay y qué papel juega cada una,
 2. dónde vive la configuración,
 3. dónde se habla con la base de datos,
 4. qué convenciones sigue el código que ya existe.

No modifiques ningún archivo todavía.
\`\`\`

## 2. Planificar una funcionalidad

\`\`\`
Quiero añadir [funcionalidad] a este proyecto.

Dame un PLAN antes de escribir código:
 - qué archivos vas a crear y cuáles vas a tocar,
 - en qué orden, de forma que pueda probar cada paso por separado,
 - qué se puede romper de lo que ya funciona,
 - qué decisiones hay que tomar y qué opciones tengo en cada una.

No escribas código todavía. Quiero revisar el plan primero.
\`\`\`

**Por qué:** corregir un plan cuesta un minuto. Corregir una implementación
cuesta una tarde.

## 3. Diseñar el esquema de datos

\`\`\`
Necesito guardar [qué cosas] con [qué información de cada una].
Se relacionan así: [describe las relaciones].

Propón el esquema: tablas, columnas, tipos, claves primarias y foráneas.
Para cada decisión discutible, dime la alternativa y cuándo la elegirías.
Ten en cuenta que voy a necesitar reglas de acceso por usuario.
\`\`\`

## 4. Reglas de acceso (RLS)

\`\`\`
Tengo la tabla [tabla] con la columna [columna_de_propietario].
Quiero que cada usuario sólo pueda ver y modificar sus propias filas.

Escribe las policies para select, insert, update y delete.
Explica qué hace cada una y cómo puedo comprobar con dos cuentas
distintas que funcionan de verdad.
\`\`\`

**Por qué las cuatro:** una policy de lectura no protege el borrado. Es el
agujero más común en un primer proyecto.

## 5. Interfaz con todos sus estados

\`\`\`
Construye [pantalla] siguiendo las convenciones del proyecto.

Tiene que contemplar los cuatro estados, no sólo el bueno:
 - cargando,
 - vacío (sin datos todavía) con una invitación a crear el primero,
 - error, diciendo qué pasó y permitiendo reintentar,
 - con datos.

Que funcione con el pulgar en un móvil, no sólo que se vea.
\`\`\`

## 6. Depurar

\`\`\`
Tengo este error:
[pega el error ENTERO, con el stack trace]

Ocurre cuando [qué haces exactamente para provocarlo].
Esperaba [qué], y pasa [qué].
El archivo relevante es [ruta] y lo último que cambié fue [qué].

No reescribas nada todavía: dime primero cuáles son las causas más probables
y cómo descartar cada una.
\`\`\`

**Por qué:** «no me funciona» no es contexto. El stack trace ya te está
diciendo el archivo y la línea.

## 7. Revisar un diff

\`\`\`
Explícame este cambio como si tuviera que defenderlo yo en una revisión:
 - qué hace cada archivo modificado,
 - por qué era necesario,
 - qué podría romper,
 - qué comprobaría antes de darlo por bueno.

Si hay algo que harías de otra forma, dímelo ahora.
\`\`\`

## 8. QA antes de publicar

\`\`\`
Voy a publicar esto. Actúa como alguien que quiere encontrar fallos, no como
alguien que quiere aprobarlo.

Revisa: secretos expuestos, reglas de acceso incompletas, estados de error
sin cubrir, y cosas que funcionen en local pero fallen en producción.

Ordena lo que encuentres por gravedad y dime cómo comprobar cada punto.
\`\`\`

## 9. Publicar

\`\`\`
Quiero desplegar este proyecto en [proveedor] con un dominio propio.

Dime paso a paso: qué variables de entorno hay que configurar y cuáles son
públicas o privadas, qué registros DNS hacen falta, y qué comprobar después
para saber que ha ido bien de verdad.
\`\`\`

---

## Las cinco reglas que están detrás de todos

1. **Contexto antes que orden.** El modelo no sabe qué proyecto es el tuyo.
2. **Pide el plan antes que el código** siempre que el cambio toque más de un archivo.
3. **Cambios pequeños y verificables.** Un cambio grande que no entiendes es deuda, no velocidad.
4. **Lee el diff.** Si no lo lees, no sabes qué has aceptado.
5. **No aceptes lo que no puedas explicar.** Pídele que te lo explique antes de seguir.
`;
