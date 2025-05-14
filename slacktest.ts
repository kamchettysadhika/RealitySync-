import axios from 'axios';

const webhook = 'https://hooks.slack.com/services/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';
const text = '🚨 Slack test with hardcoded webhook';

console.log('[Slack] Webhook =', webhook);

async function sendSlack() {
  try {
    const res = await axios.post(webhook, { text });
    console.log('[Slack] Status:', res.status);
    console.log('[Slack] Body:', res.data);
  } catch (err: any) {
    console.error('[Slack] Error:', err.response?.status, err.response?.data || err.message);
  }
}

sendSlack();
