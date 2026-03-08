/**
 * 题目生成器模块 - Phase 2 完整版
 * 支持4种运算 × 3级难度
 */

const QuestionGenerator = {
    /**
     * 生成随机整数
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 打乱数组顺序
     */
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },

    /**
     * 生成加法题目
     * @param {string} difficulty - 难度：beginner/intermediate/advanced
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateAddition(difficulty, count) {
        const ranges = {
            beginner: { min: 1, max: 20 },      // 初级：1-20
            intermediate: { min: 10, max: 100 }, // 中级：10-100
            advanced: { min: 100, max: 500 }     // 高级：100-500
        };

        const range = ranges[difficulty];
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            let a, b, answer;

            if (difficulty === 'beginner') {
                // 初级：简单加法，和不超过范围
                a = this.randomInt(range.min, range.max - 5);
                b = this.randomInt(range.min, range.max - a);
            } else {
                // 中高级：两位数加法
                a = this.randomInt(range.min, range.max);
                b = this.randomInt(range.min, range.max);
            }

            answer = a + b;

            // 检查重复
            const key = `${a}+${b}`;
            if (used.has(key)) continue;
            used.add(key);

            questions.push({
                id: `add_${Date.now()}_${questions.length}`,
                question: `${a} + ${b} = ?`,
                display: `${a} + ${b}`,
                a: a,
                b: b,
                operator: '+',
                answer: answer,
                type: 'addition',
                difficulty: difficulty,
                range: `${range.min}-${range.max}`
            });
        }

        return questions;
    },

    /**
     * 生成减法题目
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateSubtraction(difficulty, count) {
        const ranges = {
            beginner: { min: 1, max: 20 },
            intermediate: { min: 10, max: 100 },
            advanced: { min: 100, max: 500 }
        };

        const range = ranges[difficulty];
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            let a, b, answer;

            if (difficulty === 'beginner') {
                // 初级：结果不为负的简单减法
                a = this.randomInt(5, range.max);
                b = this.randomInt(1, a); // b < a，确保结果为正
            } else {
                // 中高级：可能涉及借位
                a = this.randomInt(range.min, range.max);
                b = this.randomInt(range.min, range.max);
                // 确保被减数大于减数，结果不为负
                if (a < b) [a, b] = [b, a];
            }

            answer = a - b;

            const key = `${a}-${b}`;
            if (used.has(key)) continue;
            used.add(key);

            questions.push({
                id: `sub_${Date.now()}_${questions.length}`,
                question: `${a} - ${b} = ?`,
                display: `${a} - ${b}`,
                a: a,
                b: b,
                operator: '-',
                answer: answer,
                type: 'subtraction',
                difficulty: difficulty,
                range: `${range.min}-${range.max}`
            });
        }

        return questions;
    },

    /**
     * 生成乘法题目
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateMultiplication(difficulty, count) {
        const ranges = {
            beginner: { min: 1, max: 9 },       // 初级：表内乘法
            intermediate: { min: 2, max: 12 },  // 中级：扩展到12
            advanced: { min: 10, max: 20 }      // 高级：两位数乘法
        };

        const range = ranges[difficulty];
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            const a = this.randomInt(range.min, range.max);
            const b = this.randomInt(range.min, range.max);
            const answer = a * b;

            const key = `${a}×${b}`;
            if (used.has(key)) continue;
            used.add(key);

            questions.push({
                id: `mul_${Date.now()}_${questions.length}`,
                question: `${a} × ${b} = ?`,
                display: `${a} × ${b}`,
                a: a,
                b: b,
                operator: '×',
                answer: answer,
                type: 'multiplication',
                difficulty: difficulty,
                range: `${range.min}-${range.max}`
            });
        }

        return questions;
    },

    /**
     * 生成除法题目
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateDivision(difficulty, count) {
        const ranges = {
            beginner: { min: 1, max: 9 },       // 初级：表内除法
            intermediate: { min: 2, max: 12 },  // 中级：扩展到12
            advanced: { min: 2, max: 20 }       // 高级：更复杂的除法
        };

        const range = ranges[difficulty];
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            // 先生成乘法，再反推除法，确保整除
            const b = this.randomInt(range.min, range.max);
            const answer = this.randomInt(range.min, range.max);
            const a = b * answer; // 被除数

            const key = `${a}÷${b}`;
            if (used.has(key)) continue;
            used.add(key);

            questions.push({
                id: `div_${Date.now()}_${questions.length}`,
                question: `${a} ÷ ${b} = ?`,
                display: `${a} ÷ ${b}`,
                a: a,
                b: b,
                operator: '÷',
                answer: answer,
                type: 'division',
                difficulty: difficulty,
                range: `${range.min}-${range.max}`
            });
        }

        return questions;
    },

    /**
     * 生成指定数量和类型的题目
     * @param {Object} config - 配置对象
     * @returns {Array}
     */
    generate(config = {}) {
        const {
            type = 'addition',
            difficulty = 'beginner',
            count = 5
        } = config;

        let questions = [];

        switch (type) {
            case 'addition':
                questions = this.generateAddition(difficulty, count);
                break;
            case 'subtraction':
                questions = this.generateSubtraction(difficulty, count);
                break;
            case 'multiplication':
                questions = this.generateMultiplication(difficulty, count);
                break;
            case 'division':
                questions = this.generateDivision(difficulty, count);
                break;
            default:
                questions = this.generateAddition(difficulty, count);
        }

        return questions;
    },

    /**
     * 生成混合类型的题目
     * @param {Array} types - 运算类型数组
     * @param {string} difficulty - 难度
     * @param {number} count - 总题目数
     * @returns {Array}
     */
    generateMixed(types, difficulty, count) {
        const questions = [];
        const countPerType = Math.floor(count / types.length);
        const remainder = count % types.length;

        types.forEach((type, index) => {
            const typeCount = countPerType + (index < remainder ? 1 : 0);
            const typeQuestions = this.generate({
                type,
                difficulty,
                count: typeCount
            });
            questions.push(...typeQuestions);
        });

        // 打乱顺序
        return this.shuffle(questions);
    },

    /**
     * 生成选择题的干扰项
     * @param {number} correctAnswer - 正确答案
     * @param {number} count - 干扰项数量（默认3个）
     * @returns {Array}
     */
    generateDistractors(correctAnswer, count = 3) {
        const distractors = new Set();

        while (distractors.size < count) {
            let wrong;
            const strategy = Math.random();

            if (strategy < 0.33) {
                // 策略1：±1 到 ±5
                wrong = correctAnswer + this.randomInt(-5, 5);
            } else if (strategy < 0.66) {
                // 策略2：±10
                wrong = correctAnswer + this.randomInt(-2, 2) * 10;
            } else {
                // 策略3：数字交换（如 12+34=46，干扰项 21+34=55 或 12+43=55）
                wrong = correctAnswer + this.randomInt(-20, 20);
            }

            // 确保不为负数，且不等于正确答案
            if (wrong >= 0 && wrong !== correctAnswer) {
                distractors.add(wrong);
            }
        }

        return Array.from(distractors);
    },

    /**
     * 验证答案
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
     */
    getDifficultyName(difficulty) {
        const names = {
            'beginner': '初级',
            'intermediate': '中级',
            'advanced': '高级'
        };
        return names[difficulty] || difficulty;
    },

    /**
     * 获取难度数字范围说明
     */
    getDifficultyRange(type, difficulty) {
        const ranges = {
            addition: {
                beginner: '1-20',
                intermediate: '10-100',
                advanced: '100-500'
            },
            subtraction: {
                beginner: '1-20',
                intermediate: '10-100',
                advanced: '100-500'
            },
            multiplication: {
                beginner: '1-9',
                intermediate: '2-12',
                advanced: '10-20'
            },
            division: {
                beginner: '1-9',
                intermediate: '2-12',
                advanced: '2-20'
            }
        };
        return ranges[type]?.[difficulty] || '';
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionGenerator;
}
