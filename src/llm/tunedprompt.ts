import fs from 'fs';
import path from 'path';

export function buildTunedPrompt(incident: string) {
  const FEEDBACK_PATH = path.join(__dirname, '../../exports/feedback.csv');
  const feedback = fs.existsSync(FEEDBACK_PATH)
    ? fs.readFileSync(FEEDBACK_PATH, 'utf-8')
    : '';

  return `
You are an AI agent optimizing emergency field response.

Here is historical feedback:
===
${feedback}
===

Now, given a new incident:
${incident}

What should we do?
  `.trim();
}
