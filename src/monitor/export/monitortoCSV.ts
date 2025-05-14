import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const MONITOR_ENDPOINT = 'http://localhost:3000/admin/monitor';
const OUTPUT_PATH = path.join(__dirname, 'monitor.csv');

async function exportMetrics() {
  try {
    const res = await fetch(MONITOR_ENDPOINT);
    const data = await res.json() as Record<string, any>; // type assertion


    const csvHeaders = Object.keys(data).join(',');
    const csvValues = Object.values(data).join(',');

    const csvContent = `${csvHeaders}\n${csvValues}`;
    fs.writeFileSync(OUTPUT_PATH, csvContent);

    console.log(`✅ Exported monitoring metrics to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ Failed to export monitoring data:', err);
  }
}

exportMetrics();
