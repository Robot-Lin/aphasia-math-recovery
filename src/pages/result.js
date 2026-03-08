/**
 * 结果页模块
 * 展示练习结果和统计
 */

const ResultPage = {
    /**
     * 渲染结果页
     */
    render() {
        const result = JSON.parse(sessionStorage.getItem('practice_result') || '{}');

        if (!result.total) {
            return `
                <div class="fade-in text-center py-20">
                    <div class="text-6xl mb-6">🤔</div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-4">没有找到练习记录</h2>
                    <p class="text-xl text-gray-600 mb-8">请先完成一次练习</p>
                    <button onclick="router.navigate('practice-settings')"
                        class="btn-press bg-primary text-white px-8 py-4 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200">
                        去练习
                    </button>
                </div>
            `;
        }

        const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
        const isPerfect = accuracy === 100;

        // 计算圆环图参数
        const circumference = 2 * Math.PI * 90; // r=90
        const offset = circumference - (accuracy / 100) * circumference;

        return `
            <div class="fade-in max-w-2xl mx-auto">
                <!-- 结果标题 -->
                <div class="text-center mb-10">
                    <h2 class="text-4xl font-bold text-gray-800 mb-3">
                        ${isPerfect ? '🎉 太棒了！' : '✅ 练习完成'}
                    </h2>
                    <p class="text-xl text-gray-600">
                        ${isPerfect ? '全对！继续保持' : '做得好，继续加油'}
                    </p>
                </div>

                <!-- 结果卡片 -->
                <div class="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
                    <!-- 头部 -->
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-8 text-center">
                        <h3 class="text-2xl font-bold text-white mb-2">本次练习结果</h3>
                        <p class="text-blue-100">共完成 ${result.total} 道题目</p>
                    </div>

                    <!-- 内容 -->
                    <div class="p-8">
                        <!-- 正确率圆环图 -->
                        <div class="flex justify-center mb-10">
                            <div class="relative">
                                <svg width="200" height="200" class="transform -rotate-90">
                                    <!-- 背景圆环 -->
                                    <circle cx="100" cy="100" r="90"
                                        fill="none"
                                        stroke="#E5E7EB"
                                        stroke-width="16"/>
                                    <!-- 进度圆环 -->
                                    <circle cx="100" cy="100" r="90"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        stroke-width="16"
                                        stroke-linecap="round"
                                        stroke-dasharray="${circumference}"
                                        stroke-dashoffset="${offset}"
                                        class="transition-all duration-1000"/>
                                    <!-- 渐变色定义 -->
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stop-color="#3B82F6"/>
                                            <stop offset="100%" stop-color="#10B981"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <!-- 中心文字 -->
                                <div class="absolute inset-0 flex flex-col items-center justify-center">
                                    <span class="text-5xl font-bold text-gray-800">${accuracy}%</span>
                                    <span class="text-gray-500 mt-1">正确率</span>
                                </div>
                            </div>
                        </div>

                        <!-- 统计网格 -->
                        <div class="grid grid-cols-2 gap-6 mb-8">
                            <!-- 答对 -->
                            <div class="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-100">
                                <div class="text-4xl mb-2">✅</div>
                                <div class="text-3xl font-bold text-green-600 mb-1">${result.correct}</div>
                                <div class="text-green-700 font-medium">答对题数</div>
                            </div>

                            <!-- 答错 -->
                            <div class="bg-red-50 rounded-2xl p-6 text-center border-2 border-red-100">
                                <div class="text-4xl mb-2">❌</div>
                                <div class="text-3xl font-bold text-red-600 mb-1">${result.wrong}</div>
                                <div class="text-red-700 font-medium">答错题数</div>
                            </div>
                        </div>

                        <!-- 错题提示 -->
                        ${result.wrong > 0 ? `
                        <div class="bg-orange-50 rounded-2xl p-6 border-2 border-orange-100 mb-8">
                            <div class="flex items-start gap-4">
                                <span class="text-3xl">💡</span>
                                <div>
                                    <h4 class="font-bold text-orange-800 mb-2">错题提醒</h4>
                                    <p class="text-orange-700">
                                        你有 ${result.wrong} 道错题已记录到错题本，系统会在适当的时间提醒你复习。
                                    </p>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        <!-- 操作按钮 -->
                        <div class="space-y-4">
                            <button onclick="ResultPage.practiceAgain()"
                                class="btn-press w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-5 rounded-2xl text-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3">
                                <span>🔄</span>
                                <span>再练一次</span>
                            </button>

                            <button onclick="router.navigate('home')"
                                class="btn-press w-full bg-gray-100 text-gray-700 py-5 rounded-2xl text-xl font-bold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-3">
                                <span>🏠</span>
                                <span>返回首页</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 鼓励语 -->
                <div class="text-center mt-8">
                    <p class="text-xl text-gray-500 italic">
                        "${this.getEncouragement(accuracy)}"
                    </p>
                </div>
            </div>
        `;
    },

    /**
     * 获取鼓励语
     */
    getEncouragement(accuracy) {
        if (accuracy === 100) {
            const messages = [
                '完美！你的算术能力正在恢复！',
                '太棒了！保持这个状态！',
                '全对！你做得非常好！',
                '优秀！继续加油！'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        } else if (accuracy >= 80) {
            const messages = [
                '很好，再努力一点就能全对了！',
                '做得不错，继续保持！',
                '进步很大，再接再厉！',
                '你已经很棒了，继续练习！'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        } else if (accuracy >= 60) {
            const messages = [
                '加油，每天练习都会有进步！',
                '不要放弃，你正在进步！',
                '继续努力，你会越来越好的！',
                '每一次练习都是进步！'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                '没关系，慢慢来，不要给自己压力。',
                '康复需要时间，坚持下去就会看到改变。',
                '每次练习都是向前迈出的一步。',
                '相信自己，你可以做到的！'
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
    },

    /**
     * 再练一次
     */
    practiceAgain() {
        // 清除当前结果
        sessionStorage.removeItem('practice_result');

        // 使用相同配置重新开始
        const config = JSON.parse(sessionStorage.getItem('practice_config') || '{}');

        // 重新生成题目
        const questions = QuestionGenerator.generate({
            count: config.count || 5
        });

        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        router.navigate('practice-keypad');
    },

    /**
     * 初始化结果页
     */
    init() {
        const container = document.getElementById('page-container');
        container.innerHTML = this.render();

        // 清除键盘事件
        document.onkeydown = null;
    }
};
