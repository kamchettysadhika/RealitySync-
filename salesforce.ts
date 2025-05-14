import { Request, Response } from 'express';
import { logEvent } from './db/logEvent';

export const handleSalesforceWebhook = async (req: Request, res: Response) => {
  await logEvent(req, 'salesforce', 'ticket');
  res.status(200).send('ok');
};
