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

// Get all saved games for current user
router.get('/saved', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  db.all(
    `SELECT g.* FROM games g
     INNER JOIN user_saved_games usg ON g.id = usg.game_id
     WHERE usg.user_id = ?
     ORDER BY usg.saved_at DESC`,
    [req.session.userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
    }
  );
});

// Check if a game is saved by the current user
router.get('/:gameId/saved', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { gameId } = req.params;

  db.get(
    "SELECT * FROM user_saved_games WHERE user_id = ? AND game_id = ?",
    [req.session.userId, gameId],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ isSaved: !!row });
    }
  );
});

// Save a game
router.post('/:gameId/save', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { gameId } = req.params;

  db.run(
    "INSERT OR IGNORE INTO user_saved_games (user_id, game_id) VALUES (?, ?)",
    [req.session.userId, gameId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Game saved successfully' });
    }
  );
});

// Unsave a game
router.delete('/:gameId/save', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { gameId } = req.params;

  db.run(
    "DELETE FROM user_saved_games WHERE user_id = ? AND game_id = ?",
    [req.session.userId, gameId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Game unsaved successfully' });
    }
  );
});

module.exports = router;