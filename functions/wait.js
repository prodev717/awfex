export async function wait(milliseconds, input = null) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
    return input;
}

export const waitDescription = `
wait(milliseconds, input):
- Pauses workflow execution for the specified time.
- Returns its input unchanged so workflows continue normally.

Parameters:
  milliseconds: Number — Duration to wait.
  input: Any — Value received from the previous step. If this is the first node, input may be null.

Returns:
  Any — The same input value, unchanged.
`;
