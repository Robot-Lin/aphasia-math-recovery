/**
 * 练习页 - 键盘输入模式
 * Phase 2 修复版
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

    render() {
        const current = this.questions[this.currentIndex];
        if (!current) return;

        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        const typeNames = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };
        const diffNames = { beginner: '初级', intermediate: '中级', advanced: '高级' };
        const typeName = typeNames[current.type] || current.type;
        const diffName = diffNames[current.difficulty] || current.difficulty;

        const container = document.getElementById('page-container');
        if (!container) return;

        let answerBg, answerColor;
        if (this.hasSubmitted) {
            if (this.isCorrect) {
                answerBg = '#D1FAE5';
                answerColor = '#059669';
            } else {
                answerBg = '#FEE2E2';
                answerColor = '#DC2626';
            }
        } else {
            answerBg = '#F3F4F6';
            answerColor = '#1F2937';
        }

        container.innerHTML = `
            <div class="fade-in" style="max-width: 48rem; margin: 0 auto;">
                <!-- 顶部信息栏 -->
                <div style="background: white; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB; margin-bottom: 1.5rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="font-size: 1.125rem; font-weight: 500; color: #4B5563;">
                                第 <span style="font-size: 1.5rem; font-weight: bold; color: #3B82F6;">${this.currentIndex + 1}</span> / ${this.questions.length} 题
                            </div>
                            <div style="padding: 0.5rem 1rem; background: #EFF6FF; border-radius: 9999px; color: #1D4ED8; font-weight: 500;">
                                ${diffName}${typeName}
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; gap: 1rem;">
                            ${this.streak > 2 ? `
                            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #FFEDD5; border-radius: 9999px;">
                                <span style="font-size: 1.5rem;">🔥</span>
                                <span style="font-size: 1.25rem; font-weight: bold; color: #EA580C;">${this.streak}</span>
                            </div>
                            ` : ''}
                            <div style="font-size: 1.125rem; color: #4B5563;">
                                得分: <span style="font-size: 1.5rem; font-weight: bold; color: #3B82F6;">${this.getScore()}</span>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top: 1rem;">
                        <div style="height: 0.75rem; background: #F3F4F6; border-radius: 9999px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(to right, #3B82F6, #2563EB); border-radius: 9999px; transition: width 0.5s; width: ${progress}%;"></div>
                        </div>
                    </div>
                </div>

                <!-- 题目区域 -->
                <div style="background: white; border-radius: 1.5rem; padding: 3rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); border: 1px solid #E5E7EB; margin-bottom: 1.5rem;">
                    <div style="text-align: center; margin-bottom: 3rem;">
                        <div style="font-size: 3.5rem; font-weight: bold; color: #1F2937; margin-bottom: 2rem; font-feature-settings: 'tnum';">
                            ${current.display} =
                        </div>

                        <div id="answer-display" style="display: inline-block; min-width: 200px; padding: 1rem 2rem; border-radius: 1rem; font-size: 3rem; font-weight: bold; background: ${answerBg}; color: ${answerColor}; transition: all 0.3s;">
                            ${this.currentAnswer || '\u00A0'}
                        </div>

                        ${this.hasSubmitted ? `
                        <div style="margin-top: 1.5rem; font-size: 1.5rem; font-weight: bold; ${this.isCorrect ? 'color: #10B981;' : 'color: #EF4444;'}">
                            ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                        </div>
                        ` : ''}
                    </div>

                    <!-- 数字键盘 -->
                    <div style="max-width: 28rem; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
                                <button onclick="PracticeKeypadPage.inputNumber(${num})"
                                    style="height: 5rem; background: white; border: 2px solid #E5E7EB; border-radius: 1rem; font-size: 1.875rem; font-weight: bold; color: #374151; cursor: ${this.hasSubmitted ? 'default' : 'pointer'}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;"
                                    ${this.hasSubmitted ? 'disabled' : ''}>
                                    ${num}
                                </button>
                            `).join('')}

                            <button onclick="PracticeKeypadPage.clearAnswer()"
                                style="height: 5rem; background: #FFF7ED; border: 2px solid #FED7AA; border-radius: 1rem; font-size: 1.5rem; font-weight: bold; color: #EA580C; cursor: ${this.hasSubmitted ? 'default' : 'pointer'}; display: flex; align-items: center; justify-content: center;"
                                ${this.hasSubmitted ? 'disabled' : ''}>
                                C
                            </button>

                            <button onclick="PracticeKeypadPage.inputNumber(0)"
                                style="height: 5rem; background: white; border: 2px solid #E5E7EB; border-radius: 1rem; font-size: 1.875rem; font-weight: bold; color: #374151; cursor: ${this.hasSubmitted ? 'default' : 'pointer'}; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;"
                                ${this.hasSubmitted ? 'disabled' : ''}>
                                0
                            </button>

                            ${this.hasSubmitted ? `
                                <button onclick="PracticeKeypadPage.nextQuestion()"
                                    style="height: 5rem; background: #10B981; border: 2px solid #10B981; border-radius: 1rem; font-size: 1.5rem; font-weight: bold; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;">
                                    下一题 →
                                </button>
                            ` : `
                                <button onclick="PracticeKeypadPage.submitAnswer()"
                                    style="height: 5rem; background: ${this.currentAnswer ? '#3B82F6' : '#9CA3AF'}; border: 2px solid ${this.currentAnswer ? '#3B82F6' : '#9CA3AF'}; border-radius: 1rem; font-size: 1.5rem; font-weight: bold; color: white; cursor: ${this.currentAnswer ? 'pointer' : 'not-allowed'}; display: flex; align-items: center; justify-content: center;"
                                    ${!this.currentAnswer ? 'disabled' : ''}>
                                    ↵
                                </button>
                            `}
                        </div>

                        <div style="margin-top: 1.5rem; text-align: center; color: #9CA3AF; font-size: 0.875rem;">
                            可以使用电脑键盘输入数字，按 Enter 提交
                        </div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <button onclick="PracticeKeypadPage.endPractice()"
                        style="color: #9CA3AF; font-size: 1.125rem; font-weight: 500; cursor: pointer; background: none; border: none;">
                        结束练习
                    </button>
                </div>
            </div>
        `;
    },

    inputNumber(num) {
        if (this.hasSubmitted) return;
        if (this.currentAnswer.length >= 4) return;

        if (typeof SoundManager !== 'undefined') {
            SoundManager.playKeyPress();
        }

        this.currentAnswer += num.toString();
        this.render();
    },

    clearAnswer() {
        if (this.hasSubmitted) return;
        this.currentAnswer = '';
        this.render();
    },

    backspace() {
        if (this.hasSubmitted) return;
        this.currentAnswer = this.currentAnswer.slice(0, -1);
        this.render();
    },

    submitAnswer() {
        if (!this.currentAnswer || this.hasSubmitted) return;

        if (typeof SoundManager !== 'undefined') {
            SoundManager.playSubmit();
        }

        const current = this.questions[this.currentIndex];
        const userAnswer = parseInt(this.currentAnswer, 10);
        const isCorrect = !isNaN(userAnswer) && userAnswer === current.answer;

        this.isCorrect = isCorrect;
        this.hasSubmitted = true;

        if (typeof SoundManager !== 'undefined') {
            if (isCorrect) {
                SoundManager.playCorrect();
            } else {
                SoundManager.playWrong();
            }
        }

        this.answers.push({
            question: current,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            timeSpent: Date.now() - this.questionStartTime
        });

        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
            if (typeof Storage !== 'undefined') {
                Storage.addMistake(current, userAnswer);
            }
        }

        this.render();
    },

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.currentAnswer = '';
            this.hasSubmitted = false;
            this.isCorrect = false;
            this.questionStartTime = Date.now();
            this.render();
        } else {
            this.finishPractice();
        }
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

    init() {
        const questionsJson = sessionStorage.getItem('practice_questions');
        if (!questionsJson) {
            router.navigate('practice-settings');
            return;
        }

        document.addEventListener('click', () => {
            if (typeof SoundManager !== 'undefined') {
                SoundManager.init();
            }
        }, { once: true });

        this.questions = JSON.parse(questionsJson);
        this.currentIndex = parseInt(sessionStorage.getItem('practice_current') || '0');
        this.answers = JSON.parse(sessionStorage.getItem('practice_answers') || '[]');
        this.startTime = parseInt(sessionStorage.getItem('practice_start_time') || Date.now().toString());
        this.questionStartTime = Date.now();

        this.currentAnswer = '';
        this.hasSubmitted = false;
        this.isCorrect = false;
        this.streak = 0;

        this.answers.forEach(a => {
            if (a.isCorrect) {
                this.streak++;
            } else {
                this.streak = 0;
            }
        });

        this.render();

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
    }
};
