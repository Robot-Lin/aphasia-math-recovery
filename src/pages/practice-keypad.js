/**
 * 练习页 - 键盘输入模式 - Apple 风格重构版
 * 局部更新，平滑动画
 */

const PracticeKeypadPage = {
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
    currentAnswer: '',
    hasSubmitted: false,
    isCorrect: false,
    streak: 0,

    // DOM 元素缓存
    elements: {},

    init() {
        this.loadData();
        if (this.questions.length === 0) return;

        this.initAudio();
        this.render();
        this.bindKeyboard();
        this.animateEntry();
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

        this.currentAnswer = '';
        this.hasSubmitted = false;
        this.isCorrect = false;
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

        // 题目区域
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
        const diffNames = {
            level1: '入门', level2: '进阶', level3: '熟练',
            level4: '高手', level5: '专家', level6: '大师',
            beginner: '初级', intermediate: '中级', advanced: '高级'
        };

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

        // 答案显示区
        this.elements.answerDisplay = document.createElement('div');
        this.elements.answerDisplay.style.cssText = `
            width: 180px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 700;
            transition: all 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
            background: rgba(120, 120, 128, 0.08);
            color: #1C1C1E;
        `;
        card.appendChild(this.elements.answerDisplay);

        // 反馈信息
        this.elements.feedback = document.createElement('div');
        this.elements.feedback.style.cssText = `
            text-align: center;
            margin-bottom: 24px;
            min-height: 32px;
        `;
        card.appendChild(this.elements.feedback);

        // 数字键盘
        this.elements.keypad = document.createElement('div');
        this.elements.keypad.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            max-width: 320px;
            margin: 0 auto;
        `;
        this.createKeypad();
        card.appendChild(this.elements.keypad);

        return card;
    },

    createKeypad() {
        this.elements.keypad.innerHTML = '';
        this.elements.keys = {};

        const keys = [
            { num: 1 }, { num: 2 }, { num: 3 },
            { num: 4 }, { num: 5 }, { num: 6 },
            { num: 7 }, { num: 8 }, { num: 9 },
            { action: 'clear', icon: 'C', color: '#FF9500' },
            { num: 0 },
            { action: 'submit', icon: '↵', color: '#007AFF' }
        ];

        keys.forEach((key, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn-press';

            const isAction = !!key.action;
            const isDisabled = this.hasSubmitted && key.action !== 'submit';

            btn.style.cssText = `
                aspect-ratio: 1;
                border-radius: 20px;
                border: none;
                font-size: ${isAction ? '28px' : '32px'};
                font-weight: 700;
                cursor: ${isDisabled ? 'default' : 'pointer'};
                transition: all 150ms ease;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: ${isDisabled ? '0.4' : '1'};
                background: ${isAction ? (key.action === 'clear' ? '#FFF4E6' : '#E8F5E9') : 'white'};
                color: ${isAction ? (key.action === 'clear' ? '#FF9500' : '#34C759') : '#1C1C1E'};
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            `;

            btn.textContent = key.icon || key.num;

            if (!isDisabled) {
                btn.onclick = () => {
                    if (key.num !== undefined) this.inputNumber(key.num);
                    else if (key.action === 'clear') this.clearAnswer();
                    else if (key.action === 'submit') this.submitAnswer();
                };

                // 悬停效果
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'scale(1.05)';
                    btn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                });

                // 按下效果
                btn.addEventListener('mousedown', () => {
                    btn.style.transform = 'scale(0.95)';
                });

                btn.addEventListener('mouseup', () => {
                    btn.style.transform = 'scale(1.05)';
                });
            }

            this.elements.keypad.appendChild(btn);
            if (key.num !== undefined) this.elements.keys[key.num] = btn;
            else if (key.action) this.elements.keys[key.action] = btn;
        });
    },

    // 局部更新显示
    updateDisplay() {
        const current = this.questions[this.currentIndex];

        // 更新题目
        this.elements.questionDisplay.innerHTML = `
            <div style="font-size: 56px; font-weight: 700; color: #1C1C1E; letter-spacing: 4px; font-feature-settings: 'tnum';">
                ${current.display} =
            </div>
        `;

        // 自动朗读题目
        if (!this.hasSubmitted && SpeechManager.isEnabled()) {
            setTimeout(() => {
                SpeechManager.speakExpression(current.display + '等于多少');
            }, 300);
        }

        // 更新答案显示
        this.elements.answerDisplay.textContent = this.currentAnswer || '';

        if (this.hasSubmitted) {
            if (this.isCorrect) {
                this.elements.answerDisplay.style.background = '#D1FAE5';
                this.elements.answerDisplay.style.color = '#059669';
                this.elements.answerDisplay.classList.add('bounce');
            } else {
                this.elements.answerDisplay.style.background = '#FEE2E2';
                this.elements.answerDisplay.style.color = '#DC2626';
            }
        } else {
            this.elements.answerDisplay.style.background = 'rgba(120, 120, 128, 0.08)';
            this.elements.answerDisplay.style.color = '#1C1C1E';
            this.elements.answerDisplay.classList.remove('bounce');
        }

        // 更新反馈
        if (this.hasSubmitted) {
            this.elements.feedback.innerHTML = `
                <div style="font-size: 20px; font-weight: 600; color: ${this.isCorrect ? '#34C759' : '#FF3B30'};
                     animation: fadeInUp 300ms ease;">
                    ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                </div>
            `;

            // 更新提交按钮为下一题
            const submitBtn = this.elements.keys.submit;
            if (submitBtn) {
                submitBtn.textContent = '→';
                submitBtn.style.background = '#34C759';
                submitBtn.style.color = 'white';
                submitBtn.classList.add('pulse-gentle');
                submitBtn.onclick = () => this.nextQuestion();
            }
        } else {
            this.elements.feedback.innerHTML = '';

            // 恢复提交按钮
            const submitBtn = this.elements.keys.submit;
            if (submitBtn) {
                submitBtn.textContent = '↵';
                submitBtn.style.background = '#E8F5E9';
                submitBtn.style.color = '#34C759';
                submitBtn.classList.remove('pulse-gentle');
                submitBtn.onclick = () => this.submitAnswer();
                submitBtn.disabled = !this.currentAnswer;
                submitBtn.style.opacity = this.currentAnswer ? '1' : '0.4';
            }
        }

        // 更新键盘状态
        ['clear', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(key => {
            const btn = this.elements.keys[key];
            if (btn) {
                btn.disabled = this.hasSubmitted;
                btn.style.opacity = this.hasSubmitted ? '0.4' : '1';
                btn.style.cursor = this.hasSubmitted ? 'default' : 'pointer';
            }
        });
    },

    inputNumber(num) {
        if (this.hasSubmitted) return;
        if (this.currentAnswer.length >= 4) return;

        if (typeof SoundManager !== 'undefined') {
            SoundManager.playKeyPress();
        }

        this.currentAnswer += num.toString();
        this.updateDisplay();
    },

    clearAnswer() {
        if (this.hasSubmitted) return;

        this.currentAnswer = '';
        this.updateDisplay();
    },

    backspace() {
        if (this.hasSubmitted) return;

        this.currentAnswer = this.currentAnswer.slice(0, -1);
        this.updateDisplay();
    },

    submitAnswer() {
        if (!this.currentAnswer || this.hasSubmitted) return;

        if (typeof SoundManager !== 'undefined') {
            SoundManager.playSubmit();
        }

        const current = this.questions[this.currentIndex];
        const userAnswer = parseInt(this.currentAnswer, 10);
        this.isCorrect = !isNaN(userAnswer) && userAnswer === current.answer;

        this.hasSubmitted = true;

        if (typeof SoundManager !== 'undefined') {
            if (this.isCorrect) {
                SoundManager.playCorrect();
            } else {
                SoundManager.playWrong();
                this.elements.answerDisplay.classList.add('shake');
                setTimeout(() => this.elements.answerDisplay.classList.remove('shake'), 400);
            }
        }

        this.answers.push({
            question: current,
            userAnswer: userAnswer,
            isCorrect: this.isCorrect,
            timeSpent: Date.now() - (this.questionStartTime || this.startTime)
        });

        if (this.isCorrect) {
            this.streak++;
            // 错题模式：记录答对
            const isMistakeMode = sessionStorage.getItem('mistake_mode') === 'true';
            if (isMistakeMode && typeof Storage !== 'undefined') {
                const mistakeId = sessionStorage.getItem('mistake_id');
                if (mistakeId) {
                    const removed = Storage.recordMistakeCorrect(mistakeId);
                    if (removed) {
                        // 已答对3次，从错题本移除
                        console.log('错题已掌握，从错题本移除');
                    }
                }
            }
        } else {
            this.streak = 0;
            if (typeof Storage !== 'undefined') {
                Storage.addMistake(current, userAnswer);
            }
        }

        this.updateDisplay();
        this.updateHeader();
    },

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.currentAnswer = '';
            this.hasSubmitted = false;
            this.isCorrect = false;

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
        // 错题模式处理
        const isMistakeMode = sessionStorage.getItem('mistake_mode') === 'true';
        if (isMistakeMode) {
            sessionStorage.removeItem('mistake_mode');
            sessionStorage.removeItem('mistake_id');
            router.navigate('mistakes');
            return;
        }

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

        // 统计运算类型数据（用于能力雷达图）
        const typeStats = {
            addition: { correct: 0, wrong: 0 },
            subtraction: { correct: 0, wrong: 0 },
            multiplication: { correct: 0, wrong: 0 },
            division: { correct: 0, wrong: 0 }
        };

        this.answers.forEach((answer, index) => {
            const question = this.questions[index];
            if (question && question.type && typeStats[question.type]) {
                if (answer.isCorrect) {
                    typeStats[question.type].correct++;
                } else {
                    typeStats[question.type].wrong++;
                }
            }
        });

        sessionStorage.setItem('practice_result', JSON.stringify(sessionStats));
        if (typeof Storage !== 'undefined') {
            Storage.updateStats(sessionStats, typeStats);
        }
        router.navigate('result');
    },

    getScore() {
        return this.answers.filter(a => a.isCorrect).length * 10;
    },

    bindKeyboard() {
        document.onkeydown = (e) => {
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                this.inputNumber(parseInt(e.key, 10));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (this.hasSubmitted) {
                    this.nextQuestion();
                } else if (this.currentAnswer) {
                    this.submitAnswer();
                }
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                this.backspace();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.clearAnswer();
            }
        };
    },

    animateEntry() {
        const card = this.elements.questionCard;
        if (card) {
            card.style.animation = 'pageEnter 400ms cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    },
};
