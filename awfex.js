import { config } from "dotenv";
config();

import { add, addDescription } from "./functions/add.js";
import { sub, subDescription } from "./functions/sub.js";
import { mul, mulDescription } from "./functions/mul.js";
import { div, divDescription } from "./functions/div.js";
import { print, printDescription } from "./functions/print.js";
import { gemini, geminiDescription } from "./functions/gemini.js";
import { wait, waitDescription } from "./functions/wait.js";
import { jsonParse, jsonParseDescription } from "./functions/jsonParse.js";
import { jsonStringify, jsonStringifyDescription } from "./functions/jsonStringify.js";
import { httpRequest, httpRequestDescription } from "./functions/httpRequest.js";
import { sqlite, sqliteDescription } from "./functions/sqlite.js";

export const FUNCTIONS = {
  add: add,
  sub: sub,
  mul: mul,
  div: div,
  print: print,
  gemini: gemini,
  wait: wait,
  jsonParse: jsonParse,
  jsonStringify: jsonStringify,
  httpRequest: httpRequest,
  sqlite: sqlite
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
  sqlite: sqliteDescription
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