# 读取integrated.html文件
$content = Get-Content -Path 'integrated.html' -Raw

# 删除所有culturalContentEnglish字段（包括逗号和换行）
$content = $content -replace '\s*culturalContentEnglish:.*?,?\r?\n', ''

# 删除所有image字段（包括逗号和换行）
$content = $content -replace '\s*image:.*?,?\r?\n', ''

# 写回文件
$content | Set-Content -Path 'integrated.html' -NoNewline

Write-Host '已清理integrated.html文件中的重复数据字段'