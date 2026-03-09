/**
 * 设置页面 - Apple 风格
 * 音效开关、数据管理、关于信息
 */

const SettingsPage = {
    elements: {},

    init() {
        this.render();
        this.bindEvents();
    },

    render() {
        const container = document.getElementById('page-container');
        if (!container) return;

        container.innerHTML = '';

        const page = document.createElement('div');
        page.style.cssText = `
            max-width: 1000px;
            margin: 0 auto;
            padding: 16px 24px;
        `;

        // 页面标题
        const header = document.createElement('div');
        header.style.cssText = 'text-align: center; margin-bottom: 24px;';
        header.innerHTML = `
            <h2 style="font-size: 28px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">设置</h2>
            <p style="font-size: 15px; color: #8E8E93;">自定义你的练习体验</p>
        `;
        page.appendChild(header);

        // 设置内容网格
        const settingsGrid = document.createElement('div');
        settingsGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        `;

        // 左侧列
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
        leftColumn.appendChild(this.createSectionTitle('音效设置'));
        leftColumn.appendChild(this.createSoundSettings());
        leftColumn.appendChild(this.createSectionTitle('首页显示'));
        leftColumn.appendChild(this.createDisplaySettings());
        settingsGrid.appendChild(leftColumn);

        // 右侧列
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
        rightColumn.appendChild(this.createSectionTitle('数据管理'));
        rightColumn.appendChild(this.createDataManagement());
        rightColumn.appendChild(this.createSectionTitle('关于'));
        rightColumn.appendChild(this.createAboutSection());
        settingsGrid.appendChild(rightColumn);

        page.appendChild(settingsGrid);

        container.appendChild(page);
    },

    createSectionTitle(title) {
        const el = document.createElement('div');
        el.style.cssText = `
            font-size: 12px;
            font-weight: 600;
            color: #8E8E93;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 16px 0 8px 12px;
        `;
        el.textContent = title;
        return el;
    },

    createSoundSettings() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const settings = [
            {
                id: 'sound-keypress',
                icon: '🔊',
                title: '按键音效',
                desc: '按下数字键盘时播放',
                key: 'soundKeypress'
            },
            {
                id: 'sound-feedback',
                icon: '✅',
                title: '答题反馈',
                desc: '答对/答错提示音',
                key: 'soundFeedback'
            },
            {
                id: 'speech-enabled',
                icon: '🗣️',
                title: '语音朗读',
                desc: '朗读题目和答案',
                key: 'speechEnabled'
            }
        ];

        settings.forEach((setting, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                padding: 12px 16px;
                ${index !== settings.length - 1 ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.06);' : ''}
            `;

            const isEnabled = this.getSetting(setting.key, true);

            item.innerHTML = `
                <div style="
                    width: 32px;
                    height: 32px;
                    background: rgba(0, 122, 255, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-size: 16px;
                ">${setting.icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 15px; font-weight: 600; color: #1C1C1E;">${setting.title}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 1px;">${setting.desc}</div>
                </div>
                <div class="toggle-switch ${isEnabled ? 'active' : ''}" data-key="${setting.key}" style="
                    width: 51px;
                    height: 31px;
                    background: ${isEnabled ? '#34C759' : '#E5E5EA'};
                    border-radius: 15.5px;
                    position: relative;
                    cursor: pointer;
                    transition: background 200ms ease;
                ">
                    <div style="
                        width: 27px;
                        height: 27px;
                        background: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 2px;
                        left: ${isEnabled ? '22px' : '2px'};
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                        transition: left 200ms ease;
                    "></div>
                </div>
            `;

            card.appendChild(item);
        });

        return card;
    },

    createDisplaySettings() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        // 获取当前显示设置
        const userData = Storage.getUserData();
        const displaySettings = userData.displaySettings || {};

        const settings = [
            {
                id: 'display-radar',
                icon: '📊',
                title: '能力雷达图',
                desc: '加减乘除能力分析',
                key: 'radarChart',
                defaultValue: false
            },
            {
                id: 'display-progress',
                icon: '📈',
                title: '进步曲线',
                desc: '最近7天正确率趋势',
                key: 'progressChart',
                defaultValue: true
            },
            {
                id: 'display-badges',
                icon: '🏆',
                title: '徽章展示',
                desc: '已获得的成就徽章',
                key: 'badgesSection',
                defaultValue: true
            },
            {
                id: 'display-review',
                icon: '🧠',
                title: '复习提醒',
                desc: '待复习错题提醒',
                key: 'reviewAlert',
                defaultValue: true
            },
            {
                id: 'display-tips',
                icon: '💡',
                title: '使用提示',
                desc: '使用帮助和提示',
                key: 'tipsSection',
                defaultValue: true
            },
            {
                id: 'display-welcome',
                icon: '👋',
                title: '欢迎区域',
                desc: '欢迎标题和描述',
                key: 'welcomeSection',
                defaultValue: true
            }
        ];

        settings.forEach((setting, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                padding: 12px 16px;
                ${index !== settings.length - 1 ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.06);' : ''}
            `;

            const isEnabled = displaySettings[setting.key] !== undefined
                ? displaySettings[setting.key]
                : setting.defaultValue;

            item.innerHTML = `
                <div style="
                    width: 32px;
                    height: 32px;
                    background: rgba(175, 82, 222, 0.1);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-size: 16px;
                ">${setting.icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 15px; font-weight: 600; color: #1C1C1E;">${setting.title}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 1px;">${setting.desc}</div>
                </div>
                <div class="toggle-switch display-toggle ${isEnabled ? 'active' : ''}" data-key="${setting.key}" style="
                    width: 51px;
                    height: 31px;
                    background: ${isEnabled ? '#34C759' : '#E5E5EA'};
                    border-radius: 15.5px;
                    position: relative;
                    cursor: pointer;
                    transition: background 200ms ease;
                ">
                    <div style="
                        width: 27px;
                        height: 27px;
                        background: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 2px;
                        left: ${isEnabled ? '22px' : '2px'};
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
                        transition: left 200ms ease;
                    "></div>
                </div>
            `;

            card.appendChild(item);
        });

        return card;
    },

    createDataManagement() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        const actions = [
            {
                id: 'export-data',
                icon: '📤',
                title: '导出数据',
                desc: '导出为 JSON 文件',
                color: '#007AFF',
                action: () => this.exportData()
            },
            {
                id: 'clear-data',
                icon: '🗑️',
                title: '清除数据',
                desc: '重置所有记录',
                color: '#FF3B30',
                action: () => this.showClearConfirm()
            }
        ];

        actions.forEach((action, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                align-items: center;
                padding: 12px 16px;
                cursor: pointer;
                transition: background 150ms ease;
                ${index !== actions.length - 1 ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.06);' : ''}
            `;

            item.innerHTML = `
                <div style="
                    width: 32px;
                    height: 32px;
                    background: ${action.color}15;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-size: 16px;
                ">${action.icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 15px; font-weight: 600; color: ${action.color};">${action.title}</div>
                    <div style="font-size: 12px; color: #8E8E93; margin-top: 1px;">${action.desc}</div>
                </div>
                <div style="color: #C7C7CC; font-size: 14px;">›</div>
            `;

            item.onclick = action.action;
            item.onmouseenter = () => item.style.background = 'rgba(0, 0, 0, 0.02)';
            item.onmouseleave = () => item.style.background = 'transparent';

            card.appendChild(item);
        });

        return card;
    },

    createAboutSection() {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.cssText = `
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        `;

        card.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    flex-shrink: 0;
                ">🧮</div>
                <div>
                    <div style="font-size: 17px; font-weight: 700; color: #1C1C1E; margin-bottom: 2px;">算术康复</div>
                    <div style="font-size: 13px; color: #8E8E93; margin-bottom: 4px;">版本 1.0.0</div>
                    <div style="font-size: 12px; color: #8E8E93; line-height: 1.5;">
                        专为命名性失语症患者设计的算术康复练习工具
                    </div>
                </div>
            </div>
        `;

        return card;
    },

    bindEvents() {
        // 音效/语音切换开关事件（使用 localStorage 存储）
        document.querySelectorAll('.toggle-switch:not(.display-toggle)').forEach(toggle => {
            toggle.onclick = () => {
                const key = toggle.dataset.key;
                const isActive = toggle.classList.contains('active');
                const newState = !isActive;

                // 更新样式
                toggle.classList.toggle('active', newState);
                toggle.style.background = newState ? '#34C759' : '#E5E5EA';
                toggle.querySelector('div').style.left = newState ? '22px' : '2px';

                // 保存设置
                this.setSetting(key, newState);

                // 应用设置
                if (key === 'soundKeypress' || key === 'soundFeedback') {
                    if (window.SoundManager) {
                        window.SoundManager.setEnabled(newState);
                    }
                } else if (key === 'speechEnabled') {
                    if (window.SpeechManager) {
                        window.SpeechManager.setEnabled(newState);
                    }
                }
            };
        });

        // 首页显示切换开关事件（使用 userData 存储）
        document.querySelectorAll('.display-toggle').forEach(toggle => {
            toggle.onclick = () => {
                const key = toggle.dataset.key;
                const isActive = toggle.classList.contains('active');
                const newState = !isActive;

                // 更新样式
                toggle.classList.toggle('active', newState);
                toggle.style.background = newState ? '#34C759' : '#E5E5EA';
                toggle.querySelector('div').style.left = newState ? '22px' : '2px';

                // 保存到用户数据
                const userData = Storage.getUserData();
                if (!userData.displaySettings) {
                    userData.displaySettings = {};
                }
                userData.displaySettings[key] = newState;
                Storage.saveUserData(userData);
            };
        });
    },

    getSetting(key, defaultValue = true) {
        try {
            const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');
            // 语音朗读默认开启
            if (key === 'speechEnabled' && settings[key] === undefined) {
                return true;
            }
            return settings[key] !== undefined ? settings[key] : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    setSetting(key, value) {
        try {
            const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');
            settings[key] = value;
            localStorage.setItem('aphasia_math_settings', JSON.stringify(settings));
        } catch (error) {
            console.error('保存设置失败:', error);
        }
    },

    exportData() {
        const userData = Storage.getUserData();
        const settings = JSON.parse(localStorage.getItem('aphasia_math_settings') || '{}');

        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0.0',
            userData,
            settings
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `aphasia-math-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('数据导出成功');
    },

    showClearConfirm() {
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

        modal.innerHTML = `
            <div class="glass" style="
                max-width: 360px;
                width: 100%;
                border-radius: 20px;
                padding: 24px;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: pageEnter 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <div style="
                    width: 56px;
                    height: 56px;
                    background: rgba(255, 59, 48, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                    font-size: 28px;
                ">⚠️</div>
                <div style="font-size: 18px; font-weight: 700; color: #1C1C1E; margin-bottom: 8px;">确认清除所有数据？</div>
                <div style="font-size: 15px; color: #8E8E93; margin-bottom: 24px; line-height: 1.5;">
                    此操作将删除所有练习记录、错题本和统计信息，且无法恢复。
                </div>
                <div style="display: flex; gap: 12px;">
                    <button id="cancel-clear" style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 10px;
                        border: none;
                        background: rgba(0, 0, 0, 0.06);
                        color: #007AFF;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">取消</button>
                    <button id="confirm-clear" style="
                        flex: 1;
                        padding: 12px;
                        border-radius: 10px;
                        border: none;
                        background: #FF3B30;
                        color: white;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                    ">清除</button>
                </div>
            </div>
        `;

        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        document.body.appendChild(modal);

        document.getElementById('cancel-clear').onclick = () => modal.remove();
        document.getElementById('confirm-clear').onclick = () => {
            Storage.clearAll();
            localStorage.removeItem('aphasia_math_settings');
            modal.remove();
            this.showToast('所有数据已清除');
            setTimeout(() => location.reload(), 1000);
        };
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 15px;
            font-weight: 500;
            z-index: 2000;
            animation: fadeInUp 300ms ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }
};
