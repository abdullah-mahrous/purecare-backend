import enVars from "../config/environment";

export const sendTelegramMessage = async (text: string, topicId: number | undefined) => {
  const { botToken, chatId } = enVars.telegram;
  if (!botToken || !chatId) return false;

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_thread_id: topicId, text }),
  });
  if (!response.ok) throw new Error(`Telegram request failed with status ${response.status}`);
  return true;
};
