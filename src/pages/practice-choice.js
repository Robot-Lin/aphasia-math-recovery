/**
 * 练习页 - 选择题模式
 * Apple 风格重构版
 */

const PracticeChoicePage = {
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
    hasSelected: false,
    isCorrect: false,
    selectedAnswer: null,
    currentOptions: [],
    streak: 0,

    // DOM 元素缓存
    elements: {},

    init() {
        this.loadData();
        if (this.questions.length === 0) return;

        this.initAudio();
        this.render();
        this.bindKeyboard();
    },

    loadData() {
        const questionsJson = sessionStorage.getItem('practice_questions');
        if (!questionsJson) {
            router.navigate('practice-settings');
            return;
        }

        this.questions = JSON.parse(questionsJson);
        this.currentIndex = parseInt(sessionStorage.getItem('practice_current') || '0');
        this.answers = JSON.parse(sessionStorage.getItem('practice_answers') || '[]');
        this.startTime = parseInt(sessionStorage.getItem('practice_start_time') || Date.now().toString());
        this.questionStartTime = Date.now();

        this.hasSelected = false;
        this.isCorrect = false;
        this.selectedAnswer = null;
        this.currentOptions = [];
        this.streak = 0;

        // 恢复连击数
        this.answers.forEach(a => {
            this.streak = a.isCorrect ? this.streak + 1 : 0;
        });
    },

    initAudio() {
        document.addEventListener('click', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.init();
            }
        }, { once: true });
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 900px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 头部信息栏
        this.elements.header = this.createHeader();
        page.appendChild(this.elements.header);

        // 题目卡片
        this.elements.questionCard = this.createQuestionCard();
        page.appendChild(this.elements.questionCard);

        // 结束按钮
        const endBtn = document.createElement('button');
        endBtn.style.cssText = `
            display: block;
            margin: 24px auto 0;
            padding: 8px 16px;
            background: transparent;
            border: none;
            color: #8E8E93;
            font-size: 15px;
            cursor: pointer;
            transition: color 200ms;
        `;
        endBtn.textContent = '结束练习';
        endBtn.onclick = () => this.endPractice();
        endBtn.onmouseenter = () => endBtn.style.color = '#FF3B30';
        endBtn.onmouseleave = () => endBtn.style.color = '#8E8E93';
        page.appendChild(endBtn);

        container.appendChild(page);

        this.updateDisplay();
    },

    createHeader() {
        const current = this.questions[this.currentIndex];
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;

        const typeNames = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };
        const diffNames = { beginner: '初级', intermediate: '中级', advanced: '高级' };

        const header = document.createElement('div');
        header.className = 'glass';
        header.style.cssText = `
            border-radius: 20px;
            padding: 20px 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        header.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 17px; color: #3C3C43;">
                        第 <span style="font-size: 22px; font-weight: 700; color: #007AFF;">${this.currentIndex + 1}</span> / ${this.questions.length} 题
                    </span>
                    <span style="padding: 4px 12px; background: rgba(0, 122, 255, 0.1); border-radius: 100px; font-size: 13px; font-weight: 600; color: #007AFF;">
                        ${diffNames[current.difficulty]}${typeNames[current.type]}
                    </span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    ${this.streak > 2 ? `
                    <div style="display: flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(255, 149, 0, 0.12); border-radius: 100px;">
                        <span style="font-size: 16px;">🔥</span>
                        <span style="font-weight: 700; color: #FF9500;">${this.streak}</span>
                    </div>
                    ` : ''}
                    <span style="font-size: 17px; color: #3C3C43;">
                        得分: <span style="font-weight: 700; color: #007AFF;">${this.getScore()}</span>
                    </span>
                </div>
            </div>
            <div style="height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #007AFF 0%, #34C759 100%); border-radius: 3px; width: ${progress}%; transition: width 400ms cubic-bezier(0.4, 0.0, 0.2, 1);"></div>
            </div>
        `;

        return header;
    },

    createQuestionCard() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 28px;
            padding: 40px 32px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;

        // 题目显示
        this.elements.questionDisplay = document.createElement('div');
        this.elements.questionDisplay.style.cssText = `
            text-align: center;
            margin-bottom: 32px;
        `;
        card.appendChild(this.elements.questionDisplay);

        // 选项区域 - 2x2 网格
        this.elements.optionsGrid = document.createElement('div');
        this.elements.optionsGrid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            max-width: 360px;
            margin: 0 auto 24px;
        `;
        card.appendChild(this.elements.optionsGrid);

        // 反馈信息
        this.elements.feedback = document.createElement('div');
        this.elements.feedback.style.cssText = `
            text-align: center;
            min-height: 48px;
        `;
        card.appendChild(this.elements.feedback);

        return card;
    },

    updateDisplay() {
        const current = this.questions[this.currentIndex];

        // 生成选项
        if (this.currentOptions.length === 0) {
            this.currentOptions = this.generateOptions(current);
        }

        // 更新题目
        this.elements.questionDisplay.innerHTML = `
            <div style="font-size: 48px; font-weight: 700; color: #1C1C1E; letter-spacing: 2px; font-feature-settings: 'tnum';">
                ${current.display} = ?
            </div>
        `;

        // 自动朗读题目
        if (!this.hasSelected && SpeechManager.isEnabled()) {
            setTimeout(() => {
                SpeechManager.speakExpression(current.display + '等于多少');
            }, 300);
        }

        // 更新选项按钮
        this.elements.optionsGrid.innerHTML = '';
        this.currentOptions.forEach((option, index) => {
            const btn = this.createOptionButton(option, index);
            this.elements.optionsGrid.appendChild(btn);
        });

        // 更新反馈
        if (this.hasSelected) {
            this.elements.feedback.innerHTML = `
                <div style="font-size: 20px; font-weight: 600; color: ${this.isCorrect ? '#34C759' : '#FF3B30'};
                     animation: fadeInUp 300ms ease; margin-bottom: 16px;">
                    ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                </div>
                <button onclick="PracticeChoicePage.nextQuestion()"
                    class="btn-press pulse-gentle"
                    style="
                        background: #34C759;
                        color: white;
                        padding: 14px 32px;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                        box-shadow: 0 4px 16px rgba(52, 199, 89, 0.3);
                        transition: all 200ms ease;
                    ">
                    下一题 →
                </button>
            `;
        } else {
            this.elements.feedback.innerHTML = '';
        }
    },

    createOptionButton(option, index) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';

        // 计算样式
        let bgColor, borderColor, textColor, shadow;

        if (!this.hasSelected) {
            bgColor = 'rgba(255, 255, 255, 0.9)';
            borderColor = 'rgba(120, 120, 128, 0.16)';
            textColor = '#1C1C1E';
            shadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        } else {
            if (option === this.selectedAnswer) {
                if (this.isCorrect) {
                    bgColor = '#34C759';
                    borderColor = '#34C759';
                    textColor = 'white';
                    shadow = '0 4px 16px rgba(52, 199, 89, 0.4)';
                } else {
                    bgColor = '#FF3B30';
                    borderColor = '#FF3B30';
                    textColor = 'white';
                    shadow = '0 4px 16px rgba(255, 59, 48, 0.4)';
                }
            } else if (option === this.questions[this.currentIndex].answer && !this.isCorrect) {
                bgColor = '#D1FAE5';
                borderColor = '#34C759';
                textColor = '#059669';
                shadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
            } else {
                bgColor = 'rgba(120, 120, 128, 0.08)';
                borderColor = 'rgba(120, 120, 128, 0.08)';
                textColor = '#8E8E93';
                shadow = 'none';
            }
        }

        btn.style.cssText = `
            aspect-ratio: 1.3;
            border-radius: 20px;
            border: 2px solid ${borderColor};
            background: ${bgColor};
            color: ${textColor};
            font-size: 32px;
            font-weight: 700;
            cursor: ${this.hasSelected ? 'default' : 'pointer'};
            box-shadow: ${shadow};
            transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: ${this.hasSelected && option !== this.selectedAnswer && option !== this.questions[this.currentIndex].answer ? '0.6' : '1'};
        `;

        btn.textContent = option;

        if (!this.hasSelected) {
            btn.onclick = () => this.selectAnswer(option);

            // 悬停效果
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.03)';
                btn.style.borderColor = '#007AFF';
                btn.style.boxShadow = '0 4px 16px rgba(0, 122, 255, 0.15)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.borderColor = borderColor;
                btn.style.boxShadow = shadow;
            });

            // 按下效果
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'scale(0.97)';
            });

            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'scale(1.03)';
            });
        }

        return btn;
    },

    generateOptions(question) {
        const correctAnswer = question.answer;
        const distractors = [];

        while (distractors.length < 3) {
            let wrong;
            const strategy = Math.random();

            if (strategy < 0.33) {
                wrong = correctAnswer + Math.floor(Math.random() * 10) - 5;
            } else if (strategy < 0.66) {
                wrong = correctAnswer + (Math.floor(Math.random() * 5) - 2) * 10;
            } else {
                wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
            }

            if (wrong >= 0 && wrong !== correctAnswer && !distractors.includes(wrong)) {
                distractors.push(wrong);
            }
        }

        const options = [...distractors, correctAnswer];
        return this.shuffle(options);
    },

    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    selectAnswer(answer) {
        if (this.hasSelected) return;

        if (typeof SoundManager !== 'undefined') {
            SoundManager.playKeyPress();
        }

        const current = this.questions[this.currentIndex];
        const isCorrect = answer === current.answer;

        this.selectedAnswer = answer;
        this.isCorrect = isCorrect;
        this.hasSelected = true;

        if (typeof SoundManager !== 'undefined') {
            if (isCorrect) {
                SoundManager.playCorrect();
            } else {
                SoundManager.playWrong();
            }
        }

        this.answers.push({
            question: current,
            userAnswer: answer,
            isCorrect: isCorrect,
            timeSpent: Date.now() - this.questionStartTime
        });

        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
            if (typeof Storage !== 'undefined') {
                Storage.addMistake(current, answer);
            }
        }

        this.updateDisplay();
        this.updateHeader();
    },

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.hasSelected = false;
            this.isCorrect = false;
            this.selectedAnswer = null;
            this.currentOptions = [];
            this.questionStartTime = Date.now();

            // 动画过渡
            this.elements.questionCard.style.animation = 'pageExit 200ms ease';
            setTimeout(() => {
                this.updateDisplay();
                this.updateHeader();
                this.elements.questionCard.style.animation = 'pageEnter 300ms cubic-bezier(0.34, 1.56, 0.64, 1)';
            }, 200);
        } else {
            this.finishPractice();
        }
    },

    updateHeader() {
        const newHeader = this.createHeader();
        this.elements.header.replaceWith(newHeader);
        this.elements.header = newHeader;
    },

    endPractice() {
        if (confirm('确定要结束当前练习吗？进度将不会保存。')) {
            router.navigate('home');
        }
    },

    finishPractice() {
        if (typeof SoundManager !== 'undefined') {
            SoundManager.playComplete();
        }

        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000 / 60);

        const correctCount = this.answers.filter(a => a.isCorrect).length;
        const wrongCount = this.answers.length - correctCount;

        const sessionStats = {
            total: this.questions.length,
            correct: correctCount,
            wrong: wrongCount,
            time: totalTime,
            questions: this.questions,
            answers: this.answers
        };

        sessionStorage.setItem('practice_result', JSON.stringify(sessionStats));
        if (typeof Storage !== 'undefined') {
            Storage.updateStats(sessionStats);
        }
        router.navigate('result');
    },

    getScore() {
        return this.answers.filter(a => a.isCorrect).length * 10;
    },

    bindKeyboard() {
        document.onkeydown = (e) => {
            if (this.hasSelected) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.nextQuestion();
                }
                return;
            }

            const key = parseInt(e.key);
            if (key >= 1 && key <= 4 && key <= this.currentOptions.length) {
                e.preventDefault();
                this.selectAnswer(this.currentOptions[key - 1]);
            }
        };
    }
};
