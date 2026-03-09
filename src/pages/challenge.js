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
        sessionStartTime: null
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
        this.state.sessionStartTime = Date.now();
        this.loadProgress();
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

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
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

            <div id="challenge-options" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 400px; margin: 0 auto;">
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
        card.className = 'glass';
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
    }
};
