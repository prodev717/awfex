export async function telegramGetUpdates(botToken, options = {}) {
  const baseUrl = `https://api.telegram.org/bot${botToken}/getUpdates`;

  const params = new URLSearchParams({
    offset: options.offset ?? "",
    limit: options.limit ?? "",
    timeout: options.timeout ?? "",
    allowed_updates: options.allowed_updates
      ? JSON.stringify(options.allowed_updates)
      : "",
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.ok) {
      return {
        success: false,
        error: data.description,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export const telegramGetUpdatesDescription = `
telegramGetUpdates(botToken, options):

- Fetches raw updates from the Telegram Bot API using getUpdates.
- Returns the API response as-is without transformation.

Parameters:
  botToken: String — Telegram Bot Token.
  options: Object (optional) —
    offset: Number — Identifier of the first update to return.
    limit: Number — Maximum number of updates (1–100).
    timeout: Number — Long polling timeout in seconds.
    allowed_updates: Array — List of update types to receive.

Returns:
  Object —
    On success: Raw Telegram API response
      {
        ok: true,
        result: Array
      }

    On failure:
      {
        success: false,
        error: String
      }
`;

export const telegramGetUpdatesMetadata = {
  parameters: ["Bot Token", "Options"],
  icon: "https://img.icons8.com/color/48/telegram-app.png",
  hasVariableParams: false,
};
