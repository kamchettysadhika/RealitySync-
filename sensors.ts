import { Request, Response } from 'express';
import { logEvent } from './db/logEvent';

export const handleSensorWebhook = async (req: Request, res: Response) => {
  try {
    const severity = req.body.battery === 'critical' ? 'high' : 'low';
    await logEvent(req, 'sensor', 'telemetry', severity);
    res.status(200).send('sensor event logged');
  } catch (err) {
    console.error('Sensor webhook error:', err);
    res.status(500).send('error logging event');
  }
};
