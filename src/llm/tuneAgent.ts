import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { buildTunedPrompt } from './tunedprompt';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const FEEDBACK_PATH = path.join(__dirname, '../../exports/feedback.csv');

async function tuneAgentPrompt() {
  // Read and validate feedback CSV
  if (!fs.existsSync(FEEDBACK_PATH)) {
    throw new Error(`Feedback CSV not found at ${FEEDBACK_PATH}`);
  }
  const csv = fs.readFileSync(FEEDBACK_PATH, 'utf-8');

  const basePrompt = `
You are a mission coordinator AI optimizing field response.
Below is feedback on past AI-generated actions. Use it to adapt your reasoning:
===
${csv}
===
If similar conditions arise again, avoid previous mistakes.
Emphasize patterns that led to successful outcomes.
Now, given a new incident:
`;

  const newIncident = {
    type: "power outage",
    severity: "medium",
    region: "Columbus",
    pattern: "clustered",
    detected_at: "2025-05-13T18:00:00Z",
  };

  const fullPrompt = `${basePrompt}${JSON.stringify(newIncident, null, 2)}\nWhat should we do?`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: fullPrompt }],
    temperature: 0.2,
  });

  console.log('📌 Updated Recommendation:\n', completion.choices[0].message?.content || 'No response.');
}

tuneAgentPrompt().catch(console.error);
