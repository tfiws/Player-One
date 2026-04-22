const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'playerone.db');
const db = new sqlite3.Database(dbPath);

// Initialize database
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Games table
  db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT,
    platform TEXT,
    description TEXT,
    release_year INTEGER,
    image_url TEXT,
    page_url TEXT
  )`);

  // User Saved Games join table
  db.run(`CREATE TABLE IF NOT EXISTS user_saved_games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    UNIQUE(user_id, game_id)
  )`);

  // Insert some sample games
  const sampleGames = [
    {
      title: 'Elden Ring',
      genre: 'Open-world RPG',
      platform: 'PC, PlayStation, Xbox',
      description: 'An action RPG set in the Lands Between, a realm blessed by the Greater Will and the Erdtree.',
      release_year: 2022,
      image_url: './assets/eldenring.webp',
      page_url: 'pages/game-pages/eldenring.html'
    },
    {
      title: 'Cyberpunk 2077',
      genre: 'Action RPG',
      platform: 'PC, PlayStation, Xbox',
      description: 'An open-world, action-adventure RPG set in the dark future of Night City.',
      release_year: 2020,
      image_url: './assets/cyberpunk2077.jpeg',
      page_url: 'pages/game-pages/cyberpunk2077.html'
    },
    {
      title: 'The Legend of Zelda: Tears of the Kingdom',
      genre: 'Action-Adventure',
      platform: 'Nintendo Switch',
      description: 'The sequel to Breath of the Wild, featuring new mechanics and exploration.',
      release_year: 2023,
      image_url: './assets/tears-of-the-kingdom.webp',
      page_url: 'pages/game-pages/tears-of-the-kingdom.html'
    },
    {
      title: 'Battlefield 6',
      genre: 'First-person shooter',
      description: 'The latest entry in the Battlefield series, featuring large-scale battles, a variety of vehicles and a new focus on player choice.',
      release_year: 2025,
      image_url: './assets/bf6.png',
      page_url: 'pages/game-pages/battlefield6.html'
    }
  ];

  // Check if games table is empty
  db.get("SELECT COUNT(*) as count FROM games", (err, row) => {
    if (err) {
      console.error(err);
    } else if (row.count === 0) {
      const stmt = db.prepare("INSERT INTO games (title, genre, platform, description, release_year, image_url, page_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
      sampleGames.forEach(game => {
        stmt.run(game.title, game.genre, game.platform, game.description, game.release_year, game.image_url, game.page_url);
      });
      stmt.finalize();
      console.log('Sample games inserted');
    }
  });
});

module.exports = db;