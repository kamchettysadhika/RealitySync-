import { pool } from '../../db/logEvent';
import fs from 'fs';

(async () => {
  const result = await pool.query(`
    SELECT date_trunc('hour', detected_at) AS hour, COUNT(*) AS count
    FROM events
    GROUP BY hour
    ORDER BY hour;
  `);

  const timeSeries = result.rows.map(row => ({
    ds: row.hour.toISOString(),
    y: parseInt(row.count, 10),
  }));

  fs.writeFileSync('src/forecast/timeseries.json', JSON.stringify(timeSeries, null, 2));
  console.log('Saved event time series for forecasting.');
})();
