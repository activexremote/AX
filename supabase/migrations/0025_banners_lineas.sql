-- ══════════════════════════════════════════════════════════
--  Banners: líneas visuales
--
--  1. ad_campaigns.visual_refs — las referencias de imagen que se eligieron
--     al crear la campaña (lib/banners/direcciones.ts → Ref): una línea de la
--     biblioteca y, si salió de «Ideas con IA», la idea concreta. Vacío: cada
--     variante con una línea distinta al azar.
--  2. ad_campaigns.image_brief — lo que quien crea la campaña quiere ver en
--     las imágenes, con sus palabras.
--  3. ad_banners.visual_ref — la referencia con la que se pintó esa variante:
--     al pintarla otra vez se usa el mismo acabado.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.ad_campaigns
  add column if not exists visual_refs jsonb not null default '[]'::jsonb,
  add column if not exists image_brief text;

alter table public.ad_banners
  add column if not exists visual_ref jsonb;

commit;
