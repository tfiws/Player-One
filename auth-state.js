// Shared authentication state checker for all pages
function updateAuthButton(loggedIn) {
    const authDiv = document.getElementById('auth-button');
    if (loggedIn) {
        authDiv.innerHTML = '<button id="logout-btn" class="btn nav-btn">Log Out</button>';
        document.getElementById('logout-btn').addEventListener('click', async () => {
            try {
                await fetch('/auth/logout', { method: 'POST' });
                localStorage.removeItem('loggedIn');
                localStorage.removeItem('userEmail');
                location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                location.reload();
            }
        });
    } else {
        authDiv.innerHTML = '<a href="./signin.html"> <button id="signin-btn" class="btn nav-btn" > Sign In </button> </a>';
    }
}

// Check login status on page load
function initializeAuth() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    updateAuthButton(loggedIn);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}
