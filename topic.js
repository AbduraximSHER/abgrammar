/**
 * Topic Page Loader
 * Loads topic data from JSON and renders the universal template
 */

(function () {
    'use strict';

    // ===== TOPIC LOADER =====
    window.TopicLoader = {
        currentTopic: null,
        currentQuestionIndex: 0,
        userAnswers: [],

        /**
         * Load and render a topic
         */
        async loadTopic(topicId) {
            try {
                const response = await fetch(`data/topics/${topicId}.json`);
                if (!response.ok) {
                    throw new Error(`Topic not found: ${topicId}`);
                }

                const topicData = await response.json();
                this.currentTopic = topicData;
                this.renderTopic(topicData);

                // Update sidebar active state
                this.updateSidebarActive(topicId);

                // Scroll to top
                window.scrollTo(0, 0);

            } catch (error) {
                console.error('Error loading topic:', error);
                // Check if this is a CORS error from opening file directly
                if (window.location.protocol === 'file:') {
                    this.renderError('⚠️ You must use a local server (e.g., VS Code Live Server) to run this site. Opening files directly in the browser will not work.');
                } else {
                    this.renderError(error.message);
                }
            }
        },

        /**
         * Initialize quiz engine
         */
        initQuiz(topic) {
            console.log('[TopicLoader] initQuiz called for topic:', topic.id);

            // Quiz data is in topic.practice.questions
            const questions = topic.practice && topic.practice.questions;
            console.log('[TopicLoader] Questions found:', questions ? questions.length : 0);

            if (!window.QuizEngine) {
                console.error('[TopicLoader] QuizEngine not found on window!');
                return;
            }

            if (!questions || questions.length === 0) {
                console.log('[TopicLoader] No quiz data found for topic:', topic.id);
                return;
            }

            const quizContainer = document.getElementById('quiz-container');
            console.log('[TopicLoader] Quiz container found:', !!quizContainer);

            if (!quizContainer) {
                console.error('[TopicLoader] Quiz container not found');
                return;
            }

            console.log('[TopicLoader] Creating QuizEngine with', questions.length, 'questions');

            // QuizEngine expects: new QuizEngine(questions, options) then .init(containerId)
            const quiz = new QuizEngine(questions, {
                onComplete: (results) => {
                    this.handleQuizCompletion(topic, results);
                }
            });

            console.log('[TopicLoader] QuizEngine created, calling init()');
            quiz.init('quiz-container');
            console.log('[TopicLoader] Quiz initialization complete');
        },

        /**
         * Handle quiz completion
         */
        handleQuizCompletion(topic, results) {
            // QuizEngine passes: { score, total, percentage, passed }
            const score = results.score;
            const totalQuestions = results.total;
            const percentage = results.percentage;
            const passed = results.passed;

            // Save progress if ProgressManager is available
            if (window.ProgressManager) {
                const topicData = window.ProgressManager.markTopicComplete(
                    topic.id,
                    score,
                    totalQuestions
                );

                // Update roadmap UI
                if (window.RoadmapLoader) {
                    window.RoadmapLoader.updateProgress();
                }

                // Show celebration if passed
                if (passed) {
                    this.showCelebration(topic, percentage, topicData);
                }
            }
        },

        /**
         * Show celebration modal with confetti
         */
        showCelebration(topic, percentage, topicData) {
            // Create confetti
            this.createConfetti();

            // Create celebration modal
            const modal = document.createElement('div');
            modal.className = 'celebration-modal';

            const isFirstTime = topicData.attempts.length === 1;
            const isBestScore = percentage === topicData.bestScore;

            let message = '';
            if (isFirstTime) {
                message = `🎉 Congratulations! You've completed ${topic.title}!`;
            } else if (isBestScore && topicData.attempts.length > 1) {
                message = `🌟 New Best Score! You're improving!`;
            } else {
                message = `✅ Great work! Keep practicing!`;
            }

            const stats = window.ProgressManager.getStats();
            const milestoneMessage = window.ProgressManager.getMilestoneMessage(stats.percentage);

            modal.innerHTML = `
                <h2>${message}</h2>
                <div class="celebration-score">${percentage}%</div>
                <p>${milestoneMessage}</p>
                <div class="celebration-actions">
                    <button class="celebration-btn primary" onclick="this.closest('.celebration-modal').remove()">
                        Continue Learning →
                    </button>
                    <button class="celebration-btn secondary" onclick="location.reload()">
                        🔄 Retake Quiz
                    </button>
                </div>
            `;

            document.body.appendChild(modal);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.remove();
                }
            }, 10000);
        },

        /**
         * Create confetti animation
         */
        createConfetti() {
            const container = document.createElement('div');
            container.className = 'confetti-container';
            document.body.appendChild(container);

            // Create 50 confetti pieces
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                container.appendChild(confetti);
            }

            // Remove container after animation
            setTimeout(() => {
                container.remove();
            }, 3500);
        },

        /**
         * Render the complete topic page
         */
        renderTopic(topic) {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) return;

            mainContent.innerHTML = `
                <div class="topic-page">
                    ${this.renderBreadcrumb(topic)}
                    ${this.renderHeader(topic)}
                    ${this.renderIntro(topic)}
                    ${this.renderWhenToUse(topic)}
                    ${this.renderForms(topic)}
                    ${this.renderAdverbs(topic)}
                    ${this.renderMistakes(topic)}
                    ${this.renderPractice(topic)}
                    ${this.renderFooter(topic)}
                </div>
            `;

            // Initialize quiz with progress tracking
            setTimeout(() => {
                this.initQuiz(topic);
            }, 100);
        },

        /**
         * Render breadcrumb navigation
         */
        renderBreadcrumb(topic) {
            const levelNames = {
                'basics': 'Level 1: Basics',
                'core': 'Level 2: Core',
                'advanced': 'Level 3: Advanced'
            };

            return `
                <nav class="breadcrumb">
                    <a href="#/">Home</a>
                    <span class="breadcrumb-separator">›</span>
                    <a href="#/roadmap">Grammar Roadmap</a>
                    <span class="breadcrumb-separator">›</span>
                    <a href="#/roadmap/${topic.level}">${levelNames[topic.level] || topic.level}</a>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">${topic.title}</span>
                </nav>
            `;
        },

        /**
         * Render topic header
         */
        renderHeader(topic) {
            return `
                <header class="topic-header">
                    <h1 class="topic-title">${topic.title}</h1>
                    <p class="topic-goal">${topic.summary}</p>
                    <div class="topic-meta">
                        <span class="meta-item">
                            <span>⏱️</span>
                            <span>${topic.estimated_time || '15 min'}</span>
                        </span>
                        <span class="meta-item">
                            <span>📘</span>
                            <span>${topic.level}</span>
                        </span>
                    </div>
                </header>
            `;
        },

        /**
         * Render example-first introduction
         */
        renderIntro(topic) {
            if (!topic.examples || topic.examples.length === 0) return '';

            const firstExample = topic.examples[0];

            return `
                <section class="intro-section">
                    <div class="intro-example">${firstExample.sentence}</div>
                    <div class="intro-explanation">
                        <strong>Translation:</strong> ${firstExample.translation_uz}<br>
                        ${firstExample.note ? `<em>${firstExample.note}</em>` : ''}
                    </div>
                </section>
            `;
        },

        /**
         * Render grammar rule
         */
        renderRule(topic) {
            if (!topic.rule) return '';

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">📐</span>
                        <span>The Rule</span>
                    </h2>
                    <div class="rule-card">
                        <span class="rule-label">Grammar Rule</span>
                        <p class="rule-text">${topic.rule.text}</p>
                        ${topic.rule.visual ? `<div class="rule-formula">${topic.rule.visual}</div>` : ''}
                    </div>
                </section>
            `;
        },

        /**
         * Render examples
         */
        renderExamples(topic) {
            if (!topic.examples || topic.examples.length === 0) return '';

            const examplesHtml = topic.examples.map(example => `
                <div class="example-card">
                    <div class="example-sentence">${example.sentence}</div>
                    <div class="example-translation">${example.translation_uz}</div>
                    ${example.note ? `<div class="example-note">💡 ${example.note}</div>` : ''}
                </div>
            `).join('');

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">✅</span>
                        <span>Examples</span>
                    </h2>
                    <div class="examples-grid">
                        ${examplesHtml}
                    </div>
                </section>
            `;
        },

        /**
         * Render common mistakes
         */
        renderMistakes(topic) {
            if (!topic.common_mistakes || topic.common_mistakes.length === 0) return '';

            const mistakesHtml = topic.common_mistakes.map(mistake => `
                <div class="mistake-card">
                    <div class="mistake-comparison">
                        <div class="mistake-wrong">
                            <div class="mistake-wrong-label">❌ Wrong</div>
                            <div class="mistake-wrong-text">${mistake.wrong}</div>
                        </div>
                        <div class="mistake-arrow">→</div>
                        <div class="mistake-right">
                            <div class="mistake-right-label">✅ Right</div>
                            <div class="mistake-right-text">${mistake.right}</div>
                        </div>
                    </div>
                    <div class="mistake-explanation">${mistake.explanation}</div>
                </div>
            `).join('');

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">⚠️</span>
                        <span>Common Mistakes</span>
                    </h2>
                    <div class="mistakes-grid">
                        ${mistakesHtml}
                    </div>
                </section>
            `;
        },

        /**
         * Render "When to Use" section
         */
        renderWhenToUse(topic) {
            if (!topic.when_to_use || topic.when_to_use.length === 0) return '';

            const useCasesHtml = topic.when_to_use.map(useCase => `
                <div class="use-case-card">
                    <h3 class="use-case-title">${useCase.title}</h3>
                    <p class="use-case-explanation">${useCase.explanation}</p>
                    <ul class="use-case-examples">
                        ${useCase.examples.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">💡</span>
                        <span>When to Use</span>
                    </h2>
                    <div class="use-cases-grid">
                        ${useCasesHtml}
                    </div>
                </section>
            `;
        },

        /**
         * Render all forms (affirmative, negative, questions)
         */
        renderForms(topic) {
            if (!topic.forms) return '';

            let formsHtml = '';

            if (topic.forms.affirmative) {
                formsHtml += this.renderFormSection(topic.forms.affirmative);
            }

            if (topic.forms.negative) {
                formsHtml += this.renderFormSection(topic.forms.negative);
            }

            if (topic.forms.question) {
                formsHtml += this.renderFormSection(topic.forms.question);
            }

            return formsHtml;
        },

        /**
         * Render a single form section
         */
        renderFormSection(form) {
            const examplesHtml = form.examples.map(example => `
                <div class="example-card">
                    <div class="example-sentence">${example.sentence}</div>
                    <div class="example-translation">${example.translation_uz}</div>
                    ${example.note ? `<div class="example-note">💡 ${example.note}</div>` : ''}
                </div>
            `).join('');

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">${form.title.substring(0, 2)}</span>
                        <span>${form.title.substring(3)}</span>
                    </h2>
                    <div class="rule-card">
                        <span class="rule-label">Rule</span>
                        <p class="rule-text">${form.rule}</p>
                        ${form.visual ? `<div class="rule-formula">${form.visual}</div>` : ''}
                    </div>
                    <div class="examples-grid">
                        ${examplesHtml}
                    </div>
                </section>
            `;
        },

        /**
         * Render adverbs of frequency section
         */
        renderAdverbs(topic) {
            if (!topic.adverbs_of_frequency) return '';

            const adverbs = topic.adverbs_of_frequency;
            const adverbsHtml = adverbs.list.map(adv => `
                <div class="adverb-card">
                    <div class="adverb-header">
                        <span class="adverb-word">${adv.adverb}</span>
                        <span class="adverb-percentage">${adv.percentage}</span>
                    </div>
                    <div class="adverb-example">${adv.example}</div>
                    <div class="adverb-translation">${adv.translation_uz}</div>
                </div>
            `).join('');

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">⏰</span>
                        <span>${adverbs.title}</span>
                    </h2>
                    <div class="adverbs-intro">
                        <p>${adverbs.explanation}</p>
                        <div class="adverbs-position">
                            <strong>Position:</strong> ${adverbs.position}
                        </div>
                    </div>
                    <div class="adverbs-grid">
                        ${adverbsHtml}
                    </div>
                    ${adverbs.special_note ? `
                        <div class="adverbs-note">
                            <strong>⚠️ Special Note:</strong> ${adverbs.special_note}
                        </div>
                    ` : ''}
                </section>
            `;
        },

        /**
         * Render practice section
         */
        renderPractice(topic) {
            if (!topic.practice || !topic.practice.questions) return '';

            return `
                <section>
                    <h2 class="section-header">
                        <span class="section-icon">✍️</span>
                        <span>Quick Practice</span>
                    </h2>
                    <div id="quiz-container"></div>
                </section>
            `;
        },

        /**
         * Render footer with navigation
         */
        renderFooter(topic) {
            return `
        < footer class="topic-footer" >
            <div class="completion-status">
                <div class="completion-icon">🎯</div>
                <div class="completion-text">
                    <h3>Great work!</h3>
                    <p>Complete the practice to mark this topic as done</p>
                </div>
            </div>
                    ${topic.next_topic ? `
                        <a href="#/topic/${topic.next_topic}" class="next-topic-link">
                            <span>Next Topic</span>
                            <span>→</span>
                        </a>
                    ` : ''
                }
                </footer >
        `;
        },

        /**
         * Initialize practice quiz
         */
        initializePractice() {
            if (!this.currentTopic.practice || !this.currentTopic.practice.questions) return;

            this.currentQuestionIndex = 0;
            this.userAnswers = [];
            this.renderQuestion();

            // Event listeners
            const checkBtn = document.getElementById('check-answer');
            const nextBtn = document.getElementById('next-question');

            if (checkBtn) {
                checkBtn.addEventListener('click', () => this.checkAnswer());
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextQuestion());
            }
        },

        /**
         * Render current question
         */
        renderQuestion() {
            const container = document.getElementById('practice-container');
            if (!container) return;

            const questions = this.currentTopic.practice.questions;
            const question = questions[this.currentQuestionIndex];

            const optionsHtml = question.options.map((option, index) => `
        < button class="option-button" data - index="${index}" >
            ${option}
                </button >
        `).join('');

            container.innerHTML = `
        < div class="practice-question" >
                    <div class="question-number">Question ${this.currentQuestionIndex + 1} of ${questions.length}</div>
                    <div class="question-text">${question.question}</div>
                    <div class="question-options">
                        ${optionsHtml}
                    </div>
                    <div id="question-feedback"></div>
                </div >
        `;

            // Add click handlers to options
            const optionButtons = container.querySelectorAll('.option-button');
            optionButtons.forEach(btn => {
                btn.addEventListener('click', () => this.selectOption(btn));
            });
        },

        /**
         * Handle option selection
         */
        selectOption(button) {
            const container = document.getElementById('practice-container');
            const allButtons = container.querySelectorAll('.option-button');

            allButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');

            // Enable check button
            const checkBtn = document.getElementById('check-answer');
            if (checkBtn) checkBtn.disabled = false;
        },

        /**
         * Check the selected answer
         */
        checkAnswer() {
            const container = document.getElementById('practice-container');
            const selectedBtn = container.querySelector('.option-button.selected');

            if (!selectedBtn) return;

            const selectedIndex = parseInt(selectedBtn.getAttribute('data-index'));
            const question = this.currentTopic.practice.questions[this.currentQuestionIndex];
            const isCorrect = selectedIndex === question.correct;

            // Store answer
            this.userAnswers.push(isCorrect);

            // Show feedback
            const allButtons = container.querySelectorAll('.option-button');
            allButtons.forEach((btn, index) => {
                btn.disabled = true;
                if (index === question.correct) {
                    btn.classList.add('correct');
                } else if (index === selectedIndex && !isCorrect) {
                    btn.classList.add('incorrect');
                }
            });

            const feedbackDiv = document.getElementById('question-feedback');
            feedbackDiv.className = `question - feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'} `;
            feedbackDiv.innerHTML = `
        < strong > ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</strong > <br>
            ${question.explanation}
            `;

            // Update score
            this.updateScore();

            // Show next button or finish
            const checkBtn = document.getElementById('check-answer');
            const nextBtn = document.getElementById('next-question');

            checkBtn.style.display = 'none';

            if (this.currentQuestionIndex < this.currentTopic.practice.questions.length - 1) {
                nextBtn.style.display = 'block';
            } else {
                this.finishPractice();
            }
        },

        /**
         * Move to next question
         */
        nextQuestion() {
            this.currentQuestionIndex++;
            this.renderQuestion();

            const checkBtn = document.getElementById('check-answer');
            const nextBtn = document.getElementById('next-question');

            checkBtn.style.display = 'block';
            checkBtn.disabled = true;
            nextBtn.style.display = 'none';
        },

        /**
         * Update practice score
         */
        updateScore() {
            const scoreEl = document.getElementById('practice-score');
            if (scoreEl) {
                const correct = this.userAnswers.filter(a => a).length;
                const total = this.currentTopic.practice.questions.length;
                scoreEl.textContent = `${correct}/${total}`;
            }
        },

        /**
         * Finish practice and mark topic complete
         */
        finishPractice() {
            const correct = this.userAnswers.filter(a => a).length;
            const total = this.currentTopic.practice.questions.length;
            const percentage = Math.round((correct / total) * 100);

            // Mark topic as complete if score >= 70%
            if (percentage >= 70) {
                this.markTopicComplete(this.currentTopic.id);
            }

            // Show completion message
            const nextBtn = document.getElementById('next-question');
            nextBtn.textContent = percentage >= 70 ? '🎉 Practice Complete!' : '🔄 Try Again';
            nextBtn.style.display = 'block';

            if (percentage >= 70) {
                nextBtn.onclick = () => {
                    if (this.currentTopic.next_topic) {
                        window.location.hash = `#/topic/${this.currentTopic.next_topic}`;
                    }
                };
            } else {
                nextBtn.onclick = () => {
                    this.currentQuestionIndex = 0;
                    this.userAnswers = [];
                    this.renderQuestion();
                    document.getElementById('check-answer').style.display = 'block';
                    nextBtn.style.display = 'none';
                };
            }
        },

        /**
         * Mark topic as complete
         */
        markTopicComplete(topicId) {
            let completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '[]');
            if (!completedTopics.includes(topicId)) {
                completedTopics.push(topicId);
                localStorage.setItem('completedTopics', JSON.stringify(completedTopics));

                // Update UI
                this.updateCompletionUI(topicId);

                // Update progress
                if (window.updateLayoutProgress) {
                    window.updateLayoutProgress();
                }
            }
        },

        /**
         * Update completion UI
         */
        updateCompletionUI(topicId) {
            const topicLink = document.querySelector(`.topic-link[href="#/topic/${topicId}"]`);
            if (topicLink) {
                const statusIcon = topicLink.querySelector('.topic-status');
                if (statusIcon) {
                    statusIcon.textContent = '✓';
                    statusIcon.classList.remove('incomplete');
                    statusIcon.classList.add('complete');
                }
            }
        },

        /**
         * Update sidebar active state
         */
        updateSidebarActive(topicId) {
            const allLinks = document.querySelectorAll('.topic-link');
            allLinks.forEach(link => {
                if (link.getAttribute('href') === `#/topic/${topicId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        },

        /**
         * Render error message
         */
        renderError(message) {
            const mainContent = document.getElementById('main-content');
            if (!mainContent) return;

            mainContent.innerHTML = `
            <div class="topic-page">
                <div style="text-align: center; padding: 4rem 2rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 1rem;">😕</h1>
                    <h2>Topic Not Found</h2>
                    <p style="color: var(--text-muted); margin: 1rem 0 2rem 0;">${message}</p>
                    <a href="#/" class="cta-button">Go Home</a>
                </div>
            </div>
            `;
        }
    };

    // Load completed topics on page load
    const completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '[]');
    completedTopics.forEach(topicId => {
        if (window.TopicLoader) {
            window.TopicLoader.updateCompletionUI(topicId);
        }
    });

})();
