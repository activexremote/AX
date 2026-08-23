# Correos del campus

Las tres plantillas que Supabase manda en nombre de ActiveXRemote. Se generan
con `node scripts/build-emails.mjs` desde un armazón común: **si hay que
retocar el diseño, se toca el script, no los HTML** —los archivos de aquí se
sobrescriben en cada ejecución.

## Dónde se pega cada una

Panel de Supabase → **Authentication → Emails** → pestaña Templates.

| Archivo | Plantilla de Supabase | Cuándo sale | Asunto sugerido |
|---|---|---|---|
| `magic-link.html` | **Magic Link** | Alguien con cuenta pide entrar desde `/login` | `Tu enlace de acceso al campus` |
| `confirm-signup.html` | **Confirm signup** | Alguien se registra por primera vez | `Confirma tu cuenta de ActiveXRemote` |
| `acceso-matricula.html` | **Reset Password** | Se confirma una matrícula pagada (`src/lib/data/orders.ts`) | `Tu matrícula está confirmada: entra al campus` |

> La de **Reset Password** no restablece ninguna contraseña: al campus se entra
> con enlace mágico y esa plantilla es la que usa el webhook de Stripe para
> abrirle el acceso a quien acaba de pagar. Por eso el texto habla de matrícula
> y no de contraseñas.

## Antes de darlo por hecho

- **URL Configuration** → *Site URL* apuntando al dominio público y
  `https://<dominio>/auth/callback` en la lista de *Redirect URLs* (más
  `http://localhost:3000/auth/callback` para desarrollo). Sin eso el enlace
  del correo vuelve a un sitio que Supabase rechaza.
- El símbolo ΔX se sirve desde `https://activexremote.com/email/logo-axr.png`
  (lo genera `node scripts/build-email-logo.mjs`). Hasta el primer despliegue
  con ese archivo, el correo se ve bien igual: la marca escrita va en texto,
  no en la imagen.
- Los clientes bloquean imágenes por defecto. Nada importante depende de la
  imagen: ni el botón, ni el enlace de repuesto, ni la letra pequeña.
- Sólo están en español. Si algún día hace falta la versión inglesa, se añade
  otro juego de textos en `scripts/build-emails.mjs`: el armazón ya está.
