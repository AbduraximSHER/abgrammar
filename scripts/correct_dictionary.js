// Dictionary Correction Script
// Systematically corrects translation errors in dictionary.json

const fs = require('fs');
const path = require('path');

// Load original dictionary
const dictPath = path.join(__dirname, '../data/dictionary.json');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Change log
const changes = [];

function correctEntry(word, newTranslation, reason, category) {
    const oldTranslation = dict[word];
    if (oldTranslation !== newTranslation) {
        changes.push({
            word,
            old: oldTranslation,
            new: newTranslation,
            reason,
            category
        });
        dict[word] = newTranslation;
    }
}

console.log('Starting dictionary corrections...\n');

// ===== PHASE 1: CRITICAL ERRORS =====
console.log('Phase 1: Fixing critical errors (corrupted, completely wrong)...');

// Completely wrong translations
correctEntry('between', 'orasida', 'Was "Shvetsiya" (Sweden) - completely wrong word', 'CRITICAL');
correctEntry('england', 'Angliya', 'Was "Kongo, Dem. Rep." - wrong country', 'CRITICAL');
correctEntry('english', 'ingliz tili', 'Was Filipino phrase - wrong language', 'CRITICAL');
correctEntry('friend', 'do\'st', 'Was "Fransuzcha" (French) - wrong word', 'CRITICAL');
correctEntry('who', 'kim', 'Was "JSST" - corrupted', 'CRITICAL');
correctEntry('won', 'yutdi', 'Was "Von" - wrong', 'CRITICAL');
correctEntry('wrote', 'yozdi', 'Was Russian "Написал" - wrong language', 'CRITICAL');

// Corrupted with technical artifacts
correctEntry('begin', 'boshlamoq', 'Removed "keyboard label" artifact', 'CORRUPTED');
correctEntry('big', 'katta', 'Removed "@ title: group Date" artifact', 'CORRUPTED');
correctEntry('cont', 'davom', 'Removed HTML tags', 'CORRUPTED');
correctEntry('buy', 'sotib olmoq', 'Was "Sobit" - corrupted', 'CORRUPTED');
correctEntry('make', 'qilmoq', 'Was "Bluetooth" - technical artifact', 'CORRUPTED');
correctEntry('master', 'usta', 'Was "PhD HOZIR" - corrupted', 'CORRUPTED');
correctEntry('win', 'yutmoq', 'Was "Tizim" (System) - wrong', 'CORRUPTED');
correctEntry('children', 'bolalar', 'Was "ma\'lumot berish" - corrupted', 'CORRUPTED');
correctEntry('choose', 'tanlash', 'Removed UI artifact', 'CORRUPTED');
correctEntry('christmas', 'Rojdestvo', 'Was "TristanName" - corrupted', 'CORRUPTED');
correctEntry('category', 'kategoriya', 'Removed technical artifact', 'CORRUPTED');
correctEntry('changes', 'o\'zgarishlar', 'Removed UI artifact', 'CORRUPTED');
correctEntry('contract', 'shartnoma', 'Was Russian/corrupted', 'CORRUPTED');
correctEntry('dirty', 'iflos', 'Was UI message - corrupted', 'CORRUPTED');
correctEntry('do', 'qilmoq', 'Was "QILING ..." - corrupted', 'CORRUPTED');
correctEntry('drag', 'sudrab tortmoq', 'Removed UI artifact', 'CORRUPTED');
correctEntry('draws', 'chizadi', 'Was "Duranglar" - wrong', 'CORRUPTED');
correctEntry('easy', 'oson', 'Was Russian "Легкий"', 'CORRUPTED');
correctEntry('elementary', 'boshlang\'ich', 'Was Russian phrase', 'CORRUPTED');
correctEntry('end', 'oxiri', 'Was "Yena" - typo', 'CORRUPTED');
correctEntry('evening', 'kechqurun', 'Was "BeninName" - corrupted', 'CORRUPTED');
correctEntry('example', 'misol', 'Was "Rangi:" - corrupted', 'CORRUPTED');
correctEntry('examples', 'misollar', 'Was Russian "Намуналар"', 'CORRUPTED');
correctEntry('experience', 'tajriba', 'Removed XML artifact', 'CORRUPTED');
correctEntry('family', 'oila', 'Removed excessive whitespace', 'CORRUPTED');
correctEntry('fan', 'muxlis', 'Was "Sovutgich" (refrigerator) - wrong meaning', 'CORRUPTED');
correctEntry('fast', 'tez', 'Removed UI artifact', 'CORRUPTED');
correctEntry('first', 'birinchi', 'Was Russian "Биринчи"', 'CORRUPTED');
correctEntry('flowers', 'gullar', 'Removed "Comment" artifact', 'CORRUPTED');
correctEntry('football', 'futbol', 'Was "Name" - corrupted', 'CORRUPTED');
correctEntry('found', 'topdi', 'Was "Topilmagan" (not found) - opposite meaning', 'CORRUPTED');
correctEntry('future', 'kelajak', 'Was "Description" - corrupted', 'CORRUPTED');

