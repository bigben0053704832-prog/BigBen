const fs = require('fs');

// 读取vocabulary.js文件
const vocabularyContent = fs.readFileSync('vocabulary.js', 'utf8');

// 提取vocabularyData数组
const vocabularyMatch = vocabularyContent.match(/const vocabularyData = (\[[\s\S]*?\]);/);
if (!vocabularyMatch) {
    console.log('无法找到vocabularyData数组');
    process.exit(1);
}

let vocabularyArray = vocabularyMatch[1];

// 移除culturalContentEnglish和image字段
vocabularyArray = vocabularyArray.replace(/,?\s*culturalContentEnglish:\s*"[^"]*"/g, '');
vocabularyArray = vocabularyArray.replace(/,?\s*image:\s*"[^"]*"/g, '');

// 读取integrated.html文件
let integratedContent = fs.readFileSync('integrated.html', 'utf8');

// 找到tempVocabularyData的开始和结束位置
const startPattern = /const tempVocabularyData = \[/;
const endPattern = /\];\s*\/\/ 使用完整的词汇数据/;

const startMatch = integratedContent.match(startPattern);
if (!startMatch) {
    console.log('无法找到tempVocabularyData开始位置');
    process.exit(1);
}

const startIndex = integratedContent.indexOf(startMatch[0]);
const endIndex = integratedContent.indexOf('];', startIndex) + 2;

if (startIndex === -1 || endIndex === -1) {
    console.log('无法找到数组边界');
    process.exit(1);
}

// 替换数组内容
const newContent = integratedContent.substring(0, startIndex) + 
    'const tempVocabularyData = ' + vocabularyArray + ';' +
    integratedContent.substring(endIndex);

// 写回文件
fs.writeFileSync('integrated.html', newContent, 'utf8');
console.log('已修复integrated.html文件');