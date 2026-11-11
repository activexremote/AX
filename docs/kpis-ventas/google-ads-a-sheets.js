/**
 * Google Ads → Google Sheets · KPIs de ActiveXRemote
 *
 * Vuelca los últimos 30 días (hoy incluido) de la cuenta en una hoja de Google
 * para que el dashboard la lea sin conectar Google Ads a Supermetrics.
 *
 * Dónde pegarlo: Google Ads → Herramientas → Acciones masivas → Secuencias de comandos → +
 * Primera vez: deja SHEET_URL vacío, pulsa «Vista previa» o «Ejecutar» y copia del
 * registro la URL de la hoja que crea. Pégala en SHEET_URL y programa el script cada hora.
 */
const SHEET_URL = '';

function main() {
  const account = AdsApp.currentAccount();
  const tz = account.getTimeZone();
  const currency = account.getCurrencyCode();

  const until = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const start = new Date();
  start.setDate(start.getDate() - 29);
  const since = Utilities.formatDate(start, tz, 'yyyy-MM-dd');
  const where = "segments.date BETWEEN '" + since + "' AND '" + until + "'";

  const ss = SHEET_URL ? SpreadsheetApp.openByUrl(SHEET_URL) : SpreadsheetApp.create('Google Ads · KPIs ActiveXRemote');

  // Totales del periodo
  const t = first(
    'SELECT metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions FROM customer WHERE ' + where,
  );
  write(ss, 'resumen',
    ['actualizado', 'desde', 'hasta', 'moneda', 'cuenta', 'inversion', 'impresiones', 'clics', 'conversiones'],
    [[
      Utilities.formatDate(new Date(), tz, "yyyy-MM-dd'T'HH:mm:ss"), since, until, currency, account.getCustomerId(),
      money(t), n(t && t.metrics.impressions), n(t && t.metrics.clicks), n(t && t.metrics.conversions),
    ]],
  );

  // Por día
  write(ss, 'diario',
    ['fecha', 'inversion', 'impresiones', 'clics', 'conversiones'],
    all('SELECT segments.date, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions FROM customer WHERE ' + where)
      .map(function (r) { return [r.segments.date, money(r), n(r.metrics.impressions), n(r.metrics.clicks), n(r.metrics.conversions)]; }),
  );

  // Por campaña (sumado en el periodo)
  write(ss, 'campanas',
    ['campana', 'inversion', 'impresiones', 'clics', 'conversiones'],
    all('SELECT campaign.name, metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions FROM campaign WHERE ' + where + ' AND metrics.impressions > 0')
      .map(function (r) { return [r.campaign.name, money(r), n(r.metrics.impressions), n(r.metrics.clicks), n(r.metrics.conversions)]; })
      .sort(function (a, b) { return b[1] - a[1]; }),
  );

  Logger.log('Hoja actualizada: ' + ss.getUrl());
}

function all(query) {
  const out = [];
  const it = AdsApp.search(query);
  while (it.hasNext()) out.push(it.next());
  return out;
}

function first(query) {
  const rows = all(query);
  return rows.length ? rows[0] : null;
}

function n(v) {
  const x = Number(v || 0);
  return isFinite(x) ? x : 0;
}

function money(r) {
  return r ? Math.round(n(r.metrics.costMicros) / 10000) / 100 : 0;
}

function write(ss, name, header, rows) {
  const sh = ss.getSheetByName(name) || ss.insertSheet(name);
  sh.clearContents();
  const values = [header].concat(rows);
  sh.getRange(1, 1, values.length, header.length).setValues(values);
}
