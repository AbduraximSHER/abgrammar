# Auto-Translation Pipeline

Automated system for extracting English words from content and translating them to Uzbek.

## Quick Start

```bash
# Run the complete pipeline
npm run pipeline

# Or run individual steps:
npm run extract      # Extract words from content
npm run translate    # Translate new words
npm run build:dict   # Rebuild dictionary.js
```

## How It Works

### 1. Word Extraction (`extract_words.js`)
- Scans all content files (HTML, JS)
- Extracts unique English words
- Filters out stopwords (a, the, is, etc.)
- Saves to `data/extracted_words.json`

### 2. Translation (`translate_new_words.js`)
- Compares extracted words with existing dictionary
- Identifies new words
- Translates using MyMemory API (free, no key needed)
- Updates `data/dictionary.json`
- Rate-limited to 100ms per word

### 3. Dictionary Build (`generate_dict_js.js`)
- Reads `dictionary.json` and `grammar_info.json`
- Generates `dictionary.js` with global exports
- Includes both translations and grammar metadata

## Configuration

Edit `scripts/config.js` to customize:

```javascript
// Files to scan for words
const CONTENT_FILES = [
    'index.html',
    'mastery_data.js',
    'scenarios.js',
    'wild_data.js',
    'quiz_data.js'
];

// Words to exclude from extraction
const STOPWORDS = new Set([
    'a', 'an', 'the', 'is', 'are', ...
]);
```

## API Information

**MyMemory Translation API**
- Free tier: 1000 words/day
- No API key required
- Language pair: English → Uzbek (en|uz)
- Endpoint: `https://api.mymemory.translated.net/get`

## Manual Review

After running the pipeline:

1. Check `data/dictionary.json` for new entries
2. Review translations for accuracy
3. Correct any errors manually
4. Run `npm run build:dict` to rebuild

## Workflow Example

```bash
# 1. Add new content to your site
# 2. Run the pipeline
npm run pipeline

# 3. Review new translations
# Check data/dictionary.json

# 4. Make manual corrections if needed
# Edit dictionary.json

# 5. Rebuild if you made changes
npm run build:dict

# 6. Test on your website
# Enable Dictionary Mode and click words
```

## Files Generated

- `data/extracted_words.json` - All unique words from content
- `data/dictionary.json` - EN→UZ translation pairs
- `dictionary.js` - Browser-ready dictionary with globals

## Troubleshooting

**"No new words to translate"**
- All words already in dictionary
- This is normal after first run

**Translation API errors**
- Check internet connection
- May hit rate limit (1000 words/day)
- Failed translations saved as empty strings

**Words not appearing in tooltips**
- Run `npm run build:dict` after changes
- Clear browser cache
- Check browser console for errors
