/**
 * 练习设置页模块
 * Phase 1 简化版：仅支持加法初级 + 键盘模式 + 5题固定
 */

const PracticeSettingsPage = {
    /**
     * 渲染设置页
     */
    render() {
        return `
            <div class="fade-in max-w-2xl mx-auto">
                <!-- 页面标题 -->
                <div class="text-center mb-10">
                    <h2 class="text-4xl font-bold text-gray-800 mb-3">练习设置</h2>
                    <p class="text-xl text-gray-600">选择适合您的练习模式</p>
                </div>

                <!-- 设置卡片 -->
                <div class="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    <!-- 头部 -->
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
                        <h3 class="text-2xl font-bold text-white flex items-center gap-3">
                            <span>⚙️</span>
                            <span>当前配置</span>
                        </h3>
                    </div>

                    <!-- 设置内容 -->
                    <div class="p-8 space-y-8">
                        <!-- 答题模式 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">答题模式</label>
                            <div class="grid grid-cols-2 gap-4">
                                <button id="mode-keypad" class="setting-option active"
                                    onclick="PracticeSettingsPage.selectMode('keypad')">
                                    <div class="text-3xl mb-2">⌨️</div>
                                    <div class="font-bold">键盘输入</div>
                                    <div class="text-sm text-gray-500 mt-1">使用数字键盘</div>
                                </button>
                                <button id="mode-choice" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-3xl mb-2">🔘</div>
                                    <div class="font-bold">选择题</div>
                                    <div class="text-sm text-gray-500 mt-1">后续版本推出</div>
                                </button>
                            </div>
                        </div>

                        <!-- 难度选择 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">难度等级</label>
                            <div class="grid grid-cols-3 gap-4">
                                <button id="diff-beginner" class="setting-option active"
                                    onclick="PracticeSettingsPage.selectDifficulty('beginner')">
                                    <div class="text-2xl mb-2">🌱</div>
                                    <div class="font-bold">初级</div>
                                    <div class="text-sm text-gray-500 mt-1">数字 1-20</div>
                                </button>
                                <button id="diff-intermediate" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl mb-2">🌿</div>
                                    <div class="font-bold">中级</div>
                                    <div class="text-sm text-gray-500 mt-1">后续推出</div>
                                </button>
                                <button id="diff-advanced" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl mb-2">🌳</div>
                                    <div class="font-bold">高级</div>
                                    <div class="text-sm text-gray-500 mt-1">后续推出</div>
                                </button>
                            </div>
                        </div>

                        <!-- 运算类型 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">运算类型</label>
                            <div class="grid grid-cols-4 gap-3">
                                <button id="type-addition" class="setting-option active"
                                    onclick="PracticeSettingsPage.selectType('addition')">
                                    <div class="text-2xl mb-1">➕</div>
                                    <div class="font-bold">加法</div>
                                </button>
                                <button id="type-subtraction" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl mb-1">➖</div>
                                    <div class="font-bold">减法</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                                <button id="type-multiplication" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl mb-1">✖️</div>
                                    <div class="font-bold">乘法</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                                <button id="type-division" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl mb-1">➗</div>
                                    <div class="font-bold">除法</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                            </div>
                        </div>

                        <!-- 题量选择 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">题目数量</label>
                            <div class="grid grid-cols-4 gap-3">
                                <button id="count-5" class="setting-option active"
                                    onclick="PracticeSettingsPage.selectCount(5)">
                                    <div class="text-2xl font-bold">5</div>
                                    <div class="text-sm text-gray-500">题</div>
                                </button>
                                <button id="count-10" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl font-bold">10</div>
                                    <div class="text-sm text-gray-500">题</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                                <button id="count-15" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl font-bold">15</div>
                                    <div class="text-sm text-gray-500">题</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                                <button id="count-20" class="setting-option opacity-50 cursor-not-allowed">
                                    <div class="text-2xl font-bold">20</div>
                                    <div class="text-sm text-gray-500">题</div>
                                    <div class="text-xs text-gray-400">后续推出</div>
                                </button>
                            </div>
                        </div>

                        <!-- 难度说明卡片 -->
                        <div class="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                            <h4 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <span>ℹ️</span>
                                <span>当前难度说明</span>
                            </h4>
                            <div class="space-y-2 text-blue-700">
                                <p class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span><strong>数字范围：</strong>1 - 20</span>
                                </p>
                                <p class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span><strong>运算类型：</strong>加法（+）</span>
                                </p>
                                <p class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span><strong>适合人群：</strong>刚开始算术康复练习</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- 底部按钮 -->
                    <div class="px-8 py-6 bg-gray-50 border-t border-gray-100">
                        <button onclick="PracticeSettingsPage.startPractice()"
                            class="btn-press w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-5 rounded-2xl text-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3">
                            <span>🚀</span>
                            <span>开始练习</span>
                        </button>
                        <p class="text-center text-gray-400 text-sm mt-4">按 Enter 键快速开始</p>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * 设置配置
     */
    config: {
        mode: 'keypad',
        difficulty: 'beginner',
        type: 'addition',
        count: 5
    },

    /**
     * 选择答题模式
     */
    selectMode(mode) {
        // Phase 1 仅支持键盘模式
        if (mode !== 'keypad') return;
        this.config.mode = mode;
        this.updateUI();
    },

    /**
     * 选择难度
     */
    selectDifficulty(difficulty) {
        // Phase 1 仅支持初级
        if (difficulty !== 'beginner') return;
        this.config.difficulty = difficulty;
        this.updateUI();
    },

    /**
     * 选择运算类型
     */
    selectType(type) {
        // Phase 1 仅支持加法
        if (type !== 'addition') return;
        this.config.type = type;
        this.updateUI();
    },

    /**
     * 选择题量
     */
    selectCount(count) {
        // Phase 1 仅支持5题
        if (count !== 5) return;
        this.config.count = count;
        this.updateUI();
    },

    /**
     * 更新 UI 状态
     */
    updateUI() {
        // 更新模式选择
        document.querySelectorAll('[id^="mode-"]').forEach(el => {
            if (el.id === `mode-${this.config.mode}`) {
                el.classList.add('active');
            } else if (!el.classList.contains('opacity-50')) {
                el.classList.remove('active');
            }
        });

        // 更新难度选择
        document.querySelectorAll('[id^="diff-"]').forEach(el => {
            if (el.id === `diff-${this.config.difficulty}`) {
                el.classList.add('active');
            } else if (!el.classList.contains('opacity-50')) {
                el.classList.remove('active');
            }
        });

        // 更新类型选择
        document.querySelectorAll('[id^="type-"]').forEach(el => {
            if (el.id === `type-${this.config.type}`) {
                el.classList.add('active');
            } else if (!el.classList.contains('opacity-50')) {
                el.classList.remove('active');
            }
        });

        // 更新题量选择
        document.querySelectorAll('[id^="count-"]').forEach(el => {
            if (el.id === `count-${this.config.count}`) {
                el.classList.add('active');
            } else if (!el.classList.contains('opacity-50')) {
                el.classList.remove('active');
            }
        });
    },

    /**
     * 开始练习
     */
    startPractice() {
        // 保存练习配置
        sessionStorage.setItem('practice_config', JSON.stringify(this.config));

        // 生成题目
        const questions = QuestionGenerator.generate({
            count: this.config.count
        });
        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        // 跳转到练习页
        router.navigate('practice-keypad');
    },

    /**
     * 初始化设置页
     */
    init() {
        const container = document.getElementById('page-container');
        container.innerHTML = this.render();

        // 重置配置
        this.config = {
            mode: 'keypad',
            difficulty: 'beginner',
            type: 'addition',
            count: 5
        };

        // 绑定键盘事件
        this.bindKeyboardEvents();

        // 更新导航状态
        this.updateNavState();
    },

    /**
     * 绑定键盘事件
     */
    bindKeyboardEvents() {
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.startPractice();
            }
        };
    },

    /**
     * 更新导航栏激活状态
     */
    updateNavState() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-blue-200');
            item.classList.add('text-gray-600', 'hover:bg-gray-100');
        });

        const activeNav = document.getElementById('nav-practice');
        if (activeNav) {
            activeNav.classList.remove('text-gray-600', 'hover:bg-gray-100');
            activeNav.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-blue-200');
        }
    }
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .setting-option {
        @apply p-4 rounded-xl border-2 border-gray-200 text-center transition-all duration-200 cursor-pointer;
    }
    .setting-option:hover:not(.opacity-50) {
        @apply border-blue-300 bg-blue-50;
    }
    .setting-option.active {
        @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
    }
    .setting-option.opacity-50 {
        @apply cursor-not-allowed bg-gray-100;
    }
`;
document.head.appendChild(style);
