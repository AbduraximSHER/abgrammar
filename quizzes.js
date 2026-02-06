const QUIZ_DATA = {
    'past-simple': {
        easy: [
            { q: "What is the past form of 'go'?", options: ["go", "went", "gone"], correct: 1, why: "'Went' is the past form of 'go'." },
            { q: "I ____ (find) a coin yesterday.", options: ["find", "found", "finded"], correct: 1, why: "We use 'found' for the past." },
            { q: "She ____ (be) happy yesterday.", options: ["is", "was", "were"], correct: 1, why: "'She was' is correct." },
            { q: "They ____ (play) football last Sunday.", options: ["play", "played", "playing"], correct: 1, why: "Add -ed for regular past verbs." },
            { q: "He ____ (run) to school this morning.", options: ["run", "ran", "running"], correct: 1, why: "'Ran' is the past of 'run'." }
        ],
        medium: [
            { q: "They ____ (not / see) the movie last night.", options: ["didn't saw", "don't see", "didn't see"], correct: 2, why: "Use 'didn't' + basic verb." },
            { q: "____ you ____ (go) to the party?", options: ["Did / went", "Do / go", "Did / go"], correct: 2, why: "Questions use 'Did' + basic verb." },
            { q: "I ____ (not / buy) any clothes yesterday.", options: ["didn't bought", "didn't buy", "not buy"], correct: 1, why: "Use 'didn't' + buy." }
        ],
        hard: [
            { q: "I ____ (wake) up early today.", options: ["wake", "waked", "woke"], correct: 2, why: "'Woke' is the past of 'wake'." },
            { q: "They ____ (meet) in 2010.", options: ["meet", "met", "have met"], correct: 1, why: "Use Past Simple for dates." }
        ]
    },
    'present-simple': {
        easy: [
            { q: "She ____ (like) milk.", options: ["like", "likes", "liking"], correct: 1, why: "Add -s for he/she/it." },
            { q: "They ____ (work) in a bank.", options: ["work", "works", "working"], correct: 0, why: "They + work." },
            { q: "I ____ (drink) water every day.", options: ["drink", "drinks", "drinking"], correct: 0, why: "I + drink." }
        ],
        medium: [
            { q: "____ you often ____ to the gym?", options: ["Do / go", "Does / go", "Are / going"], correct: 0, why: "Use 'Do' for questions with 'you'." },
            { q: "He ____ (not / play) the guitar.", options: ["don't play", "doesn't plays", "doesn't play"], correct: 2, why: "He + doesn't + play." }
        ],
        hard: [
            { q: "Our train ____ (leave) at 8:00 tomorrow.", options: ["leave", "is leaving", "leaves"], correct: 2, why: "Use Present Simple for schedules." }
        ]
    },
    'present-continuous': {
        easy: [
            { q: "I ____ (read) a book now.", options: ["read", "am reading", "is reading"], correct: 1, why: "Use am + -ing for things happening now." },
            { q: "Look! It ____ (snow).", options: ["snows", "is snowing", "was snowing"], correct: 1, why: "It is happening now." }
        ],
        medium: [
            { q: "I ____ (meet) my friend at 5 PM today.", options: ["meet", "will meet", "am meeting"], correct: 2, why: "Can use Present Continuous for plans." }
        ],
        hard: [
            { q: "My English ____ (get) better.", options: ["get", "gets", "is getting"], correct: 2, why: "Use -ing for changes." }
        ]
    }
};
// Truncated for brevity but follows this elementary pattern for all tenses.
