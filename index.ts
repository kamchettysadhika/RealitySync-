// index.ts
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { handleSalesforceWebhook } from './salesforce';
import { handleMuleSoftWebhook } from './mulesoft';
import { handleSlackWebhook } from './slack';
import { handleSensorWebhook } from './sensors';
import { detectAnomalies, pool } from './rules/anomalyEngine';
import checkinRouter from './src/slack'; // ✅ if entry file is outside `src/`
import { getMonitoringStats } from './src/monitor/metrics';
import monitorRoutes from './src/services/monitor';
import cors from 'cors';
console.log('[DEBUG] Current __dirname:', __dirname);
console.log('[DEBUG] Expecting checkinRouter from ./src/slack.ts');




dotenv.config();

const app = express();
app.use(bodyParser.json());
app.get('/admin/metrics', async (req, res) => {
  const stats = await getMonitoringStats();
  res.json(stats);
});
try {
  const checkinRouter = require('./src/slack').default;
  app.use('/slack', checkinRouter);
  console.log('[Slack Router] Mounted via require');
} catch (err) {
  console.error('[Slack Router] Failed to import:', err);
}

app.use('/admin/monitor', monitorRoutes);


app.use(cors());
app.use('/slack/checkin', checkinRouter);

// ✅ Webhook endpoints
app.post('/webhook/salesforce', handleSalesforceWebhook);
app.post('/webhook/mulesoft', handleMuleSoftWebhook);
app.post('/webhook/slack', handleSlackWebhook);
app.post('/webhook/sensors', handleSensorWebhook);

// ✅ Admin endpoint: recent events
app.get('/admin/events', async (req, res) => {
  const result = await pool.query(`
    SELECT id, source, type, lat, lng, severity, detected_at, created_at
    FROM events
    ORDER BY created_at DESC
    LIMIT 50
  `);
  res.json(result.rows);
});

// ✅ Admin endpoint: logs
const logs: string[] = [];

function log(message: string) {
  const entry = `[${new Date().toISOString()}] ${message}`;
  logs.unshift(entry);
  if (logs.length > 100) logs.pop();
  console.log(entry);
}

log('Anomaly detected: 13 outages within 1km');
log('Slack alert sent');
log('Salesforce case created');

app.get('/admin/logs', (req, res) => {
  res.json(logs);
});

// ✅ Run anomaly detection every minute
setInterval(() => {
  detectAnomalies().catch(console.error);
}, 60_000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RealitySync backend running on port ${PORT}`);
});

app.post('/feedback', async (req, res) => {
  const { type, context, override, success, notes } = req.body;

  await pool.query(
    `INSERT INTO feedback (type, context, override, success, notes, timestamp)
     VALUES ($1, $2, $3, $4, $5, NOW())`,
    [type, context, override, success, notes]
  );

  res.status(200).send('Feedback recorded');
});
