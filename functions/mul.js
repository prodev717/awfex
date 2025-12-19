export function mul(...args) {
  if (args.length === 0) return 1;
  return args.reduce((prod, val) => prod * val, 1);
}

export const mulDescription = `
mul(...args):
- Multiplies numbers together.
Parameters:
  args: Any number of numeric values.
Returns:
  Number — the product of all arguments.
`;

export const mulMetadata = {
  parameters: ["A", "B"],
  icon: "/icons/mul.png",
  hasVariableParams: true
};
