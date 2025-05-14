import { pool } from '../db/logEvent';
import { parseISO, startOfMinute, addMinutes, differenceInMilliseconds } from 'date-fns';
import Decimal from 'decimal.js';

// ⏱ Round time to nearest 10 minutes using date-fns
function roundToNearest10Minutes(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  
    const minute = date.getMinutes();
    const remainder = minute % 10;
  
    const roundedDate =
      remainder < 5
        ? startOfMinute(addMinutes(date, -remainder))
        : startOfMinute(addMinutes(date, 10 - remainder));
  
    return roundedDate.toISOString();
  }
  
// 📍 Round coordinates safely using decimal.js
function roundCoord(coord: number, places = 1): string {
  return new Decimal(coord).toDecimalPlaces(places).toString();
}

export async function aggregateEventCounts() {
  const result = await pool.query(
    'SELECT detected_at, lat, lng, severity, type FROM events'
  );

  const buckets = new Map<string, number>();

  for (const row of result.rows) {
    const timeBucket = roundToNearest10Minutes(row.detected_at);
    const region = `${roundCoord(row.lat)},${roundCoord(row.lng)}`;
    const key = `${timeBucket}|${region}`;

    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  return buckets;
}
import fs from 'fs';
import path from 'path';

export async function exportForecastCSV(filename = 'forecast_input.csv') {
  const buckets = await aggregateEventCounts();

  const csvLines = ['timestamp,region,count'];
  for (const [key, count] of buckets.entries()) {
    const [timestamp, region] = key.split('|');
    csvLines.push(`${timestamp},${region},${count}`);
  }

  const forecastDir = path.join(__dirname, '..', 'forecast');
  if (!fs.existsSync(forecastDir)) {
    fs.mkdirSync(forecastDir, { recursive: true });
  }
  
  const outputPath = path.join(forecastDir, filename);
  fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf8');
  
}

exportForecastCSV();
