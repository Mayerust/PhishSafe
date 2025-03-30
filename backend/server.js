
//const express = require('express');
//const cors = require('cors');
const { detectPhishing } = require('./phishing-detector');
const { checkBreachedCredentials } = require('./breach-checker');


const PORT = 3000;

// Middleware
const cors = require("cors");
const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:*;"
  );
  next();
});

// ppp

// Routes
app.post('/api/check-url', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log(`Checking URL: ${url}`);
    const result = await detectPhishing(url);
    
    return res.json(result);
  } catch (error) {
    console.error('Error checking URL:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze URL',
      message: error.message 
    });
  }
});

app.post('/api/check-breach', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log(`Checking breached credentials for: ${email}`);
    const result = await checkBreachedCredentials(email);
    
    return res.json(result);
  } catch (error) {
    console.error('Error checking breached credentials:', error);
    return res.status(500).json({ 
      error: 'Failed to check breach status',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`PhishSafe backend server running on http://localhost:${PORT}`);
});
