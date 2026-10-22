-- ══════════════════════════════════════════════════════════
--  Banners: el clonador
--
--  Una campaña puede nacer de un brief (0020) o de un anuncio de
--  referencia: se arrastra una imagen, la IA entiende su estructura (gancho,
--  composición, escena, tono) y escribe hasta 5 variantes parecidas con
--  nuestra marca, nuestra voz y nuestras normas. Nunca copia el texto, los
--  logos, las personas ni la foto de la referencia: reinterpreta el concepto.
--
--  La referencia se guarda en el mismo bucket privado `ad-banners`, en la
--  carpeta de la campaña, para poder verla al revisar las variantes.
-- ══════════════════════════════════════════════════════════

begin;

alter table public.ad_campaigns
  add column if not exists kind text not null default 'brief'
    check (kind in ('brief', 'clon')),
  add column if not exists reference_path text,
  -- Lo que pidió quien subió la referencia («cámbialo a Founder», «sin personas»…).
  add column if not exists reference_prompt text,
  -- { summary, hook, layout, scene, mood, keep[], change[], avoided[] }
  add column if not exists reference_analysis jsonb;

commit;
