// 获取DOM元素
const searchInput = document.getElementById('searchInput');
const languageSelect = document.getElementById('languageSelect');

const categorySelect = document.getElementById('categorySelect');
const searchButton = document.getElementById('searchButton');

const showAllButton = document.getElementById('showAllButton');

const resultsContainer = document.getElementById('resultsContainer');

// 搜索功能
function searchVocabulary() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedLanguage = languageSelect.value;

    const selectedCategory = categorySelect.value;
    
    // 清空结果容器
    resultsContainer.innerHTML = '';
    
    // 如果搜索词为空且显示全部按钮未被点击，显示提示信息
    if (searchTerm === '' && event && event.target.id !== 'showAllButton') {
        resultsContainer.innerHTML = '<div class="no-results">请输入关键词进行检索</div>';
        return;
    }
    
    // 根据选择的语言、等级、类别和搜索词过滤结果
    let filteredResults = vocabularyData;
    
    // 按搜索词筛选（如果有）
    if (searchTerm !== '') {
        // 按语言筛选
        if (selectedLanguage === 'all') {
            filteredResults = filteredResults.filter(item => 
                item.chinese.toLowerCase().includes(searchTerm) || 
                item.english.toLowerCase().includes(searchTerm) || 
                item.twi.toLowerCase().includes(searchTerm)
            );
        } else if (selectedLanguage === 'chinese') {
            filteredResults = filteredResults.filter(item => 
                item.chinese.toLowerCase().includes(searchTerm)
            );
        } else if (selectedLanguage === 'english') {
            filteredResults = filteredResults.filter(item => 
                item.english.toLowerCase().includes(searchTerm)
            );
        } else if (selectedLanguage === 'twi') {
            filteredResults = filteredResults.filter(item => 
                item.twi.toLowerCase().includes(searchTerm)
            );
        }
    } else {
        // 如果没有搜索词但选择了语言，也进行筛选
        if (selectedLanguage !== 'all') {
            filteredResults = filteredResults.filter(item => {
                if (selectedLanguage === 'chinese') return true;
                if (selectedLanguage === 'english') return true;
                if (selectedLanguage === 'twi') return true;
                return false;
            });
        }
    }
    

    
    // 按类别筛选
    if (selectedCategory !== 'all') {
        filteredResults = filteredResults.filter(item => item.category === selectedCategory);
    }
    
    // 显示结果
    displayResults(filteredResults);
}

