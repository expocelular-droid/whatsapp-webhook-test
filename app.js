// Import dependencies
const express = require('express');
const fetch = require('node-fetch');

// Create Express app
const app = express();
app.use(express.json());

// Environment variables
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

// ✅ Verification route (GET)
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verified');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification failed');
    res.sendStatus(403);
  }
});

// 📩 Message receiver (POST)
app.post('/', async (req, res) => {
  console.log('📩 Incoming WhatsApp event:');
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    console.log(`➡️ Forwarded to n8n (${response.status})`);
  } catch (error) {
    console.error('❌ Error forwarding to n8n:', error);
  }

  res.sendStatus(200);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});




