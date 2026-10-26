-- ══════════════════════════════════════════════════════════
--  El conector de Claude (MCP) para banners y publicaciones
--
--  Claude se conecta a /api/mcp con OAuth 2.1: se registra solo (registro
--  dinámico), la persona entra con su cuenta del campus y autoriza, y Claude
--  recibe un token. Sólo administradores.
--
--  1. mcp_clients — las aplicaciones que se han registrado (claude.ai,
--     Claude Desktop, Claude Code…) y a qué direcciones se puede volver.
--  2. mcp_codes   — los códigos de un solo uso del paso de autorización
--     (10 minutos), guardados como hash.
--  3. mcp_tokens  — los accesos concedidos: token de acceso y de refresco,
--     guardados como hash. Revocar uno corta esa conexión.
--
--  Sin políticas: sólo el servidor (service role) lee y escribe aquí.
-- ══════════════════════════════════════════════════════════

begin;

create table if not exists public.mcp_clients (
  id text primary key,
  name text,
  redirect_uris text[] not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mcp_codes (
  code_hash text primary key,
  client_id text not null references public.mcp_clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redirect_uri text not null,
  code_challenge text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mcp_tokens (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.mcp_clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  access_hash text not null unique,
  refresh_hash text not null unique,
  access_expires_at timestamptz not null,
  refresh_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at timestamptz
);
create index if not exists mcp_tokens_user_idx on public.mcp_tokens(user_id);

alter table public.mcp_clients enable row level security;
alter table public.mcp_codes enable row level security;
alter table public.mcp_tokens enable row level security;

commit;
