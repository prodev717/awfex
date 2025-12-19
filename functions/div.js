export function div(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

export const divDescription = `
div(a, b):
- Divides a by b.
Parameters:
  a: Number — dividend.
  b: Number — divisor.
Returns:
  Number — the quotient.
`;

export const divMetadata = {
  parameters: ["A", "B"],
  icon: "/icons/div.png",
  hasVariableParams: true
};
