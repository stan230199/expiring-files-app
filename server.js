const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// File to store tokens with expiry times
const TOKENS_FILE = 'tokens.json';

// Helper: Load tokens from file
function loadTokens() {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      return JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading tokens:', err);
  }
  return {};
}

// Helper: Save tokens to file
function saveTokens(tokens) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

// Helper: Clean expired tokens
function cleanExpiredTokens(tokens) {
  const now = Date.now();
  const cleaned = {};
  Object.entries(tokens).forEach(([token, data]) => {
    if (data.expiresAt > now) {
      cleaned[token] = data;
    }
  });
  return cleaned;
}

// API: Generate a new token with expiry
app.get('/api/generate', (req, res) => {
  const days = parseInt(req.query.days) || 4;
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;

  let tokens = loadTokens();
  tokens = cleanExpiredTokens(tokens);
  tokens[token] = {
    createdAt: Date.now(),
    expiresAt: expiresAt,
    days: days
  };
  saveTokens(tokens);

  const shareLink = `${req.protocol}://${req.get('host')}/share/${token}`;

  res.json({
    token,
    expiresAt,
    shareLink,
    message: `Link expires in ${days} days`
  });
});

// API: Check if token is valid
app.get('/api/check', (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  let tokens = loadTokens();
  tokens = cleanExpiredTokens(tokens);

  if (!tokens[token]) {
    return res.json({ valid: false });
  }

  const data = tokens[token];
  const timeLeft = data.expiresAt - Date.now();
  const daysLeft = Math.ceil(timeLeft / (24 * 60 * 60 * 1000));

  res.json({
    valid: true,
    expiresAt: data.expiresAt,
    daysLeft: Math.max(0, daysLeft)
  });
});

// API: Get content (only if token is valid)
app.get('/api/content', (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'Token missing' });
  }

  let tokens = loadTokens();
  tokens = cleanExpiredTokens(tokens);

  if (!tokens[token]) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Read the actual content file
  const contentPath = path.join(__dirname, 'revolut-anleitung.html');

  if (!fs.existsSync(contentPath)) {
    return res.status(404).json({ error: 'Content not found' });
  }

  const content = fs.readFileSync(contentPath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.send(content);
});

// API: List all active tokens (admin)
app.get('/api/tokens', (req, res) => {
  let tokens = loadTokens();
  tokens = cleanExpiredTokens(tokens);

  const tokenList = Object.entries(tokens).map(([token, data]) => ({
    token: token.substring(0, 8) + '...',
    expiresAt: new Date(data.expiresAt).toISOString(),
    daysLeft: Math.ceil((data.expiresAt - Date.now()) / (24 * 60 * 60 * 1000))
  }));

  res.json(tokenList);
});

// Serve wrapper HTML for share links
app.get('/share/:token', (req, res) => {
  const token = req.params.token;
  const wrapperPath = path.join(__dirname, 'expiring-wrapper.html');

  if (!fs.existsSync(wrapperPath)) {
    return res.status(404).send('Wrapper file not found');
  }

  let wrapper = fs.readFileSync(wrapperPath, 'utf8');
  wrapper = wrapper.replace('revolut-wallet-{{ TOKEN }}', `revolut-wallet-${token}`);

  res.setHeader('Content-Type', 'text/html');
  res.send(wrapper);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files
app.use(express.static('.'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Expiring Files Server running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET /api/generate?days=4 - Generate new token`);
  console.log(`   GET /api/check?token=TOKEN - Check if token valid`);
  console.log(`   GET /api/content?token=TOKEN - Get content (token required)`);
  console.log(`   GET /api/tokens - List all active tokens`);
  console.log(`   GET /share/:token - View share page`);
  console.log(`   GET /health - Health check`);
});
