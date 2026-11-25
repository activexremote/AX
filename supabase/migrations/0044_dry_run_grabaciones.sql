-- ══════════════════════════════════════════════════════════
--  Dry run: las grabaciones de la clase
--
--  Una línea por vídeo, como la agenda: «Primera parte | https://…». Las
--  usa el correo «Grabaciones de la clase» (lib/dry-run/correos.ts), que se
--  programa a mano desde el panel para todos los invitados: los que vinieron,
--  para repasar, y los que no, para verla. Pide también la encuesta.
-- ══════════════════════════════════════════════════════════

alter table public.dry_runs add column if not exists recordings text not null default '';
