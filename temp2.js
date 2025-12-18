import { GoogleGenAI } from "@google/genai";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export function generateRandomString(length) {
    console.log("function called");
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const generateRandomStringDeclaration = {
    "name": "generateRandomString",
    "description": "Generates a random string of a specified length, composed of alphanumeric characters (a-z, A-Z, 0-9).",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "length": {
                "type": "number",
                "description": "The desired length of the random string."
            }
        },
        "required": ["length"]
    }
}

const availableTools = {
    generateRandomString: generateRandomString,
};

let redisClient;

function getRedis() {
    if (!redisClient) {
        redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });
        redisClient.connect().catch((err) => {
            console.error("Redis connection error:", err);
        });
    }
    return redisClient;
}


async function handleFunctionCalls(ai, modelName, input, calls) {
    if (!calls || calls.length === 0) {
        return "Error: No function calls provided to handler.";
    }

    const call = calls[0];
    const funcName = call.name;
    const funcArgs = call.args;

    if (!availableTools[funcName]) {
        console.error(`Unknown tool requested: ${funcName}`);
        return `Error: Unknown tool requested by model: ${funcName}`;
    }

    console.log(`\n🤖 Tool Call Detected: Executing ${funcName}(${JSON.stringify(funcArgs)})`);

    const toolResult = availableTools[funcName](...Object.values(funcArgs));

    const followUpResult = await ai.models.generateContent({
        model: modelName,
        contents: [{
            role: "user",
            parts: [{ text: input }]
        }, {
            role: "model",
            parts: [{ functionCall: call }]
        }, {
            role: "function",
            parts: [{
                functionResponse: {
                    name: funcName,
                    response: { result: toolResult }
                }
            }]
        }],
    });
    return followUpResult.text;
}


export async function geminiWithTools(apiKey, modelName, input, tools = [generateRandomStringDeclaration]) {
    const cacheKey = JSON.stringify({ modelName, input, toolsName: tools.map(t => t.name) });
    const redisClient = getRedis();

    if (redisClient.status === 'ready') {
        try {
            const cached = await redisClient.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch (err) {
            console.error("Redis GET error:", err);
        }
    }

    let output;
    try {
        const ai = new GoogleGenAI({ apiKey });

        const result = await ai.models.generateContent({
            model: modelName,
            contents: input,
            config: {
                tools: tools.length > 0 ? [{ functionDeclarations: tools }] : undefined,
            }
        });

        const response = result;

        const calls = response.functionCalls || [];

        if (calls.length > 0) {
            output = await handleFunctionCalls(ai, modelName, input, calls);
        } else {
            output = response.text;
        }
    } catch (error) {
        console.error("Error in geminiWithTools:", error);
        output = "An internal error occurred while processing the request.";
    }

    if (redisClient.status === 'ready' && output) {
        try {
            await redisClient.set(cacheKey, JSON.stringify(output), {
                EX: 60 * 60 * 24,
            });
        } catch (err) {
            console.error("Redis SET error:", err);
        }
    }

    return output;
}


async function main() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL_NAME = "gemini-2.5-flash";

    if (!GEMINI_API_KEY) {
        console.error("Please set the GEMINI_API_KEY environment variable.");
        return;
    }

    const prompt1 = "I need a random alphanumeric string that is exactly 5 characters long. Generate it for me.";
    console.log(`\n--- Running Prompt 1 (Tool Test) ---`);
    console.log(`Prompt: ${prompt1}`);
    let result1 = await geminiWithTools(GEMINI_API_KEY, MODEL_NAME, prompt1);
    console.log(`\nFinal Response:\n${result1}`);

    if (redisClient) {
        await redisClient.quit();
    }
}

main().catch(error => {
    console.error("Main execution failed:", error);
    if (redisClient) redisClient.quit();
});