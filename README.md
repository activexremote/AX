# ActiveXRemote Campus

Campus virtual y web pública de ActiveXRemote, The Remote Business School:
el campus donde los alumnos siguen el programa (21 módulos, 105 lecciones en
español e inglés) y las landings donde se venden los cursos.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions). Ojo: trae
  cambios que rompen; ver `AGENTS.md`.
- **TypeScript** y **Sass**
- **IBM Carbon** (`@carbon/react`, `@carbon/styles`) como base de componentes,
  con la marca propia encima: Inter y Major Mono Display (ver `docs/BRANDBOOK.md`)
- **Supabase** — Auth (Google), Postgres con RLS y Storage
- **Stripe** — cobro de matrículas (Checkout + webhook)
- **OpenAI** — asistente del campus, primer borrador de lecciones y voz de reserva
- **Fish Audio** — narración de las lecciones
- **Zoho CRM** — leads de los formularios públicos
- Despliegue en **Vercel**

## Roles

- `alumno` — consume formación y hace quizzes; necesita matrícula para ver contenido
- `profesor` — todo lo anterior + panel admin y guía para profesores
- `administrador` — todo lo anterior + usuarios, matrículas y roles
- superadmin — aparte de los roles (tabla `superadmins`): acceso a Lens

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

Las credenciales van en `.env.local` (no se versiona): Supabase, Stripe,
OpenAI, Fish, Zoho, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL` y, si se usa,
`NEXT_PUBLIC_GTM_ID`.

### Base de datos

Las migraciones están en `supabase/migrations/`, numeradas. Se aplican en orden:

```bash
PGPASSWORD='<password>' psql "<connection-string>" -f supabase/migrations/0001_initial_schema.sql
# … y así hasta la última
```

### Acceso

Sólo con Google. Entrar y registrarse son lo mismo; tener cuenta no da acceso
al contenido, que lo abre la matrícula (al pagar o a mano desde
`/admin/usuarios`). Para cerrar del todo el acceso por correo hay que apagar el
proveedor «Email» en Supabase (Authentication → Providers).

### Correos

Las plantillas con la marca están en `supabase/emails/`. Se generan con
`node scripts/build-emails.mjs` y se pegan en Authentication → Emails del panel
de Supabase; ver `supabase/emails/README.md`.

### Crear el primer administrador

```bash
node scripts/create-admin.mjs <email> "<Nombre>"
```

### Scripts de contenido

```bash
npm run campus:import     # carga el curso (módulos, lecciones ES/EN, descargas, guía)
npm run audio:generate    # narra las lecciones sin audio (-- --idioma en para inglés)
npm run asistente:seed    # carga el conocimiento inicial del asistente
```

## Estructura

```
src/
  app/
    bienvenida/             Landing pública (la raíz sin sesión redirige aquí)
    cursos/                 Remote Professional y Remote Founder
    cursos-relampago/       Cursos cortos
    trabajo-remoto/         Landing de anuncios
    blog/  glosario/  legal/
    matricula/              Matrícula con Stripe (cerrada: ver flags.ts)
    lens/                   Panel de dirección y calculadora (superadmin)
    login/  auth/           Acceso con Google y callback
    (campus)/               Campus para alumnos con sesión
      modulos/[slug]        Módulo y sus lecciones
      lecciones/[id]        Lección: bloques + audio + Erlik + quiz
      mi-progreso  mis-tareas  desbloqueos/
    admin/                  Panel (profesor/administrador)
      modulos  lecciones    Contenido, editor por bloques bilingüe
      usuarios  matriculas  Personas y accesos
      tareas  slack         Tareas e integración con Slack
      asistente  ia         Conocimiento del asistente y ajustes de IA
      guia-profesores       Material privado del profesorado
    api/                    asistente, cron/[job], stripe/webhook
  components/               UI del campus, landings, admin y Lens
  lib/                      Supabase, datos, contenido, TTS, IA, Zoho, i18n…
```

## Interruptores de la web pública

En `src/app/bienvenida/flags.ts`. Hoy están todos apagados:

- `CHECKOUT_OPEN` — matrícula online; cerrada mientras los precios no sean públicos
- `PROTOTYPE_RATINGS`, `PROTOTYPE_ALUMNI` — valoraciones y testimonios de
  maqueta; sólo se encienden con datos reales
- `SHOW_FLASH_COURSES` — banda de cursos relámpago en la portada

## Integración de Slack

Se configura en **Admin → Integración Slack**: Bot Token (`xoxb-...`), canales
por rol y eventos (contenido publicado, lecciones y exámenes, tareas, altas,
resúmenes de progreso y recordatorios de inactividad).

### Cron

Endpoints protegidos con `CRON_SECRET` y programados en `vercel.json`:

```
GET /api/cron/reminders         # tareas próximas a vencer / vencidas (diario)
GET /api/cron/digest-students   # resumen de progreso → profesores (lunes)
GET /api/cron/digest-teachers   # cumplimiento → administración (viernes)
GET /api/cron/all               # los tres
```

Con `Authorization: Bearer <CRON_SECRET>`. También se lanzan a mano desde
Admin → Integración Slack.

## Telegram

Cada push al repo manda un parte de sus commits al tema «Commits» del grupo
del equipo (`.github/workflows/telegram-commits.yml`). Secrets de GitHub:
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` y `TELEGRAM_THREAD_ID`.

## Funcionalidades del campus

- 21 módulos (7 núcleo, 7 Remote Professional, 7 Remote Founder) y 105
  lecciones; cada alumno ve su idioma
- Lecciones por bloques, con descargas, narración en audio y Erlik, el profesor
  que acompaña la lección
- Quizzes con corrección automática, progreso, tareas y desbloqueos
- Asistente que responde con las FAQs y los documentos que sube el equipo
- Editor de lecciones en el propio campus y en el panel, en los dos idiomas,
  con IA para el primer borrador y creación a partir de un archivo
- Guía para profesores en almacenamiento privado, con enlaces que caducan
- Registro con teléfono; la verificación por SMS existe pero está apagada
  (`NEXT_PUBLIC_PHONE_OTP=on` la enciende)
