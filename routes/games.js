const express = require('express');
const db = require('../database');

const router = express.Router();

// Get all games with optional filters
router.get('/', (req, res) => {
  const { search, genre, platform } = req.query;
  let query = "SELECT * FROM games WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND title LIKE ?";
    params.push(`%${search}%`);
  }

  if (genre && genre !== 'All') {
    query += " AND genre LIKE ?";
    params.push(`%${genre}%`);
  }

  if (platform && platform !== 'All') {
    query += " AND platform LIKE ?";
    params.push(`%${platform}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// Get featured games (for home page)
router.get('/featured', (req, res) => {
  // For MVP, just return first 6 games
  db.all("SELECT * FROM games LIMIT 6", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

module.exports = router;