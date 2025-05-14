import { Pool } from 'pg';
import { Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Connect to PostgreSQL using DATABASE_URL from .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Logs a normalized event to the 'events' table
export async function logEvent(
  req: Request,
  source: string,
  type: string,
  severity?: string
) {
  const { lat, lng, detected_at } = req.body;

  await pool.query(
    `INSERT INTO events (source, type, lat, lng, payload, severity, detected_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      source,
      type,
      req.body.lat ?? null,
      req.body.lng ?? null,
      req.body,
      severity ?? null,
      detected_at ?? new Date().toISOString()
    ]
  );
}  
