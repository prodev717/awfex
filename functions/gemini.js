import { GoogleGenAI } from "@google/genai";
import { createClient } from "redis";

let redis;

function getRedis() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL,
    });
    redis.connect().catch((err) => {
      console.error("Redis connection error:", err);
    });
  }
  return redis;
}

export async function gemini(apiKey, modelName, input) {
  const cacheKey = JSON.stringify({ apiKey, modelName, input });
  const redisClient = getRedis();
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error("Redis GET error:", err);
  }
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: modelName,
    contents: input,
  });
  const text = response.text;
  try {
    await redisClient.set(cacheKey, JSON.stringify(text), {
      EX: 60 * 60 * 24,
    });
  } catch (err) {
    console.error("Redis SET error:", err);
  }
  return text;
}

export const geminiDescription = `
gemini(apiKey, modelName, input):
- Calls a Google Gemini model and returns its generated text output.
- Uses the provided API key, model name, and input content.
- Caches responses in Redis for 24 hours.

Parameters:
  apiKey: String — Google API key used for authentication.
  modelName: String — Name of the Gemini model to run.
  input: Any — The prompt or content sent to the model.

Returns:
  String — The generated text response from Gemini.
`;
