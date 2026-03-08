/**
 * 练习页 - 选择题模式
 * Phase 2 新增功能
 */

const PracticeChoicePage = {
    /**
     * 题目数据
     */
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,

    /**
     * 是否已选择答案
     */
    hasSelected: false,
    isCorrect: false,
    selectedAnswer: null,

    /**
     * 当前选项
     */
    currentOptions: [],

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

        // 生成选项（如果还没生成）
        if (this.currentOptions.length === 0) {
            this.currentOptions = this.generateOptions(current);
        }

        const typeName = QuestionGenerator.getTypeName(current.type);
        const difficultyName = QuestionGenerator.getDifficultyName(current.difficulty);

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
                                ${difficultyName}${typeName}
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
                    <div class="text-center mb-10">
                        <div class="text-question font-bold text-gray-800 large-text">
                            ${current.display} = ?
                        </div>
                    </div>

                    <!-- 选项网格 -->
                    <div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                        ${this.currentOptions.map((option, index) => this.renderOption(option, index))}
                    </div>

                    <!-- 反馈信息 -->
                    ${this.hasSelected ? `
                    <div class="mt-8 text-center">
                        <div class="text-2xl font-bold ${this.isCorrect ? 'text-success' : 'text-error'}">
                            ${this.isCorrect ? '✓ 回答正确！' : `✗ 正确答案是 ${current.answer}`}
                        </div>
                    </div>
                    ` : ''}

                    <!-- 下一题按钮 -->
                    ${this.hasSelected ? `
                    <div class="mt-8 text-center">
                        <button onclick="PracticeChoicePage.nextQuestion()"
                            class="btn-press bg-success text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-lg hover:bg-green-600 transition-all duration-200 animate-pulse">
                            下一题 →
                        </button>
                    </div>
                    ` : ''}
                </div>

                <!-- 结束练习按钮 -->
                <div class="text-center">
                    <button onclick="PracticeChoicePage.endPractice()"
                        class="text-gray-400 hover:text-gray-600 text-lg font-medium transition-colors duration-200">
                        结束练习
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * 渲染单个选项
     */
    renderOption(option, index) {
        let classes = 'btn-press h-24 rounded-2xl text-3xl font-bold shadow-md transition-all duration-200 flex items-center justify-center ';

        if (!this.hasSelected) {
            // 未选择：可点击状态
            classes += 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
        } else {
            // 已选择：显示正确/错误
            if (option === this.selectedAnswer) {
                // 用户选择的答案
                classes += this.isCorrect
                    ? 'bg-success border-2 border-success text-white'  // 正确
                    : 'bg-error border-2 border-error text-white';     // 错误
            } else if (option === this.questions[this.currentIndex].answer && !this.isCorrect) {
                // 正确答案（如果用户答错了）
                classes += 'bg-success-light border-2 border-success text-success';
            } else {
                // 其他选项
                classes += 'bg-gray-100 border-2 border-gray-200 text-gray-400';
            }
        }

        return `
            <button onclick="PracticeChoicePage.selectAnswer(${option})"
                class="${classes}"
                ${this.hasSelected ? 'disabled' : ''}>
                ${option}
            </button>
        `;
    },

    /**
     * 生成选项（1个正确 + 3个干扰项）
     */
    generateOptions(question) {
        const correctAnswer = question.answer;
        const distractors = QuestionGenerator.generateDistractors(correctAnswer, 3);
        const options = [...distractors, correctAnswer];
        return QuestionGenerator.shuffle(options);
    },

    /**
     * 选择答案
     */
    selectAnswer(answer) {
        if (this.hasSelected) return;

        // 播放按键音效
        SoundManager.playKeyPress();

        const current = this.questions[this.currentIndex];
        const isCorrect = answer === current.answer;

        this.selectedAnswer = answer;
        this.isCorrect = isCorrect;
        this.hasSelected = true;

        // 播放正确/错误音效
        if (isCorrect) {
            SoundManager.playCorrect();
        } else {
            SoundManager.playWrong();
        }

        // 记录答案
        this.answers.push({
            question: current,
            userAnswer: answer,
            isCorrect: isCorrect,
            timeSpent: Date.now() - this.questionStartTime
        });

        // 更新连击
        if (isCorrect) {
            this.streak++;
        } else {
            this.streak = 0;
            // 记录错题
            Storage.addMistake(current, answer);
        }

        // 更新页面
        this.render();
        this.bindKeyboardEvents();
    },

    /**
     * 下一题
     */
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.hasSelected = false;
            this.isCorrect = false;
            this.selectedAnswer = null;
            this.currentOptions = [];
            this.questionStartTime = Date.now();

            this.render();
            this.bindKeyboardEvents();
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
        Storage.updateStats(sessionStats);
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

        // 初始化音效
        document.addEventListener('click', () => {
            SoundManager.init();
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
    },

    /**
     * 绑定键盘事件（选择题模式：1-4 选择选项）
     */
    bindKeyboardEvents() {
        document.onkeydown = (e) => {
            if (this.hasSelected) {
                // 已选择，按 Enter 下一题
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.nextQuestion();
                }
                return;
            }

            // 未选择，按 1-4 选择选项
            const key = parseInt(e.key);
            if (key >= 1 && key <= 4 && key <= this.currentOptions.length) {
                e.preventDefault();
                this.selectAnswer(this.currentOptions[key - 1]);
            }
        };
    }
};
