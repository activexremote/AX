-- Panel Lens: acceso restringido a superadmin + calculadora de matrículas

begin;

------------------------------------------------------------
-- 1. Superadmins
------------------------------------------------------------
-- Rol aparte de `profiles.role`: Lens es un panel de dirección (previsión de
-- ingresos, rentabilidad), no de operación del curso, así que no tiene
-- sentido mezclarlo con el enum alumno/profesor/administrador que gobierna
-- el campus.
create table if not exists public.superadmins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.superadmins where user_id = auth.uid());
$$;

alter table public.superadmins enable row level security;

-- Cada uno puede comprobar si está en la lista (lo usa el guard de /lens);
-- añadir o quitar superadmins requiere la service role.
create policy "superadmins_self_read" on public.superadmins
  for select using (user_id = auth.uid());

------------------------------------------------------------
-- 2. Escenarios de la calculadora de matrículas
------------------------------------------------------------
-- Cada fila es una previsión guardada (precios, canales, costes) para poder
-- volver a ajustarla más tarde sin perder el punto de partida.
create table if not exists public.lens_scenarios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  data jsonb not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lens_scenarios_updated_at_idx on public.lens_scenarios (updated_at desc);

alter table public.lens_scenarios enable row level security;

create policy "lens_scenarios_superadmin_all" on public.lens_scenarios
  for all using (public.is_superadmin()) with check (public.is_superadmin());

commit;
