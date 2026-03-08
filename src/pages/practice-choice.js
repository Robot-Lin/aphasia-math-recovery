/**
 * 练习页 - 选择题模式
 * Phase 2 修复版
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

    render() {
        const current = this.questions[this.currentIndex];
        if (!current) return;

        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;

        if (this.currentOptions.length === 0) {
            this.currentOptions = this.generateOptions(current);
        }

        const typeNames = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };
        const diffNames = { beginner: '初级', intermediate: '中级', advanced: '高级' };
        const typeName = typeNames[current.type] || current.type;
        const diffName = diffNames[current.difficulty] || current.difficulty;

        const container = document.getElementById('page-container');
        if (!container) return;

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
                    <div style="text-align: center; margin-bottom: 2.5rem;">
                        <div style="font-size: 3.5rem; font-weight: bold; color: #1F2937; margin-bottom: 2rem; font-feature-settings: 'tnum';">
                            ${current.display} = ?
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; max-width: 28rem; margin: 0 auto;">
                        ${this.currentOptions.map((option, index) => this.renderOption(option, index))}
                    </div>

                    ${this.hasSelected ? `
                    <div style="margin-top: 2rem; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold; ${this.isCorrect ? 'color: #10B981;' : 'color: #EF4444;'}">
                            ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                        </div>
                    </div>
                    ` : ''}

                    ${this.hasSelected ? `
                    <div style="margin-top: 2rem; text-align: center;">
                        <button onclick="PracticeChoicePage.nextQuestion()"
                            style="background: #10B981; color: white; padding: 1rem 2.5rem; border-radius: 1rem; font-size: 1.25rem; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); animation: pulse 2s infinite;">
                            下一题 →
                        </button>
                    </div>
                    ` : ''}
                </div>

                <div style="text-align: center;">
                    <button onclick="PracticeChoicePage.endPractice()"
                        style="color: #9CA3AF; font-size: 1.125rem; font-weight: 500; cursor: pointer; background: none; border: none;">
                        结束练习
                    </button>
                </div>
            </div>
        `;
    },

    renderOption(option, index) {
        let bgColor, borderColor, textColor;

        if (!this.hasSelected) {
            bgColor = 'white';
            borderColor = '#E5E7EB';
            textColor = '#374151';
        } else {
            if (option === this.selectedAnswer) {
                if (this.isCorrect) {
                    bgColor = '#10B981';
                    borderColor = '#10B981';
                    textColor = 'white';
                } else {
                    bgColor = '#EF4444';
                    borderColor = '#EF4444';
                    textColor = 'white';
                }
            } else if (option === this.questions[this.currentIndex].answer && !this.isCorrect) {
                bgColor = '#D1FAE5';
                borderColor = '#10B981';
                textColor = '#059669';
            } else {
                bgColor = '#F3F4F6';
                borderColor = '#E5E7EB';
                textColor = '#9CA3AF';
            }
        }

        return `
            <button onclick="PracticeChoicePage.selectAnswer(${option})"
                style="height: 6rem; border-radius: 1rem; font-size: 1.875rem; font-weight: bold; border: 2px solid ${borderColor}; background: ${bgColor}; color: ${textColor}; cursor: ${this.hasSelected ? 'default' : 'pointer'}; transition: all 0.15s; display: flex; align-items: center; justify-content: center;"
                ${this.hasSelected ? 'disabled' : ''}>
                ${option}
            </button>
        `;
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

        this.render();
    },

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.hasSelected = false;
            this.isCorrect = false;
            this.selectedAnswer = null;
            this.currentOptions = [];
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

        this.hasSelected = false;
        this.isCorrect = false;
        this.selectedAnswer = null;
        this.currentOptions = [];
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
