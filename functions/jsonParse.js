export function jsonParse(str) {
    return JSON.parse(str);
}

export const jsonParseDescription = `
jsonParse(str):
- Converts a JSON string into a JavaScript object.

Parameters:
  str: String — Valid JSON string.

Returns:
  Object — The parsed JSON value.
`;
