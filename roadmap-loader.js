/**
 * Roadmap Loader
 * Loads and renders the roadmap with progress tracking
 */

(function () {
    'use strict';

    const RoadmapLoader = {
        roadmap: null,

        /**
         * Initialize roadmap
         */
        async init() {
            await this.loadRoadmap();
            this.renderProgressBar();
        },

        /**
         * Load roadmap data
         */
        async loadRoadmap() {
            try {
                const response = await fetch('data/roadmap.json');
                this.roadmap = await response.json();

                // Wait for ProgressManager
                if (window.ProgressManager) {
                    await window.ProgressManager.init();
                }

                this.renderRoadmap();
            } catch (error) {
                console.error('Error loading roadmap:', error);
                // Check if this is a CORS error from opening file directly
                if (window.location.protocol === 'file:') {
                    console.error('⚠️ CORS Error: You must use a local server (e.g., Live Server) to run this site. Opening files directly in the browser will not work.');
                }
            }
        },

        /**
         * Render roadmap in sidebar
         */
        renderRoadmap() {
            const container = document.getElementById('roadmap-container');
            if (!container || !this.roadmap) return;

            const levelsHtml = this.roadmap.levels.map(level => {
                const topicsHtml = level.topics.map(topic => {
                    const status = window.ProgressManager ?
                        window.ProgressManager.getTopicStatus(topic.id) :
                        { status: 'available', unlocked: true };

                    const statusIcon = this.getStatusIcon(status);
                    const isLocked = !status.unlocked;
                    const lockedClass = isLocked ? 'locked' : '';

                    const scoreDisplay = status.bestScore > 0 ?
                        `<span class="topic-score">${status.bestScore}%</span>` : '';

                    return `
                        <a href="${isLocked ? '#' : `#/topic/${topic.id}`}" 
                           class="topic-link ${lockedClass}" 
                           data-topic-id="${topic.id}"
                           ${isLocked ? 'onclick="return false;"' : ''}>
                            <span class="topic-status ${status.status}">${statusIcon}</span>
                            <div class="topic-info">
                                <span class="topic-title">${topic.title}</span>
                                <span class="topic-time">${topic.estimated_time}</span>
                            </div>
                            ${scoreDisplay}
                            ${isLocked ? '<span class="lock-icon">🔒</span>' : ''}
                        </a>
                    `;
                }).join('');

                return `
                    <div class="roadmap-level">
                        <button class="level-header" data-level="${level.id}">
                            <span class="level-title">${level.title}</span>
                            <span class="level-toggle">▼</span>
                        </button>
                        <div class="level-topics" data-level="${level.id}">
                            ${topicsHtml}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = levelsHtml;
        },

        /**
         * Render progress bar
         */
        renderProgressBar() {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar || !window.ProgressManager) return;

            const stats = window.ProgressManager.getStats();
            const message = window.ProgressManager.getMilestoneMessage(stats.percentage);

            let progressSection = sidebar.querySelector('.progress-section');
            if (!progressSection) {
                progressSection = document.createElement('div');
                progressSection.className = 'progress-section';

                const header = sidebar.querySelector('.sidebar-header');
                if (header) {
                    header.after(progressSection);
                } else {
                    sidebar.prepend(progressSection);
                }
            }

            progressSection.innerHTML = `
                <div class="progress-stats">
                    <div class="progress-label">Your Progress</div>
                    <div class="progress-percentage">${stats.percentage}%</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${stats.percentage}%"></div>
                </div>
                <div class="progress-details">
                    <span>${stats.completedTopics} of ${stats.totalTopics} topics</span>
                    ${stats.streak > 0 ? `<span class="streak-badge">🔥 ${stats.streak} day${stats.streak > 1 ? 's' : ''}</span>` : ''}
                </div>
                <div class="progress-message">${message}</div>
            `;
        },

        /**
         * Get status icon
         */
        getStatusIcon(status) {
            switch (status.status) {
                case 'completed':
                    return '✓';
                case 'in-progress':
                    return '▶';
                case 'locked':
                    return '○';
                case 'available':
                default:
                    return '○';
            }
        },

        /**
         * Update progress (call after topic completion)
         */
        updateProgress() {
            this.renderRoadmap();
            this.renderProgressBar();
        }
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            RoadmapLoader.init();
        });
    } else {
        RoadmapLoader.init();
    }

    // Expose globally
    window.RoadmapLoader = RoadmapLoader;

})();
