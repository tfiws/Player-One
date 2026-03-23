# Player One - Game Wiki MVP

A static game wiki application with client-side authentication simulation for GitHub Pages deployment.

## Features

- Mock user registration and login (using localStorage)
- Browse featured games on the home page
- Search and filter games by title, genre, and platform in the library
- Saved games section (visible when "signed in")

## GitHub Pages Setup

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select "main" branch and "/ (root)" folder
   - Click "Save"

3. **Access your site**:
   - Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## How Authentication Works

Since GitHub Pages only serves static files, authentication is simulated using `localStorage`:

- **Sign Up/Sign In**: Stores login state in browser storage
- **Log Out**: Clears the storage
- **Saved Games**: Shows when "logged in", hidden when not

**Note**: This is not secure authentication - it's just for demo purposes. In a real application, you'd need a backend server.

## Local Development

To run locally with the Node.js backend (for full functionality):

```bash
npm install
npm start
```

Then visit `http://localhost:3000`

## File Structure

- `index.html` - Home page with featured and saved games
- `signin.html` - Sign in page
- `signup.html` - Registration page
- `games-library.html` - Game library with search/filters
- `stylesheets/stylesheet.css` - Main styles
- `assets/` - Images and assets