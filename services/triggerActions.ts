import dotenv from 'dotenv';
import fetch from 'node-fetch';
import OpenAI from 'openai';

dotenv.config({ override: true });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendSlackAlert(center: string, summary: string, webhookUrl?: string) {
  const webhook = webhookUrl || process.env.SLACK_WEBHOOK_URL;
  const text = `🚨 ${summary}`;

  if (!webhook) {
    console.error('[Slack] No webhook defined for:', center);
    return;
  }

  try {
    const payload = JSON.stringify({ text });

    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    const resText = await res.text();
    if (!res.ok) {
      console.error('[Slack] HTTP ERROR:', res.status);
      console.error('[Slack] Response:', resText);
    } else {
      console.log('[Slack] Successfully sent:', resText);
    }
  } catch (err) {
    console.error('[Slack] EXCEPTION:', err);
  }
}

export async function createSalesforceCase(center: string, summary: string, queueName?: string) {
  const payload = {
    Subject: `Auto-Detected Outage in ${center}`,
    Description: summary,
    Status: 'New',
    Priority: 'High',
    OwnerId: queueName || 'DefaultQueueId'
  };

  await fetch('https://<your-salesforce-instance>/services/data/v60.0/sobjects/Case/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SF_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

export async function generateMissionPlan(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a field response AI...' },
      { role: 'user', content: prompt }
    ]
  });

  return completion.choices[0].message?.content ?? 'No plan generated.';
}
