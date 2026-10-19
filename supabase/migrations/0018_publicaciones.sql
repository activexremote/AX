-- ══════════════════════════════════════════════════════════
--  Publicaciones: X, LinkedIn y el blog desde el panel
--
--  Una publicación nace de un tema, un enlace o unas imágenes, y DeepSeek
--  escribe una versión para cada canal siguiendo las buenas prácticas de
--  cada uno (src/lib/social/canales.ts). Cada versión se revisa, se edita y
--  se programa por separado: lo que funciona en X no funciona en LinkedIn, y
--  publicar en uno no obliga a publicar en los demás.
--
--  1. social_settings — una fila: las claves de DeepSeek y de Upload-Post.
--     Misma forma que ai_settings (0015) y slack_settings (0004): singleton,
--     sólo administradores, y las claves nunca salen del servidor.
--
--  2. social_posts — la publicación: de qué va y con qué material.
--
--  3. social_variants — una fila por canal, con su texto, su estado y su
--     fecha. El contenido es jsonb libre porque cada canal tiene su forma
--     (un tuit no se parece a un artículo); la valida la aplicación.
--
--  4. El bucket `social-media`, PÚBLICO: las redes descargan la imagen de una
--     URL al publicar, así que una URL firmada que caduca no les sirve.
--
--  Todo es sólo para administradores: publicar en nombre de la escuela es
--  hablar por ella.
-- ══════════════════════════════════════════════════════════

begin;

-- ── 1. Ajustes ───────────────────────────────────────────
create table if not exists public.social_settings (
  id text primary key default 'default',
  deepseek_api_key text,
  deepseek_model text not null default 'deepseek-flash',
  -- Upload-Post publica en X y LinkedIn por nosotros. `uploadpost_user` es el
  -- nombre del perfil que agrupa las cuentas conectadas allí.
  uploadpost_api_key text,
  uploadpost_user text,
  last_test_ok boolean,
  last_test_at timestamptz,
  last_test_detail text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

insert into public.social_settings (id) values ('default')
on conflict (id) do nothing;

alter table public.social_settings enable row level security;

drop policy if exists social_settings_admin on public.social_settings;
create policy social_settings_admin on public.social_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 2. Publicaciones ─────────────────────────────────────
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  -- Nombre interno, para reconocerla en el listado.
  title text not null,
  topic text,
  source_url text,
  -- Título y texto extraídos del enlace, guardados para poder regenerar sin
  -- volver a descargar la página (que puede haber cambiado o desaparecido).
  source_title text,
  source_text text,
  -- [{ "path": "...", "url": "https://...", "alt": "..." }]
  images jsonb not null default '[]'::jsonb,
  language text not null default 'es' check (language in ('es', 'en')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_posts enable row level security;

drop policy if exists social_posts_admin on public.social_posts;
create policy social_posts_admin on public.social_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 3. Una versión por canal ─────────────────────────────
create table if not exists public.social_variants (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.social_posts(id) on delete cascade,
  channel text not null check (channel in ('x', 'linkedin', 'blog')),
  body jsonb not null default '{}'::jsonb,
  -- borrador → programado → publicado (o error, y vuelta a programar).
  status text not null default 'borrador'
    check (status in ('borrador', 'programado', 'publicado', 'error')),
  scheduled_at timestamptz,
  published_at timestamptz,
  external_url text,
  error text,
  updated_at timestamptz not null default now(),
  unique (post_id, channel),
  -- Programado sin fecha no significa nada: el cron no sabría cuándo.
  check (status <> 'programado' or scheduled_at is not null)
);

create index if not exists social_variants_due
  on public.social_variants (scheduled_at)
  where status = 'programado';

alter table public.social_variants enable row level security;

drop policy if exists social_variants_admin on public.social_variants;
create policy social_variants_admin on public.social_variants
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 4. Imágenes ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('social-media', 'social-media', true)
on conflict (id) do update set public = true;

drop policy if exists "social_media_public_read" on storage.objects;
create policy "social_media_public_read" on storage.objects
  for select using (bucket_id = 'social-media');

drop policy if exists "social_media_admin_write" on storage.objects;
create policy "social_media_admin_write" on storage.objects
  for insert with check (bucket_id = 'social-media' and public.is_admin());

drop policy if exists "social_media_admin_update" on storage.objects;
create policy "social_media_admin_update" on storage.objects
  for update using (bucket_id = 'social-media' and public.is_admin())
  with check (bucket_id = 'social-media' and public.is_admin());

drop policy if exists "social_media_admin_delete" on storage.objects;
create policy "social_media_admin_delete" on storage.objects
  for delete using (bucket_id = 'social-media' and public.is_admin());

commit;
