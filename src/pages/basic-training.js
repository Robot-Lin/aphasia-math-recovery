/**
 * 基础训练页面 - 认知基础强化训练
 * 针对命名性失语症患者的数感建立与计算自动化
 */

const BasicTrainingPage = {
    // 当前训练状态
    state: {
        currentIndex: 0,
        items: [],
        showAnswer: false,
        mastered: new Set(),
        mode: 'fillblank', // fillblank, flashcard
        type: 'multiplication', // multiplication, additionTen, subtractionTen
        level: 1,
        isProcessing: false, // 防止重复点击锁
        hasStarted: false // 是否已开始训练
    },

    // 训练类型配置
    trainingTypes: {
        additionTen: {
            id: 'additionTen',
            name: '凑十法',
            desc: '建立进位加法基础',
            icon: '➕',
            color: '#34C759',
            levels: [
                { level: 1, label: '基础', desc: '1+9, 2+8...' },
                { level: 2, label: '进位', desc: '8+5, 7+6...' },
                { level: 3, label: '混合', desc: '综合练习' }
            ]
        },
        subtractionTen: {
            id: 'subtractionTen',
            name: '破十法',
            desc: '建立退位减法基础',
            icon: '➖',
            color: '#FF9500',
            levels: [
                { level: 1, label: '基础', desc: '10-1, 10-2...' },
                { level: 2, label: '退位', desc: '15-7, 14-6...' },
                { level: 3, label: '混合', desc: '综合练习' }
            ]
        },
        multiplication: {
            id: 'multiplication',
            name: '乘法表',
            desc: '九九乘法表',
            icon: '✕',
            color: '#007AFF',
            levels: [
                { level: 1, label: '入门', desc: '1-5' },
                { level: 2, label: '进阶', desc: '1-9' },
                { level: 3, label: '挑战', desc: '1-12' }
            ]
        }
    },

    init() {
        // 重置状态，显示选择页面
        this.state.hasStarted = false;
        this.renderSelection();
    },

    // 开始训练
    startTraining(type, level) {
        this.state.type = type;
        this.state.level = level;
        this.state.hasStarted = true;
        this.state.currentIndex = 0;
        this.state.showAnswer = false;
        this.state.isProcessing = false;

        this.loadProgress();
        this.generateItems();
        this.render();
    },

    // 渲染选择页面
    renderSelection() {
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
        header.style.cssText = 'text-align: center; margin-bottom: 40px;';
        header.innerHTML = `
            <h2 style="font-size: 36px; font-weight: 800; color: #1C1C1E; margin-bottom: 12px;">
                📚 基础训练
            </h2>
            <p style="font-size: 17px; color: #8E8E93;">
                选择训练类型，建立扎实基础
            </p>
        `;
        page.appendChild(header);

        // 训练类型卡片网格
        const typesGrid = document.createElement('div');
        typesGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        `;

        // 三种训练类型
        const types = ['additionTen', 'subtractionTen', 'multiplication'];
        types.forEach(typeKey => {
            const type = this.trainingTypes[typeKey];
            const typeCard = this.createTypeCard(typeKey, type);
            typesGrid.appendChild(typeCard);
        });

        page.appendChild(typesGrid);

        // 提示信息
        const tip = document.createElement('div');
        tip.style.cssText = `
            text-align: center;
            padding: 20px;
            background: rgba(0, 122, 255, 0.06);
            border-radius: 16px;
            color: #8E8E93;
            font-size: 14px;
        `;
        tip.innerHTML = '💡 建议从 L1 开始，循序渐进提升能力';
        page.appendChild(tip);

        container.appendChild(page);
    },

    // 创建训练类型卡片
    createTypeCard(typeKey, type) {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 24px;
            padding: 28px;
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            transition: transform 200ms ease, box-shadow 200ms ease;
        `;

        // 获取该类型的进度
        const userData = Storage.getUserData();
        const progressKey = `basic_${typeKey}`;
        const progress = userData.skillProgress?.[progressKey] || {};
        const currentLevel = progress.level || 1;
        const masteredCount = progress.mastered?.length || 0;

        // 计算总题数
        const totalItems = typeKey === 'multiplication' ? (currentLevel === 1 ? 25 : (currentLevel === 2 ? 81 : 144)) : 45;
        const progressPercent = Math.round((masteredCount / totalItems) * 100);

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 16px;
                    background: ${type.color}15;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                ">${type.icon}</div>
                <h3 style="font-size: 22px; font-weight: 700; color: #1C1C1E; margin-bottom: 6px;">
                    ${type.name}
                </h3>
                <p style="font-size: 14px; color: #8E8E93;">${type.desc}</p>
            </div>

            <!-- 进度条 -->
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 12px; color: #8E8E93;">当前进度</span>
                    <span style="font-size: 12px; color: ${type.color}; font-weight: 600;">${progressPercent}%</span>
                </div>
                <div style="height: 6px; background: #E5E5EA; border-radius: 3px; overflow: hidden;">
                    <div style="
                        width: ${progressPercent}%;
                        height: 100%;
                        background: ${type.color};
                        border-radius: 3px;
                        transition: width 400ms ease;
                    "></div>
                </div>
            </div>

            <!-- 等级选择按钮 -->
            <div style="display: flex; gap: 10px;">
                ${type.levels.map((lvl, idx) => {
                    const levelNum = idx + 1;
                    const isUnlocked = levelNum <= currentLevel;
                    const isRecommended = levelNum === currentLevel;
                    return `
                        <button
                            onclick="BasicTrainingPage.startTraining('${typeKey}', ${levelNum})"
                            class="${isUnlocked ? 'level-btn-unlocked' : 'level-btn-locked'}"
                            style="
                                flex: 1;
                                padding: 14px 8px;
                                border-radius: 14px;
                                border: ${isUnlocked ? 'none' : '2px solid #E5E5EA'};
                                background: ${isUnlocked ? type.color : '#F2F2F7'};
                                color: ${isUnlocked ? 'white' : '#C7C7CC'};
                                font-size: 15px;
                                font-weight: 700;
                                cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};
                                transition: all 200ms ease;
                                box-shadow: ${isUnlocked ? `0 4px 14px ${type.color}40, inset 0 -2px 0 rgba(0,0,0,0.1)` : 'none'};
                                position: relative;
                                overflow: hidden;
                            "
                            ${!isUnlocked ? 'disabled' : ''}
                            onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='${isUnlocked ? `0 6px 20px ${type.color}50, inset 0 -2px 0 rgba(0,0,0,0.1)` : 'none'}';"
                            onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='${isUnlocked ? `0 4px 14px ${type.color}40, inset 0 -2px 0 rgba(0,0,0,0.1)` : 'none'}';"
                        >
                            ${isRecommended && isUnlocked ? `<div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.5);"></div>` : ''}
                            <div style="font-size: 13px; font-weight: 800; margin-bottom: 4px; letter-spacing: 0.5px;">${lvl.label}</div>
                            <div style="font-size: 11px; font-weight: 500; opacity: 0.85;">${lvl.desc}</div>
                            ${isRecommended && isUnlocked ? `<div style="margin-top: 6px; font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 10px; font-weight: 600;">推荐</div>` : ''}
                        </button>
                    `;
                }).join('')}
            </div>

            ${currentLevel < 3 ? `
            <div style="margin-top: 12px; text-align: center; font-size: 12px; color: #8E8E93;">
                完成当前等级可解锁下一级
            </div>
            ` : ''}
        `;

        // 悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.08)';
        });

        return card;
    },

    // 加载已掌握的进度
    loadProgress() {
        const userData = Storage.getUserData();
        const progressKey = `basic_${this.state.type}`;
        const progress = userData.skillProgress?.[progressKey] || {};
        this.state.mastered = new Set(progress.mastered || []);
        // 不覆盖 level，使用用户选择的 level
    },

    // 生成训练题目
    generateItems() {
        let items = [];

        switch (this.state.type) {
            case 'additionTen':
                items = this.generateAdditionItems();
                break;
            case 'subtractionTen':
                items = this.generateSubtractionItems();
                break;
            case 'multiplication':
                items = this.generateMultiplicationItems();
                break;
        }

        // 打乱顺序，优先未掌握的
        items.sort(() => Math.random() - 0.5);
        items.sort((a, b) => (a.mastered === b.mastered) ? 0 : a.mastered ? 1 : -1);

        this.state.items = items;
        this.state.currentIndex = 0;
    },

    // 生成凑十法题目
    generateAdditionItems() {
        const items = [];
        const level = this.state.level;

        if (level === 1) {
            // 基础：和为10的组合
            for (let a = 1; a <= 9; a++) {
                const b = 10 - a;
                const key = `${a}+${b}`;
                items.push({
                    a, b, answer: 10, key,
                    display: `${a} + ${b}`,
                    read: `${a}加${b}等于10`,
                    mastered: this.state.mastered.has(key),
                    hint: '凑十'
                });
            }
        } else if (level === 2) {
            // 进位：和为11-18的组合
            for (let a = 5; a <= 9; a++) {
                for (let b = 5; b <= 9; b++) {
                    if (a + b >= 11) {
                        const key = `${a}+${b}`;
                        items.push({
                            a, b, answer: a + b, key,
                            display: `${a} + ${b}`,
                            read: `${a}加${b}等于${a + b}`,
                            mastered: this.state.mastered.has(key),
                            hint: `${a}需要${10 - a}凑成10`
                        });
                    }
                }
            }
        } else {
            // 混合：1-9 任意加法
            for (let a = 1; a <= 9; a++) {
                for (let b = 1; b <= 9; b++) {
                    const key = `${a}+${b}`;
                    items.push({
                        a, b, answer: a + b, key,
                        display: `${a} + ${b}`,
                        read: `${a}加${b}等于${a + b}`,
                        mastered: this.state.mastered.has(key)
                    });
                }
            }
        }

        return items;
    },

    // 生成破十法题目
    generateSubtractionItems() {
        const items = [];
        const level = this.state.level;

        if (level === 1) {
            // 基础：10减几
            for (let a = 1; a <= 9; a++) {
                const key = `10-${a}`;
                items.push({
                    a: 10, b: a, answer: 10 - a, key,
                    display: `10 - ${a}`,
                    read: `10减${a}等于${10 - a}`,
                    mastered: this.state.mastered.has(key),
                    hint: '破十'
                });
            }
        } else if (level === 2) {
            // 退位：十几减几（需要借位）
            for (let a = 11; a <= 18; a++) {
                for (let b = 2; b <= 9; b++) {
                    if (b > a % 10) { // 需要退位
                        const key = `${a}-${b}`;
                        items.push({
                            a, b, answer: a - b, key,
                            display: `${a} - ${b}`,
                            read: `${a}减${b}等于${a - b}`,
                            mastered: this.state.mastered.has(key),
                            hint: `把${a}分成10和${a - 10}`
                        });
                    }
                }
            }
        } else {
            // 混合：1-20 任意减法
            for (let a = 5; a <= 20; a++) {
                for (let b = 1; b < a && b <= 9; b++) {
                    const key = `${a}-${b}`;
                    items.push({
                        a, b, answer: a - b, key,
                        display: `${a} - ${b}`,
                        read: `${a}减${b}等于${a - b}`,
                        mastered: this.state.mastered.has(key)
                    });
                }
            }
        }

        return items;
    },

    // 生成乘法表题目
    generateMultiplicationItems() {
        const items = [];
        const maxNum = this.state.level === 1 ? 5 : (this.state.level === 2 ? 9 : 12);

        for (let a = 1; a <= maxNum; a++) {
            for (let b = 1; b <= maxNum; b++) {
                if (a <= b) {
                    const key = `${a}×${b}`;
                    items.push({
                        a, b, answer: a * b, key,
                        display: `${a} × ${b}`,
                        read: `${a}乘${b}等于${a * b}`,
                        mastered: this.state.mastered.has(key)
                    });
                }
            }
        }

        return items;
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        `;

        // 页面标题
        page.appendChild(this.createHeader());

        // 主内容区：左侧训练卡片 + 右侧控制面板
        const mainContent = document.createElement('div');
        mainContent.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 280px;
            gap: 20px;
            align-items: start;
        `;

        // 左侧：训练卡片（核心区域，占据主要空间）
        if (this.state.items.length > 0) {
            mainContent.appendChild(this.createTrainingCard());
        }

        // 右侧：控制面板（类型、等级、进度、模式）
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 12px;
        `;
        controlPanel.appendChild(this.createTypeSelector());
        controlPanel.appendChild(this.createLevelSelector());
        controlPanel.appendChild(this.createProgressMiniCard());
        controlPanel.appendChild(this.createModeSelector());
        mainContent.appendChild(controlPanel);

        page.appendChild(mainContent);
        container.appendChild(page);
    },

    createHeader() {
        const typeConfig = this.trainingTypes[this.state.type];
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 20px;';
        header.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 32px;">${typeConfig.icon}</span>
                    <div>
                        <h2 style="font-size: 24px; font-weight: 700; color: #1C1C1E; margin: 0;">${typeConfig.name}</h2>
                        <p style="font-size: 14px; color: #8E8E93; margin: 2px 0 0 0;">${typeConfig.desc}</p>
                    </div>
                </div>
                <button onclick="BasicTrainingPage.backToSelection()" style="
                    padding: 10px 20px;
                    background: rgba(0, 0, 0, 0.06);
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #007AFF;
                    cursor: pointer;
                    transition: all 200ms ease;
                ">
                    ← 返回选择
                </button>
            </div>
        `;
        return header;
    },

    // 返回选择页面
    backToSelection() {
        this.state.hasStarted = false;
        this.renderSelection();
    },

    createTypeSelector() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const types = Object.values(this.trainingTypes);

        card.innerHTML = `
            <div style="font-size: 12px; font-weight: 600; color: #8E8E93; margin-bottom: 8px; text-transform: uppercase;">训练类型</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                ${types.map(t => `
                    <button onclick="BasicTrainingPage.setType('${t.id}')" style="
                        padding: 10px;
                        border-radius: 10px;
                        border: 2px solid ${this.state.type === t.id ? t.color : 'transparent'};
                        background: ${this.state.type === t.id ? t.color + '15' : 'rgba(0,0,0,0.04)'};
                        cursor: pointer;
                        transition: all 200ms ease;
                        text-align: left;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <span style="font-size: 18px;">${t.icon}</span>
                        <div>
                            <div style="font-size: 14px; font-weight: 600; color: ${this.state.type === t.id ? t.color : '#1C1C1E'};">${t.name}</div>
                            <div style="font-size: 11px; color: #8E8E93;">${t.desc}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
        `;

        return card;
    },

    createLevelSelector() {
        const typeConfig = this.trainingTypes[this.state.type];
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        card.innerHTML = `
            <div style="font-size: 12px; font-weight: 600; color: #8E8E93; margin-bottom: 8px; text-transform: uppercase;">难度等级</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
                ${typeConfig.levels.map(l => `
                    <button onclick="BasicTrainingPage.setLevel(${l.level})" style="
                        padding: 8px 10px;
                        border-radius: 8px;
                        border: 2px solid ${this.state.level === l.level ? typeConfig.color : 'transparent'};
                        background: ${this.state.level === l.level ? typeConfig.color + '15' : 'rgba(0,0,0,0.04)'};
                        cursor: pointer;
                        transition: all 200ms ease;
                        text-align: left;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    ">
                        <span style="font-size: 13px; font-weight: 600; color: ${this.state.level === l.level ? typeConfig.color : '#1C1C1E'};">${l.label}</span>
                        <span style="font-size: 11px; color: #8E8E93;">${l.desc}</span>
                    </button>
                `).join('')}
            </div>
        `;

        return card;
    },

    createProgressMiniCard() {
        const typeConfig = this.trainingTypes[this.state.type];
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const total = this.state.items.length;
        const mastered = this.state.items.filter(i => i.mastered).length;
        const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: conic-gradient(${typeConfig.color} ${percent * 3.6}deg, #E5E5EA 0deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    <div style="
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: ${typeConfig.color};
                    ">${percent}%</div>
                </div>
                <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 600; color: #1C1C1E;">掌握进度</div>
                    <div style="font-size: 12px; color: #8E8E93;">${mastered}/${total} 已掌握</div>
                    <div style="margin-top: 6px; height: 4px; background: #E5E5EA; border-radius: 2px;">
                        <div style="width: ${percent}%; height: 100%; background: ${typeConfig.color}; border-radius: 2px; transition: width 300ms ease;"></div>
                    </div>
                </div>
            </div>
        `;

        return card;
    },

    // 保留原来的大进度卡片方法（备用）
    createProgressCard() {
        return this.createProgressMiniCard();
    },

    createTrainingCard() {
        const typeConfig = this.trainingTypes[this.state.type];
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 24px;
            padding: 48px;
            min-height: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
        `;

        const current = this.state.items[this.state.currentIndex];
        const progress = `${this.state.currentIndex + 1} / ${this.state.items.length}`;

        if (this.state.mode === 'flashcard') {
            // 闪卡模式
            card.innerHTML = this.createFlashcardHTML(current, progress, typeConfig);
        } else {
            // 填空模式
            card.innerHTML = this.createFillblankHTML(current, progress, typeConfig);
        }

        return card;
    },

    createFlashcardHTML(current, progress, typeConfig) {
        // 朗读题目
        setTimeout(() => {
            if (SpeechManager.isEnabled() && !this.state.showAnswer) {
                SpeechManager.speakExpression(current.display);
            }
        }, 300);

        return `
            <div style="margin-bottom: 24px;">
                <span style="font-size: 14px; color: #8E8E93; background: rgba(0,0,0,0.04); padding: 6px 16px; border-radius: 12px;">${progress}</span>
            </div>

            <div style="margin-bottom: 48px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 96px; font-weight: 700; color: #1C1C1E; margin-bottom: 24px; font-feature-settings: 'tnum';">
                    ${current.display}
                </div>

                ${current.hint && !this.state.showAnswer ? `
                    <div style="font-size: 17px; color: #8E8E93; margin-bottom: 16px;">💡 ${current.hint}</div>
                ` : ''}

                ${this.state.showAnswer ? `
                    <div style="font-size: 64px; font-weight: 700; color: ${typeConfig.color}; animation: fadeIn 300ms ease;">
                        ${current.answer}
                    </div>
                    <button onclick="SpeechManager.speakNumber(${current.answer})" style="
                        margin-top: 16px;
                        padding: 12px 24px;
                        background: rgba(0,0,0,0.04);
                        border: none;
                        border-radius: 20px;
                        font-size: 14px;
                        color: ${typeConfig.color};
                        cursor: pointer;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                    ">
                        🔊 朗读答案
                    </button>
                ` : `
                    <div style="font-size: 64px; font-weight: 700; color: #E5E5EA;">?</div>
                `}

                <button onclick="SpeechManager.speakExpression('${current.display}')" style="
                    margin-top: 24px;
                    padding: 12px 24px;
                    background: rgba(0,0,0,0.04);
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #8E8E93;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                ">
                    🔊 朗读题目
                </button>
            </div>

            <div style="display: flex; gap: 16px; justify-content: center;">
                ${!this.state.showAnswer ? `
                    <button onclick="BasicTrainingPage.showAnswer()" style="
                        padding: 20px 48px;
                        background: ${typeConfig.color};
                        color: white;
                        border: none;
                        border-radius: 16px;
                        font-size: 18px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 6px 20px ${typeConfig.color}50;
                        transition: transform 150ms ease;
                    ">显示答案</button>
                ` : `
                    <button onclick="BasicTrainingPage.markIncorrect()" style="
                        padding: 16px 32px;
                        background: #FF3B30;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                    ">还需练习</button>
                    <button onclick="BasicTrainingPage.markCorrect()" style="
                        padding: 16px 32px;
                        background: #34C759;
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        cursor: pointer;
                    ">已掌握</button>
                `}
            </div>

            <div style="margin-top: 32px;">
                <button onclick="BasicTrainingPage.nextItem()" style="
                    padding: 12px 24px;
                    background: transparent;
                    color: #8E8E93;
                    border: none;
                    font-size: 15px;
                    cursor: pointer;
                ">跳过 ›</button>
            </div>
        `;
    },

    createFillblankHTML(current, progress, typeConfig) {
        // 朗读题目
        setTimeout(() => {
            if (SpeechManager.isEnabled()) {
                SpeechManager.speakExpression(current.display);
            }
        }, 300);

        return `
            <div style="margin-bottom: 24px;">
                <span style="font-size: 14px; color: #8E8E93; background: rgba(0,0,0,0.04); padding: 6px 16px; border-radius: 12px;">${progress}</span>
            </div>

            <div style="margin-bottom: 40px;">
                <div style="font-size: 72px; font-weight: 700; color: #1C1C1E; margin-bottom: 32px; font-feature-settings: 'tnum'; letter-spacing: 8px;">
                    ${current.display} <span style="color: ${typeConfig.color};">?</span>
                </div>
                <button onclick="SpeechManager.speakExpression('${current.display}')" style="
                    padding: 12px 24px;
                    background: rgba(0,0,0,0.04);
                    border: none;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #8E8E93;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                ">
                    🔊 朗读题目
                </button>
            </div>

            <div id="fillblank-options" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 360px; margin: 0 auto;">
                ${this.generateOptions(current.answer).map(opt => `
                    <button onclick="BasicTrainingPage.selectAnswer(${opt}, ${current.answer})" style="
                        padding: 20px;
                        background: ${typeConfig.color}15;
                        color: ${typeConfig.color};
                        border: none;
                        border-radius: 16px;
                        font-size: 28px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 150ms ease;
                    ">${opt}</button>
                `).join('')}
            </div>

            <div id="fillblank-feedback" style="margin-top: 32px; min-height: 48px;"></div>
        `;
    },

    // 生成干扰选项
    generateOptions(correct) {
        const options = new Set([correct]);
        while (options.size < 6) {
            const offset = Math.floor(Math.random() * 10) - 5;
            const wrong = correct + offset;
            if (wrong > 0 && wrong !== correct) {
                options.add(wrong);
            }
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    createModeSelector() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const modes = [
            { key: 'fillblank', label: '填空', icon: '✏️' },
            { key: 'flashcard', label: '闪卡', icon: '👁️' }
        ];

        card.innerHTML = `
            <div style="font-size: 12px; font-weight: 600; color: #8E8E93; margin-bottom: 8px; text-transform: uppercase;">训练模式</div>
            <div style="display: flex; gap: 8px;">
                ${modes.map(m => `
                    <button onclick="BasicTrainingPage.setMode('${m.key}')" style="
                        flex: 1;
                        padding: 10px;
                        border-radius: 10px;
                        border: 2px solid ${this.state.mode === m.key ? '#007AFF' : 'transparent'};
                        background: ${this.state.mode === m.key ? '#007AFF15' : 'rgba(0,0,0,0.04)'};
                        cursor: pointer;
                        transition: all 200ms ease;
                        text-align: center;
                    ">
                        <div style="font-size: 16px; margin-bottom: 2px;">${m.icon}</div>
                        <div style="font-size: 13px; font-weight: 600; color: ${this.state.mode === m.key ? '#007AFF' : '#1C1C1E'};">${m.label}</div>
                    </button>
                `).join('')}
            </div>
        `;

        return card;
    },

    // 交互方法
    setType(type) {
        this.state.type = type;
        this.state.level = 1;
        this.state.isProcessing = false;
        this.loadProgress();
        this.generateItems();
        this.render();
    },

    setLevel(level) {
        this.state.level = level;
        this.state.isProcessing = false;
        this.saveProgress();
        this.generateItems();
        this.render();
    },

    setMode(mode) {
        this.state.mode = mode;
        this.state.showAnswer = false;
        this.state.isProcessing = false;
        this.render();
    },

    showAnswer() {
        if (this.state.isProcessing) return;
        this.state.showAnswer = true;
        this.render();
    },

    markCorrect() {
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;

        const current = this.state.items[this.state.currentIndex];
        this.state.mastered.add(current.key);
        this.saveProgress();

        setTimeout(() => {
            this.state.isProcessing = false;
            this.nextItem();
        }, 200);
    },

    markIncorrect() {
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;

        const current = this.state.items[this.state.currentIndex];
        this.state.mastered.delete(current.key);
        this.saveProgress();

        setTimeout(() => {
            this.state.isProcessing = false;
            this.nextItem();
        }, 200);
    },

    selectAnswer(selected, correct) {
        // 防止重复点击
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;

        const feedback = document.getElementById('fillblank-feedback');
        const current = this.state.items[this.state.currentIndex];

        // 禁用所有选项按钮
        const buttons = document.querySelectorAll('#fillblank-options button');
        buttons.forEach(btn => btn.disabled = true);

        if (selected === correct) {
            this.state.mastered.add(current.key);
            this.saveProgress();
            feedback.innerHTML = `
                <div style="color: #34C759; font-size: 18px; font-weight: 600; animation: fadeIn 200ms ease; margin-bottom: 16px;">✓ 正确！</div>
                <button onclick="BasicTrainingPage.nextItem()" style="
                    padding: 14px 32px;
                    background: #34C759;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(52, 199, 89, 0.3);
                    transition: all 200ms ease;
                ">下一题 →</button>
            `;
            // 语音反馈
            SpeechManager.speakFeedback(true);
        } else {
            this.state.mastered.delete(current.key);
            this.saveProgress();
            // 高亮正确答案
            buttons.forEach(btn => {
                if (parseInt(btn.textContent) === correct) {
                    btn.style.background = '#34C759';
                    btn.style.color = 'white';
                }
            });
            feedback.innerHTML = `
                <div style="color: #FF3B30; font-size: 18px; font-weight: 600; animation: fadeIn 200ms ease; margin-bottom: 16px;">✗ 正确答案是 ${correct}</div>
                <button onclick="BasicTrainingPage.nextItem()" style="
                    padding: 14px 32px;
                    background: #007AFF;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
                    transition: all 200ms ease;
                ">下一题 →</button>
            `;
            // 语音反馈：朗读正确答案
            SpeechManager.speak(`正确答案是${SpeechManager.convertNumberToChinese(correct)}`);
        }
    },

    nextItem() {
        this.state.showAnswer = false;
        this.state.isProcessing = false;
        this.state.currentIndex = (this.state.currentIndex + 1) % this.state.items.length;
        this.render();
    },

    saveProgress() {
        const userData = Storage.getUserData();
        if (!userData.skillProgress) userData.skillProgress = {};

        const progressKey = `basic_${this.state.type}`;
        userData.skillProgress[progressKey] = {
            level: this.state.level,
            mastered: Array.from(this.state.mastered),
            updatedAt: new Date().toISOString()
        };

        Storage.saveUserData(userData);
    }
};

