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
        page.style.cssText = `
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 页面标题
        const header = document.createElement('div');
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
        return this.mistakes.filter(m => m.nextReviewDate <= today);
    },

    createInsightCard() {
        const card = document.createElement('div');
        card.className = 'glass';
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

            <!-- 运算类型分布 -->
            <div style="margin-bottom: 16px;">
                <div style="font-size: 13px; font-weight: 600; color: #3C3C43; margin-bottom: 10px;">类型分布</div>
                <div style="display: flex; gap: 4px; height: 6px; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
                    ${typeDistribution.map(type => `
                        <div style="width: ${type.percent}%; background: ${type.color};" title="${type.name}: ${type.count}道"></div>
                    `).join('')}
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 8px 12px;">
                    ${typeDistribution.map(type => `
                        <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #3C3C43;">
                            <span style="width: 6px; height: 6px; background: ${type.color}; border-radius: 2px;"></span>
                            <span>${type.name}</span>
                            <span style="font-weight: 600; color: #1C1C1E;">${type.count}</span>
                        </div>
                    `).join('')}
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
            { id: 'addition', name: '加法', color: '#34C759' },
            { id: 'subtraction', name: '减法', color: '#FF9500' },
            { id: 'multiplication', name: '乘法', color: '#007AFF' },
            { id: 'division', name: '除法', color: '#AF52DE' }
        ];

        const total = this.mistakes.length;
        return types.map(type => {
            const count = this.mistakes.filter(m => m.type === type.id).length;
            return {
                ...type,
                count,
                percent: total > 0 ? (count / total) * 100 : 0
            };
        }).filter(t => t.count > 0);
    },

    getDifficultyDistribution() {
        const difficulties = [
            { id: 'beginner', name: '初级', color: '#34C759' },
            { id: 'intermediate', name: '中级', color: '#FF9500' },
            { id: 'advanced', name: '高级', color: '#FF3B30' }
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

        // 跳转到键盘输入模式
        router.navigate('practice-keypad');
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

        // 按复习日期排序（今天优先）
        const sortedMistakes = [...this.mistakes].sort((a, b) => {
            if (a.nextReviewDate <= new Date().toISOString().split('T')[0]) return -1;
            if (b.nextReviewDate <= new Date().toISOString().split('T')[0]) return 1;
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
            beginner: '初级',
            intermediate: '中级',
            advanced: '高级'
        };

        const isReviewToday = mistake.nextReviewDate <= new Date().toISOString().split('T')[0];

        const item = document.createElement('div');
        item.className = 'glass card-hover';
        item.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            border: 1px solid ${isReviewToday ? 'rgba(255, 149, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
            animation: fadeInUp 400ms ease forwards;
            animation-delay: ${index * 50}ms;
            opacity: 0;
        `;

        // 进度条（答对次数）
        const progressWidth = (mistake.correctCount / 3) * 100;

        item.innerHTML = `
            <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
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
                    <div style="font-size: 24px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">
                        ${mistake.question} = ?
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px; font-size: 14px;">
                        <span style="color: #FF3B30;">你的答案: ${mistake.userAnswer}</span>
                        <span style="color: #34C759;">正确答案: ${mistake.correctAnswer}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 13px; color: #8E8E93; margin-bottom: 4px;">答对次数</div>
                    <div style="font-size: 20px; font-weight: 700; color: #007AFF;">${mistake.correctCount}/3</div>
                </div>
            </div>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.06);">
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
                        class="btn-press"
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
            id: Date.now().toString(),
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

        // 跳转到键盘输入模式
        router.navigate('practice-keypad');
    }
};
