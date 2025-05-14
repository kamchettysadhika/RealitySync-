console.log('[Slack Router] Loaded slack.ts');
import { Request, Response, Router } from 'express';
import express from 'express';



const router = Router();

router.use(express.urlencoded({ extended: true }));

router.post('/checkin', async (req: Request, res: Response): Promise<void> => {
  const { user_name, text } = req.body;
  const region = text?.trim() || 'Unknown Region';

  if (!user_name) {
    res.status(400).json({ text: 'Missing user_name in request.' });
    return;
  }

  const message = `✅ ${user_name} checked in at ${region}`;
  console.log(message);

  res.json({
    response_type: 'in_channel',
    text: message,
  });
});

export default router;
