// --- REFINED TRANSLATION SYSTEM ---
let dictEnabled = localStorage.getItem('dict_enabled') === 'true';

// Toggle Dictionary Mode
function toggleDict() {
    const toggle = document.getElementById('dict-toggle');
    if (!toggle) return;
    dictEnabled = toggle.checked;
    window.DICTIONARY_MODE_ON = dictEnabled; // Sync with unified logic
    localStorage.setItem('dict_enabled', dictEnabled);
    showToast(`Dictionary Mode: ${dictEnabled ? 'ON' : 'OFF'}`, 'info');
}

// Initialize Toggle State
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('dict-toggle');
    if (toggle) {
        toggle.checked = dictEnabled;
        window.DICTIONARY_MODE_ON = dictEnabled;
    }
});

// Legacy wrapWords (stubs) to prevent breakage in existing rendering calls
function wrapWords(html) { return html; }


// Legacy wrapWords (stubs) to prevent breakage in existing rendering calls
function wrapWords(html) { return html; }

// Utility: Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    // Auto-remove after 4s
    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);

    toast.onclick = () => toast.remove();
}

// Progression Manager Logic
class ProgressionManager {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('tense_master_progress')) || {
            xp: 0,
            level: 1,
            streak: 0,
            lastLogin: null,
            badges: [],
            completedLessons: []
        };
        this.initStreak();
    }

    save() {
        localStorage.setItem('tense_master_progress', JSON.stringify(this.data));
        this.updateUI();
    }

    addXP(amount) {
        this.data.xp += amount;
        const newLevel = Math.floor(this.data.xp / 250) + 1;
        if (newLevel > this.data.level) {
            this.data.level = newLevel;
            this.handleLevelUp();
        }
        this.save();
    }

    completeLesson(lessonId) {
        if (!this.data.completedLessons.includes(lessonId)) {
            this.data.completedLessons.push(lessonId);
            this.addXP(20);
            this.checkBadges();
            this.save();
        }
    }

    initStreak() {
        const today = new Date().toDateString();
        const last = this.data.lastLogin;

        if (last === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (last === yesterday.toDateString()) {
            this.data.streak++;
        } else if (last !== null) {
            this.data.streak = 1;
        } else {
            this.data.streak = 1;
            this.addXP(2); // First login bonus
        }

        this.data.lastLogin = today;
        this.save();
    }

    checkBadges() {
        const badgeCriteria = [
            { id: 'tense_master', label: 'Tense Master', check: () => this.data.completedLessons.length >= 12 },
            { id: 'aspect_analyst', label: 'Aspect Analyst', check: () => this.data.completedLessons.some(l => l.includes('matrix')) },
            { id: 'detective_pro', label: 'Detective Pro', check: () => this.data.xp >= 500 },
            { id: 'quiz_whiz', label: 'Quiz Whiz', check: () => this.data.completedLessons.filter(l => l.startsWith('quiz-')).length >= 5 },
            { id: 'streak_star', label: 'Streak Star', check: () => this.data.streak >= 3 },
            { id: 'mastery_novice', label: 'Mastery Initiate', check: () => this.data.completedLessons.some(l => l.startsWith('mixed-mastery')) },
            { id: 'mastery_elite', label: 'Mastered Elite', check: () => this.data.completedLessons.filter(l => l.startsWith('mixed-mastery')).length >= 5 },
            { id: 'reading_scholar', label: 'Context Scholar', check: () => this.data.completedLessons.filter(l => l.startsWith('reading-')).length >= 3 },
            { id: 'endurance_hero', label: 'Endurance Hero', check: () => this.data.completedLessons.some(l => l.includes('random-30')) },
            { id: 'present_expert', label: 'Present Expert', check: () => ['mixed-mastery-present-tenses-1', 'mixed-mastery-present-tenses-2', 'mixed-mastery-present-tenses-3'].every(id => this.data.completedLessons.includes(id)) },
            { id: 'detective_legend', label: 'Case Closed', check: () => this.data.completedLessons.filter(l => l.startsWith('detective-')).length >= 3 },
            { id: 'xp_titan', label: 'XP Titan', check: () => this.data.xp >= 2500 }
        ];

        badgeCriteria.forEach(b => {
            if (b.check() && !this.data.badges.includes(b.id)) {
                this.data.badges.push(b.id);
                this.handleBadgeUnlock(b.label);
                this.save();
            }
        });
    }

    handleLevelUp() {
        showToast(`🎉 LEVEL UP! You are now Level ${this.data.level}`, 'level-up');
    }

    handleBadgeUnlock(label) {
        showToast(`🏆 NEW BADGE: ${label}`, 'badge-unlock');
    }

    openBadgesModal() {
        this.renderBadges();
        document.getElementById('badges-modal').classList.remove('hidden');
    }

    closeBadgesModal() {
        document.getElementById('badges-modal').classList.add('hidden');
    }

    renderBadges() {
        const grid = document.getElementById('badges-grid');
        const badgeList = [
            { id: 'tense_master', label: 'Tense Architect', icon: '🎓', desc: 'Build your foundation: 12 lessons complete!' },
            { id: 'aspect_analyst', label: 'Aspect Visionary', icon: '🔍', desc: 'Unlock the secrets: Explore the Matrix!' },
            { id: 'detective_pro', label: 'Sherlock of Verbs', icon: '🕵️', desc: 'Case Solved: 500 XP Milestone reached!' },
            { id: 'quiz_whiz', label: 'Quiz Dynamo', icon: '⚡', desc: 'Unstoppable: 5 Quizzes conquered!' },
            { id: 'streak_star', label: 'Rising Phoenix', icon: '🔥', desc: 'Consistency is Power: 3-day Streak!' },
            { id: 'mastery_novice', label: 'Mastery Initiate', icon: '🥇', desc: 'First Step to Greatness: Finish a Mastery Test!' },
            { id: 'mastery_elite', label: 'Titan of Tenses', icon: '🎖️', desc: 'Legendary Status: 5 Mastery Tests cleared!' },
            { id: 'reading_scholar', label: 'Story Sovereign', icon: '📖', desc: 'Master of Context: 3 Stories solved!' },
            { id: 'endurance_hero', label: 'Endurance Legend', icon: '🔋', desc: 'Limit Breaker: Random 30 Challenge won!' },
            { id: 'present_expert', label: 'Present Overlord', icon: '⚛️', desc: 'Temporal Master: 104 Present questions cleared!' },
            { id: 'detective_legend', label: 'Justice Bringer', icon: '⚖️', desc: 'No Mystery Left: All Cases closed!' },
            { id: 'xp_titan', label: 'Ethereal Titan', icon: '💎', desc: 'Peak Performance: 2,500 XP achieved!' }
        ];

        grid.innerHTML = badgeList.map(b => {
            const isUnlocked = this.data.badges.includes(b.id);
            return `
                <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}" title="${b.desc}">
                    <div class="badge-icon">${isUnlocked ? b.icon : '🔒'}</div>
                    <div class="badge-label">${b.label}</div>
                    <div style="font-size: 0.65rem; opacity: 0.7; margin-top: 4px;">${b.desc}</div>
                </div>
            `;
        }).join('');
    }

    updateUI() {
        const xpBarFill = document.getElementById('xp-bar-fill');
        const levelText = document.getElementById('level-count');
        const streakText = document.getElementById('streak-count');

        if (xpBarFill) {
            const progress = (this.data.xp % 250) / 2.5; // Scale to 100%
            xpBarFill.style.width = `${progress}%`;
        }
        if (levelText) levelText.innerText = `Level ${this.data.level}`;
        if (streakText) streakText.innerText = `🔥 ${this.data.streak} day streak`;

        this.data.completedLessons.forEach(id => {
            const el = document.querySelector(`[data-lesson-id="${id}"] .checkmark`);
            if (el) el.classList.remove('hidden');
        });

        this.checkBadges();
    }
}

const progression = new ProgressionManager();

const slider = document.getElementById('time-slider');
const sentenceDisplay = document.getElementById('dynamic-sentence');
const timeLabel = document.getElementById('time-label');
const body = document.body;

