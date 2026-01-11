export function sub(...args) {
  if (args.length === 0) return 0;
  if (args.every(v => typeof v === "number")) {
    return args.reduce((diff, val, idx) => idx === 0 ? val : diff - val, 0);
  }
  return NaN;
}

export const subDescription = `
sub(...args):
- Subtracts numbers in sequence.
Parameters:
  args: Any number of numeric values.
Returns:
  Number — the result of sequential subtraction.
`;

export const subMetadata = {
  parameters: ["A", "B"],
  icon: "https://img.icons8.com/color/48/minus.png",
  hasVariableParams: true
};
