import "dotenv/config";
import express from "express";
import { sendMessage } from "./linqClient";

//TODO: add ANTHROPIC_API_KEY into required_env
const REQUIRED_ENV = ["LINQ_API_KEY", "LINQ_PHONE_NUMBER", "LINQ_BASE_URL"] as const;
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? "3000";


app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/test-send", async (req, res) => {
  const from: string = req.body?.from;
  const text: string = req.body?.message?.parts?.[0]?.value;

  if (!from || !text) {
    res.status(400).json({ error: "Missing required fields: from, message.parts[0].value" });
    return;
  }

  try {
    const result = await sendMessage(from, `You said: "${text}" — Restaurant Concierge is online 🍽️`);
    res.json({ success: true, result });
  } catch (err: unknown) {
    const error = err as { response?: { data: unknown }; message: string };
    console.error("test-send error:", error.response?.data ?? error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
