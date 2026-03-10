/**
 * 挑战模式 - 动态难度自适应训练
 * 混合模式 + 专项模式
 */

const ChallengePage = {
    // 当前状态
    state: {
        level: 1,           // 当前难度等级 1-6
        streak: 0,          // 当前连续答对数
        totalCorrect: 0,    // 总答对数
        totalWrong: 0,      // 总答错数
        currentQuestion: null,
        isProcessing: false,
        highestLevel: 1,    // 历史最高等级
        sessionStartTime: null,
        hasStarted: false,  // 是否已开始挑战
        challengeMode: null, // 'mixed' | 'specialized'
        operationType: null, // 'addition' | 'subtraction' | 'multiplication' | 'division'
        typeStats: {        // 各类型统计
            addition: { correct: 0, wrong: 0 },
            subtraction: { correct: 0, wrong: 0 },
            multiplication: { correct: 0, wrong: 0 },
            division: { correct: 0, wrong: 0 }
        }
    },

    // 难度配置
    difficultyConfig: {
        1: { name: '入门', desc: '个位数运算', digitsA: 1, digitsB: 1, minA: 1, minB: 1 },
        2: { name: '进阶', desc: '个位+两位', digitsA: 1, digitsB: 2, minA: 1, minB: 10 },
        3: { name: '熟练', desc: '个位+三位', digitsA: 1, digitsB: 3, minA: 1, minB: 100 },
        4: { name: '高手', desc: '两位数运算', digitsA: 2, digitsB: 2, minA: 10, minB: 10 },
        5: { name: '专家', desc: '两位+三位', digitsA: 2, digitsB: 3, minA: 10, minB: 100 },
        6: { name: '大师', desc: '三位数运算', digitsA: 3, digitsB: 3, minA: 100, minB: 100 }
    },

    // 运算类型配置
    operationTypes: {
        addition: { name: '加法', icon: '➕', color: '#34C759', speech: '加' },
        subtraction: { name: '减法', icon: '➖', color: '#FF9500', speech: '减' },
        multiplication: { name: '乘法', icon: '✖️', color: '#007AFF', speech: '乘' },
        division: { name: '除法', icon: '➗', color: '#AF52DE', speech: '除以' }
    },

    init() {
        this.loadProgress();
        // 重置状态
        this.state.totalCorrect = 0;
        this.state.totalWrong = 0;
        this.state.streak = 0;
        this.state.level = 1;
        this.state.hasStarted = false;
        this.state.challengeMode = null;
        this.state.operationType = null;
        this.state.typeStats = {
            addition: { correct: 0, wrong: 0 },
            subtraction: { correct: 0, wrong: 0 },
            multiplication: { correct: 0, wrong: 0 },
            division: { correct: 0, wrong: 0 }
        };

        // 显示模式选择页面
        this.renderModeSelect();
    },

    // 加载历史进度
    loadProgress() {
        const userData = Storage.getUserData();
        this.state.highestLevel = userData.challengeHighestLevel || 1;
    },

    // 保存最高等级
    saveProgress() {
        const userData = Storage.getUserData();
        if (this.state.level > this.state.highestLevel) {
            userData.challengeHighestLevel = this.state.level;
            Storage.saveUserData(userData);
        }
    },

    // 渲染模式选择页面
    renderModeSelect() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        // 标题
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 40px;';
        header.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 16px;">🏆</div>
            <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">挑战模式</h2>
            <p style="font-size: 16px; color: #8E8E93;">选择挑战方式，突破自我极限</p>
        `;
        page.appendChild(header);

        // 模式选择卡片
        const modeCard = document.createElement('div');
        modeCard.className = 'glass';
        modeCard.style.cssText = `
            width: 100%;
            max-width: 600px;
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;

        // 混合模式按钮
        const mixedBtn = this.createModeButton({
            icon: '🎲',
            title: '混合挑战',
            desc: '随机出现加减乘除，考验综合能力',
            color: '#007AFF',
            onClick: () => this.selectMode('mixed')
        });

        // 专项模式按钮
        const specializedBtn = this.createModeButton({
            icon: '🎯',
            title: '专项挑战',
            desc: '专注单一运算类型，强化训练',
            color: '#34C759',
            onClick: () => this.selectMode('specialized')
        });

        modeCard.appendChild(mixedBtn);
        modeCard.appendChild(document.createElement('div')).style.cssText = 'height: 16px;';
        modeCard.appendChild(specializedBtn);

        page.appendChild(modeCard);
        container.appendChild(page);
    },

    createModeButton({ icon, title, desc, color, onClick }) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            width: 100%;
            padding: 24px;
            background: white;
            border: 2px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            cursor: pointer;
            transition: all 200ms ease;
            display: flex;
            align-items: center;
            gap: 20px;
        `;

        btn.innerHTML = `
            <div style="
                width: 56px;
                height: 56px;
                background: ${color}15;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
            ">${icon}</div>
            <div style="flex: 1; text-align: left;">
                <div style="font-size: 18px; font-weight: 700; color: #1C1C1E; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 14px; color: #8E8E93;">${desc}</div>
            </div>
            <div style="font-size: 24px; color: ${color};">→</div>
        `;

        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => {
            btn.style.borderColor = color;
            btn.style.transform = 'scale(1.01)';
            btn.style.boxShadow = `0 4px 16px ${color}20`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.borderColor = 'rgba(0, 0, 0, 0.08)';
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
        });

        return btn;
    },

    // 选择模式
    selectMode(mode) {
        this.state.challengeMode = mode;
        if (mode === 'specialized') {
            this.renderOperationSelect();
        } else {
            this.renderIntro();
        }
    },

    // 渲染运算类型选择页面
    renderOperationSelect() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        // 标题
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 40px;';
        header.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
            <h2 style="font-size: 28px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">专项挑战</h2>
            <p style="font-size: 16px; color: #8E8E93;">选择要挑战的运算类型</p>
        `;
        page.appendChild(header);

        // 运算类型选择网格
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            width: 100%;
            max-width: 500px;
        `;

        Object.entries(this.operationTypes).forEach(([type, config]) => {
            const btn = document.createElement('button');
            btn.className = 'btn-press';
            btn.style.cssText = `
                padding: 28px 20px;
                background: white;
                border: 2px solid rgba(0, 0, 0, 0.08);
                border-radius: 16px;
                cursor: pointer;
                transition: all 200ms ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
            `;

            btn.innerHTML = `
                <div style="font-size: 40px; filter: grayscale(0.3);">${config.icon}</div>
                <div style="font-size: 16px; font-weight: 600; color: ${config.color};">${config.name}</div>
            `;

            btn.onclick = () => {
                this.state.operationType = type;
                this.renderIntro();
            };

            btn.addEventListener('mouseenter', () => {
                btn.style.borderColor = config.color;
                btn.style.transform = 'scale(1.03)';
                btn.style.boxShadow = `0 4px 16px ${config.color}20`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            });

            grid.appendChild(btn);
        });

        page.appendChild(grid);

        // 返回按钮
        const backBtn = document.createElement('button');
        backBtn.style.cssText = `
            margin-top: 32px;
            padding: 12px 24px;
            background: transparent;
            border: none;
            color: #8E8E93;
            font-size: 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        backBtn.innerHTML = '← 返回';
        backBtn.onclick = () => this.renderModeSelect();
        page.appendChild(backBtn);

        container.appendChild(page);
    },

    // 渲染开场页面
    renderIntro() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            min-height: 600px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        // 开场动画容器
        const introCard = document.createElement('div');
        introCard.className = 'glass challenge-intro';
        introCard.style.cssText = `
            width: 100%;
            max-width: 600px;
            border-radius: 32px;
            padding: 60px 40px;
            text-align: center;
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            animation: challengeIntroIn 800ms cubic-bezier(0.34, 1.56, 0.64, 1);
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes challengeIntroIn {
                0% { opacity: 0; transform: scale(0.8) translateY(30px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes trophyPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            @keyframes starFloat {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(5deg); }
            }
        `;
        document.head.appendChild(style);

        // 最高等级徽章
        const levelColors = ['#34C759', '#30D158', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];
        const highestColor = levelColors[this.state.highestLevel - 1] || '#34C759';

        introCard.innerHTML = `
            <div style="position: relative; margin-bottom: 40px;">
                <!-- 背景装饰星星 -->
                <div style="
                    position: absolute;
                    top: -20px; left: 10%;
                    font-size: 24px;
                    animation: starFloat 2s ease-in-out infinite;
                    opacity: 0.6;
                ">✨</div>
                <div style="
                    position: absolute;
                    top: 10px; right: 15%;
                    font-size: 20px;
                    animation: starFloat 2.5s ease-in-out infinite 0.5s;
                    opacity: 0.5;
                ">⭐</div>
                <div style="
                    position: absolute;
                    bottom: -10px; left: 20%;
                    font-size: 18px;
                    animation: starFloat 2.2s ease-in-out infinite 1s;
                    opacity: 0.4;
                ">✦</div>

                <!-- 奖杯图标 -->
                <div style="
                    width: 120px;
                    height: 120px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, ${highestColor} 0%, ${this.adjustColor(highestColor, -30)} 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 60px;
                    box-shadow: 0 8px 32px ${highestColor}50;
                    animation: trophyPulse 2s ease-in-out infinite;
                ">🏆</div>

                <!-- 最高等级显示 -->
                <div style="
                    position: absolute;
                    bottom: -5px;
                    right: calc(50% - 70px);
                    background: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 700;
                    color: ${highestColor};
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                ">最高 L${this.state.highestLevel}</div>
            </div>

            <h2 style="
                font-size: 36px;
                font-weight: 800;
                color: #1C1C1E;
                margin-bottom: 12px;
                letter-spacing: -0.5px;
            ">挑战模式</h2>

            <!-- 模式标签 -->
            <div style="
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 8px 16px;
                background: ${this.getOperationColor()}15;
                border-radius: 20px;
                margin-bottom: 16px;
            ">
                <span style="font-size: 16px;">${this.state.challengeMode === 'mixed' ? '🎲' : this.getOperationConfig().icon}</span>
                <span style="font-size: 14px; font-weight: 600; color: ${this.getOperationColor()};">${this.getModeDisplayName()}</span>
            </div>

            <p style="
                font-size: 18px;
                color: #8E8E93;
                margin-bottom: 32px;
                line-height: 1.6;
            ">不断突破自我，挑战算术极限<br>连续答对 8 题即可升级难度</p>

            <!-- 难度等级预览 -->
            <div class="challenge-levels" style="
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 40px;
                flex-wrap: wrap;
            ">
                ${Object.entries(this.difficultyConfig).map(([level, config]) => {
                    const color = levelColors[level - 1];
                    const isUnlocked = level <= this.state.highestLevel;
                    return `
                        <div style="
                            padding: 12px 16px;
                            border-radius: 16px;
                            background: ${isUnlocked ? color + '15' : '#F2F2F7'};
                            border: 2px solid ${isUnlocked ? color : '#E5E5EA'};
                            text-align: center;
                            min-width: 70px;
                            opacity: ${isUnlocked ? 1 : 0.5};
                        ">
                            <div style="
                                font-size: 12px;
                                font-weight: 700;
                                color: ${isUnlocked ? color : '#C7C7CC'};
                                margin-bottom: 4px;
                            ">L${level}</div>
                            <div style="
                                font-size: 11px;
                                color: ${isUnlocked ? '#3C3C43' : '#C7C7CC'};
                            ">${config.name}</div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- 开始挑战按钮 -->
            <button id="challenge-start-btn" style="
                padding: 20px 60px;
                background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
                color: white;
                border: none;
                border-radius: 16px;
                font-size: 20px;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0, 122, 255, 0.4);
                transition: all 300ms ease;
                display: inline-flex;
                align-items: center;
                gap: 12px;
                margin: 0 auto;
            ">
                <span style="font-size: 28px;">🚀</span>
                <span>开始挑战</span>
            </button>

            <p style="
                font-size: 13px;
                color: #C7C7CC;
                margin-top: 20px;
            ">准备好迎接挑战了吗？</p>

            <!-- 返回按钮 -->
            <button onclick="ChallengePage.renderModeSelect()" style="
                margin-top: 24px;
                padding: 12px 24px;
                background: transparent;
                border: none;
                color: #8E8E93;
                font-size: 15px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            ">← 返回选择</button>
        `;

        page.appendChild(introCard);
        container.appendChild(page);

        // 绑定开始按钮事件
        setTimeout(() => {
            const startBtn = document.getElementById('challenge-start-btn');
            if (startBtn) {
                startBtn.addEventListener('click', () => this.startChallenge());
                startBtn.addEventListener('mouseenter', () => {
                    startBtn.style.transform = 'scale(1.05)';
                    startBtn.style.boxShadow = '0 12px 40px rgba(0, 122, 255, 0.5)';
                });
                startBtn.addEventListener('mouseleave', () => {
                    startBtn.style.transform = 'scale(1)';
                    startBtn.style.boxShadow = '0 8px 32px rgba(0, 122, 255, 0.4)';
                });
            }
        }, 100);
    },

    // 颜色调整辅助函数
    adjustColor(color, amount) {
        // 简单的颜色变暗函数
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.className = 'challenge-page';
        page.style.cssText = `
            max-width: 1400px;
            margin: 0 auto;
            padding: 16px;
        `;

        // 页面标题
        page.appendChild(this.createHeader());

        // 检测是否为移动端
        const isMobile = window.innerWidth < 768;

        // 响应式布局：桌面端左右分栏，移动端上下堆叠
        const mainLayout = document.createElement('div');
        mainLayout.className = 'challenge-layout';
        mainLayout.style.cssText = isMobile ? `
            display: flex;
            flex-direction: column;
            gap: 16px;
        ` : `
            display: grid;
            grid-template-columns: 1fr 320px;
            gap: 20px;
            align-items: start;
        `;

        // 主要内容区（题目卡片）
        const mainContent = document.createElement('div');
        mainContent.appendChild(this.createChallengeCard());
        mainLayout.appendChild(mainContent);

        // 侧边信息区（等级信息、进度条、统计）
        const sideInfo = document.createElement('div');

        if (isMobile) {
            // 移动端：连续答对单独一行在答题区域下面
            const streakRow = document.createElement('div');
            streakRow.appendChild(this.createStreakProgress());
            mainLayout.appendChild(streakRow);

            // 另外两个模块分成两列在最下面
            sideInfo.style.cssText = `
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
            `;
            sideInfo.appendChild(this.createLevelInfoCard());
            sideInfo.appendChild(this.createStatsCard());
            mainLayout.appendChild(sideInfo);
        } else {
            // 桌面端：右侧垂直排列
            sideInfo.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            sideInfo.appendChild(this.createLevelInfoCard());
            sideInfo.appendChild(this.createStreakProgress());
            sideInfo.appendChild(this.createStatsCard());
            mainLayout.appendChild(sideInfo);
        }

        page.appendChild(mainLayout);

        container.appendChild(page);
    },

    createHeader() {
        const header = document.createElement('div');
        header.className = 'challenge-header';
        header.style.cssText = 'text-align: center; margin-bottom: 24px;';

        const opConfig = this.getOperationConfig();
        const modeIcon = this.state.challengeMode === 'mixed' ? '🎲' : opConfig.icon;

        header.innerHTML = `
            <div style="display: inline-flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                <span style="font-size: 28px;">${modeIcon}</span>
                <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E;">${this.getModeDisplayName()}</h2>
            </div>
            <p style="font-size: 15px; color: #8E8E93;">不断突破，挑战极限</p>
        `;
        return header;
    },

    createLevelInfoCard() {
        const config = this.difficultyConfig[this.state.level];
        const card = document.createElement('div');
        card.className = 'glass challenge-level-card';

        const isMobile = window.innerWidth < 768;
        const opConfig = this.getOperationConfig();

        card.style.cssText = `
            border-radius: 16px;
            padding: ${isMobile ? '12px' : '16px'};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        const levelColors = ['#34C759', '#30D158', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];
        const color = levelColors[this.state.level - 1];

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: ${isMobile ? '8px' : '12px'}; margin-bottom: ${isMobile ? '8px' : '12px'};">
                <div style="
                    width: ${isMobile ? '36px' : '44px'};
                    height: ${isMobile ? '36px' : '44px'};
                    background: ${color};
                    border-radius: ${isMobile ? '10px' : '12px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: ${isMobile ? '14px' : '18px'};
                    font-weight: 700;
                    box-shadow: 0 4px 12px ${color}40;
                ">L${this.state.level}</div>
                <div>
                    <div style="font-size: ${isMobile ? '14px' : '16px'}; font-weight: 700; color: #1C1C1E;">${config.name}</div>
                    <div style="font-size: ${isMobile ? '10px' : '12px'}; color: ${opConfig.color};">${opConfig.icon} ${opConfig.name}</div>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: ${isMobile ? '8px' : '12px'}; border-top: 1px solid rgba(0,0,0,0.06);">
                <span style="font-size: ${isMobile ? '10px' : '12px'}; color: #8E8E93;">最高记录</span>
                <span style="font-size: ${isMobile ? '14px' : '16px'}; font-weight: 700; color: ${color};">L${this.state.highestLevel}</span>
            </div>
        `;

        return card;
    },

    createStreakProgress() {
        const card = document.createElement('div');
        card.className = 'glass challenge-streak-card';

        const isMobile = window.innerWidth < 768;

        card.style.cssText = `
            border-radius: 16px;
            padding: ${isMobile ? '12px' : '16px'};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        const progress = (this.state.streak / 8) * 100;
        const remaining = 8 - this.state.streak;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: ${isMobile ? '8px' : '10px'};">
                <div style="font-size: ${isMobile ? '12px' : '14px'}; font-weight: 600; color: #1C1C1E;">连续答对</div>
                <div style="font-size: ${isMobile ? '11px' : '13px'}; color: #8E8E93;">
                    ${this.state.streak}/8
                </div>
            </div>
            <div style="height: ${isMobile ? '8px' : '10px'}; background: #E5E5EA; border-radius: 5px; overflow: hidden;">
                <div style="
                    width: ${progress}%;
                    height: 100%;
                    background: linear-gradient(90deg, #34C759 0%, #30D158 100%);
                    border-radius: 5px;
                    transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
                "></div>
            </div>
            <div style="margin-top: ${isMobile ? '6px' : '8px'}; font-size: ${isMobile ? '10px' : '12px'}; color: #8E8E93; text-align: center;">
                ${remaining > 0 ? `再答对 ${remaining} 题升级 🚀` : '准备升级 ✨'}
            </div>
        `;

        return card;
    },

    createChallengeCard() {
        const card = document.createElement('div');
        card.className = 'glass challenge-card';

        // 检测是否为移动端
        const isMobile = window.innerWidth < 768;

        card.style.cssText = `
            border-radius: ${isMobile ? '20px' : '24px'};
            padding: ${isMobile ? '24px 16px' : '40px 48px'};
            min-height: ${isMobile ? '280px' : '360px'};
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%);
        `;

        const q = this.state.currentQuestion;
        const opConfig = this.getOperationConfig();

        // 语音朗读题目
        setTimeout(() => {
            if (SpeechManager.isEnabled()) {
                SpeechManager.speak(`${q.a}${opConfig.speech}${q.b}等于多少`);
            }
        }, 300);

        // 获取运算符
        const operators = {
            addition: '+',
            subtraction: '-',
            multiplication: '×',
            division: '÷'
        };
        const operator = operators[q.operation] || '+';

        card.innerHTML = `
            <div style="margin-bottom: ${isMobile ? '20px' : '32px'};">
                <div style="font-size: ${isMobile ? '40px' : '72px'}; font-weight: 700; color: #1C1C1E; margin-bottom: ${isMobile ? '12px' : '16px'}; font-feature-settings: 'tnum'; letter-spacing: ${isMobile ? '2px' : '4px'};">
                    ${q.a} ${operator} ${q.b} = ?
                </div>
                <button onclick="SpeechManager.speak('${q.a}${opConfig.speech}${q.b}等于多少')" style="
                    padding: ${isMobile ? '8px 16px' : '10px 20px'};
                    background: rgba(0,0,0,0.04);
                    border: none;
                    border-radius: 16px;
                    font-size: ${isMobile ? '12px' : '13px'};
                    color: #8E8E93;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                ">
                    🔊 朗读题目
                </button>
            </div>

            <div id="challenge-options" class="challenge-options" style="display: grid; grid-template-columns: repeat(${isMobile ? 2 : 3}, 1fr); gap: ${isMobile ? '12px' : '16px'}; max-width: 480px; margin: 0 auto;">
                ${this.generateOptions(q.answer).map(opt => `
                    <button onclick="ChallengePage.selectAnswer(${opt})" style="
                        padding: ${isMobile ? '16px' : '20px'};
                        background: ${opConfig.color}15;
                        color: ${opConfig.color};
                        border: none;
                        border-radius: 16px;
                        font-size: ${isMobile ? '22px' : '28px'};
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 150ms ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: ${isMobile ? '56px' : '72px'};
                    ">${opt}</button>
                `).join('')}
            </div>

            <div id="challenge-feedback" style="margin-top: ${isMobile ? '16px' : '24px'}; min-height: 40px;"></div>
        `;

        return card;
    },

    // 生成干扰选项
    generateOptions(correct) {
        const options = new Set([correct]);
        const range = Math.max(10, Math.floor(correct * 0.3));

        while (options.size < 6) {
            // 生成与正确答案接近的干扰项
            const offset = Math.floor(Math.random() * range * 2) - range;
            const wrong = correct + offset;
            if (wrong > 0 && wrong !== correct) {
                options.add(wrong);
            }
        }

        return Array.from(options).sort(() => Math.random() - 0.5);
    },

    createStatsCard() {
        const card = document.createElement('div');
        card.className = 'glass challenge-stats';

        const isMobile = window.innerWidth < 768;

        card.style.cssText = `
            border-radius: 16px;
            padding: ${isMobile ? '12px' : '16px'};
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const total = this.state.totalCorrect + this.state.totalWrong;
        const accuracy = total > 0 ? Math.round((this.state.totalCorrect / total) * 100) : 0;

        card.innerHTML = `
            <div style="font-size: ${isMobile ? '11px' : '13px'}; font-weight: 600; color: #1C1C1E; margin-bottom: ${isMobile ? '8px' : '12px'}; text-align: center;">本次挑战</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: ${isMobile ? '4px' : '8px'}; text-align: center;">
                <div>
                    <div style="font-size: ${isMobile ? '18px' : '22px'}; font-weight: 700; color: #34C759;">${this.state.totalCorrect}</div>
                    <div style="font-size: ${isMobile ? '9px' : '11px'}; color: #8E8E93; margin-top: 2px;">答对</div>
                </div>
                <div>
                    <div style="font-size: ${isMobile ? '18px' : '22px'}; font-weight: 700; color: #FF3B30;">${this.state.totalWrong}</div>
                    <div style="font-size: ${isMobile ? '9px' : '11px'}; color: #8E8E93; margin-top: 2px;">答错</div>
                </div>
                <div>
                    <div style="font-size: ${isMobile ? '18px' : '22px'}; font-weight: 700; color: #007AFF;">${accuracy}%</div>
                    <div style="font-size: ${isMobile ? '9px' : '11px'}; color: #8E8E93; margin-top: 2px;">正确率</div>
                </div>
            </div>
        `;

        return card;
    },

    selectAnswer(selected) {
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;

        const correct = this.state.currentQuestion.answer;
        const feedback = document.getElementById('challenge-feedback');
        const buttons = document.querySelectorAll('#challenge-options button');

        // 禁用所有按钮
        buttons.forEach(btn => btn.disabled = true);

        if (selected === correct) {
            // 答对
            this.state.totalCorrect++;
            this.state.streak++;

            // 实时更新统计数据（用于能力雷达图）
            const operationType = this.state.currentQuestion.operation || 'addition';
            this.updateTypeStats(operationType, true);

            feedback.innerHTML = `
                <div style="color: #34C759; font-size: 20px; font-weight: 600; animation: fadeIn 200ms ease;">
                    ✓ 正确！
                </div>
            `;
            SpeechManager.speakFeedback(true);

            // 检查是否升级（连续8题答对晋级）
            if (this.state.streak >= 8) {
                // 如果已经是最高等级，显示通关
                if (this.state.level >= 6) {
                    this.showCompletionAnimation();
                } else {
                    this.showLevelUpAnimation();
                }
                return;
            }

            setTimeout(() => {
                this.state.isProcessing = false;
                this.generateQuestion();
                this.render();
            }, 1000);
        } else {
            // 答错
            this.state.totalWrong++;
            this.state.streak = 0;

            // 实时更新统计数据（用于能力雷达图）
            const operationType = this.state.currentQuestion.operation || 'addition';
            this.updateTypeStats(operationType, false);

            // 高亮正确答案
            buttons.forEach(btn => {
                if (parseInt(btn.textContent) === correct) {
                    btn.style.background = '#34C759';
                    btn.style.color = 'white';
                }
            });

            feedback.innerHTML = `
                <div style="color: #FF3B30; font-size: 20px; font-weight: 600; animation: fadeIn 200ms ease;">
                    ✗ 正确答案是 ${correct}
                </div>
            `;
            SpeechManager.speak(`正确答案是${SpeechManager.convertNumberToChinese(correct)}`);

            setTimeout(() => {
                this.state.isProcessing = false;
                this.generateQuestion();
                this.render();
            }, 1500);
        }
    },

    showLevelUpAnimation() {
        const oldLevel = this.state.level;
        this.state.level = Math.min(6, this.state.level + 1);
        this.state.streak = 0;
        this.saveProgress();

        // 创建升级弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 300ms ease;
        `;

        const newConfig = this.difficultyConfig[this.state.level];
        const levelColors = ['#34C759', '#30D158', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];
        const color = levelColors[this.state.level - 1];

        // 根据模式确定显示内容
        let modeIcon, modeName, modeColor;
        if (this.state.challengeMode === 'mixed') {
            modeIcon = '🎲';
            modeName = '混合挑战';
            modeColor = '#007AFF';
        } else {
            const opConfig = this.operationTypes[this.state.operationType] || this.operationTypes.addition;
            modeIcon = opConfig.icon;
            modeName = opConfig.name;
            modeColor = opConfig.color;
        }

        modal.innerHTML = `
            <div class="glass" style="
                max-width: 400px;
                width: 100%;
                border-radius: 24px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: pageEnter 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
                background: white;
            ">
                <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                <div style="font-size: 24px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">
                    恭喜升级！
                </div>
                <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: ${modeColor}15; border-radius: 20px; margin-bottom: 8px;">
                    <span style="font-size: 16px;">${modeIcon}</span>
                    <span style="font-size: 13px; font-weight: 600; color: ${modeColor};">${this.state.challengeMode === 'mixed' ? '混合挑战' : modeName + '专项'}</span>
                </div>
                <div style="font-size: 48px; font-weight: 700; color: ${color}; margin-bottom: 8px;">
                    L${this.state.level}
                </div>
                <div style="font-size: 18px; font-weight: 600; color: ${color}; margin-bottom: 8px;">
                    ${newConfig.name}
                </div>
                <div style="font-size: 15px; color: #8E8E93; margin-bottom: 24px;">
                    ${newConfig.desc}
                </div>
                <button onclick="this.closest('.glass').parentElement.remove(); ChallengePage.state.isProcessing = false; ChallengePage.generateQuestion(); ChallengePage.render();" style="
                    padding: 16px 40px;
                    background: ${color};
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 4px 16px ${color}50;
                ">
                    继续挑战
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // 播放升级音效
        if (window.SoundManager && SoundManager.isEnabled()) {
            SoundManager.playComplete();
        }

        // 语音播报
        SpeechManager.speak(`恭喜升级到${newConfig.name}难度`);
    },

    // 显示通关动画（到达最高等级）
    showCompletionAnimation() {
        this.state.streak = 0;
        this.saveProgress();

        // 创建通关弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, rgba(175, 82, 222, 0.9) 0%, rgba(88, 86, 214, 0.9) 100%);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
            animation: fadeIn 500ms ease;
        `;

        // 根据模式确定显示内容
        let modeIcon, modeName, modeColor;
        if (this.state.challengeMode === 'mixed') {
            modeIcon = '🎲';
            modeName = '混合挑战';
            modeColor = '#007AFF';
        } else {
            const opConfig = this.operationTypes[this.state.operationType] || this.operationTypes.addition;
            modeIcon = opConfig.icon;
            modeName = opConfig.name + '专项';
            modeColor = opConfig.color;
        }

        const totalQuestions = this.state.totalCorrect + this.state.totalWrong;
        const accuracy = totalQuestions > 0 ? Math.round((this.state.totalCorrect / totalQuestions) * 100) : 0;

        modal.innerHTML = `
            <div class="glass" style="
                max-width: 420px;
                width: 100%;
                border-radius: 28px;
                padding: 48px 36px;
                text-align: center;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
                animation: pageEnter 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
                background: white;
            ">
                <!-- 庆祝动画 -->
                <div style="position: relative; margin-bottom: 24px;">
                    <div style="
                        font-size: 80px;
                        animation: trophyPulse 1.5s ease-in-out infinite;
                        display: inline-block;
                    ">🏆</div>
                    <!-- 星星装饰 -->
                    <div style="
                        position: absolute;
                        top: -10px; left: 20%;
                        font-size: 28px;
                        animation: starFloat 2s ease-in-out infinite;
                    ">✨</div>
                    <div style="
                        position: absolute;
                        top: 10px; right: 20%;
                        font-size: 22px;
                        animation: starFloat 2.3s ease-in-out infinite 0.5s;
                    ">⭐</div>
                    <div style="
                        position: absolute;
                        bottom: 0; left: 10%;
                        font-size: 20px;
                        animation: starFloat 1.8s ease-in-out infinite 0.3s;
                    ">✦</div>
                </div>

                <div style="
                    font-size: 28px;
                    font-weight: 800;
                    color: #1C1C1E;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                ">恭喜通关！</div>

                <div style="
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 18px;
                    background: ${modeColor}15;
                    border-radius: 20px;
                    margin-bottom: 20px;
                ">
                    <span style="font-size: 18px;">${modeIcon}</span>
                    <span style="font-size: 15px; font-weight: 600; color: ${modeColor};">${modeName}</span>
                </div>

                <div style="
                    font-size: 20px;
                    font-weight: 700;
                    color: #AF52DE;
                    margin-bottom: 8px;
                ">L6 大师</div>

                <div style="
                    font-size: 15px;
                    color: #8E8E93;
                    margin-bottom: 28px;
                    line-height: 1.5;
                ">
                    你已到达最高难度<br>本次挑战答对 ${this.state.totalCorrect} 题，正确率 ${accuracy}%
                </div>

                <!-- 统计数据展示 -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 28px;
                    padding: 16px;
                    background: #F2F2F7;
                    border-radius: 16px;
                ">
                    <div>
                        <div style="font-size: 22px; font-weight: 700; color: #34C759;">${this.state.totalCorrect}</div>
                        <div style="font-size: 12px; color: #8E8E93;">答对</div>
                    </div>
                    <div>
                        <div style="font-size: 22px; font-weight: 700; color: #FF3B30;">${this.state.totalWrong}</div>
                        <div style="font-size: 12px; color: #8E8E93;">答错</div>
                    </div>
                    <div>
                        <div style="font-size: 22px; font-weight: 700; color: #007AFF;">${accuracy}%</div>
                        <div style="font-size: 12px; color: #8E8E93;">正确率</div>
                    </div>
                </div>

                <button onclick="ChallengePage.finishChallenge()" style="
                    padding: 18px 48px;
                    background: linear-gradient(135deg, #AF52DE 0%, #5856D6 100%);
                    color: white;
                    border: none;
                    border-radius: 14px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: 0 6px 24px rgba(175, 82, 222, 0.4);
                    transition: all 200ms ease;
                ">
                    🎉 完成挑战
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // 播放通关音效
        if (window.SoundManager && SoundManager.isEnabled()) {
            SoundManager.playComplete();
        }

        // 语音播报
        SpeechManager.speak('恭喜你通关大师难度，挑战完成！');
    },

    // 完成挑战，返回首页
    finishChallenge() {
        // 移除弹窗
        const modal = document.querySelector('[style*="position: fixed; inset: 0;"]');
        if (modal) {
            modal.remove();
        }
        // 重置状态并返回挑战首页
        this.init();
    },

    // 开始挑战
    startChallenge() {
        this.state.sessionStartTime = Date.now();
        this.state.hasStarted = true;
        this.generateQuestion();
        this.render();
    },

    // 生成指定难度的题目
    generateQuestion() {
        const config = this.difficultyConfig[this.state.level];

        // 确定运算类型
        let operationType;
        if (this.state.challengeMode === 'mixed') {
            // 混合模式：随机选择运算类型
            const types = ['addition', 'subtraction', 'multiplication', 'division'];
            operationType = types[Math.floor(Math.random() * types.length)];
        } else {
            // 专项模式：使用选定的运算类型
            operationType = this.state.operationType || 'addition';
        }

        // 生成指定位数的随机数
        const generateNumber = (digits, min) => {
            const max = Math.pow(10, digits) - 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const a = generateNumber(config.digitsA, config.minA);
        const b = generateNumber(config.digitsB, config.minB);

        let answer, displayA = a, displayB = b;

        switch (operationType) {
            case 'addition':
                answer = a + b;
                break;
            case 'subtraction':
                // 确保结果不为负
                displayA = Math.max(a, b);
                displayB = Math.min(a, b);
                answer = displayA - displayB;
                break;
            case 'multiplication':
                // 乘法使用较小的数字范围
                const multA = Math.floor(Math.random() * 9) + 2; // 2-10
                const multB = generateNumber(config.digitsB, config.minB);
                displayA = multA;
                displayB = multB;
                answer = multA * multB;
                break;
            case 'division':
                // 除法通过乘法反推确保整除
                const divisor = Math.floor(Math.random() * 9) + 2; // 2-10
                const quotient = generateNumber(config.digitsB, config.minB);
                displayA = divisor * quotient; // 被除数
                displayB = divisor; // 除数
                answer = quotient;
                break;
            default:
                answer = a + b;
        }

        this.state.currentQuestion = {
            a: displayA,
            b: displayB,
            answer: answer,
            operation: operationType
        };
    },

    // 获取当前模式显示名称
    getModeDisplayName() {
        if (this.state.challengeMode === 'mixed') {
            return '混合挑战';
        } else {
            const opConfig = this.operationTypes[this.state.operationType];
            return opConfig ? `${opConfig.name}专项` : '专项挑战';
        }
    },

    // 获取当前运算类型的颜色
    getOperationColor() {
        if (this.state.challengeMode === 'mixed') {
            return '#007AFF';
        } else {
            const opConfig = this.operationTypes[this.state.operationType];
            return opConfig ? opConfig.color : '#007AFF';
        }
    },

    // 获取当前运算类型的配置
    getOperationConfig() {
        const op = this.state.currentQuestion?.operation || 'addition';
        return this.operationTypes[op] || this.operationTypes.addition;
    },

    /**
     * 更新运算类型统计（用于能力雷达图）
     * @param {string} type - 运算类型
     * @param {boolean} isCorrect - 是否答对
     */
    updateTypeStats(type, isCorrect) {
        if (typeof Storage === 'undefined') return;

        const userData = Storage.getUserData();

        // 初始化运算类型统计
        if (!userData.typeStats) {
            userData.typeStats = {
                addition: { correct: 0, wrong: 0, total: 0 },
                subtraction: { correct: 0, wrong: 0, total: 0 },
                multiplication: { correct: 0, wrong: 0, total: 0 },
                division: { correct: 0, wrong: 0, total: 0 }
            };
        }

        if (userData.typeStats[type]) {
            if (isCorrect) {
                userData.typeStats[type].correct++;
            } else {
                userData.typeStats[type].wrong++;
            }
            userData.typeStats[type].total++;
            Storage.saveUserData(userData);
        }
    }
};
