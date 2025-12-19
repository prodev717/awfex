export function add(...args) {
  if (args.length === 0) return 0;
  if (args.every(v => typeof v === "number")) {
    return args.reduce((sum, val) => sum + val, 0);
  }
  return args.join("");
}

export const addDescription = `
add(...args):
- Adds or concatenates any number of values based on their types.
Rules:
  - If all arguments are numbers, it returns their numeric sum.
  - If one or more arguments are strings, all values are converted to strings and concatenated.
Parameters:
  args: Any number of values — numbers or strings.
Returns:
  Number or String — the sum of numbers or the concatenated string.
`;

export const addMetadata = {
  parameters: ["A", "B"],
  icon: "/icons/add.png",
  hasVariableParams: true
};