import { Pool } from 'pg';
import dotenv from 'dotenv';
import { sendSlackAlert, createSalesforceCase, generateMissionPlan } from '../services/triggerActions';
import { zoneRoutingMap, getZoneByCoords } from '../src/routingmap';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function detectAnomalies() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM events
      WHERE type = 'outage'
        AND source = 'mulesoft'
        AND detected_at >= NOW() - INTERVAL '10 minutes'
        AND lat IS NOT NULL AND lng IS NOT NULL
    `);

    if (rows.length === 0) {
      console.log('[DEBUG] No matching events found.');
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const center = rows[i];
      let nearby = 0;

      for (let j = 0; j < rows.length; j++) {
        if (i === j) continue;
        const dist = haversine(center.lat, center.lng, rows[j].lat, rows[j].lng);
        if (dist <= 1) nearby++;
      }

      if (nearby >= 0) {
        const summary = `${nearby + 1} outages within 1km of (${center.lat.toFixed(4)}, ${center.lng.toFixed(4)})`;
        const prompt = `
Anomaly Summary:
${summary}

Location: (${center.lat}, ${center.lng})
Severity: ${center.severity}

You're a field dispatch AI. Recommend a detailed plan:
- Crew: who and ETA
- Tools: exact parts or kits
- Urgency: risk level
- Reason: detailed justification
        `;

        const plan = await generateMissionPlan(prompt);
        const fullMessage = `${summary}\n\n💡 *Recommended Action:*\n${plan}`;

        const zone = getZoneByCoords(center.lat, center.lng);
        const routing = zoneRoutingMap[zone];

        await sendSlackAlert(zone, fullMessage, routing?.slackWebhook);
        await createSalesforceCase(zone, fullMessage, routing?.salesforceQueue);
        break;
      }
    }
  } catch (err) {
    console.error('[ERROR] detectAnomalies failed:', err);
  }
}

detectAnomalies();
