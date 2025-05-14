import { Request, Response } from 'express';
import { logEvent } from './db/logEvent';

export const handleMuleSoftWebhook = async (req: Request, res: Response) => {
  try {
    await logEvent(req, 'mulesoft', 'outage', req.body.severity);
    res.status(200).send('mulesoft event logged');
  } catch (err) {
    console.error('MuleSoft webhook error:', err);
    res.status(500).send('error logging event');
  }
};
