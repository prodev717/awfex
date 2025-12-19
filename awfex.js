import { config } from "dotenv";
config();

import { add, addDescription, addMetadata } from "./functions/add.js";
import { sub, subDescription, subMetadata } from "./functions/sub.js";
import { mul, mulDescription, mulMetadata } from "./functions/mul.js";
import { div, divDescription, divMetadata } from "./functions/div.js";
import { print, printDescription, printMetadata } from "./functions/print.js";
import { gemini, geminiDescription, geminiMetadata } from "./functions/gemini.js";
import { wait, waitDescription, waitMetadata } from "./functions/wait.js";
import { jsonParse, jsonParseDescription, jsonParseMetadata } from "./functions/jsonParse.js";
import { jsonStringify, jsonStringifyDescription, jsonStringifyMetadata } from "./functions/jsonStringify.js";
import { httpRequest, httpRequestDescription, httpRequestMetadata } from "./functions/httpRequest.js";
import { postgres, postgresDescription, postgresMetadata } from "./functions/postgres.js";
import { regex, regexDescription, regexMetadata } from "./functions/regex.js";
import { redis, redisDescription, redisMetadata } from "./functions/redis.js";
import { code, codeDescription, codeMetadata } from "./functions/code.js";
import { array, arrayDescription, arrayMetadata } from "./functions/array.js";
import { jsonExpression, jsonExpressionDescription, jsonExpressionMetadata } from "./functions/jsonExpression.js";

export const FUNCTIONS = {
  add,
  sub,
  mul,
  div,
  print,
  gemini,
  wait,
  jsonParse,
  jsonStringify,
  httpRequest,
  postgres,
  regex,
  redis,
  code,
  array,
  jsonExpression,
};

export const DESCRIPTIONS = {
  add: addDescription,
  sub: subDescription,
  mul: mulDescription,
  div: divDescription,
  print: printDescription,
  gemini: geminiDescription,
  wait: waitDescription,
  jsonParse: jsonParseDescription,
  jsonStringify: jsonStringifyDescription,
  httpRequest: httpRequestDescription,
  postgres: postgresDescription,
  regex: regexDescription,
  redis: redisDescription,
  code: codeDescription,
  array: arrayDescription,
  jsonExpression: jsonExpressionDescription,
};

// Function metadata (parameters, icons, variable params flag)
export const METADATA = {
  add: { description: addDescription, ...addMetadata },
  sub: { description: subDescription, ...subMetadata },
  mul: { description: mulDescription, ...mulMetadata },
  div: { description: divDescription, ...divMetadata },
  jsonParse: { description: jsonParseDescription, ...jsonParseMetadata },
  jsonStringify: { description: jsonStringifyDescription, ...jsonStringifyMetadata },
  httpRequest: { description: httpRequestDescription, ...httpRequestMetadata },
  // Default metadata for functions without explicit metadata
  print: { description: printDescription, ...printMetadata },
  gemini: { description: geminiDescription, ...geminiMetadata },
  wait: { description: waitDescription, ...waitMetadata },
  postgres: { description: postgresDescription, ...postgresMetadata },
  regex: { description: regexDescription, ...regexMetadata },
  redis: { description: redisDescription, ...redisMetadata },
  code: { description: codeDescription, ...codeMetadata },
  array: { description: arrayDescription, ...arrayMetadata },
  jsonExpression: { description: jsonExpressionDescription, ...jsonExpressionMetadata },
};

function convertIfNumeric(str) {
  const num = Number(str);
  if (!isNaN(num) && String(num) === str) {
    return num;
  } else {
    return str;
  }
}

function resolveSpecial(value, ctx) {
  if (typeof value !== "string") return value;
  if (value.startsWith("$query:")) {
    const key = value.split(":")[1];
    return convertIfNumeric(ctx[key]);
  }
  if (value.startsWith("$env:")) {
    const key = value.split(":")[1];
    return process.env[key];
  }
  return value;
}

export async function engine(node, ctx) {
  if (typeof node === "number" || typeof node === "string") {
    return resolveSpecial(node, ctx);
  }
  if (Array.isArray(node)) {
    const results = [];
    for (const n of node) {
      results.push(await engine(n, ctx));
    }
    return results;
  }
  if (typeof node === "object" && node !== null) {
    const funcName = Object.keys(node)[0];
    const args = node[funcName];
    if (!FUNCTIONS[funcName]) {
      throw new Error(`Unknown function: ${funcName}`);
    }
    const resolvedArgs = [];
    for (const a of args) {
      resolvedArgs.push(await engine(a, ctx));
    }
    return await FUNCTIONS[funcName](...resolvedArgs);
  }
  throw new Error(`Invalid node type: ${typeof node}`);
}

if (import.meta.main) {
  const workflow = {
    print: [
      {
        sub: [
          {
            add: [2, 3]
          },
          4
        ]
      }
    ]
  };
  await engine(workflow, {});
}