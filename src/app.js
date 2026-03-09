/**
 * 主应用模块 - 路由管理
 * 命名性失语症算术康复练习工具
 */

const router = {
    /**
     * 当前页面
     */
    currentPage: 'home',

    /**
     * 路由表
     */
    routes: {
        'home': () => HomePage.init(),
        'practice-settings': () => PracticeSettingsPage.init(),
        'practice-keypad': () => PracticeKeypadPage.init(),
        'practice-choice': () => PracticeChoicePage.init(),
        'result': () => ResultPage.init(),
        'mistakes': () => MistakesPage.init(),
        'history': () => HistoryPage.init(),
        'settings': () => SettingsPage.init(),
        'basic-training': () => BasicTrainingPage.init(),
        'challenge': () => ChallengePage.init()
    },

    /**
     * 导航到指定页面
     * @param {string} page - 页面名称
     */
    navigate(page) {
        try {
            if (this.routes[page]) {
                this.currentPage = page;
                this.updateNavStyles();
                this.routes[page]();
            } else {
                console.error(`Page not found: ${page}`);
                this.navigate('home');
            }
        } catch (error) {
            console.error('页面导航错误:', error);
            const container = document.getElementById('page-container');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 40px; text-align: center; color: #FF3B30;">
                        <h2 style="margin-bottom: 16px;">页面加载出错</h2>
                        <p style="margin-bottom: 16px;">${error.message}</p>
                        <pre style="text-align: left; background: #f5f5f5; padding: 16px; border-radius: 8px; overflow: auto;">${error.stack}</pre>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #007AFF; color: white; border: none; border-radius: 8px; cursor: pointer;">刷新页面</button>
                    </div>
                `;
            }
        }
    },

    /**
     * 更新侧边栏导航样式
     */
    updateNavStyles() {
        const navHome = document.getElementById('nav-home');
        const navPractice = document.getElementById('nav-practice');
        const navBasic = document.getElementById('nav-basic');
        const navChallenge = document.getElementById('nav-challenge');
        const navMistakes = document.getElementById('nav-mistakes');
        const navHistory = document.getElementById('nav-history');
        const navSettings = document.getElementById('nav-settings');

        if (!navHome || !navPractice) return;

        // 重置样式
        const inactiveStyle = {
            background: 'transparent',
            color: '#3C3C43',
            boxShadow: 'none'
        };

        const activeStyle = {
            background: '#007AFF',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)'
        };

        // 先重置所有为inactive
        Object.assign(navHome.style, inactiveStyle);
        Object.assign(navPractice.style, inactiveStyle);
        if (navBasic) Object.assign(navBasic.style, inactiveStyle);
        if (navChallenge) Object.assign(navChallenge.style, inactiveStyle);
        if (navMistakes) Object.assign(navMistakes.style, inactiveStyle);
        if (navHistory) Object.assign(navHistory.style, inactiveStyle);
        if (navSettings) Object.assign(navSettings.style, inactiveStyle);

        // 根据当前页面设置样式
        if (this.currentPage === 'home') {
            Object.assign(navHome.style, activeStyle);
        } else if (['practice-settings', 'practice-keypad', 'practice-choice'].includes(this.currentPage)) {
            Object.assign(navPractice.style, activeStyle);
        } else if (this.currentPage === 'basic-training') {
            if (navBasic) Object.assign(navBasic.style, activeStyle);
        } else if (this.currentPage === 'challenge') {
            if (navChallenge) Object.assign(navChallenge.style, activeStyle);
        } else if (this.currentPage === 'mistakes') {
            if (navMistakes) Object.assign(navMistakes.style, activeStyle);
        } else if (this.currentPage === 'history') {
            if (navHistory) Object.assign(navHistory.style, activeStyle);
        } else if (this.currentPage === 'settings') {
            if (navSettings) Object.assign(navSettings.style, activeStyle);
        }
    },

    /**
     * 返回上一页
     */
    back() {
        history.back();
    }
};

/**
 * 应用初始化
 */
function initApp() {
    try {
        // 检查是否有用户数据，没有则初始化
        const userData = Storage.getUserData();
        console.log('用户数据已加载:', userData.name);

        // 加载音效设置
        if (window.SoundManager) {
            SoundManager.loadSettings();
        }

        // 加载首页
        router.navigate('home');
    } catch (error) {
        console.error('应用初始化错误:', error);
        document.getElementById('page-container').innerHTML = `
            <div style="padding: 40px; text-align: center; color: #FF3B30;">
                <h2 style="margin-bottom: 16px;">初始化出错</h2>
                <p style="margin-bottom: 16px;">${error.message}</p>
                <pre style="text-align: left; background: #f5f5f5; padding: 16px; border-radius: 8px; overflow: auto;">${error.stack}</pre>
            </div>
        `;
    }

    // 添加全局错误处理
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        console.error('Error: ' + msg);
        return false;
    };

    // 监听存储变化（多标签页同步）
    window.addEventListener('storage', (e) => {
        if (e.key === Storage.KEYS.USER_DATA) {
            console.log('用户数据已更新');
            // 如果当前在首页，刷新统计数据
            if (router.currentPage === 'home') {
                HomePage.init();
            }
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);
