export function jsonExpression(expression, ...jsonInputs) {
  const context = {};

  jsonInputs.forEach((json, i) => {
    context[`$json${i}`] = json;
  });

  try {
    const executor = new Function(
      ...Object.keys(context),
      `"use strict"; return (${expression});`
    );

    return executor(...Object.values(context));
  } catch {
    return null;
  }
}

export const jsonExpressionDescription = `
jsonExpression(expression, ...json):
- Evaluates a JavaScript expression against multiple JSON inputs.
Rules:
  - JSON inputs are automatically exposed as variables:
      $json0, $json1, $json2, ...
  - Supports deep property access using dot notation and array indexing.
  - Expressions can merge, pick, or compute values from multiple JSONs.
  - Runs in strict mode and safely returns null on errors.
Parameters:
  expression: String — a JavaScript expression to evaluate.
  json: Object[] — one or more JSON objects passed as inputs.
Returns:
  Any — the result of evaluating the expression.
Examples:
  fn("$json0.id", json1)
  fn("{ ...$json0, ...$json1 }", json1, json2)
  fn("$json0.items[0].name", json1)
`;

export const jsonExpressionMetadata = {
  parameters: ["Expression", "JSON Inputs"],
  variableParamName: "JSON Input",
  icon: "https://img.icons8.com/color/48/json.png",
  hasVariableParams: true
};