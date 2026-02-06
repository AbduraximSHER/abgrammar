const fs = require('fs');
const path = require('path');

/**
 * Flag uncertain translations for human review
 * This script identifies translations that may need expert review
 */

const projectRoot = path.join(__dirname, '..');
const dictPath = path.join(projectRoot, 'data', 'dictionary.json');
const reviewPath = path.join(projectRoot, 'data', 'needs_review.json');

console.log('🔍 Scanning dictionary for uncertain translations...\n');

const dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));

// Patterns that indicate uncertainty
const uncertainPatterns = {
    // Multiple possible meanings (homonyms)
    homonyms: [
        'bank', 'bat', 'bear', 'bow', 'can', 'close', 'date', 'fair', 'fall',
        'fine', 'fly', 'kind', 'left', 'light', 'match', 'mean', 'miss', 'park',
        'place', 'plant', 'play', 'point', 'present', 'right', 'ring', 'rose',
        'row', 'saw', 'scale', 'seal', 'season', 'second', 'spring', 'star',
        'stick', 'strike', 'table', 'tear', 'tie', 'trip', 'watch', 'wave', 'well'
    ],

    // Context-dependent words
    contextDependent: [
        'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around',
        'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond',
        'down', 'during', 'inside', 'into', 'near', 'off', 'onto', 'out', 'over',
        'past', 'through', 'toward', 'under', 'until', 'up', 'upon', 'with', 'within'
    ],

    // Phrasal verbs that might be translated as single words
    phrasalVerbRoots: [
        'break', 'bring', 'call', 'carry', 'come', 'cut', 'do', 'fall', 'get',
        'give', 'go', 'hold', 'keep', 'let', 'look', 'make', 'pick', 'pull',
        'put', 'run', 'set', 'show', 'take', 'turn', 'work'
    ]
};

const needsReview = {
    homonyms: [],
    contextDependent: [],
    phrasalVerbs: [],
    shortTranslations: [],
    longTranslations: [],
    unusualCharacters: [],
    possibleErrors: []
};

// Scan dictionary
for (const [word, translation] of Object.entries(dictionary)) {
    const issues = [];

    // Check for homonyms
    if (uncertainPatterns.homonyms.includes(word)) {
        issues.push('homonym');
        needsReview.homonyms.push({
            word,
            translation,
            reason: 'Word has multiple meanings in English'
        });
    }

    // Check for context-dependent prepositions
    if (uncertainPatterns.contextDependent.includes(word)) {
        issues.push('context-dependent');
        needsReview.contextDependent.push({
            word,
            translation,
            reason: 'Meaning varies by context'
        });
    }

    // Check for phrasal verb roots
    if (uncertainPatterns.phrasalVerbRoots.includes(word)) {
        issues.push('phrasal-verb');
        needsReview.phrasalVerbs.push({
            word,
            translation,
            reason: 'Often used in phrasal verbs with different meanings'
        });
    }

    // Check for suspiciously short translations
    if (translation && translation.length < 3 && word.length > 5) {
        issues.push('short-translation');
        needsReview.shortTranslations.push({
            word,
            translation,
            reason: 'Translation seems too short for the word'
        });
    }

    // Check for suspiciously long translations
    if (translation && translation.length > word.length * 3) {
        issues.push('long-translation');
        needsReview.longTranslations.push({
            word,
            translation,
            reason: 'Translation seems unusually long'
        });
    }

    // Check for unusual characters (potential corruption)
    if (translation && /[<>@#$%^&*(){}[\]\\|;:"'`~]/.test(translation)) {
        issues.push('unusual-chars');
        needsReview.unusualCharacters.push({
            word,
            translation,
            reason: 'Contains unusual characters that may indicate corruption'
        });
    }

    // Check for potential errors (numbers, URLs, etc.)
    if (translation && (/\d{2,}|http|www|\.com|\.org/.test(translation))) {
        issues.push('possible-error');
        needsReview.possibleErrors.push({
            word,
            translation,
            reason: 'Contains numbers, URLs, or technical artifacts'
        });
    }
}

// Generate summary
const summary = {
    totalWords: Object.keys(dictionary).length,
    totalFlagged: Object.values(needsReview).reduce((sum, arr) => sum + arr.length, 0),
    categories: {
        homonyms: needsReview.homonyms.length,
        contextDependent: needsReview.contextDependent.length,
        phrasalVerbs: needsReview.phrasalVerbs.length,
        shortTranslations: needsReview.shortTranslations.length,
        longTranslations: needsReview.longTranslations.length,
        unusualCharacters: needsReview.unusualCharacters.length,
        possibleErrors: needsReview.possibleErrors.length
    },
    flaggedWords: needsReview,
    generatedAt: new Date().toISOString()
};

// Write review file
fs.writeFileSync(reviewPath, JSON.stringify(summary, null, 2));

console.log('📊 REVIEW SUMMARY');
console.log('='.repeat(60));
console.log(`Total words in dictionary: ${summary.totalWords}`);
console.log(`Words flagged for review: ${summary.totalFlagged} (${(summary.totalFlagged / summary.totalWords * 100).toFixed(1)}%)`);
console.log('');
console.log('By category:');
console.log(`  Homonyms (multiple meanings): ${summary.categories.homonyms}`);
console.log(`  Context-dependent: ${summary.categories.contextDependent}`);
console.log(`  Phrasal verb roots: ${summary.categories.phrasalVerbs}`);
console.log(`  Short translations: ${summary.categories.shortTranslations}`);
console.log(`  Long translations: ${summary.categories.longTranslations}`);
console.log(`  Unusual characters: ${summary.categories.unusualCharacters}`);
console.log(`  Possible errors: ${summary.categories.possibleErrors}`);
console.log('');
console.log(`✅ Review list saved to: ${reviewPath}`);
console.log('');
console.log('💡 Next steps:');
console.log('   1. Review the flagged translations in needs_review.json');
console.log('   2. Manually verify and correct uncertain entries');
console.log('   3. Run "npm run build:dict" to rebuild dictionary.js');