// Verb Database
// Verb Database (12 Tenses)
const VERB_DATA = {
    eat: {
        simple: {
            past: 'I <span class="highlight xray-verb">ate</span> an apple <span class="xray-trigger">yesterday</span>.',
            present: 'I <span class="highlight xray-verb">eat</span> an apple <span class="xray-trigger">every day</span>.',
            future: 'I <span class="xray-aux">will</span> <span class="highlight xray-verb">eat</span> an apple <span class="xray-trigger">tomorrow</span>.'
        },
        continuous: {
            past: 'I <span class="xray-aux">was</span> <span class="highlight xray-verb">eating</span> an apple.',
            present: 'I <span class="xray-aux">am</span> <span class="highlight xray-verb">eating</span> an apple <span class="xray-trigger">now</span>.',
            future: 'I <span class="xray-aux">will be</span> <span class="highlight xray-verb">eating</span> an apple <span class="xray-trigger">at 5 pm</span>.'
        },
        perfect: {
            past: 'I <span class="xray-aux">had</span> <span class="highlight xray-verb">eaten</span> the apple.',
            present: 'I <span class="xray-aux">have</span> <span class="highlight xray-verb">eaten</span> the apple.',
            future: 'I <span class="xray-aux">will have</span> <span class="highlight xray-verb">eaten</span> the apple <span class="xray-trigger">by lunch</span>.'
        },
        'perfect-continuous': {
            past: 'I <span class="xray-aux">had been</span> <span class="highlight xray-verb">eating</span> for ten minutes.',
            present: 'I <span class="xray-aux">have been</span> <span class="highlight xray-verb">eating</span> since morning.',
            future: 'I <span class="xray-aux">will have been</span> <span class="highlight xray-verb">eating</span> for one hour.'
        }
    },
    play: {
        simple: {
            past: 'We <span class="highlight xray-verb">played</span> football <span class="xray-trigger">yesterday</span>.',
            present: 'We <span class="highlight xray-verb">play</span> football <span class="xray-trigger">every day</span>.',
            future: 'We <span class="xray-aux">will</span> <span class="highlight xray-verb">play</span> football <span class="xray-trigger">tomorrow</span>.'
        },
        continuous: {
            past: 'We <span class="xray-aux">were</span> <span class="highlight xray-verb">playing</span> football.',
            present: 'We <span class="xray-aux">are</span> <span class="highlight xray-verb">playing</span> football <span class="xray-trigger">now</span>.',
            future: 'We <span class="xray-aux">will be</span> <span class="highlight xray-verb">playing</span> football <span class="xray-trigger">at 4 pm</span>.'
        },
        perfect: {
            past: 'We <span class="xray-aux">had</span> <span class="highlight xray-verb">played</span> the game.',
            present: 'We <span class="xray-aux">have</span> <span class="highlight xray-verb">played</span> the game.',
            future: 'We <span class="xray-aux">will have</span> <span class="highlight xray-verb">played</span> the game <span class="xray-trigger">by evening</span>.'
        },
        'perfect-continuous': {
            past: 'We <span class="xray-aux">had been</span> <span class="highlight xray-verb">playing</span> for two hours.',
            present: 'We <span class="xray-aux">have been</span> <span class="highlight xray-verb">playing</span> since morning.',
            future: 'We <span class="xray-aux">will have been</span> <span class="highlight xray-verb">playing</span> for three hours.'
        }
    },
    study: {
        simple: {
            past: 'She <span class="highlight xray-verb">studied</span> English <span class="xray-trigger">yesterday</span>.',
            present: 'She <span class="highlight xray-verb">studies</span> English <span class="xray-trigger">every day</span>.',
            future: 'She <span class="xray-aux">will</span> <span class="highlight xray-verb">study</span> English <span class="xray-trigger">tomorrow</span>.'
        },
        continuous: {
            past: 'She <span class="xray-aux">was</span> <span class="highlight xray-verb">studying</span> English.',
            present: 'She <span class="xray-aux">is</span> <span class="highlight xray-verb">studying</span> English <span class="xray-trigger">now</span>.',
            future: 'She <span class="xray-aux">will be</span> <span class="highlight xray-verb">studying</span> English <span class="xray-trigger">tonight</span>.'
        },
        perfect: {
            past: 'She <span class="xray-aux">had</span> <span class="highlight xray-verb">studied</span> before the test.',
            present: 'She <span class="xray-aux">has</span> <span class="highlight xray-verb">studied</span> English.',
            future: 'She <span class="xray-aux">will have</span> <span class="highlight xray-verb">studied</span> everything <span class="xray-trigger">by Monday</span>.'
        },
        'perfect-continuous': {
            past: 'She <span class="xray-aux">had been</span> <span class="highlight xray-verb">studying</span> for total three hours.',
            present: 'She <span class="xray-aux">has been</span> <span class="highlight xray-verb">studying</span> since 9 am.',
            future: 'She <span class="xray-aux">will have been</span> <span class="highlight xray-verb">studying</span> for five hours.'
        }
    },
    go: {
        simple: {
            past: 'They <span class="highlight xray-verb">went</span> to school <span class="xray-trigger">yesterday</span>.',
            present: 'They <span class="highlight xray-verb">go</span> to school <span class="xray-trigger">at 8 am</span>.',
            future: 'They <span class="xray-aux">will</span> <span class="highlight xray-verb">go</span> to school <span class="xray-trigger">tomorrow</span>.'
        },
        continuous: {
            past: 'They <span class="xray-aux">were</span> <span class="highlight xray-verb">going</span> to school.',
            present: 'They <span class="xray-aux">are</span> <span class="highlight xray-verb">going</span> to school <span class="xray-trigger">now</span>.',
            future: 'They <span class="xray-aux">will be</span> <span class="highlight xray-verb">going</span> to school <span class="xray-trigger">soon</span>.'
        },
        perfect: {
            past: 'They <span class="xray-aux">had</span> <span class="highlight xray-verb">gone</span> to school.',
            present: 'They <span class="xray-aux">have</span> <span class="highlight xray-verb">gone</span> to school.',
            future: 'They <span class="xray-aux">will have</span> <span class="highlight xray-verb">gone</span> to school <span class="xray-trigger">by noon</span>.'
        },
        'perfect-continuous': {
            past: 'They <span class="xray-aux">had been</span> <span class="highlight xray-verb">going</span> to school for months.',
            present: 'They <span class="xray-aux">have been</span> <span class="highlight xray-verb">going</span> to school since 2022.',
            future: 'They <span class="xray-aux">will have been</span> <span class="highlight xray-verb">going</span> to school for ten years.'
        }
    }
};

let currentVerb = 'eat'; // Default
let currentAspect = 'simple'; // Default (Changed from null/implied)
const verbSelect = document.getElementById('verb-select');

// State Definitions (Dynamic)
function getStates(verbKey, aspectKey) {
    const data = VERB_DATA[verbKey][aspectKey];

    // Format Display Label: e.g. "PAST PERFECT"
    const aspectLabel = aspectKey.toUpperCase().replace('-', ' ');

    return {
        PAST: {
            bgClass: 'state-past',
            text: data.past,
            label: `PAST ${aspectLabel}`
        },
        PRESENT: {
            bgClass: 'state-present',
            text: data.present,
            label: `PRESENT ${aspectLabel}`
        },
        FUTURE: {
            bgClass: 'state-future',
            text: data.future,
            label: `FUTURE ${aspectLabel}`
        }
    };
}

function changeVerb() {
    if (!verbSelect) return;
    currentVerb = verbSelect.value;
    updateTimeline();
}

function changeAspect(aspect) {
    currentAspect = aspect;

    // Update Button Styling
    document.querySelectorAll('.aspect-btn').forEach(btn => btn.classList.remove('active'));
    // Find the button that called this (hacky but simple) or strict selector
    // In this case, we re-render buttons or just click handlers.
    // Better: Select by onclick attribute or text.
    // Let's use event delegation or just loop text.

    // Optimization: Just rely on the click passing 'this' if rewritten, but for now:
    const buttons = document.querySelectorAll('.aspect-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === aspect.replace('-', ' ').toLowerCase()) {
            btn.classList.add('active');
        }
    });

    updateTimeline();
}

