const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');

const router = express.Router();

// Email validation helper
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'Auth routes loaded' });
});

// Signup
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', { email: req.body.email });
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate email format
    if (!email || !isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate passwords
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed, inserting into database');
    
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      console.log('User created successfully');
      res.status(201).json({ message: 'User created successfully' });
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Signin
router.post('/signin', (req, res) => {
  console.log('Signin request received:', { email: req.body.email });
  try {
    const { email, password } = req.body;

    // Validate email format
    if (!email || !isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      try {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
          console.log('User not found:', email);
          return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          console.log('Invalid password for user:', email);
          return res.status(400).json({ error: 'Invalid email or password' });
        }

        console.log('User signed in successfully:', email);
        req.session.userId = user.id;
        res.json({ message: 'Signed in successfully' });
      } catch (error) {
        console.error('Signin callback error:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Check if logged in
router.get('/status', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = router;