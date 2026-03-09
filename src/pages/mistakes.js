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
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        `;

        // 页面标题
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 32px;';
        header.innerHTML = `
            <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">错题本</h2>
            <p style="font-size: 17px; color: #8E8E93;">复习错题，巩固记忆</p>
        `;
        page.appendChild(header);

        // 空状态
        if (this.mistakes.length === 0) {
            this.renderEmptyState(page);
            container.appendChild(page);
            return;
        }

        // 统计概览
        this.elements.statsCard = this.createStatsCard();
        page.appendChild(this.elements.statsCard);

        // 错题列表
        this.elements.mistakesList = this.createMistakesList();
        page.appendChild(this.elements.mistakesList);

        container.appendChild(page);
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

    createStatsCard() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
            color: white;
        `;

        const totalWrong = this.mistakes.reduce((sum, m) => sum + m.wrongCount, 0);
        const reviewToday = this.mistakes.filter(m => m.nextReviewDate <= new Date().toISOString().split('T')[0]).length;

        card.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">错题统计</h3>
                    <p style="font-size: 15px; opacity: 0.9;">共 ${this.mistakes.length} 道错题，累计做错 ${totalWrong} 次</p>
                </div>
                ${reviewToday > 0 ? `
                <div style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 600;
                ">
                    今日需复习: ${reviewToday}
                </div>
                ` : ''}
            </div>
        `;

        return card;
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

        // 解析题目获取数字（简单解析）
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
