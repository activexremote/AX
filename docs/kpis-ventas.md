# Panel de KPIs de ventas

`/admin/comercial/kpis`, sólo para administración. Junta en una página el embudo del anuncio a la matrícula:

| Fuente | De dónde sale | Estado |
|---|---|---|
| Zoho CRM | Leads, estados, origen, negocios, alumnos y facturas | Funciona con el token que ya escribe los leads (`ZOHO_*`) |
| Aircall | Las llamadas que Aircall guarda en el módulo Calls de Zoho | Funciona. Aircall duplica algunas; el panel no las cuenta dos veces |
| Matrículas | Pedidos de Stripe en la tabla `orders` de Supabase | Funciona |
| Meta Ads | API de Marketing (Insights) | Falta el token |
| Google Ads | La hoja que rellena un script de Google Ads, o la API | Falta conectar |
| GA4 | Data API con una cuenta de servicio | Falta la cuenta de servicio |

Cada fuente va por su lado: la que no tiene claves sale «sin conectar» y el resto sigue. Los datos se guardan 15 minutos (los límites de Meta, Google y Zoho); el botón **Actualizar** los vuelve a pedir.

El código está en `src/lib/kpis/` (fuentes y fórmulas) y `src/components/admin/kpis/` (la página y las gráficas).

## Cómo se calcula

Ventana: los últimos 30 días en hora de Madrid, hoy incluido. «7 días» es hoy y los 6 anteriores, frente a los 7 previos.

- **Leads**: creados en Zoho en la ventana.
- **Contactados**: leads con una llamada con conversación (no perdida y con duración) o con un estado de Zoho que lo implica: Contacted, Contact in Future, Pre-Qualified, Not Qualified o Lost Lead.
- **Cualificados**: estado «Pre-Qualified».
- **Matrículas** y **cobrado**: pedidos pagados, en plazos o completados. En plazos, lo cobrado es el importe de cada plazo × los plazos pagados, igual que en `/admin/matriculas`.
- **Pagos a medias**: pedidos iniciados o caducados, con lo que valían.
- **Leads llamados** y **tiempo hasta la 1.ª llamada**: por el lead vinculado a la llamada (`What_Id`); no cuentan las perdidas.
- **Coste por lead real**: inversión en Meta + Google Ads ÷ leads del CRM. **Coste por alumno**: inversión ÷ matrículas. **ROAS**: cobrado ÷ inversión.

Zoho se lee por la API de registros, no por COQL: COQL pide el scope `ZohoCRM.coql.READ` y el token actual no lo tiene.

## Conectar Meta Ads

1. En **Business Settings → Users → System users**, crea un usuario del sistema (rol Employee).
2. **Assign assets → Ad accounts → ActivexRemote**, con permiso «View performance».
3. **Generate new token**: elige la app de Meta (o crea una de tipo Business), marca `ads_read` y, si lo ofrece, que no caduque.
4. En Vercel (Production), añade:
   - `META_ACCESS_TOKEN` = el token
   - `META_AD_ACCOUNT_ID` = `act_3200742800124710`
   - opcional: `META_GRAPH_VERSION` (por defecto `v23.0`) y `FX_AED_EUR` para fijar el cambio de dírhams a euros.

## Conectar GA4

1. En Google Cloud, activa **Google Analytics Data API** (y **Google Sheets API**, para Google Ads).
2. **IAM → Service accounts → Create**, sin roles. **Keys → Add key → JSON**.
3. En GA4, **Administrar → Gestión del acceso a la propiedad**: añade el email de la cuenta de servicio como **Lector**.
4. En Vercel: `GA4_PROPERTY_ID` = `555158490`, `GOOGLE_SA_EMAIL` = `client_email` del JSON y `GOOGLE_SA_PRIVATE_KEY` = `private_key` del JSON (tal cual, con los `\n`).

GA4 seguirá a cero mientras la etiqueta de GA4 no esté publicada en Tag Manager (`GTM-MQLQ25DC`). Al publicarla, pausa antes las etiquetas de Meta y de Google Ads del contenedor: la web ya las carga desde el código y se contarían dos veces.

Ojo con el evento del formulario: la web manda `generate_lead` al dataLayer (`src/lib/analytics/events.ts`), pero el activador del contenedor espera `lead_form_submit`. Cambia el nombre del evento del activador a `generate_lead`.

## Conectar Google Ads (con el script, sin API)

1. En Google Ads: **Herramientas → Acciones masivas → Secuencias de comandos → +**.
2. Pega `docs/kpis-ventas/google-ads-a-sheets.js`, **Autorizar** y **Ejecutar**. El registro muestra la URL de la hoja que crea.
3. Pega esa URL en `SHEET_URL` dentro del script, guarda y prográmalo **cada hora**.
4. Comparte la hoja como **Lector** con el email de la cuenta de servicio.
5. En Vercel: `GOOGLE_ADS_SHEET_ID` = la URL o el ID de la hoja (usa la misma cuenta de servicio de GA4).

No cambies el nombre de las pestañas (`resumen`, `diario`, `campanas`) ni de las columnas.

La alternativa es la API de Google Ads (`GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, `GOOGLE_ADS_CUSTOMER_ID` y, con MCC, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`). Pide un developer token aprobado por Google. `GOOGLE_ADS_CUSTOMER_ID` son los 10 dígitos de arriba en Google Ads, no el `AW-18411611106`.

## El origen de los leads

A 12/11/2026 ningún lead de Zoho tiene «Lead Source», así que no se sabe qué canal trae a los que se matriculan. El formulario de la web lo rellena (`Advertisement` para los que llegan de anuncios y `ZOHO_LEAD_SOURCE` para el resto, en `src/lib/zoho/crm.ts`), así que esos leads están entrando por otra vía: a mano, desde formularios de Meta o desde otra integración. Comprueba que `ZOHO_LEAD_SOURCE` está también en Vercel (Production) y pon el origen en Zoho a los que se crean por fuera de la web.
