-- ══════════════════════════════════════════════════════════
--  Banners: estilo del botón
--
--  ad_banners.cta_style — cómo se pinta la llamada a la acción (formatos.ts
--  → BotonEstilo: forma, color, icono, tamaño). Vacío: el de siempre, verde
--  en pastilla con flecha. Cada variante nueva sale con uno distinto.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.ad_banners
  add column if not exists cta_style jsonb not null default '{}'::jsonb;

commit;
