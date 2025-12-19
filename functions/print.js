export function print(...args) {
  console.log(...args);
}

export const printDescription = `
print(...args):
- Logs all provided values to the server console.
Parameters:
  args: Any number of values — each value will be printed in order.
Returns:
  void — this function does not return anything.
`;

export const printMetadata = {
  parameters: ["Value"],
  icon: "/icons/print.png",
  hasVariableParams: true
};
