/**
 * 题目生成器模块 - Phase 2 完整版
 * 支持4种运算 × 6级难度（与挑战模式一致）
 */

const QuestionGenerator = {
    /**
     * 难度配置 - 与挑战模式保持一致
     */
    difficultyConfig: {
        level1: { name: '入门', digitsA: 1, digitsB: 1, minA: 1, minB: 1 },
        level2: { name: '进阶', digitsA: 1, digitsB: 2, minA: 1, minB: 10 },
        level3: { name: '熟练', digitsA: 1, digitsB: 3, minA: 1, minB: 100 },
        level4: { name: '高手', digitsA: 2, digitsB: 2, minA: 10, minB: 10 },
        level5: { name: '专家', digitsA: 2, digitsB: 3, minA: 10, minB: 100 },
        level6: { name: '大师', digitsA: 3, digitsB: 3, minA: 100, minB: 100 }
    },

    /**
     * 生成随机整数
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 根据位数生成数字
     */
    generateNumber(digits, min) {
        const max = Math.pow(10, digits) - 1;
        return this.randomInt(min, max);
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
     * 获取6级难度配置对应的数字范围（向后兼容）
     */
    getLegacyDifficulty(difficulty) {
        const mapping = {
            level1: 'beginner',
            level2: 'beginner',
            level3: 'intermediate',
            level4: 'intermediate',
            level5: 'advanced',
            level6: 'advanced'
        };
        return mapping[difficulty] || 'beginner';
    },

    /**
     * 生成加法题目 - 支持6级难度
     * @param {string} difficulty - 难度：level1-level6
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateAddition(difficulty, count) {
        // 如果是旧版难度，转换为新版
        const legacyDiffs = ['beginner', 'intermediate', 'advanced'];
        if (legacyDiffs.includes(difficulty)) {
            const mapping = { beginner: 'level1', intermediate: 'level3', advanced: 'level5' };
            difficulty = mapping[difficulty];
        }

        const config = this.difficultyConfig[difficulty] || this.difficultyConfig.level1;
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            const a = this.generateNumber(config.digitsA, config.minA);
            const b = this.generateNumber(config.digitsB, config.minB);
            const answer = a + b;

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
                range: `${config.digitsA}位+${config.digitsB}位`
            });
        }

        return questions;
    },

    /**
     * 生成减法题目 - 支持6级难度
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateSubtraction(difficulty, count) {
        // 如果是旧版难度，转换为新版
        const legacyDiffs = ['beginner', 'intermediate', 'advanced'];
        if (legacyDiffs.includes(difficulty)) {
            const mapping = { beginner: 'level1', intermediate: 'level3', advanced: 'level5' };
            difficulty = mapping[difficulty];
        }

        const config = this.difficultyConfig[difficulty] || this.difficultyConfig.level1;
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            let a = this.generateNumber(config.digitsA, config.minA);
            let b = this.generateNumber(config.digitsB, config.minB);

            // 确保被减数大于减数，结果不为负
            if (a < b) [a, b] = [b, a];

            const answer = a - b;

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
                range: `${config.digitsA}位-${config.digitsB}位`
            });
        }

        return questions;
    },

    /**
     * 生成乘法题目 - 支持6级难度
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateMultiplication(difficulty, count) {
        // 如果是旧版难度，转换为新版
        const legacyDiffs = ['beginner', 'intermediate', 'advanced'];
        if (legacyDiffs.includes(difficulty)) {
            const mapping = { beginner: 'level1', intermediate: 'level3', advanced: 'level5' };
            difficulty = mapping[difficulty];
        }

        // 乘法难度配置
        const multConfig = {
            level1: { minA: 1, maxA: 9, minB: 1, maxB: 9 },      // 表内乘法
            level2: { minA: 2, maxA: 9, minB: 10, maxB: 99 },    // 个位×两位
            level3: { minA: 2, maxA: 9, minB: 100, maxB: 999 },  // 个位×三位
            level4: { minA: 10, maxA: 99, minB: 10, maxB: 99 },  // 两位×两位
            level5: { minA: 10, maxA: 99, minB: 100, maxB: 999 },// 两位×三位
            level6: { minA: 100, maxA: 999, minB: 100, maxB: 999 }// 三位×三位
        };

        const config = multConfig[difficulty] || multConfig.level1;
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            const a = this.randomInt(config.minA, config.maxA);
            const b = this.randomInt(config.minB, config.maxB);
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
                range: `${config.minA}-${config.maxA} × ${config.minB}-${config.maxB}`
            });
        }

        return questions;
    },

    /**
     * 生成除法题目 - 支持6级难度
     * @param {string} difficulty - 难度
     * @param {number} count - 题目数量
     * @returns {Array}
     */
    generateDivision(difficulty, count) {
        // 如果是旧版难度，转换为新版
        const legacyDiffs = ['beginner', 'intermediate', 'advanced'];
        if (legacyDiffs.includes(difficulty)) {
            const mapping = { beginner: 'level1', intermediate: 'level3', advanced: 'level5' };
            difficulty = mapping[difficulty];
        }

        // 除法难度配置（通过乘法反推，确保整除）
        const divConfig = {
            level1: { minA: 1, maxA: 9, minB: 1, maxB: 9 },      // 表内除法
            level2: { minA: 2, maxA: 9, minB: 10, maxB: 99 },    // 两位÷个位
            level3: { minA: 2, maxA: 9, minB: 100, maxB: 999 },  // 三位÷个位
            level4: { minA: 10, maxA: 99, minB: 10, maxB: 99 },  // 两位÷两位
            level5: { minA: 10, maxA: 99, minB: 100, maxB: 999 },// 三位÷两位
            level6: { minA: 100, maxA: 999, minB: 100, maxB: 999 }// 三位÷三位
        };

        const config = divConfig[difficulty] || divConfig.level1;
        const questions = [];
        const used = new Set();

        while (questions.length < count) {
            // 先生成除数和商，再计算被除数，确保整除
            const b = this.randomInt(config.minA, config.maxA); // 除数
            const answer = this.randomInt(config.minB, config.maxB); // 商
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
                range: `${config.minA}-${config.maxA} 除数, ${config.minB}-${config.maxB} 商`
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
            difficulty = 'level1',
            count = 10
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
     * 生成混合难度的题目
     * @param {Array} types - 运算类型数组
     * @param {Array} difficulties - 难度数组
     * @param {number} count - 总题目数
     * @returns {Array}
     */
    generateMixedDifficulties(types, difficulties, count) {
        const questions = [];

        // 计算每种难度应该生成的题目数量
        const countPerDifficulty = Math.floor(count / difficulties.length);
        const remainder = count % difficulties.length;

        // 为每种难度生成题目
        difficulties.forEach((difficulty, index) => {
            const diffCount = countPerDifficulty + (index < remainder ? 1 : 0);

            // 在当前难度下生成混合类型的题目
            const countPerType = Math.floor(diffCount / types.length);
            const typeRemainder = diffCount % types.length;

            types.forEach((type, typeIndex) => {
                const typeCount = countPerType + (typeIndex < typeRemainder ? 1 : 0);
                if (typeCount > 0) {
                    const typeQuestions = this.generate({
                        type,
                        difficulty,
                        count: typeCount
                    });
                    questions.push(...typeQuestions);
                }
            });
        });

        // 打乱顺序
        return this.shuffle(questions);
    },
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
            'level1': '入门',
            'level2': '进阶',
            'level3': '熟练',
            'level4': '高手',
            'level5': '专家',
            'level6': '大师',
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
        // 如果是新版难度，转换为描述
        if (this.difficultyConfig[difficulty]) {
            const config = this.difficultyConfig[difficulty];
            if (type === 'multiplication' || type === 'division') {
                const multDesc = {
                    level1: '1-9 × 1-9',
                    level2: '1-9 × 10-99',
                    level3: '1-9 × 100-999',
                    level4: '10-99 × 10-99',
                    level5: '10-99 × 100-999',
                    level6: '100-999 × 100-999'
                };
                return multDesc[difficulty] || config.desc;
            }
            return config.desc;
        }

        // 旧版兼容
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
