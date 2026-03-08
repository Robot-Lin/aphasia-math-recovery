/**
 * 题目生成器模块
 * 针对命名性失语症患者的算术康复练习
 * Phase 1: 仅支持加法初级难度
 */

const QuestionGenerator = {
    /**
     * 生成随机整数
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {number}
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Phase 1: 生成加法题目（初级难度：1-20）
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateAdditionBeginner(count = 5) {
        const questions = [];
        const used = new Set(); // 避免重复题目

        while (questions.length < count) {
            // 初级难度：1-20 范围
            const a = this.randomInt(1, 20);
            const b = this.randomInt(1, 20);
            const answer = a + b;

            // 题目唯一标识
            const key = `${a}+${b}`;
            if (used.has(key)) continue;
            used.add(key);

            questions.push({
                id: Date.now() + questions.length,
                question: `${a} + ${b} = ?`,
                display: `${a} + ${b}`,
                a: a,
                b: b,
                operator: '+',
                answer: answer,
                type: 'addition',
                difficulty: 'beginner',
                range: '1-20'
            });
        }

        return questions;
    },

    /**
     * 生成指定数量的题目（Phase 1 简化版）
     * @param {Object} config - 配置对象
     * @returns {Array}
     */
    generate(config = {}) {
        const { count = 5 } = config;

        // Phase 1 仅支持加法初级
        return this.generateAdditionBeginner(count);
    },

    /**
     * 验证答案（允许数字或字符串）
     * @param {number} userAnswer - 用户答案
     * @param {number} correctAnswer - 正确答案
     * @returns {boolean}
     */
    checkAnswer(userAnswer, correctAnswer) {
        const user = parseInt(userAnswer, 10);
        const correct = parseInt(correctAnswer, 10);
        return !isNaN(user) && user === correct;
    },

    /**
     * 获取题目类型中文名
     * @param {string} type - 类型标识
     * @returns {string}
     */
    getTypeName(type) {
        const names = {
            'addition': '加法',
            'subtraction': '减法',
            'multiplication': '乘法',
            'division': '除法'
        };
        return names[type] || type;
    },

    /**
     * 获取难度中文名
     * @param {string} difficulty - 难度标识
     * @returns {string}
     */
    getDifficultyName(difficulty) {
        const names = {
            'beginner': '初级',
            'intermediate': '中级',
            'advanced': '高级'
        };
        return names[difficulty] || difficulty;
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionGenerator;
}
