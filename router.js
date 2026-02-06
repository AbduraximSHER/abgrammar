/**
 * Simple Router for Learn.html
 * Handles hash-based routing for topic pages
 */

(function () {
    'use strict';

    function handleRoute() {
        const hash = window.location.hash || '#/';
        const path = hash.substring(1); // Remove #

        // Parse route
        const parts = path.split('/').filter(p => p);

        if (parts.length === 0 || parts[0] === '') {
            // Home route - show welcome screen
            showWelcomeScreen();
        } else if (parts[0] === 'topic' && parts[1]) {
            // Topic route - load topic
            const topicId = parts[1];
            if (window.TopicLoader) {
                window.TopicLoader.loadTopic(topicId);
            }
        } else {
            // Unknown route - show welcome
            showWelcomeScreen();
        }
    }

    function showWelcomeScreen() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        mainContent.innerHTML = `
            <div class="welcome-screen">
                <h1>Welcome to English Grammar Master 👋</h1>
                <p class="welcome-subtitle">Learn grammar step by step with extreme clarity</p>
                
                <div class="welcome-cards">
                    <div class="welcome-card">
                        <div class="card-icon">🎯</div>
                        <h3>Clear Learning Path</h3>
                        <p>Follow our structured roadmap from basics to advanced</p>
                    </div>
                    <div class="welcome-card">
                        <div class="card-icon">📝</div>
                        <h3>Practice as You Learn</h3>
                        <p>Instant feedback with every topic</p>
                    </div>
                    <div class="welcome-card">
                        <div class="card-icon">📖</div>
                        <h3>Built-in Dictionary</h3>
                        <p>Click any word for instant translation</p>
                    </div>
                </div>
                
                <div class="cta-section">
                    <h2>Ready to start?</h2>
                    <a href="#/topic/present-simple" class="cta-button">Start with Present Simple →</a>
                </div>
            </div>
        `;

        // Clear active states
        const allLinks = document.querySelectorAll('.topic-link');
        allLinks.forEach(link => link.classList.remove('active'));
    }

    // Handle route changes
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('load', handleRoute);

})();
