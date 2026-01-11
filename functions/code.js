export async function code(fn, ...inputArgs) {
  if (typeof fn === "string") {
    const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
    fn = new AsyncFunction(
      ...inputArgs.map((_, i) => `arg${i}`),
      `"use strict";\n${fn}`
    );

    return await fn(...inputArgs);
  }

  return await fn(...inputArgs);
}

export const codeDescription = `
code(fn, ...inputArgs):
- Dynamically executes a function or a string of JavaScript code with the provided arguments.
Rules:
  - If \`fn\` is a string, it is treated as the body of an async function and compiled at runtime.
  - Argument names are automatically generated (arg0, arg1, ...).
  - The code runs in strict mode.
  - If \`fn\` is already a function, it is executed directly.
Parameters:
  fn: Function | String — an async function or a string containing JavaScript code.
  inputArgs: Any — values passed as arguments to the function or code.
Returns:
  Promise<Any> — the result of executing the function or code.
`;

export const codeMetadata = {
  parameters: ["Function Code"],
  variableParamName: "Arg",
  icon: "https://img.icons8.com/color/48/code.png",
  hasVariableParams: true
};
