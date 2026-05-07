import "dotenv/config";
import axios from "axios";

export async function sendMessage(
  to: string,
  text: string,
  effect: string | null = null
): Promise<unknown> {
  const body: Record<string, unknown> = {
    from: process.env.LINQ_PHONE_NUMBER,
    to: [to],
    message: {
      parts: [{ type: "text", value: text }],
    },
  };

  if (effect) {
    body.effect = effect;
  }

  const response = await axios.post(`${process.env.LINQ_BASE_URL}/chats`, body, {
    headers: {
      Authorization: `Bearer ${process.env.LINQ_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