// 显示结果函数
function displayResults(results) {
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">没有找到匹配的词汇</div>';
        return;
    }
    
    // 添加搜索提示
    const resultCount = document.createElement('div');
    resultCount.className = 'result-count';
    resultCount.textContent = '输入词汇并点击搜索，查看相关结果';
    resultsContainer.appendChild(resultCount);
    
    // 创建表格视图切换按钮
    const viewToggle = document.createElement('div');
    viewToggle.className = 'view-toggle';
    viewToggle.innerHTML = `
        <button id="cardViewBtn" class="view-btn active">卡片视图</button>
        <button id="tableViewBtn" class="view-btn">表格视图</button>
    `;
    resultsContainer.appendChild(viewToggle);
    
    // 创建结果容器
    const resultsList = document.createElement('div');
    resultsList.id = 'resultsList';
    resultsList.className = 'card-view';
    resultsContainer.appendChild(resultsList);
    
    // 卡片视图
    function showCardView() {
        resultsList.className = 'card-view';
        resultsList.innerHTML = '';
        
        results.forEach(item => {
            const vocabularyItem = document.createElement('div');
            vocabularyItem.className = 'vocabulary-item';
            
            // 根据类别添加不同的样式
            const categoryClass = item.category === '冲突' ? 'category-conflict' : 'category-vacancy';
            

            
            vocabularyItem.innerHTML = `
                <div class="vocabulary-header">
                    <div class="vocabulary-title">${item.chinese}</div>
                    <div>
                        <div class="vocabulary-category ${categoryClass}">${item.category}</div>
                    </div>
                </div>
                ${item.image ? `<div class="vocabulary-image">
                    <img src="${item.image}" alt="${item.chinese}" class="word-image">
                </div>` : ''}
                <div class="vocabulary-languages">
                    <div class="language-item">
                        <div class="language-label">汉语:</div>
                        <div class="language-word">${item.chinese}</div>
                    </div>
                    <div class="language-item">
                        <div class="language-label">英语:</div>
                        <div class="language-word">${item.english}</div>
                    </div>
                    <div class="language-item">
                        <div class="language-label">Twi语:</div>
                        <div class="language-word">${item.twi}</div>
                    </div>
                </div>
                <div class="cultural-content">
                    <div class="cultural-content-title">文化内容:</div>
                    <div class="cultural-text-chinese">${item.culturalContent}</div>

                    <div class="audio-controls">
                        <button class="audio-btn" onclick="speakText('${item.culturalContent.replace(/'/g, "\\'").replace(/"/g, '\\"')}', 'zh-CN')">
                            🔊 中文语音
                        </button>
                        
                    </div>
                </div>
            `;
            
            resultsList.appendChild(vocabularyItem);
        });
    }
    
    // 表格视图
    function showTableView() {
        resultsList.className = 'table-view';
        resultsList.innerHTML = `
            <table class="vocabulary-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>汉语</th>
                        <th>英语</th>
                        <th>Twi语</th>
                        <th>类别</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map(item => `
                        <tr class="table-row" data-id="${item.id}">
                            <td>${item.id}</td>
                            <td>${item.chinese}</td>
                            <td>${item.english}</td>
                            <td>${item.twi}</td>
                            <td><span class="vocabulary-category ${item.category === '冲突' ? 'category-conflict' : 'category-vacancy'}">${item.category}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // 添加表格行点击事件，显示详细信息
        const tableRows = resultsList.querySelectorAll('.table-row');
        tableRows.forEach(row => {
            row.addEventListener('click', function() {
                const itemId = parseInt(this.getAttribute('data-id'));
                const item = results.find(item => item.id === itemId);
                
                if (item) {
                    const detailModal = document.createElement('div');
                    detailModal.className = 'detail-modal';
                    detailModal.innerHTML = `
                        <div class="modal-content">
                            <span class="close-modal">&times;</span>
                            <h2>${item.chinese}</h2>
                            <div class="modal-languages">
                                <div><strong>汉语:</strong> ${item.chinese}</div>
                                <div><strong>英语:</strong> ${item.english}</div>
                                <div><strong>Twi语:</strong> ${item.twi}</div>
                            </div>
                            <div class="modal-info">
                                <div><strong>类别:</strong> <span class="vocabulary-category ${item.category === '冲突' ? 'category-conflict' : 'category-vacancy'}">${item.category}</span></div>

                            </div>
                            <div class="modal-cultural-content">
                                <h3>文化内容:</h3>
                                <p>${item.culturalContent}</p>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(detailModal);
                    
                    // 关闭模态框
                    const closeBtn = detailModal.querySelector('.close-modal');
                    closeBtn.addEventListener('click', function() {
                        document.body.removeChild(detailModal);
                    });
                    
                    // 点击模态框外部关闭
                    detailModal.addEventListener('click', function(e) {
                        if (e.target === detailModal) {
                            document.body.removeChild(detailModal);
                        }
                    });
                }
            });
        });
    }
    
    // 默认显示卡片视图
    showCardView();
    
    // 添加视图切换事件
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    
    cardViewBtn.addEventListener('click', function() {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        showCardView();
    });
    
    tableViewBtn.addEventListener('click', function() {
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        showTableView();
    });
}

// 清除功能


// 添加事件监听器
searchButton.addEventListener('click', searchVocabulary);

showAllButton.addEventListener('click', searchVocabulary);


searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchVocabulary();
    }
});

// 页面加载时显示提示信息
window.addEventListener('load', function() {
    resultsContainer.innerHTML = '<div class="no-results">请输入关键词进行检索或点击"显示全部"按钮</div>';
});

// 语音播放函数
function speakText(text, language) {
    if ('speechSynthesis' in window) {
        // 停止当前播放的语音
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8; // 语速
        utterance.pitch = 1; // 音调
        utterance.volume = 1; // 音量
        
        speechSynthesis.speak(utterance);
    } else {
        alert('您的浏览器不支持语音播放功能');
    }
}

// 统计分析功能
function showStatistics() {
    const totalWords = vocabularyData.length;
    const conflictWords = vocabularyData.filter(item => item.category === '冲突').length;
    const vacancyWords = vocabularyData.filter(item => item.category === '空缺').length;
    
    const statsHtml = `
        <div class="statistics-view">
            <h2>词汇统计分析</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>总词汇量</h3>
                    <div class="stat-number">${totalWords}</div>
                    <p>收录的三语词汇总数</p>
                </div>
                <div class="stat-card">
                    <h3>词义冲突</h3>
                    <div class="stat-number">${conflictWords}</div>
                    <p>占比 ${((conflictWords/totalWords)*100).toFixed(1)}%</p>
                </div>
                <div class="stat-card">
                    <h3>词义空缺</h3>
                    <div class="stat-number">${vacancyWords}</div>
                    <p>占比 ${((vacancyWords/totalWords)*100).toFixed(1)}%</p>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = statsHtml;
}

// 关于项目功能
function showAbout() {
    const aboutHtml = `
        <div class="about-view">
            <h2>关于项目</h2>
            <div class="about-content">
                <div class="about-section">
                    <h3>项目背景</h3>
                    <p>本项目致力于研究Twi语-英语-汉语三语环境下名词词义不对等现象，为跨文化交流和语言教学提供理论支持和实践指导。</p>
                </div>
                <div class="about-section">
                    <h3>研究目标</h3>
                    <ul>
                        <li>建立三语词汇对比数据库</li>
                        <li>分析词义不对等的类型和特征</li>
                        <li>探索跨文化理解的有效途径</li>
                        <li>为语言教学提供参考资料</li>
                    </ul>
                </div>
                <div class="about-section">
                    <h3>技术特色</h3>
                    <p>采用现代Web技术构建的交互式检索系统，支持多语言检索、分类浏览和统计分析，为研究者和学习者提供便捷的查询工具。</p>
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = aboutHtml;
}