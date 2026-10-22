-- ══════════════════════════════════════════════════════════
--  Banners: anuncios estáticos para Meta desde el panel
--
--  Una campaña nace de un curso, un objetivo y unos ángulos, y OpenAI
--  escribe varias variantes de anuncio (texto de la pieza y textos de Meta)
--  y pinta una imagen de fondo SIN texto para cada una. La pieza final se
--  compone en el servidor con la marca (src/lib/banners/render.tsx) en los
--  tres formatos: 1080×1080, 1080×1350 y 1080×1920. Así el texto sale
--  siempre bien escrito y se puede corregir sin pagar otra imagen.
--
--  1. ad_campaigns — la campaña: curso, objetivo, idioma, estilo, notas.
--  2. ad_banners   — una fila por variante: textos, imagen, plantilla,
--                    revisión de normas y estado.
--  3. ad_usage     — lo que ha costado cada llamada, como social_usage.
--  4. El bucket `ad-banners`, PRIVADO: las imágenes sólo las lee el
--     servidor para componer la pieza; nadie las descarga por URL.
--
--  Todo es sólo para administradores, igual que las publicaciones.
-- ══════════════════════════════════════════════════════════

begin;

-- ── 1. Campañas ──────────────────────────────────────────
create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course text not null default 'escuela'
    check (course in ('escuela', 'remote-professional', 'remote-founder')),
  -- captar leads, dar a conocer, recuperar visitas.
  objective text not null default 'leads'
    check (objective in ('leads', 'alcance', 'retargeting')),
  language text not null default 'es' check (language in ('es', 'en')),
  -- Plantilla visual por defecto de las variantes (se puede cambiar en cada una).
  style text not null default 'foto',
  angles text[] not null default '{}',
  audience text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ad_campaigns enable row level security;

drop policy if exists ad_campaigns_admin on public.ad_campaigns;
create policy ad_campaigns_admin on public.ad_campaigns
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 2. Variantes ─────────────────────────────────────────
create table if not exists public.ad_banners (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.ad_campaigns(id) on delete cascade,
  position int not null default 0,
  angle text,
  -- { kicker, headline, sub, cta, primaryText, adHeadline, description, alt }
  copy jsonb not null default '{}'::jsonb,
  template text not null default 'foto',
  -- Ruta dentro del bucket `ad-banners`; null = sin imagen (plantilla de marca).
  image_path text,
  image_prompt text,
  image_source text not null default 'ninguna'
    check (image_source in ('ia', 'subida', 'ninguna')),
  -- { flags: [{ level, rule, text }], checkedAt }
  review jsonb not null default '{}'::jsonb,
  status text not null default 'borrador'
    check (status in ('borrador', 'aprobado', 'descartado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ad_banners_campaign on public.ad_banners (campaign_id, position);

alter table public.ad_banners enable row level security;

drop policy if exists ad_banners_admin on public.ad_banners;
create policy ad_banners_admin on public.ad_banners
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 3. Gasto ─────────────────────────────────────────────
create table if not exists public.ad_usage (
  id uuid primary key default gen_random_uuid(),
  -- Si se borra la campaña, el gasto sigue contando: ya está pagado.
  campaign_id uuid references public.ad_campaigns(id) on delete set null,
  kind text not null check (kind in ('texto', 'imagen')),
  model text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd numeric(12, 6) not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists ad_usage_created on public.ad_usage (created_at);

alter table public.ad_usage enable row level security;

drop policy if exists ad_usage_admin on public.ad_usage;
create policy ad_usage_admin on public.ad_usage
  for all using (public.is_admin()) with check (public.is_admin());

-- ── 4. Imágenes ──────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('ad-banners', 'ad-banners', false)
on conflict (id) do update set public = false;

drop policy if exists "ad_banners_admin_all" on storage.objects;
create policy "ad_banners_admin_all" on storage.objects
  for all using (bucket_id = 'ad-banners' and public.is_admin())
  with check (bucket_id = 'ad-banners' and public.is_admin());

commit;
