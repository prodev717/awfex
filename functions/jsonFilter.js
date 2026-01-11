export function jsonFilter(key) {
  return key?.value;
}

export const jsonFilterDescription = `
jsonFilter(key):
- Filters the JSON object based on the key.

Parameters:
  key: String — The key to filter the JSON object by.

Returns:
  Object — The filtered JSON object.
`;

export const jsonFilterMetadata = {
  parameters: ["Key"],
  icon: "https://img.icons8.com/color/48/filter.png",
  hasVariableParams: false
};