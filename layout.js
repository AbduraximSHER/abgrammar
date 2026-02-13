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

        // Add resizer handle
        const resizer = document.createElement('div');
        resizer.className = 'sidebar-resizer';
        sidebar.appendChild(resizer);

        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizer.classList.add('active');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const newWidth = e.clientX;
            if (newWidth > 200 && newWidth < 600) {
                sidebar.style.width = `${newWidth}px`;
                document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
            resizer.classList.remove('active');
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        });

        // Add Drag-to-Scroll for roadmap (Momentum)
        const content = sidebar.querySelector('.sidebar-content');
        if (content) {
            let isDown = false;
            let startY;
            let scrollTop;

            sidebar.addEventListener('mousedown', (e) => {
                if (e.target === resizer) return;
                isDown = true;
                sidebar.classList.add('grabbing');
                startY = e.pageY - sidebar.offsetTop;
                scrollTop = sidebar.scrollTop;
            });

            sidebar.addEventListener('mouseleave', () => {
                isDown = false;
                sidebar.classList.remove('grabbing');
            });

            sidebar.addEventListener('mouseup', () => {
                isDown = false;
                sidebar.classList.remove('grabbing');
            });

            sidebar.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const y = e.pageY - sidebar.offsetTop;
                const walk = (y - startY) * 2;
                sidebar.scrollTop = scrollTop - walk;
            });
        }
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

                // Get icon from LessonIndex if available
                const topicIcon = window.LessonIndex && window.LessonIndex[topic.id] ?
                    window.LessonIndex[topic.id].icon : '📚';

                const scoreDisplay = status.bestScore > 0 ?
                    `<span class="rm-topic-score">${status.bestScore}%</span>` : '';

                return `
                    <a href="${isLocked ? '#' : `#/learn/topic/${topic.id}`}"
                       class="rm-topic-link ${lockedClass}"
                       data-topic-id="${topic.id}"
                       ${isLocked ? 'onclick="return false;"' : ''}>
                        <span class="rm-topic-icon">${topicIcon}</span>
                        <div class="rm-topic-info">
                            <span class="rm-topic-title">${topic.title}</span>
                            <span class="rm-topic-time">${topic.estimated_time || '15 min'}</span>
                        </div>
                        ${scoreDisplay}
                        ${isLocked ? '<span class="rm-lock-icon">🔒</span>' : ''}
                    </a>
                `;
            }).join('');

            return `
                <div class="rm-roadmap-level">
                    <button class="rm-level-header" data-level="${level.id}">
                        <span class="rm-level-emoji">${level.emoji || '📖'}</span>
                        <span class="rm-level-title">${level.title}</span>
                        <span class="rm-level-toggle">▼</span>
                    </button>
                    <div class="rm-level-topics" data-level="${level.id}">
                        ${topicsHtml}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = levelsHtml;

        // Re-attach handlers since we just replaced the DOM
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