function updateTimeline() {
    // Guard: Only run on index.html where these elements exist
    if (!slider || !sentenceDisplay || !timeLabel) return;

    const value = parseInt(slider.value);
    let currentState;

    // Logic: 0-33 (Past), 34-66 (Present), 67-100 (Future)
    const STATES = getStates(currentVerb, currentAspect);

    // Logic: 0-33 (Past), 34-66 (Present), 67-100 (Future)
    if (value < 34) {
        currentState = STATES.PAST;
    } else if (value < 67) {
        currentState = STATES.PRESENT;
    } else {
        currentState = STATES.FUTURE;
    }

    // Apply Changes
    sentenceDisplay.innerHTML = wrapWords(currentState.text);
    timeLabel.textContent = currentState.label;

    // Smooth Background Transition
    body.className = currentState.bgClass;
}
// ===============================
// Timeline Event Listeners
// ===============================
if (typeof slider !== "undefined" && slider) {
    slider.addEventListener('input', updateTimeline);
    updateTimeline(); // faqat slider mavjud bo‘lsa ishlaydi
}

// ===============================
// SITUATION SIMULATOR LOGIC
// ===============================
class ScenarioManager {
    constructor() {
        this.scenarios =
            typeof SCENARIO_DATA !== 'undefined' ? SCENARIO_DATA : [];
        this.currentIndex = 0;
        this.shuffledIndices = [];
        this.init();
    }

    init() {
        if (!this.scenarios.length) return;
        this.shuffle();
        this.render();
    }

