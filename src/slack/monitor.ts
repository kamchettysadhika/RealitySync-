import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN!);

export async function checkTimeout(ts: string, region: string) {
  const response = await slack.conversations.replies({
    channel: '#field-ops',
    ts
  });

  const replies = response.messages || [];
  const checkinExists = replies.some(msg => msg.text?.toLowerCase().includes('checked in'));

  if (!checkinExists) {
    await slack.chat.postMessage({
      channel: '#field-ops',
      text: `⚠️ No check-in for ${region}. Escalating.`,
      thread_ts: ts
    });
  }
}
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';

const MONITOR_ENDPOINT = 'http://localhost:3000/admin/events'; // or your deployed backend
const OUTPUT_PATH = path.join(__dirname, '..', 'monitor.csv');

export async function exportMetrics() {
  try {
    const res = await fetch(MONITOR_ENDPOINT);
    const data = await res.json() as Record<string, any>[];


    const csvHeaders = Object.keys(data[0]).join(',');
    const csvValues = data.map(row =>
      Object.values(row).join(',')
    );

    const csvContent = `${csvHeaders}\n${csvValues.join('\n')}`;
    fs.writeFileSync(OUTPUT_PATH, csvContent);
    console.log(`✅ Metrics written to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ Failed to export metrics:', err);
  }
}
