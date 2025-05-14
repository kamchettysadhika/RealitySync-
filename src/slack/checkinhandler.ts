import express from 'express';

// Define your own types for the application
interface SlackRequestBody {
  user_name?: string;
  text?: string;
  [key: string]: any;
}

// Create router
const router = express.Router();

// Middleware: parse URL-encoded Slack payloads
router.use(express.urlencoded({ extended: true }));

// Define the route handler
function checkinHandler(req: any, res: any) {
  console.log('[Slack Check-In] Incoming request body:', req.body);

  const body = req.body as SlackRequestBody;
  const user = body.user_name;
  const region = body.text?.trim() || 'Unknown Region';

  console.log(`[Slack Check-In] Parsed user: ${user}`);
  console.log(`[Slack Check-In] Parsed region: ${region}`);

  if (!user) {
    console.warn('[Slack Check-In] Missing user_name in request.');
    return res.status(400).json({ text: 'Missing user_name in request.' });
  }

  const timestamp = new Date().toLocaleTimeString();
  const message = `✅ ${user} checked in at ${region} on ${timestamp}`;

  console.log('[Slack Check-In] Final message to send:', message);

  return res.json({
    response_type: 'in_channel',
    text: message,
  });
  
}

// Register the route
router.post('/checkin', checkinHandler);

export default router;
