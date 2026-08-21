export const STARTER_TEMPLATE = `# The Web Starter Template

El punto de partida para tu siguiente proyecto: la estructura, la
configuración y las piezas que en el curso montaste a mano, ya resueltas.

No es un generador ni una dependencia que instalar. Son los archivos, uno a
uno, para copiar en un proyecto nuevo. A propósito: la gracia del curso es que
entiendes lo que hay dentro, y un generador que escupe treinta archivos que no
has leído es exactamente la caja negra de la que veníamos huyendo.

---

## Cómo se usa

1. Crea el proyecto con la herramienta oficial de tu framework.
2. Instala el cliente de tu servicio de datos.
3. Copia los archivos de abajo.
4. Rellena \`.env.local\`.
5. Arranca y comprueba que la página de inicio carga.

---

## Estructura

\`\`\`
mi-proyecto/
├─ .env.local            ← NUNCA se sube al repositorio
├─ .env.example          ← sí se sube: dice qué variables hacen falta
├─ .gitignore
├─ README.md
├─ src/
│  ├─ app/               ← rutas
│  ├─ components/        ← interfaz reutilizable
│  └─ lib/
│     ├─ supabase/       ← clientes (navegador, servidor, admin)
│     └─ data/           ← consultas, en un sitio y no repartidas
└─ supabase/
   └─ migrations/        ← el esquema, versionado como el código
\`\`\`

**La regla que sostiene todo esto:** las consultas viven en \`lib/data\`, nunca
sueltas dentro de un componente. El día que cambies de servicio de datos,
tocas una carpeta en vez de cuarenta archivos.

---

## \`.gitignore\`

\`\`\`gitignore
node_modules/
.next/
out/
build/
.DS_Store

# Variables de entorno: TODAS menos el ejemplo.
.env*
!.env.example
\`\`\`

Ese \`!.env.example\` no sobra: es lo que permite que quien clone el repo sepa
qué variables necesita sin que se suba ninguna de verdad.

---

## \`.env.example\`

\`\`\`bash
# Públicas: viajan al navegador. Aquí NO va nada secreto.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Privadas: sólo servidor. Si esto acaba en el navegador, tu base es de todos.
SUPABASE_SERVICE_ROLE_KEY=

# URL pública del sitio, para los enlaces de vuelta del correo.
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

---

## Los tres clientes de datos

Son tres y no uno, y la diferencia importa:

**Navegador** — lleva la clave anónima. Todo lo que haga pasa por las reglas
de acceso de la base.

\`\`\`ts
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
\`\`\`

**Servidor** — la misma clave anónima, pero leyendo la sesión de las cookies,
para que las reglas sepan quién pregunta.

\`\`\`ts
// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list) => {
          try {
            for (const { name, value, options } of list) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // En un Server Component no se pueden escribir cookies. No es un
            // error: las refresca el middleware.
          }
        },
      },
    },
  );
}
\`\`\`

**Administración** — se salta TODAS las reglas de acceso. Sólo para lo que el
usuario no puede hacer por sí mismo.

\`\`\`ts
// src/lib/supabase/admin.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ⚠️ Este cliente ignora RLS. Nunca se importa desde un componente de cliente.
// Si esta clave llega al navegador, tu base de datos es pública.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
\`\`\`

---

## Migración inicial

\`\`\`sql
-- supabase/migrations/0001_inicial.sql
begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

-- Crea el perfil solo al registrarse alguien.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Tu tabla de trabajo. Cámbiale el nombre y los campos.
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

create index if not exists items_user_idx on public.items (user_id);

-- ── Reglas de acceso ──
-- Por defecto no se puede nada. Se abre lo justo.
alter table public.profiles enable row level security;
alter table public.items enable row level security;

create policy "perfil propio" on public.profiles
  for select using (id = auth.uid());

-- Las CUATRO operaciones. Una policy de lectura no protege el borrado:
-- es el agujero más común de un primer proyecto.
create policy "items propios: leer"     on public.items for select using (user_id = auth.uid());
create policy "items propios: crear"    on public.items for insert with check (user_id = auth.uid());
create policy "items propios: editar"   on public.items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "items propios: borrar"   on public.items for delete using (user_id = auth.uid());

commit;
\`\`\`

---

## Consultas, en su sitio

\`\`\`ts
// src/lib/data/items.ts
import { createClient } from "@/lib/supabase/server";

export async function listItems() {
  const supabase = await createClient();
  // No hace falta filtrar por usuario: lo hace RLS. Y lo hace en la base,
  // así que también protege lo que no pase por esta función.
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(\\\`[items] no se pudieron leer: \\\${error.message}\\\`);
    return [];
  }
  return data ?? [];
}
\`\`\`

---

## \`README.md\`

\`\`\`markdown
# [Nombre del proyecto]

[Una frase: qué hace y para quién.]

## Arrancar

1. \\\`npm install\\\`
2. Copia \\\`.env.example\\\` a \\\`.env.local\\\` y rellénalo.
3. Ejecuta las migraciones de \\\`supabase/migrations\\\` en tu proyecto.
4. \\\`npm run dev\\\`

## Variables de entorno

| Variable | Pública | Para qué |
|---|---|---|
| \\\`NEXT_PUBLIC_SUPABASE_URL\\\` | sí | dirección del proyecto |
| \\\`NEXT_PUBLIC_SUPABASE_ANON_KEY\\\` | sí | clave del navegador |
| \\\`SUPABASE_SERVICE_ROLE_KEY\\\` | **no** | tareas de servidor |

## Arquitectura

- Frontend: [framework]
- Datos y autenticación: Supabase (PostgreSQL)
- Despliegue: [proveedor]
\`\`\`

Ese README no es para lucirse: es lo que hace que dentro de seis meses puedas
volver al proyecto sin tener que reconstruir de memoria cómo arrancaba.

---

## Antes de publicar

Repasa el **Ship Checklist**, que es el otro desbloqueo de este curso.
`;
