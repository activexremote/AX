-- Emparejar cada lead con su ficha de Zoho CRM

begin;

-- El id que devuelve Zoho al crear o actualizar el lead.
--
-- Se guarda para no tener que buscar por email cada vez que haya que cruzar
-- las dos bases: el email se puede corregir en el CRM y entonces el cruce
-- deja de funcionar justo cuando hace falta. Nulo mientras Zoho esté
-- apagado, o si la llamada falló — el lead se guarda igual, que para eso
-- Supabase es la fuente de la verdad y el CRM la copia.
alter table public.leads add column if not exists zoho_lead_id text;

create index if not exists leads_zoho_lead_id_idx on public.leads (zoho_lead_id)
  where zoho_lead_id is not null;

commit;
