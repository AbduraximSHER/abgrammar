const NUANCE_DATA = {
    'US': {
        flag: '🇺🇸',
        name: 'United States',
        scenarios: [
            {
                situation: 'You just finished your coffee.',
                example: 'I <strong>just finished</strong> my coffee.',
                rule: 'Use Past Simple with words like "just".',
                color: '#ef4444'
            },
            {
                situation: 'Asking about the weekend.',
                example: '<strong>Did</strong> you have a good weekend?',
                rule: 'Past Simple is common for recent events.',
                color: '#ef4444'
            }
        ]
    },
    'UK': {
        flag: '🇬🇧',
        name: 'United Kingdom',
        scenarios: [
            {
                situation: 'You just finished your coffee.',
                example: 'I <strong>have just finished</strong> my coffee.',
                rule: 'Present Perfect is often used with "just".',
                color: '#2563eb'
            },
            {
                situation: 'Asking about the weekend.',
                example: '<strong>Have</strong> you had a good weekend?',
                rule: 'Present Perfect is common for recent events.',
                color: '#2563eb'
            }
        ]
    }
};
