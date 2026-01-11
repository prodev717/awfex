export function regex(text, pattern, flags = "") {
  if (typeof text !== "string") return "";
  try {
    const re = new RegExp(pattern, flags);
    const match = text.match(re);
    return match ? (match[1] || match[0]) : "";
  } catch (error) {
    return "";
  }
}

export const regexDescription = `
regex(text, pattern, flags):
- Searches the text using the provided regular expression pattern and returns the first match.
- If no match is found, returns an empty string.

Parameters:
  text: String — The input text to search.
  pattern: String — The regular expression pattern (do not include surrounding slashes).
  flags: String — Optional flags (e.g., 'i' for case-insensitive).

Returns:
  String — The first matching substring or empty string.
`;

export const regexMetadata = {
  parameters: ["Text", "Pattern", "Flags"],
  icon: "https://img.icons8.com/color/48/code.png",
  hasVariableParams: false
};
