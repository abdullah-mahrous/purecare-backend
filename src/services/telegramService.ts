import enVars from "../config/environment";

const retryDelayMs = 1000;
const maxAttempts = 1;

export const sendTelegramMessage = async (text: string, topicId: number | undefined) => {
    const { botToken, chatId } = enVars.telegram;

    if (!botToken || !chatId) 
        return false;

    const payload: Record<string, string | number | undefined> = { chat_id: chatId, text };

    if (topicId !== undefined && topicId !== null) 
        payload.message_thread_id = topicId;

    let lastError: unknown;

    console.log('inside sendTelegramMessage');

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal,
            });

            console.log(payload);

            clearTimeout(timeout);

            if (!response.ok) {
                const errorBody = await response.text().catch(() => "");
                throw new Error(`Telegram request failed with status ${response.status}${errorBody ? `: ${errorBody}` : ""}`);
            }

            return true;
        } catch (error) {
            clearTimeout(timeout);
            lastError = error;
            console.error(`Telegram notification failed (attempt ${attempt}/${maxAttempts})`, error);

            if (attempt < maxAttempts)
                await new Promise((resolve) => setTimeout(resolve, retryDelayMs * attempt));
        }
    }

    throw lastError instanceof Error ? lastError : new Error("Telegram notification failed");
};
