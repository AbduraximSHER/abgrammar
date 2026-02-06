// Console Verification Script for Grammar-Aware Dictionary
// Copy and paste this into your browser console when viewing index.html

console.log("=== Grammar-Aware Dictionary Verification ===\n");

// 1. Check if GRAMMAR_INFO exists
console.log("1. Checking window.GRAMMAR_INFO:");
console.log("   typeof window.GRAMMAR_INFO:", typeof window.GRAMMAR_INFO);
if (typeof window.GRAMMAR_INFO === 'object') {
    console.log("   ✅ GRAMMAR_INFO is defined");
    console.log("   Number of entries:", Object.keys(window.GRAMMAR_INFO).length);
    console.log("   Sample entries:", Object.keys(window.GRAMMAR_INFO).slice(0, 10));
} else {
    console.log("   ❌ GRAMMAR_INFO is NOT defined");
}

console.log("\n2. Checking window.UZ_DICT:");
console.log("   typeof window.UZ_DICT:", typeof window.UZ_DICT);
if (typeof window.UZ_DICT === 'object') {
    console.log("   ✅ UZ_DICT is defined");
    console.log("   Number of entries:", Object.keys(window.UZ_DICT).length);
} else {
    console.log("   ❌ UZ_DICT is NOT defined");
}

console.log("\n3. Testing specific grammar entries:");
const testWords = ['ate', 'eaten', 'better', 'best', 'going', 'eats'];
testWords.forEach(word => {
    const grammar = window.GRAMMAR_INFO?.[word];
    const translation = window.UZ_DICT?.[word];
    console.log(`   "${word}":`, {
        translation: translation || 'NOT FOUND',
        grammar: grammar || 'NO GRAMMAR INFO'
    });
});

console.log("\n4. Dictionary Mode Status:");
console.log("   Toggle element exists:", !!document.getElementById('dict-toggle'));
console.log("   Dictionary enabled:", localStorage.getItem('dict_enabled'));

console.log("\n=== Verification Complete ===");
console.log("\nTo test tooltips:");
console.log("1. Enable Dictionary Mode using the toggle");
console.log("2. Click on words like 'ate', 'better', 'going' to see grammar info");
console.log("3. Click on words like 'apple', 'book' to see translation only");
