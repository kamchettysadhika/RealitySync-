import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


export async function generateMissionPlan(prompt: string): Promise<string | null> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  return completion.choices[0].message?.content ?? null;
}

export async function generateForecast() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'forecast', 'timeseries.json'), 'utf-8');
    const eventClusters = JSON.parse(raw);

    const prompt = `
You are a critical infrastructure incident forecaster. Based on the following structured time-series event cluster data, answer these questions:

1. What is the risk level (Low / Medium / Critical)?
2. What actions are recommended to prevent escalation?
3. What is the estimated cost or impact of taking no action?

Event Clusters:
${JSON.stringify(eventClusters, null, 2)}

Respond in this format:
Risk Level: <risk>
Recommended Actions: <actions>
Impact if No Action: <impact>
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const response = completion.choices[0].message?.content ?? 'No response';
    fs.writeFileSync(path.join(__dirname, 'forecast', 'llm_response.txt'), response);

    console.log('✅ LLM forecast saved to forecast/llm_response.txt');
  } catch (err) {
    console.error('❌ Forecast generation failed:', err);
  }
}


generateForecast();
