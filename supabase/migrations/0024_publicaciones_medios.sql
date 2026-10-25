-- ══════════════════════════════════════════════════════════
--  Publicaciones: GIFs de GIPHY
--
--  La clave de GIPHY vive con las otras de publicaciones (DeepSeek,
--  Upload-Post) y se edita en /admin/publicaciones/ajustes. Nunca llega al
--  navegador: las búsquedas pasan por el servidor. GIPHY_API_KEY del entorno
--  hace de respaldo.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.social_settings
  add column if not exists giphy_api_key text;

commit;
