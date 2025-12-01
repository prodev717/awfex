export function jsonStringify(obj) {
    return JSON.stringify(obj);
}

export const jsonStringifyDescription = `
jsonStringify(obj):
- Converts any JavaScript value into a JSON-formatted string.

Parameters:
  obj: Any — The value or object to serialize.

Returns:
  String — JSON string representation of the value.
`;
