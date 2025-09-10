const fs = require('fs');

// 读取integrated.html文件
let content = fs.readFileSync('integrated.html', 'utf8');

// 删除所有culturalContentEnglish字段（包括逗号和换行）
content = content.replace(/\s*culturalContentEnglish:.*?,?\n/g, '');

// 删除所有image字段（包括逗号和换行）
content = content.replace(/\s*image:.*?,?\n/g, '');

// 写回文件
fs.writeFileSync('integrated.html', content);

console.log('已清理integrated.html文件中的重复数据字段');