console.log(`Phase 1 complete: ${changes.filter(c => c.category === 'CRITICAL' || c.category === 'CORRUPTED').length} corrections\n`);

// ===== PHASE 2: WRONG PART-OF-SPEECH =====
console.log('Phase 2: Fixing wrong part-of-speech translations...');

// Verbs translated as nouns or wrong forms
correctEntry('come', 'kelmoq', 'Was "tartibsiz fe\'llar" (irregular verbs) - meta description, not translation', 'PART_OF_SPEECH');
correctEntry('go', 'bormoq', 'Was "O\'tish" (transition) - wrong, need verb', 'PART_OF_SPEECH');
correctEntry('break', 'sindirmoq', 'Was "tanaffus" (recess) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('saw', 'ko\'rdi', 'Was "arra" (tool) - wrong, this is past tense of see', 'PART_OF_SPEECH');
correctEntry('blow', 'puflash', 'Was "zarba" (strike) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('drawing', 'chizish', 'Was "chizma" (diagram) - noun, need gerund', 'PART_OF_SPEECH');
correctEntry('drinking', 'ichish', 'Was "ichimlik ichish" - redundant', 'PART_OF_SPEECH');
correctEntry('look', 'qaramoq', 'Was "Ko\'rinishi" (appearance) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('plays', 'o\'ynaydi', 'Was "spektakllar" (theatrical plays) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('works', 'ishlaydi', 'Was "asarlar" (literary works) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('leaves', 'ketadi', 'Was "Yaproqlar" (tree leaves) - noun, need verb', 'PART_OF_SPEECH');
correctEntry('rose', 'ko\'tarildi', 'Was "atirgul" (flower) - noun, this is past tense of rise', 'PART_OF_SPEECH');
correctEntry('can', '-a olmoq', 'Was "konserva" (tin can) - noun, this is modal verb', 'PART_OF_SPEECH');
correctEntry('will', '-moq', 'Was "bo\'ladi" - this is future auxiliary, not full verb', 'PART_OF_SPEECH');
correctEntry('close', 'yopmoq', 'Was "yoping" (imperative) - need infinitive', 'PART_OF_SPEECH');
correctEntry('open', 'ochmoq', 'Was "ochiq" (adjective) - need verb', 'PART_OF_SPEECH');
correctEntry('start', 'boshlamoq', 'Was "Shan" - wrong word', 'PART_OF_SPEECH');
correctEntry('find', 'topmoq', 'Was "Topish" - gerund, need infinitive', 'PART_OF_SPEECH');
correctEntry('finish', 'tugatmoq', 'Was "Tugatish" - gerund, need infinitive', 'PART_OF_SPEECH');
correctEntry('help', 'yordam bermoq', 'Was "Yordam" - noun, need verb', 'PART_OF_SPEECH');
correctEntry('work', 'ish', 'Was "Ish" - correct but inconsistent capitalization', 'PART_OF_SPEECH');

console.log(`Phase 2 complete: ${changes.filter(c => c.category === 'PART_OF_SPEECH').length} corrections\n`);

// ===== PHASE 3: UNNATURAL/LITERAL TRANSLATIONS =====
console.log('Phase 3: Fixing unnatural/literal translations...');

correctEntry('hot', 'issiq', 'Was "Mashxur" (popular) - wrong meaning', 'UNNATURAL');
correctEntry('simple', 'oddiy', 'Was "Yoqish" (turn on) - wrong', 'UNNATURAL');
correctEntry('away', 'uzoqda', 'Was "Tashqarida" (outside) - less natural', 'UNNATURAL');
correctEntry('back', 'orqaga', 'Was "orqa" - noun form, need adverb', 'UNNATURAL');
correctEntry('happy', 'baxtli', 'Was "Baxt" (happiness) - noun, need adjective', 'UNNATURAL');
correctEntry('hard', 'qiyin', 'Was "Murakkab" (complex) - less common for "hard"', 'UNNATURAL');
correctEntry('head', 'bosh', 'Was "-bosh" with hyphen - formatting error', 'UNNATURAL');
correctEntry('here', 'bu yerda', 'Removed colon artifact', 'UNNATURAL');
correctEntry('hidden', 'yashirin', 'Was UI message - wrong', 'UNNATURAL');
correctEntry('home', 'uy', 'Was "Bosh sahifa" (homepage) - wrong context', 'UNNATURAL');
correctEntry('humans', 'odamlar', 'Removed XML tags', 'UNNATURAL');
correctEntry('icon', 'belgi', 'Was "Yorliq" (label) - less accurate', 'UNNATURAL');
correctEntry('ii', 'ikkinchi', 'Was "Otasini ismi:" - corrupted', 'UNNATURAL');
correctEntry('interesting', 'qiziqarli', 'Removed UI artifact', 'UNNATURAL');
correctEntry('it', 'u', 'Was "IT " with space - formatting', 'UNNATURAL');
correctEntry('job', 'ish', 'Was "Ishlar" (plural) - wrong form', 'UNNATURAL');
correctEntry('journalist', 'jurnalist', 'Was Russian "Журналист"', 'UNNATURAL');
correctEntry('knocked', 'taqillatdi', 'Removed period artifact', 'UNNATURAL');
correctEntry('last', 'oxirgi', 'Removed » artifact', 'UNNATURAL');
correctEntry('launch', 'ishga tushirish', 'Was "QShortcut" - UI artifact', 'UNNATURAL');
correctEntry('learn', 'o\'rganmoq', 'Removed period artifact', 'UNNATURAL');
correctEntry('leave', 'ketmoq', 'Was Russian "Тарк этиш"', 'UNNATURAL');
correctEntry('leaves', 'ketadi', 'Removed quote artifacts', 'UNNATURAL');
correctEntry('life', 'hayot', 'Was "Wanted" - wrong', 'UNNATURAL');
correctEntry('lights', 'chiroqlar', 'Was "CHORLAR" - typo', 'UNNATURAL');
correctEntry('local', 'mahalliy', 'Was Russian "Локал"', 'UNNATURAL');
correctEntry('lost', 'yo\'qotdi', 'Was Russian "Йўқолди"', 'UNNATURAL');
correctEntry('meeting', 'uchrashuv', 'Was "Name" - corrupted', 'UNNATURAL');
correctEntry('midnight', 'yarim tun', 'Was "Tun" (night) - less specific', 'UNNATURAL');
correctEntry('miss', 'sog\'inmoq', 'Removed corrupted artifact', 'UNNATURAL');
correctEntry('morning', 'ertalab', 'Was "Good morning" - phrase, not translation', 'UNNATURAL');
correctEntry('most', 'eng ko\'p', 'Was Russian "Кўпроқ қисми"', 'UNNATURAL');
correctEntry('name', 'ism', 'Was "Foydalanuvchi" (user) - wrong', 'UNNATURAL');
correctEntry('night', 'kecha', 'Removed corrupted artifact', 'UNNATURAL');
correctEntry('not', 'emas', 'Was "GnotskiComment" - corrupted', 'UNNATURAL');
correctEntry('nothing', 'hech narsa', 'Removed & artifact', 'UNNATURAL');
correctEntry('now', 'hozir', 'Was "darhol" (immediately) - less common', 'UNNATURAL');
correctEntry('out', 'tashqari', 'Was "Yuborish" (send) - wrong', 'UNNATURAL');
correctEntry('place', 'joy', 'Was "saqlang." (save) - wrong', 'UNNATURAL');
correctEntry('plan', 'reja', 'Was "PlanGenericName" - corrupted', 'UNNATURAL');
correctEntry('queens', 'malikalar', 'Was "Name" - corrupted', 'UNNATURAL');
correctEntry('quick', 'tez', 'Was "Tezlash" (acceleration) - noun', 'UNNATURAL');
correctEntry('quiet', 'jim', 'Was "Jimjiloq" - less common form', 'UNNATURAL');
correctEntry('quote', 'iqtibos', 'Was "Taklif" (offer) - wrong', 'UNNATURAL');
correctEntry('raining', 'yomg\'ir yog\'moqda', 'Was just "yomg\'ir" - incomplete', 'UNNATURAL');
correctEntry('reading', 'o\'qish', 'Removed UI artifact', 'UNNATURAL');
correctEntry('reads', 'o\'qiydi', 'Was "O\'qishlar" (readings) - noun', 'UNNATURAL');
correctEntry('really', 'haqiqatan', 'Was "voy yog\'e" - slang/corrupted', 'UNNATURAL');
correctEntry('regional', 'mintaqaviy', 'Removed UI artifact', 'UNNATURAL');
correctEntry('result', 'natija', 'Was Russian "Натижка"', 'UNNATURAL');
correctEntry('risen', 'ko\'tarilgan', 'Was "tirildi" (resurrected) - wrong meaning', 'UNNATURAL');
correctEntry('rules', 'qoidalar', 'Removed UI artifact', 'UNNATURAL');
correctEntry('running', 'yugurish', 'Removed UI artifact', 'UNNATURAL');
correctEntry('said', 'dedi', 'Removed colon artifact', 'UNNATURAL');
correctEntry('say', 'demoq', 'Was Russian phrase - wrong', 'UNNATURAL');
correctEntry('scale', 'o\'lchov', 'Removed UI artifact', 'UNNATURAL');
correctEntry('see', 'ko\'rmoq', 'Was "Qarang" (imperative) - need infinitive', 'UNNATURAL');
correctEntry('seeks', 'izlaydi', 'Was "Sex" - completely wrong', 'UNNATURAL');
correctEntry('signed', 'imzoladi', 'Removed parentheses artifact', 'UNNATURAL');
correctEntry('signing', 'imzolash', 'Was "Bekor qilindi" (cancelled) - wrong', 'UNNATURAL');
correctEntry('sleeping', 'uxlash', 'Removed UI artifact', 'UNNATURAL');
correctEntry('speak', 'gapirmoq', 'Removed UI artifact', 'UNNATURAL');
correctEntry('spoken', 'gapirgan', 'Removed period artifact', 'UNNATURAL');
correctEntry('started', 'boshladi', 'Removed colon artifact', 'UNNATURAL');
correctEntry('starts', 'boshlanadi', 'Was "Boshlanish" - gerund', 'UNNATURAL');
correctEntry('stop', 'to\'xtatmoq', 'Removed UI artifact', 'UNNATURAL');
correctEntry('such', 'bunday', 'Removed XML tags', 'UNNATURAL');
correctEntry('sun', 'quyosh', 'Was "YAK" - wrong', 'UNNATURAL');
correctEntry('teacher', 'o\'qituvchi', 'Was "berdi" (gave) - wrong', 'UNNATURAL');
correctEntry('tell', 'aytmoq', 'Was "ayt" (imperative) - need infinitive', 'UNNATURAL');
correctEntry('test', 'test', 'Was Russian "Синов"', 'UNNATURAL');
correctEntry('tests', 'testlar', 'Was Russian "Testlar"', 'UNNATURAL');
correctEntry('text', 'matn', 'Was "Eng oxirgi" (latest) - wrong', 'UNNATURAL');
correctEntry('them', 'ularni', 'Removed quote artifacts', 'UNNATURAL');
correctEntry('there', 'u yerda', 'Was "U yerda" - capitalization', 'UNNATURAL');
correctEntry('think', 'o\'ylamoq', 'Removed ellipsis artifact', 'UNNATURAL');
correctEntry('time', 'vaqt', 'Removed error message artifact', 'UNNATURAL');
correctEntry('title', 'sarlavha', 'Was "Tavsif" (description) - wrong', 'UNNATURAL');
correctEntry('true', 'to\'g\'ri', 'Was "Mantiqiy:" - wrong context', 'UNNATURAL');
correctEntry('ultimate', 'yakuniy', 'Was "undefined trust" - corrupted', 'UNNATURAL');
correctEntry('usage', 'foydalanish', 'Removed UI artifact', 'UNNATURAL');
correctEntry('used', 'ishlatilgan', 'Removed "free" artifact', 'UNNATURAL');
correctEntry('vi', 'oltinchi', 'Was "Description" - corrupted', 'UNNATURAL');
correctEntry('we', 'biz', 'Was "Cho" - incomplete', 'UNNATURAL');
correctEntry('wear', 'kiymoq', 'Was "Kiyish" - gerund', 'UNNATURAL');
correctEntry('what', 'nima', 'Was Russian "Нима"', 'UNNATURAL');
correctEntry('words', 'so\'zlar', 'Removed colon artifact', 'UNNATURAL');
correctEntry('working', 'ishlash', 'Was "Ish vaqti" (work time) - wrong', 'UNNATURAL');

console.log(`Phase 3 complete: ${changes.filter(c => c.category === 'UNNATURAL').length} corrections\n`);

// ===== PHASE 4: CONTEXT ISSUES =====
console.log('Phase 4: Fixing context-specific issues...');

correctEntry('almost', 'deyarli', 'Removed period artifact', 'CONTEXT');
correctEntry('always', 'har doim', 'Removed underscore artifact', 'CONTEXT');
correctEntry('ann', 'Ann', 'Removed period artifact (proper name)', 'CONTEXT');
correctEntry('attended', 'qatnashdi', 'Removed colon artifact', 'CONTEXT');
correctEntry('ever', 'hech qachon', 'Removed period artifact', 'CONTEXT');
correctEntry('oh', 'oh', 'Removed exclamation artifact', 'CONTEXT');
correctEntry('verb', 'fe\'l', 'Was "fel" - missing apostrophe', 'CONTEXT');
correctEntry('verbs', 'fe\'llar', 'Was "fe\'llar" - correct but formatting', 'CONTEXT');

console.log(`Phase 4 complete: ${changes.filter(c => c.category === 'CONTEXT').length} corrections\n`);

// Write corrected dictionary
fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log(`✅ Corrected dictionary written to ${dictPath}`);

// Write change log
const logPath = path.join(__dirname, '../data/dictionary_corrections.log');
const logContent = changes.map(c =>
    `${c.word}\n  OLD: ${c.old}\n  NEW: ${c.new}\n  REASON: ${c.reason}\n  CATEGORY: ${c.category}\n`
).join('\n');

fs.writeFileSync(logPath, logContent, 'utf8');
console.log(`✅ Change log written to ${logPath}`);

// Generate summary
const summary = {
    totalEntries: Object.keys(dict).length,
    totalCorrections: changes.length,
    byCategory: {
        CRITICAL: changes.filter(c => c.category === 'CRITICAL').length,
        CORRUPTED: changes.filter(c => c.category === 'CORRUPTED').length,
        PART_OF_SPEECH: changes.filter(c => c.category === 'PART_OF_SPEECH').length,
        UNNATURAL: changes.filter(c => c.category === 'UNNATURAL').length,
        CONTEXT: changes.filter(c => c.category === 'CONTEXT').length
    },
    percentageCorrected: ((changes.length / Object.keys(dict).length) * 100).toFixed(2) + '%'
};

console.log('\n' + '='.repeat(60));
console.log('CORRECTION SUMMARY');
console.log('='.repeat(60));
console.log(`Total entries: ${summary.totalEntries}`);
console.log(`Total corrections: ${summary.totalCorrections} (${summary.percentageCorrected})`);
console.log('\nBy category:');
console.log(`  CRITICAL (completely wrong): ${summary.byCategory.CRITICAL}`);
console.log(`  CORRUPTED (technical artifacts): ${summary.byCategory.CORRUPTED}`);
console.log(`  PART_OF_SPEECH (wrong form): ${summary.byCategory.PART_OF_SPEECH}`);
console.log(`  UNNATURAL (literal/awkward): ${summary.byCategory.UNNATURAL}`);
console.log(`  CONTEXT (minor issues): ${summary.byCategory.CONTEXT}`);
console.log('='.repeat(60));

// Write summary to file
const summaryPath = path.join(__dirname, '../data/dictionary_audit_summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');
console.log(`\n✅ Summary written to ${summaryPath}`);

console.log('\n✨ Dictionary correction complete!');
console.log('Next step: Run "npm run build:dict" to rebuild dictionary.js');
