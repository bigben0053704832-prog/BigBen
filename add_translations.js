const fs = require('fs');

// 读取vocabulary.js文件
let content = fs.readFileSync('vocabulary.js', 'utf8');

// 定义翻译函数
function translateCulturalContent(chineseContent) {
  // 这里是一个简化的翻译逻辑，实际应用中可能需要更复杂的翻译
  // 将中文文化内容翻译为英文
  return chineseContent
    .replace(/在中国文化中/g, 'in Chinese culture')
    .replace(/象征着/g, 'symbolizes')
    .replace(/代表着/g, 'represents')
    .replace(/在英语中/g, 'in English')
    .replace(/在Twi中/g, 'in Twi')
    .replace(/指的是/g, 'refers to')
    .replace(/通常/g, 'usually')
    .replace(/特别是/g, 'especially')
    .replace(/但没有/g, 'but lacks')
    .replace(/缺乏/g, 'lacks')
    .replace(/文化上/g, 'culturally')
    .replace(/传统/g, 'traditional')
    .replace(/家庭/g, 'family')
    .replace(/节日/g, 'festival')
    .replace(/意义/g, 'meaning')
    .replace(/象征/g, 'symbolic')
    .replace(/重要/g, 'important')
    .replace(/深层/g, 'deep')
    .replace(/背景/g, 'background');
}

// 查找所有没有culturalContentEnglish字段的词汇
const vocabularyRegex = /{[\s\S]*?id: (\d+)[\s\S]*?culturalContent: "([^"]*?)"[\s\S]*?category:/g;
let match;
let modifications = [];

while ((match = vocabularyRegex.exec(content)) !== null) {
  const id = match[1];
  const culturalContent = match[2];
  
  // 检查是否已经有culturalContentEnglish字段
  const hasEnglishTranslation = content.includes(`id: ${id}`) && content.includes('culturalContentEnglish:');
  
  if (!hasEnglishTranslation) {
    const englishTranslation = translateCulturalContent(culturalContent);
    modifications.push({
      id: id,
      original: culturalContent,
      translation: englishTranslation
    });
  }
}

console.log(`Found ${modifications.length} vocabularies that need English translations.`);

// 为每个需要翻译的词汇添加culturalContentEnglish字段
modifications.forEach(mod => {
  const pattern = new RegExp(
    `(id: ${mod.id},[\\s\\S]*?culturalContent: "${mod.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",)([\\s\\S]*?category:)`,
    'g'
  );
  
  content = content.replace(pattern, 
    `$1\n    culturalContentEnglish: "${mod.translation}",\n$2`
  );
});

// 写回文件
fs.writeFileSync('vocabulary.js', content, 'utf8');
console.log('Successfully added English translations to all vocabularies.');