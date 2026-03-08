/**
 * 练习设置页模块 - Phase 2 完整版
 * 支持所有运算类型、难度、题量和模式选择
 */

const PracticeSettingsPage = {
    /**
     * 当前配置
     */
    config: {
        mode: 'keypad',        // keypad / choice
        difficulty: 'beginner', // beginner / intermediate / advanced
        types: ['addition'],   // 可多个: addition, subtraction, multiplication, division
        count: 5               // 5 / 10 / 15 / 20
    },

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
                                <button id="mode-keypad"
                                    class="setting-option ${this.config.mode === 'keypad' ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.selectMode('keypad')">
                                    <div class="text-3xl mb-2">⌨️</div>
                                    <div class="font-bold">键盘输入</div>
                                    <div class="text-sm text-gray-500 mt-1">使用数字键盘</div>
                                </button>
                                <button id="mode-choice"
                                    class="setting-option ${this.config.mode === 'choice' ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.selectMode('choice')">
                                    <div class="text-3xl mb-2">🔘</div>
                                    <div class="font-bold">选择题</div>
                                    <div class="text-sm text-gray-500 mt-1">从选项中选择</div>
                                </button>
                            </div>
                        </div>

                        <!-- 难度选择 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">难度等级</label>
                            <div class="grid grid-cols-3 gap-4">
                                <button id="diff-beginner"
                                    class="setting-option ${this.config.difficulty === 'beginner' ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.selectDifficulty('beginner')">
                                    <div class="text-2xl mb-2">🌱</div>
                                    <div class="font-bold">初级</div>
                                    <div class="text-sm text-gray-500 mt-1">简单入门</div>
                                </button>
                                <button id="diff-intermediate"
                                    class="setting-option ${this.config.difficulty === 'intermediate' ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.selectDifficulty('intermediate')">
                                    <div class="text-2xl mb-2">🌿</div>
                                    <div class="font-bold">中级</div>
                                    <div class="text-sm text-gray-500 mt-1">进阶练习</div>
                                </button>
                                <button id="diff-advanced"
                                    class="setting-option ${this.config.difficulty === 'advanced' ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.selectDifficulty('advanced')">
                                    <div class="text-2xl mb-2">🌳</div>
                                    <div class="font-bold">高级</div>
                                    <div class="text-sm text-gray-500 mt-1">挑战自我</div>
                                </button>
                            </div>
                        </div>

                        <!-- 运算类型 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">
                                运算类型
                                <span class="text-sm font-normal text-gray-500 ml-2">（可多选）</span>
                            </label>
                            <div class="grid grid-cols-4 gap-3">
                                <button id="type-addition"
                                    class="setting-option ${this.config.types.includes('addition') ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.toggleType('addition')">
                                    <div class="text-2xl mb-1">➕</div>
                                    <div class="font-bold">加法</div>
                                </button>
                                <button id="type-subtraction"
                                    class="setting-option ${this.config.types.includes('subtraction') ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.toggleType('subtraction')">
                                    <div class="text-2xl mb-1">➖</div>
                                    <div class="font-bold">减法</div>
                                </button>
                                <button id="type-multiplication"
                                    class="setting-option ${this.config.types.includes('multiplication') ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.toggleType('multiplication')">
                                    <div class="text-2xl mb-1">✖️</div>
                                    <div class="font-bold">乘法</div>
                                </button>
                                <button id="type-division"
                                    class="setting-option ${this.config.types.includes('division') ? 'active' : ''}"
                                    onclick="PracticeSettingsPage.toggleType('division')">
                                    <div class="text-2xl mb-1">➗</div>
                                    <div class="font-bold">除法</div>
                                </button>
                            </div>
                            <p id="type-error" class="text-red-500 text-sm mt-2 hidden">请至少选择一种运算类型</p>
                        </div>

                        <!-- 题量选择 -->
                        <div>
                            <label class="block text-lg font-bold text-gray-700 mb-4">题目数量</label>
                            <div class="grid grid-cols-4 gap-3">
                                ${[5, 10, 15, 20].map(num => `
                                    <button id="count-${num}"
                                        class="setting-option ${this.config.count === num ? 'active' : ''}"
                                        onclick="PracticeSettingsPage.selectCount(${num})">
                                        <div class="text-2xl font-bold">${num}</div>
                                        <div class="text-sm text-gray-500">题</div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 难度说明卡片 -->
                        <div class="bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
                            <h4 class="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <span>ℹ️</span>
                                <span>当前配置说明</span>
                            </h4>
                            <div class="space-y-2 text-blue-700" id="difficulty-description">
                                ${this.getDifficultyDescription()}
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
     * 获取难度说明 HTML
     */
    getDifficultyDescription() {
        const typeNames = this.config.types.map(t => QuestionGenerator.getTypeName(t)).join('、');
        const difficultyName = QuestionGenerator.getDifficultyName(this.config.difficulty);
        const modeName = this.config.mode === 'keypad' ? '键盘输入' : '选择题';

        let description = `
            <p class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>运算类型：</strong>${typeNames || '未选择'}</span>
            </p>
            <p class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>难度等级：</strong>${difficultyName}</span>
            </p>
            <p class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>答题模式：</strong>${modeName}</span>
            </p>
            <p class="flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>题目数量：</strong>${this.config.count} 题</span>
            </p>
        `;

        // 添加每种运算的数字范围
        this.config.types.forEach(type => {
            const range = QuestionGenerator.getDifficultyRange(type, this.config.difficulty);
            const typeName = QuestionGenerator.getTypeName(type);
            description += `
                <p class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-blue-300 rounded-full"></span>
                    <span>${typeName}数字范围：${range}</span>
                </p>
            `;
        });

        return description;
    },

    /**
     * 选择答题模式
     */
    selectMode(mode) {
        this.config.mode = mode;
        this.render();
        this.bindKeyboardEvents();
    },

    /**
     * 选择难度
     */
    selectDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.render();
        this.bindKeyboardEvents();
    },

    /**
     * 切换运算类型（多选）
     */
    toggleType(type) {
        const index = this.config.types.indexOf(type);

        if (index > -1) {
            // 如果已选中，且不是最后一个，则取消
            if (this.config.types.length > 1) {
                this.config.types.splice(index, 1);
            }
        } else {
            // 如果未选中，则添加
            this.config.types.push(type);
        }

        this.render();
        this.bindKeyboardEvents();
    },

    /**
     * 选择题量
     */
    selectCount(count) {
        this.config.count = count;
        this.render();
        this.bindKeyboardEvents();
    },

    /**
     * 开始练习
     */
    startPractice() {
        // 验证至少选择了一种运算类型
        if (this.config.types.length === 0) {
            document.getElementById('type-error').classList.remove('hidden');
            return;
        }

        // 保存配置
        sessionStorage.setItem('practice_config', JSON.stringify(this.config));

        // 生成题目
        let questions;
        if (this.config.types.length === 1) {
            // 单类型
            questions = QuestionGenerator.generate({
                type: this.config.types[0],
                difficulty: this.config.difficulty,
                count: this.config.count
            });
        } else {
            // 混合类型
            questions = QuestionGenerator.generateMixed(
                this.config.types,
                this.config.difficulty,
                this.config.count
            );
        }

        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        // 根据模式跳转到不同页面
        if (this.config.mode === 'keypad') {
            router.navigate('practice-keypad');
        } else {
            router.navigate('practice-choice');
        }
    },

    /**
     * 初始化设置页
     */
    init() {
        // 重置配置
        this.config = {
            mode: 'keypad',
            difficulty: 'beginner',
            types: ['addition'],
            count: 5
        };

        const container = document.getElementById('page-container');
        container.innerHTML = this.render();

        this.bindKeyboardEvents();
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
    .setting-option:hover {
        @apply border-blue-300 bg-blue-50;
    }
    .setting-option.active {
        @apply border-blue-500 bg-blue-50 ring-2 ring-blue-200;
    }
`;
document.head.appendChild(style);