    shuffle() {
        this.shuffledIndices = [...Array(this.scenarios.length).keys()];
        for (let i = this.shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledIndices[i], this.shuffledIndices[j]] =
                [this.shuffledIndices[j], this.shuffledIndices[i]];
        }
    }

    render() {
        const scenario = this.scenarios[this.shuffledIndices[this.currentIndex]];
        const area = document.getElementById('scenario-area');
        if (!area) return;

        area.innerHTML = `
      <div class="scenario-card">
        <div class="scenario-visual">💡</div>
        <h3>${wrapWords(scenario.title)}</h3>
        <p class="scenario-text">${wrapWords(scenario.text)}</p>
        <p class="question">${wrapWords(scenario.question)}</p>

        <div class="options quiz-options">
          ${scenario.options.map((opt, i) => `
            <button class="quiz-opt-btn" onclick="scenarioManager.checkAnswer(${i})">
              <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
              <span>${wrapWords(opt.text)}</span>
            </button>
          `).join('')}
        </div>

        <div id="scenario-feedback" class="feedback hidden"></div>
      </div>
    `;
    }

    checkAnswer(optionIndex) {
        const scenario = this.scenarios[this.shuffledIndices[this.currentIndex]];
        const feedback = document.getElementById('scenario-feedback');
        const buttons = document.querySelectorAll('#scenario-area .quiz-opt-btn');

        buttons.forEach(btn => btn.disabled = true);

        const isCorrect = scenario.options[optionIndex].correct;
        feedback.classList.remove('hidden');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'wrong'}`;

        if (isCorrect) {
            feedback.innerHTML = `<strong>✅ Correct!</strong>`;
            progression.addXP(20);
            progression.completeLesson(`scenario-${scenario.id}`);
        } else {
            feedback.innerHTML = `<strong>❌ Not quite.</strong>`;
        }

        feedback.innerHTML += `
      <button class="why-btn" onclick="scenarioManager.toggleWhy()">Explain Why?</button>
      <div id="scenario-why" class="why-text hidden">${scenario.explanation}</div>
      <div style="margin-top: 1.5rem; text-align: center;">
        <button class="next-btn" onclick="scenarioManager.nextScenario()">Next Scenario ➔</button>
      </div>
    `;
    }

    toggleWhy() {
        const why = document.getElementById('scenario-why');
        if (why) why.classList.toggle('hidden');
    }

    nextScenario() {
        this.currentIndex = (this.currentIndex + 1) % this.scenarios.length;
        this.showScenario();
    }
}

const scenarioManager = new ScenarioManager();


// --- CONTRASTIVE ANALYSIS LOGIC ---
// Contrast Database
const CONTRAST_DATA = {
    past_vs_perfect: {
        labelA: "Past Simple",
        labelB: "Present Perfect",
        sideA: {
            text: 'I <span class="highlight-red">lost</span> my keys.',
            nuance: 'Context: Finished event (e.g., yesterday).',
            nuanceUz: 'Kontekst: Tugallangan voqea (masalan, kecha).',
            story: '<strong>Story:</strong> "It happened in 2010. I lost them walking home, but I bought new ones the next day. It is an old memory."',
            storyUz: '<strong>Hikoya:</strong> "Bu 2010-yilda sodir bo\'lgan. Uyga qaytayotganda ularni yo\'qotib qo\'ydim, lekin ertasi kuni yangisini sotib oldim. Bu shunchaki eski xotira."',
            implication: '<strong>Implication:</strong> I might have them now. It is just history.',
            implicationUz: '<strong>Ma\'nosi:</strong> Hozir ular menda bo\'lishi mumkin. Bu shunchaki tarix.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">have lost</span> my keys.',
            nuance: 'Context: Recent / Effect on NOW.',
            nuanceUz: 'Kontekst: Yaqinda sodir bo\'lgan / HOZIRGA ta\'siri.',
            story: '<strong>Story:</strong> "I am standing at my front door right now. I search my pockets... empty. I cannot get inside!"',
            storyUz: '<strong>Hikoya:</strong> "Hozirgina eshigim oldida turibman. Cho\'ntaklarimni qidiryapman... bo\'sh. Ichkariga kira olmayman!"',
            implication: '<strong>Implication:</strong> I definitely do NOT have them now.',
            implicationUz: '<strong>Ma\'nosi:</strong> Hozir ular menda EMASLIGI aniq.',
            color: '#3b82f6'
        }
    },
    simple_vs_continuous: {
        labelA: "Present Simple",
        labelB: "Present Continuous",
        sideA: {
            text: 'I <span class="highlight-red">live</span> in London.',
            nuance: 'Context: Permanent state / General truth.',
            nuanceUz: 'Kontekst: Doimiy holat / Umumiy haqiqat.',
            story: '<strong>Story:</strong> "I was born here. My house is here. I will probably die here. It is my permanent home."',
            storyUz: '<strong>Hikoya:</strong> "Men shu yerda tug\'ilganman. Uyim shu yerda. Ehtimol shu yerda vafot etarman. Bu mening doimiy uyim."',
            implication: '<strong>Implication:</strong> This is my normal reality.',
            implicationUz: '<strong>Ma\'nosi:</strong> Bu mening kundalik voqeligim.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">am living</span> in London.',
            nuance: 'Context: Temporary situation.',
            nuanceUz: 'Kontekst: Vaqtinchalik holat.',
            story: '<strong>Story:</strong> "I usually live in Paris, but I am in London for a 3-month internship. After that, I go back."',
            storyUz: '<strong>Hikoya:</strong> "Odatda Parijda yashayman, lekin hozir 3 oylik amaliyot uchun Londondaman. Undan keyin qaytib ketaman."',
            implication: '<strong>Implication:</strong> This is just for now. It will change.',
            implicationUz: '<strong>Ma\'nosi:</strong> Bu shunchaki hozir uchun. Keyin o\'zgaradi.',
            color: '#3b82f6'
        }
    },
    past_vs_continuous: {
        labelA: "Past Simple",
        labelB: "Past Continuous",
        sideA: {
            text: 'I <span class="highlight-red">read</span> a book last night.',
            nuance: 'Context: Completed action.',
            nuanceUz: 'Kontekst: Tugallangan harakat.',
            story: '<strong>Story:</strong> "I sat down at 8pm. I finished the book at 10pm. Then I went to sleep. The action is 100% done."',
            storyUz: '<strong>Hikoya:</strong> "Soat 8 da o\'tirdim. 10 da kitobni tugatdim. Keyin uxlashga yotdim. Harakat 100% bajarilgan."',
            implication: '<strong>Implication:</strong> I finished the whole book.',
            implicationUz: '<strong>Ma\'nosi:</strong> Men butun kitobni o\'qib bo\'ldim.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">was reading</span> a book last night.',
            nuance: 'Context: Action in progress at a specific time.',
            nuanceUz: 'Kontekst: Ma\'lum bir vaqtda davom etayotgan harakat.',
            story: '<strong>Story:</strong> "At 9pm, I was in the middle of page 50. Then the phone rang and interrupted me."',
            storyUz: '<strong>Hikoya:</strong> "Soat 9 da men 50-betning o\'rtasida edim. Keyin telefon jiringladi va meni chalg\'itdi."',
            implication: '<strong>Implication:</strong> I was busy doing it. I might not have finished.',
            implicationUz: '<strong>Ma\'nosi:</strong> Men band edim. Balki tugatmagandirman."',
            color: '#3b82f6'
        }
    },
    perfect_vs_continuous: {
        labelA: "Present Perfect",
        labelB: "Present Perfect Continuous",
        sideA: {
            text: 'I <span class="highlight-red">have painted</span> the room.',
            nuance: 'Context: Result-focused.',
            nuanceUz: 'Kontekst: Natijaga yo\'naltirilgan.',
            story: '<strong>Story:</strong> "Look! The walls are blue. The paint is dry. I am putting the brushes away. Good job!"',
            storyUz: '<strong>Hikoya:</strong> "Qarang! Devorlar ko\'k rangda. Bo\'yoq qurigan. Cho\'tkalarni olib qo\'yapman. Yaxshi ish bo\'ldi!"',
            implication: '<strong>Implication:</strong> The job is finished. Focus on the result.',
            implicationUz: '<strong>Ma\'nosi:</strong> Ish tugadi. Diqqat natijada.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">have been painting</span> the room.',
            nuance: 'Context: Action-focused / Duration.',
            nuanceUz: 'Kontekst: Harakatga yo\'naltirilgan / Davomiylik.',
            story: '<strong>Story:</strong> "I have paint on my clothes. I am sweating. Half the wall is still white. I started 2 hours ago and I am still going!"',
            storyUz: '<strong>Hikoya:</strong> "Kiyimlarimda bo\'yoq bor. Terlayapman. Devorning yarmi hali ham oq. 2 soat oldin boshlaganman va hali ham davom etyapman!"',
            implication: '<strong>Implication:</strong> Focus on the activity/effort. It might not be done.',
            implicationUz: '<strong>Ma\'nosi:</strong> Diqqat harakat/harakatda. U hali tugallanmagan bo\'lishi mumkin.',
            color: '#3b82f6'
        }
    },
    // --- NEW BATTLES ---
    past_simple_vs_perfect: {
        labelA: "Past Simple",
        labelB: "Past Perfect",
        sideA: {
            text: 'When I arrived, the train <span class="highlight-red">left</span>.',
            nuance: 'Context: Sequence of events (Event A -> Event B).',
            nuanceUz: 'Kontekst: Voqealar ketma-ketligi (A voqea -> B voqea).',
            story: '<strong>Story:</strong> "I stepped onto the platform. The conductor saw me. Then, the train started moving. I hopped on!"',
            storyUz: '<strong>Hikoya:</strong> "Men platformaga chiqdim. Konduktor meni ko\'rdi. Keyin poyezd yura boshladi. Men sakrab chiqdim!"',
            implication: '<strong>Implication:</strong> I caught the train.',
            implicationUz: '<strong>Ma\'nosi:</strong> Men poyezdga ulgurdim.',
            color: '#ef4444'
        },
        sideB: {
            text: 'When I arrived, the train <span class="highlight-blue">had left</span>.',
            nuance: 'Context: The "Past of the Past" (Event B happened before Event A).',
            nuanceUz: 'Kontekst: "O\'tmishning o\'tmishi" (B voqea A dan oldin sodir bo\'lgan).',
            story: '<strong>Story:</strong> "I stepped onto the platform. It was empty. The train had already gone 5 minutes ago."',
            storyUz: '<strong>Hikoya:</strong> "Men platformaga chiqdim. U bo\'sh edi. Poyezd 5 daqiqa oldin ketib qolgan edi."',
            implication: '<strong>Implication:</strong> I missed the train.',
            implicationUz: '<strong>Ma\'nosi:</strong> Men poyezdni o\'tkazib yubordim.',
            color: '#3b82f6'
        }
    },
    present_perfect_vs_past: {
        labelA: "Present Perfect",
        labelB: "Past Perfect",
        sideA: {
            text: 'I <span class="highlight-red">have visited</span> Paris.',
            nuance: 'Context: View from NOW.',
            nuanceUz: 'Kontekst: HOZIRGI vaqtdan nazar.',
            story: '<strong>Story:</strong> "Ask me for travel tips! I know Paris. It is part of my life experience as I stand here today."',
            storyUz: '<strong>Hikoya:</strong> "Mendan sayohat bo\'yicha maslahat so\'rang! Parijni bilaman. Bu bugun shu yerda turganimdek, hayotiy tajribamning bir qismi."',
            implication: '<strong>Focus:</strong> Present knowledge/experience.',
            implicationUz: '<strong>Diqqat:</strong> Hozirgi bilim/tajriba.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">had visited</span> Paris (before 2010).',
            nuance: 'Context: View from a PAST MOMENT.',
            nuanceUz: 'Kontekst: O\'TMISHDAGI bir vaqtdan nazar.',
            story: '<strong>Story:</strong> "In 2010, I moved to London. Before that move, I had already seen Paris twice."',
            storyUz: '<strong>Hikoya:</strong> "2010-yilda Londonga ko\'chdim. Undan oldin Parijni ikki marta ko\'rgan edim."',
            implication: '<strong>Focus:</strong> A timeline before a past date.',
            implicationUz: '<strong>Diqqat:</strong> O\'tmishdagi sanadan oldingi vaqt chizig\'i.',
            color: '#3b82f6'
        }
    },
    perfect_cont_vs_past_cont: {
        labelA: "Present Perf. Cont.",
        labelB: "Past Perf. Cont.",
        sideA: {
            text: 'I <span class="highlight-red">have been working</span> hard.',
            nuance: 'Context: Up to NOW.',
            nuanceUz: 'Kontekst: HOZIRGACHA.',
            story: '<strong>Story:</strong> "Hi! Sorry I look messy. I just put down my tools. I have been fixing the car all morning."',
            storyUz: '<strong>Hikoya:</strong> "Salom! Uzr, ko\'rinishim bir oz abgor. Hozirgina asboblarni qo\'ydim. Ertalabdan beri mashinani tuzatyapman."',
            implication: '<strong>Effect:</strong> Why I am tired NOW.',
            implicationUz: '<strong>Ta\'siri:</strong> Nima uchun HOZIR charchaganman."',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">had been working</span> hard.',
            nuance: 'Context: Up to a PAST MOMENT.',
            nuanceUz: 'Kontekst: O\'TMISHDAGI bir vaqtgacha.',
            story: '<strong>Story:</strong> "When you saw me yesterday, I looked messy because I had been fixing the car all morning."',
            storyUz: '<strong>Hikoya:</strong> "Kecha meni ko\'rganingizda, ko\'rinishim abgor edi, chunki ertalabdan beri mashinani tuzatayotgan edim."',
            implication: '<strong>Effect:</strong> Why I WAS tired THEN.',
            implicationUz: '<strong>Ta\'siri:</strong> Nima uchun O\'SHANDA charchagan edim."',
            color: '#3b82f6'
        }
    },
    will_vs_going_to: {
        labelA: "Will (Future Simple)",
        labelB: "Going To",
        sideA: {
            text: 'I <span class="highlight-red">will help</span> you.',
            nuance: 'Context: Instant Decision / Offer.',
            nuanceUz: 'Kontekst: Tezkor qaror / Taklif.',
            story: '<strong>Story:</strong> "Oh, your bag looks heavy! Don\'t worry, I will carry it for you." (I decided just now).',
            storyUz: '<strong>Hikoya:</strong> "Oh, sumkangiz og\'ir ko\'rinadi! Xavotir olmang, men yordamlashib yuboraman." (Hozirgina qaror qildim).',
            implication: '<strong>Implication:</strong> Spontaneous offer.',
            implicationUz: '<strong>Ma\'nosi:</strong> O\'z-o\'zidan paydo bo\'lgan taklif.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">am going to help</span> him.',
            nuance: 'Context: Prior Plan.',
            nuanceUz: 'Kontekst: Oldindan qilingan reja.',
            story: '<strong>Story:</strong> "I promised John yesterday. I am going to help him move house tomorrow. It is on my calendar."',
            storyUz: '<strong>Hikoya:</strong> "Kecha Johnga va\'da bergan edim. Ertaga unga ko\'chishga yordamlashmoqchiman. Bu mening rejamda bor."',
            implication: '<strong>Implication:</strong> Pre-meditated plan.',
            implicationUz: '<strong>Ma\'nosi:</strong> Oldindan rejalashtirilgan ish.',
            color: '#3b82f6'
        }
    },
    will_vs_present_cont: {
        labelA: "Will",
        labelB: "Present Continuous",
        sideA: {
            text: 'I <span class="highlight-red">will meet</span> him.',
            nuance: 'Context: Prediction or Promise.',
            nuanceUz: 'Kontekst: Bashorat yoki va\'da.',
            story: '<strong>Story:</strong> "Yeah, I will probably meet him later. Or maybe not. I haven\'t called him yet."',
            storyUz: '<strong>Hikoya:</strong> "Ha, ehtimol u bilan keyinroq uchrasharman. Balki yo\'qdir. Hali unga qo\'ng\'iroq qilmadim."',
            implication: '<strong>Implication:</strong> Uncertain or distant future.',
            implicationUz: '<strong>Ma\'nosi:</strong> Noaniq yoki uzoq kelajak.',
            color: '#ef4444'
        },
        sideB: {
            text: 'I <span class="highlight-blue">am meeting</span> him at 5.',
            nuance: 'Context: Fixed Arrangement.',
            nuanceUz: 'Kontekst: Aniq kelishuv.',
            story: '<strong>Story:</strong> "I have a table booked at the cafe for 5pm. I am meeting him there. It is 100% happening."',
            storyUz: '<strong>Hikoya:</strong> "Soat 5 ga kafeda joy buyurtma qilganman. U bilan o\'sha yerda uchrashyapman. Bu 100% sodir bo\'ladi."',
            implication: '<strong>Implication:</strong> Fixed appointment.',
            implicationUz: '<strong>Ma\'nosi:</strong> Aniq belgilangan uchrashuv.',
            color: '#3b82f6'
        }
    }
};

const contrastSelect = document.getElementById('contrast-pair-selector');

// UI Elements (Battle Arena)
const labelA = document.getElementById('label-a');
const sentenceA = document.getElementById('sentence-a');
const nuanceA = document.getElementById('nuance-a');
const storyA = document.getElementById('story-a'); // NEW
const implicationA = document.getElementById('implication-a');

const labelB = document.getElementById('label-b');
const sentenceB = document.getElementById('sentence-b');
const nuanceB = document.getElementById('nuance-b');
const storyB = document.getElementById('story-b'); // NEW
const implicationB = document.getElementById('implication-b');


function selectBattle(pairKey, cardElement) {
    // Update Hidden Select
    if (contrastSelect) {
        contrastSelect.value = pairKey;
    }

    // Update Card Styling
    document.querySelectorAll('.battle-card').forEach(card => card.classList.remove('active'));
    cardElement.classList.add('active');

    // Update Arena
    updateContrastArena();
}

function updateContrastArena() {
    const pairKey = contrastSelect.value;
    const data = CONTRAST_DATA[pairKey];

    // Update Side A (Left)
    labelA.innerText = data.labelA;
    sentenceA.innerHTML = data.sideA.text;

    // English + Uzbek Nuance
    nuanceA.innerHTML = `
        <div class="lang-en">${data.sideA.nuance}</div>
        <div class="lang-uz">${data.sideA.nuanceUz || ''}</div>
    `;

    // English + Uzbek Story
    storyA.innerHTML = `
        <div class="lang-en">${data.sideA.story}</div>
        <div class="lang-uz">${data.sideA.storyUz || ''}</div>
    `;

    // English + Uzbek Implication
    implicationA.innerHTML = `
        <div class="lang-en">${data.sideA.implication}</div>
        <div class="lang-uz">${data.sideA.implicationUz || ''}</div>
    `;

    // Update Side B (Right)
    labelB.innerText = data.labelB;
    sentenceB.innerHTML = data.sideB.text;

    // English + Uzbek Nuance
    nuanceB.innerHTML = `
        <div class="lang-en">${data.sideB.nuance}</div>
        <div class="lang-uz">${data.sideB.nuanceUz || ''}</div>
    `;

    // English + Uzbek Story
    storyB.innerHTML = `
        <div class="lang-en">${data.sideB.story}</div>
        <div class="lang-uz">${data.sideB.storyUz || ''}</div>
    `;

    // English + Uzbek Implication
    implicationB.innerHTML = `
        <div class="lang-en">${data.sideB.implication}</div>
        <div class="lang-uz">${data.sideB.implicationUz || ''}</div>
    `;

    progression.completeLesson(`contrast-${pairKey}`);
}


// Initialize
if (contrastSelect) {
    updateContrastArena();
}

// X-RAY MODE LOGIC
function toggleXRay() {
    const xrayToggle = document.getElementById('xray-toggle');
    if (xrayToggle.checked) {
        document.body.classList.add('xray-active');
    } else {
        document.body.classList.remove('xray-active');
    }
}

// --- ASPECT MATRIX LOGIC ---
const MATRIX_EXPLANATIONS = {
    'past-simple': {
        title: 'Past Simple',
        desc: 'A snapshot of a completed action in the past. Used for facts and finished events.',
        descUz: 'O\'tgan zamon (oddiy). Tugallangan ish-harakatlar, faktlar va o\'tgan voqealar uchun ishlatiladi.'
    },
    'present-simple': {
        title: 'Present Simple',
        desc: 'General truths, habits, and permanent states. The "Now" fact.',
        descUz: 'Hozirgi zamon (oddiy). Umumiy haqiqatlar, odatlar va doimiy holatlar. "Hozirgi" fakt.'
    },
    'future-simple': {
        title: 'Future Simple',
        desc: 'Instant decisions, promises, and predictions about the future.',
        descUz: 'Kelasi zamon (oddiy). Tezkor qarorlar, va\'dalar va kelajak haqidagi bashoratlar.'
    },
    'past-continuous': {
        title: 'Past Continuous',
        desc: 'A "video clip" of the past. An action that was in progress at a specific moment.',
        descUz: 'O\'tgan davomli zamon. O\'tmishdagi ma\'lum bir vaqtda davom etayotgan harakat (videoklip kabi).'
    },
    'present-continuous': {
        title: 'Present Continuous',
        desc: 'Actions happening right now or temporary situations.',
        descUz: 'Hozirgi davomli zamon. Aynan hozir sodir bo\'layotgan yoki vaqtinchalik harakatlar.'
    },
    'future-continuous': {
        title: 'Future Continuous',
        desc: 'Actions that will be in progress at a specific time in the future.',
        descUz: 'Kelasi davomli zamon. Kelajakda ma\'lum bir vaqtda davom etayotgan bo\'ladigan harakatlar.'
    },
    'past-perfect': {
        title: 'Past Perfect',
        desc: 'The "Past of the Past". Shows an action finished before another past action.',
        descUz: 'O\'tgan tugallangan zamon. O\'tmishdan ham oldinroq sodir bo\'lgan harakat ("o\'tmishning o\'tmishi").'
    },
    'present-perfect': {
        title: 'Present Perfect',
        desc: 'The "Bridge". An action starting in the past with a result or relevance NOW.',
        descUz: 'Hozirgi tugallangan zamon. "Ko\'prik" vazifasini bajaradi: o\'tmishda boshlangan, ammo natijasi hozir uchun muhim.'
    },
    'future-perfect': {
        title: 'Future Perfect',
        desc: 'An action that will be completed by a certain time in the future.',
        descUz: 'Kelasi tugallangan zamon. Kelajakda ma\'lum bir vaqtgacha tugallanadigan harakat.'
    },
    'past-perfect-continuous': {
        title: 'Past Perfect Continuous',
        desc: 'Duration of an action up to a certain point in the past.',
        descUz: 'O\'tgan tugallangan davomli zamon. O\'tmishdagi ma\'lum bir nuqtagacha davom etgan harakatning davomiyligi.'
    },
    'present-perfect-continuous': {
        title: 'Present Perfect Continuous',
        desc: 'Duration of an action from the past continuing up to now.',
        descUz: 'Hozirgi tugallangan davomli zamon. O\'tmishdan hozirgacha davom etib kelayotgan harakatning davomiyligi.'
    },
    'future-perfect-continuous': {
        title: 'Future Perfect Continuous',
        desc: 'Duration of an action up to a certain point in the future.',
        descUz: 'Kelasi tugallangan davomli zamon. Kelajakdagi ma\'lum bir nuqtagacha davom etib keladigan harakatning davomiyligi.'
    }
};

const matrixDetail = document.getElementById('matrix-detail');
const detailTitle = document.getElementById('detail-title');
const detailDesc = document.getElementById('detail-desc');

function onMatrixCardClick(tenseKey) {
    showMatrixDetail(tenseKey);
    progression.completeLesson(`matrix-${tenseKey}`);
}

let currentTenseForQuiz = null;

function showMatrixDetail(tenseKey) {
    currentTenseForQuiz = tenseKey;
    const data = MATRIX_EXPLANATIONS[tenseKey];
    detailTitle.innerText = data.title;
    detailDesc.innerHTML = `
        <div class="matrix-desc-en">${data.desc}</div>
        <div class="matrix-desc-uz">${data.descUz || ''}</div>
    `;

    // Hide quiz if open
    document.getElementById('quiz-area').classList.add('hidden');

    matrixDetail.classList.remove('hidden');
    matrixDetail.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeMatrixDetail() {
    matrixDetail.classList.add('hidden');
}

function showBridge(active) {
    const matrix = document.querySelector('.matrix-grid');
    if (active) {
        matrix.classList.add('bridge-active');
    } else {
        matrix.classList.remove('bridge-active');
    }
}


// --- TENSE IN THE WILD LOGIC ---
class WildManager {
    constructor() {
        this.data = typeof WILD_DATA !== 'undefined' ? WILD_DATA : [];
        this.grid = document.getElementById('wild-grid');
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.render();
    }

    filter(type) {
        this.currentFilter = type;

        // Update button states
        const buttons = document.querySelectorAll('.filter-btn');
        buttons.forEach(btn => {
            const btnText = btn.innerText.toLowerCase();
            const isMatch = (type === 'all' && btnText === 'all') ||
                (type !== 'all' && btnText.includes(type.toLowerCase()));
            btn.classList.toggle('active', isMatch);
        });

        this.render();
        progression.addXP(2);
    }

    render() {
        if (!this.grid) return;

        const filtered = this.currentFilter === 'all'
            ? this.data
            : this.data.filter(item => item.category.toLowerCase() === this.currentFilter.toLowerCase());

        this.grid.innerHTML = filtered.map(item => `
            <div class="wild-card">
                <div class="wild-header">
                    <span>${item.icon} ${item.category}</span>
                    <span style="opacity: 0.6; font-size: 0.8rem;">${item.source}</span>
                </div>
                ${item.videoId ? `
                    <div class="wild-video-container">
                        <iframe 
                            src="https://www.youtube.com/embed/${item.videoId}?rel=0" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div style="text-align: right; padding: 0.5rem 1rem 0 0;">
                        <a href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank" class="yt-link">
                            <span style="font-size: 0.8rem;">📺 Watch on YouTube</span>
                        </a>
                    </div>
                ` : `
                    <div class="wild-visual-placeholder">🎵 Quotes & Clips</div>
                `}
                <div class="wild-body">
                    <p class="wild-quote">"${wrapWords(item.quote)}"</p>
                    <div class="wild-tense-tag">${item.tense}</div>
                </div>
                <div class="wild-footer">
                    <strong>Nuance:</strong> ${wrapWords(item.explanation)}
                </div>
            </div>
        `).join('');
    }
}

// --- GLOBAL NUANCE LOGIC ---
class NuanceManager {
    constructor() {
        this.data = typeof NUANCE_DATA !== 'undefined' ? NUANCE_DATA : {};
        this.displayArea = document.getElementById('nuance-display-area');
        this.currentRegion = 'US';
        this.init();
    }

    init() {
        this.render();
    }

    selectRegion(regionId) {
        this.currentRegion = regionId;

        // Update button states
        const buttons = document.querySelectorAll('.region-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.innerText.includes(regionId));
        });

        this.render();
        progression.addXP(5);
        progression.completeLesson(`nuance-${regionId.toLowerCase()}`);
    }

    render() {
        if (!this.displayArea) return;
        const region = this.data[this.currentRegion];

        this.displayArea.innerHTML = `
            <div class="nuance-header-area">
                <h3 class="nuance-region-title">${region.flag} ${region.name} English</h3>
                <p class="nuance-region-subtitle">Key tense habits and regional shortcuts.</p>
            </div>
            ${region.scenarios.map(scen => `
                <div class="nuance-entry" style="--accent-color: ${scen.color}">
                    <h4 class="nuance-situation">Situation: ${wrapWords(scen.situation)}</h4>
                    <p class="nuance-example">"${wrapWords(scen.example)}"</p>
                    <div class="nuance-rule-box">
                        <strong>The Rule:</strong> ${wrapWords(scen.rule)}
                    </div>
                </div>
            `).join('')}
        `;
    }
}

const wild = new WildManager();
const nuance = new NuanceManager();


// --- MICRO-ASSESSMENTS (QUIZ) LOGIC ---
class QuizManager {
    constructor() {
        this.currentTense = null;
        this.currentDifficulty = 'easy';
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;

        // UI References
        this.container = null; // Will be injected via matrix detail
    }

    getRandomSubset(array, size) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(size, array.length));
    }

    startQuiz(tense) {
        this.currentTense = tense;
        const allQuestions = QUIZ_DATA[tense] ? QUIZ_DATA[tense][this.currentDifficulty] : [];

        // Randomly select 5 questions from the 10 available
        this.questions = this.getRandomSubset(allQuestions, 5);
        this.currentIndex = 0;
        this.score = 0;

        if (this.questions.length === 0) {
            alert("Quiz not available for this tense yet!");
            return;
        }

        this.showQuestion();
    }

    setDifficulty(diff) {
        this.currentDifficulty = diff;
        if (this.currentTense) this.startQuiz(this.currentTense);
    }

    showQuestion() {
        const q = this.questions[this.currentIndex];
        const quizContainer = document.getElementById('quiz-area');
        quizContainer.innerHTML = `
            <div class="quiz-card glass-card">
                <div style="margin-bottom: 1.5rem; opacity: 0.9; font-size: 0.9rem; letter-spacing: 0.1rem; text-transform: uppercase; color: var(--pulsar-gold);">
                Progress: Question ${this.currentIndex + 1} of ${this.questions.length}
            </div>
                <p class="quiz-question">${wrapWords(q.q)}</p>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-opt-btn" onclick="quiz.checkAnswer(${i})">
                        <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                        <span>${wrapWords(opt)}</span>
                    </button>
                `).join('')}
            </div>
                <div id="quiz-feedback" class="quiz-feedback hidden"></div>
                
                <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align: center;">
                    <button class="early-submit-btn" onclick="quiz.finishQuiz()">Submit & Finish Early</button>
                </div>
            </div>
        `;
        quizContainer.classList.remove('hidden');
    }

    checkAnswer(index) {
        const q = this.questions[this.currentIndex];
        const buttons = document.querySelectorAll('.quiz-opt-btn');
        const feedback = document.getElementById('quiz-feedback');
        const isCorrect = index === q.correct;

        // Disable all buttons toggle colors
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) {
                btn.classList.add('correct');
            } else if (i === index) {
                btn.classList.add('wrong');
            }
        });

        feedback.innerHTML = `
        <div class="feedback-icon">${isCorrect ? '✨' : '⚠️'}</div>
        <div class="feedback-text">
            <h4>${isCorrect ? 'Correct!' : 'Incorrect'}</h4>
            <p>${wrapWords(q.why)}</p>
        </div>
        ${this.currentIndex < this.questions.length - 1
                ? `<button class="next-btn" onclick="quiz.nextQuestion()">Next Question ➔</button>`
                : `<button class="next-btn" onclick="quiz.finishQuiz()">Finish Quiz 🏁</button>`}
    `;
        feedback.classList.remove('hidden');

        if (isCorrect) {
            this.score++;
            progression.addXP(5);
        }
    }

    toggleWhy() {
        document.getElementById('why-text').classList.toggle('hidden');
    }

    nextQuestion() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.finishQuiz();
        }
    }

    finishQuiz() {
        const quizContainer = document.getElementById('quiz-area');
        const totalXP = this.score * 10;
        quizContainer.innerHTML = `
            <div class="quiz-card result-card">
                <h3>Quiz Complete!</h3>
                <p>Final Score: ${this.score} / ${this.questions.length}</p>
                <p>XP Earned: +${totalXP}</p>
                <button class="close-btn" onclick="quiz.closeQuiz()">Finish</button>
            </div>
        `;
        progression.addXP(totalXP);
        progression.completeLesson(`quiz-${this.currentTense}-${this.currentDifficulty}`);
        progression.checkBadges();
    }

    closeQuiz() {
        document.getElementById('quiz-area').classList.add('hidden');
    }
}

