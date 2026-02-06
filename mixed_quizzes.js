const MIXED_QUIZ_DATA = [
    {
        id: 'test-elementary-1',
        title: 'Beginner Mastery I',
        level: 'Elementary',
        questions: [
            { q: "Yesterday, I ______ (go) to the park.", options: ["go", "went", "gone"], correct: 1, tense: 'Past Simple', why: "Use 'went' for the past." },
            { q: "I ______ (be) a student.", options: ["am", "is", "are"], correct: 0, tense: 'Present Simple', why: "I + am." },
            { q: "Look! They ______ (play) football now.", options: ["play", "are playing", "played"], correct: 1, tense: 'Present Continuous', why: "Action happening now." },
            { q: "She ______ (like) apples.", options: ["like", "likes", "liking"], correct: 1, tense: 'Present Simple', why: "She + likes." },
            { q: "I promise I ______ (help) you tomorrow.", options: ["will help", "help", "helped"], correct: 0, tense: 'Future Simple', why: "Use 'will' for promises." }
        ]
    },
    {
        id: 'test-elementary-2',
        title: 'Beginner Mastery II',
        level: 'Elementary',
        questions: [
            { q: "By the time we arrived, the party ______ (start).", options: ["started", "had started", "has started"], correct: 1, tense: 'Past Perfect', why: "The party started *before* we arrived." },
            { q: "I ______ (write) a letter at the moment.", options: ["write", "am writing", "wrote"], correct: 1, tense: 'Present Continuous', why: "Happening now." },
            { q: "Water ______ (boil) at 100 degrees.", options: ["boil", "boils", "is boiling"], correct: 1, tense: 'Present Simple', why: "General truth." },
            { q: "I ______ (never / be) to London.", options: ["never was", "have never been", "am never"], correct: 1, tense: 'Present Perfect', why: "Life experience." },
            { q: "He ______ (sleep) when I called him.", options: ["sleeps", "was sleeping", "slept"], correct: 1, tense: 'Past Continuous', why: "Long action interrupted by 'called'." }
        ]
    }
];
