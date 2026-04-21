const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors = require('cors');
const path = require('path');
const db = require('./database');

let authRoutes;
let gameRoutes;

try {
  authRoutes = require('./routes/auth');
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Failed to load auth routes:', error);
}

try {
  gameRoutes = require('./routes/games');
  console.log('Game routes loaded successfully');
} catch (error) {
  console.error('Failed to load game routes:', error);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store: new SQLiteStore({ db: 'sessions.db', dir: __dirname }),
  secret: 'your-secret-key', // Change this in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'Server is working' });
});

// Routes (must come before static files)
if (authRoutes) {
  app.use('/auth', authRoutes);
} else {
  console.warn('Auth routes not available');
}

if (gameRoutes) {
  app.use('/games', gameRoutes);
} else {
  console.warn('Game routes not available');
}

// Serve static files
app.use(express.static(path.join(__dirname)));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});