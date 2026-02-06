/**
 * Content Views for Navigation Structure
 * This file contains HTML content for all route views
 */

const VIEWS = {
    home: `
        <!-- HOME VIEW: Existing hero section and main features -->
        <div id="home-view" class="route-section active">
            <!-- Hero section with 4D timeline will be moved here -->
            <!-- Aspect Matrix will be here -->
            <!-- Contrast Arena will be here -->
        </div>
    `,

    roadmap: `
        <!-- GRAMMAR ROADMAP HUB -->
        <div id="roadmap-view" class="route-section">
            <div class="container" style="padding: 4rem 2rem;">
                <h1 class="page-title">🗺️ Grammar Roadmap</h1>
                <p class="page-subtitle">Your structured path to mastering English grammar</p>
                
                <div class="roadmap-grid">
                    <div class="roadmap-card glass-card" onclick="navigateTo('/roadmap/basics')">
                        <div class="roadmap-level">Level 1</div>
                        <h2>Basics</h2>
                        <p>Foundation tenses and simple structures</p>
                        <ul class="roadmap-topics">
                            <li>Present Simple</li>
                            <li>Past Simple</li>
                            <li>Future Simple</li>
                            <li>Present Continuous</li>
                        </ul>
                        <button class="roadmap-btn">Start Learning →</button>
                    </div>
                    
                    <div class="roadmap-card glass-card" onclick="navigateTo('/roadmap/core')">
                        <div class="roadmap-level">Level 2</div>
                        <h2>Core Grammar</h2>
                        <p>Essential grammar for everyday communication</p>
                        <ul class="roadmap-topics">
                            <li>Present Perfect</li>
                            <li>Past Continuous</li>
                            <li>Conditionals (1st, 2nd)</li>
                            <li>Modal Verbs</li>
                        </ul>
                        <button class="roadmap-btn">Continue Learning →</button>
                    </div>
                    
                    <div class="roadmap-card glass-card" onclick="navigateTo('/roadmap/advanced')">
                        <div class="roadmap-level">Level 3</div>
                        <h2>Advanced</h2>
                        <p>Complex structures and nuanced usage</p>
                        <ul class="roadmap-topics">
                            <li>Perfect Continuous Tenses</li>
                            <li>Passive Voice</li>
                            <li>3rd Conditional</li>
                            <li>Advanced Modals</li>
                        </ul>
                        <button class="roadmap-btn">Master It →</button>
                    </div>
                </div>
            </div>
        </div>
    `,

    topics: `
        <!-- TOPICS HUB -->
        <div id="topics-view" class="route-section">
            <div class="container" style="padding: 4rem 2rem;">
                <h1 class="page-title">📚 Topics</h1>
                <p class="page-subtitle">Explore grammar topics in depth</p>
                
                <div class="topics-grid">
                    <div class="topic-card glass-card" onclick="navigateTo('/topics/tenses')">
                        <div class="topic-icon">⏰</div>
                        <h3>All Tenses</h3>
                        <p>Complete overview of all 12 English tenses with the Aspect Matrix</p>
                    </div>
                    
                    <div class="topic-card glass-card" onclick="navigateTo('/topics/conditionals')">
                        <div class="topic-icon">🔀</div>
                        <h3>Conditionals</h3>
                        <p>Master if-clauses and hypothetical situations</p>
                    </div>
                    
                    <div class="topic-card glass-card" onclick="navigateTo('/topics/passive')">
                        <div class="topic-icon">🔄</div>
                        <h3>Passive Voice</h3>
                        <p>Learn when and how to use passive constructions</p>
                    </div>
                    
                    <div class="topic-card glass-card" onclick="navigateTo('/topics/modals')">
                        <div class="topic-icon">💬</div>
                        <h3>Modal Verbs</h3>
                        <p>Can, should, must, might - express possibility and obligation</p>
                    </div>
                </div>
            </div>
        </div>
    `,

    practice: `
        <!-- PRACTICE HUB -->
        <div id="practice-view" class="route-section">
            <div class="container" style="padding: 4rem 2rem;">
                <h1 class="page-title">✍️ Practice</h1>
                <p class="page-subtitle">Test your knowledge and track your progress</p>
                
                <div class="practice-grid">
                    <div class="practice-card glass-card" onclick="navigateTo('/practice/topic-tests')">
                        <div class="practice-icon">📝</div>
                        <h3>Topic Tests</h3>
                        <p>Focused quizzes on specific grammar topics</p>
                        <div class="practice-stats">
                            <span>9 Tests Available</span>
                        </div>
                    </div>
                    
                    <div class="practice-card glass-card" onclick="navigateTo('/practice/mixed-tests')">
                        <div class="practice-icon">🎯</div>
                        <h3>Mixed Tests</h3>
                        <p>Challenge yourself with mixed grammar questions</p>
                        <div class="practice-stats">
                            <span>117 Questions</span>
                        </div>
                    </div>
                    
                    <div class="practice-card glass-card" onclick="navigateTo('/practice/timed-tests')">
                        <div class="practice-icon">⏱️</div>
                        <h3>Timed Tests</h3>
                        <p>Race against the clock to test your speed</p>
                        <div class="practice-stats">
                            <span>Coming Soon</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIEWS;
}
