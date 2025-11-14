// Import Express
const express = require("express");
const app = express();

// Parse JSON body
app.use(express.json());

// Port and verify token
const port = process.env.PORT || 10000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "gtmiami_secret";

// ✅ Webhook verification (GET)
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.log("Webhook verification failed.");
    res.sendStatus(403);
  }
});

// ✅ Webhook receiver (POST)
app.post("/", (req, res) => {
  console.log("Incoming Webhook Data:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));


