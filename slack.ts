
import { Request, Response } from 'express';

import { logEvent } from './db/logEvent';

export const handleSlackWebhook = async (req: Request, res: Response) => {
  try {
    await logEvent(req, 'slack', 'alert');
    res.status(200).send('slack event logged');
  } catch (err) {
    console.error('Slack webhook error:', err);
    res.status(500).send('error logging event');
  }
};
