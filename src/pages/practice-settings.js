/**
 * 练习设置页 - Apple 风格重构版
 * 局部更新，无页面刷新
 */

const PracticeSettingsPage = {
    config: {
        mode: 'choice',
        difficulty: 'level1',
        types: ['addition', 'subtraction'],
        count: 10
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
            mode: 'choice',
            difficulty: 'level1',
            types: ['addition', 'subtraction'],
            count: 10
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
            max-width: 900px;
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
        card.className = 'glass card-hover practice-settings-card';
        card.style.cssText = `
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        `;

        // 设置内容区域 - 左右两栏布局
        const content = document.createElement('div');
        content.className = 'practice-settings-content';
        content.style.cssText = 'padding: 8px 16px 16px 16px;';

        // 创建左右两栏容器
        const mainGrid = document.createElement('div');
        mainGrid.className = 'practice-settings-grid';
        mainGrid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 24px;
        `;

        // 左栏：答题模式 + 难度等级
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'display: flex; flex-direction: column; gap: 20px;';

        // 1. 答题模式
        this.elements.modeSection = this.createSection('答题模式');
        this.elements.modeGrid = this.createGrid(2, 'mode-grid');
        this.updateModeButtons();
        this.elements.modeSection.appendChild(this.elements.modeGrid);
        leftColumn.appendChild(this.elements.modeSection);

        // 2. 难度选择
        this.elements.diffSection = this.createSection('难度等级');
        this.elements.diffSection.style.cssText += 'min-width: 0;';
        this.elements.diffGrid = this.createGrid(3, 'diff-grid');
        this.updateDifficultyButtons();
        this.elements.diffSection.appendChild(this.elements.diffGrid);
        leftColumn.appendChild(this.elements.diffSection);

        // 右栏：运算类型 + 题目数量
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'display: flex; flex-direction: column; gap: 20px;';

        // 3. 运算类型
        this.elements.typeSection = this.createSection('运算类型', '可多选');
        this.elements.typeGrid = this.createGrid(2, 'type-grid');
        this.updateTypeButtons();
        this.elements.typeSection.appendChild(this.elements.typeGrid);

        // 错误提示
        this.elements.typeError = document.createElement('p');
        this.elements.typeError.style.cssText = 'color: #FF3B30; font-size: 13px; margin-top: 8px; display: none;';
        this.elements.typeError.textContent = '请至少选择一种运算类型';
        this.elements.typeSection.appendChild(this.elements.typeError);
        rightColumn.appendChild(this.elements.typeSection);

        // 4. 题量选择
        this.elements.countSection = this.createSection('题目数量');
        this.elements.countGrid = this.createGrid(4, 'count-grid');
        this.updateCountButtons();
        this.elements.countSection.appendChild(this.elements.countGrid);
        rightColumn.appendChild(this.elements.countSection);

        // 添加到主网格
        mainGrid.appendChild(leftColumn);
        mainGrid.appendChild(rightColumn);
        content.appendChild(mainGrid);

        // 开始按钮 - 创建固定底部的按钮
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'practice-button-wrapper';
        buttonWrapper.id = 'practice-fixed-button';
        buttonWrapper.style.cssText = 'padding: 16px 8px 8px 8px;';

        const startBtn = DesignSystem.createPrimaryButton('开始练习', () => this.startPractice(), {
            icon: '🚀',
            size: 'large'
        });
        startBtn.className = 'practice-start-btn';
        buttonWrapper.appendChild(startBtn);

        const hint = document.createElement('p');
        hint.style.cssText = 'text-align: center; color: #8E8E93; font-size: 13px; margin-top: 12px;';
        hint.textContent = '按 Enter 键快速开始';
        buttonWrapper.appendChild(hint);

        // 将按钮直接添加到 body，确保相对于视口固定
        document.body.appendChild(buttonWrapper);

        // 缓存引用，用于后续清理
        this.elements.fixedButton = buttonWrapper;

        // 不添加到 content，避免重复
        // content.appendChild(buttonWrapper.cloneNode(true));
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

    createGrid(columns, className = '') {
        const grid = document.createElement('div');
        grid.className = className;
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: 12px;
        `;
        return grid;
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

    // 更新难度按钮（局部更新）- 使用挑战模式相同的6级难度
    updateDifficultyButtons() {
        this.elements.diffGrid.innerHTML = '';

        const diffs = [
            { id: 'level1', icon: '🌱', label: '入门', desc: '1位+1位' },
            { id: 'level2', icon: '🌿', label: '进阶', desc: '1位+2位' },
            { id: 'level3', icon: '🍃', label: '熟练', desc: '1位+3位' },
            { id: 'level4', icon: '🌳', label: '高手', desc: '2位+2位' },
            { id: 'level5', icon: '🏔️', label: '专家', desc: '2位+3位' },
            { id: 'level6', icon: '⭐', label: '大师', desc: '3位+3位' }
        ];

        diffs.forEach(diff => {
            const isActive = this.config.difficulty === diff.id;
            const btn = this.createOptionButton(diff.icon, diff.label, diff.desc, isActive, () => {
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
    },

    selectDifficulty(difficulty) {
        this.config.difficulty = difficulty;
        this.updateDifficultyButtons();
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
    },

    selectCount(count) {
        this.config.count = count;
        this.updateCountButtons();
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
