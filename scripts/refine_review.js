const fs = require('fs');
const path = require('path');

/**
 * Refined dictionary review - filters false positives and focuses on real issues
 */

const projectRoot = path.join(__dirname, '..');
const dictPath = path.join(projectRoot, 'data', 'dictionary.json');
const reviewPath = path.join(projectRoot, 'data', 'needs_review.json');
const filteredPath = path.join(projectRoot, 'data', 'needs_review_filtered.json');
const checklistPath = path.join(projectRoot, 'data', 'review_checklist.md');

console.log('🔍 Refining dictionary review system...\n');

const dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
const rawReview = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));

// Educational context recommendations for common words
const educationalRecommendations = {
    // Homonyms - prioritize educational/common meaning
    'saw': {
        current: 'ko\'rdi',
        issue: 'homonym',
        meanings: ['ko\'rdi (past of see)', 'arra (cutting tool)'],
        recommended: 'ko\'rdi',
        note: 'Past tense of "see" is primary in educational context'
    },
    'rose': {
        current: 'ko\'tarildi',
        issue: 'homonym',
        meanings: ['ko\'tarildi (past of rise)', 'atirgul (flower)'],
        recommended: 'ko\'tarildi',
        note: 'Past tense of "rise" is primary in grammar lessons'
    },
    'watch': {
        current: 'qo\'l soat',
        issue: 'homonym',
        meanings: ['tomosha qilmoq (verb: to watch)', 'qo\'l soat (noun: timepiece)'],
        recommended: 'tomosha qilmoq',
        note: 'Verb form is more common in educational texts'
    },
    'left': {
        current: 'chap',
        issue: 'homonym',
        meanings: ['chap (direction)', 'ketdi (past of leave)'],
        recommended: 'chap',
        note: 'Direction is more common; "ketdi" would be "left" as verb'
    },
    'present': {
        current: 'hozir',
        issue: 'homonym',
        meanings: ['hozir (time: now)', 'sovg\'a (gift)', 'taqdim etmoq (to present)'],
        recommended: 'hozirgi',
        note: 'For grammar context, "hozirgi" (present tense) is clearer'
    },
    'table': {
        current: 'jadval',
        issue: 'homonym',
        meanings: ['stol (furniture)', 'jadval (chart/table of data)'],
        recommended: 'stol',
        note: 'Physical table is more common in basic English'
    },
    'miss': {
        current: 'sog\'inmoq',
        issue: 'homonym',
        meanings: ['sog\'inmoq (to miss someone)', 'o\'tkazib yubormoq (to miss a target)'],
        recommended: 'sog\'inmoq',
        note: 'Emotional meaning is more common in educational texts'
    },
    'close': {
        current: 'yopmoq',
        issue: 'homonym',
        meanings: ['yopmoq (to close)', 'yaqin (near/close)'],
        recommended: 'yopmoq',
        note: 'Verb form is primary in grammar lessons'
    },
    'scale': {
        current: 'o\'lchov',
        issue: 'homonym',
        meanings: ['o\'lchov (measurement)', 'tarozi (weighing scale)', 'miqyos (scale/size)'],
        recommended: 'miqyos',
        note: 'General "scale" concept is most versatile'
    },
    'place': {
        current: 'joy',
        issue: 'homonym',
        meanings: ['joy (location)', 'qo\'ymoq (to place/put)'],
        recommended: 'joy',
        note: 'Noun form is more common'
    },
    'fly': {
        current: 'uchmoq',
        issue: 'homonym',
        meanings: ['uchmoq (to fly)', 'chivin (insect)'],
        recommended: 'uchmoq',
        note: 'Verb is primary in educational context'
    },
    'can': {
        current: '-a olmoq',
        issue: 'homonym',
        meanings: ['-a olmoq (modal: able to)', 'konserva (tin can)'],
        recommended: '-a olmoq',
        note: 'Modal verb is essential for grammar'
    },
    'play': {
        current: 'o\'ynamoq',
        issue: 'homonym',
        meanings: ['o\'ynamoq (to play)', 'spektakl (theater play)'],
        recommended: 'o\'ynamoq',
        note: 'Verb is more common in basic English'
    },
    'bank': {
        current: 'bank',
        issue: 'homonym',
        meanings: ['bank (financial)', 'qirg\'oq (river bank)'],
        recommended: 'bank',
        note: 'Financial institution is more common'
    },
    'park': {
        current: 'park',
        issue: 'homonym',
        meanings: ['park (noun: green space)', 'to\'xtatmoq (to park a car)'],
        recommended: 'park',
        note: 'Noun is more common in basic vocabulary'
    }
};

// Filter out false positives
const filtered = {
    homonyms: [],
    phrasalVerbs: [],
    contextDependent: [],
    genuineIssues: []
};

// Process homonyms
rawReview.flaggedWords.homonyms.forEach(item => {
    const recommendation = educationalRecommendations[item.word];
    if (recommendation) {
        filtered.homonyms.push({
            ...item,
            ...recommendation
        });
    } else {
        filtered.homonyms.push(item);
    }
});

// Process phrasal verbs - only include if they're genuinely ambiguous
const phrasalVerbsToReview = ['get', 'take', 'make', 'give', 'go', 'come', 'look', 'put', 'set'];
rawReview.flaggedWords.phrasalVerbs.forEach(item => {
    if (phrasalVerbsToReview.includes(item.word)) {
        filtered.phrasalVerbs.push({
            ...item,
            note: 'Common in phrasal verbs - base meaning may be insufficient'
        });
    }
});

