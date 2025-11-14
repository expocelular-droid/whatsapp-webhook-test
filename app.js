// Import Express.js and node-fetch
const express = require('express');
const fetch = require('node-fetch');

// Create an Express app
const app = express();
app.use(express.json());

// Environment variables
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN || 'gtmiami_secret';
const n8nWebhookURL = 'https://automation.gt-miami.com/webhook/whatsapp-hook';

// ✅ GET route for webhook verification
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Verification failed');
    res.sendStatus(403);
  }
});

// ✅ POST route for incoming WhatsApp events
app.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`\n📩 Webhook received at ${timestamp}`);
  console.log(JSON.stringify(req.body, null, 2));

  try {
    // Forward payload to n8n
    const response = await fetch(n8nWebhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    console.log(`➡️ Forwarded to n8n: ${response.status}`);
  } catch (err) {
    console.error('⚠️ Error forwarding to n8n:', err);
  }

  res.sendStatus(200);
});

// Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));
