export const SHIP_CHECKLIST = `# Ship Checklist

La lista que se repasa antes de decir «está publicado». No es burocracia: cada
línea de aquí es un fallo que le ha pasado a alguien el día del lanzamiento.

Repásala **en la URL pública**, no en local. La mitad de las cosas que fallan
en producción funcionan perfectamente en tu máquina.

---

## 1. El código

- [ ] Todo lo que quieres publicar está commiteado y en el remoto.
- [ ] \`git status\` sale limpio: no hay nada suelto sin subir.
- [ ] No hay ni una clave en el repositorio. Búscalo de verdad:
  \`\`\`bash
  git grep -nE "(sk-|service_role|SUPABASE_SERVICE|BEGIN .*PRIVATE KEY)"
  \`\`\`
  Si sale algo, no basta con borrarlo: **rota la clave**, porque quedó en el historial.
- [ ] \`.env.local\` está en \`.gitignore\` y NO aparece en \`git ls-files\`.

## 2. La configuración

- [ ] Cada variable que usa el proyecto existe también en el proveedor.
- [ ] Las públicas (\`NEXT_PUBLIC_…\` o equivalente) sólo contienen cosas que
      no importa que se lean: URL del proyecto, clave anónima.
- [ ] Ninguna clave privada tiene prefijo público. Míralo dos veces.
- [ ] Las URLs de callback de autenticación apuntan al dominio de producción,
      no a localhost. Es el fallo número uno del primer despliegue.

## 3. Los datos

- [ ] Las tablas de producción existen y tienen el mismo esquema que las de desarrollo.
- [ ] **RLS activado en todas las tablas con datos de personas.**
- [ ] Hay policy para cada operación que usas: select, insert, update, delete.
      Una policy de lectura no protege el borrado.
- [ ] Probado con **dos cuentas distintas**: el usuario A no ve nada del B.
      No lo des por hecho: créate la segunda cuenta y compruébalo.

## 4. La autenticación

- [ ] Registro, inicio y cierre de sesión funcionan **en la URL pública**.
- [ ] Sin sesión no se llega a las rutas privadas escribiéndolas a mano en la barra.
- [ ] El correo de confirmación o de recuperación llega de verdad. Pruébalo con
      una dirección que no sea la tuya.

## 5. El build

- [ ] El build de producción pasa sin errores.
- [ ] No hay avisos que estés ignorando desde hace semanas: léelos una vez.
- [ ] La web carga en un navegador donde no has iniciado sesión nunca
      (ventana privada). Así ves lo que ve un desconocido.

## 6. El dominio

- [ ] El dominio resuelve y carga el proyecto.
- [ ] Con y sin \`www\`: uno de los dos redirige al otro, no conviven los dos.
- [ ] Candado en la barra: el certificado está emitido y es válido.
- [ ] \`http://\` redirige a \`https://\`.

## 7. Los estados

- [ ] Estado de **carga**: se ve algo mientras llega la respuesta.
- [ ] Estado **vacío**: un usuario nuevo, sin datos, entiende qué es esto y qué hacer.
- [ ] Estado de **error**: si algo falla, se dice qué y se puede reintentar.
- [ ] Móvil: se puede usar de verdad con el pulgar, no sólo «se ve».

## 8. Lo último

- [ ] El \`README\` explica qué es el proyecto, cómo se arranca y qué variables necesita.
- [ ] Sabes explicar en tres minutos qué has construido y por qué elegiste cada pieza.
- [ ] Has entrado desde el móvil de otra persona, con otra conexión. Funciona.

---

*Si un punto no aplica a tu proyecto, táchalo a conciencia — no lo saltes por
prisa. Los que se saltan por prisa son exactamente los que fallan.*
`;
