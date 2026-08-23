# ActiveXRemote Campus

Campus virtual de formación interna de ActiveXRemote. Inspirado en la
plataforma de referencia, con diseño **IBM Carbon Design System**.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions)
- **TypeScript**
- **IBM Carbon Design System** (`@carbon/react`, `@carbon/styles`) + IBM Plex
- **Supabase** — Auth, Postgres (con RLS) y Storage

## Roles

- `alumno` — consume formación y hace quizzes
- `profesor` — todo lo anterior + panel admin (módulos / lecciones / quizzes)
- `administrador` — todo lo anterior + gestión de usuarios y roles

## Puesta en marcha

```bash
npm install
npm run dev          # http://localhost:3000
```

Las credenciales de Supabase están en `.env.local` (no se versiona).

### Base de datos

El esquema y el seed están en `supabase/migrations/`. Para aplicarlos:

```bash
PGPASSWORD='<password>' psql "<connection-string>" -f supabase/migrations/0001_initial_schema.sql
PGPASSWORD='<password>' psql "<connection-string>" -f supabase/migrations/0002_seed_initial.sql
```

### Correos

Las plantillas de correo con la marca del campus están en `supabase/emails/`
(magic link, alta y acceso tras matricularse). Se generan con
`node scripts/build-emails.mjs` y se pegan en Authentication → Emails del panel
de Supabase; ver `supabase/emails/README.md`.

### Crear el primer administrador

```bash
node scripts/create-admin.mjs <email> "<Nombre>"
```

## Estructura

```
src/
  app/
    login/                  Acceso con enlace mágico + Google OAuth
    verificar-telefono/     Paso 2 opcional: código SMS (apagado, NEXT_PUBLIC_PHONE_OTP)
    auth/                   callback del enlace/OAuth + sign-out
    (campus)/               Campus para usuarios autenticados
      page.tsx              Home: hero + ruta + catálogo de módulos
      modulos/[slug]        Detalle de módulo + lecciones
      lecciones/[id]        Lección: contenido + audio + quiz
      mi-progreso           Dashboard de progreso del usuario
    admin/                  Panel admin (profesor/administrador)
      modulos               CRUD módulos y lecciones
      lecciones/[id]        Editor de lección + audio + quiz
      usuarios              Gestión de usuarios y roles
  components/               UI: header, tarjetas, quiz, audio player...
  lib/supabase/             Clientes Supabase (browser/server/admin)
  lib/data/                 Acceso a datos (módulos, progreso, perfil)
```

## Integración de Slack

El campus puede usar Slack como canal único de comunicación. Configúralo en
**Admin → Integración Slack**: pega el Bot Token (`xoxb-...`), define los
canales por rol y activa los eventos.

Eventos: contenido publicado, lección completada, examen aprobado/suspendido,
tarea asignada/recordatorio/vencida/completada, alta de usuario, resúmenes de
progreso de alumnos y de cumplimiento de profesores, recordatorios de inactividad.

### Cron (recordatorios y resúmenes periódicos)

Endpoints protegidos con `CRON_SECRET`:

```
GET /api/cron/reminders         # tareas próximas a vencer / vencidas
GET /api/cron/digest-students   # resumen de progreso → profesores
GET /api/cron/digest-teachers   # cumplimiento → administración
GET /api/cron/all               # los tres
```

Llámalos con `Authorization: Bearer <CRON_SECRET>`. En producción, prográmalos
con Vercel Cron, GitHub Actions o cualquier servicio de cron. También se pueden
lanzar a mano desde Admin → Integración Slack.

## Funcionalidades

- Acceso sin contraseña: enlace mágico al correo y Google OAuth
- Registro con nombre, email y teléfono (la verificación por SMS existe pero
  está apagada: cuesta dinero por código, se enciende con `NEXT_PUBLIC_PHONE_OTP=on`)
- Catálogo de módulos con ruta recomendada y stats
- Lecciones con contenido Markdown, audio narrado y tabla de contenidos
- Quizzes con corrección automática y pantalla "¡Has aprobado!"
- Seguimiento de progreso: KPIs, progreso por módulo, actividad reciente
- Exportar progreso a JSON / reiniciar progreso
- Panel admin: CRUD de módulos, lecciones (editor Markdown + subida de
  audio a Storage), quizzes, y gestión de roles de usuario
