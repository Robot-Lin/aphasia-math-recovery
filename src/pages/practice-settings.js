/**
 * 练习设置页模块 - Phase 2 修复版
 */

const PracticeSettingsPage = {
    config: {
        mode: 'keypad',
        difficulty: 'beginner',
        types: ['addition'],
        count: 5
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        // 构建运算类型选择按钮
        const typeButtons = [
            { id: 'addition', icon: '➕', name: '加法' },
            { id: 'subtraction', icon: '➖', name: '减法' },
            { id: 'multiplication', icon: '✖️', name: '乘法' },
            { id: 'division', icon: '➗', name: '除法' }
        ].map(type => {
            const isActive = this.config.types.includes(type.id);
            return `
                <button id="type-${type.id}"
                    class="setting-option ${isActive ? 'setting-active' : ''}"
                    onclick="PracticeSettingsPage.toggleType('${type.id}')"
                    style="padding: 1rem; border: 2px solid ${isActive ? '#3B82F6' : '#E5E7EB'};
                           border-radius: 0.75rem; text-align: center; cursor: pointer;
                           background: ${isActive ? '#EFF6FF' : 'white'};">
                    <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">${type.icon}</div>
                    <div style="font-weight: bold;">${type.name}</div>
                </button>
            `;
        }).join('');

        // 构建题量按钮
        const countButtons = [5, 10, 15, 20].map(num => {
            const isActive = this.config.count === num;
            return `
                <button id="count-${num}"
                    class="setting-option ${isActive ? 'setting-active' : ''}"
                    onclick="PracticeSettingsPage.selectCount(${num})"
                    style="padding: 1rem; border: 2px solid ${isActive ? '#3B82F6' : '#E5E7EB'};
                           border-radius: 0.75rem; text-align: center; cursor: pointer;
                           background: ${isActive ? '#EFF6FF' : 'white'};">
                    <div style="font-size: 1.5rem; font-weight: bold;">${num}</div>
                    <div style="font-size: 0.875rem; color: #6B7280;">题</div>
                </button>
            `;
        }).join('');

        container.innerHTML = `
            <div class="fade-in" style="max-width: 42rem; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 2.5rem;">
                    <h2 style="font-size: 2.25rem; font-weight: bold; color: #1F2937; margin-bottom: 0.75rem;">练习设置</h2>
                    <p style="font-size: 1.25rem; color: #4B5563;">选择适合您的练习模式</p>
                </div>

                <div style="background: white; border-radius: 1.5rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1); border: 1px solid #E5E7EB; overflow: hidden;">
                    <div style="background: linear-gradient(to right, #3B82F6, #2563EB); padding: 1.5rem 2rem; color: white;">
                        <h3 style="font-size: 1.5rem; font-weight: bold; display: flex; align-items: center; gap: 0.75rem;">
                            <span>⚙️</span>
                            <span>当前配置</span>
                        </h3>
                    </div>

                    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">
                        <!-- 答题模式 -->
                        <div>
                            <label style="display: block; font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">答题模式</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <button onclick="PracticeSettingsPage.selectMode('keypad')"
                                    style="padding: 1rem; border: 2px solid ${this.config.mode === 'keypad' ? '#3B82F6' : '#E5E7EB'};
                                           border-radius: 0.75rem; text-align: center; cursor: pointer;
                                           background: ${this.config.mode === 'keypad' ? '#EFF6FF' : 'white'};">
                                    <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">⌨️</div>
                                    <div style="font-weight: bold;">键盘输入</div>
                                    <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">使用数字键盘</div>
                                </button>
                                <button onclick="PracticeSettingsPage.selectMode('choice')"
                                    style="padding: 1rem; border: 2px solid ${this.config.mode === 'choice' ? '#3B82F6' : '#E5E7EB'};
                                           border-radius: 0.75rem; text-align: center; cursor: pointer;
                                           background: ${this.config.mode === 'choice' ? '#EFF6FF' : 'white'};">
                                    <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">🔘</div>
                                    <div style="font-weight: bold;">选择题</div>
                                    <div style="font-size: 0.875rem; color: #6B7280; margin-top: 0.25rem;">从选项中选择</div>
                                </button>
                            </div>
                        </div>

                        <!-- 难度选择 -->
                        <div>
                            <label style="display: block; font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">难度等级</label>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                                ${[
                                    { id: 'beginner', icon: '🌱', name: '初级' },
                                    { id: 'intermediate', icon: '🌿', name: '中级' },
                                    { id: 'advanced', icon: '🌳', name: '高级' }
                                ].map(diff => `
                                    <button onclick="PracticeSettingsPage.selectDifficulty('${diff.id}')"
                                        style="padding: 1rem; border: 2px solid ${this.config.difficulty === diff.id ? '#3B82F6' : '#E5E7EB'};
                                               border-radius: 0.75rem; text-align: center; cursor: pointer;
                                               background: ${this.config.difficulty === diff.id ? '#EFF6FF' : 'white'};">
                                        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${diff.icon}</div>
                                        <div style="font-weight: bold;">${diff.name}</div>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- 运算类型 -->
                        <div>
                            <label style="display: block; font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">
                                运算类型 <span style="font-weight: normal; color: #6B7280; margin-left: 0.5rem;">（可多选）</span>
                            </label>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                                ${typeButtons}
                            </div>
                            <p id="type-error" style="color: #EF4444; font-size: 0.875rem; margin-top: 0.5rem; display: none;">请至少选择一种运算类型</p>
                        </div>

                        <!-- 题量选择 -->
                        <div>
                            <label style="display: block; font-size: 1.125rem; font-weight: bold; color: #374151; margin-bottom: 1rem;">题目数量</label>
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;">
                                ${countButtons}
                            </div>
                        </div>

                        <!-- 配置说明 -->
                        <div style="background: #EFF6FF; border-radius: 1rem; padding: 1.5rem; border: 2px solid #BFDBFE;">
                            <h4 style="font-size: 1.125rem; font-weight: bold; color: #1E40AF; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem;">
                                <span>ℹ️</span>
                                <span>当前配置说明</span>
                            </h4>
                            <div style="color: #1E40AF; line-height: 1.75;">
                                ${this.getDifficultyDescription()}
                            </div>
                        </div>
                    </div>

                    <div style="padding: 1.5rem 2rem; background: #F9FAFB; border-top: 1px solid #E5E7EB;">
                        <button onclick="PracticeSettingsPage.startPractice()"
                            style="width: 100%; background: linear-gradient(to right, #3B82F6, #2563EB); color: white;
                                   padding: 1.25rem; border-radius: 1rem; font-size: 1.5rem; font-weight: bold;
                                   border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
                                   display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                            <span>🚀</span>
                            <span>开始练习</span>
                        </button>
                        <p style="text-align: center; color: #9CA3AF; font-size: 0.875rem; margin-top: 1rem;">按 Enter 键快速开始</p>
                    </div>
                </div>
            </div>
        `;
    },

    getDifficultyDescription() {
        const typeNames = this.config.types.map(t => {
            const names = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };
            return names[t] || t;
        }).join('、');

        const diffNames = { beginner: '初级', intermediate: '中级', advanced: '高级' };
        const diffName = diffNames[this.config.difficulty] || this.config.difficulty;

        const ranges = {
            addition: { beginner: '1-20', intermediate: '10-100', advanced: '100-500' },
            subtraction: { beginner: '1-20', intermediate: '10-100', advanced: '100-500' },
            multiplication: { beginner: '1-9', intermediate: '2-12', advanced: '10-20' },
            division: { beginner: '1-9', intermediate: '2-12', advanced: '2-20' }
        };

        let desc = `
            <div style="margin-bottom: 0.5rem;">✓ 运算类型：${typeNames || '未选择'}</div>
            <div style="margin-bottom: 0.5rem;">✓ 难度等级：${diffName}</div>
            <div style="margin-bottom: 0.5rem;">✓ 答题模式：${this.config.mode === 'keypad' ? '键盘输入' : '选择题'}</div>
            <div style="margin-bottom: 0.5rem;">✓ 题目数量：${this.config.count} 题</div>
        `;

        this.config.types.forEach(type => {
            const typeNames = { addition: '加法', subtraction: '减法', multiplication: '乘法', division: '除法' };
            const range = ranges[type]?.[this.config.difficulty] || '';
            desc += `<div style="margin-left: 1rem; color: #3B82F6;">• ${typeNames[type]}范围：${range}</div>`;
        });

        return desc;
    },

    selectMode(mode) {
        this.config.mode = mode;
        this.render();
    },

    selectDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.render();
    },

    toggleType(type) {
        const index = this.config.types.indexOf(type);
        if (index > -1) {
            if (this.config.types.length > 1) {
                this.config.types.splice(index, 1);
            }
        } else {
            this.config.types.push(type);
        }
        this.render();
    },

    selectCount(count) {
        this.config.count = count;
        this.render();
    },

    startPractice() {
        if (this.config.types.length === 0) {
            const errorEl = document.getElementById('type-error');
            if (errorEl) errorEl.style.display = 'block';
            return;
        }

        sessionStorage.setItem('practice_config', JSON.stringify(this.config));

        let questions;
        if (this.config.types.length === 1) {
            questions = QuestionGenerator.generate({
                type: this.config.types[0],
                difficulty: this.config.difficulty,
                count: this.config.count
            });
        } else {
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

        if (this.config.mode === 'keypad') {
            router.navigate('practice-keypad');
        } else {
            router.navigate('practice-choice');
        }
    },

    init() {
        this.config = {
            mode: 'keypad',
            difficulty: 'beginner',
            types: ['addition'],
            count: 5
        };
        this.render();
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.startPractice();
            }
        };
    }
};
