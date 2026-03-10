/**
 * 错题本页面 - Apple 风格
 * 查看和复习做错的题目
 */

const MistakesPage = {
    mistakes: [],
    elements: {},

    init() {
        this.loadData();
        this.render();
    },

    loadData() {
        const userData = Storage.getUserData();
        this.mistakes = userData.mistakes || [];
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.className = 'mistakes-page';
        page.style.cssText = `
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 页面标题
        const header = document.createElement('div');
        header.className = 'mistakes-header';
        header.style.cssText = 'text-align: center; margin-bottom: 24px;';
        header.innerHTML = `
            <h2 style="font-size: 28px; font-weight: 700; color: #1C1C1E; margin-bottom: 6px;">错题本</h2>
            <p style="font-size: 15px; color: #8E8E93;">复习错题，巩固记忆</p>
        `;
        page.appendChild(header);

        // 空状态
        if (this.mistakes.length === 0) {
            this.renderEmptyState(page);
            container.appendChild(page);
            return;
        }

        // 主内容区：左侧分析面板 + 右侧错题列表
        const mainContent = document.createElement('div');
        mainContent.className = 'mistakes-content';
        mainContent.style.cssText = `
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: 20px;
            align-items: start;
        `;

        // 左侧：分析面板
        const leftPanel = document.createElement('div');
        leftPanel.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

        // 数据洞察卡片
        leftPanel.appendChild(this.createInsightCard());

        // 批量复习按钮（今日有错题时显示）
        const todayMistakes = this.getTodayReviewMistakes();
        if (todayMistakes.length > 0) {
            leftPanel.appendChild(this.createBatchReviewButton(todayMistakes.length));
        }

        mainContent.appendChild(leftPanel);

        // 右侧：错题列表
        this.elements.mistakesList = this.createMistakesList();
        mainContent.appendChild(this.elements.mistakesList);

        page.appendChild(mainContent);

        container.appendChild(page);
    },

    getTodayReviewMistakes() {
        const today = new Date().toISOString().split('T')[0];
        return this.mistakes.filter(m => {
            // 到复习日期了
            const isReviewDue = m.nextReviewDate <= today;
            if (!isReviewDue) return false;

            // 排除今天已经练习过的
            if (m.lastPracticedAt) {
                const lastPracticeDate = m.lastPracticedAt.split('T')[0];
                if (lastPracticeDate === today) {
                    return false;
                }
            }

            return true;
        });
    },

    createInsightCard() {
        const card = document.createElement('div');
        card.className = 'glass mistakes-insight-card';
        card.style.cssText = `
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        `;

        // 统计数据
        const typeDistribution = this.getTypeDistribution();
        const difficultyDistribution = this.getDifficultyDistribution();
        const totalWrong = this.mistakes.reduce((sum, m) => sum + m.wrongCount, 0);

        card.innerHTML = `
            <h3 style="font-size: 16px; font-weight: 700; color: #1C1C1E; margin-bottom: 16px;">
                📊 错题分析
            </h3>

            <!-- 概览统计 -->
            <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                <div style="flex: 1; text-align: center; padding: 12px 8px; background: rgba(0, 122, 255, 0.06); border-radius: 10px;">
                    <div style="font-size: 24px; font-weight: 700; color: #007AFF;">${this.mistakes.length}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 2px;">错题总数</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 12px 8px; background: rgba(255, 59, 48, 0.06); border-radius: 10px;">
                    <div style="font-size: 24px; font-weight: 700; color: #FF3B30;">${totalWrong}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 2px;">累计错误</div>
                </div>
                <div style="flex: 1; text-align: center; padding: 12px 8px; background: rgba(255, 149, 0, 0.06); border-radius: 10px;">
                    <div style="font-size: 24px; font-weight: 700; color: #FF9500;">${this.getTodayReviewMistakes().length}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 2px;">今日复习</div>
                </div>
            </div>

            <!-- 运算类型分布 - 环形图 + 卡片 -->
            <div style="margin-bottom: 20px;">
                <div style="font-size: 13px; font-weight: 600; color: #3C3C43; margin-bottom: 12px;">类型分布</div>

                <!-- 环形图 + 中心数字 -->
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                    ${this.createDonutChart(typeDistribution)}
                    <!-- 类型卡片列表 -->
                    <div style="flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                        ${typeDistribution.filter(t => t.count > 0).map(type => `
                            <div style="
                                background: ${type.color}10;
                                border-radius: 10px;
                                padding: 10px 12px;
                                border-left: 3px solid ${type.color};
                            ">
                                <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
                                    <span style="font-size: 14px;">${type.icon}</span>
                                    <span style="font-size: 11px; color: #8E8E93;">${type.name}</span>
                                </div>
                                <div style="font-size: 18px; font-weight: 700; color: ${type.color};">${type.count}</div>
                                <div style="font-size: 10px; color: #8E8E93;">${type.percent}%</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- 难度分布 -->
            <div>
                <div style="font-size: 13px; font-weight: 600; color: #3C3C43; margin-bottom: 10px;">难度分布</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${difficultyDistribution.map(diff => `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 12px; color: #8E8E93; width: 36px;">${diff.name}</span>
                            <div style="flex: 1; height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 3px; overflow: hidden;">
                                <div style="width: ${diff.percent}%; height: 100%; background: ${diff.color}; border-radius: 3px; transition: width 400ms ease;"></div>
                            </div>
                            <span style="font-size: 12px; font-weight: 600; color: #1C1C1E; width: 24px; text-align: right;">${diff.count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        return card;
    },

    getTypeDistribution() {
        const types = [
            { id: 'addition', name: '加法', icon: '➕', color: '#34C759' },
            { id: 'subtraction', name: '减法', icon: '➖', color: '#FF9500' },
            { id: 'multiplication', name: '乘法', icon: '✖️', color: '#007AFF' },
            { id: 'division', name: '除法', icon: '➗', color: '#AF52DE' }
        ];

        const total = this.mistakes.length;
        return types.map(type => {
            const count = this.mistakes.filter(m => m.type === type.id).length;
            return {
                ...type,
                count,
                percent: total > 0 ? Math.round((count / total) * 100) : 0
            };
        }).filter(t => t.count > 0);
    },

    getDifficultyDistribution() {
        const difficulties = [
            { id: 'level1', name: '入门', color: '#34C759' },
            { id: 'level2', name: '进阶', color: '#30D158' },
            { id: 'level3', name: '熟练', color: '#007AFF' },
            { id: 'level4', name: '高手', color: '#5856D6' },
            { id: 'level5', name: '专家', color: '#AF52DE' },
            { id: 'level6', name: '大师', color: '#FF2D55' }
        ];

        const total = this.mistakes.length;
        return difficulties.map(diff => {
            const count = this.mistakes.filter(m => m.difficulty === diff.id).length;
            return {
                ...diff,
                count,
                percent: total > 0 ? (count / total) * 100 : 0
            };
        });
    },

    createDonutChart(typeDistribution) {
        const total = typeDistribution.reduce((sum, t) => sum + t.count, 0);
        if (total === 0) {
            return `<div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 20px; color: #8E8E93;">0</span>
            </div>`;
        }

        // 计算每个类型的角度
        let currentAngle = 0;
        const segments = typeDistribution.map(type => {
            const angle = (type.count / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle += angle;
            return { ...type, startAngle, endAngle };
        });

        // 生成 SVG 路径
        const size = 80;
        const center = size / 2;
        const radius = 32;
        const strokeWidth = 12;

        const paths = segments.map(seg => {
            const startRad = (seg.startAngle - 90) * Math.PI / 180;
            const endRad = (seg.endAngle - 90) * Math.PI / 180;

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            const largeArc = seg.endAngle - seg.startAngle > 180 ? 1 : 0;

            return `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}"
                fill="none" stroke="${seg.color}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;
        }).join('');

        return `
            <div style="position: relative; width: ${size}px; height: ${size}px;">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform: rotate(-90deg);">
                    ${paths}
                </svg>
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                ">
                    <div style="font-size: 20px; font-weight: 700; color: #1C1C1E;">${total}</div>
                    <div style="font-size: 10px; color: #8E8E93;">题</div>
                </div>
            </div>
        `;
    },

    createBatchReviewButton(count) {
        const wrapper = document.createElement('div');

        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            width: 100%;
            background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
            color: white;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;
        btn.innerHTML = `
            <span style="font-size: 18px;">📚</span>
            <span>复习今日错题 (${count}道)</span>
        `;
        btn.onclick = () => this.startBatchReview();

        // 悬停效果
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.01)';
            btn.style.boxShadow = '0 6px 20px rgba(255, 149, 0, 0.4)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 4px 16px rgba(255, 149, 0, 0.3)';
        });

        wrapper.appendChild(btn);
        return wrapper;
    },

    startBatchReview() {
        const todayMistakes = this.getTodayReviewMistakes();
        if (todayMistakes.length === 0) return;

        // 生成错题练习题目
        const questions = todayMistakes.map(mistake => {
            // 解析题目
            const match = mistake.question.match(/(\d+)\s*([+\-×÷])\s*(\d+)/);
            let num1 = 0, num2 = 0, operator = '+';
            if (match) {
                num1 = parseInt(match[1]);
                operator = match[2];
                num2 = parseInt(match[3]);
            }

            return {
                id: mistake.id,
                type: mistake.type,
                difficulty: mistake.difficulty,
                question: mistake.question,
                display: mistake.question,
                answer: mistake.correctAnswer,
                num1,
                num2,
                operator,
                isMistakeReview: true
            };
        });

        // 保存到 sessionStorage
        sessionStorage.setItem('mistake_mode', 'true');
        sessionStorage.setItem('mistake_batch', 'true');
        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        // 跳转到选择题模式
        router.navigate('practice-choice');
    },

    renderEmptyState(page) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'glass';
        emptyCard.style.cssText = `
            border-radius: 24px;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;
        emptyCard.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 24px;">🎉</div>
            <h3 style="font-size: 22px; font-weight: 600; color: #1C1C1E; margin-bottom: 8px;">太棒了！</h3>
            <p style="font-size: 17px; color: #8E8E93; margin-bottom: 32px;">你还没有错题，继续保持！</p>
            <button onclick="router.navigate('practice-settings')"
                class="btn-press"
                style="
                    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
                    color: white;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
                ">
                开始练习
            </button>
        `;
        page.appendChild(emptyCard);
    },

    createMistakesList() {
        const list = document.createElement('div');
        list.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

        const today = new Date().toISOString().split('T')[0];

        // 过滤并排序：排除今天练习过的，今天到期的优先
        const sortedMistakes = [...this.mistakes].filter(m => {
            // 排除今天已经练习过的
            if (m.lastPracticedAt) {
                const lastPracticeDate = m.lastPracticedAt.split('T')[0];
                if (lastPracticeDate === today) {
                    return false;
                }
            }
            return true;
        }).sort((a, b) => {
            if (a.nextReviewDate <= today) return -1;
            if (b.nextReviewDate <= today) return 1;
            return a.nextReviewDate.localeCompare(b.nextReviewDate);
        });

        sortedMistakes.forEach((mistake, index) => {
            const item = this.createMistakeItem(mistake, index);
            list.appendChild(item);
        });

        return list;
    },

    createMistakeItem(mistake, index) {
        const typeNames = {
            addition: '加法',
            subtraction: '减法',
            multiplication: '乘法',
            division: '除法'
        };
        const diffNames = {
            level1: '入门', level2: '进阶', level3: '熟练',
            level4: '高手', level5: '专家', level6: '大师',
            beginner: '初级', intermediate: '中级', advanced: '高级'
        };

        const isReviewToday = mistake.nextReviewDate <= new Date().toISOString().split('T')[0];

        const item = document.createElement('div');
        item.className = 'glass card-hover mistake-item';
        item.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            border: 1px solid ${isReviewToday ? 'rgba(255, 149, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
            animation: fadeInUp 400ms ease forwards;
            animation-delay: ${index * 50}ms;
            opacity: 0;
        `;

        // 进度条（答对次数）- 2次消除
        const progressWidth = (mistake.correctCount / 2) * 100;

        // 处理题目显示，避免重复的等号和问号
        let questionDisplay = mistake.question;
        if (!questionDisplay.includes('=') && !questionDisplay.includes('？')) {
            questionDisplay += ' = ?';
        } else if (questionDisplay.includes('=') && !questionDisplay.includes('?') && !questionDisplay.includes('？')) {
            questionDisplay += ' ?';
        }

        item.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;" class="meta-row">
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <span style="
                            padding: 4px 10px;
                            background: ${isReviewToday ? 'rgba(255, 149, 0, 0.12)' : 'rgba(0, 122, 255, 0.08)'};
                            border-radius: 100px;
                            font-size: 12px;
                            font-weight: 600;
                            color: ${isReviewToday ? '#FF9500' : '#007AFF'};
                        ">${diffNames[mistake.difficulty]}${typeNames[mistake.type]}</span>
                        ${isReviewToday ? '<span style="font-size: 12px; color: #FF9500; font-weight: 500;">今日复习</span>' : ''}
                    </div>
                    <div style="font-size: 24px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;" class="question">
                        ${questionDisplay}
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px; font-size: 14px;" class="answers">
                        <span style="color: #FF3B30;">你的答案: ${mistake.userAnswer}</span>
                        <span style="color: #34C759;">正确答案: ${mistake.correctAnswer}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; color: #8E8E93; margin-bottom: 4px;">答对次数</div>
                    <div style="font-size: 20px; font-weight: 700; color: #007AFF;">${mistake.correctCount}/2</div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);" class="progress-area">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1; margin-right: 16px;">
                        <div style="height: 4px; background: rgba(0, 0, 0, 0.06); border-radius: 2px; overflow: hidden;">
                            <div style="
                                height: 100%;
                                width: ${progressWidth}%;
                                background: linear-gradient(90deg, #007AFF 0%, #34C759 100%);
                                border-radius: 2px;
                                transition: width 400ms ease;
                            "></div>
                        </div>
                    </div>
                    <button onclick="MistakesPage.practiceMistake('${mistake.id}')"
                        class="btn-press review-btn"
                        style="
                            background: ${isReviewToday ? '#FF9500' : '#007AFF'};
                            color: white;
                            padding: 8px 20px;
                            border-radius: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            border: none;
                            cursor: pointer;
                            white-space: nowrap;
                        ">
                        重练
                    </button>
                </div>
            </div>
        `;

        return item;
    },

    practiceMistake(mistakeId) {
        const userData = Storage.getUserData();
        const mistake = userData.mistakes.find(m => m.id === mistakeId);

        if (!mistake) {
            alert('错题不存在');
            return;
        }

        // 创建针对这道错题的练习
        const question = {
            id: mistake.id,  // 使用错题ID，不是生成新ID
            type: mistake.type,
            difficulty: mistake.difficulty,
            question: mistake.question,
            display: mistake.question,
            answer: mistake.correctAnswer,
            num1: 0,
            num2: 0
        };

        // 解析题目获取数字
        const match = mistake.question.match(/(\d+)\s*[+\-×÷]\s*(\d+)/);
        if (match) {
            question.num1 = parseInt(match[1]);
            question.num2 = parseInt(match[2]);
        }

        // 保存到 sessionStorage
        sessionStorage.setItem('mistake_mode', 'true');
        sessionStorage.setItem('mistake_id', mistakeId);
        sessionStorage.setItem('practice_questions', JSON.stringify([question]));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        // 跳转到选择题模式
        router.navigate('practice-choice');
    }
};
