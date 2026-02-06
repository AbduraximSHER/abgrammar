/**
 * Layout Interactions
 * Handles sidebar toggle, level collapse/expand, and active states
 */

(function () {
    'use strict';

    // ===== SIDEBAR TOGGLE (MOBILE) =====
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            sidebarToggle.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                    sidebarToggle.classList.remove('active');
                }
            }
        });
    }

    // ===== LEVEL COLLAPSE/EXPAND =====
    const levelHeaders = document.querySelectorAll('.level-header');

    levelHeaders.forEach(header => {
        const levelId = header.getAttribute('data-level');
        const topicsContainer = document.querySelector(`.level-topics[data-level="${levelId}"]`);

        // Expand Level 1 by default
        if (levelId === 'basics') {
            header.classList.add('active');
            topicsContainer.classList.add('expanded');
        }

        header.addEventListener('click', () => {
            const isActive = header.classList.contains('active');

            if (isActive) {
                // Collapse
                header.classList.remove('active');
                topicsContainer.classList.remove('expanded');
            } else {
                // Expand
                header.classList.add('active');
                topicsContainer.classList.add('expanded');
            }
        });
    });

    // ===== ACTIVE TOPIC HIGHLIGHTING =====
    function updateActiveTopicFromHash() {
        const hash = window.location.hash;
        const topicLinks = document.querySelectorAll('.topic-link');

        topicLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');

                // Ensure parent level is expanded
                const parentLevel = link.closest('.level-topics');
                const levelId = parentLevel.getAttribute('data-level');
                const levelHeader = document.querySelector(`.level-header[data-level="${levelId}"]`);

                levelHeader.classList.add('active');
                parentLevel.classList.add('expanded');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Update on hash change
    window.addEventListener('hashchange', updateActiveTopicFromHash);

    // Update on load
    updateActiveTopicFromHash();

    // ===== DICTIONARY MODE SYNC =====
    const dictToggleTop = document.getElementById('dict-toggle-top');
    const dictToggleMain = document.getElementById('dict-toggle');

    if (dictToggleTop && dictToggleMain) {
        // Sync state on load
        dictToggleTop.checked = dictToggleMain.checked;

        // Sync when either changes
        dictToggleTop.addEventListener('change', () => {
            dictToggleMain.checked = dictToggleTop.checked;
            dictToggleMain.dispatchEvent(new Event('change'));
        });

        dictToggleMain.addEventListener('change', () => {
            dictToggleTop.checked = dictToggleMain.checked;
        });
    }

    // ===== PROGRESS TRACKING =====
    function updateProgress() {
        const allTopics = document.querySelectorAll('.topic-link');
        const completedTopics = document.querySelectorAll('.topic-status.complete');
        const totalTopics = allTopics.length;
        const completedCount = completedTopics.length;
        const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

        // Update progress circle
        const progressText = document.querySelector('.progress-text');
        const progressRing = document.querySelector('.progress-ring');

        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }

        if (progressRing) {
            const circumference = 2 * Math.PI * 16; // radius = 16
            const offset = circumference - (percentage / 100) * circumference;
            progressRing.style.strokeDashoffset = offset;
        }

        // Update level progress
        const levels = ['basics', 'core', 'advanced'];
        levels.forEach(levelId => {
            const levelTopics = document.querySelectorAll(`.level-topics[data-level="${levelId}"] .topic-link`);
            const levelCompleted = document.querySelectorAll(`.level-topics[data-level="${levelId}"] .topic-status.complete`);
            const levelProgress = document.querySelector(`.level-header[data-level="${levelId}"] .level-progress`);

            if (levelProgress) {
                levelProgress.textContent = `${levelCompleted.length}/${levelTopics.length}`;
            }
        });
    }

    // Update progress on load
    updateProgress();

    // ===== SEARCH FUNCTIONALITY (PLACEHOLDER) =====
    const searchInput = document.getElementById('search-input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const topicLinks = document.querySelectorAll('.topic-link');

            if (query.length === 0) {
                // Show all topics
                topicLinks.forEach(link => {
                    link.style.display = 'flex';
                });
                return;
            }

            // Filter topics
            topicLinks.forEach(link => {
                const topicName = link.querySelector('.topic-name').textContent.toLowerCase();
                if (topicName.includes(query)) {
                    link.style.display = 'flex';

                    // Expand parent level
                    const parentLevel = link.closest('.level-topics');
                    const levelId = parentLevel.getAttribute('data-level');
                    const levelHeader = document.querySelector(`.level-header[data-level="${levelId}"]`);

                    levelHeader.classList.add('active');
                    parentLevel.classList.add('expanded');
                } else {
                    link.style.display = 'none';
                }
            });
        });
    }

    /**
     * Render the roadmap in the sidebar
     */
    function renderRoadmap(roadmap) {
        const container = document.getElementById('roadmap-container');
        if (!container) return;

        const levelsHtml = roadmap.levels.map(level => {
            const topicsHtml = level.topics.map(topic => {
                const status = window.ProgressManager ?
                    window.ProgressManager.getTopicStatus(topic.id) :
                    { status: 'available', unlocked: true };

                const statusIcon = getStatusIcon(status);
                const isLocked = !status.unlocked;
                const lockedClass = isLocked ? 'locked' : '';

                // Get best score if available
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
                    <div class="level-topics">
                        ${topicsHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = levelsHtml;
        // Assuming attachLevelToggles is a function that needs to be defined or already exists
        // For now, we'll just call it if it exists, otherwise, it will be a runtime error.
        // If it's meant to be a method of an object, this structure needs adjustment.
        // For faithful insertion, assuming it's a global/local function.
        if (typeof attachLevelToggles === 'function') {
            attachLevelToggles();
        }
    }

    /**
     * Get status icon based on topic status
     */
    function getStatusIcon(status) {
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
    }

    // ===== CLOSE SIDEBAR ON TOPIC CLICK (MOBILE) =====
    const topicLinks = document.querySelectorAll('.topic-link');
    topicLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                sidebarToggle.classList.remove('active');
            }
        });
    });

    // ===== EXPOSE PROGRESS UPDATE FUNCTION =====
    window.updateLayoutProgress = updateProgress;

})();
