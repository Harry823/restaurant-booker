# Restaurant Concierge — Claude Code Handover Document

## Project Overview

A Restaurant Concierge app built on the **Linq messaging API** (linqapp.com). Users interact entirely over **iMessage** — no app download, no sign-up. The app receives inbound texts via Linq webhooks, runs a natural AI-driven conversation to gather dining preferences, suggests two matching restaurants from a mock dataset, and sends a booking confirmation with an iMessage confetti effect.

This is being built as an interview assessment project for Linq. The scope is intentionally tight — no database, clean architecture, completable in a day.

---

## Architecture

```
User (iMessage) → Linq Webhook → Express Server → AI Model
                                      ↓
                            In-Memory Store (plain object)
                                      ↓
                              Linq API → User (iMessage)
```

### Key Design Decisions
- **No database** — conversation state is stored in a plain in-memory JavaScript object keyed by phone number. Acceptable for demo scope; in production this would be Redis.
- **AI does the filtering** — the full restaurant list is injected into the system prompt. No custom filtering logic needed.
- **Stateless after booking** — once a user books, their state is set to `"booked"` and repeat texts get a friendly short-circuit response without re-entering the AI loop.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **HTTP client:** axios
- **Config:** dotenv
- **AI Provider:** Anthropic (Claude) — use `claude-sonnet-4-20250514`
- **Messaging:** Linq Partner API v3

---

## Environment Variables

```
LINQ_API_KEY=
LINQ_PHONE_NUMBER=       # E.164 format, e.g. +12223334444
ANTHROPIC_API_KEY=
TEST_PHONE_NUMBER=       # Your personal number for testing
PORT=3000
```

---

## Linq API Reference

**Base URL:** `https://api.linqapp.com/api/partner/v3`

**Auth header:** `Authorization: Bearer LINQ_API_KEY`

### Send a Message

`POST /chats`

```json
{
  "from": "+12223334444",
  "to": ["+15556667777"],
  "message": {
    "parts": [{ "type": "text", "value": "Your message here" }]
  }
}
```

For iMessage effects (confetti, fireworks), add a top-level `"effect"` field:

```json
{
  "from": "+12223334444",
  "to": ["+15556667777"],
  "effect": "confetti",
  "message": {
    "parts": [{ "type": "text", "value": "You're booked! 🎉" }]
  }
}
```

### Incoming Webhook Payload

Linq fires a `POST` to your webhook URL on every inbound message. Key fields to extract:

```json
{
  "from": "+15556667777",
  "message": {
    "parts": [{ "type": "text", "value": "User's message text" }]
  }
}
```

> Confirm the exact payload shape from https://docs.linqapp.com before implementing the webhook handler.

---

## In-Memory Conversation Store

```javascript
const conversations = {}
// Shape per user:
// {
//   "+15551234567": {
//     history: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }],
//     state: "gathering" | "booked"
//   }
// }
```

---

## Mock Restaurant Data (`restaurants.js`)

~12 restaurants across:
- **Cuisines:** Italian, Japanese, Mexican, American
- **Neighborhoods:** Downtown, Midtown, East Side
- **Fields per entry:** `name`, `cuisine`, `neighborhood`, `price` ($–$$$), `rating`, `times` (array of 3 available time slots)

Example entry:
```javascript
{
  name: "Trattoria Roma",
  cuisine: "Italian",
  neighborhood: "Downtown",
  price: "$$",
  rating: 4.6,
  times: ["6:00pm", "7:30pm", "9:00pm"]
}
```

---

## AI System Prompt Requirements

- Persona: friendly, concise restaurant concierge operating over iMessage — conversational, not formal
- Gather naturally (not all at once): cuisine preference, neighborhood, party size, preferred time
- Once enough info is gathered, suggest **exactly 2 restaurants** from the injected list as a short numbered list
- After user picks one, send a friendly confirmation message
- Keep all responses **short** — max 3-4 lines. iMessage is not email.
- If user goes off-topic, gently redirect back to preferences
- If no restaurant matches, ask for looser preferences — never hallucinate a restaurant
- The full restaurant list is injected at the top of the system prompt at runtime

---

## Booking State Transition

After the AI sends a confirmation (user has selected a restaurant), set `state` to `"booked"`. On any subsequent inbound message from that user, skip the AI entirely and reply with something like: "You're all set! Your table is confirmed. See you tonight 🍽️"

---

## Edge Cases to Handle

