/**
 * 历史记录页面 - Apple 风格
 * 查看过往练习记录
 */

const HistoryPage = {
    records: [],
    elements: {},

    init() {
        this.loadData();
        this.render();
    },

    loadData() {
        const userData = Storage.getUserData();
        // 将每日记录转换为数组并排序（最新的在前）
        this.records = Object.values(userData.dailyRecords || {})
            .sort((a, b) => b.date.localeCompare(a.date));
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.className = 'history-page';
        page.style.cssText = `
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        `;

        // 页面标题
        const header = document.createElement('div');
        header.className = 'history-header';
        header.style.cssText = 'text-align: center; margin-bottom: 32px;';
        header.innerHTML = `
            <h2 style="font-size: 32px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">历史记录</h2>
            <p style="font-size: 17px; color: #8E8E93;">回顾你的学习历程</p>
        `;
        page.appendChild(header);

        // 空状态
        if (this.records.length === 0) {
            this.renderEmptyState(page);
            container.appendChild(page);
            return;
        }

        // 统计概览
        this.elements.statsCard = this.createStatsCard();
        page.appendChild(this.elements.statsCard);

        // 记录列表
        this.elements.recordsList = this.createRecordsList();
        page.appendChild(this.elements.recordsList);

        container.appendChild(page);
    },

    renderEmptyState(page) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'glass';
        emptyCard.style.cssText = `
            border-radius: 24px;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        `;
        emptyCard.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 24px;">📊</div>
            <h3 style="font-size: 22px; font-weight: 600; color: #1C1C1E; margin-bottom: 8px;">暂无记录</h3>
            <p style="font-size: 17px; color: #8E8E93; margin-bottom: 32px;">完成第一次练习后，这里会显示你的学习记录</p>
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
                开始练习
            </button>
        `;
        page.appendChild(emptyCard);
    },

    createStatsCard() {
        const card = document.createElement('div');
        card.className = 'glass history-stats-card';
        card.style.cssText = `
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        `;

        // 计算统计数据
        const totalDays = this.records.length;
        const totalQuestions = this.records.reduce((sum, r) => sum + r.total, 0);
        const totalCorrect = this.records.reduce((sum, r) => sum + r.correct, 0);
        const avgAccuracy = totalQuestions > 0
            ? Math.round((totalCorrect / totalQuestions) * 100)
            : 0;

        // 计算连续练习天数
        const streakDays = this.calculateStreakDays();

        card.innerHTML = `
            <h3 style="font-size: 18px; font-weight: 700; color: #1C1C1E; margin-bottom: 20px;">
                📈 学习概览
            </h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;" class="stats-grid">
                <div style="text-align: center; padding: 16px; background: rgba(0, 122, 255, 0.06); border-radius: 12px;" class="stat-box">
                    <div style="font-size: 28px; font-weight: 700; color: #007AFF;" class="stat-value">${totalDays}</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">练习天数</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(52, 199, 89, 0.06); border-radius: 12px;" class="stat-box">
                    <div style="font-size: 28px; font-weight: 700; color: #34C759;" class="stat-value">${totalQuestions}</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">总题数</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(175, 82, 222, 0.06); border-radius: 12px;" class="stat-box">
                    <div style="font-size: 28px; font-weight: 700; color: #AF52DE;" class="stat-value">${avgAccuracy}%</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">平均正确率</div>
                </div>
                <div style="text-align: center; padding: 16px; background: rgba(255, 149, 0, 0.06); border-radius: 12px;" class="stat-box">
                    <div style="font-size: 28px; font-weight: 700; color: #FF9500;" class="stat-value">${streakDays}</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">连续练习</div>
                </div>
            </div>
        `;

        return card;
    },

    calculateStreakDays() {
        if (this.records.length === 0) return 0;

        let streak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // 检查今天或昨天是否有记录
        const hasRecentRecord = this.records.some(r => r.date === today || r.date === yesterday);
        if (!hasRecentRecord) return 0;

        // 计算连续天数
        let checkDate = new Date();
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const hasRecord = this.records.some(r => r.date === dateStr);
            if (hasRecord) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // 如果是今天没记录，检查昨天
                if (streak === 0 && dateStr === today) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        return streak;
    },

    createRecordsList() {
        const list = document.createElement('div');
        list.style.cssText = 'display: flex; flex-direction: column; gap: 16px;';

        // 按日期分组
        const grouped = this.groupByDate(this.records);

        grouped.forEach((group, index) => {
            const groupEl = this.createDateGroup(group, index);
            list.appendChild(groupEl);
        });

        return list;
    },

    groupByDate(records) {
        const groups = [];
        let currentMonth = '';

        records.forEach(record => {
            const month = record.date.substring(0, 7); // YYYY-MM
            if (month !== currentMonth) {
                currentMonth = month;
                groups.push({
                    month: month,
                    records: []
                });
            }
            groups[groups.length - 1].records.push(record);
        });

        return groups;
    },

    createDateGroup(group, index) {
        const container = document.createElement('div');
        container.style.cssText = `
            animation: fadeInUp 400ms ease forwards;
            animation-delay: ${index * 100}ms;
            opacity: 0;
        `;

        // 月份标题
        const monthTitle = document.createElement('div');
        monthTitle.style.cssText = `
            font-size: 15px;
            font-weight: 600;
            color: #8E8E93;
            margin-bottom: 12px;
            padding-left: 4px;
        `;
        monthTitle.textContent = this.formatMonth(group.month);
        container.appendChild(monthTitle);

        // 该月份的记录
        const recordsContainer = document.createElement('div');
        recordsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';

        group.records.forEach((record, rIndex) => {
            const item = this.createRecordItem(record, rIndex);
            recordsContainer.appendChild(item);
        });

        container.appendChild(recordsContainer);
        return container;
    },

    formatMonth(monthStr) {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    },

    createRecordItem(record, index) {
        const accuracy = record.total > 0
            ? Math.round((record.correct / record.total) * 100)
            : 0;

        const date = new Date(record.date);
        const today = new Date().toISOString().split('T')[0];
        const isToday = record.date === today;

        let dateLabel;
        if (isToday) {
            dateLabel = '今天';
        } else {
            dateLabel = date.toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
                weekday: 'short'
            });
        }

        const item = document.createElement('div');
        item.className = 'glass card-hover history-item';
        item.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
            cursor: pointer;
            transition: all 200ms ease;
        `;

        // 根据正确率设置颜色
        let accuracyColor = '#34C759'; // 绿色
        if (accuracy < 60) accuracyColor = '#FF3B30'; // 红色
        else if (accuracy < 80) accuracyColor = '#FF9500'; // 橙色

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;" class="info-row">
                <!-- 日期 -->
                <div style="
                    min-width: 64px;
                    text-align: center;
                    padding: 12px 8px;
                    background: ${isToday ? 'rgba(0, 122, 255, 0.08)' : 'rgba(120, 120, 128, 0.06)'};
                    border-radius: 12px;
                " class="date-box">
                    <div style="font-size: 20px; font-weight: 700; color: ${isToday ? '#007AFF' : '#1C1C1E'};" class="date-day">
                        ${date.getDate()}
                    </div>
                    <div style="font-size: 11px; color: #8E8E93; margin-top: 2px;">
                        ${dateLabel}
                    </div>
                </div>

                <!-- 统计信息 -->
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;" class="info-row">
                        <span style="font-size: 15px; color: #3C3C43;">
                            完成 <strong style="color: #1C1C1E;">${record.total}</strong> 题
                        </span>
                        <span style="font-size: 15px; color: #3C3C43;">
                            用时 <strong style="color: #1C1C1E;">${record.time || 0}</strong> 分钟
                        </span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="flex: 1; height: 6px; background: rgba(0, 0, 0, 0.06); border-radius: 3px; overflow: hidden;">
                            <div style="
                                width: ${accuracy}%;
                                height: 100%;
                                background: ${accuracyColor};
                                border-radius: 3px;
                                transition: width 400ms ease;
                            "></div>
                        </div>
                    </div>
                </div>

                <!-- 正确率 -->
                <div style="text-align: center; min-width: 60px;">
                    <div style="font-size: 24px; font-weight: 700; color: ${accuracyColor};" class="accuracy">${accuracy}%</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 2px;">
                        ${record.correct}/${record.total}
                    </div>
                </div>
            </div>
        `;

        item.onclick = () => this.showRecordDetail(record);

        return item;
    },

    showRecordDetail(record) {
        // 显示详细弹窗
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        `;

        const accuracy = record.total > 0
            ? Math.round((record.correct / record.total) * 100)
            : 0;

        let accuracyColor = '#34C759';
        if (accuracy < 60) accuracyColor = '#FF3B30';
        else if (accuracy < 80) accuracyColor = '#FF9500';

        modal.innerHTML = `
            <div class="glass modal-content" style="
                max-width: 400px;
                width: 100%;
                border-radius: 24px;
                padding: 32px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: pageEnter 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 48px; font-weight: 700; color: ${accuracyColor}; margin-bottom: 8px;">${accuracy}%</div>
                    <div style="font-size: 17px; color: #8E8E93;">${record.date} 练习详情</div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                    <div style="text-align: center; padding: 16px; background: rgba(52, 199, 89, 0.08); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #34C759;">${record.correct}</div>
                        <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">答对</div>
                    </div>
                    <div style="text-align: center; padding: 16px; background: rgba(255, 59, 48, 0.08); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #FF3B30;">${record.wrong}</div>
                        <div style="font-size: 13px; color: #8E8E93; margin-top: 4px;">答错</div>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="font-size: 15px; color: #3C3C43;">
                        总用时: <strong>${record.time || 0}</strong> 分钟
                    </div>
                </div>

                <button onclick="this.closest('.glass').parentElement.remove()"
                    class="btn-press"
                    style="
                        width: 100%;
                        background: #007AFF;
                        color: white;
                        padding: 16px;
                        border-radius: 12px;
                        font-size: 17px;
                        font-weight: 600;
                        border: none;
                        cursor: pointer;
                    ">
                    关闭
                </button>
            </div>
        `;

        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);
    }
};
