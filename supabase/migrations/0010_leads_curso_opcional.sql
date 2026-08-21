-- El curso del formulario de captación es opcional. En la base de datos no lo era.
--
-- La tabla nació con `check (cardinality(courses) > 0)`, cuando marcar camino
-- era obligatorio. Después se hizo opcional en el formulario —quien todavía no
-- lo tiene claro es justamente el lead que hay que capturar— y el código lo
-- dice con todas las letras:
--
--   «El curso es opcional. Si no marca ninguno, se guarda vacío y lo resuelve
--    la llamada comercial.»
--
-- Pero la restricción se quedó. El resultado: cualquiera que rellenaba el
-- formulario sin marcar curso recibía un error genérico y su contacto NO se
-- guardaba. No aparecía en ninguna parte —ni en la tabla, ni en Slack— así que
-- no había forma de enterarse mirando; sólo intentándolo.
--
-- Se quita la restricción. El array vacío es un estado legítimo y significa
-- «todavía no lo ha decidido», que es información comercial, no un error.

begin;

alter table public.leads drop constraint if exists leads_courses_not_empty;

comment on column public.leads.courses is
  'Caminos que le interesan. Vacío = no lo ha decidido todavía, que es un lead perfectamente válido.';

commit;