const quiz = new QuizManager();

// --- MIXED MASTERY QUIZ LOGIC ---
class MixedQuizManager {
    constructor() {
        this.tests = typeof MIXED_QUIZ_DATA !== 'undefined' ? MIXED_QUIZ_DATA : [];
        this.currentTest = null;
        this.currentIndex = 0;
        this.score = 0;
        this.results = []; // Detailed results by question
        this.container = document.getElementById('mixed-quiz-area');
    }

    start(testId) {
        this.currentTest = this.tests.find(t => t.id === testId);
        if (!this.currentTest) return;

        this.currentIndex = 0;
        this.score = 0;
        this.results = [];
        this.container.classList.remove('hidden');
        this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.showQuestion();
    }

    startRandom(count) {
        const fullPool = typeof MASTERY_POOL !== 'undefined' ? MASTERY_POOL : [];
        if (fullPool.length === 0) {
            showToast("Mastery pool is still loading...", "info");
            return;
        }

        const shuffled = [...fullPool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(count, fullPool.length));

        this.currentTest = {
            id: `random-${count}`,
            title: `Random ${count} Challenge`,
            questions: selected
        };

        this.currentIndex = 0;
        this.score = 0;
        this.results = [];
        this.container.classList.remove('hidden');
        document.getElementById('reading-area').classList.add('hidden'); // Close reading if open
        this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.showQuestion();
    }

