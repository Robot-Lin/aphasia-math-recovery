/**
 * 练习设置页 - Apple 风格重构版
 * 局部更新，无页面刷新
 */

const PracticeSettingsPage = {
    config: {
        mode: 'keypad',
        difficulty: 'beginner',
        types: ['addition'],
        count: 5
    },

    // DOM 引用缓存
    elements: {},

    init() {
        this.resetConfig();
        this.render();
        this.bindKeyboard();
    },

    resetConfig() {
        this.config = {
            mode: 'keypad',
            difficulty: 'beginner',
            types: ['addition'],
            count: 5
        };
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        // 创建页面容器（只创建一次）
        const page = document.createElement('div');
        page.className = 'page-enter';
        page.style.cssText = `
            max-width: 640px;
            margin: 0 auto;
            padding: 40px 20px;
        `;

        // 标题
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 32px;';
        header.innerHTML = `
            <h1 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px; letter-spacing: -0.5px;">练习设置</h1>
            <p style="font-size: 17px; color: #8E8E93;">选择适合您的练习模式</p>
        `;
        page.appendChild(header);

        // 主卡片
        const card = document.createElement('div');
        card.className = 'glass card-hover';
        card.style.cssText = `
            border-radius: 24px;
            padding: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        `;

        // 卡片头部
        const cardHeader = document.createElement('div');
        cardHeader.style.cssText = `
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            border-radius: 20px;
            padding: 20px 24px;
            margin: 8px 8px 16px 8px;
            color: white;
        `;
        cardHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">⚙️</span>
                <span style="font-size: 20px; font-weight: 700;">当前配置</span>
            </div>
        `;
        card.appendChild(cardHeader);

        // 设置内容区域
        const content = document.createElement('div');
        content.style.cssText = 'padding: 8px 16px 16px 16px; display: flex; flex-direction: column; gap: 24px;';

        // 1. 答题模式
        this.elements.modeSection = this.createSection('答题模式');
        this.elements.modeGrid = this.createGrid(2);
        this.updateModeButtons();
        this.elements.modeSection.appendChild(this.elements.modeGrid);
        content.appendChild(this.elements.modeSection);

        // 2. 难度选择
        this.elements.diffSection = this.createSection('难度等级');
        this.elements.diffGrid = this.createGrid(3);
        this.updateDifficultyButtons();
        this.elements.diffSection.appendChild(this.elements.diffGrid);
        content.appendChild(this.elements.diffSection);

        // 3. 运算类型
        this.elements.typeSection = this.createSection('运算类型', '可多选');
        this.elements.typeGrid = this.createGrid(4);
        this.updateTypeButtons();
        this.elements.typeSection.appendChild(this.elements.typeGrid);

        // 错误提示
        this.elements.typeError = document.createElement('p');
        this.elements.typeError.style.cssText = 'color: #FF3B30; font-size: 13px; margin-top: 8px; display: none;';
        this.elements.typeError.textContent = '请至少选择一种运算类型';
        this.elements.typeSection.appendChild(this.elements.typeError);
        content.appendChild(this.elements.typeSection);

        // 4. 题量选择
        this.elements.countSection = this.createSection('题目数量');
        this.elements.countGrid = this.createGrid(4);
        this.updateCountButtons();
        this.elements.countSection.appendChild(this.elements.countGrid);
        content.appendChild(this.elements.countSection);

        // 5. 配置说明
        this.elements.infoCard = this.createInfoCard();
        this.updateInfoCard();
        content.appendChild(this.elements.infoCard);

        // 开始按钮
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.cssText = 'padding: 16px 8px 8px 8px;';

        const startBtn = DesignSystem.createPrimaryButton('开始练习', () => this.startPractice(), {
            icon: '🚀',
            size: 'large'
        });
        buttonWrapper.appendChild(startBtn);

        const hint = document.createElement('p');
        hint.style.cssText = 'text-align: center; color: #8E8E93; font-size: 13px; margin-top: 12px;';
        hint.textContent = '按 Enter 键快速开始';
        buttonWrapper.appendChild(hint);

        content.appendChild(buttonWrapper);
        card.appendChild(content);
        page.appendChild(card);
        container.appendChild(page);

        // 缓存引用
        this.elements.container = container;
        this.elements.page = page;
    },

    createSection(title, subtitle = '') {
        const section = document.createElement('div');
        const label = document.createElement('label');
        label.style.cssText = `
            display: block;
            font-size: 15px;
            font-weight: 600;
            color: #1C1C1E;
            margin-bottom: 12px;
        `;
        label.innerHTML = subtitle
            ? `${title} <span style="font-weight: 400; color: #8E8E93; margin-left: 4px;">(${subtitle})</span>`
            : title;
        section.appendChild(label);
        return section;
    },

    createGrid(columns) {
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: 12px;
        `;
        return grid;
    },

    createInfoCard() {
        const card = document.createElement('div');
        card.style.cssText = `
            background: rgba(0, 122, 255, 0.06);
            border-radius: 16px;
            padding: 16px 20px;
            border: 1px solid rgba(0, 122, 255, 0.15);
        `;
        return card;
    },

    // 更新模式按钮（局部更新）
    updateModeButtons() {
        this.elements.modeGrid.innerHTML = '';

        const modes = [
            { id: 'keypad', icon: '⌨️', label: '键盘输入', desc: '使用数字键盘' },
            { id: 'choice', icon: '🔘', label: '选择题', desc: '从选项中选择' }
        ];

        modes.forEach(mode => {
            const isActive = this.config.mode === mode.id;
            const btn = this.createOptionButton(mode.icon, mode.label, mode.desc, isActive, () => {
                this.selectMode(mode.id);
            });
            this.elements.modeGrid.appendChild(btn);
        });
    },

    // 更新难度按钮（局部更新）
    updateDifficultyButtons() {
        this.elements.diffGrid.innerHTML = '';

        const diffs = [
            { id: 'beginner', icon: '🌱', label: '初级' },
            { id: 'intermediate', icon: '🌿', label: '中级' },
            { id: 'advanced', icon: '🌳', label: '高级' }
        ];

        diffs.forEach(diff => {
            const isActive = this.config.difficulty === diff.id;
            const btn = this.createOptionButton(diff.icon, diff.label, '', isActive, () => {
                this.selectDifficulty(diff.id);
            });
            this.elements.diffGrid.appendChild(btn);
        });
    },

    // 更新类型按钮（局部更新）
    updateTypeButtons() {
        this.elements.typeGrid.innerHTML = '';

        const types = [
            { id: 'addition', icon: '➕', label: '加法' },
            { id: 'subtraction', icon: '➖', label: '减法' },
            { id: 'multiplication', icon: '✖️', label: '乘法' },
            { id: 'division', icon: '➗', label: '除法' }
        ];

        types.forEach(type => {
            const isActive = this.config.types.includes(type.id);
            const btn = this.createOptionButton(type.icon, type.label, '', isActive, () => {
                this.toggleType(type.id);
            });
            this.elements.typeGrid.appendChild(btn);
        });
    },

    // 更新题量按钮（局部更新）
    updateCountButtons() {
        this.elements.countGrid.innerHTML = '';

        [5, 10, 15, 20].forEach(count => {
            const isActive = this.config.count === count;
            const btn = this.createCountButton(count, isActive, () => {
                this.selectCount(count);
            });
            this.elements.countGrid.appendChild(btn);
        });
    },

    // 更新信息卡片（局部更新）
    updateInfoCard() {
        const typeNames = {
            addition: '加法', subtraction: '减法',
            multiplication: '乘法', division: '除法'
        };
        const diffNames = { beginner: '初级', intermediate: '中级', advanced: '高级' };

        const ranges = {
            addition: { beginner: '1-20', intermediate: '10-100', advanced: '100-500' },
            subtraction: { beginner: '1-20', intermediate: '10-100', advanced: '100-500' },
            multiplication: { beginner: '1-9', intermediate: '2-12', advanced: '10-20' },
            division: { beginner: '1-9', intermediate: '2-12', advanced: '2-20' }
        };

        const selectedTypes = this.config.types.map(t => typeNames[t]).join('、');

        let html = `
            <div style="font-size: 13px; color: #007AFF; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <span>ℹ️</span> 当前配置说明
            </div>
            <div style="font-size: 14px; color: #1C1C1E; line-height: 1.6;">
                <div>✓ 运算类型：${selectedTypes}</div>
                <div>✓ 难度等级：${diffNames[this.config.difficulty]}</div>
                <div>✓ 答题模式：${this.config.mode === 'keypad' ? '键盘输入' : '选择题'}</div>
                <div>✓ 题目数量：${this.config.count} 题</div>
            </div>
        `;

        // 显示每种运算的范围
        this.config.types.forEach(type => {
            const range = ranges[type]?.[this.config.difficulty];
            html += `<div style="font-size: 13px; color: #8E8E93; margin-left: 12px; margin-top: 4px;">• ${typeNames[type]}范围：${range}</div>`;
        });

        this.elements.infoCard.innerHTML = html;
    },

    createOptionButton(icon, label, desc, isActive, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            padding: 16px 12px;
            border-radius: 16px;
            border: 2px solid ${isActive ? '#007AFF' : 'rgba(120, 120, 128, 0.16)'};
            background: ${isActive ? 'rgba(0, 122, 255, 0.08)' : 'white'};
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        `;

        btn.innerHTML = `
            <span style="font-size: 28px; filter: ${isActive ? 'none' : 'grayscale(30%)'}; transition: filter 200ms;">${icon}</span>
            <span style="font-weight: 600; font-size: 14px; color: ${isActive ? '#007AFF' : '#1C1C1E'};">${label}</span>
            ${desc ? `<span style="font-size: 12px; color: #8E8E93;">${desc}</span>` : ''}
        `;

        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.32)';
                btn.style.background = 'rgba(120, 120, 128, 0.04)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.16)';
                btn.style.background = 'white';
            }
        });

        return btn;
    },

    createCountButton(count, isActive, onClick) {
        const btn = document.createElement('button');
        btn.className = 'btn-press';
        btn.style.cssText = `
            padding: 16px;
            border-radius: 16px;
            border: 2px solid ${isActive ? '#007AFF' : 'rgba(120, 120, 128, 0.16)'};
            background: ${isActive ? 'rgba(0, 122, 255, 0.08)' : 'white'};
            cursor: pointer;
            transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        btn.innerHTML = `
            <span style="font-size: 24px; font-weight: 700; color: ${isActive ? '#007AFF' : '#1C1C1E'};">${count}</span>
            <span style="font-size: 12px; color: #8E8E93;">题</span>
        `;

        btn.onclick = onClick;

        btn.addEventListener('mouseenter', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.32)';
                btn.style.background = 'rgba(120, 120, 128, 0.04)';
            }
        });

        btn.addEventListener('mouseleave', () => {
            if (!isActive) {
                btn.style.borderColor = 'rgba(120, 120, 128, 0.16)';
                btn.style.background = 'white';
            }
        });

        return btn;
    },

    // 选择操作（局部更新）
    selectMode(mode) {
        this.config.mode = mode;
        this.updateModeButtons();
        this.updateInfoCard();
    },

    selectDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.updateDifficultyButtons();
        this.updateInfoCard();
    },

    toggleType(type) {
        const index = this.config.types.indexOf(type);

        if (index > -1) {
            if (this.config.types.length > 1) {
                this.config.types.splice(index, 1);
                this.elements.typeError.style.display = 'none';
            }
        } else {
            this.config.types.push(type);
            this.elements.typeError.style.display = 'none';
        }

        this.updateTypeButtons();
        this.updateInfoCard();
    },

    selectCount(count) {
        this.config.count = count;
        this.updateCountButtons();
        this.updateInfoCard();
    },

    startPractice() {
        if (this.config.types.length === 0) {
            this.elements.typeError.style.display = 'block';
            this.elements.typeError.classList.add('shake');
            setTimeout(() => this.elements.typeError.classList.remove('shake'), 400);
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

    bindKeyboard() {
        document.onkeydown = (e) => {
            if (e.key === 'Enter') {
                this.startPractice();
            }
        };
    }
};
