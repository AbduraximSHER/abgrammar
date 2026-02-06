/**
 * Continue Learning Button
 * Shows progress and next recommended topic on welcome screen
 */

(function () {
    'use strict';

    function renderContinueLearning() {
        const container = document.getElementById('continue-learning-container');
        if (!container || !window.ProgressManager) return;

        const stats = window.ProgressManager.getStats();

        // Only show if user has started learning
        if (stats.completedTopics === 0) {
            container.innerHTML = '';
            return;
        }

        const continueTopic = window.ProgressManager.getContinueTopic();
        if (!continueTopic) {
            // User completed everything!
            container.innerHTML = `
                <div class="continue-learning-section">
                    <h3>🎉 Congratulations!</h3>
                    <p>You've completed all topics! Amazing work!</p>
                    <div class="celebration-score">${stats.percentage}%</div>
                </div>
            `;
            return;
        }

        // Get topic details from roadmap
        let topicTitle = continueTopic;
        let topicTime = '15 min';

        if (window.RoadmapLoader && window.RoadmapLoader.roadmap) {
            for (const level of window.RoadmapLoader.roadmap.levels) {
                const topic = level.topics.find(t => t.id === continueTopic);
                if (topic) {
                    topicTitle = topic.title;
                    topicTime = topic.estimated_time;
                    break;
                }
            }
        }

        const message = window.ProgressManager.getMilestoneMessage(stats.percentage);

        container.innerHTML = `
            <div class="continue-learning-section">
                <h3>Keep Going! 🚀</h3>
                <p>${message}</p>
                <a href="#/topic/${continueTopic}" class="continue-btn">
                    <span>Continue Learning</span>
                    <span>→</span>
                </a>
                <div class="continue-topic-info">
                    <span>Next: <strong>${topicTitle}</strong></span>
                    <span>•</span>
                    <span>${topicTime}</span>
                </div>
            </div>
        `;
    }

    // Render on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(renderContinueLearning, 100);
        });
    } else {
        setTimeout(renderContinueLearning, 100);
    }

    // Re-render when hash changes to home
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '' || window.location.hash === '#/') {
            setTimeout(renderContinueLearning, 100);
        }
    });

    // Expose globally
    window.renderContinueLearning = renderContinueLearning;

})();
