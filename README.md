# Player One - Game Wiki MVP

A static game wiki application with client-side authentication simulation for GitHub Pages deployment.

## Features

- User registration and login
- Browse featured games on the home page
- Search and filter games by title, genre, and platform in the library
- Saved games section (visible when "signed in")

## How Authentication Works

## Local Development

Windows Setup Guide For Development and Testing (Node + Express Server)

This project runs on a Node.js + Express backend, so you must run the server to use the site.

---

1. Install Node.js (Recommended: via NVM)

Step 1: Install NVM for Windows

- Go to: https://github.com/coreybutler/nvm-windows/releases
- Download: nvm-setup.exe
- Run the installer

Step 2: Install Node.js (LTS)

Open Command Prompt:

```
nvm install lts
nvm use lts
```

Step 3: Check it worked

```
node -v
npm -v
```

---

Alternative (No NVM)

- Go to: https://nodejs.org
- Download the LTS version (recommended)
- Install it

Then check:

```
node -v
npm -v
```

---

Running the Express Server

1. Go to the project folder

```
cd path\to\Player-One
```

---

2. Install dependencies

```
npm install
```

---

3. Create ".env" file

In the root folder:

```
SESSION_SECRET="your-secret-key"
PORT=3000
```

---

4. Start the server

```
node server.js
```

Optional (auto-restart on changes):

```
npx nodemon server.js
```

---

5. Open the app

http://localhost:3000

---

⚠️ Notes

- Always use LTS version of Node.js (stable and supported)
- Do NOT open HTML files directly — always use the Express server
- Authentication will not work without the backend running

---

## File Structure

- `index.html` - Home page with featured and saved games
- `signin.html` - Sign in page
- `signup.html` - Registration page
- `games-library.html` - Game library with search/filters
- `stylesheets/stylesheet.css` - Main styles
- `assets/` - Images and assets
