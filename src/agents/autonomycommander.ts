// === Advanced Autonomy Layer for RealitySync ===
// This expands the app into true agentic intelligence

import { pool } from '../../db/logEvent';
import OpenAI from 'openai';

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const slackClient = new WebClient(process.env.SLACK_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
async function fetchUnresolvedEvents(limit = 10) {
  const { rows } = await pool.query(
    `SELECT id, type, severity, location, payload, detected_at
     FROM events
     WHERE resolved IS NOT TRUE
     ORDER BY detected_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function autonomousCommander() {
  const events = await fetchUnresolvedEvents();
  if (!events.length) return;

  const context = events.map((e, i) => `#${i + 1}
Type: ${e.type}
Severity: ${e.severity}
Location: ${e.location}
Detected: ${e.detected_at}
Payload: ${JSON.stringify(e.payload)}`).join('\n---\n');

  const prompt = `You are a field operations AI for service coordination. Given recent unresolved outages:

${context}

Decide:
1. Which need immediate action?
2. Who should be dispatched (role/type)?
3. What part or equipment is likely needed?
4. What's the urgency level (low/med/high)?

Respond with structured YAML:
- mission:
    region:
    priority:
    action:
    required_equipment:
    dispatch_to:
    justification:`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });

  const missionPlan = completion.choices[0].message?.content;
  if (!missionPlan) return;

  fs.writeFileSync('forecast/autonomy.yaml', missionPlan);

  await slackClient.chat.postMessage({
    channel: process.env.SLACK_CHANNEL_ID!,
    text: `🧠 Autonomous Commander deployed a mission plan:\n\n${missionPlan}`.slice(0, 4000)
  });

  console.log('✅ Advanced mission plan created and posted.');
}

// Schedule every 5 minutes
setInterval(() => {
  autonomousCommander().catch(console.error);
}, 300_000);
