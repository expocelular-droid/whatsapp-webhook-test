// Import dependencies
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Load environment variables
const verifyToken = process.env.VERIFY_TOKEN;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

// ===== VERIFY ENDPOINT (GET) =====
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    console.log('❌ WEBHOOK VERIFICATION FAILED');
    res.sendStatus(403);
  }
});

// ===== HANDLE MESSAGES (POST) =====
app.post('/', async (req, res) => {
  console.log('📩 Incoming webhook:', JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;

    if (messages && messages.length > 0) {
      const text = messages[0].text?.body || '(no text)';
      console.log('💬 Forwarding text:', text);

      // forward to your n8n webhook
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
    }
  } catch (err) {
    console.error('⚠️ Error handling message:', err);
  }

  // Respond to Meta so it knows the webhook received the update
  res.sendStatus(200);
});

// ===== START SERVER =====
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 WhatsApp webhook running on port ${port}`);
});






