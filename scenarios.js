const SCENARIO_DATA = [
    {
        id: 'late-arrival',
        title: 'The Party',
        text: 'The party started at 8:00. John arrived at 8:30.',
        question: 'When John arrived, the party ________ started.',
        options: [
            { text: 'has (Present Perfect)', correct: false },
            { text: 'is (Present Continuous)', correct: false },
            { text: 'had (Past Perfect)', correct: true },
            { text: 'was (Past Continuous)', correct: false }
        ],
        explanation: 'The party started before John arrived. We use <strong>Past Perfect</strong> for the first action.',
        tense: 'Past Perfect'
    },
    {
        id: 'burned-cake',
        title: 'The Cake',
        text: 'Marie left the cake in the oven for 3 hours. She came home and smelled smoke.',
        question: 'The cake ________ burned by the time she arrived.',
        options: [
            { text: 'was (Past Simple)', correct: false },
            { text: 'has (Present Perfect)', correct: false },
            { text: 'is (Present Simple)', correct: false },
            { text: 'had (Past Perfect)', correct: true }
        ],
        explanation: 'The cake burned before she arrived. <strong>Past Perfect</strong> is for the older action.',
        tense: 'Past Perfect'
    },
    {
        id: 'dirty-hands',
        title: 'The Garden',
        text: 'Tom has mud on his hands. He is very dirty.',
        question: 'He ________ in the garden all morning.',
        options: [
            { text: 'is working (Present Continuous)', correct: false },
            { text: 'has been working (Pres. Perf. Cont.)', correct: true },
            { text: 'worked (Past Simple)', correct: false },
            { text: 'had been working (Past Perf. Cont.)', correct: false }
        ],
        explanation: 'We use <strong>Present Perfect Continuous</strong> for a recent action with a result (dirty hands).',
        tense: 'Present Perfect Continuous'
    },
    {
        id: 'midnight-work',
        title: 'Study Night',
        text: 'It is 11 PM now. I am still studying.',
        question: 'At midnight tonight, I ________ English.',
        options: [
            { text: 'will study (Future Simple)', correct: false },
            { text: 'will have studied (Future Perfect)', correct: false },
            { text: 'will be studying (Future Continuous)', correct: true },
            { text: 'am studying (Present Continuous)', correct: false }
        ],
        explanation: '<strong>Future Continuous</strong> is for an action in progress at a specific time in the future.',
        tense: 'Future Continuous'
    },
    {
        id: 'graduation-goal',
        title: 'The Test',
        text: 'Lucas is a student. He has a big test in May.',
        question: 'By June, Lucas ________ his test.',
        options: [
            { text: 'will have finished (Future Perfect)', correct: true },
            { text: 'will be finishing (Future Continuous)', correct: false },
            { text: 'will finish (Future Simple)', correct: false },
            { text: 'finishes (Present Simple)', correct: false }
        ],
        explanation: '<strong>Future Perfect</strong> describes an action finished *by* a time in the future.',
        tense: 'Future Perfect'
    },
    {
        id: 'the-interruption',
        title: 'Reading',
        text: 'I was reading a good book. Suddenly, the lights went out.',
        question: 'I ________ when the lights went out.',
        options: [
            { text: 'read (Past Simple)', correct: false },
            { text: 'was reading (Past Continuous)', correct: true },
            { text: 'have read (Present Perfect)', correct: false },
            { text: 'am reading (Present Continuous)', correct: false }
        ],
        explanation: '<strong>Past Continuous</strong> is for the long action. The lights going out is the short action.',
        tense: 'Past Continuous'
    },
    {
        id: 'the-timetable',
        title: 'The Train',
        text: 'The clock says the train is at 9:00 AM.',
        question: 'The train ________ at 9:00 AM.',
        options: [
            { text: 'leaves (Present Simple)', correct: true },
            { text: 'is leaving (Present Continuous)', correct: false },
            { text: 'will leave (Future Simple)', correct: false },
            { text: 'is going to leave (Future Plan)', correct: false }
        ],
        explanation: 'We use <strong>Present Simple</strong> for train schedules and timetables.',
        tense: 'Present Simple'
    },
    {
        id: 'unfounded-prediction',
        title: 'The Game',
        text: 'The team is playing badly, but the fan is happy.',
        question: 'I think they ________ the game!',
        options: [
            { text: 'will win (Future Simple)', correct: true },
            { text: 'are winning (Present Continuous)', correct: false },
            { text: 'will be winning (Future Continuous)', correct: false },
            { text: 'win (Present Simple)', correct: false }
        ],
        explanation: '<strong>Future Simple (Will)</strong> is for a guess or opinion about the future.',
        tense: 'Future Simple'
    }
];
