/**
 * 本地存储管理模块
 * 针对命名性失语症患者的算术康复练习工具
 */

const Storage = {
    // 存储键名
    KEYS: {
        USER_DATA: 'aphasia_math_user_data',
        CURRENT_USER: 'aphasia_math_current_user',
        MISTAKES: 'aphasia_math_mistakes',
        STATS: 'aphasia_math_stats',
        DAILY_RECORDS: 'aphasia_math_daily_records'
    },

    /**
     * 获取默认用户数据
     */
    getDefaultUserData() {
        return {
            id: 'default',
            name: '默认用户',
            createdAt: new Date().toISOString(),
            stats: {
                totalQuestions: 0,
                correctCount: 0,
                wrongCount: 0,
                practiceCount: 0,
                totalTime: 0, // 分钟
                streakDays: 0,
                lastPracticeDate: null
            },
            mistakes: [],
            skillProgress: {
                addition: { beginner: 0, intermediate: 0, advanced: 0 },
                subtraction: { beginner: 0, intermediate: 0, advanced: 0 },
                multiplication: { beginner: 0, intermediate: 0, advanced: 0 },
                division: { beginner: 0, intermediate: 0, advanced: 0 }
            },
            dailyRecords: {}
        };
    },

    /**
     * 获取数据
     * @param {string} key - 存储键名
     * @param {any} defaultValue - 默认值
     * @returns {any}
     */
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    /**
     * 保存数据
     * @param {string} key - 存储键名
     * @param {any} value - 要保存的数据
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    /**
     * 获取当前用户数据
     * @returns {Object}
     */
    getUserData() {
        const data = this.get(this.KEYS.USER_DATA);
        if (!data) {
            const defaultData = this.getDefaultUserData();
            this.set(this.KEYS.USER_DATA, defaultData);
            return defaultData;
        }
        return data;
    },

    /**
     * 保存用户数据
     * @param {Object} data - 用户数据
     */
    saveUserData(data) {
        return this.set(this.KEYS.USER_DATA, data);
    },

    /**
     * 更新统计数据
     * @param {Object} sessionStats - 练习统计数据
     */
    updateStats(sessionStats) {
        const userData = this.getUserData();
        const stats = userData.stats;

        // 更新基础统计
        stats.totalQuestions += sessionStats.total;
        stats.correctCount += sessionStats.correct;
        stats.wrongCount += sessionStats.wrong;
        stats.practiceCount += 1;
        stats.totalTime += sessionStats.time || 0;

        // 更新最后练习日期
        const today = new Date().toISOString().split('T')[0];
        const lastDate = stats.lastPracticeDate;

        if (lastDate !== today) {
            // 检查是否连续
            if (lastDate) {
                const last = new Date(lastDate);
                const now = new Date(today);
                const diffDays = (now - last) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    stats.streakDays += 1;
                } else {
                    stats.streakDays = 1;
                }
            } else {
                stats.streakDays = 1;
            }
            stats.lastPracticeDate = today;
        }

        // 更新每日记录
        if (!userData.dailyRecords[today]) {
            userData.dailyRecords[today] = {
                date: today,
                total: 0,
                correct: 0,
                wrong: 0,
                time: 0
            };
        }

        const dailyRecord = userData.dailyRecords[today];
        dailyRecord.total += sessionStats.total;
        dailyRecord.correct += sessionStats.correct;
        dailyRecord.wrong += sessionStats.wrong;
        dailyRecord.time += sessionStats.time || 0;

        this.saveUserData(userData);
        return userData;
    },

    /**
     * 添加错题
     * @param {Object} question - 题目对象
     * @param {number} userAnswer - 用户答案
     */
    addMistake(question, userAnswer) {
        const userData = this.getUserData();

        // 检查是否已存在
        const existingIndex = userData.mistakes.findIndex(
            m => m.question === question.question && m.type === question.type
        );

        const mistake = {
            id: existingIndex >= 0 ? userData.mistakes[existingIndex].id : Date.now().toString(),
            question: question.question,
            correctAnswer: question.answer,
            userAnswer: userAnswer,
            type: question.type,
            difficulty: question.difficulty,
            wrongCount: existingIndex >= 0 ? userData.mistakes[existingIndex].wrongCount + 1 : 1,
            correctCount: existingIndex >= 0 ? userData.mistakes[existingIndex].correctCount : 0,
            createdAt: existingIndex >= 0 ? userData.mistakes[existingIndex].createdAt : new Date().toISOString(),
            lastWrongAt: new Date().toISOString(),
            nextReviewDate: this.calculateNextReviewDate(0)
        };

        if (existingIndex >= 0) {
            userData.mistakes[existingIndex] = mistake;
        } else {
            userData.mistakes.push(mistake);
        }

        this.saveUserData(userData);
        return mistake;
    },

    /**
     * 记录错题答对
     * @param {string} mistakeId - 错题ID
     * @returns {boolean} - 是否已答对3次（可移除）
     */
    recordMistakeCorrect(mistakeId) {
        const userData = this.getUserData();
        const mistake = userData.mistakes.find(m => m.id === mistakeId);

        if (!mistake) return false;

        mistake.correctCount += 1;
        mistake.nextReviewDate = this.calculateNextReviewDate(mistake.correctCount);

        // 答对3次，从错题本移除
        if (mistake.correctCount >= 3) {
            userData.mistakes = userData.mistakes.filter(m => m.id !== mistakeId);
            this.saveUserData(userData);
            return true; // 已移除
        }

        this.saveUserData(userData);
        return false; // 未移除
    },

    /**
     * 计算下次复习日期（艾宾浩斯遗忘曲线）
     * @param {number} correctCount - 连续答对次数
     * @returns {string} - ISO 日期字符串
     */
    calculateNextReviewDate(correctCount) {
        const intervals = [1, 2, 4, 7, 15]; // 复习间隔天数
        const interval = intervals[Math.min(correctCount, intervals.length - 1)];

        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + interval);
        return nextDate.toISOString().split('T')[0];
    },

    /**
     * 获取今日待复习错题
     * @returns {Array}
     */
    getTodayReviewMistakes() {
        const userData = this.getUserData();
        const today = new Date().toISOString().split('T')[0];

        return userData.mistakes.filter(m => m.nextReviewDate <= today);
    },

    /**
     * 获取统计摘要（用于首页）
     * @returns {Object}
     */
    getStatsSummary() {
        const userData = this.getUserData();
        const stats = userData.stats;
        const todayMistakes = this.getTodayReviewMistakes();

        return {
            practiceCount: stats.practiceCount,
            reviewCount: todayMistakes.length,
            totalQuestions: stats.totalQuestions,
            accuracy: stats.totalQuestions > 0
                ? Math.round((stats.correctCount / stats.totalQuestions) * 100)
                : 0
        };
    },

    /**
     * 清除所有数据（重置）
     */
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
};

// 导出（浏览器环境直接使用全局变量）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}
