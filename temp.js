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
        "required": [
            "length"
        ]
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
        console.log(response.functionCalls);
        let calls = [];
        if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
            const parts = response.candidates[0].content.parts;
            calls = parts.filter(p => p.functionCall).map(p => p.functionCall);
        }

        if (calls && calls.length > 0) {
            const call = calls[0];
            const funcName = call.name;
            const funcArgs = call.args;

            if (availableTools[funcName]) {
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

                const followUpResponse = followUpResult;
                if (typeof followUpResponse.text === 'string') {
                    output = followUpResponse.text;
                } else if (typeof followUpResponse.text === 'function') {
                    output = followUpResponse.text();
                } else if (followUpResponse.candidates && followUpResponse.candidates[0].content.parts[0].text) {
                    output = followUpResponse.candidates[0].content.parts[0].text;
                } else {
                    output = JSON.stringify(followUpResponse);
                }

            } else {
                console.error(`Unknown tool requested: ${funcName}`);
                if (typeof response.text === 'string') {
                    output = response.text;
                } else if (response.candidates && response.candidates[0].content.parts[0].text) {
                    output = response.candidates[0].content.parts[0].text;
                } else {
                    output = "Error: Could not extract text from response.";
                }
            }
        } else {
            if (typeof response.text === 'string') {
                output = response.text;
            } else if (typeof response.text === 'function') {
                output = response.text();
            } else if (response.candidates && response.candidates.length > 0) {
                const parts = response.candidates[0].content.parts;
                output = parts.map(p => p.text).join('');
            } else {
                output = JSON.stringify(response);
            }
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
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDVTbogcf2LCBBxbxv0sIGVBw3GzYITDuE';
    const MODEL_NAME = "gemini-2.5-flash";

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