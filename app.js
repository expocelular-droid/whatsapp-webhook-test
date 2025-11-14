import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Environment vars
const port = process.env.PORT || 10000;
const verifyToken = process.env.VERIFY_TOKEN;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

// ✅ Verify webhook (Meta GET)
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✅ Webhook verified by Meta");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed");
    res.sendStatus(403);
  }
});

// 📩 Receive messages (POST)
app.post("/", async (req, res) => {
  console.log("📩 Incoming WhatsApp event:");
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const r = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    console.log(`➡️ Forwarded to n8n (${r.status})`);
  } catch (err) {
    console.error("❌ Error forwarding to n8n:", err);
  }

  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`🚀 WhatsApp webhook server running on port ${port}`)
);





