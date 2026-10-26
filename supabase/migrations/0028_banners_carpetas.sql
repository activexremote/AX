-- ══════════════════════════════════════════════════════════
--  Banners: carpetas
--
--  1. ad_folders — carpetas para ordenar los banners (por campaña, por
--     lanzamiento, por cliente…). Sólo administradores, como todo banners.
--  2. ad_banners.folder_id — la carpeta de cada variante. Se mueven desde la
--     galería, sueltas o en grupo. Borrar una carpeta no borra nada: sus
--     variantes se quedan «sin carpeta».
--  3. ad_campaigns.folder_id — la carpeta en la que entran las variantes
--     nuevas de esa campaña (se elige al crearla).
-- ══════════════════════════════════════════════════════════

begin;

create table if not exists public.ad_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ad_folders enable row level security;

drop policy if exists ad_folders_admin on public.ad_folders;
create policy ad_folders_admin on public.ad_folders
  for all using (public.is_admin()) with check (public.is_admin());

alter table public.ad_banners
  add column if not exists folder_id uuid references public.ad_folders(id) on delete set null;
create index if not exists ad_banners_folder_idx on public.ad_banners(folder_id);

alter table public.ad_campaigns
  add column if not exists folder_id uuid references public.ad_folders(id) on delete set null;

commit;
