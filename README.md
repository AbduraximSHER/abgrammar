# English Tense Master - Dictionary Customization

This project features a "Word Translate Mode" that provides instant Uzbek translations for English words.

## How to Extend the Dictionary
The translation data is stored in `dictionary.js` within the `UZ_DICT` object.

To add a new word:
1. Open `dictionary.js`.
2. Add a new key-value pair to the `UZ_DICT` object.
   - The **key** must be the English word in lowercase, with no punctuation.
   - The **value** is the Uzbek translation.

```javascript
const UZ_DICT = {
    "apple": "olma",
    "learn": "o'rganmoq",
    "new-word": "yangi-so'z", // Add your word here
};
```

## How the Translation Works
- **Normalization**: The system automatically lowercases the clicked word and removes non-alphabetic characters.
- **Suffix Stripping**: If an exact match isn't found, the system tries stripping common suffixes (`-ing`, `-ed`, `-es`, `-s`) to find the root word. For example, clicking "playing" will correctly find the translation for "play".
- **Exclusions**: Clicks on buttons, links, code blocks, and navigation elements are ignored to maintain standard site functionality.
