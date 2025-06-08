const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// POST /admin/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('[ADMIN LOGIN] Incoming login attempt:', { username });
  if (!username || !password) {
    console.log('[ADMIN LOGIN] Missing username or password', { username, passwordPresent: !!password });
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH) {
    console.log('[ADMIN LOGIN] Missing ADMIN_USERNAME or ADMIN_PASSWORD_HASH in environment variables');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }
  if (username !== process.env.ADMIN_USERNAME) {
    console.log('[ADMIN LOGIN] Invalid username', { provided: username, expected: process.env.ADMIN_USERNAME });
    return res.status(401).json({ error: 'Invalid username' });
  }
  try {
    //console.log('[ADMIN LOGIN] Comparing password:', { password, hash: process.env.ADMIN_PASSWORD_HASH });
    const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!valid) {
      console.log('[ADMIN LOGIN] Invalid password for user', { username });
      return res.status(401).json({ error: 'Invalid password' });
    }
    req.session.isAdmin = true;
    console.log('[ADMIN LOGIN] Login successful for user', { username });
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.log('[ADMIN LOGIN] Error during bcrypt compare', { error: err.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /admin/status
router.get('/status', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

// POST /admin/logout (optional)
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router; 