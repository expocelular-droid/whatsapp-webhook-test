// Import Express
const express = require("express");
const app = express();

app.use(express.json());

// Port and verify token
const port = process.env.PORT || 10000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gtmiami_secret";

// ✅ Webhook verification for Meta (GET /webhook)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed: token mismatch or missing params");
    res.sendStatus(403);
  }
});

// ✅ Webhook event receiver (POST /webhook)
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming Webhook Event:\n", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));



