-- ══════════════════════════════════════════════════════════
--  Banners: composición
--
--  ad_banners.layout — dónde va cada cosa en la pieza (formatos.ts →
--  COMPOSICIONES: clasica, centrado, arriba, panel, marco, cinta, gigante,
--  bocadillo, revista). Cada variante de una campaña sale con una distinta
--  para que no parezcan la misma pieza. Las que ya existen, la clásica.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.ad_banners
  add column if not exists layout text not null default 'clasica';

commit;
