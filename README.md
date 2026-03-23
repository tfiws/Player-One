# Player One - Game Wiki MVP

A simple game wiki application with user authentication and game search functionality using SQLite.

## Features

- User registration and login
- Browse featured games on the home page
- Search and filter games by title, genre, and platform in the library

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

## API Endpoints

- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Login
- `POST /auth/logout` - Logout
- `GET /auth/status` - Check login status
- `GET /games` - Get games with optional filters (search, genre, platform)
- `GET /games/featured` - Get featured games

## Database

The app uses SQLite with two tables:
- `users` - Stores user email and hashed password
- `games` - Stores game information

Sample games are inserted on first run.