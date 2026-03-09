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
        const userData = Storage.getUserData();
        const displaySettings = userData.displaySettings || {};

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 欢迎区域（可开关）
        if (displaySettings.welcomeSection !== false) {
            this.elements.welcomeSection = this.createWelcomeSection();
            page.appendChild(this.elements.welcomeSection);
        }

        // 统计卡片网格（始终显示）
        this.elements.statsGrid = this.createStatsGrid(summary);
        page.appendChild(this.elements.statsGrid);

        // 快速开始卡片（始终显示）
        this.elements.quickStartCard = this.createQuickStartCard();
        page.appendChild(this.elements.quickStartCard);

        // 能力雷达图（可开关）
        if (displaySettings.radarChart !== false) {
            this.elements.radarChart = this.createRadarChart();
            page.appendChild(this.elements.radarChart);
        }

        // 复习提醒（有条件显示，可开关）
        if (displaySettings.reviewAlert !== false && summary.reviewCount > 0) {
            this.elements.reviewAlert = this.createReviewAlert(summary.reviewCount);
            page.appendChild(this.elements.reviewAlert);
        }

        // 进步曲线图（有条件显示，可开关）
        if (displaySettings.progressChart !== false && summary.practiceCount > 0) {
            this.elements.progressChart = this.createProgressChart();
            page.appendChild(this.elements.progressChart);
        }

        // 徽章展示（有条件显示，可开关）
        if (displaySettings.badgesSection !== false && achievements.badges.length > 0) {
            this.elements.badgesSection = this.createBadgesSection(achievements);
            page.appendChild(this.elements.badgesSection);
        }

        // 使用提示（可开关）
        if (displaySettings.tipsSection !== false) {
            this.elements.tipsSection = this.createTipsSection();
            page.appendChild(this.elements.tipsSection);
        }

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
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 20px;
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
            border-radius: 20px;
            padding: 24px 32px;
            margin-bottom: 20px;
            box-shadow: 0 8px 32px rgba(0, 122, 255, 0.3);
        `;

        // 获取数据
        const summary = Storage.getStatsSummary();
        const userData = Storage.getUserData();
        const lastPractice = this.getLastPracticeInfo(userData);
        const recommended = this.getRecommendedPractice(userData);

        // 主内容区
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 20px;
        `;

        // 头部区域：欢迎语 + 主按钮
        const headerArea = document.createElement('div');
        headerArea.style.cssText = `
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
        `;

        // 文字区域
        const textArea = document.createElement('div');
        const welcomeText = lastPractice.type
            ? `上次练习：${lastPractice.type} · ${lastPractice.difficulty}`
            : '准备好开始今天的练习了吗？';
        const subText = lastPractice.type
            ? `共练习 ${lastPractice.count} 题，正确率 ${lastPractice.accuracy}%`
            : '从简单的加法开始，一步步找回自信';

        textArea.innerHTML = `
            <h3 style="font-size: 22px; font-weight: 700; color: white; margin-bottom: 8px;">
                ${welcomeText}
            </h3>
            <p style="font-size: 15px; color: rgba(255, 255, 255, 0.85);">
                ${subText}
            </p>
        `;
        headerArea.appendChild(textArea);

        // 开始练习按钮
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
            white-space: nowrap;
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

        headerArea.appendChild(startBtn);
        content.appendChild(headerArea);

        // 快捷入口网格
        const quickGrid = document.createElement('div');
        quickGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        `;

        // 快捷入口项
        const quickItems = [
            {
                icon: '📚',
                label: '复习错题',
                count: summary.reviewCount,
                showBadge: summary.reviewCount > 0,
                onClick: () => router.navigate('mistakes'),
                disabled: summary.reviewCount === 0
            },
            {
                icon: lastPractice.typeIcon || '✏️',
                label: '继续练习',
                subLabel: lastPractice.type || '上次记录',
                onClick: () => this.continueLastPractice(lastPractice),
                disabled: !lastPractice.type
            },
            {
                icon: recommended.icon || '💡',
                label: '智能推荐',
                subLabel: recommended.text,
                onClick: () => this.startRecommendedPractice(recommended)
            }
        ];

        quickItems.forEach(item => {
            const itemEl = document.createElement('button');
            itemEl.className = 'btn-press';
            itemEl.style.cssText = `
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                padding: 16px;
                cursor: ${item.disabled ? 'default' : 'pointer'};
                opacity: ${item.disabled ? 0.5 : 1};
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                transition: all 200ms ease;
            `;

            const countBadge = item.showBadge
                ? `<span style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: #FF3B30;
                    color: white;
                    font-size: 12px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 10px;
                    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
                ">${item.count}</span>`
                : '';

            itemEl.innerHTML = `
                <div style="position: relative;">
                    <span style="font-size: 28px;">${item.icon}</span>
                    ${countBadge}
                </div>
                <span style="font-size: 14px; font-weight: 600; color: white;">${item.label}</span>
                ${item.subLabel ? `<span style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">${item.subLabel}</span>` : ''}
            `;

            if (!item.disabled) {
                itemEl.onclick = item.onClick;
                itemEl.addEventListener('mouseenter', () => {
                    itemEl.style.background = 'rgba(255, 255, 255, 0.25)';
                    itemEl.style.transform = 'scale(1.02)';
                });
                itemEl.addEventListener('mouseleave', () => {
                    itemEl.style.background = 'rgba(255, 255, 255, 0.15)';
                    itemEl.style.transform = 'scale(1)';
                });
            }

            quickGrid.appendChild(itemEl);
        });

        content.appendChild(quickGrid);
        card.appendChild(content);

        return card;
    },

    /**
     * 获取最近练习信息
     */
    getLastPracticeInfo(userData) {
        const typeStats = userData.typeStats || {};
        const lastPracticeDate = userData.stats?.lastPracticeDate;

        // 找出最近练习的类型
        let lastType = null;
        let lastTypeTotal = 0;
        const typeNames = {
            addition: { name: '加法', icon: '➕' },
            subtraction: { name: '减法', icon: '➖' },
            multiplication: { name: '乘法', icon: '✖️' },
            division: { name: '除法', icon: '➗' }
        };

        // 找做题最多的类型作为"最近练习"
        Object.entries(typeStats).forEach(([type, stats]) => {
            if (stats.total > lastTypeTotal) {
                lastTypeTotal = stats.total;
                lastType = type;
            }
        });

        if (!lastType || lastTypeTotal === 0) {
            return { type: null, difficulty: null, count: 0, accuracy: 0 };
        }

        const stats = typeStats[lastType];
        const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

        // 获取该类型的最高难度等级
        const skillProgress = userData.skillProgress?.[lastType] || {};
        let maxDifficulty = 'level1';
        const difficultyLevels = ['level6', 'level5', 'level4', 'level3', 'level2', 'level1'];
        const diffNames = {
            level1: '入门', level2: '进阶', level3: '熟练',
            level4: '高手', level5: '专家', level6: '大师'
        };

        for (const level of difficultyLevels) {
            if (skillProgress[level] > 0) {
                maxDifficulty = level;
                break;
            }
        }

        return {
            type: typeNames[lastType]?.name || lastType,
            typeIcon: typeNames[lastType]?.icon || '✏️',
            difficulty: diffNames[maxDifficulty] || '入门',
            count: lastTypeTotal,
            accuracy: accuracy,
            typeKey: lastType
        };
    },

    /**
     * 获取智能推荐
     */
    getRecommendedPractice(userData) {
        const typeStats = userData.typeStats || {};
        const mistakes = userData.mistakes || [];

        // 如果有待复习错题，推荐复习
        const todayMistakes = mistakes.filter(m => m.nextReviewDate <= new Date().toISOString().split('T')[0]);
        if (todayMistakes.length > 0) {
            return { text: '错题复习', icon: '📖', action: 'mistakes' };
        }

        // 找出正确率最低的类型
        let lowestAccuracy = 100;
        let recommendType = 'addition';
        const typeNames = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };

        Object.entries(typeStats).forEach(([type, stats]) => {
            if (stats.total >= 5) {
                const accuracy = (stats.correct / stats.total) * 100;
                if (accuracy < lowestAccuracy) {
                    lowestAccuracy = accuracy;
                    recommendType = type;
                }
            }
        });

        return {
            text: typeNames[recommendType] || '加法',
            icon: '💡',
            action: 'practice',
            type: recommendType
        };
    },

    /**
     * 继续上次练习
     */
    continueLastPractice(lastPractice) {
        if (!lastPractice.typeKey) return;

        // 直接跳转到练习设置，并预填充上次配置
        const config = {
            mode: 'choice',
            difficulty: 'level1',
            types: [lastPractice.typeKey],
            count: 10
        };

        sessionStorage.setItem('practice_config', JSON.stringify(config));

        // 生成题目
        const questions = QuestionGenerator.generate({
            type: lastPractice.typeKey,
            difficulty: 'level1',
            count: 10
        });

        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        router.navigate('practice-choice');
    },

    /**
     * 开始智能推荐的练习
     */
    startRecommendedPractice(recommended) {
        if (recommended.action === 'mistakes') {
            router.navigate('mistakes');
        } else {
            const config = {
                mode: 'choice',
                difficulty: 'level1',
                types: [recommended.type],
                count: 10
            };

            sessionStorage.setItem('practice_config', JSON.stringify(config));

            const questions = QuestionGenerator.generate({
                type: recommended.type,
                difficulty: 'level1',
                count: 10
            });

            sessionStorage.setItem('practice_questions', JSON.stringify(questions));
            sessionStorage.setItem('practice_current', '0');
            sessionStorage.setItem('practice_answers', JSON.stringify([]));
            sessionStorage.setItem('practice_start_time', Date.now().toString());

            router.navigate('practice-choice');
        }
    },

    createRadarChart() {
        // 从全局统计数据计算各项能力的掌握程度
        const skills = {
            addition: this.calculateSkillScore('addition'),
            subtraction: this.calculateSkillScore('subtraction'),
            multiplication: this.calculateSkillScore('multiplication'),
            division: this.calculateSkillScore('division')
        };

        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 24px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            cursor: pointer;
            transition: transform 200ms ease;
        `;
        card.onclick = () => router.navigate('basic-training');
        card.onmouseenter = () => card.style.transform = 'scale(1.01)';
        card.onmouseleave = () => card.style.transform = 'scale(1)';

        // 雷达图 SVG - 使用更大的画布和viewBox防止裁切
        const svgSize = 280;
        const padding = 50;
        const viewBoxSize = svgSize + padding * 2;
        const center = viewBoxSize / 2;
        const radius = 100;
        const angleStep = (Math.PI * 2) / 4;

        // 计算四个顶点的坐标
        const points = [
            { x: center, y: center - radius, label: '加法', value: skills.addition, color: '#34C759' },
            { x: center + radius, y: center, label: '乘法', value: skills.multiplication, color: '#007AFF' },
            { x: center, y: center + radius, label: '减法', value: skills.subtraction, color: '#FF9500' },
            { x: center - radius, y: center, label: '除法', value: skills.division, color: '#AF52DE' }
        ];

        // 生成技能多边形
        const polygonPoints = points.map((p, i) => {
            const value = p.value / 100;
            const angle = -Math.PI / 2 + i * angleStep;
            const x = center + radius * value * Math.cos(angle);
            const y = center + radius * value * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        // 生成背景网格
        const gridLevels = [0.25, 0.5, 0.75, 1];
        const gridPolygons = gridLevels.map(level => {
            const gridPoints = points.map((p, i) => {
                const angle = -Math.PI / 2 + i * angleStep;
                const x = center + radius * level * Math.cos(angle);
                const y = center + radius * level * Math.sin(angle);
                return `${x},${y}`;
            }).join(' ');
            return `<polygon points="${gridPoints}" fill="none" stroke="#E5E5EA" stroke-width="1" />`;
        }).join('');

        // 生成轴线
        const axes = points.map((p, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#E5E5EA" stroke-width="1" />`;
        }).join('');

        // 生成标签
        const labels = points.map((p, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const labelRadius = radius + 35;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            return `
                <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle"
                    style="font-size: 14px; font-weight: 600; fill: ${p.color};">
                    ${p.label}
                </text>
                <text x="${x}" y="${y + 16}" text-anchor="middle" dominant-baseline="middle"
                    style="font-size: 12px; fill: #8E8E93;">
                    ${p.value}%
                </text>
            `;
        }).join('');

        const averageScore = Math.round((skills.addition + skills.subtraction + skills.multiplication + skills.division) / 4);

        card.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <div>
                    <h3 style="font-size: 18px; font-weight: 700; color: #1C1C1E; margin: 0;">能力雷达</h3>
                    <p style="font-size: 13px; color: #8E8E93; margin: 4px 0 0 0;">点击进行基础训练</p>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 28px; font-weight: 700; color: #007AFF;">${averageScore}%</div>
                    <div style="font-size: 12px; color: #8E8E93;">综合得分</div>
                </div>
            </div>
            <div style="display: flex; justify-content: center;">
                <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}">
                    ${gridPolygons}
                    ${axes}
                    <polygon points="${polygonPoints}" fill="rgba(0, 122, 255, 0.2)" stroke="#007AFF" stroke-width="2" />
                    ${points.map((p, i) => {
                        const value = p.value / 100;
                        const angle = -Math.PI / 2 + i * angleStep;
                        const x = center + radius * value * Math.cos(angle);
                        const y = center + radius * value * Math.sin(angle);
                        return `<circle cx="${x}" cy="${y}" r="5" fill="${p.color}" />`;
                    }).join('')}
                    ${labels}
                </svg>
            </div>
            <div style="display: flex; justify-content: center; gap: 16px; margin-top: 12px;">
                ${points.map(p => `
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${p.color};"></div>
                        <span style="font-size: 12px; color: #8E8E93;">${p.label}</span>
                    </div>
                `).join('')}
            </div>
        `;

        return card;
    },

    calculateSkillScore(skillType) {
        const userData = Storage.getUserData();

        // 优先使用 typeStats（全局统计）
        if (userData.typeStats && userData.typeStats[skillType]) {
            const stats = userData.typeStats[skillType];
            if (stats.total === 0) return 0;
            // 根据正确率计算得分，至少做5题才开始计分
            const accuracy = stats.total >= 5 ? (stats.correct / stats.total) : (stats.correct / 5);
            return Math.min(100, Math.round(accuracy * 100));
        }

        // 兼容旧数据：从 skillProgress 计算
        const skillProgress = userData.skillProgress || {};
        const skillData = skillProgress[skillType];
        if (!skillData) return 0;

        // 转换旧数据格式
        if (skillData.correct !== undefined && skillData.total !== undefined) {
            if (skillData.total === 0) return 0;
            const accuracy = skillData.total >= 5 ? (skillData.correct / skillData.total) : (skillData.correct / 5);
            return Math.min(100, Math.round(accuracy * 100));
        }

        // 旧的基础训练格式
        if (skillData.mastered) {
            const mastered = skillData.mastered.length;
            const totalByLevel = skillData.level === 1 ? 15 : (skillData.level === 2 ? 40 : 100);
            return Math.min(100, Math.round((mastered / totalByLevel) * 100));
        }

        return 0;
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
    },

    /**
     * 显示提示消息
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 24px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            animation: fadeInUp 300ms ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 300ms ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
};
