import { sendSlackAlert, createSalesforceCase } from '../services/triggerActions';
import fs from 'fs';
import path from 'path';
import { notifyFieldTeam } from './services/coordination';

const RESPONSE_PATH = path.join(__dirname, 'forecast', 'llm_response.txt'); // Output from LLM

 async function parseAndAct() {
  const response = fs.readFileSync(RESPONSE_PATH, 'utf-8');

  const region = "Columbus, OH"; // Static or inferred from earlier phase
  const riskLine = response.match(/risk level.*?:\s*(.*)/i);
  const actionsLine = response.match(/recommend.*?actions.*?:\s*([\s\S]*?)(?:\n|$)/i);
  const impactLine = response.match(/impact.*?(?:if|of)?\s*no action.*?:\s*([\s\S]*?)(?:\n|$)/i);

  const riskLevel = riskLine?.[1].trim() ?? "Unknown";
  const recommendedActions = actionsLine?.[1].trim() ?? "No recommendation";
  const impact = impactLine?.[1].trim() ?? "No estimate";

  const summary = `Risk Level: ${riskLevel}\nActions: ${recommendedActions}\nImpact if ignored: ${impact}`;

  await sendSlackAlert(region, summary);
  await createSalesforceCase(region, summary);
  const slackTS = await notifyFieldTeam(summary);
// Optional: Save slackTS to DB or trigger monitor.ts polling

}

export { parseAndAct };



// Inside parseAndAct()
