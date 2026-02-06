const { extractWords } = require('./extract_words');
const { translateNewWords } = require('./translate_new_words');
const { execSync } = require('child_process');
const path = require('path');

/**
 * Automated Translation Pipeline
 * 
 * This script automates the entire workflow:
 * 1. Extract all English words from content files
 * 2. Identify new words not in dictionary
 * 3. Translate new words using MyMemory API
 * 4. Update dictionary.json
 * 5. Rebuild dictionary.js
 */

async function runPipeline() {
    console.log('🚀 Starting Auto-Translation Pipeline\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Extract words
        console.log('\n📝 STEP 1: Extracting words from content files...\n');
        const extractedWords = extractWords();
        console.log(`\n✅ Extracted ${extractedWords.length} unique words\n`);

        // Step 2: Translate new words
        console.log('='.repeat(60));
        console.log('\n🌐 STEP 2: Translating new words (EN → UZ)...\n');
        await translateNewWords();

        // Step 3: Rebuild dictionary.js
        console.log('\n' + '='.repeat(60));
        console.log('\n🔨 STEP 3: Rebuilding dictionary.js...\n');

        const scriptPath = path.join(__dirname, 'generate_dict_js.js');
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });

        console.log('\n' + '='.repeat(60));
        console.log('\n✨ AUTO-TRANSLATION PIPELINE COMPLETE!\n');
        console.log('📋 Summary:');
        console.log('   ✅ Words extracted from content files');
        console.log('   ✅ New words translated to Uzbek');
        console.log('   ✅ dictionary.js rebuilt');
        console.log('\n💡 Next steps:');
        console.log('   1. Review new translations in data/dictionary.json');
        console.log('   2. Manually correct any inaccurate translations');
        console.log('   3. Re-run "npm run build:dict" if you make manual changes');
        console.log('   4. Test the dictionary on your website\n');

    } catch (error) {
        console.error('\n❌ Pipeline failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runPipeline().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { runPipeline };
