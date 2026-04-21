// Game Saver Functionality
(function() {
  // Get game title from the h1 element in games-header
  function getGameTitle() {
    const titleElement = document.querySelector('.games-header h1');
    return titleElement ? titleElement.textContent.trim() : null;
  }

  // Get game ID from the page title
  async function getGameId() {
    const gameTitle = getGameTitle();
    if (!gameTitle) return null;

    try {
      const response = await fetch('/games');
      const games = await response.json();
      const game = games.find(g => g.title === gameTitle);
      return game ? game.id : null;
    } catch (error) {
      console.error('Error fetching game ID:', error);
      return null;
    }
  }

  // Check if currently logged in
  async function isLoggedIn() {
    try {
      const response = await fetch('/auth/status');
      const data = await response.json();
      return data.loggedIn;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  }

  // Check if a game is saved
  async function isGameSaved(gameId) {
    try {
      const response = await fetch(`/games/${gameId}/saved`);
      if (response.status === 401) {
        return false;
      }
      const data = await response.json();
      return data.isSaved;
    } catch (error) {
      console.error('Error checking saved status:', error);
      return false;
    }
  }

  // Save or unsave a game
  async function toggleSaveGame(gameId) {
    try {
      const isSaved = await isGameSaved(gameId);

      if (isSaved) {
        // Unsave the game
        const response = await fetch(`/games/${gameId}/save`, {
          method: 'DELETE'
        });
        if (response.ok) {
          return { success: true, saved: false };
        }
      } else {
        // Save the game
        const response = await fetch(`/games/${gameId}/save`, {
          method: 'POST'
        });
        if (response.ok) {
          return { success: true, saved: true };
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Error saving/unsaving game:', error);
      return { success: false };
    }
  }

  // Update button appearance
  function updateButtonAppearance(button, isSaved) {
    if (isSaved) {
      button.textContent = 'Game Saved ✓';
      button.classList.add('saved');
    } else {
      button.textContent = 'Save Game';
      button.classList.remove('saved');
    }
  }

  // Initialize the save game button
  async function initializeSaveButton() {
    const saveBtn = document.getElementById('saveGames-btn');
    if (!saveBtn) return;

    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      saveBtn.textContent = 'Sign In to Save';
      saveBtn.disabled = true;
      saveBtn.addEventListener('click', () => {
        window.location.href = '/signin.html';
      });
      return;
    }

    const gameId = await getGameId();
    if (!gameId) {
      console.error('Could not determine game ID');
      saveBtn.disabled = true;
      return;
    }

    // Check initial saved status
    const isSaved = await isGameSaved(gameId);
    updateButtonAppearance(saveBtn, isSaved);

    // Add click handler
    saveBtn.addEventListener('click', async () => {
      saveBtn.disabled = true;
      const result = await toggleSaveGame(gameId);
      if (result.success) {
        updateButtonAppearance(saveBtn, result.saved);
      }
      saveBtn.disabled = false;
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSaveButton);
  } else {
    initializeSaveButton();
  }
})();
