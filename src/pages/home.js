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
        const achievements = Storage.getAchievements();

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

        // 进步曲线图
        if (summary.practiceCount > 0) {
            this.elements.progressChart = this.createProgressChart();
            page.appendChild(this.elements.progressChart);
        }

        // 徽章展示
        if (achievements.badges.length > 0) {
            this.elements.badgesSection = this.createBadgesSection(achievements);
            page.appendChild(this.elements.badgesSection);
        }

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
    },

    createProgressChart() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        const title = document.createElement('h4');
        title.style.cssText = `
            font-size: 17px;
            font-weight: 600;
            color: #1C1C1E;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        title.innerHTML = '<span>📈</span><span>进步曲线</span>';
        card.appendChild(title);

        // 获取最近7天的数据
        const progressData = Storage.getProgressData(7);
        const hasData = progressData.some(d => d.accuracy !== null);

        if (!hasData) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.cssText = `
                text-align: center;
                padding: 40px;
                color: #8E8E93;
                font-size: 15px;
            `;
            emptyMsg.textContent = '完成更多练习后查看进步趋势';
            card.appendChild(emptyMsg);
            return card;
        }

        // 计算图表参数
        const chartHeight = 120;
        const chartWidth = 100; // 百分比
        const maxAccuracy = 100;

        // 生成折线路径
        const validData = progressData.filter(d => d.accuracy !== null);
        const points = validData.map((d, i) => {
            const x = (i / (progressData.length - 1)) * 100;
            const y = chartHeight - (d.accuracy / maxAccuracy) * chartHeight;
            return { x, y, accuracy: d.accuracy, date: d.date };
        });

        // 创建SVG路径
        const linePath = points.length > 0
            ? `M ${points[0].x} ${points[0].y} ` +
              points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
            : '';

        // 创建渐变区域路径
        const areaPath = points.length > 0
            ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
            : '';

        const chartContainer = document.createElement('div');
        chartContainer.style.cssText = `
            position: relative;
            height: ${chartHeight + 40}px;
        `;

        // 格式化日期
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
        };

        chartContainer.innerHTML = `
            <svg viewBox="0 0 100 ${chartHeight}" style="width: 100%; height: ${chartHeight}px; overflow: visible;">
                <!-- 网格线 -->
                <line x1="0" y1="${chartHeight * 0.25}" x2="100" y2="${chartHeight * 0.25}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="2"/>
                <line x1="0" y1="${chartHeight * 0.5}" x2="100" y2="${chartHeight * 0.5}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="2"/>
                <line x1="0" y1="${chartHeight * 0.75}" x2="100" y2="${chartHeight * 0.75}" stroke="rgba(0,0,0,0.05)" stroke-dasharray="2"/>

                <!-- 渐变区域 -->
                ${areaPath ? `
                <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#007AFF" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#007AFF" stop-opacity="0.05"/>
                    </linearGradient>
                </defs>
                <path d="${areaPath}" fill="url(#chartGradient)"/>
                ` : ''}

                <!-- 折线 -->
                ${linePath ? `<path d="${linePath}" fill="none" stroke="#007AFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` : ''}

                <!-- 数据点 -->
                ${points.map((p, i) => `
                    <circle cx="${p.x}" cy="${p.y}" r="3" fill="#007AFF" stroke="white" stroke-width="1.5"/>
                    <title>${formatDate(p.date)}: 正确率 ${p.accuracy}%</title>
                `).join('')}
            </svg>

            <!-- X轴标签 -->
            <div style="
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                font-size: 12px;
                color: #8E8E93;
            ">
                ${progressData.filter((d, i) => i % 2 === 0 || i === progressData.length - 1).map(d => `
                    <span>${d.date ? formatDate(d.date) : ''}</span>
                `).join('')}
            </div>
        `;

        card.appendChild(chartContainer);
        return card;
    },

    createBadgesSection(achievements) {
        const section = document.createElement('div');
        section.className = 'glass';
        section.style.cssText = `
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        // 标题区域
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        `;
        header.innerHTML = `
            <h4 style="
                font-size: 17px;
                font-weight: 600;
                color: #1C1C1E;
                display: flex;
                align-items: center;
                gap: 8px;
            ">
                <span>🏆</span><span>我的徽章</span>
            </h4>
            <span style="font-size: 14px; color: #8E8E93;">
                已获得 ${achievements.badges.length} 个
            </span>
        `;
        section.appendChild(header);

        // 连续练习天数展示
        if (achievements.streakDays > 0) {
            const streakBanner = document.createElement('div');
            streakBanner.style.cssText = `
                background: linear-gradient(135deg, #FF9500 0%, #FF6B00 100%);
                border-radius: 14px;
                padding: 16px 20px;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                color: white;
            `;
            streakBanner.innerHTML = `
                <span style="font-size: 32px;">🔥</span>
                <div>
                    <div style="font-size: 15px; font-weight: 600;">连续练习 ${achievements.streakDays} 天</div>
                    <div style="font-size: 13px; opacity: 0.9;">保持这个节奏！</div>
                </div>
            `;
            section.appendChild(streakBanner);
        }

        // 徽章网格
        const badgesGrid = document.createElement('div');
        badgesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        `;

        // 显示最新的6个徽章
        const recentBadges = achievements.badges.slice(-6).reverse();

        recentBadges.forEach(badge => {
            const badgeCard = document.createElement('div');
            badgeCard.style.cssText = `
                text-align: center;
                padding: 16px 12px;
                background: ${badge.color}10;
                border-radius: 14px;
                border: 1px solid ${badge.color}30;
            `;
            badgeCard.innerHTML = `
                <div style="font-size: 32px; margin-bottom: 8px;">${badge.icon}</div>
                <div style="font-size: 13px; font-weight: 600; color: ${badge.color}; margin-bottom: 2px;">
                    ${badge.name}
                </div>
                <div style="font-size: 11px; color: #8E8E93;">
                    ${badge.type === 'streak' ? '连续练习' :
                      badge.type === 'questions' ? '刷题成就' :
                      '错题消灭'}
                </div>
            `;
            badgesGrid.appendChild(badgeCard);
        });

        section.appendChild(badgesGrid);

        // 待解锁徽章提示
        const nextBadges = this.getNextBadges(achievements);
        if (nextBadges.length > 0) {
            const nextSection = document.createElement('div');
            nextSection.style.cssText = `
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(0, 0, 0, 0.06);
            `;
            nextSection.innerHTML = `
                <div style="font-size: 13px; color: #8E8E93; margin-bottom: 12px;">即将解锁</div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${nextBadges.map(badge => `
                        <div style="
                            display: flex;
                            align-items: center;
                            gap: 6px;
                            padding: 8px 12px;
                            background: rgba(120, 120, 128, 0.08);
                            border-radius: 10px;
                            font-size: 13px;
                            color: #8E8E93;
                        ">
                            <span style="opacity: 0.5;">${badge.icon}</span>
                            <span>${badge.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            section.appendChild(nextSection);
        }

        return section;
    },

    getNextBadges(achievements) {
        const next = [];

        // 连续练习
        const streakTargets = [
            { days: 3, name: '坚持3天', icon: '🔥' },
            { days: 7, name: '坚持7天', icon: '🔥' },
            { days: 30, name: '坚持30天', icon: '👑' }
        ];
        const nextStreak = streakTargets.find(t => t.days > achievements.streakDays);
        if (nextStreak) {
            next.push({ ...nextStreak, progress: `${achievements.streakDays}/${nextStreak.days}天` });
        }

        // 刷题数量
        const questionTargets = [
            { count: 50, name: '初出茅庐', icon: '🌱' },
            { count: 100, name: '百题达人', icon: '🌿' },
            { count: 500, name: '练习大师', icon: '🌳' }
        ];
        const nextQuestion = questionTargets.find(t => t.count > achievements.totalQuestions);
        if (nextQuestion) {
            next.push({ ...nextQuestion, progress: `${achievements.totalQuestions}/${nextQuestion.count}题` });
        }

        return next.slice(0, 2); // 只显示前2个
    }
};
