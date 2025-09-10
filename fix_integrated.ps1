# 读取vocabulary.js文件
$vocabularyContent = Get-Content -Path 'vocabulary.js' -Raw -Encoding UTF8

# 提取vocabularyData数组
if ($vocabularyContent -match 'const vocabularyData = (\[[\s\S]*?\]);') {
    $vocabularyArray = $matches[1]
    
    # 移除culturalContentEnglish和image字段
    $vocabularyArray = $vocabularyArray -replace ',?\s*culturalContentEnglish:\s*"[^"]*"', ''
    $vocabularyArray = $vocabularyArray -replace ',?\s*image:\s*"[^"]*"', ''
    
    # 读取integrated.html文件
    $integratedContent = Get-Content -Path 'integrated.html' -Raw -Encoding UTF8
    
    # 找到tempVocabularyData的开始位置
    $startPattern = 'const tempVocabularyData = \['
    $startIndex = $integratedContent.IndexOf($startPattern)
    
    if ($startIndex -ge 0) {
        # 找到数组结束位置
        $endIndex = $integratedContent.IndexOf('];', $startIndex) + 2
        
        if ($endIndex -gt $startIndex) {
            # 构建新内容
            $beforeArray = $integratedContent.Substring(0, $startIndex)
            $afterArray = $integratedContent.Substring($endIndex)
            $newContent = $beforeArray + 'const tempVocabularyData = ' + $vocabularyArray + ';' + $afterArray
            
            # 写回文件
            $newContent | Out-File -FilePath 'integrated.html' -Encoding UTF8
            Write-Host '已修复integrated.html文件'
        } else {
            Write-Host '无法找到数组结束位置'
        }
    } else {
        Write-Host '无法找到tempVocabularyData开始位置'
    }
} else {
    Write-Host '无法找到vocabularyData数组'
}