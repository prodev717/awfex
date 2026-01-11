export function jsonParse(jsonString) {
  return JSON.parse(jsonString);
}

export const jsonParseDescription = `
jsonParse(jsonString):
- Parses a JSON string into an object.
Parameters:
  jsonString: String — JSON string to parse.
Returns:
  Object — the parsed JSON object.
`;

export const jsonParseMetadata = {
  parameters: ["JSON String"],
  icon: "https://img.icons8.com/color/48/json.png",
  hasVariableParams: false
};
