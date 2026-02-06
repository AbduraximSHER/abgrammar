/**
 * Reusable Quiz Engine
 * Supports multiple choice and fill-in-the-blank questions
 * Provides instant feedback with explanations
 */

(function () {
    'use strict';

    class QuizEngine {
        constructor(questions, options = {}) {
            this.questions = questions;
            this.currentIndex = 0;
            this.userAnswers = [];
            this.score = 0;

            // Options
            this.passThreshold = options.passThreshold || 70;
            this.showExplanations = options.showExplanations !== false;
            this.allowRetry = options.allowRetry !== false;
            this.onComplete = options.onComplete || null;

            // State
            this.isComplete = false;
            this.container = null;
        }

        /**
         * Initialize quiz in a container
         */
        init(containerId) {
            this.container = document.getElementById(containerId);
            if (!this.container) {
                console.error(`Container ${containerId} not found`);
                return;
            }

            this.render();
        }

        /**
         * Render current question
         */
        render() {
            if (!this.container) return;

            const question = this.questions[this.currentIndex];
            const questionNumber = this.currentIndex + 1;
            const totalQuestions = this.questions.length;

            this.container.innerHTML = `
                <div class="quiz-question">
                    <div class="quiz-progress">
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${(questionNumber / totalQuestions) * 100}%"></div>
                        </div>
                        <div class="quiz-progress-text">Question ${questionNumber} of ${totalQuestions}</div>
                    </div>
                    
                    <div class="quiz-question-content">
                        ${this.renderQuestion(question)}
                    </div>
                    
                    <div id="quiz-feedback" class="quiz-feedback"></div>
                    
                    <div class="quiz-actions">
                        ${this.renderActions()}
                    </div>
                </div>
            `;

            this.attachEventListeners();
        }

        /**
         * Render question based on type
         */
        renderQuestion(question) {
            switch (question.type) {
                case 'fill-blank':
                    return this.renderFillBlank(question);
                case 'multiple-choice':
                default:
                    return this.renderMultipleChoice(question);
            }
        }

        /**
         * Render multiple choice question
         */
        renderMultipleChoice(question) {
            const optionsHtml = question.options.map((option, index) => `
                <button class="quiz-option" data-index="${index}">
                    <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${option}</span>
                </button>
            `).join('');

            return `
                <h3 class="quiz-question-text">${question.question}</h3>
                ${question.hint ? `<p class="quiz-hint">💡 ${question.hint}</p>` : ''}
                <div class="quiz-options">
                    ${optionsHtml}
                </div>
            `;
        }

        /**
         * Render fill-in-the-blank question
         */
        renderFillBlank(question) {
            return `
                <h3 class="quiz-question-text">${question.question}</h3>
                ${question.hint ? `<p class="quiz-hint">💡 ${question.hint}</p>` : ''}
                <div class="quiz-fill-blank">
                    <input 
                        type="text" 
                        class="quiz-input" 
                        id="quiz-answer-input"
                        placeholder="Type your answer..."
                        autocomplete="off"
                    >
                </div>
            `;
        }

        /**
         * Render action buttons
         */
        renderActions() {
            const isAnswered = this.userAnswers[this.currentIndex] !== undefined;
            const isLastQuestion = this.currentIndex === this.questions.length - 1;

            if (!isAnswered) {
                return `
                    <button class="quiz-btn quiz-btn-primary" id="quiz-check-btn" disabled>
                        Check Answer
                    </button>
                `;
            } else {
                if (isLastQuestion) {
                    return `
                        <button class="quiz-btn quiz-btn-success" id="quiz-finish-btn">
                            See Results
                        </button>
                    `;
                } else {
                    return `
                        <button class="quiz-btn quiz-btn-primary" id="quiz-next-btn">
                            Next Question →
                        </button>
                    `;
                }
            }
        }

        /**
         * Attach event listeners
         */
        attachEventListeners() {
            const question = this.questions[this.currentIndex];

            if (question.type === 'fill-blank') {
                const input = document.getElementById('quiz-answer-input');
                if (input) {
                    input.addEventListener('input', () => this.onInputChange());
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') this.checkAnswer();
                    });
                    input.focus();
                }
            } else {
                const options = this.container.querySelectorAll('.quiz-option');
                options.forEach(option => {
                    option.addEventListener('click', () => this.selectOption(option));
                });
            }

            const checkBtn = document.getElementById('quiz-check-btn');
            if (checkBtn) {
                checkBtn.addEventListener('click', () => this.checkAnswer());
            }

            const nextBtn = document.getElementById('quiz-next-btn');
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.nextQuestion());
            }

            const finishBtn = document.getElementById('quiz-finish-btn');
            if (finishBtn) {
                finishBtn.addEventListener('click', () => this.finish());
            }
        }

        /**
         * Handle input change for fill-blank
         */
        onInputChange() {
            const input = document.getElementById('quiz-answer-input');
            const checkBtn = document.getElementById('quiz-check-btn');

            if (input && checkBtn) {
                checkBtn.disabled = input.value.trim().length === 0;
            }
        }

        /**
         * Handle option selection
         */
        selectOption(button) {
            // Remove previous selection
            const options = this.container.querySelectorAll('.quiz-option');
            options.forEach(opt => opt.classList.remove('selected'));

            // Select new option
            button.classList.add('selected');

            // Enable check button
            const checkBtn = document.getElementById('quiz-check-btn');
            if (checkBtn) checkBtn.disabled = false;
        }

        /**
         * Check the answer
         */
        checkAnswer() {
            const question = this.questions[this.currentIndex];
            let userAnswer;
            let isCorrect;

            if (question.type === 'fill-blank') {
                const input = document.getElementById('quiz-answer-input');
                userAnswer = input.value.trim().toLowerCase();

                // Check against all acceptable answers
                const acceptableAnswers = Array.isArray(question.correct)
                    ? question.correct
                    : [question.correct];

                isCorrect = acceptableAnswers.some(ans =>
                    ans.toLowerCase() === userAnswer
                );

                // Disable input
                input.disabled = true;

            } else {
                const selectedOption = this.container.querySelector('.quiz-option.selected');
                if (!selectedOption) return;

                userAnswer = parseInt(selectedOption.getAttribute('data-index'));
                isCorrect = userAnswer === question.correct;

                // Disable all options
                const options = this.container.querySelectorAll('.quiz-option');
                options.forEach((opt, index) => {
                    opt.disabled = true;
                    if (index === question.correct) {
                        opt.classList.add('correct');
                    } else if (index === userAnswer && !isCorrect) {
                        opt.classList.add('incorrect');
                    }
                });
            }

            // Store answer
            this.userAnswers[this.currentIndex] = {
                answer: userAnswer,
                correct: isCorrect
            };

            if (isCorrect) this.score++;

            // Show feedback
            this.showFeedback(isCorrect, question);

            // Update actions
            const actionsDiv = this.container.querySelector('.quiz-actions');
            if (actionsDiv) {
                actionsDiv.innerHTML = this.renderActions();
                this.attachEventListeners();
            }
        }

        /**
         * Show feedback
         */
        showFeedback(isCorrect, question) {
            const feedbackDiv = document.getElementById('quiz-feedback');
            if (!feedbackDiv) return;

            const encouragement = isCorrect
                ? this.getPositiveFeedback()
                : this.getEncouragingFeedback();

            feedbackDiv.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            feedbackDiv.innerHTML = `
                <div class="feedback-icon">${isCorrect ? '✅' : '💡'}</div>
                <div class="feedback-content">
                    <div class="feedback-title">${encouragement}</div>
                    ${this.showExplanations ? `<div class="feedback-explanation">${question.explanation}</div>` : ''}
                </div>
            `;

            feedbackDiv.style.display = 'flex';
        }

        /**
         * Get positive feedback message
         */
        getPositiveFeedback() {
            const messages = [
                'Excellent!',
                'Perfect!',
                'Well done!',
                'Great job!',
                'Correct!',
                'You got it!',
                'Brilliant!',
                'Fantastic!'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }

        /**
         * Get encouraging feedback message
         */
        getEncouragingFeedback() {
            const messages = [
                'Not quite, but you\'re learning!',
                'Good try! Here\'s why:',
                'Almost there! Let\'s see:',
                'Keep going! Here\'s the key:',
                'Learning moment!',
                'Good effort! Here\'s the answer:'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }

        /**
         * Move to next question
         */
        nextQuestion() {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++;
                this.render();
            }
        }

        /**
         * Finish quiz and show results
         */
        finish() {
            this.isComplete = true;
            const percentage = Math.round((this.score / this.questions.length) * 100);
            const passed = percentage >= this.passThreshold;

            this.container.innerHTML = `
                <div class="quiz-results">
                    <div class="results-icon">${passed ? '🎉' : '📚'}</div>
                    <h2 class="results-title">${passed ? 'Congratulations!' : 'Keep Practicing!'}</h2>
                    <div class="results-score">
                        <div class="score-circle">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="none"/>
                                <circle cx="60" cy="60" r="50" stroke="${passed ? '#10b981' : '#facc15'}" stroke-width="8" fill="none" 
                                        stroke-dasharray="314" stroke-dashoffset="${314 - (percentage / 100) * 314}" 
                                        transform="rotate(-90 60 60)" class="score-ring"/>
                            </svg>
                            <div class="score-text">${percentage}%</div>
                        </div>
                        <p class="score-detail">${this.score} out of ${this.questions.length} correct</p>
                    </div>
                    
                    <div class="results-message">
                        ${this.getResultsMessage(passed, percentage)}
                    </div>
                    
                    <div class="results-actions">
                        ${this.allowRetry && !passed ? `
                            <button class="quiz-btn quiz-btn-secondary" id="quiz-retry-btn">
                                🔄 Try Again
                            </button>
                        ` : ''}
                        ${passed ? `
                            <button class="quiz-btn quiz-btn-success" id="quiz-continue-btn">
                                Continue Learning →
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Attach retry button
            const retryBtn = document.getElementById('quiz-retry-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => this.retry());
            }

            // Call completion callback
            if (this.onComplete) {
                this.onComplete({
                    score: this.score,
                    total: this.questions.length,
                    percentage: percentage,
                    passed: passed
                });
            }
        }

        /**
         * Get results message
         */
        getResultsMessage(passed, percentage) {
            if (percentage === 100) {
                return '<p>Perfect score! You\'ve mastered this topic! 🌟</p>';
            } else if (passed) {
                return '<p>Great work! You\'ve demonstrated a solid understanding of this topic.</p>';
            } else {
                return `<p>You need ${this.passThreshold}% to pass. Review the material and try again!</p>`;
            }
        }

        /**
         * Retry quiz
         */
        retry() {
            this.currentIndex = 0;
            this.userAnswers = [];
            this.score = 0;
            this.isComplete = false;
            this.render();
        }

        /**
         * Get current progress
         */
        getProgress() {
            return {
                currentQuestion: this.currentIndex + 1,
                totalQuestions: this.questions.length,
                score: this.score,
                percentage: Math.round((this.score / this.questions.length) * 100)
            };
        }
    }

    // Export to global scope
    window.QuizEngine = QuizEngine;

})();