    showQuestion() {
        const q = this.currentTest.questions[this.currentIndex];
        this.container.innerHTML = `
            <div class="quiz-card glass-card">
                <div style="margin-bottom: 1.5rem; color: var(--pulsar-gold); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">
                Question ${this.currentIndex + 1} of ${this.currentTest.questions.length} • Mixed Mastery
            </div>
                <p class="quiz-question">${wrapWords(q.q)}</p>
            <div class="quiz-options">
                ${q.options.map((opt, i) => `
                    <button class="quiz-opt-btn" onclick="mixedQuiz.checkAnswer(${i})">
                        <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                        <span>${wrapWords(opt)}</span>
                    </button>
                `).join('')}
            </div>
                <div id="mixed-feedback" class="quiz-feedback hidden"></div>

                <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align: center;">
                    <button class="early-submit-btn" onclick="mixedQuiz.showResults()">End Assessment & Submit</button>
                </div>
            </div>
        `;
    }

    checkAnswer(index) {
        const q = this.currentTest.questions[this.currentIndex];
        const buttons = document.querySelectorAll('#mixed-quiz-area .quiz-opt-btn');
        const feedback = document.getElementById('mixed-feedback');

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add('correct');
            else if (i === index) btn.classList.add('wrong');
        });

        const isCorrect = index === q.correct;
        if (isCorrect) this.score++;

        this.results.push({
            tense: q.tense,
            correct: isCorrect
        });

        feedback.innerHTML = `
        <p>${isCorrect ? '⚡ Correct Mastery!' : '❌ Study harder!'}</p>
        <div class="why-text">${wrapWords(q.why)}</div>
        <button class="next-btn" onclick="mixedQuiz.next()">Next ➔</button>
    `;
        feedback.classList.remove('hidden');
        progression.addXP(isCorrect ? (q.diff === 'hard' ? 12 : 8) : 2);
    }

    next() {
        this.currentIndex++;
        if (this.currentIndex < this.currentTest.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        const totalXP = this.score * 20;
        const percentage = Math.round((this.score / this.currentTest.questions.length) * 100);

        const tenseStats = {};
        this.results.forEach(r => {
            if (!tenseStats[r.tense]) tenseStats[r.tense] = { total: 0, correct: 0 };
            tenseStats[r.tense].total++;
            if (r.correct) tenseStats[r.tense].correct++;
        });

        this.container.innerHTML = `
            <div class="quiz-card result-card">
                <h3>Assessment Complete!</h3>
                <div style="font-size: 3rem; margin: 1rem 0;">${percentage}%</div>
                <p>Final Score: ${this.score} / ${this.currentTest.questions.length}</p>
                <p>XP Earned: +${totalXP}</p>
                
                <div class="tense-report">
                    <h4>Tense Balance Report:</h4>
                    ${Object.entries(tenseStats).map(([tense, stat]) => `
                        <div class="report-item">
                            <span>${tense}</span>
                            <span class="${stat.correct === stat.total ? 'report-check' : 'report-cross'}">
                                ${stat.correct}/${stat.total} ${stat.correct === stat.total ? '✓' : '✗'}
                            </span>
                        </div>
                    `).join('')}
                </div>

                <button class="close-btn" style="margin-top: 1.5rem;" onclick="mixedQuiz.close()">Submit Final Report</button>
            </div>
        `;

        progression.addXP(totalXP);
        progression.completeLesson(`mixed-mastery-${this.currentTest.id}`);
        if (percentage === 100) {
            showToast("🎖️ GRANDMASTER! Perfect score on mixed assessment!", "success");
        }
    }

    close() {
        this.container.classList.add('hidden');
    }
}

