/**
 * 练习页 - 键盘输入模式
 * Phase 1 核心功能
 */

const PracticeKeypadPage = {
    /**
     * 题目数据
     */
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,

    /**
     * 当前答案
     */
    currentAnswer: '',

    /**
     * 是否已提交（用于显示反馈）
     */
    hasSubmitted: false,
    isCorrect: false,

    /**
     * 连击数
     */
    streak: 0,

    /**
     * 渲染练习页
     */
    render() {
        const current = this.questions[this.currentIndex];
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;

        return `
            <div class="fade-in max-w-3xl mx-auto">
                <!-- 顶部信息栏 -->
                <div class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 mb-6">
                    <div class="flex items-center justify-between">
                        <!-- 进度 -->
                        <div class="flex items-center gap-4">
                            <div class="text-lg font-medium text-gray-600">
                                第 <span class="text-2xl font-bold text-primary">${this.currentIndex + 1}</span> / ${this.questions.length} 题
                            </div>
                            <div class="px-4 py-2 bg-blue-50 rounded-full text-blue-700 font-medium">
                                初级加法
                            </div>
                        </div>

                        <!-- 得分 -->
                        <div class="flex items-center gap-4">
                            ${this.streak > 2 ? `
                            <div class="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full">
                                <span class="text-2xl">🔥</span>
                                <span class="text-xl font-bold text-orange-600">${this.streak}</span>
                            </div>
                            ` : ''}
                            <div class="text-lg text-gray-600">
                                得分: <span class="text-2xl font-bold text-primary">${this.getScore()}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 进度条 -->
                    <div class="mt-4">
                        <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>

                <!-- 题目区域 -->
                <div class="bg-white rounded-3xl p-12 shadow-xl shadow-gray-100 border border-gray-100 mb-6">
                    <!-- 题目 -->
                    <div class="text-center mb-12">
                        <div class="text-question font-bold text-gray-800 large-text mb-8">
                            ${current.display} =
                        </div>

                        <!-- 答案显示区 -->
                        <div id="answer-display" class="inline-block min-w-[200px] px-8 py-4 rounded-2xl text-5xl font-bold transition-all duration-300 ${
                            this.hasSubmitted
                                ? (this.isCorrect ? 'bg-success-light text-success' : 'bg-error-light text-error')
                                : 'bg-gray-100 text-gray-800'
                        }">
                            ${this.currentAnswer || '\u00A0'}
                        </div>

                        <!-- 反馈信息 -->
                        ${this.hasSubmitted ? `
                        <div class="mt-6 text-2xl font-bold ${this.isCorrect ? 'text-success' : 'text-error'}">
                            ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                        </div>
                        ` : ''}
                    </div>

                    <!-- 数字键盘 -->
                    <div class="max-w-md mx-auto">
                        <div class="grid grid-cols-3 gap-4">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
                                <button onclick="PracticeKeypadPage.inputNumber(${num})"
                                    class="btn-press h-20 bg-white border-2 border-gray-200 rounded-2xl text-3xl font-bold text-gray-700 shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 flex items-center justify-center"
                                    ${this.hasSubmitted ? 'disabled' : ''}>
                                    ${num}
                                </button>
                            `).join('')}

                            <!-- 清除按钮 -->
                            <button onclick="PracticeKeypadPage.clearAnswer()"
                                class="btn-press h-20 bg-orange-50 border-2 border-orange-200 rounded-2xl text-2xl font-bold text-orange-600 shadow-md hover:bg-orange-100 transition-all duration-150 flex items-center justify-center"
                                ${this.hasSubmitted ? 'disabled' : ''}>
                                C
                            </button>

                            <!-- 0 -->
                            <button onclick="PracticeKeypadPage.inputNumber(0)"
                                class="btn-press h-20 bg-white border-2 border-gray-200 rounded-2xl text-3xl font-bold text-gray-700 shadow-md hover:border-blue-400 hover:bg-blue-50 transition-all duration-150 flex items-center justify-center"
                                ${this.hasSubmitted ? 'disabled' : ''}>
                                0
                            </button>

                            <!-- 提交/下一题按钮 -->
                            ${this.hasSubmitted ? `
                                <button onclick="PracticeKeypadPage.nextQuestion()"
                                    class="btn-press h-20 bg-success border-2 border-success rounded-2xl text-2xl font-bold text-white shadow-md hover:bg-green-600 transition-all duration-150 flex items-center justify-center animate-pulse">
                                    下一题 →
                                </button>
                            ` : `
                                <button onclick="PracticeKeypadPage.submitAnswer()"
                                    class="btn-press h-20 bg-primary border-2 border-primary rounded-2xl text-2xl font-bold text-white shadow-md hover:bg-primary-hover transition-all duration-150 flex items-center justify-center"
                                    ${!this.currentAnswer ? 'disabled class="opacity-50 cursor-not-allowed"' : ''}>
                                    ↵
                                </button>
                            `}
                        </div>

                        <!-- 键盘提示 -->
                        <div class="mt-6 text-center text-gray-400 text-sm">
                            可以使用电脑键盘输入数字，按 Enter 提交
                        </div>
                    </div>
                </div>

                <!-- 结束练习按钮 -->
                <div class="text-center">
                    <button onclick="PracticeKeypadPage.endPractice()"
                        class="text-gray-400 hover:text-gray-600 text-lg font-medium transition-colors duration-200">
                        结束练习
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * 输入数字
     */
    inputNumber(num) {
        if (this.hasSubmitted) return;
        if (this.currentAnswer.length >= 4) return; // 最多4位

        // 播放按键音效
        SoundManager.playKeyPress();

        this.currentAnswer += num.toString();
        this.updateAnswerDisplay();
    },

    /**
     * 清除答案
     */
    clearAnswer() {
        if (this.hasSubmitted) return;
        this.currentAnswer = '';
        this.updateAnswerDisplay();
    },

    /**
     * 删除最后一位
     */
    backspace() {
        if (this.hasSubmitted) return;
        this.currentAnswer = this.currentAnswer.slice(0, -1);
        this.updateAnswerDisplay();
    },

    /**
     * 更新答案显示
     */
    updateAnswerDisplay() {
        const display = document.getElementById('answer-display');
        if (display) {
            display.textContent = this.currentAnswer || '\u00A0';
        }
        this.render(); // 重新渲染以更新提交按钮状态
        this.bindKeyboardEvents(); // 重新绑定事件
    },

    /**
     * 提交答案
     */
    submitAnswer() {
        if (!this.currentAnswer || this.hasSubmitted) return;

        // 播放提交音效
        SoundManager.playSubmit();

        const current = this.questions[this.currentIndex];
        const userAnswer = parseInt(this.currentAnswer, 10);
        const isCorrect = QuestionGenerator.checkAnswer(userAnswer, current.answer);

        this.isCorrect = isCorrect;
        this.hasSubmitted = true;

        // 播放正确/错误音效
        if (isCorrect) {
            SoundManager.playCorrect();
        } else {
            SoundManager.playWrong();
        }

        // 记录答案
        this.answers.push({
            question: current,
            userAnswer: userAnswer,
            isCorrect: isCorrect,
            timeSpent: Date.now() - this.questionStartTime
        });

        // 更新连击
        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
            // 记录错题
            Storage.addMistake(current, userAnswer);
        }

        // 更新页面
        this.render();
        this.bindKeyboardEvents();

        // 自动聚焦到下一题按钮（焦点管理）
        setTimeout(() => {
            const nextButton = document.querySelector('button[onclick="PracticeKeypadPage.nextQuestion()"]');
            if (nextButton) {
                nextButton.focus();
            }
        }, 100);
    },

    /**
     * 下一题
     */
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.currentAnswer = '';
            this.hasSubmitted = false;
            this.isCorrect = false;
            this.questionStartTime = Date.now();

            this.render();
            this.bindKeyboardEvents();

            // 自动聚焦到数字键盘（焦点管理）
            setTimeout(() => {
                const firstNumberButton = document.querySelector('button[onclick="PracticeKeypadPage.inputNumber(1)"]');
                if (firstNumberButton && !firstNumberButton.disabled) {
                    firstNumberButton.focus();
                }
            }, 100);
        } else {
            // 练习完成
            this.finishPractice();
        }
    },

    /**
     * 结束练习
     */
    endPractice() {
        if (confirm('确定要结束当前练习吗？进度将不会保存。')) {
            router.navigate('home');
        }
    },

    /**
     * 完成练习
     */
    finishPractice() {
        // 播放完成音效
        SoundManager.playComplete();

        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000 / 60); // 分钟

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

        // 保存到 sessionStorage 用于结果页显示
        sessionStorage.setItem('practice_result', JSON.stringify(sessionStats));

        // 更新用户数据
        Storage.updateStats(sessionStats);

        // 跳转到结果页
        router.navigate('result');
    },

    /**
     * 计算当前得分
     */
    getScore() {
        return this.answers.filter(a => a.isCorrect).length * 10;
    },

    /**
     * 初始化练习页
     */
    init() {
        // 加载数据
        const questionsJson = sessionStorage.getItem('practice_questions');
        if (!questionsJson) {
            router.navigate('practice-settings');
            return;
        }

        // 初始化音效（需要用户交互后才能播放）
        document.addEventListener('click', () => {
            SoundManager.init();
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

        // 恢复连击数
        this.answers.forEach(a => {
            if (a.isCorrect) {
                this.streak++;
            } else {
                this.streak = 0;
            }
        });

        const container = document.getElementById('page-container');
        container.innerHTML = this.render();

        this.bindKeyboardEvents();

        // 自动聚焦到第一个数字按钮（焦点管理）
        setTimeout(() => {
            const firstNumberButton = document.querySelector('button[onclick="PracticeKeypadPage.inputNumber(1)"]');
            if (firstNumberButton && !firstNumberButton.disabled) {
                firstNumberButton.focus();
            }
        }, 100);
    },

    /**
     * 绑定键盘事件
     */
    bindKeyboardEvents() {
        document.onkeydown = (e) => {
            // 数字键 0-9
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                this.inputNumber(parseInt(e.key, 10));
            }
            // Enter 提交或下一题
            else if (e.key === 'Enter') {
                e.preventDefault();
                if (this.hasSubmitted) {
                    this.nextQuestion();
                } else if (this.currentAnswer) {
                    this.submitAnswer();
                }
            }
            // Backspace 删除
            else if (e.key === 'Backspace') {
                e.preventDefault();
                this.backspace();
            }
            // Escape 清除
            else if (e.key === 'Escape') {
                e.preventDefault();
                this.clearAnswer();
            }
        };
    }
};
