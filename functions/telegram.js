export async function telegramSendMessage(botToken, chatIds, texts, options = {}) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const chatIdArray = Array.isArray(chatIds) ? chatIds : [chatIds];
    const textArray = Array.isArray(texts) ? texts : [texts];
    const results = [];
    for (let i = 0; i < chatIdArray.length; i++) {
        const chat_id = chatIdArray[i];
        const text = textArray.length === 1 ? textArray[0] : textArray[i];        
        if (typeof text !== "string") {
            results.push({
                success: false,
                chatId: chat_id,
                error: "Text is missing or not a string",
            });
            continue;
        }
        const payload = {
            chat_id,
            text,
            ...options,
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
                results.push({
                    success: false,
                    chatId: chat_id,
                    error: data.description,
                });
                continue;
            }
            results.push({
                success: true,
                messageId: data.result.message_id,
                chatId: data.result.chat.id,
            });
        } catch (error) {
            results.push({
                success: false,
                chatId: chat_id,
                error: error.message,
            });
        }
    }
    return {
        success: results.every(r => r.success),
        results,
    };
}

export const telegramSendMessageDescription = `
telegramSendMessage(botToken, chatIds, texts, options):
- Sends one or more Telegram messages using the Bot API.
- Supports broadcasting and pairwise messaging.

Parameters:
  botToken: String — Telegram Bot Token.
  chatIds: String | Number | Array — Single chat ID or array of chat IDs.
  texts: String | Array — Single text (broadcast) or array of texts.
  options: Object (optional) —
    parse_mode: "Markdown" | "MarkdownV2" | "HTML"
    disable_web_page_preview: Boolean
    reply_markup: Object

Behavior:
  - One text + many chatIds → broadcast
  - chatIds[i] + texts[i] → paired send

Returns:
  Object —
    success: Boolean
    results: Array of per-message results
`;

export const telegramSendMessageMetadata = { 
    parameters: ["Bot Token", "Chat ID", "Text", "Options"], 
    icon: "/icons/telegram.png", 
    hasVariableParams: false, 
};