// --- READING MASTERY LOGIC ---
class ReadingMasteryManager {
    constructor() {
        this.data = typeof READING_MASTERY_DATA !== 'undefined' ? READING_MASTERY_DATA : [];
        this.container = document.getElementById('reading-area');
        this.currentSet = null;
        this.currentIndex = 0;
        this.score = 0;
    }

    open() {
        if (this.data.length === 0) return;
        this.currentSet = this.data[0];
        this.currentIndex = 0;
        this.score = 0;
        this.container.classList.remove('hidden');
        document.getElementById('mixed-quiz-area').classList.add('hidden'); // Close mixed if open
        this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.render();
    }

    render() {
        const q = this.currentSet.questions[this.currentIndex];
        this.container.innerHTML = `
            <div class="reading-card glass-card">
                <div class="reading-context">
                    <h4 style="color: var(--pulsar-gold); text-transform: uppercase; letter-spacing: 0.1rem;">${wrapWords(this.currentSet.title)}</h4>
                    <p style="font-size: 1.05rem; line-height: 1.8;">${wrapWords(this.currentSet.context)}</p>
                </div>
                <div class="reading-question-box">
                    <div style="margin-bottom: 1rem; color: var(--pulsar-gold); font-size: 0.9rem; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 700;">
                    Phase ${this.currentIndex + 1} of ${this.currentSet.questions.length}
                </div>
                    <p class="quiz-question">${wrapWords(q.q)}</p>
                    <div class="quiz-options">
                        ${q.options.map((opt, i) => `
                            <button class="quiz-opt-btn" onclick="readingMastery.check(${i})">
                                <span class="opt-letter">${String.fromCharCode(65 + i)}</span>
                                <span>${wrapWords(opt)}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="reading-feedback" class="quiz-feedback hidden"></div>

                    <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem; text-align: center;">
                        <button class="early-submit-btn" onclick="readingMastery.finish()">Finish Reading Early</button>
                    </div>
                </div>
            </div>
        `;
    }

    check(index) {
        const q = this.currentSet.questions[this.currentIndex];
        const buttons = document.querySelectorAll('#reading-area .quiz-opt-btn');
        const feedback = document.getElementById('reading-feedback');

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === q.correct) btn.classList.add('correct');
            else if (i === index) btn.classList.add('wrong');
        });

        const isCorrect = index === q.correct;
        if (isCorrect) this.score++;

        feedback.innerHTML = `
            <p>${isCorrect ? '✅ Deep Insight!' : '❌ Missed a detail.'}</p>
            <div class="why-text">${wrapWords(q.why)}</div>
            <button class="next-btn" onclick="readingMastery.next()">Continue Reader ➔</button>
        `;
        feedback.classList.remove('hidden');
        progression.addXP(isCorrect ? 15 : 4);
    }

    next() {
        this.currentIndex++;
        if (this.currentIndex < this.currentSet.questions.length) {
            this.render();
        } else {
            this.finish();
        }
    }

    finish() {
        const totalXP = this.score * 25;
        this.container.innerHTML = `
            <div class="quiz-card result-card">
                <h3>Reading Mastery Complete!</h3>
                <p>Final Insight: ${this.score} / ${this.currentSet.questions.length}</p>
                <p>XP Earned: +${totalXP}</p>
                <button class="close-btn" onclick="readingMastery.close()">Close Library</button>
            </div>
        `;
        progression.addXP(totalXP);
        progression.completeLesson(`reading-${this.currentSet.id}`);
    }

    close() {
        this.container.classList.add('hidden');
    }
}

const mixedQuiz = new MixedQuizManager();
const readingMastery = new ReadingMasteryManager();
// ===============================
// Dictionary Mode — Desktop Tooltip + Mobile Bottom Sheet
// Single-word accurate picker (no phrase glue)
// Requires: window.UZ_DICT loaded
// Uses: window.DICTIONARY_MODE_ON (your existing toggle)
// ===============================
// ===============================
// Dictionary Mode — Desktop Tooltip + Mobile Bottom Sheet
// Unified accurate picker with grammar & suffix support
// Requires: window.UZ_DICT & window.GRAMMAR_INFO
// ===============================
(function () {
    const IGNORE_TAGS = new Set(["CODE", "PRE", "INPUT", "TEXTAREA", "BUTTON", "A", "NAV"]);
    const STOPWORDS = new Set(["a", "an", "the", "of", "to", "in", "on", "at", "for", "with", "by", "from", "about", "as", "and", "or", "but"]);

    const isMobile = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    function decodeHtmlEntities(str) {
        if (!str || typeof str !== "string") return str;
        const el = document.createElement("textarea");
        el.innerHTML = str;
        return el.value;
    }

    function normalizeWord(raw) {
        return (raw || "")
            .toLowerCase()
            .replace(/^[^a-z]+|[^a-z]+$/g, "")
            .replace(/[^a-z]/g, "");
    }

    function findInDictionary(word) {
        if (!word || !window.UZ_DICT) return null;

        // Direct match
        if (window.UZ_DICT.hasOwnProperty(word)) return window.UZ_DICT[word];

        // Suffix stripping
        const suffixes = ['ing', 'ed', 'es', 's'];
        for (const suffix of suffixes) {
            if (word.endsWith(suffix)) {
                const root = word.slice(0, -suffix.length);
                if (window.UZ_DICT.hasOwnProperty(root)) return window.UZ_DICT[root];

                // Doubled consonant
                if (root.length > 2 && root[root.length - 1] === root[root.length - 2]) {
                    const tripleRoot = root.slice(0, -1);
                    if (window.UZ_DICT.hasOwnProperty(tripleRoot)) return window.UZ_DICT[tripleRoot];
                }
            }
        }
        return null;
    }

    function isInsideIgnored(el) {
        while (el) {
            if (el.nodeType === 1 && IGNORE_TAGS.has(el.tagName)) return true;
            el = el.parentElement;
        }
        return false;
    }

    function getWordAtPoint(x, y) {
        let range = null;
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(x, y);
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(x, y);
            if (pos) {
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.setEnd(pos.offsetNode, pos.offset);
            }
        }
        if (!range || !range.startContainer) return "";
        const node = range.startContainer;
        if (node.nodeType !== Node.TEXT_NODE) return "";

        const text = node.textContent || "";
        let i = range.startOffset;

        if (i > 0 && !/[A-Za-z]/.test(text[i]) && /[A-Za-z]/.test(text[i - 1])) i--;

        let start = i, end = i;
        while (start > 0 && /[A-Za-z]/.test(text[start - 1])) start--;
        while (end < text.length && /[A-Za-z]/.test(text[end])) end++;

        return text.slice(start, end);
    }

    // ---------- Desktop tooltip ----------
    const tip = document.createElement("div");
    tip.id = "dict-tooltip";
    tip.className = "translation-tooltip";
    document.body.appendChild(tip);

    function showTip(x, y, enWord, uzText, grammar) {
        const uz = decodeHtmlEntities(uzText || "");
        let html = `<span class="tooltip-translation">${uz || 'Tarjima topilmadi'}</span>`;
        if (grammar) html += `<span class="tooltip-grammar">📘 ${grammar}</span>`;
        html += `<span class="tooltip-original">${enWord}</span>`;

        tip.innerHTML = html;
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
        tip.style.display = "flex";

        // Fit logic
        requestAnimationFrame(() => {
            const rect = tip.getBoundingClientRect();
            if (rect.right > window.innerWidth - 10) tip.style.left = `${window.innerWidth - rect.width - 10}px`;
            if (rect.top < 10) tip.style.top = `${y + 25}px`;
        });
    }

    // ---------- Mobile bottom sheet ----------
    const sheet = document.createElement("div");
    sheet.id = "dict-sheet";
    sheet.innerHTML = `
        <div class="top">
            <div class="pill">EN → UZ</div>
            <button class="close" aria-label="Close">✕</button>
        </div>
        <div class="content"></div>
    `;
    document.body.appendChild(sheet);

    const sheetContent = sheet.querySelector(".content");
    sheet.querySelector(".close").addEventListener("click", () => hideAll());

    function showSheet(enWord, uzText, grammar) {
        const uz = decodeHtmlEntities(uzText || "");
        let html = uz
            ? `<div class="uz">${uz}</div>`
            : `<div class="missing">Tarjima topilmadi</div>`;

        if (grammar) html += `<div class="tooltip-grammar" style="margin-top:8px; border-top:1px solid rgba(255,255,255,0.1); padding-top:8px;">📘 ${grammar}</div>`;
        html += `<div class="en">${enWord}</div>`;

        sheetContent.innerHTML = html;
        sheet.classList.add("show");
    }

    function hideAll() {
        tip.style.display = "none";
        sheet.classList.remove("show");
        document.querySelectorAll(".dict-word-highlight").forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            }
        });
    }

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideAll(); });
    window.addEventListener("scroll", hideAll, { passive: true });

    document.addEventListener("click", (e) => {
        // Cleanup highlight
        document.querySelectorAll(".dict-word-highlight").forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            }
        });

        if (!window.DICTIONARY_MODE_ON) {
            hideAll();
            return;
        }

        if (isInsideIgnored(e.target)) return;

        const x = e.clientX || 0;
        const y = e.clientY || 0;

        const rawWord = getWordAtPoint(x, y);
        const normalized = normalizeWord(rawWord);

        if (!normalized || normalized.length > 25 || STOPWORDS.has(normalized)) {
            hideAll();
            return;
        }

        const uz = findInDictionary(normalized);
        const grammar = window.GRAMMAR_INFO?.[normalized];

        if (isMobile) showSheet(normalized, uz, grammar);
        else showTip(x, y - 10, normalized, uz, grammar);
    }, true);
})();

