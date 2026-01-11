export function jsonStringify(obj, space = null) {
  if (space !== null) {
    return JSON.stringify(obj, null, space);
  }
  return JSON.stringify(obj);
}

export const jsonStringifyDescription = `
jsonStringify(obj, space):
- Converts an object to a JSON string.
Parameters:
  obj: Object — the object to stringify.
  space: Number — optional indentation spaces.
Returns:
  String — JSON string representation.
`;

export const jsonStringifyMetadata = {
  parameters: ["Object", "Space"],
  icon: "https://img.icons8.com/color/48/json.png",
  hasVariableParams: false
};
