# 读取vocabulary.js文件
$content = Get-Content -Path 'vocabulary.js' -Raw -Encoding UTF8

# 提取词汇数据，去掉culturalContentEnglish和image字段
$cleanData = $content -replace 'culturalContentEnglish:.*?,\r?\n', ''
$cleanData = $cleanData -replace 'image:.*?,\r?\n', ''

# 将const vocabularyData改为const tempVocabularyData
$cleanData = $cleanData -replace 'const vocabularyData', 'const tempVocabularyData'

# 保存到临时文件
$cleanData | Set-Content -Path 'temp_clean_data.js' -Encoding UTF8

Write-Host '已提取干净的词汇数据到temp_clean_data.js'