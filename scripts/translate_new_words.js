const fs = require('fs');
const path = require('path');
const https = require('https');

// Translate new words using MyMemory API (free, no key needed)
async function translateNewWords() {
    const projectRoot = path.join(__dirname, '..');
    const extractedPath = path.join(projectRoot, 'data', 'extracted_words.json');
    const dictPath = path.join(projectRoot, 'data', 'dictionary.json');

    console.log('🌐 Translating new words (EN → UZ)...\n');

    // Load extracted words
    if (!fs.existsSync(extractedPath)) {
        console.error('❌ Error: extracted_words.json not found!');
        console.log('Run "npm run extract" first.');
        process.exit(1);
    }

    const extractedWords = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));

    // Load existing dictionary (or create empty)
    let dictionary = {};
    if (fs.existsSync(dictPath)) {
        dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf-8'));
        console.log(`📖 Loaded existing dictionary: ${Object.keys(dictionary).length} words`);
    }

    // Find new words
    const newWords = extractedWords.filter(word => !(word in dictionary));

    if (newWords.length === 0) {
        console.log('✅ No new words to translate. Dictionary is up to date!\n');
        return;
    }

    console.log(`🆕 Found ${newWords.length} new words to translate\n`);

    // Translate new words
    let translated = 0;
    let failed = 0;

    for (let i = 0; i < newWords.length; i++) {
        const word = newWords[i];

        try {
            const translation = await translateWord(word);
            dictionary[word] = translation;
            translated++;

            process.stdout.write(`\r✓ Translated: ${translated}/${newWords.length} (${word} → ${translation})`);

            // Rate limiting: 100ms delay
            await sleep(100);
        } catch (error) {
            dictionary[word] = ''; // Empty value for failed translations
            failed++;
            console.log(`\n⚠️  Failed to translate: ${word}`);
        }
    }

    console.log(`\n\n📊 Translation complete:`);
    console.log(`   ✅ Successful: ${translated}`);
    console.log(`   ❌ Failed: ${failed}`);

    // Save updated dictionary
    fs.writeFileSync(dictPath, JSON.stringify(dictionary, null, 2));
    console.log(`\n💾 Saved to: ${dictPath}\n`);
}

// Translate a single word using MyMemory API
function translateWord(word) {
    return new Promise((resolve, reject) => {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|uz`;

        https.get(url, (res) => {
            let data = '';

            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.responseStatus === 200 && json.responseData.translatedText) {
                        resolve(json.responseData.translatedText);
                    } else {
                        reject(new Error('Translation failed'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run if called directly
if (require.main === module) {
    translateNewWords().catch(console.error);
}

module.exports = { translateNewWords };
