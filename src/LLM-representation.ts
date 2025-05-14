import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { aggregateEventCounts } from './forecastinput';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function forecastRisk() {
  const buckets = await aggregateEventCounts();

  let prompt = "Analyze the following outage clusters and give:\n";
  prompt += "- Risk level (Low/Medium/Critical)\n";
  prompt += "- Recommended actions\n";
  prompt += "- Impact if no action taken\n\n";
  prompt += "Data:\n";

  for (const [key, count] of buckets) {
    prompt += `Time-Region: ${key}, Event Count: ${count}\n`;
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = completion.choices[0].message?.content ?? "No response";
  const OUTPUT_PATH = path.join(__dirname, 'forecast', 'llm_response.txt');

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, responseText);
  console.log('LLM forecast written to', OUTPUT_PATH);
}

forecastRisk();
