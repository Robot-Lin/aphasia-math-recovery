/**
 * 挑战模式 - 动态难度自适应训练
 * 从简单到难，无限升级挑战
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
        hasStarted: false   // 是否已开始挑战
    },

    // 难度配置
    difficultyConfig: {
        1: { name: '入门', desc: '个位数相加', digitsA: 1, digitsB: 1, minA: 1, minB: 1 },
        2: { name: '进阶', desc: '个位+两位', digitsA: 1, digitsB: 2, minA: 1, minB: 10 },
        3: { name: '熟练', desc: '个位+三位', digitsA: 1, digitsB: 3, minA: 1, minB: 100 },
        4: { name: '高手', desc: '两位数相加', digitsA: 2, digitsB: 2, minA: 10, minB: 10 },
        5: { name: '专家', desc: '两位+三位', digitsA: 2, digitsB: 3, minA: 10, minB: 100 },
        6: { name: '大师', desc: '三位数相加', digitsA: 3, digitsB: 3, minA: 100, minB: 100 }
    },

    init() {
        this.loadProgress();
        // 重置状态
        this.state.totalCorrect = 0;
        this.state.totalWrong = 0;
        this.state.streak = 0;
        this.state.level = 1;
        this.state.hasStarted = false;

        // 显示开场页面
        this.renderIntro();
    },

    // 开始挑战
    startChallenge() {
        this.state.sessionStartTime = Date.now();
        this.state.hasStarted = true;
        this.generateQuestion();
        this.render();
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

    // 生成指定难度的题目
    generateQuestion() {
        const config = this.difficultyConfig[this.state.level];

        // 生成指定位数的随机数
        const generateNumber = (digits, min) => {
            const max = Math.pow(10, digits) - 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const a = generateNumber(config.digitsA, config.minA);
        const b = generateNumber(config.digitsB, config.minB);

        // 50% 概率交换位置，增加变化
        if (Math.random() > 0.5) {
            this.state.currentQuestion = { a: b, b: a, answer: a + b };
        } else {
            this.state.currentQuestion = { a, b, answer: a + b };
        }
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

            <p style="
                font-size: 18px;
                color: #8E8E93;
                margin-bottom: 32px;
                line-height: 1.6;
            ">不断突破自我，挑战算术极限<br>连续答对 5 题即可升级难度</p>

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
            max-width: 1200px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 页面标题
        page.appendChild(this.createHeader());

        // 难度信息卡片
        page.appendChild(this.createLevelInfoCard());

        // 连续答对进度条
        page.appendChild(this.createStreakProgress());

        // 训练卡片
        page.appendChild(this.createChallengeCard());

        // 统计信息
        page.appendChild(this.createStatsCard());

        container.appendChild(page);
    },

    createHeader() {
        const header = document.createElement('div');
        header.className = 'challenge-header';
        header.style.cssText = 'text-align: center; margin-bottom: 24px;';
        header.innerHTML = `
            <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">🏆 挑战模式</h2>
            <p style="font-size: 17px; color: #8E8E93;">不断突破，挑战极限</p>
        `;
        return header;
    },

    createLevelInfoCard() {
        const config = this.difficultyConfig[this.state.level];
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        const levelColors = ['#34C759', '#30D158', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55'];
        const color = levelColors[this.state.level - 1];

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="
                    width: 56px;
                    height: 56px;
                    background: ${color};
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: 700;
                    box-shadow: 0 4px 12px ${color}40;
                ">L${this.state.level}</div>
                <div>
                    <div style="font-size: 20px; font-weight: 700; color: #1C1C1E;">${config.name}</div>
                    <div style="font-size: 14px; color: #8E8E93;">${config.desc}</div>
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 13px; color: #8E8E93;">最高记录</div>
                <div style="font-size: 18px; font-weight: 700; color: ${color};">L${this.state.highestLevel}</div>
            </div>
        `;

        return card;
    },

    createStreakProgress() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        const progress = (this.state.streak / 5) * 100;
        const remaining = 5 - this.state.streak;

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div style="font-size: 16px; font-weight: 600; color: #1C1C1E;">连续答对进度</div>
                <div style="font-size: 14px; color: #8E8E93;">
                    ${this.state.streak}/5 题
                </div>
            </div>
            <div style="height: 12px; background: #E5E5EA; border-radius: 6px; overflow: hidden;">
                <div style="
                    width: ${progress}%;
                    height: 100%;
                    background: linear-gradient(90deg, #34C759 0%, #30D158 100%);
                    border-radius: 6px;
                    transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 8px rgba(52, 199, 89, 0.3);
                "></div>
            </div>
            <div style="margin-top: 8px; font-size: 13px; color: #8E8E93; text-align: center;">
                ${remaining > 0 ? `再答对 ${remaining} 题升级！🚀` : '准备升级！✨'}
            </div>
        `;

        return card;
    },

    createChallengeCard() {
        const card = document.createElement('div');
        card.className = 'glass challenge-card';
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
            margin-bottom: 16px;
        `;

        const q = this.state.currentQuestion;

        // 语音朗读题目
        setTimeout(() => {
            if (SpeechManager.isEnabled()) {
                SpeechManager.speak(`${q.a}加${q.b}等于多少`);
            }
        }, 300);

        card.innerHTML = `
            <div style="margin-bottom: 40px;">
                <div style="font-size: 80px; font-weight: 700; color: #1C1C1E; margin-bottom: 24px; font-feature-settings: 'tnum'; letter-spacing: 4px;">
                    ${q.a} + ${q.b} = ?
                </div>
                <button onclick="SpeechManager.speak('${q.a}加${q.b}等于多少')" style="
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

            <div id="challenge-options" class="challenge-options" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 400px; margin: 0 auto;">
                ${this.generateOptions(q.answer).map(opt => `
                    <button onclick="ChallengePage.selectAnswer(${opt})" style="
                        padding: 24px;
                        background: #007AFF15;
                        color: #007AFF;
                        border: none;
                        border-radius: 16px;
                        font-size: 32px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 150ms ease;
                    ">${opt}</button>
                `).join('')}
            </div>

            <div id="challenge-feedback" style="margin-top: 32px; min-height: 48px;"></div>
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
        card.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const total = this.state.totalCorrect + this.state.totalWrong;
        const accuracy = total > 0 ? Math.round((this.state.totalCorrect / total) * 100) : 0;

        card.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                <div>
                    <div style="font-size: 28px; font-weight: 700; color: #34C759;">${this.state.totalCorrect}</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">答对</div>
                </div>
                <div>
                    <div style="font-size: 28px; font-weight: 700; color: #FF3B30;">${this.state.totalWrong}</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">答错</div>
                </div>
                <div>
                    <div style="font-size: 28px; font-weight: 700; color: #007AFF;">${accuracy}%</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">正确率</div>
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
            this.updateTypeStats('addition', true);

            feedback.innerHTML = `
                <div style="color: #34C759; font-size: 20px; font-weight: 600; animation: fadeIn 200ms ease;">
                    ✓ 正确！
                </div>
            `;
            SpeechManager.speakFeedback(true);

            // 检查是否升级
            if (this.state.streak >= 5) {
                this.showLevelUpAnimation();
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
            this.updateTypeStats('addition', false);

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
