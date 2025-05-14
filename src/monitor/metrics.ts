import { pool } from "../../db/logEvent";

export async function getMonitoringStats() {
  const [events, overrides, sentiments] = await Promise.all([
    pool.query(`
      SELECT type, severity, status, lat, lng, detected_at
      FROM events
      WHERE created_at > now() - interval '1 day'
    `),
    pool.query(`
      SELECT COUNT(*) FILTER (WHERE human_override = true) AS overrides,
             COUNT(*) AS total
      FROM interventions
    `),
    pool.query(`
      SELECT AVG(score) as sentiment_score
      FROM customer_feedback
      WHERE created_at > now() - interval '7 days'
    `)
  ]);

  return {
    liveIncidents: events.rows,
    overrideRate: overrides.rows[0],
    sentimentScore: sentiments.rows[0].sentiment_score,
    generatedAt: new Date().toISOString()
  };
}
