import fs from 'fs';
import path from 'path';
import { pool } from '../rules/anomalyEngine'; // or wherever your db connection is

const OUTPUT_PATH = path.join(__dirname, '../../exports/feedback.csv');

async function exportFeedbackToCSV() {
  const result = await pool.query(`
    SELECT type, context, override, success, notes, timestamp
    FROM feedback
    ORDER BY timestamp DESC
  `);

  const rows = result.rows;
  const headers = ['type', 'context', 'override', 'success', 'notes', 'timestamp'];
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => JSON.stringify(row[h] ?? '')).join(',')
    )
  ].join('\n');

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, csv);
  console.log(`✅ Exported ${rows.length} feedback rows to feedback.csv`);
}

exportFeedbackToCSV().catch(console.error);
