import "dotenv/config";
import axios from "axios";

const LINQ_BASE_URL = "https://api.linqapp.com/api/partner/v3";

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

  const response = await axios.post(`${LINQ_BASE_URL}/chats`, body, {
    headers: {
      Authorization: `Bearer ${process.env.LINQ_API_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
