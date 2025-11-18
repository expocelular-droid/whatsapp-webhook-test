// Import dependencies
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Environment variable for token
const verifyToken = process.env.VERIFY_TOKEN;

// ======== VERIFY ENDPOINT (GET) ========
app.get('/webhook', (req, res) => {
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

// ======== MESSAGE HANDLER (POST) ========
app.post('/webhook', async (req, res) => {
  console.log('📩 Incoming webhook:', JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const messages = changes?.value?.messages;
    if (messages && messages.length > 0) {
      const text = messages[0].text?.body || '(no text)';
      console.log('💬 Forwarding message text:', text);

      // Forward text to your n8n webhook
      await fetch('https://automation.gt-miami.com/webhook-test/whatsapp-incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
    }
  } catch (err) {
    console.error('⚠️ Error parsing or forwarding message:', err);
  }

  res.sendStatus(200);
});

// ======== SERVER START ========
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 WhatsApp webhook running on port ${port}`);
});






