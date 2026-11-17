-- ══════════════════════════════════════════════════════════
--  Perfilado de leads (gestor comercial)
--
--  Los leads viven en Zoho. Aquí se guarda lo que el equipo comercial
--  apunta de cada uno después de hablar con él (qué perfil es, qué buscaba,
--  qué le pareció el precio, cuánto interés real tenía…), para comparar
--  tipologías y ver a quién deberían apuntar los anuncios.
--
--  · lead_profiles: una ficha por lead de Zoho (zoho_id). Las respuestas van
--    en `answers` (clave de la pregunta → valor); las preguntas están en
--    src/lib/comercial/perfilado.ts. Se guarda una copia del nombre y el
--    estado del lead para poder analizar aunque Zoho no conteste.
--  · lead_insights: cada análisis con IA que se pide desde la página de
--    análisis, para ver el último sin volver a pagar.
--
--  Sólo se leen y escriben desde el servidor (cliente de servicio), tras
--  comprobar que quien lo pide es comercial o administración: sin políticas.
-- ══════════════════════════════════════════════════════════

create table if not exists public.lead_profiles (
  zoho_id text primary key,
  lead_name text,
  lead_email text,
  lead_status text,
  lead_created_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  notes text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_lead_profiles_updated_at on public.lead_profiles;
create trigger trg_lead_profiles_updated_at before update on public.lead_profiles
  for each row execute function public.touch_updated_at();

create table if not exists public.lead_insights (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  leads_count integer not null default 0,
  content jsonb not null
);

create index if not exists lead_insights_created_idx on public.lead_insights (created_at desc);

alter table public.lead_profiles enable row level security;
alter table public.lead_insights enable row level security;
