export async function telegram(botToken, chatId, text, options = {}) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const payload = {
        chat_id: chatId,
        text,
        ...options, // parse_mode, disable_web_page_preview, reply_markup, etc.
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.ok) {
            return {
                success: false,
                error: data.description,
            };
        }

        return {
            success: true,
            messageId: data.result.message_id,
            chatId: data.result.chat.id,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
}

export const telegramDescription = `
telegram(botToken, chatId, text, options):
- Sends a message to a Telegram chat using the Bot API.
- Uses built-in fetch (no external HTTP libraries).
- Supports optional message parameters via options.

Parameters:
  botToken: String — Telegram Bot Token.
  chatId: String | Number — Target chat ID or @username.
  text: String — Message text to send.
  options: Object (optional) —
    parse_mode: "Markdown" | "MarkdownV2" | "HTML"
    disable_web_page_preview: Boolean
    reply_markup: Object (inline keyboard, etc.)

Returns:
  Object —
    success: Boolean
    messageId: Number (if successful)
    chatId: Number
    error: String (if failed)
`;

export const telegramMetadata = {
    parameters: ["Bot Token", "Chat ID", "Text", "Options"],
    icon: "/icons/telegram.png",
    hasVariableParams: false,
};
