const fs = require('fs');
const path = require('path');
const { STOPWORDS, CONTENT_FILES } = require('./config');

// Extract all unique English words from content files
function extractWords() {
    const allWords = new Set();
    const projectRoot = path.join(__dirname, '..');

    console.log('🔍 Extracting words from content files...\n');

    CONTENT_FILES.forEach(filename => {
        const filePath = path.join(projectRoot, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️  File not found: ${filename}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        const words = extractWordsFromContent(content, filename);

        words.forEach(word => allWords.add(word));
        console.log(`✓ ${filename}: ${words.size} unique words`);
    });

    // Convert to sorted array
    const sortedWords = Array.from(allWords).sort();

    console.log(`\n📊 Total unique words extracted: ${sortedWords.length}`);
    console.log(`🚫 Stopwords filtered: ${STOPWORDS.size}`);

    // Save to JSON
    const outputPath = path.join(projectRoot, 'data', 'extracted_words.json');
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(sortedWords, null, 2));
    console.log(`\n✅ Saved to: ${outputPath}`);

    return sortedWords;
}

// Extract words from a single file's content
function extractWordsFromContent(content, filename) {
    const words = new Set();

    // Remove HTML tags if HTML file
    if (filename.endsWith('.html')) {
        content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
        content = content.replace(/<[^>]+>/g, ' ');
    }

    // Remove JavaScript comments and code syntax
    content = content.replace(/\/\*[\s\S]*?\*\//g, ' '); // Block comments
    content = content.replace(/\/\/.*/g, ' '); // Line comments

    // Extract words: split on non-letter characters
    const tokens = content.match(/[a-zA-Z]+/g) || [];

    tokens.forEach(token => {
        const word = token.toLowerCase().trim();

        // Filter criteria
        if (word.length < 2) return; // Too short
        if (STOPWORDS.has(word)) return; // Stopword
        if (/^\d+$/.test(word)) return; // Numbers only

        words.add(word);
    });

    return words;
}

// Run if called directly
if (require.main === module) {
    extractWords();
}

module.exports = { extractWords };
