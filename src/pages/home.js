/**
 * 首页模块 - Apple 风格重构版
 * 展示学习概况和快速开始入口
 */

const HomePage = {
    elements: {},

    init() {
        this.render();
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const summary = Storage.getStatsSummary();

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        `;

        // 欢迎区域
        this.elements.welcomeSection = this.createWelcomeSection();
        page.appendChild(this.elements.welcomeSection);

        // 统计卡片网格
        this.elements.statsGrid = this.createStatsGrid(summary);
        page.appendChild(this.elements.statsGrid);

        // 快速开始卡片
        this.elements.quickStartCard = this.createQuickStartCard();
        page.appendChild(this.elements.quickStartCard);

        // 复习提醒（有条件显示）
        if (summary.reviewCount > 0) {
            this.elements.reviewAlert = this.createReviewAlert(summary.reviewCount);
            page.appendChild(this.elements.reviewAlert);
        }

        // 使用提示
        this.elements.tipsSection = this.createTipsSection();
        page.appendChild(this.elements.tipsSection);

        container.appendChild(page);
    },

    createWelcomeSection() {
        const section = document.createElement('div');
        section.style.cssText = 'text-align: center; margin-bottom: 32px;';
        section.innerHTML = `
            <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px; letter-spacing: -0.5px;">
                欢迎来到算术康复练习
            </h2>
            <p style="font-size: 17px; color: #8E8E93;">每天练习一点点，算术能力慢慢恢复</p>
        `;
        return section;
    },

    createStatsGrid(summary) {
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-bottom: 24px;
        `;

        const stats = [
            { icon: '✏️', label: '练习次数', value: summary.practiceCount, color: '#007AFF', bgColor: 'rgba(0, 122, 255, 0.08)' },
            { icon: '📖', label: '待复习错题', value: summary.reviewCount, color: '#FF9500', bgColor: 'rgba(255, 149, 0, 0.08)' },
            { icon: '✅', label: '已做题数', value: summary.totalQuestions, color: '#34C759', bgColor: 'rgba(52, 199, 89, 0.08)' },
            { icon: '🎯', label: '正确率', value: summary.accuracy + '%', color: '#AF52DE', bgColor: 'rgba(175, 82, 222, 0.08)' }
        ];

        stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'glass card-hover';
            card.style.cssText = `
                border-radius: 20px;
                padding: 20px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
                display: flex;
                align-items: center;
                gap: 16px;
            `;

            card.innerHTML = `
                <div style="
                    width: 52px;
                    height: 52px;
                    background: ${stat.bgColor};
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                ">
                    ${stat.icon}
                </div>
                <div>
                    <p style="font-size: 13px; color: #8E8E93; font-weight: 500; margin-bottom: 2px;">${stat.label}</p>
                    <p style="font-size: 28px; font-weight: 700; color: ${stat.color};">${stat.value}</p>
                </div>
            `;

            grid.appendChild(card);
        });

        return grid;
    },

    createQuickStartCard() {
        const card = document.createElement('div');
        card.style.cssText = `
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            border-radius: 24px;
            padding: 32px;
            margin-bottom: 24px;
            box-shadow: 0 8px 32px rgba(0, 122, 255, 0.3);
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            text-align: center;
        `;

        // 文字区域
        const textArea = document.createElement('div');
        textArea.innerHTML = `
            <h3 style="font-size: 22px; font-weight: 700; color: white; margin-bottom: 8px;">
                准备好开始今天的练习了吗？
            </h3>
            <p style="font-size: 15px; color: rgba(255, 255, 255, 0.85);">
                从简单的加法开始，一步步找回自信
            </p>
        `;
        content.appendChild(textArea);

        // 开始按钮
        const startBtn = document.createElement('button');
        startBtn.className = 'btn-press';
        startBtn.style.cssText = `
            background: white;
            color: #007AFF;
            padding: 16px 40px;
            border-radius: 12px;
            font-size: 17px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        startBtn.innerHTML = '<span style="font-size: 20px;">🚀</span><span>开始练习</span>';
        startBtn.onclick = () => router.navigate('practice-settings');

        // 悬停效果
        startBtn.addEventListener('mouseenter', () => {
            startBtn.style.transform = 'scale(1.02)';
            startBtn.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
        });
        startBtn.addEventListener('mouseleave', () => {
            startBtn.style.transform = 'scale(1)';
            startBtn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
        });

        content.appendChild(startBtn);
        card.appendChild(content);

        return card;
    },

    createReviewAlert(count) {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            background: rgba(255, 149, 0, 0.06);
            border: 1px solid rgba(255, 149, 0, 0.15);
        `;

        const leftContent = document.createElement('div');
        leftContent.style.cssText = 'display: flex; align-items: center; gap: 16px;';
        leftContent.innerHTML = `
            <span style="font-size: 36px;">🧠</span>
            <div>
                <h4 style="font-size: 17px; font-weight: 600; color: #FF9500; margin-bottom: 4px;">今日复习提醒</h4>
                <p style="font-size: 14px; color: #8E8E93;">有 ${count} 道错题需要复习，巩固记忆效果更好哦</p>
            </div>
        `;

        const reviewBtn = document.createElement('button');
        reviewBtn.className = 'btn-press';
        reviewBtn.style.cssText = `
            background: #FF9500;
            color: white;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(255, 149, 0, 0.3);
            white-space: nowrap;
        `;
        reviewBtn.textContent = '开始复习';
        reviewBtn.onclick = () => alert('错题本功能将在后续版本推出');

        card.appendChild(leftContent);
        card.appendChild(reviewBtn);

        return card;
    },

    createTipsSection() {
        const section = document.createElement('div');
        section.className = 'glass';
        section.style.cssText = `
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        const title = document.createElement('h4');
        title.style.cssText = `
            font-size: 17px;
            font-weight: 600;
            color: #1C1C1E;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        title.innerHTML = '<span>💡</span><span>使用提示</span>';
        section.appendChild(title);

        const tips = [
            '点击左侧「开始练习」进入练习页面',
            '使用屏幕上的数字键盘或电脑键盘输入答案',
            '答错没关系，系统会自动记录并安排复习'
        ];

        const list = document.createElement('ul');
        list.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

        tips.forEach(tip => {
            const item = document.createElement('li');
            item.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 14px;
                color: #3C3C43;
            `;
            item.innerHTML = `
                <span style="
                    width: 6px;
                    height: 6px;
                    background: #007AFF;
                    border-radius: 50%;
                    margin-top: 7px;
                    flex-shrink: 0;
                "></span>
                <span>${tip}</span>
            `;
            list.appendChild(item);
        });

        section.appendChild(list);

        return section;
    }
};
