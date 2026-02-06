const MASTERY_POOL = [
    // --- TRAVEL & EXPLORATION ---
    { q: "By this time next week, we ______ to London.", options: ["will fly", "will be flying", "will have flown"], correct: 1, tense: 'Future Continuous', diff: 'medium' },
    { q: "Last year, I ______ to Japan for a holiday.", options: ["go", "went", "have gone"], correct: 1, tense: 'Past Simple', diff: 'medium' },
    { q: "They ______ for three hours before they found the home.", options: ["walked", "were walking", "had been walking"], correct: 2, tense: 'Past Perfect Continuous', diff: 'hard' },
    { q: "I ______ to that city twice already.", options: ["was", "have been", "had been"], correct: 1, tense: 'Present Perfect', diff: 'medium' },
    { q: "While she ______ through Rome, she lost her bag.", options: ["travels", "was traveling", "had traveled"], correct: 1, tense: 'Past Continuous', diff: 'medium' },

    // --- WORK & SCHOOL ---
    { q: "The teacher ______ the results at tomorrow's lesson.", options: ["announces", "is announcing", "will be announcing"], correct: 2, tense: 'Future Continuous', diff: 'medium' },
    { q: "We ______ for this school since 2015.", options: ["work", "are working", "have been working"], correct: 2, tense: 'Present Perfect Continuous', diff: 'medium' },
    { q: "By the end of the day, we ______ our work.", options: ["finish", "will finish", "will have finished"], correct: 2, tense: 'Future Perfect', diff: 'hard' },

    // --- DAILY LIFE ---
    { q: "Water ______ at zero degrees.", options: ["freezes", "is freezing", "has frozen"], correct: 0, tense: 'Present Simple', diff: 'medium' },
    { q: "I ______ my keys! Can you help me?", options: ["lost", "have lost", "had lost"], correct: 1, tense: 'Present Perfect', diff: 'medium' },
    { q: "What ______ at 9 PM last night when I called?", options: ["did you do", "were you doing", "had you done"], correct: 1, tense: 'Past Continuous', diff: 'medium' },
    { q: "I promise I ______ your secret.", options: ["don't tell", "won't tell", "am not telling"], correct: 1, tense: 'Future Simple', diff: 'medium' },
    { q: "She ______ tennis every Tuesday.", options: ["plays", "is playing", "has played"], correct: 0, tense: 'Present Simple', diff: 'medium' }
];

// --- DIVERSITY GENERATOR ---
const subjects = ["The student", "A friend", "The teacher", "Every child", "My mother", "The doctor", "A man", "Local people", "The music girl", "A runner"];
const contexts = [
    { t: 'Past Perfect', q: "before the sun rose.", act: "had finished the work", options: ["finished", "had finished", "was finishing"], correct: 1 },
    { t: 'Future Perfect', q: "by the time the year ends.", act: "will have found a new job", options: ["will find", "will be finding", "will have found"], correct: 2 },
    { t: 'Present Perfect Continuous', q: "since the morning.", act: "has been playing the game", options: ["plays", "is playing", "has been playing"], correct: 2 },
    { t: 'Future Continuous', q: "this time tomorrow.", act: "will be drinking tea", options: ["drinks", "will drink", "will be drinking"], correct: 2 },
    { t: 'Past Continuous', q: "when the guest arrived.", act: "was reading a book", options: ["read", "was reading", "had read"], correct: 1 },
    { t: 'Present Simple', q: "every day.", act: "walks in the park", options: ["walks", "is walking", "has walked"], correct: 0 }
];

for (let i = 0; i < 100; i++) { // Reduced count for performance and simplicity
    const sub = subjects[i % subjects.length];
    const ctx = contexts[i % contexts.length];
    const id = i + 1;

    MASTERY_POOL.push({
        q: `${sub} ______ ${ctx.q}`,
        options: ctx.options,
        correct: ctx.correct,
        tense: ctx.t,
        diff: i % 3 === 0 ? 'hard' : 'medium'
    });
}

const READING_MASTERY_DATA = [
    {
        id: 'reading-1',
        title: 'The Library',
        context: "The library was quiet. Arthur walked inside. He noticed the librarian was not there. Arthur comes here every Sunday. He has been visiting for many years. Today, he wanted to find a special book. He has been looking for it for a long time.",
        questions: [
            { q: "Arthur ______ the library every Sunday.", options: ["visits", "has been visiting", "had been visiting"], correct: 0, why: "Present Simple for a habit." },
            { q: "In the story, Arthur ______ for a special book for a long time.", options: ["seeks", "is seeking", "has been seeking"], correct: 2, why: "Present Perfect Continuous for duration leading to now." }
        ]
    }
];
