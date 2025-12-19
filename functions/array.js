export function array(...args) {
  return args;
}

export const arrayDescription = `
array(...args):
- Returns an array containing all the provided arguments.
Parameters:
  args: Any — values to be included in the array.
Returns:
  Array — an array containing all the arguments.
`;

export const arrayMetadata = {
  parameters: ["Values"],
  icon: "/icons/array.png",
  hasVariableParams: true
};