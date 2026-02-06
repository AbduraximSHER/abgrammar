// Configuration for word extraction and translation
const STOPWORDS = new Set([
    // Articles
    'a', 'an', 'the',

    // Common prepositions
    'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'from', 'about', 'as',

    // Conjunctions
    'and', 'or', 'but', 'if', 'so',

    // Pronouns (common)
    'this', 'that', 'these', 'those',

    // Common verbs (to be)
    'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
]);

// Files to scan for word extraction
const CONTENT_FILES = [
    'index.html',
    'scenarios.js',
    'quizzes.js',
    'mixed_quizzes.js',
    'mastery_data.js',
    'nuance_data.js',
    'wild_data.js',
    'temp_parsed_data.js'  // Additional parsed data
];

module.exports = {
    STOPWORDS,
    CONTENT_FILES
};