// Process context-dependent - only prepositions that are truly ambiguous
const contextToReview = ['up', 'down', 'over', 'through', 'between', 'into'];
rawReview.flaggedWords.contextDependent.forEach(item => {
    if (contextToReview.includes(item.word)) {
        filtered.contextDependent.push(item);
    }
});

// Check for genuine semantic issues (not just HTML entities)
const genuineIssues = [];

// Check "possible errors" but exclude HTML entities
rawReview.flaggedWords.possibleErrors?.forEach(item => {
    // Only include if it has actual problematic content (not just colons/parentheses)
    if (item.translation && /\d{3,}|http|www|\.com/.test(item.translation)) {
        genuineIssues.push({
            word: item.word,
            translation: item.translation,
            reason: 'Contains numbers, URLs, or technical content',
            issue: 'corruption'
        });
    }
});

filtered.genuineIssues = genuineIssues;

// Calculate summary
const totalFiltered = filtered.homonyms.length + filtered.phrasalVerbs.length +
    filtered.contextDependent.length + filtered.genuineIssues.length;

const summary = {
    totalWords: rawReview.totalWords,
    originalFlagged: rawReview.totalFlagged,
    afterFiltering: totalFiltered,
    removed: rawReview.totalFlagged - totalFiltered,
    categories: {
        homonyms: filtered.homonyms.length,
        phrasalVerbs: filtered.phrasalVerbs.length,
        contextDependent: filtered.contextDependent.length,
        genuineIssues: filtered.genuineIssues.length
    },
    flaggedWords: filtered,
    generatedAt: new Date().toISOString()
};

// Write filtered review
fs.writeFileSync(filteredPath, JSON.stringify(summary, null, 2));

// Generate human-friendly checklist
let checklist = `# Dictionary Review Checklist

**Generated**: ${new Date().toISOString().split('T')[0]}  
**Total entries to review**: ${totalFiltered}

> **Instructions**: Review each entry and verify the translation is appropriate for an educational/grammar learning context.

---

## 1. Homonyms (${filtered.homonyms.length} entries)

Words with multiple meanings in English. Verify the chosen meaning is appropriate for educational context.

`;

filtered.homonyms.forEach((item, idx) => {
    checklist += `### ${idx + 1}. **${item.word}**\n\n`;
    checklist += `- **Current translation**: ${item.current || item.translation}\n`;
    checklist += `- **Issue**: ${item.reason}\n`;
    if (item.meanings) {
        checklist += `- **Possible meanings**:\n`;
        item.meanings.forEach(m => checklist += `  - ${m}\n`);
    }
    if (item.recommended) {
        checklist += `- **✅ Recommended**: ${item.recommended}\n`;
    }
    if (item.note) {
        checklist += `- **Note**: ${item.note}\n`;
    }
    checklist += '\n---\n\n';
});

checklist += `## 2. Phrasal Verbs (${filtered.phrasalVerbs.length} entries)

Common verbs used in phrasal combinations. Base translation should cover the most common standalone usage.

`;

filtered.phrasalVerbs.forEach((item, idx) => {
    checklist += `### ${idx + 1}. **${item.word}**\n\n`;
    checklist += `- **Current translation**: ${item.translation}\n`;
    checklist += `- **Note**: ${item.note}\n`;
    checklist += `- **Common phrasal verbs**: ${item.word} up, ${item.word} down, ${item.word} out, ${item.word} in\n`;
    checklist += '\n---\n\n';
});

checklist += `## 3. Context-Dependent (${filtered.contextDependent.length} entries)

Prepositions and particles whose meaning varies significantly by context.

`;

filtered.contextDependent.forEach((item, idx) => {
    checklist += `### ${idx + 1}. **${item.word}**\n\n`;
    checklist += `- **Current translation**: ${item.translation}\n`;
    checklist += `- **Issue**: ${item.reason}\n`;
    checklist += `- **Note**: Verify this is the most common/useful translation for learners\n`;
    checklist += '\n---\n\n';
});

if (filtered.genuineIssues.length > 0) {
    checklist += `## 4. Genuine Issues (${filtered.genuineIssues.length} entries)

Entries with clear corruption or errors that need correction.

`;

    filtered.genuineIssues.forEach((item, idx) => {
        checklist += `### ${idx + 1}. **${item.word}**\n\n`;
        checklist += `- **Current translation**: ${item.translation}\n`;
        checklist += `- **Issue**: ${item.reason}\n`;
        checklist += `- **Action needed**: Replace with correct Uzbek translation\n`;
        checklist += '\n---\n\n';
    });
}

fs.writeFileSync(checklistPath, checklist);

// Print summary
console.log('✅ REFINED REVIEW SUMMARY');
console.log('='.repeat(60));
console.log(`Original flagged entries: ${rawReview.totalFlagged}`);
console.log(`False positives removed: ${rawReview.totalFlagged - totalFiltered}`);
console.log(`Entries requiring review: ${totalFiltered} (${(totalFiltered / rawReview.totalWords * 100).toFixed(1)}%)`);
console.log('');
console.log('By category:');
console.log(`  Homonyms: ${filtered.homonyms.length}`);
console.log(`  Phrasal verbs: ${filtered.phrasalVerbs.length}`);
console.log(`  Context-dependent: ${filtered.contextDependent.length}`);
console.log(`  Genuine issues: ${filtered.genuineIssues.length}`);
console.log('');
console.log(`📄 Filtered review: ${filteredPath}`);
console.log(`📋 Human checklist: ${checklistPath}`);
console.log('');
console.log('💡 Next steps:');
console.log('   1. Review the checklist in review_checklist.md');
console.log('   2. Verify recommended translations are appropriate');
console.log('   3. Make manual corrections to dictionary.json if needed');
console.log('   4. Run "npm run build:dict" to rebuild');
