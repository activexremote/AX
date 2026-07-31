-- Solicitudes de información desde la landing pública

begin;

------------------------------------------------------------
-- 1. Leads
------------------------------------------------------------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  -- 'remote-professional' | 'remote-founder' (se pueden pedir los dos)
  courses text[] not null default '{}',
  locale text,
  status text not null default 'nuevo',   -- nuevo | contactado | inscrito | descartado
  notes text,
  constraint leads_courses_not_empty check (cardinality(courses) > 0)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_email_idx      on public.leads (lower(email));

------------------------------------------------------------
-- 2. RLS
------------------------------------------------------------
-- El formulario es público, pero NO se escribe desde el navegador: el server
-- action inserta con la service role. Por eso no hay política de insert para
-- anon — así nadie puede llenar la tabla llamando a la REST API directamente.
alter table public.leads enable row level security;

create policy "leads_staff_read" on public.leads
  for select using (public.is_staff());

create policy "leads_staff_manage" on public.leads
  for update using (public.is_staff()) with check (public.is_staff());

create policy "leads_admin_delete" on public.leads
  for delete using (public.is_admin());

commit;
