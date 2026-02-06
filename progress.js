/**
 * Progress Tracking System
 * Manages user learning progress with localStorage
 * - Sequential topic unlocking
 * - Keep best score on retakes
 * - Track all attempts
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'grammarProgress';
    const ROADMAP_URL = 'data/roadmap.json';

    // ===== PROGRESS MANAGER =====
    window.ProgressManager = {
        roadmap: null,

        /**
         * Initialize progress manager
         */
        async init() {
            await this.loadRoadmap();
            this.migrateOldData();
            return this.getProgress();
        },

        /**
         * Load roadmap data
         */
        async loadRoadmap() {
            if (this.roadmap) return this.roadmap;

            try {
                const response = await fetch(ROADMAP_URL);
                const data = await response.json();
                this.roadmap = data;
                return data;
            } catch (error) {
                console.error('Failed to load roadmap:', error);
                // Check if this is a CORS error from opening file directly
                if (window.location.protocol === 'file:') {
                    console.error('⚠️ CORS Error: You must use a local server (e.g., Live Server) to run this site. Opening files directly in the browser will not work.');
                }
                return null;
            }
        },

        /**
         * Get all progress data
         */
        getProgress() {
            const defaultData = {
                completedTopics: [],
                topicAttempts: {},
                currentTopic: null,
                startedAt: new Date().toISOString(),
                lastVisit: new Date().toISOString(),
                streak: 0,
                totalTimeEstimate: 0
            };

            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) {
                this.saveProgress(defaultData);
                return defaultData;
            }

            try {
                const data = JSON.parse(stored);
                data.lastVisit = new Date().toISOString();
                this.calculateStreak(data);
                this.saveProgress(data);
                return data;
            } catch (error) {
                console.error('Failed to parse progress data:', error);
                return defaultData;
            }
        },

        /**
         * Save progress data
         */
        saveProgress(data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        },

        /**
         * Mark topic as complete with score
         */
        markTopicComplete(topicId, score, totalQuestions) {
            const progress = this.getProgress();
            const now = new Date().toISOString();

            // Initialize attempts array if not exists
            if (!progress.topicAttempts[topicId]) {
                progress.topicAttempts[topicId] = {
                    attempts: [],
                    bestScore: 0,
                    firstCompletedAt: null,
                    lastAttemptAt: null
                };
            }

            const topicData = progress.topicAttempts[topicId];

            // Add new attempt
            topicData.attempts.push({
                score: score,
                percentage: Math.round((score / totalQuestions) * 100),
                totalQuestions: totalQuestions,
                attemptedAt: now,
                passed: score >= Math.ceil(totalQuestions * 0.7)
            });

            // Update best score (keep best)
            const percentage = Math.round((score / totalQuestions) * 100);
            if (percentage > topicData.bestScore) {
                topicData.bestScore = percentage;
            }

            // Update timestamps
            topicData.lastAttemptAt = now;
            if (!topicData.firstCompletedAt && percentage >= 70) {
                topicData.firstCompletedAt = now;
            }

            // Add to completed topics if passed and not already there
            if (percentage >= 70 && !progress.completedTopics.includes(topicId)) {
                progress.completedTopics.push(topicId);
            }

            // Update current topic to next
            progress.currentTopic = this.getNextTopicId(topicId);

            this.saveProgress(progress);
            return topicData;
        },

        /**
         * Get topic status
         */
        getTopicStatus(topicId) {
            const progress = this.getProgress();
            const topicData = progress.topicAttempts[topicId];

            if (!topicData || topicData.attempts.length === 0) {
                // Check if unlocked
                const isUnlocked = this.isTopicUnlocked(topicId);
                return {
                    status: isUnlocked ? 'available' : 'locked',
                    attempts: 0,
                    bestScore: 0,
                    unlocked: isUnlocked
                };
            }

            const isCompleted = topicData.bestScore >= 70;
            return {
                status: isCompleted ? 'completed' : 'in-progress',
                attempts: topicData.attempts.length,
                bestScore: topicData.bestScore,
                lastAttempt: topicData.lastAttemptAt,
                unlocked: true,
                allAttempts: topicData.attempts
            };
        },

        /**
         * Check if topic is unlocked (sequential logic)
         */
        isTopicUnlocked(topicId) {
            if (!this.roadmap) return true;

            const progress = this.getProgress();

            // Find the topic in roadmap
            let topicFound = false;
            let previousTopicId = null;

            for (const level of this.roadmap.levels) {
                for (const topic of level.topics) {
                    if (topic.id === topicId) {
                        topicFound = true;
                        break;
                    }
                    previousTopicId = topic.id;
                }
                if (topicFound) break;
            }

            // First topic is always unlocked
            if (!previousTopicId) return true;

            // Check if previous topic is completed
            return progress.completedTopics.includes(previousTopicId);
        },

        /**
         * Get next topic ID in sequence
         */
        getNextTopicId(currentTopicId) {
            if (!this.roadmap) return null;

            let foundCurrent = false;
            for (const level of this.roadmap.levels) {
                for (const topic of level.topics) {
                    if (foundCurrent) {
                        return topic.id;
                    }
                    if (topic.id === currentTopicId) {
                        foundCurrent = true;
                    }
                }
            }
            return null; // No next topic (completed all)
        },

        /**
         * Get topic to continue from
         */
        getContinueTopic() {
            const progress = this.getProgress();

            // If has current topic, return it
            if (progress.currentTopic) {
                return progress.currentTopic;
            }

            // If has completed topics, return next unlocked
            if (progress.completedTopics.length > 0) {
                const lastCompleted = progress.completedTopics[progress.completedTopics.length - 1];
                const next = this.getNextTopicId(lastCompleted);
                if (next) return next;
            }

            // Return first topic
            if (this.roadmap && this.roadmap.levels.length > 0) {
                return this.roadmap.levels[0].topics[0].id;
            }

            return null;
        },

        /**
         * Get overall progress statistics
         */
        getStats() {
            const progress = this.getProgress();
            const totalTopics = this.getTotalTopics();
            const completedCount = progress.completedTopics.length;
            const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

            // Calculate average score
            let totalScore = 0;
            let scoreCount = 0;
            for (const topicId in progress.topicAttempts) {
                const topicData = progress.topicAttempts[topicId];
                if (topicData.bestScore > 0) {
                    totalScore += topicData.bestScore;
                    scoreCount++;
                }
            }
            const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

            // Calculate total attempts
            let totalAttempts = 0;
            for (const topicId in progress.topicAttempts) {
                totalAttempts += progress.topicAttempts[topicId].attempts.length;
            }

            return {
                totalTopics: totalTopics,
                completedTopics: completedCount,
                percentage: percentage,
                averageScore: averageScore,
                totalAttempts: totalAttempts,
                streak: progress.streak,
                startedAt: progress.startedAt,
                lastVisit: progress.lastVisit
            };
        },

        /**
         * Get total number of topics
         */
        getTotalTopics() {
            if (!this.roadmap) return 15; // Default

            let count = 0;
            for (const level of this.roadmap.levels) {
                count += level.topics.length;
            }
            return count;
        },

        /**
         * Calculate learning streak
         */
        calculateStreak(progress) {
            const lastVisit = new Date(progress.lastVisit);
            const today = new Date();

            // Reset time to start of day for comparison
            lastVisit.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            const daysDiff = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                // Same day, keep streak
                return;
            } else if (daysDiff === 1) {
                // Consecutive day, increment streak
                progress.streak = (progress.streak || 0) + 1;
            } else {
                // Streak broken, reset to 1
                progress.streak = 1;
            }
        },

        /**
         * Get milestone message based on progress
         */
        getMilestoneMessage(percentage) {
            if (percentage >= 100) {
                return "🎉 Congratulations! You've mastered English grammar!";
            } else if (percentage >= 75) {
                return "🎯 Almost there! You've got this!";
            } else if (percentage >= 50) {
                return "💪 More than halfway there!";
            } else if (percentage >= 25) {
                return "🚀 You're making amazing progress!";
            } else if (percentage > 0) {
                return "🌱 Great start! Keep going!";
            }
            return "👋 Welcome! Start your learning journey!";
        },

        /**
         * Get streak message
         */
        getStreakMessage(streak) {
            if (streak >= 30) {
                return "🏆 30-day streak! You're unstoppable!";
            } else if (streak >= 7) {
                return "⭐ 1 week streak! Amazing dedication!";
            } else if (streak >= 3) {
                return "🔥 3-day streak! You're consistent!";
            } else if (streak >= 1) {
                return "👋 Welcome back!";
            }
            return "";
        },

        /**
         * Migrate old localStorage data (backward compatibility)
         */
        migrateOldData() {
            const oldCompleted = localStorage.getItem('completedTopics');
            if (!oldCompleted) return;

            try {
                const oldTopics = JSON.parse(oldCompleted);
                const progress = this.getProgress();

                // Merge old completed topics
                for (const topicId of oldTopics) {
                    if (!progress.completedTopics.includes(topicId)) {
                        progress.completedTopics.push(topicId);

                        // Create basic attempt data
                        if (!progress.topicAttempts[topicId]) {
                            progress.topicAttempts[topicId] = {
                                attempts: [{
                                    score: 7,
                                    percentage: 70,
                                    totalQuestions: 10,
                                    attemptedAt: new Date().toISOString(),
                                    passed: true
                                }],
                                bestScore: 70,
                                firstCompletedAt: new Date().toISOString(),
                                lastAttemptAt: new Date().toISOString()
                            };
                        }
                    }
                }

                this.saveProgress(progress);

                // Remove old key
                localStorage.removeItem('completedTopics');
                console.log('Migrated old progress data');
            } catch (error) {
                console.error('Failed to migrate old data:', error);
            }
        },

        /**
         * Reset all progress (for testing or user request)
         */
        resetProgress() {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem('completedTopics'); // Remove old key too
                window.location.reload();
            }
        },

        /**
         * Export progress data (for backup)
         */
        exportProgress() {
            const progress = this.getProgress();
            const dataStr = JSON.stringify(progress, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `grammar-progress-${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            URL.revokeObjectURL(url);
        }
    };

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.ProgressManager.init();
        });
    } else {
        window.ProgressManager.init();
    }

})();
