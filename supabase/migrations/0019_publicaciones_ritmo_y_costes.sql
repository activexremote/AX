-- ══════════════════════════════════════════════════════════
--  Publicaciones: ritmo, nevera y costes
--
--  1. El RITMO de cada canal (qué días y a qué hora se publica). De él salen
--     los huecos del calendario y los meses de cobertura: sin ritmo no hay
--     forma de saber si "vamos cubiertos".
--
--  2. La NEVERA: un estado más para las versiones revisadas y listas que
--     todavía no tienen fecha. Sirven para rellenar huecos sin prisas.
--
--  3. El COSTE de cada llamada a DeepSeek, con sus tokens, para saber lo que
--     cuesta cada publicación y lo que llevamos gastado.
--
--  4. Los UMBRALES de las alertas: cuántos días de cola mínima, cuántas
--     publicaciones al mes permite el plan de Upload-Post y por debajo de qué
--     saldo de DeepSeek hay que avisar.
-- ══════════════════════════════════════════════════════════

begin;

-- ── 1 y 4. Ritmo y alertas ───────────────────────────────
alter table public.social_settings
  -- Días ISO (1 = lunes … 7 = domingo) y hora de Madrid, por canal.
  add column if not exists cadence jsonb not null default
    '{"x": {"days": [1, 3, 5], "hour": 10},
      "linkedin": {"days": [2, 4], "hour": 9},
      "blog": {"days": [2], "hour": 8}}'::jsonb,
  -- Por debajo de estos días de cola programada, alerta.
  add column if not exists alert_days int not null default 14,
  -- Publicaciones al mes del plan de Upload-Post (0 = sin límite).
  add column if not exists monthly_quota int not null default 10,
  -- Por debajo de este saldo de DeepSeek (USD), alerta.
  add column if not exists min_balance_usd numeric(10, 2) not null default 2;

-- ── 2. La nevera ─────────────────────────────────────────
alter table public.social_variants drop constraint if exists social_variants_status_check;
alter table public.social_variants add constraint social_variants_status_check
  check (status in ('borrador', 'nevera', 'programado', 'publicado', 'error'));

-- ── 3. Lo que cuesta cada llamada ────────────────────────
create table if not exists public.social_usage (
  id uuid primary key default gen_random_uuid(),
  -- Si se borra la publicación, el gasto sigue contando: ya está pagado.
  post_id uuid references public.social_posts(id) on delete set null,
  channels text[] not null,
  model text not null,
  -- Tokens de entrada que DeepSeek ya tenía en caché (mucho más baratos),
  -- los que no, y los de salida.
  input_hit int not null default 0,
  input_miss int not null default 0,
  output_tokens int not null default 0,
  -- Hora punta de DeepSeek: la tarifa es el doble.
  peak boolean not null default false,
  cost_usd numeric(12, 6) not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists social_usage_post on public.social_usage (post_id);
create index if not exists social_usage_created on public.social_usage (created_at);

alter table public.social_usage enable row level security;

drop policy if exists social_usage_admin on public.social_usage;
create policy social_usage_admin on public.social_usage
  for all using (public.is_admin()) with check (public.is_admin());

commit;
