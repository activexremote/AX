-- ══════════════════════════════════════════════════════════
--  La cola de correos del dry run, cada cinco minutos
--
--  Los crons de Vercel no dan para esto (los recordatorios tienen que salir
--  a su hora: «empezamos en una hora»), así que lo hace la base de datos:
--  pg_cron llama cada cinco minutos a /api/cron/correos con pg_net, sólo si
--  hay algún correo que ya debería haber salido.
--
--  El CRON_SECRET no está aquí: se lee del Vault de Supabase, donde se guarda
--  aparte (no va al repositorio):
--
--    select vault.create_secret('<CRON_SECRET>', 'cron_secret');
--
--  Sin ese secreto, el trabajo corre pero no llama a nadie.
-- ══════════════════════════════════════════════════════════

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule(jobid) from cron.job where jobname = 'axr-dry-run-correos';

select cron.schedule(
  'axr-dry-run-correos',
  '*/5 * * * *',
  $$
  select net.http_get(
    url := 'https://www.activexremote.com/api/cron/correos',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret' limit 1)
    ),
    timeout_milliseconds := 60000
  )
  where exists (select 1 from vault.decrypted_secrets where name = 'cron_secret')
    and exists (select 1 from public.dry_run_emails where status = 'pendiente' and send_at <= now());
  $$
);