| Scenario | Handling |
|---|---|
| User goes off-topic | System prompt redirects back to preferences |
| No restaurant matches preferences | AI asks for looser criteria, never invents one |
| User texts again after booking | `"booked"` state short-circuits AI call |
| Duplicate webhook events from Linq | Deduplicate by checking if message already in history |

---

## PR Breakdown

---

### PR 1 — Foundation & Outbound Messaging

**Goal:** Server is running and you can send an iMessage from code.

**Files to create:**
- `index.js` — Express server entry point
- `restaurants.js` — mock restaurant data (~12 entries)
- `linqClient.js` — Linq API helper
- `package.json` — with dependencies: express, axios, dotenv
- `.env.example` — all required env vars listed, no real values
- `.gitignore` — node_modules, .env

**Routes:**
- `GET /` — health check, returns `{ status: "ok" }`
- `POST /test-send` — sends a hardcoded test iMessage to `TEST_PHONE_NUMBER` via the Linq API. Used to verify the integration before webhooks are built.

**`linqClient.js` shape:**
```javascript
async function sendMessage(to, text, effect = null) {
  // POST to https://api.linqapp.com/api/partner/v3/chats
  // Include effect field only if non-null
}
module.exports = { sendMessage }
```

**Done when:** Hitting `POST /test-send` delivers a real iMessage to your phone.

---

### PR 2 — Webhook Handler & Conversation Loop

**Goal:** Texting your Linq number triggers a real AI response.

**Files to create/modify:**
- `conversationStore.js` — exports the in-memory `conversations` object and helper functions (`getConversation`, `appendMessage`, `setState`)
- `aiClient.js` — Anthropic API wrapper. Builds the system prompt (with restaurant list injected), calls the API with full conversation history, returns the response text.
- `index.js` — add `POST /webhook` route

**`POST /webhook` logic:**
1. Extract sender phone number and message text from Linq payload
2. Get or initialize their conversation from the store
3. If state is `"booked"`, send short-circuit reply and return
4. Append user message to history
5. Call AI with system prompt + history
6. Append AI response to history
7. Send AI response via `sendMessage()`
8. Save updated conversation

**`aiClient.js` shape:**
```javascript
async function getAIResponse(history) {
  // Inject restaurants into system prompt
  // Call Anthropic API with full history
  // Return response text string
}
module.exports = { getAIResponse }
```

**ngrok setup:**
- Run `ngrok http 3000`
- Copy the public URL
- Register `https://YOUR-NGROK-URL/webhook` in the Linq Sandbox dashboard as the webhook endpoint

**Done when:** Texting your Linq number results in a back-and-forth AI conversation about restaurant preferences.

---

### PR 3 — Booking Confirmation & Polish

**Goal:** The flow has a proper ending and the demo feels complete.

**Changes:**

- **Booking detection** — after the AI response, check if the conversation has reached a confirmed booking (heuristic: detect confirmation language in AI response, or transition after user replies with "1" or "2" to a suggestion). Set state to `"booked"`.
- **Confetti effect** — send the booking confirmation message with `effect: "confetti"` via `sendMessage()`
- **Repeat texter handling** — already wired via `"booked"` state in PR 2, validate it works end-to-end
- **System prompt hardening** — test and refine off-topic redirect and no-match handling
- **README.md** — setup instructions covering: clone repo, install deps, set env vars, run ngrok, register webhook, start server, test flow
- **Code cleanup** — remove `POST /test-send` route or gate it behind a `NODE_ENV=development` check, add inline comments

**Done when:** Full flow works end-to-end — greeting → preference gathering → two suggestions → user picks one → confetti confirmation → graceful handling if they text again. README lets someone else run the project from scratch.

---

## Suggested Implementation Order (Single Day)

| Time | Task |
|---|---|
| 0:00–0:20 | Scaffolding, env setup, ngrok install |
| 0:20–0:35 | Mock restaurant data |
| 0:35–1:05 | `linqClient.js` + test-send route working |
| 1:05–1:35 | `aiClient.js` + system prompt (test in Anthropic playground first) |
| 1:35–2:15 | Webhook handler + conversation store |
| 2:15–3:00 | Full loop working end-to-end |
| 3:00–3:30 | Booking confirmation + confetti effect |
| 3:30–4:00 | Edge cases, cleanup, README |

---

## Notes for Claude Code

- Build one PR at a time. After each PR, pause for confirmation that it's working before proceeding.
- Do not introduce a database — in-memory store only.
- Keep files small and focused — this is a demo project, not a production service.
- The Linq API docs live at https://docs.linqapp.com — check the webhook payload shape before implementing PR 2.
- Use `claude-sonnet-4-20250514` as the Anthropic model.
