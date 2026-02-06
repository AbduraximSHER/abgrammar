// Verification script for corrected dictionary
// Tests that all corrections were applied successfully

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('DICTIONARY CORRECTION VERIFICATION');
console.log('='.repeat(60));

// Load corrected dictionary
const dictPath = path.join(__dirname, '../data/dictionary.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

console.log('\n1. ENTRY COUNT VERIFICATION');
console.log(`   Total entries: ${Object.keys(dict).length}`);
console.log(`   Expected: 836`);
console.log(`   Status: ${Object.keys(dict).length === 836 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n2. CRITICAL CORRECTIONS VERIFICATION');
const criticalTests = [
    { word: 'england', expected: 'Angliya', old: 'Kongo, Dem. Rep.' },
    { word: 'english', expected: 'ingliz tili', old: 'gusto ko ikaw...' },
    { word: 'friend', expected: 'do\'st', old: 'Fransuzcha' },
    { word: 'between', expected: 'orasida', old: 'Shvetsiya' },
    { word: 'who', expected: 'kim', old: 'JSST' },
    { word: 'won', expected: 'yutdi', old: 'Von' },
    { word: 'wrote', expected: 'yozdi', old: 'Написал' }
];

let criticalPass = 0;
criticalTests.forEach(test => {
    const actual = dict[test.word];
    const pass = actual === test.expected;
    console.log(`   ${test.word}: ${actual} ${pass ? '✅' : '❌'}`);
    if (pass) criticalPass++;
});
console.log(`   Result: ${criticalPass}/${criticalTests.length} passed`);

console.log('\n3. CORRUPTED ENTRIES VERIFICATION');
const corruptedTests = [
    { word: 'begin', expected: 'boshlamoq', old: 'Beginkeyboard label' },
    { word: 'big', expected: 'katta', old: 'Katta@ title: group Date' },
    { word: 'make', expected: 'qilmoq', old: 'Bluetooth' },
    { word: 'buy', expected: 'sotib olmoq', old: 'Sobit' },
    { word: 'children', expected: 'bolalar', old: 'ma\'lumot berish' }
];

let corruptedPass = 0;
corruptedTests.forEach(test => {
    const actual = dict[test.word];
    const pass = actual === test.expected;
    console.log(`   ${test.word}: ${actual} ${pass ? '✅' : '❌'}`);
    if (pass) corruptedPass++;
});
console.log(`   Result: ${corruptedPass}/${corruptedTests.length} passed`);

console.log('\n4. PART-OF-SPEECH CORRECTIONS VERIFICATION');
const posTests = [
    { word: 'come', expected: 'kelmoq', old: 'tartibsiz fe\'llar' },
    { word: 'saw', expected: 'ko\'rdi', old: 'arra' },
    { word: 'break', expected: 'sindirmoq', old: 'tanaffus' },
    { word: 'plays', expected: 'o\'ynaydi', old: 'spektakllar' },
    { word: 'rose', expected: 'ko\'tarildi', old: 'atirgul' }
];

let posPass = 0;
posTests.forEach(test => {
    const actual = dict[test.word];
    const pass = actual === test.expected;
    console.log(`   ${test.word}: ${actual} ${pass ? '✅' : '❌'}`);
    if (pass) posPass++;
});
console.log(`   Result: ${posPass}/${posTests.length} passed`);

console.log('\n5. NO UNDEFINED VALUES');
const undefinedCount = Object.values(dict).filter(v => v === undefined || v === null).length;
console.log(`   Undefined/null values: ${undefinedCount}`);
console.log(`   Status: ${undefinedCount === 0 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n6. NO HTML/XML ARTIFACTS');
const htmlPattern = /<[^>]+>/;
const xmlCount = Object.values(dict).filter(v => htmlPattern.test(v)).length;
console.log(`   Entries with HTML/XML tags: ${xmlCount}`);
console.log(`   Status: ${xmlCount === 0 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n' + '='.repeat(60));
console.log('OVERALL VERIFICATION RESULT');
console.log('='.repeat(60));

const allPassed =
    Object.keys(dict).length === 836 &&
    criticalPass === criticalTests.length &&
    corruptedPass === corruptedTests.length &&
    posPass === posTests.length &&
    undefinedCount === 0 &&
    xmlCount === 0;

if (allPassed) {
    console.log('✅ ALL TESTS PASSED - Dictionary corrections verified!');
} else {
    console.log('❌ SOME TESTS FAILED - Please review above');
}

console.log('='.repeat(60));
