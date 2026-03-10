/**
 * 结果页模块 - Apple 风格重构版
 * 展示练习结果和统计
 */

const ResultPage = {
    result: null,
    elements: {},

    init() {
        this.loadData();
        this.render();
    },

    loadData() {
        this.result = JSON.parse(sessionStorage.getItem('practice_result') || '{}');
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        // 无结果状态
        if (!this.result.total) {
            this.renderEmptyState(container);
            return;
        }

        const page = document.createElement('div');
        page.className = 'result-page';
        page.style.cssText = `
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        `;

        // 标题区域
        this.elements.header = this.createHeader();
        page.appendChild(this.elements.header);

        // 结果卡片
        this.elements.resultCard = this.createResultCard();
        page.appendChild(this.elements.resultCard);

        // 鼓励语
        const encouragement = document.createElement('div');
        encouragement.style.cssText = 'text-align: center; margin-top: 24px;';
        encouragement.innerHTML = `
            <p style="font-size: 17px; color: #8E8E93; font-style: italic;">
                "${this.getEncouragement(this.getAccuracy())}"
            </p>
        `;
        page.appendChild(encouragement);

        container.appendChild(page);

        // 触发圆环动画
        setTimeout(() => this.animateProgressRing(), 100);
    },

    renderEmptyState(container) {
        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 400px;
            margin: 80px auto;
            text-align: center;
            padding: 40px;
        `;

        page.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 24px;">🤔</div>
            <h2 style="font-size: 24px; font-weight: 700; color: #1C1C1E; margin-bottom: 12px;">没有找到练习记录</h2>
            <p style="font-size: 17px; color: #8E8E93; margin-bottom: 32px;">请先完成一次练习</p>
            <button onclick="router.navigate('practice-settings')"
                class="btn-press"
                style="
                    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
                    color: white;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-size: 17px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
                ">
                去练习
            </button>
        `;

        container.appendChild(page);
    },

    createHeader() {
        const accuracy = this.getAccuracy();
        const isPerfect = accuracy === 100;

        const header = document.createElement('div');
        header.className = 'result-header';
        header.style.cssText = 'text-align: center; margin-bottom: 32px;';
        header.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 16px;">${isPerfect ? '🎉' : '✅'}</div>
            <h2 style="font-size: 28px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">
                ${isPerfect ? '太棒了！' : '练习完成'}
            </h2>
            <p style="font-size: 17px; color: #8E8E93;">
                ${isPerfect ? '全对！继续保持' : '做得好，继续加油'}
            </p>
        `;

        return header;
    },

    createResultCard() {
        const accuracy = this.getAccuracy();
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (accuracy / 100) * circumference;

        const card = document.createElement('div');
        card.className = 'glass result-card';
        card.style.cssText = `
            border-radius: 24px;
            padding: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;

        // 卡片头部渐变区域
        const cardHeader = document.createElement('div');
        cardHeader.style.cssText = `
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            border-radius: 20px;
            padding: 24px;
            margin: 8px 8px 24px 8px;
            color: white;
            text-align: center;
        `;
        cardHeader.innerHTML = `
            <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">本次练习结果</h3>
            <p style="font-size: 15px; opacity: 0.9;">共完成 ${this.result.total} 道题目</p>
        `;
        card.appendChild(cardHeader);

        // 内容区域
        const content = document.createElement('div');
        content.style.cssText = 'padding: 0 16px 16px 16px;';

        // 正确率圆环图
        const ringContainer = document.createElement('div');
        ringContainer.className = 'result-ring';
        ringContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 32px;
        `;
        ringContainer.innerHTML = `
            <div style="position: relative; width: 200px; height: 200px;">
                <svg width="200" height="200" style="transform: rotate(-90deg);">
                    <circle cx="100" cy="100" r="90"
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.06)"
                        stroke-width="16"/>
                    <circle id="progress-ring" cx="100" cy="100" r="90"
                        fill="none"
                        stroke="url(#resultGradient)"
                        stroke-width="16"
                        stroke-linecap="round"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${circumference}"
                        style="transition: stroke-dashoffset 1s cubic-bezier(0.4, 0.0, 0.2, 1);"/>
                    <defs>
                        <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#007AFF"/>
                            <stop offset="100%" stop-color="#34C759"/>
                        </linearGradient>
                    </defs>
                </svg>
                <div style="
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                ">
                    <span id="accuracy-text" style="font-size: 48px; font-weight: 700; color: #1C1C1E;">0%</span>
                    <span style="font-size: 15px; color: #8E8E93; margin-top: 4px;">正确率</span>
                </div>
            </div>
        `;
        content.appendChild(ringContainer);

        // 统计网格
        const statsGrid = document.createElement('div');
        statsGrid.className = 'result-stats-grid';
        statsGrid.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
        `;
        statsGrid.innerHTML = `
            <div style="
                background: rgba(52, 199, 89, 0.08);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                border: 1px solid rgba(52, 199, 89, 0.15);
            ">
                <div style="font-size: 32px; margin-bottom: 4px;">✅</div>
                <div style="font-size: 28px; font-weight: 700; color: #34C759; margin-bottom: 4px;">${this.result.correct}</div>
                <div style="font-size: 13px; color: #30D158; font-weight: 500;">答对题数</div>
            </div>
            <div style="
                background: rgba(255, 59, 48, 0.08);
                border-radius: 16px;
                padding: 20px;
                text-align: center;
                border: 1px solid rgba(255, 59, 48, 0.15);
            ">
                <div style="font-size: 32px; margin-bottom: 4px;">❌</div>
                <div style="font-size: 28px; font-weight: 700; color: #FF3B30; margin-bottom: 4px;">${this.result.wrong}</div>
                <div style="font-size: 13px; color: #FF453A; font-weight: 500;">答错题数</div>
            </div>
        `;
        content.appendChild(statsGrid);

        // 错题提示
        if (this.result.wrong > 0) {
            const wrongTip = document.createElement('div');
            wrongTip.style.cssText = `
                background: rgba(255, 149, 0, 0.08);
                border-radius: 16px;
                padding: 16px 20px;
                border: 1px solid rgba(255, 149, 0, 0.15);
                margin-bottom: 24px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            `;
            wrongTip.innerHTML = `
                <span style="font-size: 24px;">💡</span>
                <div>
                    <h4 style="font-weight: 600; color: #FF9500; margin-bottom: 4px;">错题提醒</h4>
                    <p style="font-size: 14px; color: #FF9500; opacity: 0.8;">
                        你有 ${this.result.wrong} 道错题已记录到错题本
                    </p>
                </div>
            `;
            content.appendChild(wrongTip);
        }

        // 操作按钮
        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'result-buttons';
        buttonWrapper.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
        buttonWrapper.id = 'result-fixed-buttons';

        // 再练一次按钮
        const againBtn = document.createElement('button');
        againBtn.className = 'btn-press';
        againBtn.style.cssText = `
            background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
            color: white;
            padding: 16px;
            border-radius: 12px;
            font-size: 17px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;
        againBtn.innerHTML = '<span>🔄</span><span>再练一次</span>';
        againBtn.onclick = () => this.practiceAgain();
        buttonWrapper.appendChild(againBtn);

        // 返回首页按钮
        const homeBtn = document.createElement('button');
        homeBtn.className = 'btn-press';
        homeBtn.style.cssText = `
            background: rgba(120, 120, 128, 0.08);
            color: #1C1C1E;
            padding: 16px;
            border-radius: 12px;
            font-size: 17px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;
        homeBtn.innerHTML = '<span>🏠</span><span>返回首页</span>';
        homeBtn.onclick = () => router.navigate('home');
        buttonWrapper.appendChild(homeBtn);

        content.appendChild(buttonWrapper);
        card.appendChild(content);

        return card;
    },

    animateProgressRing() {
        const accuracy = this.getAccuracy();
        const circumference = 2 * Math.PI * 90;
        const offset = circumference - (accuracy / 100) * circumference;

        const ring = document.getElementById('progress-ring');
        const text = document.getElementById('accuracy-text');

        if (ring) {
            ring.style.strokeDashoffset = offset;
        }

        // 数字动画
        if (text) {
            let current = 0;
            const duration = 1000;
            const step = accuracy / (duration / 16);

            const animate = () => {
                current += step;
                if (current < accuracy) {
                    text.textContent = Math.round(current) + '%';
                    requestAnimationFrame(animate);
                } else {
                    text.textContent = accuracy + '%';
                }
            };

            animate();
        }
    },

    getAccuracy() {
        if (!this.result.total) return 0;
        return Math.round((this.result.correct / this.result.total) * 100);
    },

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

    practiceAgain() {
        sessionStorage.removeItem('practice_result');
        const config = JSON.parse(sessionStorage.getItem('practice_config') || '{}');

        let questions;
        if (config.types && config.types.length === 1) {
            questions = QuestionGenerator.generate({
                type: config.types[0],
                difficulty: config.difficulty,
                count: config.count || 5
            });
        } else {
            questions = QuestionGenerator.generateMixed(
                config.types || ['addition'],
                config.difficulty,
                config.count || 5
            );
        }

        sessionStorage.setItem('practice_questions', JSON.stringify(questions));
        sessionStorage.setItem('practice_current', '0');
        sessionStorage.setItem('practice_answers', JSON.stringify([]));
        sessionStorage.setItem('practice_start_time', Date.now().toString());

        if (config.mode === 'choice') {
            router.navigate('practice-choice');
        } else {
            router.navigate('practice-keypad');
        }
    }
};

// 清除旧的全局变量定义（如果存在）
if (typeof ResultPage !== 'undefined') {
    window.ResultPage = ResultPage;
}
