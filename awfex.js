import add from "./functions/add.js";
import sub from "./functions/sub.js";
import mul from "./functions/mul.js";
import div from "./functions/div.js";
import print from "./functions/print.js";

const FUNCTIONS = {
  add: add,
  sub: sub,
  mul: mul,
  div: div,
  print: print
};

export default function engine(node) {
  if (typeof node === "number" || typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(engine);
  }
  if (typeof node === "object" && node !== null) {
    const funcName = Object.keys(node)[0];
    const args = node[funcName];
    if (!FUNCTIONS[funcName]) {
      throw new Error(`Unknown function: ${funcName}`);
    }
    const resolvedArgs = args.map(engine);
    return FUNCTIONS[funcName](...resolvedArgs);
  }
  throw new Error(`Invalid node type: ${typeof node}`);
}

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

engine(workflow);
