import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN!);

export async function notifyFieldTeam(summary: string) {
  const result = await slack.chat.postMessage({
    channel: '#field-ops',
    text: `🚨 Dispatch Alert\n\n${summary}\n\nPlease confirm with /checkin within 10 minutes.`,
  });

  return result.ts; // Save timestamp to monitor check-ins
}

export async function escalateIfNoCheckIn(originalTS: string, region: string) {
  await slack.chat.postMessage({
    channel: '#field-ops',
    text: `⚠️ No check-in received for anomaly at ${region}. Dispatching backup team.`,
    thread_ts: originalTS,
  });
}

