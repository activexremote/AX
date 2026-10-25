-- ══════════════════════════════════════════════════════════
--  Banners: editor visual y dos idiomas
--
--  1. ad_banners.elements — qué piezas de la composición se ven (logo,
--     etiqueta, titular, línea de apoyo, botón, fecha, puntos, etiqueta de
--     IA). Sólo se guarda lo que cambia respecto a lo de por defecto
--     (formatos.ts → ELEMENTOS_POR_DEFECTO), así una fila vieja vale tal cual.
--  2. ad_banners.copy_alt — los textos en el otro idioma de la campaña. La
--     imagen, la plantilla y los elementos son los mismos: una variante
--     bilingüe es una sola pieza con dos juegos de textos, y sólo se paga una
--     imagen.
--  3. ad_campaigns.bilingual — la campaña se pidió en los dos idiomas.
--     `language` sigue siendo el principal; el otro es el contrario.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.ad_banners
  add column if not exists elements jsonb not null default '{}'::jsonb,
  add column if not exists copy_alt jsonb;

alter table public.ad_campaigns
  add column if not exists bilingual boolean not null default false;

commit;
