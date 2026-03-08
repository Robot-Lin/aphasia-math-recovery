/**
 * 首页模块
 * 展示学习概况和快速开始入口
 */

const HomePage = {
    /**
     * 渲染首页
     */
    render() {
        const summary = Storage.getStatsSummary();

        return `
            <div class="fade-in space-y-8">
                <!-- 欢迎语 -->
                <div class="text-center py-8">
                    <h2 class="text-4xl font-bold text-gray-800 mb-4">欢迎来到算术康复练习</h2>
                    <p class="text-xl text-gray-600">每天练习一点点，算术能力慢慢恢复</p>
                </div>

                <!-- 统计卡片 -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- 练习次数 -->
                    <div class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
                                ✏️
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">练习次数</p>
                                <p class="text-3xl font-bold text-gray-800">${summary.practiceCount}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 待复习错题 -->
                    <div class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-3xl">
                                📖
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">待复习错题</p>
                                <p class="text-3xl font-bold text-gray-800">${summary.reviewCount}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 已做题数 -->
                    <div class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                                ✅
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">已做题数</p>
                                <p class="text-3xl font-bold text-gray-800">${summary.totalQuestions}</p>
                            </div>
                        </div>
                    </div>

                    <!-- 正确率 -->
                    <div class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100">
                        <div class="flex items-center gap-4">
                            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">
                                🎯
                            </div>
                            <div>
                                <p class="text-gray-500 text-sm font-medium">正确率</p>
                                <p class="text-3xl font-bold text-gray-800">${summary.accuracy}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 快速开始区域 -->
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                    <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div class="text-center lg:text-left">
                            <h3 class="text-2xl font-bold mb-2">准备好开始今天的练习了吗？</h3>
                            <p class="text-blue-100 text-lg">从简单的加法开始，一步步找回自信</p>
                        </div>
                        <button onclick="router.navigate('practice-settings')"
                            class="btn-press bg-white text-blue-600 px-10 py-5 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3">
                            <span>🚀</span>
                            <span>开始练习</span>
                        </button>
                    </div>
                </div>

                <!-- 复习提醒（有条件显示） -->
                ${summary.reviewCount > 0 ? `
                <div class="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="text-4xl">🧠</span>
                            <div>
                                <h4 class="text-xl font-bold text-orange-800">今日复习提醒</h4>
                                <p class="text-orange-600">有 ${summary.reviewCount} 道错题需要复习，巩固记忆效果更好哦</p>
                            </div>
                        </div>
                        <button onclick="alert('错题本功能将在后续版本推出')"
                            class="btn-press bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all duration-200">
                            开始复习
                        </button>
                    </div>
                </div>
                ` : ''}

                <!-- 使用提示 -->
                <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h4 class="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <span>💡</span>
                        <span>使用提示</span>
                    </h4>
                    <ul class="space-y-2 text-gray-600">
                        <li class="flex items-start gap-2">
                            <span class="text-blue-500">•</span>
                            <span>点击左侧「开始练习」进入练习页面</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-blue-500">•</span>
                            <span>使用屏幕上的数字键盘或电脑键盘输入答案</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <span class="text-blue-500">•</span>
                            <span>答错没关系，系统会自动记录并安排复习</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * 初始化首页
     */
    init() {
        const container = document.getElementById('page-container');
        container.innerHTML = this.render();

        // 更新导航状态
        this.updateNavState();
    },

    /**
     * 更新导航栏激活状态
     */
    updateNavState() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-blue-200');
            item.classList.add('text-gray-600', 'hover:bg-gray-100');
        });

        const activeNav = document.getElementById('nav-home');
        if (activeNav) {
            activeNav.classList.remove('text-gray-600', 'hover:bg-gray-100');
            activeNav.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-blue-200');
        }
    }
};
